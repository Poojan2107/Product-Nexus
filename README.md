# ProductNexus 🚀

**The Commander's Console for Inventory Management**

![ProductNexus Banner](https://via.placeholder.com/1200x400/000000/ffffff?text=ProductNexus+Command+Center)

> A futuristic, terminal-inspired full-stack application built with the MERN stack. ProductNexus combines raw power with a "Techy Black & White" aesthetic, featuring a global command terminal, holographic analytics, and fluid animations.

[![Vercel App](https://therealsujitk-vercel-badge.vercel.app/?app=product-nexus-poojan)](https://product-nexus-poojan.vercel.app/)
[![Render Status](https://img.shields.io/badge/Backend-Render-black?style=flat&logo=render)](https://product-nexus.onrender.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-white.svg)](https://opensource.org/licenses/MIT)

---

## 🔗 Live Deployment

- **Frontend (Vercel):** [https://product-nexus-poojan.vercel.app/](https://product-nexus-poojan.vercel.app/)
- **Backend (Render):** [https://product-nexus.onrender.com](https://product-nexus.onrender.com)

---

## 🌟 Key Features

### 🖥️ The Command Center Experience
- **Global Command Terminal (CLI)**: Press `Ctrl+K` anywhere to open a fully functional terminal. Navigate pages, export reports, or search products using keyboard commands.
- **Monochrome Aesthetic**: A strict "Techy Black & White" design system with holographic opacity layers for a premium, sci-fi feel.
- **Fluid Animations**: Powered by **Framer Motion**, the interface features staggered entry animations, smooth layout transitions, and spring physics.

### 📊 Advanced Analytics
- **Holographic Charts**: Real-time visualization of inventory distribution and value using custom Chart.js configurations.
- **Live Data**: Instant updates on total asset value, category breakdowns, and price trends.

### 🛠️ Powerful Management
- **Smart Inventory**: Create, Edit, and Delete products with optimistic UI updates (instant feedback).
- **Cloud Storage**: Integrated **Cloudinary** support for drag-and-drop image uploads.
- **PDF Reporting**: One-click generation of professional inventory reports using `jspdf`.
- **Secure Auth**: Robust JWT-based authentication with protected routes and persistent sessions.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **State Management**: Redux Toolkit
- **Styling**: Vanilla CSS (Custom Variables), Framer Motion
- **Visualization**: Chart.js, React-Chartjs-2
- **Utilities**: React Router DOM, Axios, React Dropzone

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Storage**: Cloudinary (Multer)
- **Security**: JWT, Bcrypt, CORS, Helmet

### DevOps
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render
- **Version Control**: Git & GitHub

---

## 📸 Screenshots

| Dashboard | Command Terminal |
|-----------|------------------|
| ![Dashboard](https://via.placeholder.com/400x300/111111/ffffff?text=Dashboard) | ![Terminal](https://via.placeholder.com/400x300/111111/ffffff?text=CLI+Terminal) |

| Product List | Add Product |
|--------------|-------------|
| ![List](https://via.placeholder.com/400x300/111111/ffffff?text=Product+List) | ![Add](https://via.placeholder.com/400x300/111111/ffffff?text=Add+Product) |

---

## 🚀 Local Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Poojan2107/Product-Nexus.git
   cd Product-Nexus
   ```

2. **Install Dependencies**
   ```bash
   # Install Frontend
   cd frontend
   npm install

   # Install Backend
   cd ../backend
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in `backend/`:
   ```env
   PORT=5000
   MONGODB_URL=your_mongodb_uri
   JWT_SECRET=your_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   CLIENT_URL=http://localhost:5173
   ```

   Create a `.env` file in `frontend/`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Run Locally**
   ```bash
   # Terminal 1: Backend
   cd backend
   npm run dev

   # Terminal 2: Frontend
   cd frontend
   npm run dev
   ```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get token |
| GET | `/api/products` | Fetch all products (paginated) |
| POST | `/api/products` | Create new product (w/ image) |
| DELETE | `/api/products/:id` | Delete product |

---

## 👨‍💻 Author

**Poojan Shrivastav**
- [LinkedIn](https://linkedin.com/in/poojan-shrivastav)
- [GitHub](https://github.com/Poojan2107)

---

_Built with 🖤 and Code._
