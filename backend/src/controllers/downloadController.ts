import { Request, Response } from 'express';
import { DownloadToken, Order, Book } from '../models';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';

export class DownloadController {
    async generateDownloadToken(orderId: string) {
        const token = uuidv4();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        return await DownloadToken.create({
            orderId,
            token,
            expiresAt
        });
    }

    async downloadBook(req: Request, res: Response) {
        try {
            const { token } = req.params;
            const { format } = req.query;

            if (!format || !['pdf', 'epub'].includes(format.toString().toLowerCase())) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid format specified'
                });
            }

            const downloadToken = await DownloadToken.findOne({
                where: {
                    token,
                    isUsed: false,
                    expiresAt: {
                        [Op.gt]: new Date()
                    }
                }
            });

            if (!downloadToken) {
                return res.status(404).json({
                    success: false,
                    error: 'Invalid or expired download token'
                });
            }

            const order = await Order.findByPk(downloadToken.orderId);
            if (!order) {
                return res.status(404).json({
                    success: false,
                    error: 'Order not found'
                });
            }

            const book = await Book.findByPk(order.bookId);
            if (!book) {
                return res.status(404).json({
                    success: false,
                    error: 'Book not found'
                });
            }

            const fileUrl = book.filePaths[format.toString().toLowerCase()];
            if (!fileUrl) {
                return res.status(404).json({
                    success: false,
                    error: 'File not found'
                });
            }

            await downloadToken.update({ isUsed: true });

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