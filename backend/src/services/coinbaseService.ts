import { Client, resources, Webhook } from 'coinbase-commerce-node';

type PricingType = 'no_price' | 'fixed_price';
const PricingType = {
  NoPrice: 'no_price' as const,
  FixedPrice: 'fixed_price' as const
};

Client.init(process.env.COINBASE_API_KEY!);
const { Charge } = resources;

export class CoinbaseService {
  async createCharge(order: any) {
    try {
      const chargeData = {
        name: 'Infinite Drive Ebook',
        description: `Purchase of ${order.bookTitle}`,
        pricing_type: PricingType.FixedPrice,
        local_price: {
          amount: order.amount,
          currency: 'USD'
        },
        metadata: {
          orderId: order.id,
          customerEmail: order.customerEmail
        },
        redirect_url: `${process.env.FRONTEND_URL}/payment/success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/failure`
      };

      return await Charge.create(chargeData);
    } catch (error) {
      console.error('Coinbase error:', error);
      throw new Error('Payment creation failed');
    }
  }

  validateWebhook(rawBody: string, signature: string): boolean {
    try {
      Webhook.verifyEventBody(rawBody, signature, process.env.COINBASE_WEBHOOK_SECRET!);
      return true;
    } catch {
      return false;
    }
  }
}