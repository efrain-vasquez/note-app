// una vez que todo sea validado vamos a guardar los datos. no los podemos guardar en Note.js porque este 
// es tan solo el esquema para las notas vamos a crear una esquema mas y esta esquema se va llamar 
// user.js y al iguar que las notas vamos a tener que crear un esquema desde cero entonces voy a decir 
// quiero mongoose. voy a requerir el modolo mongoose voy a guardarlo en una constante llamada mongoose 
const mongoose = require('mongoose');
// debajo desde este modolo quiero tan solo su esquema entonces voy a importar desde mongoose su esquema 
const { Schema } = mongoose;

// este modulo tiene un algoritmo que nosotros podemos utilizar para cifrar contrasenas
const bcrypt = require('bcryptjs');


// y con esto voy a empezar a crear un nuevo esquema para los usarios entoces que datos van a tener esos usarios.
// para poder utilizarlo vamos a guardarlo en una constante
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }, 
  // si la fetcha de creacion no la quieres al momento que mongoDB guarda el id de cada usario ese _id
  // que se crea por cada documento ese de alguna manera tiene la fecha de creacion asi que tampoco 
  // necesitas agregarlo si no quieres. pero para ir probabdo algunos otros tipos de datos pues vamos a 
  // utilizar la fecha. este sera type: Date y de nuevo al igual que las notas vamos a decir default: Date.now
  date: { type: Date, default: Date.now }
});

// nosotros deberiamos emperzar a descifrar las contrasenas de nuestros usarios entonces 
// voy a crear dos metodos para mis usuarios que luego voy a tener que llamar 
// como creamos metodos para este modelo de datos pues simplemete llamamos el eschema UserSchema.methods
// y a continuacion creamos el nombre del metodo

// este metodo va recibir una contrasena y nos va retornar la contrasena cifrada
UserSchema.methods.encryptPassword = async (password) => {
  // lo que voy hacer con esta contrasena es cifrar la. voy a cifrar a travez de un modolo que se llamado bycrypt.js
  // que esta en nuestro en package.json. este modolo tiene un algoritmo que nosotros podemos utilizar para cifrar contrasenas
  // este modulo lo podemos utilizar de manera asincrono tambien es decir es igual 
  // que la base de datos que toma su tiempo para generar o para hacer una tarea. bcrypt tambien puede ser asincrono
  // genSalt es para generar un hash y le digo cuantas veses quiero aplicar el algoritmo le digo aplicalo 10 veces
  // como este sera un metodo asincrono le voy a decir await y arriba le colocamos la palabra async
  // en generar ese hash va empezar a aplicar el algoritmo va tomar tiempo es por eso que le digo await
  // cuando termine me va devolver ese hash entonces voy a utilizarlo 
  const salt = await bcrypt.genSalt(10);
  // para utilizar este hash voy a tener que darselo a la contrasena 
  // y es alli donde se va generar la contrasena cifrada 
  // voy a tomar la contrasena el password y el salt lo que se a generado en la linea de arriba
  // y finalmente con esto voy a obtener la contasena cifrada 
  const hash = await bcrypt.hash(password, salt);
  // y esto es lo que voy a retornar que es un hash
  return hash;
};

// pero eso no es todo si la contrasena esta cifirada en nuestra base de datos luego el usario como 
// se va poder login ya que la contrasena es distinta de lo que el usario va insartar pues 
// ningun problema porque este mismo modolo me provee comparar comtrasenas la contrasena 
// que me de el usario con la contrasena cifrada. de manera practica lo que hace es volver a cifrar lo 
// es decir lo que el usario ingresa lo va volvera a cifrar y lo va comparar lo que ha cifrado con lo que tengo 
// en la base de datos. 
// este metodo va tomar la contrasena  y lo va comparar con lo que tengo en la base de datos 
// en este caso no voy a utilizar la funcion en flecha porque la fucion en flecha por lo general 
// pierde el scope. y en este caso necesito que la contrasena haga referencia a un elemento del UserSchema
// que es la contrasena que esta en el UserSchema y si utilizo la funcion flecha no voy a poder utilizarlo
// entonces voy a utilizar la funcion de ECMAScript 5 ya que esta funcion cuando nosotros la utilizamos 
// podemos acceder a las propiedades es decir cuando la ejecutamos el puede acceder a travez la palabra clave this
// a las propiedades de UserSchema haciendo instancia de el UserSchema. 
UserSchema.methods.matchPassword = async function (password) {
  // es decir que gracias a utilizar esta funcion de ECMAScript 5 voy a decir 
  // voy a utilizar desde bcrypt voy a utilizar su metodo compare y voy a utilizar dos cosas 
  // la contrasena que me esta dando el usario y la contrasena que tengo en el modelo de datos 
  // y eso tambien va tomar su tiempo entonces voy a decirle que es await y async arriba
  return await bcrypt.compare(password, this.password);
};

// y para utilizarlo tambien vamos a hacer un module.exports que es igual a mongoose.model() y
// le vamos a pasar dos cosas el nombre del modelo que va ser 'User' y la esquema que es UserSchema
module.exports = mongoose.model('User', UserSchema);