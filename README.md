# MoldCraft — Full Stack MERN Website

[![Vercel](https://img.shields.io/badge/Frontend-Vercel-000?logo=vercel)](https://mold-craft-kim.vercel.app)
[![Railway](https://img.shields.io/badge/Backend-Railway-0B0D0E?logo=railway)](https://moldcraft-api-production.up.railway.app)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?logo=mongodb)](https://www.mongodb.com/atlas)
[![Status](https://img.shields.io/badge/Status-Live-success)]()

Custom mini plastic injection molding business website built with MongoDB, Express, React, and Node.js.

**Live Demo:** [https://mold-craft-kim.vercel.app](https://mold-craft-kim.vercel.app)

---

## 🗂 Project Structure

```
moldcraft/
├── client/          # React + Vite frontend
│   └── src/
│       ├── components/   # Navbar, Footer
│       ├── pages/        # All public pages
│       │   └── admin/    # Admin pages (protected)
│       ├── context/      # Auth context
│       ├── api/          # Axios API helpers
│       └── hooks/        # Custom hooks
├── server/          # Node.js + Express backend
│   └── src/
│       ├── routes/       # API routes
│       ├── models/       # Mongoose models
│       ├── middleware/   # Auth, upload
│       └── utils/        # Email helper
├── package.json     # Root (monorepo scripts)
└── README.md
```

---

## ⚡ Quick Start (Local Development)

### 1. Prerequisites
- Node.js v18+
- npm v9+
- A MongoDB Atlas account (free): https://www.mongodb.com/atlas
- A Cloudinary account (free): https://cloudinary.com
- A Gmail account with App Password enabled

### 2. Clone the repo
```bash
git clone https://github.com/yourusername/moldcraft.git
cd moldcraft
```

### 3. Install all dependencies
```bash
npm run install:all
```

### 4. Set up environment variables
```bash
cd server
cp .env.example .env
```

Open `server/.env` and fill in:
- `MONGODB_URI` — your Atlas connection string
- `JWT_SECRET` — any long random string (e.g. `openssl rand -hex 64`)
- `CLOUDINARY_*` — from your Cloudinary dashboard
- `EMAIL_*` — your Gmail + App Password
- `ADMIN_EMAIL` — the email that receives notifications

### 5. Run the development servers
```bash
# From root directory
npm run dev
```

This starts:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

---

## 🔐 Create Your First Admin Account

**Once the server is running**, call this once to create the admin user:

```bash
curl -X POST http://localhost:5000/api/auth/seed-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@moldcraft.com","password":"yourpassword"}'
```

Then log in at: http://localhost:5173/admin/login

> ⚠️ **Remove the `/seed-admin` route before deploying to production!**
> In `server/src/routes/auth.js`, delete the `router.post('/seed-admin', ...)` block.

---

## 🌐 Pages Overview

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Hero, stats, services preview, process, CTA |
| Services | `/services` | Detailed service offerings + pricing notes |
| Gallery | `/gallery` | Filterable photo grid of completed parts |
| Quote | `/quote` | 3-step quote request form (with file upload) |
| Materials | `/materials` | Interactive material comparison guide |
| About | `/about` | Company story, equipment, team, process |
| Blog | `/blog` | Articles and resources listing |
| Blog Post | `/blog/:slug` | Single article page |
| Contact | `/contact` | Contact form + business info |
| Admin Login | `/admin/login` | Staff login (JWT auth) |
| Admin Dashboard | `/admin` | Overview + quick stats |
| Admin Quotes | `/admin/quotes` | Manage quote requests |
| Admin Gallery | `/admin/gallery` | Upload/manage gallery items |
| Admin Blog | `/admin/blog` | Create/edit/publish blog posts |

---

## 🛠 API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/quotes` | Submit quote request |
| GET | `/api/gallery` | List published gallery items |
| GET | `/api/blog` | List published posts |
| GET | `/api/blog/:slug` | Get single post (+ increments views) |
| GET | `/api/materials` | Get all materials |
| POST | `/api/contact` | Send contact message |
| GET | `/api/health` | Health check |

### Protected (Admin only — requires Bearer token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login → returns JWT |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/quotes` | List all quotes (with filters) |
| PATCH | `/api/quotes/:id` | Update quote status/price/notes |
| DELETE | `/api/quotes/:id` | Delete a quote |
| POST | `/api/gallery` | Add gallery item |
| PATCH | `/api/gallery/:id` | Update gallery item |
| DELETE | `/api/gallery/:id` | Delete gallery item |
| POST | `/api/blog` | Create blog post |
| PATCH | `/api/blog/:id` | Update blog post |
| DELETE | `/api/blog/:id` | Delete blog post |

---

## 🚀 Deployment (Live)

### Frontend — Vercel
**URL:** [https://mold-craft-kim.vercel.app](https://mold-craft-kim.vercel.app)
- Root directory: `client/`
- Build command: `npm run build`
- Output directory: `dist`
- Env var: `VITE_API_URL` = `https://moldcraft-api-production.up.railway.app`

### Backend — Railway
**URL:** [https://moldcraft-api-production.up.railway.app](https://moldcraft-api-production.up.railway.app)
- Root directory: `server/`
- Start command: `npm start`
- Health check: [https://moldcraft-api-production.up.railway.app/api/health](https://moldcraft-api-production.up.railway.app/api/health)

### Environment Variables (Railway)
| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | (set in production) |
| `CLOUDINARY_CLOUD_NAME` | `dxvvpresa` |
| `CLOUDINARY_API_KEY` | (set in production) |
| `CLOUDINARY_API_SECRET` | (set in production) |
| `EMAIL_USER` | `kimsabu36@gmail.com` |
| `EMAIL_PASS` | (Gmail App Password) |
| `EMAIL_FROM` | `MoldCraft <kimsabu36@gmail.com>` |
| `ADMIN_EMAIL` | `kimsabu36@gmail.com` |
| `CLIENT_URL` | `https://mold-craft-kim.vercel.app` |

---

## 🎨 Customization Checklist

- [ ] Update company name (replace "MoldCraft" globally)
- [ ] Update contact info in `Footer.jsx` and `Contact.jsx`
- [ ] Replace placeholder team names in `About.jsx`
- [ ] Add real photos to the Gallery via Admin
- [ ] Update social media links in `Footer.jsx` and `Contact.jsx`
- [ ] Write first Blog posts via Admin
- [ ] Update business hours in `Contact.jsx`
- [ ] Add Google Maps embed in `Contact.jsx`
- [ ] Replace placeholder stats in `Home.jsx`
- [x] Set up Vercel project (`mold-craft-kim.vercel.app`)
- [x] Google Analytics configured (G-HKGPGBGBKP)
- [x] SEO meta tags, Open Graph, JSON-LD
- [x] Sitemap & robots.txt
- [ ] Replace placeholder OG image (`public/og-image.png`)

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Forms | React Hook Form |
| Data fetching | TanStack Query (React Query) |
| File upload | React Dropzone |
| HTTP client | Axios |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| File storage | Cloudinary |
| Email | Nodemailer (Gmail SMTP) |
| Hosting (FE) | Vercel |
| Hosting (BE) | Railway |

---

## 👥 Team

Built by [Min-joona](https://github.com/Min-joona) — MoldCraft founding team.

---

## 📄 License

Private. All rights reserved.
