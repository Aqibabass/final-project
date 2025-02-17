const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/Users.js');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const axios = require('axios');
const { Readable } = require('stream');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const fs = require('fs');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasefrgcgjgcffddhfdh';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json());
app.use(cookieParser());

// Handle CORS dynamically based on environment
app.use(cors({
  credentials: true,
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173', // Allow localhost for development and set frontend URL for production
  ],
<<<<<<< HEAD
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
=======
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

>>>>>>> d87d89c01c07d2c8eaa7d1cb698945d0c62f7e95
mongoose.connect(process.env.MONGO_URL);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Function to get user data from request
function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

app.get('/test', (req, res) => {
  res.json('testggh ok');
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });

    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});

// Login route with JWT authentication
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (!passOk) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    jwt.sign(
      { email: userDoc.email, id: userDoc._id },
      jwtSecret,
      {},
      (err, token) => {
        if (err) throw err;
        res.cookie('token', token, { httpOnly: true }).json(userDoc);
      }
    );
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Profile route
app.get('/profile', async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id, avatar } = await User.findById(userData.id);
      res.json({ name, email, _id, avatar });
    });
  } else {
    res.json(null);
  }
});

// Logout route
app.post('/logout', (req, res) => {
  res.cookie('token', '').json(true);
});

// Image upload via URL
app.post('/upload-by-link', async (req, res) => {
  const { link } = req.body;

  if (!link || !link.startsWith('http')) {
    return res.status(400).json({ error: 'Valid image URL is required' });
  }

  try {
    const response = await axios.get(link, { responseType: 'arraybuffer' });

    const imageStream = new Readable();
    imageStream.push(response.data);
    imageStream.push(null);

    const newName = 'photo' + Date.now();

    const cloudinaryResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'uploads', public_id: newName },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      imageStream.pipe(uploadStream);
    });

    res.json({ url: cloudinaryResponse.secure_url });
  } catch (error) {
    console.error('Image upload failed:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// File upload route (multiple files)
const photosMiddleware = multer();

app.post('/upload', photosMiddleware.array('photos', 100), async (req, res) => {
  const uploadedFiles = [];

  try {
    for (const file of req.files) {
      const timestamp = Date.now();
      const extension = file.originalname.split('.').pop();
      const newName = `photo${timestamp}`;

      const cloudinaryResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'uploads', public_id: newName, resource_type: 'auto' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(file.buffer);
      });

      uploadedFiles.push(cloudinaryResponse.secure_url);
    }

    res.json(uploadedFiles);
  } catch (error) {
    console.error('Image upload failed:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

// Routes for creating and managing places
app.post('/places', (req, res) => {
  const { token } = req.cookies;
  const { title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;

    const placeDoc = await Place.create({
      owner: userData.id, title, address, photos: addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price,
    });
    res.json(placeDoc);
  });
});

// Retrieve user's places
app.get('/user-places', (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

// Get a specific place by ID
app.get('/places/:id', async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id).populate('owner', 'name');
  if (!place) {
    return res.status(404).json({ error: 'Place not found' });
  }
  res.json(place);
});

// Update place information
app.put('/places', async (req, res) => {
  const { token } = req.cookies;
  const { id, title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;

    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title, address, photos: addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price,
      });
      await placeDoc.save();
      res.json('ok');
    }
  });
});

// Fetch all places
app.get('/places', async (req, res) => {
  res.json(await Place.find());
});

// Booking routes
app.post('/bookings', async (req, res) => {
  const userData = await getUserDataFromReq(req);
  const { place, checkIn, checkOut, numberOfGuests, name, phone, price } = req.body;

  Booking.create({
    place, checkIn, checkOut, numberOfGuests, name, phone, price, user: userData.id,
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    throw err;
  });
});

// Get bookings for a user
app.get('/bookings', async (req, res) => {
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({ user: userData.id }).populate('place'));
});

// Cancel a booking
app.delete('/bookings/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBooking = await Booking.findByIdAndDelete(id);
    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json({ message: 'Booking canceled successfully' });
  } catch (error) {
    console.error('Error canceling booking:', error);
    res.status(500).json({ message: 'Server error while canceling booking' });
  }
});

// Profile update
app.put('/update-profile', async (req, res) => {
  const { token } = req.cookies;
  const { username, password } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userData.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = username || user.name;
    if (password) {
      user.password = bcrypt.hashSync(password, bcryptSalt);
    }

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  });
});

// Delete a place
app.delete('/places/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPlace = await Place.findByIdAndDelete(id);
    if (!deletedPlace) {
      return res.status(404).json({ error: 'Place not found' });
    }
    res.status(200).json({ message: 'Place deleted successfully' });
  } catch (error) {
    console.error('Error deleting place:', error);
    res.status(500).json({ error: 'Server error while deleting place' });
  }
});

// Google login integration
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post('/google-login', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub: googleId, name, email, picture } = payload;

    let user = await User.findOne({
      $or: [
        { googleId },
        { email }
      ]
    });

    if (!user) {
      user = await User.create({
        googleId,
        name,
        email,
        avatar: picture
      });
    }

    jwt.sign(
      { email: user.email, id: user._id },
      jwtSecret,
      {},
      (err, token) => {
        if (err) throw err;
        res.cookie('token', token, { httpOnly: true }).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar
        });
      }
    );
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Error during Google login' });
  }
});

// Listen on the appropriate port
app.listen(process.env.PORT || 5000, () => {
  console.log('Server is running');
});
