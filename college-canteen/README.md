# 🍽️ College Canteen Management System

A full-stack MERN (MongoDB, Express, React, Node.js) web application for managing a college canteen.
Students can browse the menu, add items to cart, place orders, and track status.
Admins can manage food items, categories, orders, and view reports.

---

## 📋 Technology Stack

| Layer      | Technology                                          |
|------------|-----------------------------------------------------|
| Frontend   | React 18 + Vite, React Router v6, Tailwind CSS v3   |
| HTTP       | Axios                                               |
| Charts     | Recharts                                            |
| Backend    | Node.js + Express.js                                |
| Database   | MongoDB + Mongoose                                  |
| Auth       | JWT (httpOnly cookies) + bcryptjs                   |
| Uploads    | Multer                                              |

---

## 🗂️ Project Structure

```
college-canteen/
  client/   ← React + Vite frontend
  server/   ← Express + MongoDB backend
  README.md
  .gitignore
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18 or higher
- MongoDB installed locally **and running** (not just Compass)
- MongoDB Compass (for visual DB inspection, optional)

### 1. Clone / navigate to the project
```bash
cd d:\CAWEB\college-canteen
```

### 2. Start the Backend (Terminal 1)
```bash
cd server
npm run dev
```
Expected output:
```
✅  MongoDB connected: 127.0.0.1
📚  Database: college_canteen
==================================================
🍽️  College Canteen API running on port 5000
==================================================
```

### 3. Start the Frontend (Terminal 2)
```bash
cd client
npm run dev
```
Open **http://localhost:5173** in your browser.

### 4. Verify API is running
Open **http://localhost:5000/api/health** in your browser or Postman.
You should see:
```json
{
  "success": true,
  "message": "College Canteen API is running!"
}
```

---

## 🛢️ MongoDB Setup

### Option A: Local MongoDB (recommended for development)

1. **Install MongoDB Community Server**: https://www.mongodb.com/try/download/community
   - During install, choose "Install MongoDB as a Service" ✅
   - This makes MongoDB start automatically with Windows

2. **Verify MongoDB is running** (PowerShell):
   ```powershell
   Get-Service -Name MongoDB
   ```
   Status should be `Running`. If not:
   ```powershell
   Start-Service MongoDB
   ```

3. **Connect in MongoDB Compass**:
   - Open MongoDB Compass
   - Connection string: `mongodb://127.0.0.1:27017`
   - Click Connect
   - After running the seed script, you'll see the `college_canteen` database

### Option B: MongoDB Atlas (cloud)
1. Create a free account at https://cloud.mongodb.com
2. Create a cluster → Get the connection string
3. Replace `MONGO_URI` in `server/.env`:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/college_canteen
   ```
4. Whitelist your IP address in Atlas Network Access

---

## 🔐 Environment Variables

### server/.env
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/college_canteen
JWT_SECRET=your_very_long_random_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@canteen.com
ADMIN_PASSWORD=Admin@123456
```
> ⚠️ Never commit `.env` to Git! The `.gitignore` already excludes it.

### client/.env
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🌱 Seed Database

After Phase 3 is complete, run the seed script to populate:
- Categories (Snacks, Meals, Beverages, etc.)
- 12+ food items
- Admin user account

```bash
cd server
npm run seed
```

**Default Admin Login** (change after first login!):
- Email: `admin@canteen.com`
- Password: `Admin@123456`

---

## 🏗️ Build Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Architecture, setup, MongoDB connection | ✅ Done |
| 2 | Mongoose models, JWT auth, validation | ✅ Done |
| 3 | Food & category APIs, seed scripts | ✅ Done |
| 4 | Order APIs, inventory, status flow | ✅ Done |
| 5 | React routing, layouts, auth context | ✅ Done |
| 6 | Student pages: menu, cart, checkout | ✅ Done |
| 7 | Admin dashboard, reports, charts | ✅ Done |
| 8 | Final integration, testing, polish | ✅ Done |

---

## 🧪 Phase 1 Test Checklist

- [ ] `cd server && npm run dev` → shows "MongoDB connected" + "running on port 5000"
- [ ] `GET http://localhost:5000/api/health` → `{"success": true}`
- [ ] `cd client && npm run dev` → opens http://localhost:5173 with placeholder UI
- [ ] Browser shows "Phase 1 — Setup Complete ✓" badge
- [ ] Browser shows "Backend: College Canteen API is running!" badge
- [ ] MongoDB Compass connected to `mongodb://127.0.0.1:27017`

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `server/server.js` | Entry point — loads env, connects DB, starts HTTP server |
| `server/app.js` | Express config — middleware, routes |
| `server/config/db.js` | MongoDB connection |
| `server/middleware/auth.js` | JWT protect + restrictTo middleware |
| `server/middleware/errorHandler.js` | Global error handler |
| `client/src/App.jsx` | React root with providers |
| `client/src/context/AuthContext.jsx` | Login state management |
| `client/src/context/CartContext.jsx` | Cart state with localStorage |
| `client/src/services/api.js` | Axios instance with interceptors |
| `client/tailwind.config.js` | Custom color palette & typography |

---

## 🔒 Security Notes

- Passwords are hashed with **bcryptjs** (12 salt rounds) — never stored in plain text
- JWT is stored in an **httpOnly cookie** — inaccessible to JavaScript, protects against XSS
- Admin role can **only** be set via the seed script — not through registration or profile updates
- Server **recalculates all order totals** — frontend prices are never trusted
- Rate limiting on auth endpoints — 20 requests per 15 minutes per IP
- MongoDB operators are sanitized — protects against NoSQL injection

---

## 👨‍💻 Development

```bash
# Install everything from scratch
cd server && npm install
cd ../client && npm install

# Run seed (after Phase 3)
cd server && npm run seed

# Start backend (keep this terminal open)
cd server && npm run dev

# Start frontend (new terminal)
cd client && npm run dev
```
