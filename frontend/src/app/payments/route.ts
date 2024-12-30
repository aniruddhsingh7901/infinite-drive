import { NextResponse } from 'next/server';
import { generateWalletAddress, monitorPayment } from '@/lib/crypto';

export async function POST(req: Request) {
  try {
    const { email, amount, cryptocurrency } = await req.json();
    
    // Generate wallet address for payment
    const walletAddress = await generateWalletAddress(cryptocurrency);
    const paymentId = `PAY-${Date.now()}`;

    // Start monitoring this payment
    monitorPayment(paymentId, walletAddress, amount);

    return NextResponse.json({
      success: true,
      paymentId,
      walletAddress
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Payment initialization failed' },
      { status: 500 }
    );
  }
}