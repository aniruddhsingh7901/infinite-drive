const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const { isUser } = require('../middleware/role.middleware');

// User only routes
router.get('/my-orders', auth, isUser, getMyOrders);
router.get('/my-downloads', auth, isUser, getMyDownloads);
router.post('/orders', auth, isUser, createOrder);

module.exports = router;