const express = require('express');
const router = express.Router();
const Producto = require('../modelos/Producto'); // Aquí importas el modelo de producto


const multer = require('multer');  // Importamos multer para la carga de archivos
const path = require('path');
// Función reutilizable para obtener el nombre de la carpeta según el tipo de producto
function obtenerCarpetaTipoProducto(tipoProducto) {
  switch (tipoProducto) {
    case 'JuegoDeMesa':
      return 'JuegosDeMesa';
    case 'Libro':
      return 'Libros';
    case 'Merchandising':
      return 'Merchandising';
    case 'Puzzle':
      return 'Puzzles';
    case 'Videojuego':
      return 'Videojuegos';
  }
}
// Configuración de multer para guardar las imágenes en 'client/public/imagenes'
const storage = multer.diskStorage({
     // Asignar una carpeta específica según el tipo de producto para almacenar la imagen
    destination: function (req, file, cb) {
        const tipoProducto = req.query.tipoProducto; 
        let carpetaTipoProducto = obtenerCarpetaTipoProducto(tipoProducto);
          const uploadPath = path.join(__dirname, '..', '..', 'client', 'public', 'imagenes', carpetaTipoProducto);
      cb(null, uploadPath);  // Carpeta donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));  // Usamos la fecha para evitar nombres duplicados
    },
  });
  const upload = multer({ storage: storage });
// Ruta para subir una imagen
router.post('/subir-imagen', upload.single('imagen'), (req, res) => {
    if (req.file) {
    const tipoProducto = req.query.tipoProducto;
    let carpetaTipoProducto = obtenerCarpetaTipoProducto(tipoProducto);
    // Devuelve la ruta con la carpeta correspondiente
    const imagePath = `/imagenes/${carpetaTipoProducto}/${req.file.filename}`;
    res.status(200).json({ message: 'Imagen subida exitosamente', path: imagePath });
  } else {
    res.status(400).json({ message: 'No se seleccionó una imagen válida' });
  }
});




// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const productos = await Producto.find(); // Obtiene todos los productos de la base de datos
        res.json(productos); // Devuelve los productos en formato JSON
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener productos', error: err });
    }
});

// Ruta para crear un nuevo producto
router.post('/', async (req, res) => {
    try {
      const nuevoProducto = new Producto(req.body);
      await nuevoProducto.save();
      res.status(201).json({ mensaje: 'Producto creado correctamente', producto: nuevoProducto });
    } catch (err) {
      res.status(400).json({ mensaje: 'Error al crear producto', error: err });
    }
  });
  
// Ruta para eliminar productos seleccionados
router.delete('/', async (req, res) => {
  const { ids } = req.body; // Los ids de los productos que queremos eliminar
  try {
      // Elimina los productos cuyos ids están en el array 'ids'
      await Producto.deleteMany({ _id: { $in: ids } });
      res.status(200).json({ mensaje: 'Productos eliminados correctamente' });
  } catch (err) {
      res.status(500).json({ mensaje: 'Error al eliminar productos', error: err });
  }
});

// Ruta para modificar un producto
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizados = req.body;
    const producto = await Producto.findByIdAndUpdate(id, datosActualizados, { new: true });
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res.status(200).json({ mensaje: "Producto actualizado", producto });
  } catch (err) {
    res.status(400).json({ mensaje: "Error al actualizar producto", error: err });
  }
});

module.exports = router;
