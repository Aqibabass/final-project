const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendBookingConfirmation = async (booking, userEmail) => {
  const { name, checkIn, checkOut, numberOfGuests, place, price } = booking;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Booking Confirmation - Your Stay is Confirmed!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Booking Confirmation</h2>
        <p>Dear ${name},</p>
        <p>Your booking has been confirmed! Here are your booking details:</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Check-in:</strong> ${new Date(checkIn).toLocaleDateString()}</p>
          <p><strong>Check-out:</strong> ${new Date(checkOut).toLocaleDateString()}</p>
          <p><strong>Number of Guests:</strong> ${numberOfGuests}</p>
          <p><strong>Property:</strong> ${place.title || 'Your Accommodation'}</p>
          <p><strong>Total Amount Paid:</strong> ₹${price}</p>
        </div>
        
        <p>If you have any questions about your booking, please don't hesitate to contact us.</p>
        <p>We hope you enjoy your stay!</p>
        
        <p style="margin-top: 20px;">Best regards,<br>Your Booking Platform Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    // Don't throw the error to prevent booking creation failure
  }
};

module.exports = {
  sendBookingConfirmation
};
