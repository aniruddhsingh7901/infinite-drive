const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');
const {
    getAllUsers,
    addBook,
    updateBook,
    deleteBook,
    getAllOrders
} = require('../controllers/admin.controller');
const multer = require('multer');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/private/books');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Admin routes
router.get('/users', auth, isAdmin, getAllUsers);
router.post('/books', auth, isAdmin, upload.single('book'), addBook);
router.put('/books/:id', auth, isAdmin, updateBook);
router.delete('/books/:id', auth, isAdmin, deleteBook);
router.get('/orders', auth, isAdmin, getAllOrders);

module.exports = router;