const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    tipo: {
        type: String,
        required: true,
    },
    campoExtra: {
        type: String,
        required: true,
    },
    nombre: {
        type: String,
        required: true,
    },
    precio: {
        type: Number,
        required: true,
    },
    imagen: {
        type: String,
        required: false,
    },
    descripcion: {
        type: String,
        required: false,
    },
});
const Producto = mongoose.model('Producto', productoSchema);
module.exports = Producto;