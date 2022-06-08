const express = require('express');
const app = express();

// Settings: A la variable port lr asignamos el puerto
app.set('port', process.env.PORT || 3000);

// Middlewares (Funciones que de ejecutan antes de que llegemos a las funcionalidades de las rutas)
//app.use(express.json());

// Routes
app.use(require('./routes'));

// Starting the server en el puerto que declaramos arriba
app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});