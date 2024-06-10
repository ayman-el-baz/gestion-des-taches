const Task = require('../models/Task');

// Créer une nouvelle tâche
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;
    const userId = req.user.user_id;

    const task = new Task({
      title,
      description,
      dueDate,
      status,
      userId,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur est survenue. Veuillez réessayer plus tard.");
  }
};

// Récupérer toutes les tâches de l'utilisateur
exports.getUserTasks = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const tasks = await Task.find({ userId });
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur est survenue. Veuillez réessayer plus tard.");
  }
};

// Mettre à jour une tâche
exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.user_id;

    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).send("Tâche non trouvée");
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur est survenue. Veuillez réessayer plus tard.");
  }
};

// Supprimer une tâche
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.user_id;

    const task = await Task.findOneAndDelete({ _id: taskId, userId });

    if (!task) {
      return res.status(404).send("Tâche non trouvée");
    }

    res.status(200).send("Tâche supprimée avec succès");
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur est survenue. Veuillez réessayer plus tard.");
  }
};
