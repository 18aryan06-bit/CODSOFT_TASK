# Quizly — Full-stack Quiz Web Application

MERN app with Vite + React, Tailwind CSS, React Router, Lucide icons, Axios, Express, MongoDB/Mongoose, JWT, and bcryptjs.

## Requirements
- Node.js 18 or newer
- MongoDB running locally, or a MongoDB Atlas database

## 1. Configure backend
```bash
cd backend
npm install
```
Copy `backend/.env.example` to `backend/.env`, then set `MONGODB_URI` and a random `JWT_SECRET` of at least 32 characters. Do not commit `.env`.

## 2. Configure frontend
In another terminal:
```bash
cd frontend
npm install
```
Copy `frontend/.env.example` to `frontend/.env` if you need a custom API URL. Default API is `http://localhost:5000/api`.

## 3. Start the app
Terminal 1:
```bash
cd backend
npm run dev
```
Terminal 2:
```bash
cd frontend
npm run dev
```
Open the Vite URL shown in the terminal (normally http://localhost:5173).

## Features
- Register/login with bcrypt password hashing and JWT bearer auth
- Protected quiz creation
- Public searchable, paginated quiz list
- Dynamic question builder (four options per question)
- Quiz-taking UI with saved answers and navigation
- Server-side score calculation and result breakdown

## API
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/quizzes?search=&page=1&limit=12`
- `GET /api/quizzes/:id`
- `POST /api/quizzes` (JWT required)
- `POST /api/quizzes/:id/submit` (JWT required)
- `GET /api/health`

## Important production notes
This is a runnable full-stack starter, not a guarantee of production readiness. It stores bearer JWTs in localStorage per the requested design; this increases the impact of XSS. For deployment, consider HttpOnly Secure cookies with CSRF defenses, HTTPS, a frontend Content Security Policy, automated tests, monitoring, backups, and reviewing rate limits/CORS. Quiz attempts are calculated and returned but are not persisted as historical records.

## Theme
The frontend uses the **Charcoal & Orange** color palette: charcoal backgrounds (`#18181B` / `#27272A`), orange primary actions (`#F97316`), and warm white text (`#FAFAFA`). The theme styles are in `frontend/src/index.css` and the Tailwind brand palette is in `frontend/tailwind.config.js`.
