//necesitamos que cada usario puede crear sus notas personales y de esa manera sus notas no 
// interieran con las de otros usarios es decir crear como un especie de cuenta en el que cada 
// usuario puede tener sus propoias notas y sin ver las notas del resto. para hacer eso primero
// tenemos que registrar un usuario nuevo. entonces vamos a ir a las rutas de nuestro servidor en el
// archivo users aqui habiamos creado dos rutas uno para hacer ingresar al usario para acer un login (signin)
// y el otro para ser un registro (signup)


//aqui el usario va poder acceder a las url's adonde el se puede autenticar y registrar el usario
//por ejemplo /login o /signin o /register o /signup

const express = require('express');
//este router nos permite tener un objecto que nos puede facilitar la creacion de rutas del servidor
const router = express.Router();

const passport = require('passport');

//para usar el modulo de User.js vamos a tener que instanciar el modulo el mudulo del usario
//este constante user es el modelo de datos y como es el modelo de datos voy a poder utilizarlo 
//para guardar datos nuevos
const User = require('../models/User'); 

//el signin es para poder hacer que el usuario ingrese a la aplicacion 
router.get('/users/signin', (req, res) => {
    res.render('users/signin');
  });

//nuestra autenticacion esta terminada pero tenemos tan solo el metodo
//necesitamos crear las rutas que puedan autenticar esos datos como ya estan definidos simplemente los llamamos
//aqui vamos a comenzar a utilizar el metodo post vamos a decir desde la ruta /users/signin a travez del metodo
//post voy a tratar de autenticar el usario y aqui no voy a tener que escribir una fucion simplemente voy a 
//importar passport nuevamente porque estoy importando passport nuevamente aqui, 
//porque recuerda que hemos creado una estrategia de autenticacion una local strategy y entonces vamos a utilizar
//passport.authenticate y aqui adentro le voy a dar el nombre de autenticacion 
//como se llama el nombre de autenticacion si vamos a passport.js que esta en config vemos que por defecto
//este lo coloc el nombre del local entonces vamos a decirle la manera que se va autenticar el usario es con local
//y a darle esto de aqui el va aplicar la funcion que hemos escrito en passport.use en el archivo config
//y luego lo va almacenar en una sesion y por eso que nosotros nos evitamos ese trabajo porque passport solo
//lo va ser por nosotros adicional a esto cuando se autentica puede pasar algunas cosas puede que el usario 
//sea correcto puede que el usario es insertado datos mal entonces nosotros vamos a tratar de darle o decirle 
//que es lo que debe de hacer passport a donde lo debe redireccionar 
router.post('/users/signin', passport.authenticate('local', { 
  //le voy a decir si el usario me esta enviando su contrasena y su email correcto entonces es un successRedirect
  //entonces lo voy a redireccionar a las notas para que pueda ingresar sus notas y que pueda empezar agregar
  //y empiece a crear datos
  successRedirect: '/notes',
  //luego puede pasar un proceso contrario un failureRedirect que pasa si el usario me esta insertando una contrsena
  //y un correo mal pues lo voy a redireccionar al /users/signin nuevamente para que se vuelva registrar quizas
  //lo hizo mal o quizas se equivoco 
  failureRedirect: '/users/signin',
  //finalmente voy a pasarle un dato mas llamado failureFlash para que sirve esto para que nosotros entre esos
  //autenticacion podemos enviar estos mensajes flash y le decimos true. simplemente guardamos y con esto tenemos 
  //nuestra autenticacion
  failureFlash: true
}));

  // necesitamos que cada usario puede crear sus notas personales y que de esa manera sus notas 
  // no interfieran con las notas de otros usarios es decir crear como un especie de cuenta en el que 
  // cada usario puede tener sus propias notas y sin ver las notas del resto entonces para ser eso 
  // primero tenemos que registrar un usario nuevo y esto lo hacemos aqui en routes/users

//el signup es para que el usuario se pueda registrar
router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

// al momento de seleccionar el boton de signup que esta en la ruta users/signup a donde va recibir
// esos datos. vamos a crear ora ruta para signup esta ruta sera especial para recibir tan solamente los datos 
// vamos a recibir los datos atravez de un metodo post a users/signup. puedes notar que se ven igual las rutas
// de hecho son iguales pero como estan con diferentes metodos no van a ser afectadas 
// tambien podrias cambiar la ruta no hay ningun problema pero incluso si son iguales como estan pidienso sea a 
// distintos metodos http pues no va a afectar se una con la otra porque son a travez de distintas peticiones
// entonces aqui vamos a crear otra peticion y a esta ruta es donde el usario o el formulario va tener que enviiar 
// sus datos. entonces en signup.hbs el formulario va a apuntar a /users/signup y tambien cual metodo esta usando
// y aqui en el servidor, en esta ruta a travez del metodo POST estamos recibiendo esos datos 
router.post('/users/signup', async (req, res) => {
  // voy a crear un arreglo que almacene estos errores 
  // algo muy similar como hicimos cuando estamos recibiendo la nueva nota
  const errors = [];
  //console.log(req.body);
  // si vamos al servidor vemos los datos que nos esta enviando el usario
  // estos datos son los que queremos validar
  // desde req.body quiero empezar a utilizar estos datos especificamente cada uno por separado guardarlo 
  // en una constante entonces le digo de req.body quiero el name, el email, el password, y el confirm password
  // estos nombres vienen de los datos que me esta enviando el usario usando el formulario
  const { name, email, password, confirm_password } = req.body;
  ///console.log(req.body)
  // vamos a agregar una validacion por si el nombre esta vacio el formulario no sea validado
  if (name.length <= 0) {
    errors.push({text: 'Please enter your Name!'});
  }
  // y vamos a agregar una validacion por si la longituds de el password y el longitud de confirm_password 
  // sean cero no querimos que sean validados.
  if ((password.length <= 0) && (confirm_password.length <= 0)) {
    errors.push({text: 'Please enter Password and Confirm Password!'});
  }
  // voy a utilizar estas variables. voy a decir si password es distinto de
  // confirm password significa que las contrasenas son distintas
  if (password != confirm_password) {
    // entonces vamos a decir const errores que sea un arreglo y voy a decir errors.push() y le voy 
    // a dar aqui el error le voy a decir text: 'Passwords do not match!'
    errors.push({text: 'Passwords do not match!'});
  }
  // tambien voy a crear otro if para confirmar si la contrasena es mayor a 4 caracteres entonces le voy a decir
  // si la contrasena en su longitud es menor a 4 caracteres, entonces le voy a decir aqui dentro de este
  // password.length le voy a decir errors.push() para insentar el error dentro del del arreglo voy a decir
  // que el texto sera de {text: 'Password must be at least 4 characters!'} para que el usario vea el error 
  // y pueda volver a insartar la contrasena
  if (password.length < 4) {
    errors.push({text: 'Password must be at least 4 characters'});
  }
  // finalmente vamos a colocar una ultima validacion que haga referencia a si exsiten errores o no es 
  // decir si el arreglo de errores en su longitud es mayor a cero pues lo que vamos hacer es renderizar 
  // nuevamente la vista y renderizar en este caso users/signup nuevamente pero con los errores
  // de nuevo esto es muy similar de lo que habiamos hecho con las notas entonces aqui le voy a pasar 
  // los siguientes datos (los errors, luego los datos que el usario me a pasado de nuevo es decir 
  // el name, email, password, y confirm_password) para que no los vuelva a insertar en este caso
  if (errors.length > 0) {
    // algo importante nosotros ya no tenemos que volver a pintar el error o volver a empezar a 
    // recorrer el error en la vista de /users/signup porque nosotros habiamos escrito en /notes/new-note
    // al momento de agregar una nueva nota habia escrito un mensaje para un error entonces voy a crear 
    // un partials con este codigo  
    res.render('users/signup', {errors, name, email, password, confirm_password});
  // y caso contrario si todo ha ido bien le voy a responder con un ok
  } else {
    // para evitar que un usario inserta un email repetido dimple vamos a validar eso usando el metodo
    // findOne() que busca si hay algun dato igual al que me esta dando el usario y como toma tiempo usamos await
    // y cuando termine de buscar el dato me va retornar posiblemente enl correo del usario 
    // y lo voy a guardar en una constante
    const emailUser = await User.findOne({email: email});
    // y aqui lo voy a comprobar si email existe es decir si a encontrado una coincidencia con el correo 
    if(emailUser) {
      // pues voy a enviar un req.flash() un mensaje de flash un mensaje por pantalla que le diga 
      // 'error_msg' y como valor le voy a decir 'The Email is already in use!'
      req.flash('error_msg', 'The Email is already in use');
      // y tambien lo vamos a redireccionar de nuevo a la misma vista users/signup para que nuevamente
      // vuelva a insartar los datos 
      res.redirect('/users/signup');
    }
    // una vez que todo sea validado vamos a guardar los datos. no los podemos guardar en Note.js porque este 
    // es tan solo el esquema para las notas vamos a crear una esquema mas y esta esquema se va llamar 
    // user.js y al iguar que las notas vamos a tener que crear un esquema desde cero
    // para usar el modulo de User.js vamos a tener que instanciar el modulo el mudulo del usario
    // el constante user es el modelo de datos y como es el modelo de datos voy a poder utilizarlo 
    // para guardar datos nuevos. entonces lo primero que quiero hacer es guardar el nuevo user
    // asi que voy a decir new User() voy a crear un nuevo usario con los datos name, email,
    // password, y confirm_password. y con esto me va generar un objecto nuevo al igual que las notas
    const newUser = new User({name, email, password});
    // con este nuevo usario que es lo que voy hacer pues guardar lo y esto de nuevo va tomar su tiempo 
    // entonces le voy a decir await y a la funcion principal le voy a dar la palabra async
    // entonces con esto me estoy guardando mi usario, pero paso algo aqui no estoy guardando la contrasena cifrada
    // pero necisito guardar la contrasena cifrada, entonces la guardo de esta manera le digo newUser.encryptPassword()
    // y aqui adentro le voy a pasar la contrasena y esto como va tomar su tiempo le voy a decirle await
    // porque el momento de poder cifrar la contrasena va tomar su tiempo, pues voy a almacenarlo 
    // en el mismo lugar usando newUser.password. 
    // es decir yo voy a crear un objecto con los datos que le pasamos a la instancia de newUser 
    // me va crear un objecto de newUser
    // luego de ese objecto su propiedad password lo voy a reemplazar por la contrasena cifrada
    // utilizando el metodo encryptPassword() 
    newUser.password = await newUser.encryptPassword(password);
    //finalmente lo voy a guardar y cuando se guarde
    await newUser.save();
    // le voy a enviar un mesaje flash a la aplicacion es decir un mensaje que sea 'success_message',
    // y que diga 'You are registered'
    req.flash('success_msg', 'You are registered');
    // y al final vamos a redireccionarlo al users/signin para que pueda ingresar a la aplicacion
    // pues ya que esta registrado lo regresamos al login
    res.redirect('/users/signin');
  }
});

//cuando pidan la ruta /users/logout vamos a hacer una funcion (req, res) es decir un manejador de funciones
//y lo que vamos hacer aqui es simplemente utilizar un metodo que viene desde passport que nos permite terminar
//con la sesion
router.get('/users/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out now.');
  //y cuando termine la sesion voy a redireccionar hacia la pagina de /users/signin
  res.redirect('/users/signin');
});


module.exports = router;

 