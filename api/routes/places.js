const express = require('express');
const jwt = require('jsonwebtoken');
const Place = require('../models/Place.js');
const { getUserDataFromReq, jwtSecret } = require('./auth');
const router = express.Router();

// Create a new place
router.post('/', (req, res) => {
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
router.get('/user-places', (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

// Get a specific place by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id).populate('owner', 'name');
  if (!place) {
    return res.status(404).json({ error: 'Place not found' });
  }
  res.json(place);
});

// Update place information
router.put('/', async (req, res) => {
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
router.get('/', async (req, res) => {
  res.json(await Place.find());
});

// Delete a place
router.delete('/:id', async (req, res) => {
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

module.exports = router;
