import WebSocket from 'ws';
import { BlockchainService } from './blockchainService';
import WebSocketService from './websocketService';
import Order from '../models/orderModel'
import { getRepository } from 'typeorm';


const BLOCKCYPHER_WS_URL = 'wss://socket.blockcypher.com/v1/btc/main';

async function getOrderByAddressAndCurrency(address: string, currency: string): Promise<Order | undefined> {
    const orderRepository = getRepository(Order);
    return (await orderRepository.findOne({ where: { payment_address: address, payment_currency: currency } })) ?? undefined;
}

class BlockCypherWebSocketService {
    private ws: WebSocket;
    // private blockchainService: BlockchainService;
    private webSocketService: WebSocketService;

    constructor(webSocketService: WebSocketService) {
        this.ws = new WebSocket(BLOCKCYPHER_WS_URL);
        // this.blockchainService = blockchainService;
        this.webSocketService = webSocketService;

        this.ws.on('open', () => {
            console.log('Connected to BlockCypher WebSocket----');
        });

        this.ws.on('message', async (data) => {
            const message = JSON.parse(data.toString());
            console.log('Received message from BlockCypher:', message);

            // if (message.event === 'confirmed-tx') {
            //     const { address, confirmations, total, hash, currency } = message;

            //     // Fetch the order by address and currency
            //     const order = await getOrderByAddressAndCurrency(address, currency);

            //     if (!order) {
            //         console.error('Order not found for address:', address);
            //         return;
            //     }

            //     // Update payment status based on confirmations (requiring 6 confirmations)
            //     const REQUIRED_CONFIRMATIONS = 6;
            //     if (confirmations >= REQUIRED_CONFIRMATIONS) {
            //         // Update order status to 'completed'
            //         order.status = 'completed';
            //         await getRepository(Order).save(order);

            //         this.webSocketService.broadcast('paymentStatus', { orderId: order.id, status: 'completed', txHash: hash });
            //     } else {
            //         // Update order status to 'confirming'
            //         order.status = 'confirming';
            //         await getRepository(Order).save(order);

            //         this.webSocketService.broadcast('paymentStatus', { orderId: order.id, status: 'confirming', confirmations });
            //     }
            // }
        });

        this.ws.on('close', () => {
            console.log('Disconnected from BlockCypher WebSocket');
        });

        this.ws.on('error', (error) => {
            console.error('BlockCypher WebSocket error:', error);
        });
    }

    subscribeToAddress(address: string) {
        const message = {
            event: 'unconfirmed-tx',
            address
        };
        this.ws.send(JSON.stringify(message));
    }
}

export default BlockCypherWebSocketService;