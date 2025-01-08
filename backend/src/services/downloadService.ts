// src/services/downloadService.ts
import { v4 as uuidv4 } from 'uuid';
import { Order } from '../models';
import { Op } from 'sequelize';

export class DownloadService {
  private readonly DOWNLOAD_EXPIRY_HOURS = 24;

  async generateDownloadLink(orderId: string): Promise<string> {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const downloadToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + this.DOWNLOAD_EXPIRY_HOURS);

    await order.update({
      downloadToken,
      downloadExpiresAt: expiresAt,
      downloadLink: `/download/${downloadToken}`
    });

    return downloadToken;
  }

  async verifyDownload(token: string) {
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
      throw new Error('Invalid or expired download token');
    }

    return order;
  }
}