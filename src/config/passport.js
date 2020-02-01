// queremos enviar los datos al backend cuando el usario inserta sus datos en el formulario de signin
// para ser validados. para hacer esto vamos a utilizar un paquete llamado passport y otro paquete llamado 
// passport-local. estos paquetes nos permite autenticar al usario. estos paquetes sirven para 
// que luego cuando el usario se autentica tener una maner de no solamente confirmar si puede ingresar o no 
// sino tambien guardar sus datos en una sesion de esa manera nosotros no tenemos que estar pidiendo a cada momneto 
// los datos del usario 

//este modulo me sirve para poder utilizar una manera de autenticar el usario 
const passport = require('passport');
//en este caso lo voy a autenticar usando la autenticacion local usando passport-local
//y tan solo quiero la estrategia de autenticacion
const LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');
const User = require('../models/User'); 

//passport.use este methodo es para poder definir una nueva estrategia de autenticacion
//y le digo (new LocalStrategy)
//y aqui adentro de digo algunos parametros que el usario va enviar cuando se quiere autenticar
passport.use(new LocalStrategy({
  //usernameField: atravez de que se va autenticar el usario
  usernameField: 'email'
  //adicional a esto voy a ejecutar una funcion para poder validarlo entonces a continuacion
  //del objecto voy a colocar una coma y una funcion esta funcion vamos a ejecutarla y
  //con esta funcion vamos a empezar a recibir los datos 
  //es decir voy a recibir un correo una contrasena y un callback para terminar con la autenticacion
  //en este momento solo estoy definiendo la autenticacion es decir esto de aqui voy a tener que utilizar en una ruta
  //y tambien voy a utilizar metodos asincronos asi que voy a colocarle un async y aqui adentro de la
  //autenticacion voy a empezar a buscar en la base de datos y 
  //empezar a ver si el usario que me esta ingresando con su correo existe en la base de datos 
  //si la contrasena es valida con lo que tengo en la base de datos etc...
}, async (email, password, done) => {
  //entonces voy a tener que consultar con la base de datos por eso voy a traer el modelo User
  // Match Email's User
  //como es el modelo de datos le digo User.findOne y que es lo que quiero buscar, quiero buscar el correo
  //el correo que me esta dando el usario entonces le paso el email de esta manera {email: email}
  //adicional a esto pues ya estoy buscando el correo pero esto va tomar tiempo entonces le digo await
  //cuando esto termine me va devolver un resultado, posiblemente me devuelve un usario
  //porque estoy buscando un usuario a travez del correro 
  const user = await User.findOne({email: email});
  //y aqui debajo voy a hacer esa comprobacion le digo si no existe un usario dentro de la base de datos
  //entonces significa que esta persona se esta intentando autenticar sin un correo valido entonces
  //voy a retornar todo este proceso de autenticacion con este callback done
  //este callback sirve para terminar el processo de autenticacion y como puede terminar
  //puede terminar con algun error con ningun usario o puede terminar con un mensaje de error
  //en este caso le voy a enviar null para el usario false para el error ya que no ha sido un error sino que
  //ese usario no existe y el mensaje le voy a enviar { message: 'User not found.' }
  if (!user) {
    return done(null, false, { message: 'User not found.' });
  //que pasa si encontro un usario pues lo que vamos a hacer ahora es si encontro el usario empezar a validar
  //su contrasena. y recuerda que habiamos creado un metodo desde el modelo llamado matchPassword 
  //este matchPassword recibio una contrasena y me retornaba true o false si existia esa contrasena o no
  //como es una consulta va tomar tiempo asi voy a decirle await y esto me va retornar como resultado 
  //un match o me va retornar si un resultado de verdad o falso. 
  } else {
    // Match Password's User
    //este metodo no es de el propio modulo es de la instancia de la clase entonces una vez que esta 
    //instanciado pues puedo llamar ese metodo
    const match = await user.matchPassword(password);
    //entonces en este caso simplemete voy a decirle si match es verdad entonces voy a retornar con el callback done
    //si no hay ningun error le estoy colocando null y le estoy devolviendo user ya que esto me devolvio true
    //significa que la contrasena que el usario ha ingresado mas el correo que se ha encontrado entonces todo 
    //esta valido entonces le estoy devolviendo el usario
    if(match) {
      return done(null, user);
    //que pasa sin ninguno de la contrasena o el correo es correcto pues significa que su contrasena es incorrecta
    //asi que voy a retornar en un mensaje le voy a decir return done 
    //si le devuelve null significa que no ha habido ningun error si le devuelve false significa que no hay
    //ningun usario y finalmente puedes enviar un mensaje de vuelta que diga { message: 'Incorrect Password.' } 
    } else {
      return done(null, false, { message: 'Incorrect Password.' });
    }
  }
}));
//una vez ue el usario se autentica el usario va a tener que ser almacenado en algun lugar 
//y es por eso que nosotros vamos a tratar de utilizar una manera de poder almacenarlo en una sesion
//entonces vamos a utilizar aqui otra configuracion que solicita passport llamada passport.serializeUser
//este metodo toma un usario y tomar un callback lo que vamos hacer aqui es pasar este callback
//ejecutar el callback con un error null en este caso porque no hay ningun error pero con un usario id
//es decir que el momento que el usario se autentique nosotros vamos a almacenar en una sesion el id 
//del usario para que en proximas sesiones nosotros podamos evitar estar pidiendo el cada momento que
//visita una pagina el login ya que se ha autenticado una vez pues ya sabemos que es el
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//adicional a esto vamos a crear un ultimo metodo que esta relacionado con el anterior llamado .deserializeuser
//lo que hace esto es el proceso inverso toma un id y genera un usario
//este metodo toma un id y un callback 
passport.deserializeUser((id, done) => {
  //y hace de nuevo una busqueda a la base de datos decimos User.findById y lo que vamos hacer es tomar el id de la
  //sesion y luego vamos a retornar un error quizas es decir la consulta va tomar tiempo tambien 
  //podriamos utilizar async await pero vamos hacerlo tal cual la documentacion entonces lo que estoy haciendo
  //aqui es el proceso inverso si hay un usario en la sesion lo que voy a hacer es buscar por id ese 
  //usario y si lo encuentro en la busqueda puede obtener dos cosas puede obtener un error o puede encontrarlo
  //si lo encuentro voy a obtener ese usario y lo voy a retornar con el callback o es decir no hay ningun error
  //bueno si lo hay lo devuelvo y si hay un usario lo devuelvo tambien 
  //en el proceso anterior si el usario pudo iniciar sesion (logguiar) lo almacenamos en sesion su id
  //luego si nosotros queriamos deserializer el usario el proceso inverso tomamos el id y generamos un usario 
  //para poder utilizar sus datos con esto ya tenemos nuestra manera de autenticar
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

//para utilizar esta autenticacion tenemos que aplicar una cuantas configuraciones en index.js
//tenemos que require passport y
//vamos a ir a donde tenemos nuestras middleware y utilizar unas cuantas configuraciones y ojo 
//debe ir despues de express sesion de el middleware session app.use(session) 