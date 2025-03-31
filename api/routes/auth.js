const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users.js');
const { OAuth2Client } = require('google-auth-library');
const router = express.Router();

// JWT Secret and bcrypt salt
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasefrgcgjgcffddhfdh';

// Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function to get user data from request
const getUserDataFromReq = (req) => {
  return new Promise((resolve, reject) => {
    const token = req.cookies.token;
    if (!token) reject("No token found");

    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) reject(err);
      resolve(userData);
    });
  });
};

// Register route
router.post('/register', async (req, res) => {
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
router.post('/login', async (req, res) => {
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
        res.cookie('token', token, {
          httpOnly: true,
          secure: true, // Required for HTTPS
          sameSite: 'none', // Allow cross-site cookies
          path: '/', // Accessible across all paths
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        }).json(userDoc);
      }
    );
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.json(null);

  try {
    const userData = await getUserDataFromReq(req);
    const { name, email, _id, avatar } = await User.findById(userData.id);
    res.json({ name, email, _id, avatar });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    expires: new Date(0), // Expire immediately
  }).json(true);
});

// Profile update
router.put('/update-profile', async (req, res) => {
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

// Google login integration
router.post('/google-login', async (req, res) => {
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
        res.cookie('token', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          path: '/',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        }).json({
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

// Export the getUserDataFromReq function for use in other routes
module.exports = { router, getUserDataFromReq, jwtSecret };
