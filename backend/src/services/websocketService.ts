import { Server } from 'http';
import WebSocket from 'ws';

class WebSocketService {
    private wss: WebSocket.Server;

    constructor(server: Server) {
        this.wss = new WebSocket.Server({ server });

        this.wss.on('connection', (ws: WebSocket) => {
            console.log('New client connected');

            ws.on('message', (message: string) => {
                console.log('Received message:', message);
            });

            ws.on('close', () => {
                console.log('Client disconnected');
            });

            ws.on('error', (error) => {
                console.error('WebSocket error:', error);
            });
        });
    }

    broadcast(event: string, data: any) {
        const message = JSON.stringify({ event, data });
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }
}

export default WebSocketService;