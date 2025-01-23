// import { Router } from 'express';
// import { addBook, getBooks, updateBook, deleteBook, getBookById } from '../controllers/bookController';
// import { authenticate } from '../middleware/authMiddleware';

// const router = Router();

// router.post('/add', addBook);
// router.get('/', getBooks);
// router.get('/books/:id', getBookById);
// router.put('/:id',updateBook); // Add this line to create the PUT endpoint
// router.delete('/:id',deleteBook);

import { Router } from 'express';
import { addBook, getBooks, updateBook, deleteBook, getBookById } from '../controllers/bookController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/add', addBook);
router.get('/', getBooks);
router.get('/:id', getBookById); // Changed to be consistent with other routes
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;