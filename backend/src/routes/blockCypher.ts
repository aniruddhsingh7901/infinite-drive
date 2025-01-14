import { Router } from 'express';
import { handleBlockCypherWebhook , checkWebhookRegistration} from '../controllers/webhook';

const router = Router();

router.post('/blockcypher', handleBlockCypherWebhook);
router.get('/check', checkWebhookRegistration);

export default router;