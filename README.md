# 2048 MERN Stack Implementation

A modern, full-stack implementation of the classic 2048 game using MongoDB, Express, React, and Node.js.

## Features
- **Background Music**: Curated Lofi/Ambient streams for focus (Music For Programming).
- **AI Auto-Player**: Heuristic-based AI agent that plays the game for you.
- **Leaderboards**: Global score tracking via MongoDB.
- **Responsive UI**: Optimized for desktop and mobile.

## 🚀 Quick Start (Docker)
The easiest way to run the application is using Docker Compose.

1. **Prerequisites**: Install [Docker Desktop](https://www.docker.com/products/docker-desktop/).
2. **Run**:
   ```bash
   docker-compose up --build
   ```
3. **Open**: 
   - Game: [http://localhost:8080](http://localhost:8080)
   - API: [http://localhost:3000](http://localhost:3000)

## 🛠 Manual Setup (Development)

### Backend
```bash
cd api
npm install
npm run start
```

### Frontend
```bash
# In the root directory
npm install
npm run dev
```

## Production Optimization
- **Code Splitting**: Routes are lazy-loaded to reduce initial load time.
- **Gzip**: Nginx is configured to serve compressed assets.
