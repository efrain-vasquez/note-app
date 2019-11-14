//aqui el usario va poder aceder a nas url's adonde el se puede autenticar y registrar el usario
//por ejemplo /login o /signin o /register o /signup

const express = require('express');
//este router nos permite tener un objecto que nos puede facilitar la creacion de rutas del servidor
const router = express.Router();

router.get('/users/signin', (req, res) => {
    res.send('singresando a la app');
  });

router.get('/users/signup', (req, res) => {
    res.send('formulario de authenticacion');
});


module.exports = router;