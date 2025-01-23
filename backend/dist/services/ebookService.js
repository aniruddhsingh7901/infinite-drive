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
exports.handleDownload = exports.deleteDownloadLink = exports.generateDownloadLink = void 0;
const uuid_1 = require("uuid");
const Book_1 = __importDefault(require("../models/Book"));
const downloadLinks = {};
const generateDownloadLink = (ebookId) => __awaiter(void 0, void 0, void 0, function* () {
    const link = `https://your-site.com/download/${(0, uuid_1.v4)()}`;
    downloadLinks[link] = ebookId;
    return link;
});
exports.generateDownloadLink = generateDownloadLink;
const deleteDownloadLink = (link) => __awaiter(void 0, void 0, void 0, function* () {
    delete downloadLinks[link];
});
exports.deleteDownloadLink = deleteDownloadLink;
const handleDownload = (link) => __awaiter(void 0, void 0, void 0, function* () {
    const ebookId = downloadLinks[link];
    if (ebookId) {
        delete downloadLinks[link];
        const ebook = yield Book_1.default.findByPk(ebookId);
        return (ebook === null || ebook === void 0 ? void 0 : ebook.filePath) || null;
    }
    return null;
});
exports.handleDownload = handleDownload;
