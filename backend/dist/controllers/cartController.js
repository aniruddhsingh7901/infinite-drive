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
exports.removeFromCart = exports.getCart = exports.addToCart = void 0;
require("../types/express");
const cartModel_1 = __importDefault(require("../models/cartModel"));
const Book_1 = __importDefault(require("../models/Book"));
const addToCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId, quantity } = req.body;
        const userId = req.user.id;
        let cart = yield cartModel_1.default.findOne({ where: { userId } });
        if (!cart) {
            cart = yield cartModel_1.default.create({ userId, items: [{ bookId, quantity }] });
        }
        else {
            const items = cart.items;
            const itemIndex = items.findIndex((item) => item.bookId === bookId);
            if (itemIndex > -1) {
                items[itemIndex].quantity += quantity;
            }
            else {
                items.push({ bookId, quantity });
            }
            cart.items = items;
            yield cart.save();
        }
        res.status(200).json({ message: 'Book added to cart', cart });
    }
    catch (error) {
        next(error);
    }
});
exports.addToCart = addToCart;
const getCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const cart = yield cartModel_1.default.findOne({ where: { userId }, include: [Book_1.default] });
        res.status(200).json(cart);
    }
    catch (error) {
        next(error);
    }
});
exports.getCart = getCart;
const removeFromCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = req.body;
        const userId = req.user.id;
        const cart = yield cartModel_1.default.findOne({ where: { userId } });
        if (cart) {
            cart.items = cart.items.filter((item) => item.bookId !== bookId);
            yield cart.save();
        }
        res.status(200).json({ message: 'Book removed from cart', cart });
    }
    catch (error) {
        next(error);
    }
});
exports.removeFromCart = removeFromCart;
