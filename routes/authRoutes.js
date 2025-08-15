const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const { registrarUsuario, loginUsuario } = require('../controllers/authController');
const validarJWT = require('../middleware/validarJWT');

const router = Router();

// Middleware para validar campos
const validarCampos = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Rutas
router.post('/register', [
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('correo', 'Correo no válido').isEmail(),
  check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
  validarCampos
], registrarUsuario);

router.post('/login', [
  check('correo', 'Correo requerido').isEmail(),
  check('password', 'La contraseña es obligatoria').not().isEmpty(),
  validarCampos
], loginUsuario);

// Ruta protegida de ejemplo
router.get('/perfil', validarJWT, (req, res) => {
  res.json({
    msg: 'Accediste al perfil',
    usuarioId: req.uid
  });
});

module.exports = router;