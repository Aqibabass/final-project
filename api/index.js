const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const Razorpay = require('razorpay');
const cloudinary = require('cloudinary').v2;

// Import route files
const { router: authRoutes } = require('./routes/auth');
const placesRoutes = require('./routes/places');
const bookingsRoutes = require('./routes/bookings');
const uploadsRoutes = require('./routes/uploads');
const paymentsRoutes = require('./routes/payments');

const app = express();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Make razorpay instance available to routes
app.set('razorpay', razorpay);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL);

// Root route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Test route
app.get('/test', (req, res) => {
  res.json('testggh ok');
});

// Use route files
app.use('/auth', authRoutes);
app.use('/places', placesRoutes);
app.use('/bookings', bookingsRoutes);
app.use('/upload', uploadsRoutes);
app.use('/payments', paymentsRoutes);



// Auth routes - redirect to the appropriate paths in the auth router
app.post('/register', (req, res, next) => {
  req.url = '/register';
  authRoutes(req, res, next);
});

app.post('/login', (req, res, next) => {
  req.url = '/login';
  authRoutes(req, res, next);
});

app.get('/profile', (req, res, next) => {
  req.url = '/profile';
  authRoutes(req, res, next);
});

app.post('/logout', (req, res, next) => {
  req.url = '/logout';
  authRoutes(req, res, next);
});

app.post('/google-login', (req, res, next) => {
  req.url = '/google-login';
  authRoutes(req, res, next);
});

app.put('/update-profile', (req, res, next) => {
  req.url = '/update-profile';
  authRoutes(req, res, next);
});

// Upload routes
app.post('/upload-by-link', (req, res, next) => {
  req.url = '/by-link';
  uploadsRoutes(req, res, next);
});

// Places routes
app.get('/user-places', (req, res, next) => {
  req.url = '/user-places';
  placesRoutes(req, res, next);
});

// Payment routes
app.post('/create-razorpay-order', (req, res, next) => {
  req.url = '/create-razorpay-order';
  paymentsRoutes(req, res, next);
});

app.post('/verify-payment', (req, res, next) => {
  req.url = '/verify-payment';
  paymentsRoutes(req, res, next);
});

// Bookings backward compatibility
app.post('/bookings', (req, res, next) => {
  req.url = '/';
  bookingsRoutes(req, res, next);
});

app.get('/bookings', (req, res, next) => {
  req.url = '/';
  bookingsRoutes(req, res, next);
});

app.delete('/bookings/:id', (req, res) => {
  bookingsRoutes(req, res);
});

// Places backward compatibility
app.get('/places', (req, res, next) => {
  req.url = '/';
  placesRoutes(req, res, next);
});

app.post('/places', (req, res, next) => {
  req.url = '/';
  placesRoutes(req, res, next);
});

app.put('/places', (req, res, next) => {
  req.url = '/';
  placesRoutes(req, res, next);
});

app.get('/places/:id', (req, res) => {
  placesRoutes(req, res);
});

app.delete('/places/:id', (req, res) => {
  placesRoutes(req, res);
});

// Upload backward compatibility
app.post('/upload', (req, res, next) => {
  req.url = '/';
  uploadsRoutes(req, res, next);
});

// Listen on the appropriate port
app.listen(process.env.PORT || 4000, () => {
  console.log('Server is running');
});
