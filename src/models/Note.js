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
  },
  // cuando el usario a ingresado la aplicacion no deberia ver las notas de otros usarios
  // ya que cada usuario deberia tener sus propias notas entonces si no quiero ver esto lo que voy a 
  // hacer es enlanzar cada nota con el id del usuario
  // vamos a crear una propiedad llamada user, aqui nosotros podriamos amacenar el object id de cada usario
  // para cada nota es decir cada nota estara enlazada a un id de usuario pero en este caso voy a serlo
  // mucho mas sencillo voy a crear un tipo de datos string y lo que voy hacer es que este user va almacenar ese 
  // id de usuario ahora en que momento va almacenar este nuevo id, en el momento que se crea una nota nueva 
  // es decir voy a ir en las rutas de notes en routes/notes.js y voy a buscar esa seccion en donde se crea
  // la nota nueva vamos a ir en la seccion post ya que es en esa parte adonde se crea.
  user: { type: String }
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


