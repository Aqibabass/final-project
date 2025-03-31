const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    place: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Place" },
    user: { type: mongoose.Schema.Types.ObjectId, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    numberOfGuests: { type: Number, required: true }, // Add this line
    name: { type: String, required: true },
    phone: { type: String, required: true },
    price: { type: Number, required: true },
    paymentId: { type: String, required: true },
    orderId: { type: String, required: true },
    paid: { type: Boolean, default: false },
    emailNotification: { type: Boolean, default: true },
    smsNotification: { type: Boolean, default: true },
  }, { timestamps: true });
const BookingModel = mongoose.model('Booking', bookingSchema);
module.exports = BookingModel;
