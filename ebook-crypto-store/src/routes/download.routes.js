const router = require('express').Router();
const { downloadBook } = require('../controllers/download.controller');

router.get('/:token', downloadBook);

module.exports = router;