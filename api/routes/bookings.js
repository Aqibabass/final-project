const express = require('express');
const Booking = require('../models/Booking.js');
const User = require('../models/Users.js');
const { getUserDataFromReq } = require('./auth');
const crypto = require('crypto');
const { sendBookingConfirmation } = require('../utils/emailConfig');
const { sendSMS } = require('../utils/smsConfig');
const router = express.Router();

// Create a new booking
router.post('/', async (req, res) => {
    try {
        const userData = await getUserDataFromReq(req);
        const {
            paymentId,
            orderId,
            signature,
            checkIn,
            checkOut,
            numberOfGuests,
            name,
            phone,
            place,
            price,
            emailNotification,
            smsNotification
        } = req.body;

        // Verify payment details
        const body = orderId + "|" + paymentId;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== signature) {
            return res.status(400).json({ error: "Invalid payment signature" });
        }

        // Verify payment status
        const razorpay = req.app.get('razorpay');
        const payment = await razorpay.payments.fetch(paymentId);
        if (payment.status !== "captured") {
            return res.status(400).json({ error: "Payment not captured" });
        }

        // Create booking
        const booking = await Booking.create({
            place,
            user: userData.id,
            checkIn,
            checkOut,
            numberOfGuests,
            name,
            phone,
            price,
            paymentId,
            orderId,
            paid: true,
            emailNotification,
            smsNotification
        });

        // Populate place details for response
        await booking.populate('place');

        // Get user email and send confirmation
        const user = await User.findById(userData.id);
        // Send email notification if enabled
        if (emailNotification && user && user.email) {
            await sendBookingConfirmation(booking, user.email);
        }

        // Send SMS notification if enabled
        if (smsNotification && phone) {
            try {
                const formatDate = (date) => {
                    const d = new Date(date);
                    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
                };
        
                const message = `Booking Confirmed! Your booking for ${booking.place.title} from ${formatDate(checkIn)} to ${formatDate(checkOut)} has been confirmed. Total amount paid: Rs.${price}`;
                
                // Set SMS options to ensure plain text
                const smsOptions = {
                    encoding: 'plain',
                    unicode: false
                };
                
                await sendSMS(phone, message, smsOptions);
            } catch (smsError) {
                console.error("SMS sending failed:", smsError);
            }
        }

        res.json(booking);
    } catch (error) {
        console.error("Booking error:", error);
        res.status(500).json({ 
            error: "Booking failed", 
            details: error.message 
        });
    }
});

// Get bookings for a user
router.get('/', async (req, res) => {
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({ user: userData.id }).populate('place'));
});

// Cancel a booking
router.delete('/:id', async (req, res) => {
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

module.exports = router;
