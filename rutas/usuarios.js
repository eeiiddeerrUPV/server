const express = require('express');
const router = express.Router();
const Usuario = require('../modelos/Usuario'); // Aquí importas el modelo de usuario

// Ruta para obtener todos los suarios
router.get('/', async (req, res) => {
  try {
      const usuarios = await Usuario.find(); // Obtiene todos los usuarios de la base de datos
      res.json(usuarios); // Devuelve los usuarios en formato JSON
  } catch (err) {
      res.status(500).json({ mensaje: 'Error al obtener usuarios', error: err });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }
    // Crear sesión
    req.session.usuario = usuario;
    req.session.visitas = 0; // Creamos el contador para inicializarlo al obtener sesion
    res.json({ mensaje: 'Login exitoso', email: usuario.email });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al iniciar sesión', error });
  }
});

// Comprobar si el usuario tiene una sesión activa
router.get('/sesion', (req, res) => {
  if (req.session.usuario) {
    // Incrementamos la variable de visitas dentro de la sesión
    req.session.visitas += 1;
    res.json({ 
      nombre: req.session.usuario.nombre,
      telefono: req.session.usuario.telefono,
      direccion: req.session.usuario.direccion,
      email: req.session.usuario.email,
      fechaNacimiento: req.session.usuario.fechaNacimiento,
      rol: req.session.usuario.rol,
      visitas: req.session.visitas
    });
  } else {
    res.status(401).json({ mensaje: 'No autenticado' });
  }
});


// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error al cerrar sesión' });
    }
    res.clearCookie('connect.sid');
    res.json({ mensaje: 'Sesión cerrada' });
  });
});


// Modificar datos del usuario logueado
router.put('/editarDatosUsuario', async (req, res) => {
  const { nombre, telefono, direccion, fechaNacimiento } = req.body;
  const email = req.session.usuario.email; // clave única
  try {
    const usuarioActualizado = await Usuario.findOneAndUpdate(
      { email }, // buscar por email
      { nombre, telefono, direccion, fechaNacimiento }, // nuevos datos
      { new: true }
    );
    // Actualizamos también los datos de la sesión
    req.session.usuario = usuarioActualizado;
    res.json({ mensaje: 'Datos actualizados correctamente', usuario: usuarioActualizado });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al actualizar datos', error: err });
  }
});


module.exports = router;
