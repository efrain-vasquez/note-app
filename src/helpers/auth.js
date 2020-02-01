// esta carpeta es para asegurar nuestras rutas
// helpers sera un objecto con multiples funciones o multiples metodos 
const helpers = {};

// en este caso puede decir voy a colocar un metodo nuevo que es 
// helpers.isauthenticate para comprobar luego si el usario esta autenticado
// o no y que sera esto pues en teoria esto es un middleware tambien un middleware es una fucion que se ejecuta
// dependiendo de lo que pasemos entonces aqui yo quiero comprobar si el usario esta autenticado
// si exsite una sesion o no es por eso que voy a tomar un (req, res, next) eso sera un funcion 
helpers.isAuthenticated = (req, res, next) => {
// y en passport tenemos un modulo o metodo que hace esta autenticacion revisa si existe una sesion o no para
// que nosotros no lo hagamos desde cero y decimos aqui si req.isAuthenticated() asi se llama la funcion que viene
// de passport esto me retorna un true o false. si el usario se ha logiado me va devolver un true si el usario
// no se a logiado me va devolver un false  
  if (req.isAuthenticated()) {
    // si si se ha logiado pues vamos a retornar un next que continue con la siguiente funcion 
    return next();
  }
  // caso contrario si no se ha logiado pues nosotros vamos a empezar a enviar un error  
  req.flash('error_msg', 'Not Authorized.');
  // y redirrecionarlo a una ventana de login
  res.redirect('/users/signin');
};

module.exports = helpers;