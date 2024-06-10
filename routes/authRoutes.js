const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Routes d'authentification
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/users', authController.getAllUsers); 
router.post('/forgot-password', authController.forgotPassword);

module.exports = router;
