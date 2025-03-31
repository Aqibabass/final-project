const express = require('express');
const crypto = require('crypto');
const router = express.Router();

// Create Razorpay Order
router.post('/create-razorpay-order', async (req, res) => {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
    }

    try {
        const razorpay = req.app.get('razorpay');
        const options = {
            amount: Math.round(amount * 100), // Convert to paise and ensure integer
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1, // Auto capture payment
        };

        const order = await razorpay.orders.create(options);
        
        res.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency
        });
    } catch (err) {
        console.error("Razorpay order creation failed:", err);
        res.status(500).json({ 
            error: "Failed to create payment order",
            details: err.message 
        });
    }
});

// Verify payment
router.post('/verify-payment', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    res.json({ verified: true });
  } else {
    res.status(400).json({ verified: false });
  }
});

module.exports = router;
