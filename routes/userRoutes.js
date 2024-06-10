const express = require('express');
const { deleteUser } = require('../controllers/userController'); // Créez ce contrôleur
const router = express.Router();

router.delete('/delete', deleteUser);

module.exports = router;
