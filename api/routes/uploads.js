const express = require('express');
const multer = require('multer');
const axios = require('axios');
const { Readable } = require('stream');
const cloudinary = require('cloudinary').v2;
const router = express.Router();

// Image upload via URL
router.post('/by-link', async (req, res) => {
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

router.post('/', photosMiddleware.array('photos', 100), async (req, res) => {
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

module.exports = router;
