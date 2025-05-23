const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    telefono: {
        type: Number,
        required: false,
    },
    direccion: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
    },
    fechaNacimiento: {
        type: String,
        required: false,
    },
    rol: {
        type: String,
        required: true,
    },
});
const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;
