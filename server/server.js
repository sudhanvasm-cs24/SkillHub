import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import progressRoutes from './routes/progressRoutes.js';

// Load env vars
dotenv.config();

const app = express();

// Connect to database
connectDB();

app.use(cors({
  origin: [
    "https://skillhub-wheat.vercel.app/register"
  ],
  credentials: true
}));


// Enable CORS (Cross-Origin Resource Sharing)
// This is crucial to allow your React frontend (on localhost:3000)
// to talk to your backend (on localhost:5000)

// Body parser middleware
// This allows us to accept JSON data in the request body
app.use(express.json());

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/progress', progressRoutes);

// Simple test route
app.get('/', (req, res) => {
  res.send('SkillHub API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running on port ${PORT}`)
);