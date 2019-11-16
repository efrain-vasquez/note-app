//aqui iran tan solo las url's o las rutas de mi servidor para que el usario pueda criar o manejar
//sus notas criar una nueva nota eliminar una nueva nota actualizar una nueva nota 

const express = require('express');
//este router nos permite tener un objecto que nos puede facilitar la creacion de rutas del servidor
const router = express.Router();
//vamos a requerir este modelo de datos
//gracias a este constante Note yo voy a poder decir 
//Note quiero insartar un nuevo dato .save
//Note quiero actualizar un nuevo dato .update
//Note quiero eliminar un nuevo dato .delete
//gracias a este Note yo voy a poder utilizar sus metodos para guardar datos generar un nuevo dato etcetera
const Note = require('../models/Note');

router.get('/notes/add', (req, res) => {
  res.render('notes/new-note');
});

// esta routa es para recibir datos 
// cuando el formulario me envia una peticion POST you voy a recibirlo a una ruta llamada 
// notes/new-note es decir que el formulario me tiene que enviar a esta ruta para que yo pueda recibir los datos
//ahora necesito guardar los datos en la base de datos
//y como es un objecto de javascript poque tiene llaves y adentro tiene propiedades cada uno de los datos 
//que me esta enviando el usario es una propiedad en javascript podemos hacer estructura es decir poder sacar 
//cada prpiedad en una constante o variable a partir de un objecto
//la palabra async le dice a la funcion aqui adentro es abran procesos asincronos entonces yo
//para identificar esos procesos asincronos simplemente le agrego una palabra a ese proceso que es await
router.post('/notes/new-note', async(req, res) => {
  //nosotros tenemos req.body que es un objecto si queremos el titulo desde req.body, entre llaves de ese objecto
  //solo quiero el title y tambien el description desde req.body y a obtenerlos pues ahor puedo guardarlos
  const { title, description } = req.body;
  //por ahora lo voy a validar haciendo una constante llamada de error. entonces vamos a crear un arreglo
  //donde vamos a colocar los mensajes de errores en caso que existan y vamos a continuacion a validar los campos
  const errors = [];
  //vamos a decir si no hay un titulo es decir se lo que me esta enviando el usario no hay un titulo
  if (!title) {
  //o esta vacio pues vamos a insertar en este arreglo de error un nuevo mensaje un nuevo objecto tendra una
  //propiedad llamada texto y tendra como valor: por favor inserte o escrib un titulo y con esto 
  //le estamos enviando un mensaje al usario obviamente
    errors.push({text: 'Please write a Title'});
  }
  //y hacemos lo mismo por si el usario no envia una descripcion
  //y con esto ya tenemos nuestros dos errores validados.
  if (!description) {
    errors.push({text: 'Please Write a Description'});
  }
  //sabemos que es lo que le vamos a enviar
  //quizas le enviamos un solo mensaje o quizas le renderizamos toda la vista de nuevo
  //y es lo que voy hacer aqui voy a decir si el error.length del arreglo de errores es mayor a cero que significa 
  //que hay errores pues voy a renderizar res.render() (voy a renderizar de las vistas) las notas de nuevo
  //el formulario new-note recuerda que la vista new-note es el mismo formulario pero le voy a pasar ahora los errores
  //a travez de este objeto le digo que le voy a pasar a esa vista para que lo pueda mostrar en la vista tambien
  //estamos renerizando la vista de nuevo porque le podemos mostrar mensajes de alertas por ejemplo
  if  (errors.length > 0) {
    res.render('notes/new-note', {
      errors,
      // ademas de esto quisiera que el usuario no vuelva a tipear el titulo ni la descrpcion
      // entonces voy a pasarle tambien el titulo y la descripcion. y con esto lo estamos 
      // haciendo es si hay un error vamos a volver a mostrarle los campos que insertado mal y alguno 
      // mensajes de errores 
      title,
      description
    });
  //   // y en caso contrario pues que envie este mensaje de ok
  // } else {
  //   res.send('ok');
  // }

  //en lugar de enviar un ok cuando todo va bien voy a almacenarlo en la base de datos
  //primero tengo que crear un modelo de datos y para eso tenemos esta carpets llamada models
  //en models nosotros vamos a definir como van a lucir los datos y apartir de como van a lucir nosotros 
  //podemos empezarinsentar datos alli

  //para crear un nuevo data simplemente voy a tener que instanciar esa constante Note porque en 
  //realidad esa constante es una clase al crear una esquema estamos creando una especie de clase
  //y eso es lo que tenemos que instanciar aqui adentro para crear un nuevo dato
  } else {
    //dentro del esle digo new Note con esto estoy creando un nuevo dato pero recuerda que quiero
    //pasarle el titulo de la descripcion entonces entre llaves el titulo el title y el description
    //con esto ya tengo una nota nueva y puedo amacenarla en una constante llamada newNote entonces este
    //newNote es mi tarea nueva o mi nota nueva. pero todavia no esta guardada en la base de datos
    const newNote = new Note({ title, description });
    //con esto se guarda en la base de datos
    //con await ahora mi codigo sabe esto de aqui va tomar algun tiempo de ejecucion cuando termine
    //puedes continuar con el resto de codigo que este debajo entonces cuando este terminado el proceso de guardar 
    await newNote.save();
    //pues aqui debajo voy a en lugar de enviar un ok voy a redireccionar lo a otra vista 
    //voy a rediccionar lo a la vista /notes
    res.redirect('/notes');
  }
});

//esta otra ruta sera encargada de consultar todos los datos desde la base de datos 
//entonces cuando guardo un nuevo dato luego el se mostrara al usuario esa vista con la lista de los 
//datos guardados dentro de la base de datos 
router.get('/notes', async (req, res) => {
  //lo que podemos hacer partir de aqui es consultar el base de datos usando esta ruta
  //tenemos ya elmodelo note que nos permite operar con la base de datos este es el esquema entonces
  //entonces yo le digo de las notas que tengo en la base de datos quiero buscar toda las bases todos 
  //los datos que esten alli dentro de esa coleccion desde la coleccion note quiero buscar todo los datos 
  //y aqui podria darle otro parametro un poco mas descriptivo por ejemplo todos los titulos que coincidan con
  //tal o todas las descripciones que coincidan con tal pero en este caso quiero todos los datos 
  //es por eso que no le paso ningun parametro. buscar datos de la base de datos tambien es un proceso sincrono
  //entonces repitimos el processo de async y await
  //y una vez cuando termine la consulta pues el me va a devolver los datos y voy a almacenarlos
  //en una constante llamada note y una vez los almacenes pues voy a poder retornar los a una vista
  //porque estos son los datos estan son las notas de la base de datos
  //nosotros tambien podemos cambiar el orden de las tarjetas con una consulta del backend
  //por que el backend porque al momento de retornar los datos al momneto que estoy teniendo los datos
  //aqui en este find() yo puedo es digamos aplicar una funcion de sort() para que se ordene de determinada
  //manera vamos a decir aqui yo quiero que se ordene por fecha de creacion de manera descendente es decir 
  //de mayor a menor 
  const notes = await Note.find().sort({date: 'desc'});
  //entonces voy a renderizar una nueva vista. voy a ir a mi carpeta views y aqui 
  //voy a decirle renderiza desde la carpeta notes el archivo llamado all-notes
  //y pasale los datos de las notas y para eso voy a utilizar un objecto
  //este all-notes al momento de retornar estas notes yo puedo al momento de recorrerlo yo puedo acceder
  //directamente a cada una de sus propiedades por ejemplo al titulo no soloamente al titulo obviamente
  //tambien puedo acceder a la descripcion
  res.render('notes/all-notes', { notes });
  });


module.exports = router;

