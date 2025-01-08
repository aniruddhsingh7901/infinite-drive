"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getOrders = exports.placeOrder = void 0;
const orderModel_1 = __importDefault(require("../models/orderModel"));
const emailService_1 = require("../services/emailService");
const ebookService_1 = require("../services/ebookService");
const cryptoService_1 = require("../services/cryptoService");
const walletAddresses = {
    BTC: 'your_btc_wallet_address',
    LTC: 'your_ltc_wallet_address',
    TRON: 'your_tron_wallet_address',
    MONERO: 'your_monero_wallet_address',
};
const placeOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, items, totalAmount, currency } = req.body;
        // Validate currency
        if (!walletAddresses[currency]) {
            res.status(400).json({ message: 'Unsupported cryptocurrency' });
            return;
        }
        // Create the order in the database
        const order = yield orderModel_1.default.create({
            userId,
            items,
            totalAmount,
            paymentStatus: 'Pending',
        });
        // Respond with the order and payment details
        res.status(201).json({ message: 'Order placed successfully', order, walletAddress: walletAddresses[currency] });
        // Monitor payment status (this should be done in a background job or a separate service)
        const paymentSuccess = yield (0, cryptoService_1.checkPaymentStatus)(walletAddresses[currency], currency);
        if (paymentSuccess) {
            order.paymentStatus = 'Completed';
            yield order.save();
            // Generate download link
            const downloadLink = yield (0, ebookService_1.generateDownloadLink)(order.id.toString());
            // Send email with download link
            const emailBody = `Download your eBook here: ${downloadLink}`;
            yield (0, emailService_1.sendEmail)('customer@example.com', 'Your eBook', emailBody);
            // Schedule link deletion
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, ebookService_1.deleteDownloadLink)(downloadLink);
            }), 24 * 60 * 60 * 1000); // Delete link after 24 hours
        }
    }
    catch (error) {
        next(error);
    }
});
exports.placeOrder = placeOrder;
const getOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const orders = yield orderModel_1.default.findAll({ where: { userId: req.user.id } });
        res.status(200).json(orders);
    }
    catch (error) {
        next(error);
    }
});
exports.getOrders = getOrders;
const updateOrderStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = yield orderModel_1.default.findByPk(id);
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        order.paymentStatus = status;
        yield order.save();
        res.status(200).json(order);
    }
    catch (error) {
        next(error);
    }
});
exports.updateOrderStatus = updateOrderStatus;
