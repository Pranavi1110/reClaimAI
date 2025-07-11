<<<<<<< HEAD

# Reverse Logistics Platform (MERN + AI/ML)

A full-stack platform for managing returned products with AI-powered decision making and circular marketplace.

## Features

- Return Initiation Form with image upload
- AI Image Classifier (damaged, repairable, good)
- Smart Decision Engine (NLP-based routing)
- Partner Dashboard (NGOs, Repair Shops, Recyclers)
- Gamification: GreenPoints, Leaderboard, Certificates
- Admin Dashboard: Analytics, CO₂ saved, waste diverted
- Circular Marketplace for refurbished/donated items
- Auth (JWT), Role-based dashboards, Responsive UI

## Tech Stack

- **Frontend:** React (Vite), Tailwind/Bootstrap
- **Backend:** Node.js, Express, MongoDB Atlas
- **AI/ML:** Flask (PyTorch/TensorFlow, Transformers)
- **Deployment:** Vercel (frontend), Render/Railway (backend/ML)

## File Structure

- `client/` - React frontend
- `server/` - Express backend
- `server/ml/` - Flask AI/ML services
- `server/models/`, `server/routes/`, `server/controllers/`, `server/utils/`

## Team Division

- **Person A:** Return Form, image classifier, MongoDB store
- **Person B:** Smart Decision Engine, NLP, routing
- **Person C:** Partner dashboard, gamification, leaderboard
- **Person D:** Admin dashboard, marketplace, deployment

## Setup

1. `cd client && npm install && npm run dev` (frontend)
2. `cd server && npm install && node index.js` (backend)
3. `cd server/ml && python image_classifier.py` (image ML API)
4. `cd server/ml && python nlp_classifier.py` (NLP ML API)

## Demo Script

- Initiate a return (/return)
- Upload image, get AI prediction
- Enter reason, get smart routing
- Partner/admin dashboards
- Marketplace claim/payment

## .env.example

# See `server/.env.example` for required environment variables.

# reLoopAI

> > > > > > > 2cc0bcf03b57a30e553c936c21a344c2f9767745
