import express from 'express';
import { bookController } from '../controllers/bookController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBookById);
router.post('/', auth, bookController.addBook);

export default router;