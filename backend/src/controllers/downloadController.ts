// src/controllers/downloadController.ts
import { Request, Response } from 'express';
import { DownloadToken, Order, Book } from '../models';

import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';

export class DownloadController {
    async generateDownloadToken(orderId: string) {
        const token = uuidv4();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry

        return await DownloadToken.create({
            orderId,
            token,
            expiresAt
        });
    }

    //     async downloadBook(req: Request, res: Response) {
    //         try {
    //             const { token } = req.params;

    //             const downloadToken = await DownloadToken.findOne({
    //                 where: {
    //                     token,
    //                     isUsed: false,
    //                     expiresAt: {
    //                         [Op.gt]: new Date()
    //                     }
    //                 },
    //                 include: [{
    //                     model: Order,
    //                     include: [Book]
    //                 }]
    //             });

    //             if (!downloadToken) {
    //                 return res.status(404).json({
    //                     success: false,
    //                     error: 'Invalid or expired download token'
    //                 });
    //             }

    //             // Mark token as used
    //             await downloadToken.update({ isUsed: true });

    //             // Get book file URL
    //             const book = downloadToken.Order.Book;
    //             const format = downloadToken.Order.format.toLowerCase();
    //             const fileUrl = book.filePaths[format];

    //             res.json({
    //                 success: true,
    //                 downloadUrl: fileUrl
    //             });

    //         } catch (error) {
    //             console.error('Download error:', error);
    //             res.status(500).json({
    //                 success: false,
    //                 error: 'Download failed'
    //             });
    //         }
    //     }
    // }

    async downloadBook(req: Request, res: Response) {
        try {
            const { token } = req.params;
            const { format } = req.query;

            // Validate format
            if (!format || !['pdf', 'epub'].includes(format.toString().toLowerCase())) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid format specified'
                });
            }

            // Find valid order with token
            const order = await Order.findOne({
                where: {
                    downloadToken: token,
                    downloadExpiresAt: {
                        [Op.gt]: new Date()
                    },
                    status: 'completed'
                }
            });

            if (!order) {
                return res.status(404).json({
                    success: false,
                    error: 'Invalid or expired download token'
                });
            }

            // Get book details
            const book = await Book.findByPk(order.bookId);
            if (!book) {
                return res.status(404).json({
                    success: false,
                    error: 'Book not found'
                });
            }

            // Get correct file URL based on format
            const fileUrl = book.filePaths[format.toString().toLowerCase()];
            if (!fileUrl) {
                return res.status(404).json({
                    success: false,
                    error: 'File not found'
                });
            }

            // Clear download token after successful download
            await Order.update({
                downloadToken: null,
                downloadExpiresAt: null
            }, {
                where: { id: order.id }
            });

            // Redirect to actual file URL
            res.redirect(fileUrl);

        } catch (error) {
            console.error('Download error:', error);
            res.status(500).json({
                success: false,
                error: 'Download failed'
            });
        }
    }
}

export default new DownloadController();