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
const app = express();
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasefrgcgjgcffddhfdh'
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173',
}));

mongoose.connect(process.env.MONGO_URL);
app.get("/", (req, res) => {
  res.send("Server is running!");
});

function getUserDataFromReq(req){
  return new Promise((resolve, reject)=>{

    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if(err) throw err;
      resolve (userData);
    });
  })
 
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
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the password is correct
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (!passOk) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    //  Generate a JWT token
    jwt.sign(
      { email: userDoc.email, id: userDoc._id },
      jwtSecret,
      {}, 
      (err, token) => {
        if (err) throw err;

        // Send token and user details
        res.cookie('token', token, { httpOnly: true }).json(userDoc); // Send userDoc back
      }
    );
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});


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

app.post('/logout', (req, res) => {
  res.cookie('token', '').json(true);
});

app.post('/upload-by-link', async (req, res) => {
  const { link } = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  await imageDownloader.image({
    url: link,
    dest: __dirname + '/uploads/' + newName,
  });
  res.json(newName);
});

const photosMiddleware = multer({ dest: 'uploads' });
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
  const uploadedFiles = [];

  req.files.forEach((file) => {
    const { path, originalname } = file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];

    const newPath = `${path}.${ext}`;
    fs.rename(path, newPath, (err) => {
      if (err) {
        console.error("Error renaming file:", err);
        return res.status(500).json({ error: 'File processing error' });
      }
    });

    // for converting \\ into / bcoz i was getting uploads\\... as the response
    const normalizedPath = newPath.replace(/\\/g, '/');
    uploadedFiles.push(normalizedPath.replace('uploads/', ''));
  });

  res.json(uploadedFiles);
});

app.post('/places', (req, res) => {
  const { token } = req.cookies;
  const { title, address, addedPhotos,
    description, perks, extraInfo,
    checkIn, checkOut, maxGuests, price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;

    const placeDoc = await Place.create({
      owner: userData.id, title, address,
      photos: addedPhotos, description,
      perks, extraInfo, checkIn,
      checkOut, maxGuests, price,
    });
    res.json(placeDoc);
  });



});
app.get('/user-places', (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {

    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

app.get('/places/:id', async (req, res) => {
  const { id } = req.params;
  
  // Use populate to include the owner data (assuming `owner` is a reference to the `User` model)
  const place = await Place.findById(id).populate('owner', 'name');  // Populate only the 'name' field of the owner
  
  if (!place) {
    return res.status(404).json({ error: 'Place not found' });
  }

  res.json(place);
});


app.put('/places', async (req, res) => {
  const { token } = req.cookies;
  const { id,
    title, address, addedPhotos,
    description, perks, extraInfo,
    checkIn, checkOut, maxGuests, price,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;

    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title, address, photos: addedPhotos,
        description, perks, extraInfo,
        checkIn, checkOut, maxGuests, price,

      });
      await placeDoc.save();
      res.json('ok');
    }
  });
});

app.get('/places', async (req, res) => {
  res.json(await Place.find());
});
app.post('/bookings', async(req, res) => {
  const userData = await getUserDataFromReq(req);
  const {
    place, checkIn, checkOut,
    numberOfGuests, name, phone, price,
  } = req.body;

  Booking.create({
    place, checkIn, checkOut,
    numberOfGuests, name, phone, price,user:userData.id ,
  }).then((doc) => {
    res.json(doc);
  }).catch((err)=>{
    throw err;
  })
});



app.get('/bookings', async (req,res)=>{
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({user:userData.id}).populate('place'));
});
app.delete('/bookings/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Attempt to delete the booking
    const deletedBooking = await Booking.findByIdAndDelete(id);

    // If no booking found with the provided ID
    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Success response
    res.status(200).json({ message: 'Booking canceled successfully' });
  } catch (error) {
    console.error('Error canceling booking:', error);
    res.status(500).json({ message: 'Server error while canceling booking' });
  }
});

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

    // Update fields
    user.name = username || user.name;
    if (password) {
      user.password = bcrypt.hashSync(password, bcryptSalt);
    }

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  });
});
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
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Add this before other routes
app.post('/google-login', async (req, res) => {
    const { token } = req.body;
    
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        
        const payload = ticket.getPayload();
        const { sub: googleId, name, email, picture } = payload;

        // Check if user exists
        let user = await User.findOne({ 
            $or: [
                { googleId },
                { email }
            ]
        });

        if (!user) {
            // Create new user if doesn't exist
            user = await User.create({
                googleId,
                name,
                email,
                avatar: picture
            });
        }

        // Generate JWT token
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
        res.status(400).json({ message: 'Google login failed' });
    }
});
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
module.exports = app;

app.listen(4000);
