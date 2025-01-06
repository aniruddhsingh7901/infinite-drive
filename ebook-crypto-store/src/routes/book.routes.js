const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const { getAllBooks, getBook, addBook } = require('../controllers/book.controller');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../private/books'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
});

router.post('/', auth, upload.single('bookFile'), addBook);

router.get('/', getAllBooks);
router.get('/:id', getBook);
router.post('/', auth, upload.single('bookFile'), addBook);

module.exports = router;