"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.Cart = exports.Book = exports.User = void 0;
const userModel_1 = __importDefault(require("./userModel"));
exports.User = userModel_1.default;
const Book_1 = __importDefault(require("./Book"));
exports.Book = Book_1.default;
const cartModel_1 = __importDefault(require("./cartModel"));
exports.Cart = cartModel_1.default;
const orderModel_1 = __importDefault(require("./orderModel"));
exports.Order = orderModel_1.default;
// Initialize models
userModel_1.default.sync();
Book_1.default.sync();
cartModel_1.default.sync();
orderModel_1.default.sync();
