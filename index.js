const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const productosRoutes = require('./rutas/productos');
const usuariosRoutes = require('./rutas/usuarios');

const app = express();
const urlBD = 'mongodb://localhost:27017/tienda'; // MongoDB en local
//const urlBD = 'mongodb+srv://eidervalsaeupv:nckH1givlGaxDd0X@tienda.jbtxlve.mongodb.net/?retryWrites=true&w=majority&appName=tienda&ssl=true'; // MongoDB en MongoDB Atlas


// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // o el puerto de tu React
    credentials: true
  }));
app.use(express.json());
  
// Conexión a MongoDB
mongoose.connect(urlBD)
.then(() => console.log('Conexión exitosa a la base de datos MongoDB'))
.catch((err) => console.log('Error de conexión a la base de datos:', err));

const session = require('express-session');
const MongoStore = require('connect-mongo');
// Session middleware
app.use(session({
    secret: 'eider_secret', // Clave secreta para firmar la sesion
    resave: false, // No resguardar la sesión si no ha cambiado
    saveUninitialized: false, 
    store: MongoStore.create({ 
        mongoUrl : urlBD}),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1 día
            httpOnly: true,
            sameSite: 'lax',
        },  
  }));

// Rutas
app.use('/api/productos', productosRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Puerto de escucha
app.listen(5000, () => {
    console.log('Servidor escuchando en puerto 5000');
});