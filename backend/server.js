const express = require('express'); // Reverted: 2025-11-30 23:18
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'https://product-nexus-poojan.vercel.app',
  'https://product-nexus-poojan.vercel.app/' // Just in case
];

app.use(cors({
  origin: function (origin, callback) {
    console.log('Request Origin:', origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(helmet());
app.use(express.json());

// MongoDB connection
const mongoUrl = process.env.MONGODB_URL;

if (!mongoUrl) {
  console.error('Missing MONGODB_URL environment variable. Please set it in backend/.env');
  process.exit(1);
}

mongoose.connect(mongoUrl)
  .then(() => {


    // Routes (register after DB is ready)
    app.use('/api/auth', authRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/orders', require('./routes/orders'));

    // Root route
    app.get('/', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Product Nexus API</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; background-color: #f4f4f4; }
            h1 { color: #333; }
            ul { list-style-type: none; padding: 0; }
            li { background: #fff; margin: 5px 0; padding: 10px; border-radius: 5px; box-shadow: 0 0 5px rgba(0,0,0,0.1); }
            .method { font-weight: bold; color: #007bff; }
          </style>
        </head>
        <body>
          <h1>Welcome to Product Nexus API</h1>
          <p>Available endpoints:</p>
          <ul>
            <li><span class="method">POST</span> /api/auth/register - Register a new user</li>
            <li><span class="method">POST</span> /api/auth/login - Login user</li>
            <li><span class="method">POST</span> /api/auth/logout - Logout user</li>
            <li><span class="method">GET</span> /api/auth/status - Check auth status</li>
            <li><span class="method">PUT</span> /api/auth/profile/:id - Update user profile</li>
            <li><span class="method">GET</span> /api/products - Get all products for authenticated user</li>
            <li><span class="method">POST</span> /api/products - Create new product</li>
            <li><span class="method">GET</span> /api/products/:id - Get single product</li>
            <li><span class="method">PUT</span> /api/products/:id - Update product</li>
            <li><span class="method">DELETE</span> /api/products/:id - Delete product</li>
          </ul>
        </body>
        </html>
      `);
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: 'Something went wrong!', error: err.message });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    // Exit with non-zero so a process manager (nodemon) shows the failure
    process.exit(1);
  });
