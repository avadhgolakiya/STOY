const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

// Optional protect middleware if you want to allow guest checkout, 
// but based on the controller we can just pass the user if available.
// Since protect forces 401 if no token, let's create a softProtect if needed,
// but for now let's assume they must be logged in to order, or we can make it public.
// I'll make it public but grab user if token is present (we can just make a custom middleware or skip it).
// Let's just use `protect` since it's an authenticated store, or skip it for guests.
// Wait, the prompt didn't say checkout requires login. Let's make it public for now.

router.post('/create', protect, orderController.createOrder);
router.post('/verify', protect, orderController.verifyPayment);
router.get('/myorders', protect, orderController.getMyOrders);
router.get('/', orderController.getAllOrders);
router.put('/:id/status', orderController.updateOrderStatus);

module.exports = router;
