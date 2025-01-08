import { Router } from 'express';
import { addBook, getBooks, updateBook, deleteBook, getBookById } from '../controllers/bookController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/add', addBook);
router.get('/', getBooks);
router.get('/:id', getBookById);
router.put('/:id', updateBook); // Add this line to create the PUT endpoint
router.delete('/:id', deleteBook);

export default router;