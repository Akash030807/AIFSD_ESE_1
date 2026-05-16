# 🎯 TalentMatch AI — Candidate Profile Shortlisting System

A full-stack AI-powered candidate shortlisting system built with **Node.js**, **React**, **MongoDB**, and **OpenRouter AI**.

## 🚀 Features
- Add & manage candidate profiles (skills, experience, bio)
- Smart skill-based matching with percentage scores
- High / Medium / Low tier classification
- 🤖 AI-powered ranking via OpenRouter (Llama 3.3)
- AI-generated interview questions & explanations
- Match score bar chart visualization
- Real-time search & filter

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/candidates` | Add a candidate |
| GET | `/api/candidates` | Get all candidates |
| POST | `/api/match` | Basic skill matching |
| POST | `/api/ai/shortlist` | AI-powered shortlisting |

## 🛠 Tech Stack

**Backend:** Node.js · Express · MongoDB (Mongoose) · OpenRouter AI  
**Frontend:** React (Vite) · React Router · Chart.js · Lucide Icons

## ⚙️ Setup

### Backend
```bash
cd backend
npm install
# Create .env from .env.example and fill in your values
npm start
```

### Frontend
```bash
cd frontend
npm install
# Create .env from .env.example and set VITE_API_URL
npm run dev
```

## 🌐 Deployment
- **Backend:** Render Web Service — `node server.js`
- **Frontend:** Render Static Site — `npm run build` → `dist/`

## 🔑 Environment Variables

### Backend `.env`
```
MONGO_URI=your_mongodb_atlas_uri
OPENROUTER_API_KEY=your_openrouter_key
PORT=5000
```

### Frontend `.env`
```
VITE_API_URL=https://your-backend.onrender.com
```
