# 🌳 OHARA - Read Novels Online

A web novel reading platform styled after freewebnovel.com. Content is fed automatically via scraper.

## Tech Stack
- Next.js 15 (App Router)
- Firebase Firestore (database)
- Firebase Admin SDK (server-side)
- Tailwind CSS
- Vercel (hosting)

## Setup

### 1. Create Firebase Project
- Go to console.firebase.google.com
- Create new project
- Enable Firestore Database
- Go to Project Settings → Service Accounts → Generate new private key
- Copy the values into .env.local

### 2. Firestore Indexes needed
Create these composite indexes in Firebase Console:
- novels: status ASC + updatedAt DESC
- novels: genres array-contains + updatedAt DESC  
- chapters: novelId ASC + chapterNumber ASC

### 3. Environment Variables
Copy .env.local.example to .env.local and fill in all values.

### 4. Install & Run
```bash
npm install
npm run dev
```

### 5. Deploy to Vercel
```bash
npx vercel
```
Add all env vars in Vercel dashboard.

## Scraper Setup

Edit scraper.py:
1. Set OHARA_URL to your deployed site URL + /api/ingest
2. Set SCRAPER_API_KEY to match your env var
3. Add novel URLs to NOVELS list
4. Run: python3 scraper.py

The scraper posts directly to your site's API — no epub files needed.

## Admin Panel
Visit /admin on your site. Password is set via NEXT_PUBLIC_ADMIN_PASSWORD env var.
