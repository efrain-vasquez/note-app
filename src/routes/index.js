//aqui iran las url's de mi pajina principal de mi applicacion principal
//y cualquier otra ruta que cualquier persona puede acceder

const express = require('express');
//este router nos permite tener un objecto que nos puede facilitar la creacion de rutas del servidor
const router = express.Router();

//cuando visitan la pagina principal de mi aplicacion vas a manejarlo con una funcion que maneje 
//las peticiones y las respuestas
router.get('/', (req, res) => {
    //vas a enviar un texto index
  res.send('index');
});

router.get('/about', (req, res) => {
  res.send('about');
});

module.exports = router;