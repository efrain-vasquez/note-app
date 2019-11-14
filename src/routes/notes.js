//aqui iran tan solo las url's o las rutas de mi servidor para que el usario pueda criar o manejar
//sus notas criar una nueva nota eliminar una nueva nota actualizar una nueva nota 

const express = require('express');
//este router nos permite tener un objecto que nos puede facilitar la creacion de rutas del servidor
const router = express.Router();

router.get('/notes', (req, res) => {
    res.send('notes from database');
  });


module.exports = router;