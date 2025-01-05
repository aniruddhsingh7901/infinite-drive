import { Client, resources, Webhook } from 'coinbase-commerce-node';
import { PaymentCreate, PaymentResponse, WebhookEvent } from '../types/payment';
import { Order } from '../models/Order';
import { EmailService } from './emailService';
import { StorageService } from './storageService';

interface Book {
  title: string;
  fileKeys: {
    PDF?: string;
    EPUB?: string;
  };
}

interface PopulatedOrder {
  bookId: Book;
}

const { Charge } = resources;
Client.init(process.env.COINBASE_API_KEY!);

interface DownloadLinks {
  PDF?: string;
  EPUB?: string;
}

export class PaymentService {
  private emailService: EmailService;
  private storageService: StorageService;

  constructor() {
    this.emailService = new EmailService();
    this.storageService = new StorageService();
  }

  async createPayment(data: PaymentCreate): Promise<PaymentResponse> {
    try {
      const chargeData = {
        name: data.bookTitle,
        description: `Purchase of ${data.bookTitle}`,
        pricing_type: 'fixed_price' as const,
        local_price: {
          amount: data.amount.toString(),
          currency: 'USD'
        },
        metadata: {
          orderId: data.orderId,
          customerEmail: data.customerEmail
        },
        redirect_url: `${process.env.FRONTEND_URL}/payment/success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/failure`
      };

      const charge = await Charge.create(chargeData);

      return {
        success: true,
        paymentUrl: charge.hosted_url,
        chargeId: charge.id
      };
    } catch (error) {
      console.error('Payment creation error:', error);
      return {
        success: false,
        error: 'Failed to create payment'
      };
    }
  }

      async handleWebhook(rawBody: string, signature: string): Promise<boolean> {
        try {
          const event = Webhook.verifyEventBody(
            rawBody,
            signature,
            process.env.COINBASE_WEBHOOK_SECRET!
          ) as unknown as WebhookEvent;

      if (event.type === 'charge:confirmed') {
        const { orderId, customerEmail } = event.data.metadata;
        
        // Update order status
        const order = await Order.findById(orderId)
          .populate('bookId')
          .exec() as PopulatedOrder | null;

        if (!order) {
          throw new Error('Order not found');
        }

        // Generate download links
        const fileKeys = order.bookId.fileKeys;
        const downloadLinks: DownloadLinks = {};

        if (fileKeys.PDF) {
          downloadLinks.PDF = await this.storageService.generateDownloadLink(
            fileKeys.PDF,
            24 * 60 * 60 // 24 hours expiry
          );
        }

        if (fileKeys.EPUB) {
          downloadLinks.EPUB = await this.storageService.generateDownloadLink(
            fileKeys.EPUB,
            24 * 60 * 60 // 24 hours expiry
          );
        }

        // Update order with payment confirmation
        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: 'completed',
          paymentChargeId: event.data.id,
          downloadLink: JSON.stringify(downloadLinks),
          downloadExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
        });

        // Send email with download links
        await this.emailService.sendDownloadLinks({
          email: customerEmail,
          bookTitle: order.bookId.title,
          downloadLinks,
          expiryTime: '24 hours'
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error('Webhook processing error:', error);
      return false;
    }
  }

  validateSignature(signature: string, rawBody: string): boolean {
    try {
      Webhook.verifyEventBody(
        rawBody,
        signature,
        process.env.COINBASE_WEBHOOK_SECRET!
      );
      return true;
    } catch {
      return false;
    }
  }
}