import { Router } from 'express';
import { handleBlockCypherWebhook } from '../controllers/webhookController';

const router = Router();

router.post('/blockcypher', handleBlockCypherWebhook);

export default router;