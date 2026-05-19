import requests
import unicodedata
from bs4 import BeautifulSoup
import time
import re
from concurrent.futures import ThreadPoolExecutor, as_completed

# ── Config ────────────────────────────────────────────────────
OHARA_URL = "https://your-ohara-site.vercel.app/api/ingest"
SCRAPER_API_KEY = "your-scraper-api-key"
CHAPTERS_PER_BATCH = 200  # Send chapters to API in batches

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
}

# ── Text cleaning ─────────────────────────────────────────────
def normalize(text):
    return unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii').lower()

def clean_text(text):
    lines = [line.strip() for line in text.splitlines()]
    lines = [l for l in lines if 'freewebnovel' not in normalize(l)]
    lines = [l for l in lines if 'webnovel' not in normalize(l)]
    lines = [l for l in lines if not (len(l) < 30 and '.com' in normalize(l))]

    merged = []
    for line in lines:
        if not line:
            merged.append('')
            continue
        if merged and merged[-1] and not merged[-1].endswith(('.', '!', '?', ':', '"', "'")) and line[0].islower():
            merged[-1] += ' ' + line
        else:
            merged.append(line)

    result = []
    prev_blank = False
    for line in merged:
        if not line:
            if not prev_blank:
                result.append('')
            prev_blank = True
        else:
            result.append(line)
            prev_blank = False

    return '\n\n'.join([l for l in result if l])

# ── Scraping ──────────────────────────────────────────────────
def get_novel_meta(novel_url):
    res = requests.get(novel_url, headers=HEADERS)
    soup = BeautifulSoup(res.text, 'html.parser')

    # Total chapters
    total = 0
    meta = soup.find('meta', property='og:novel:lastest_chapter_url')
    if meta:
        url = meta.get('content', '')
        match = re.search(r'chapter-(\d+)', url)
        if match:
            total = int(match.group(1))

    # Cover image
    cover = ''
    cover_meta = soup.find('meta', property='og:image')
    if cover_meta:
        cover = cover_meta.get('content', '')

    # Description
    desc = ''
    desc_tag = soup.select_one('.inner > p, .description, [itemprop="description"]')
    if desc_tag:
        desc = desc_tag.get_text(strip=True)

    # Author
    author = ''
    author_tag = soup.select_one('[itemprop="author"], .author')
    if author_tag:
        author = author_tag.get_text(strip=True)

    # Genres
    genres = [a.get_text(strip=True) for a in soup.select('a[href*="/genre/"]')][:4]

    # Status
    status_tag = soup.select_one('.completed, .ongoing')
    status = 'completed' if status_tag and 'complete' in status_tag.get_text().lower() else 'ongoing'

    return {
        'cover': cover,
        'description': desc,
        'author': author,
        'genres': genres,
        'status': status,
        'totalChapters': total,
    }

def scrape_chapter(args):
    i, url = args
    try:
        res = requests.get(url, headers=HEADERS)
        time.sleep(0.5)
        soup = BeautifulSoup(res.text, 'html.parser')
        title = soup.select_one('h2')
        title_text = title.get_text(strip=True) if title else f'Chapter {i}'
        content_div = soup.select_one('div.txt')
        if not content_div:
            return i, title_text, ''
        for tag in content_div.select('script, style, ins, iframe, h1, h2, h3'):
            tag.decompose()
        text = content_div.get_text(separator='\n')
        return i, title_text, clean_text(text)
    except Exception as e:
        print(f"  Error on chapter {i}: {e}")
        return i, f'Chapter {i}', ''

def post_to_ohara(novel_data, chapters):
    payload = {
        'apiKey': SCRAPER_API_KEY,
        'novel': novel_data,
        'chapters': chapters,
    }
    res = requests.post(OHARA_URL, json=payload, timeout=120)
    return res.json()

def scrape_novel(novel_url):
    slug = novel_url.rstrip('/').split('/')[-1]
    novel_name = slug.replace('-', ' ').title()

    print(f"\nScraping: {novel_name}")
    meta = get_novel_meta(novel_url)
    total = meta['totalChapters']

    if not total:
        print("Could not determine chapter count.")
        return

    print(f"Found {total} chapters.")

    novel_data = {
        'title': novel_name,
        'slug': slug,
        'author': meta['author'],
        'cover': meta['cover'],
        'description': meta['description'],
        'genres': meta['genres'],
        'status': meta['status'],
        'language': 'english',
        'totalChapters': total,
    }

    # Scrape and post in batches
    for batch_start in range(1, total + 1, CHAPTERS_PER_BATCH):
        batch_end = min(batch_start + CHAPTERS_PER_BATCH - 1, total)
        print(f"Batch: chapters {batch_start}-{batch_end}")

        tasks = [(i, f"{novel_url}/chapter-{i}") for i in range(batch_start, batch_end + 1)]
        results = {}

        with ThreadPoolExecutor(max_workers=2) as executor:
            futures = {executor.submit(scrape_chapter, task): task for task in tasks}
            for future in as_completed(futures):
                i, title, content = future.result()
                results[i] = (title, content)
                print(f"  Chapter {i}/{total}")

        chapters = []
        for i in range(batch_start, batch_end + 1):
            title, content = results.get(i, (f'Chapter {i}', ''))
            if content:
                chapters.append({
                    'chapterNumber': i,
                    'title': title,
                    'content': content,
                })

        # Update latest chapter info
        if chapters:
            novel_data['latestChapter'] = chapters[-1]['chapterNumber']
            novel_data['latestChapterTitle'] = chapters[-1]['title']

        print(f"  Posting {len(chapters)} chapters to OHARA...")
        result = post_to_ohara(novel_data, chapters)
        print(f"  Result: {result}")
        time.sleep(2)

    print(f"\nDone: {novel_name}")

# ── Novels to scrape ──────────────────────────────────────────
NOVELS = [
    "https://freewebnovel.com/novel/shadow-slave",
    # "https://freewebnovel.com/novel/mother-of-learning",
]

if __name__ == "__main__":
    for url in NOVELS:
        scrape_novel(url)
        time.sleep(5)
