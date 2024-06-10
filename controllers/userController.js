const User = require('../models/User');

// Suppression du compte utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send("L'email est obligatoire");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("Utilisateur non trouvé");
    }

    await User.deleteOne({ email });

    res.status(200).send("Compte utilisateur supprimé avec succès");
  } catch (err) {
    console.error(err);
    res.status(500).send("Une erreur est survenue. Veuillez réessayer plus tard.");
  }
};
