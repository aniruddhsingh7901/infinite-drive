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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const ebookService_1 = require("./services/ebookService");
const database_1 = __importDefault(require("./config/database"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use('/auth', authRoutes_1.default);
app.use('/cart', cartRoutes_1.default);
app.use('/order', orderRoutes_1.default);
app.use('/payment', paymentRoutes_1.default);
app.get('/download/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const link = `https://your-site.com/download/${req.params.id}`;
    const filePath = yield (0, ebookService_1.handleDownload)(link);
    if (filePath) {
        res.download(filePath, (err) => {
            if (err) {
                console.error(err);
            }
            else {
                // Optionally delete the file after download
                fs_1.default.unlinkSync(filePath);
            }
        });
    }
    else {
        res.status(404).send('Link not found or expired');
    }
}));
const PORT = process.env.PORT || 5000;
database_1.default.authenticate()
    .then(() => {
    console.log('Database connected...');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error('Unable to connect to the database:', err);
});
