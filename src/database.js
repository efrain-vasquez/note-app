//este archivo es para tener connecxtion a una base de datos y este archivo ser utilizado por index.js
//en esta aplicacion vamos a utilizar mongoDB como el base de datos 
//cuando hemos instalado el package.json mongoose es un modolo para conectarnos a mongoDB no es la base de datos
//tienes que instalar monogoDB por aparte una vez intalado pudes iniciar monogoDB
//para iniciar mongoDB en la terminal ponemos sudo service mongod start

const mongoose = require('mongoose');

//mongoose.set('useFindAndModify', false);
//este metedo nos permite conectarnos a una direccion de internet
//en este caso mongoDB se a instalado dentro de mi propia maquina local por eso le dicimos mongoDB connectate 
//al localhost y al nombre de la base de datos que es node-notes-db
//finalmente le colocar un objecto para configurarlo /porque necesitamos esta configuracion asi a mongoose
//porque el modolo esta actalizando ultimamente y necesita unas cuantas configuraciones si no te va 
//dar un error por consola
mongoose.connect('mongodb://localhost/node-notes-db', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
  //una vez que hace la conexion quiero ver un mensaje por consola
  //etonces voy a ejecutar una promesa y voy a dicirle cuando te conectes muestame un mensaje que dice 
  //'DB is connected'
  .then(db => console.log('DB is connected'))
  //caso contrario si ocurio un error captura ese error y muestamelo tambien por consola
  .catch(err => console.error(err));
  //para ejecutar esto tenemos que llamarlo desde index.js

  