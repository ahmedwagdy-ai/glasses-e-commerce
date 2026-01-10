const axios = require('axios');
const asyncHandler = require('../middleware/asyncHandler');
const Order = require('../models/Order');

// @desc    Initiate Paymob Payment
// @route   POST /api/payment/paymob
const initiatePayment = asyncHandler(async (req, res) => {
    const { orderCart, billingData, totalAmount } = req.body;

    // 1. Authentication Request
    const authResponse = await axios.post('https://accept.paymob.com/api/auth/tokens', {
        api_key: process.env.PAYMOB_API_KEY
    });
    const token = authResponse.data.token;

    // 2. Order Registration API
    const orderResponse = await axios.post('https://accept.paymob.com/api/ecommerce/orders', {
        auth_token: token,
        delivery_needed: "false",
        amount_cents: totalAmount * 100, // Amount in cents
        currency: "EGP",
        items: [] // You can map items here if needed
    });
    const paymobOrderId = orderResponse.data.id;

    // 3. Payment Key Request
    const paymentKeyResponse = await axios.post('https://accept.paymob.com/api/acceptance/payment_keys', {
        auth_token: token,
        amount_cents: totalAmount * 100,
        expiration: 3600,
        order_id: paymobOrderId,
        billing_data: {
            apartment: "NA",
            email: "user@example.com", // Should come from req.body or auth
            floor: "NA",
            first_name: billingData.customerName.split(' ')[0] || "Client",
            street: billingData.address || "NA",
            building: "NA",
            phone_number: "+201234567890", // Should come from req.body
            shipping_method: "NA",
            postal_code: "NA",
            city: "Cairo",
            country: "EG",
            last_name: billingData.customerName.split(' ')[1] || "Name",
            state: "NA"
        },
        currency: "EGP",
        integration_id: process.env.PAYMOB_INTEGRATION_ID
    });

    const paymentToken = paymentKeyResponse.data.token;

    res.json({
        token: paymentToken,
        iframeId: process.env.PAYMOB_FRAME_ID
    });
});

module.exports = {
    initiatePayment
};
