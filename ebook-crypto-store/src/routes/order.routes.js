const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const { getOrders, getOrder } = require('../controllers/order.controller');

router.get('/', auth, getOrders);
router.get('/:id', auth, getOrder);

module.exports = router;