const express = require('express');
const { createTask, getUserTasks, updateTask, deleteTask } = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth'); // Middleware d'authentification

const router = express.Router();

router.post('/tasks', authMiddleware, createTask);
router.get('/tasks', authMiddleware, getUserTasks);
router.put('/tasks/:taskId', authMiddleware, updateTask);
router.delete('/tasks/:taskId', authMiddleware, deleteTask);

module.exports = router;
