# UserSphere

A full-stack MERN application for user management with JWT authentication, role-based access control, and interactive dashboards.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, React Router, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |

---

## Features

- User CRUD operations (Create, Read, Update, Delete)
- JWT authentication with login/signup
- Role-based access (Admin can delete users)
- Interactive dashboard with statistics
- Graphical data visualization (charts)
- City-wise user analytics
- Search and filter functionality
- Pagination
- Dark/Light theme toggle
- Responsive design

---

## Project Structure

```
users-crud/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layout/
│   │   ├── context/
│   │   └── services/
│   └── package.json
│
├── backend/           # Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── app.js
│   └── package.json
│
└── README.md
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

**Backend** (`backend/.env`):
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/usersphere
JWT_SECRET=your-secret-key
FRONTEND_ORIGIN=http://localhost:5173
```

**Frontend** (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 3. Run

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

---

## API Overview

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register admin | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/me` | Get current user | Yes |
| GET | `/api/users` | Get all users | Yes |
| POST | `/api/users` | Create user | Yes |
| PATCH | `/api/users/:id` | Update user | Yes |
| DELETE | `/api/users/:id` | Delete user | Admin |
| GET | `/api/users/stats` | City statistics | No |
| GET | `/api/users/general-stats` | General stats | No |

See [`backend/API.md`](./backend/API.md) for full API documentation.

---

## Screenshots

### Dashboard
- Statistics cards showing total users, cities, active users
- Recent users table with actions
- City-wise user distribution

### Features
- Dark/Light theme toggle
- Responsive sidebar navigation
- Search with filters (name, age, status)
- Pagination controls

---

## Scripts

### Backend

```bash
npm start      # Production
npm run dev    # Development with watch
```

### Frontend

```bash
npm run dev    # Development server
npm run build  # Production build
npm run preview # Preview build
```

---

## License

MIT

---

Built with MERN Stack
