# Ziona

Ziona is a Christian-focused short-video social media platform inspired by TikTok. It is designed as a safe, faith-centered space where Christians can share short videos, sermons, worship moments, testimonies, and uplifting content.

---

## ✨ Vision

To create a Christ-centered digital community that encourages faith, creativity, and positive engagement through short-form video.

---

## 🚀 Core Features

### 1. Authentication

* Email & password signup/login
* Optional social login (Google / Apple)
* User profile creation

### 2. User Profiles

* Profile photo
* Bio & scripture/quote
* Followers / following
* Video grid (user uploads)

### 3. Video Feed (TikTok-style)

* Vertical swipe feed
* Auto-play videos
* Like, comment, share
* Save videos

### 4. Video Upload

* Record or upload video
* Caption + hashtags
* Optional scripture reference
* Background music (later phase)

### 5. Engagement

* Likes
* Comments
* Shares
* Follow / unfollow

### 6. Moderation (Very Important)

* Content reporting
* Admin review dashboard
* Community guidelines enforcement

---

## 🧱 Tech Stack (Suggested)

### Frontend (Mobile App)

* **React Native (Expo)**
* TypeScript
* React Navigation
* Zustand / Redux
* React Native Reanimated

### Backend

* Node.js + Express / NestJS
* REST or GraphQL API

### Database

* PostgreSQL or MongoDB

### Storage

* AWS S3 / Firebase Storage (videos)

### Authentication

* Firebase Auth / Auth0 / Custom JWT

### Video Processing

* FFmpeg (compression & thumbnails)

---

## 📁 Suggested Project Structure

### Mobile App (React Native)

```
ziona-app/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/
│   │   ├── feed.tsx
│   │   ├── upload.tsx
│   │   └── profile.tsx
│   └── _layout.tsx
│
├── components/
│   ├── VideoPlayer.tsx
│   ├── VideoActions.tsx
│   └── UserAvatar.tsx
│
├── store/
│   ├── authStore.ts
│   └── videoStore.ts
│
├── services/
│   ├── api.ts
│   ├── auth.service.ts
│   └── video.service.ts
│
├── utils/
│   ├── constants.ts
│   └── helpers.ts
│
├── assets/
│   └── images/
│
├── types/
│   └── index.ts
│
└── app.json
```

---

## 🔐 Environment Variables

Create a `.env` file:

```
API_URL=https://api.ziona.app
STORAGE_BUCKET=ziona-videos
```

---

## 🧪 Development Setup

```bash
npm install
npx expo start
```

---

## 📜 Community Guidelines

Ziona is built on Christian values. Content must:

* Be respectful and uplifting
* Avoid hate, harassment, and explicit material
* Align with Christian principles

Violations may result in content removal or account suspension.

---

## 🛣️ Roadmap

* [ ] Live streaming
* [ ] Duets / Replies
* [ ] Audio library
* [ ] Church & ministry accounts
* [ ] Monetization for creators

---

## 🙏 Acknowledgements

Built with faith, purpose, and love.

> "So whether you eat or drink or whatever you do, do it all for the glory of God." – 1 Corinthians 10:31
