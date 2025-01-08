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
exports.processPayment = void 0;
const cryptoService_1 = require("../services/cryptoService");
const orderModel_1 = __importDefault(require("../models/orderModel"));
const processPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId, currency } = req.body;
        const order = yield orderModel_1.default.findByPk(orderId);
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        const walletAddress = getWalletAddress(currency);
        const paymentSuccess = yield (0, cryptoService_1.checkPaymentStatus)(walletAddress, currency);
        if (paymentSuccess) {
            order.paymentStatus = 'Completed';
            yield order.save();
            res.status(200).json({ message: 'Payment successful', order });
        }
        else {
            res.status(400).json({ message: 'Payment failed' });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.processPayment = processPayment;
const getWalletAddress = (currency) => {
    const walletAddresses = {
        BTC: 'your_btc_wallet_address',
        LTC: 'your_ltc_wallet_address',
        TRON: 'your_tron_wallet_address',
        MONERO: 'your_monero_wallet_address',
    };
    return walletAddresses[currency];
};
