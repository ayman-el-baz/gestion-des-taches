const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const transporter = require('../config/nodemailer');

// Enregistrement des utilisateurs
exports.register = async (req, res) => {
  try {
    const { nom, prenom, email, password } = req.body;

    if (!(email && password && nom && prenom)) {
      return res.status(400).send("Tous les champs sont obligatoires");
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("L'utilisateur existe déjà. Veuillez vous connecter.");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      nom,
      prenom,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      { expiresIn: "2h" }
    );

    user.token = token;

    await user.save(); // Stocker le token dans la base de données

    res.status(201).json({
      message: "Inscription réussie",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur est survenue. Veuillez réessayer plus tard.");
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).send("Tous les champs sont obligatoires");
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        { expiresIn: "2h" }
      );

      user.token = token;

      await user.save(); // Stocker le token dans la base de données

      res.status(200).json({
        message: "Connexion réussie",
        user,
      });
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Une erreur est survenue. Veuillez réessayer plus tard.");
  }
};



exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).send("Une erreur est survenue. Veuillez réessayer plus tard.");
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Vérifiez si l'utilisateur existe
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("Utilisateur non trouvé");
    }

    // Générer un code de récupération (par exemple un nombre aléatoire à 6 chiffres)
    const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Enregistrer le code de récupération dans la base de données
    user.recoveryCode = recoveryCode;
    await user.save();

    // Envoyer le code de récupération par email
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Code de récupération de mot de passe',
      text: `Votre code de récupération est : ${recoveryCode}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send('Erreur lors de l\'envoi de l\'email');
      }
      res.status(200).send('Code de récupération envoyé');
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Une erreur est survenue. Veuillez réessayer plus tard.");
  }
};