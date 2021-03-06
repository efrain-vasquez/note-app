//este archivo es para poder arrancar nuestro servidor es el archivo principal de toda nuestra aplicacion
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

// Initializations
const app = express();
//aqui vamos a iniciar la base de datos
require('./database');
//como nuestra autenticacion esta en un archivo por separado no estamos utilizando nuestra autenticacion
//para importar lo vamos a ir aqui a decir requiero ese archivo que esta en config que se llama passport
require('./config/passport');

// settings
app.set('port', process.env.PORT || 3000);
//porque mi carpeta views esta en src necesitamos a decirle a node adone esta
//enotonces usamos un modolo llamado path y su metodo path.join que me permite unir directorios
//hay una constante en node que se llama dirname que me develve la ruta adonde se esta ejecutando  
//un derterminado archivo. es decir esta lina de codigo me serve para decirle 
//a node que la carpeta views esta en la carpeta src.
//poque estamos configurando nuestra carpeta views por que ahi iran nuestros archivos de html o
//en este caso los archivos de handlebars y handlebars tambien necesita configurarse.
app.set('views', path.join(__dirname, 'views'));
//.hbs es el nombre de como seran llamados el archivos de las vistas puede ser lo que sea pero para 
//saber que son vistas handlebars le ponemos .hbs en vez de .html
//el luego vamos a empezar a utilizar el modolo express-handlebars con el constante exphbs que usamos arriba
//que nos permite tener el motor de plantillas
app.engine('.hbs', exphbs({
    //adentro de esta funccion le damos un objecto de configuracion
    //este objecto de configuracion tiene unas propiedades
    //estas propiedades sirven para saber de que manera vamos a utilizar las vistas
    //'main' es el archivo principal 
  defaultLayout: 'main',
  //el motor de express handlebars no conoce adonde esta la carpeta layouts entonces necesitamos darle la direccion.
  //parecido como lo que hicimos con views. pero como ya hemos configurado views entonces lo que puedo hacer ahora
  //es dicerle obten la direccion de views y concatenarlo con layouts
  layoutsDir: path.join(app.get('views'), 'layouts'),
  //ahora en handlebars hay otra seccion llamada partials. partials son pequenas partes de html que nosotros 
  //podemos reutilizar en cualquer vista. 
  //para guardalo lo necesitamos colocarlo en una carpeta llamada partials 
  //y tambien necesitamos darle tambien la direccion a node
  partialsDir: path.join(app.get('views'), 'partials'),
  //esta propiedad extname sirve para colocarle que extension va tener nuestros archivos
  //ahora todas nuestros archivos terminan en .hbs no en .html 
  //entonces le decimos todos los archivos terminan en .hbs
  extname: '.hbs'
}));
//esta lina nos permite utlizar la configuracion
//la pasamos 'view engine' para configurar el motor de plantilla el motor de las vistas 
//y que motor voy a utilizar le pasamos '.hbs' 
app.set('view engine', '.hbs');

// middlewares
//este methodo .urlencoded sirve para luego cuando un formulario quiere
//enviarme un terminado dato yo pueda entender
//la opcion extended false es porque no voy a aceptar imagines ni nada de eso solo quiero sus datos
app.use(express.urlencoded({extended: false}));
//este middleware de express nos sirve para que los formularios 
//puedan enviar otros tipos de metodos no soloamente get y post sino otros metodos como put y delete
//y para hacerlo vamos a enviar un input oculto con un nombre '_method'
//este modulo se encarga de revisar por el input oculto que se encuentra en la ruta 
//router.put(notes/edit-note/:id)
app.use(methodOverride('_method'));
//un modolo de session de express
//tambien se configura con un objecto
app.use(session({
  //tenemos colocar una palabra secret que solo nosotros sabemos en este caso le llamamos 'secret'
	secret: 'secret',
	//estos dos configuraciones son por defecto
	//atravez de estas configuraciones basicas express o estas sessiones de express nos va permitir luego
	//poder autenticar el usuario y almacenar esos datos temporalmente
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
//app.use(flash) deberia ir despues de passport tambien ya que luego de passport 
//vamos enviar posiblemente mensajes 
//para poder usar connect-flash necesitamos utilizarlo aqui como middleware
//nos permite enviar unos mensajes que los datos estan siendo guardados o editados o eliminados
//pero para que toda las vistas tengan acceso a esos mensajes  ya que si el usario navega 
//a otro pagina quiero siguir mostrando ese mensaje a pesar de navegar a una vista que no conozco
//entonces hacemos una variable global que almacene esos mensajes flash
app.use(flash());

// Global Variables
//estos son ciertos dataos que qeremos que toda nuestra applicacion tenga accesible
//cuando estamos enviando mensajes yo quiero que todas las vistas tengan acceso 
//a un mensaje ya que si el usario navega a otra pagina quiero seguir mostrando ese mensaje
//a pesar de navegar a una vista que no conozco entonces voy hacer una variable global que almacene
//esos mensajes flash 
//para que esto no se quede aqui ya que node.js es un solo hilo esto puede hacer que el navegador 
//se quede cargando entonces asegurate de colocar el next antes de terminar la funcion para que 
//luego continue con las siguentes rutas exceder con los siguientes codigos que estan aqui debajo
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  //los mensajes flash de passport se llaman error es por eso que lo guardamos con este nombre
  res.locals.error = req.flash('error');
  //este flash message es para mostrarle al usario una bienvenida
  //este variable global va tener como valor lo que el usario se autenticado es decir cuando passport autentica
  //un usario el guarda la informacion de su usario en un objecto dentro de request entonces decimos req.user
  //y con esto stamos obentiendo la informacion del usuario y podemos utilizarla globalmente ya que estamos 
  //guardando en esta variable global pero que pasa si el usario no esta autenticado si no exsite pues vamos
  //a decirle que su valor sera nulo y con esto ahora podemos enviar un saludo
  //vamos a ir a all-notes.hbs y en esta parte donde estamos pintando las notas vamos a colocar una etiqueta
  //h1 que diga Hello {{user.name}} porque requerda que viene de la variable user
  res.locals.user = req.user || null;
  next();
});

// routes
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

// static files
//para configurar adonde estara la carpeta de archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

// Server is listening
app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
});