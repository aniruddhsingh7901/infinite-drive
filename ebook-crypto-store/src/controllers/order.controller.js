const Order = require('../models/order.model');

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.getByUserId(req.user.userId);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getOrder = async (req, res) => {
    try {
        const order = await Order.getById(req.params.id);
        if (!order || order.user_id !== req.user.userId) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};