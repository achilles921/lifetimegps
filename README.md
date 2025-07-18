# LifetimeGPS

A career guidance and assessment platform with interactive quizzes, mini-games, and personalized user experiences.

## 📁 Project Structure

```
LifetimeGPS/
├── backend/           # Express.js API Server (Port 5000)
│   ├── package.json  # Backend dependencies
│   ├── server/       # Server source code
│   ├── routes/       # API route handlers
│   ├── services/     # Business logic
│   ├── middlewares/  # Express middlewares
│   └── utils/        # Utility functions
└── frontend/         # React Application (Port 3000)
    ├── package.json  # Frontend dependencies
    ├── vite.config.ts # Vite configuration
    ├── index.html    # HTML entry point
    ├── src/          # React source code
    └── public/       # Static assets
```

## 🚀 Step-by-Step Setup Guide

### Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL** database
- **Git**

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd GPS
```

### Step 2: Set Up Backend

#### 2.1 Install Backend Dependencies
```bash
cd backend
npm install
```

#### 2.2 Configure Environment Variables
Create a `.env` file in the `backend/` directory:
```bash
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/GPS

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

```

#### 2.3 Start Backend Development Server
```bash
npm run dev
```
The backend will start on **http://localhost:5000**

### Step 3: Set Up Frontend

#### 3.1 Install Frontend Dependencies
```bash
cd ../frontend
npm install
```


#### 3.2 Start Frontend Development Server
```bash
npm run dev
```
The frontend will start on **http://localhost:3000**

## 🔧 Development Commands

### Backend Commands
```bash
cd backend

# Development
npm run dev              # Start with hot-reload
npm run build            # Build for production
npm run start            # Start production server
npm run check            # TypeScript check

```

### Frontend Commands
```bash
cd frontend

# Development
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run check            # TypeScript check
```

## 🌐 Access Points

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| **Frontend** | 3000 | http://localhost:3000 | React development server |
| **Backend API** | 5000 | http://localhost:5000/api | Express.js API server |

## 📁 Key Features

### Frontend Features
- **Career Assessment**: Interactive quizzes and assessments
- **Mini-Games**: Educational games for skill development
- **Voice Integration**: Speech recognition and text-to-speech
- **User Dashboard**: Personalized progress tracking
- **Responsive Design**: Mobile-first approach

### Backend Features
- **RESTful API**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based with Passport.js
- **Real-time**: WebSocket support for live features
- **Caching**: Optimized caching system

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Radix UI** for components
- **Wouter** for routing
- **React Query** for data fetching

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** with Drizzle ORM
- **Passport.js** for authentication
- **WebSocket** for real-time features
- **Redis** (optional) for session storage

## 🔄 Development Workflow

### 1. Making Changes
- **Frontend changes**: Hot-reloaded automatically by Vite
- **Backend changes**: Server restarts automatically with tsx

### 2. Testing
```bash
# Backend testing
cd backend && npm run check

# Frontend testing
cd frontend && npm run check
```

### 3. Production Deployment
```bash
# Build backend
cd backend && npm run build

# Build frontend
cd frontend && npm run build
```

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Check PostgreSQL is running
- Verify DATABASE_URL in backend/.env
- Ensure port 5000 is available

**Frontend won't connect to backend:**
- Verify backend is running on port 5000
- Check CORS configuration in backend
- Ensure VITE_API_URL is set correctly

**Database connection issues:**
- Verify PostgreSQL is running
- Check DATABASE_URL format

### Development Tips

1. **Use separate terminals** for frontend and backend during development
2. **Check browser console** for frontend errors
3. **Check terminal** for backend errors
4. **Use browser dev tools** for API debugging

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/logout` - User logout

### Quiz Endpoints
- `GET /api/quiz-progress` - Get quiz progress
- `POST /api/save-interests` - Save user interests

### Voice Endpoints
- `POST /api/voice/speech` - Text-to-speech

### Mini-Games Endpoints
- `GET /api/mini-games` - Get available games
- `POST /api/mini-games/results` - Save game results

## 🚀 Quick Start Script

For a quick setup, you can run these commands in sequence:

```bash
# Backend setup
cd backend
npm install
# Create .env file with your database credentials
npm run dev

# In a new terminal - Frontend setup
cd ../frontend
npm install
npm run dev
```
