//vamos a requerir mongoose no para conectarnos a la base de datos si no para eso ya lo emos hecho
const mongoose = require('mongoose');
//vamos a requirir mongoose poque tambien sirve para crear esquemas de datos
const { Schema } = mongoose;
//y lo vamos a guardar en un constante para poder utilizarlo 
//lo que voy hacer aqui es definir como van a lucir mis notas que propiedades van a tener 
//porque necesito guardar este esquema porque este esquema esta solo para decirle a mongoDB 
//como van a lucir mis datos aun no saben como crear el modelo 
const NoteSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

//voy a utilizar desde mongoose el modelo para utlizar el modelo necesito dos cosas
//la nota y el esquema el esquema ya lo tengo esta en NoteShema peo el nombre le voy a dar Note
module.exports = mongoose.model('Note', NoteSchema);

// como podemos comprobar si es insertado el dato correctamente
// pues simplemente abrimos un terminal y nos conectamos a mongoDB
// mongoDB ya esta inicializado simplemente vamos a ejecutar su cliente llamado: mongo
// en la terminal teclear: 
// mongo 
// presionar enter 
// y vamos a escribir use (luego el nombre de nuestro base de datos)
// use notes-db-app 
// presionar enter
// despues teclear:
// show collections
// dice hay una collection llamada notes
// teclear:
// db.notes.find().pretty()
// presionar enter y aqui estan amacenados los datos dentro del base de datos


