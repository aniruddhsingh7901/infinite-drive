import { Router } from 'express';
import { DownloadController } from '../controllers/downloadController';

const router = Router();
const downloadController = new DownloadController();

router.get('/:token', downloadController.downloadBook);

export default router;