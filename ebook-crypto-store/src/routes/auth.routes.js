const router = require('express').Router();
const { register, login, registerAdmin } = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.post('/register-admin', registerAdmin);

module.exports = router;