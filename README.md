# Product Nexus 🚀

**Where Products Meet Perfection**

A modern, terminal-inspired product management application built with the MERN stack. Product Nexus provides a sleek, dark-themed interface for managing your product catalog with full CRUD operations and JWT-based user authentication.

## 🌟 Features

- **🔐 User Authentication**: Secure login and registration using JWT tokens
- **📦 Product Management**: Complete CRUD operations (Create, Read, Update, Delete)
- **📊 Analytics Dashboard**: Visual insights with interactive charts (Chart.js)
- **🔍 Advanced Search & Filter**: Global search, price range filtering, and sorting
- **📄 PDF Export**: Download product lists as professional PDF reports
- **🖼️ Cloud Image Storage**: Real image uploads via Cloudinary with Drag-and-Drop support
- **⚡ Optimistic UI**: Instant interface updates for a snappy user experience
- **🔄 Pagination**: Server-side pagination for handling large datasets
- **🎨 Terminal-Inspired UI**: Modern dark theme with techy aesthetics and Skeleton loading
- **💻 Interactive CLI**: Built-in terminal widget for command-line navigation
- **🎬 Creative Landing Page**: Typewriter effects, 3D tilt cards, and parallax animations
- **📱 Responsive Design**: Works seamlessly across desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 19+** with Vite
- **Redux Toolkit** for global state management
- **Chart.js** for data visualization
- **React Dropzone** for drag-and-drop file uploads
- **jsPDF** for document generation
- **React Loading Skeleton** for loading states
- **CSS3** with custom dark theme and animations

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Cloudinary** for image storage
- **Multer** for file handling
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Deployment
- **GitHub Pages** for frontend deployment
- **MongoDB Atlas** for cloud database
- **Git** for version control

## 🚀 Live Demo

**[Visit Product Nexus](https://poojan2107.github.io/ProductNexus)**

## 📋 Product Features

### Product Management

- ➕ **Add Products**: Create new products with drag-and-drop image upload
- 👁️ **View Products**: Browse products with server-side pagination
- ✏️ **Edit Products**: Update existing product details and images
- 🗑️ **Delete Products**: Remove products with optimistic UI updates
- 🔍 **Search & Filter**: Real-time filtering by name, category, and price
- 📄 **Export Data**: Generate PDF reports of your inventory
- 📊 **Dashboard**: View total value, category distribution, and price trends

### User Experience

- 🔑 **Secure Authentication**: Register new accounts or login to existing ones
- 🛡️ **Protected Routes**: Only authenticated users can access product management
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- ⚡ **Real-time Updates**: Instant UI updates after operations
- 🎨 **Dark Theme**: Terminal-inspired aesthetic with smooth animations

## 🏗️ Project Structure

```
product/
├── backend/                    # Express.js backend
│   ├── models/                 # MongoDB models
│   ├── routes/                 # API routes
│   ├── middleware/             # Custom middleware
│   │   └── upload.js          # Multer/Cloudinary config
│   └── server.js              # Main server file
├── src/                       # React frontend
│   ├── components/            # Reusable UI components
│   ├── pages/                 # Main application pages
│   ├── services/              # API services
│   ├── store/                 # Redux store and slices
│   │   ├── productSlice.js    # Product state management
│   │   └── dashboardSlice.js  # Analytics state management
│   ├── hooks/                 # Custom React hooks
│   └── styles/                # CSS styling files
└── README.md                  # Project documentation
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Poojan2107/ProductNexus.git
   cd ProductNexus
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Set up environment variables**

   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

5. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

6. **Start the frontend development server**
   ```bash
   # In a new terminal, from the root directory
   npm run dev
   ```

7. **Open your browser**

   Navigate to `http://localhost:5173` to access the application.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/status` - Check auth status
  - `PUT /api/auth/update/:id` - Update user profile

### Products
- `GET /api/products` - Get all products for authenticated user
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## 👨‍💻 Developer

**Product Management App Built By Poojan Shrivastav.**

---

### 🔗 Links

- **Live Demo**: https://poojan2107.github.io/ProductNexus
- **Repository**: https://github.com/Poojan2107/ProductNexus

---

_Built with ❤️ using the MERN stack and modern web technologies._
