//este archivo es para poder arrancar nuestro servidor es el archivo principal de toda nuestra aplicacion
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');


// Initializations
const app = express();
//aqui vamos a iniciar la base de datos
require('./database');

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


// Global Variables
//estos son ciertos dataos que qeremos que toda nuestra applicacion tenga accesible


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