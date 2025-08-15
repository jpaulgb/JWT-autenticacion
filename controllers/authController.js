const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Registrar usuario
exports.registrarUsuario = async (req, res) => {
  const { nombre, correo, password } = req.body;

  try {
    let usuario = await Usuario.findOne({ correo });
    if (usuario) {
      return res.status(400).json({ msg: 'El correo ya está registrado' });
    }

    usuario = new Usuario({ nombre, correo, password });

    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);

    await usuario.save();

    const payload = { uid: usuario._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({
      msg: 'Usuario registrado exitosamente',
      token
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
};

// Login de usuario
exports.loginUsuario = async (req, res) => {
  const { correo, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({ msg: 'Correo o contraseña incorrectos' });
    }

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Correo o contraseña incorrectos' });
    }

    const payload = { uid: usuario._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({
      msg: 'Login exitoso',
      token
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
};