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
//Models
const Note = require('../models/Note');


// Helpers
 
//la funcion helpers esta definida pero no la estamos utilizando. aqui vamos a empezar a asegurar estas rutas
//entonces traernos ese helpers vamos a decir const { } desde el modulo llamado require() vamos a subir un nivel ..
//desde la carpeta llamada helpers quiero ese archivo llamado auth y desde ahi vamos a usar su metodo llamado
//isAuthenticated
//y quien va usar este middleware, cada ruta que yo quiero asegurar 
const { isAuthenticated } = require('../helpers/auth');
//podra escribir una ruta aqui arriba para poder asegurar que esta autenticada o no pero este la forma mas sencilla

// New Note
//esto lo que hace lo siguiente si el usario visita esta ruta vamos hacer esa validacion si esta logueado o no 
//si esta logueado va continuar con la siguente funcion si no esta logueado lo va redireccionar a una ventana
//de loggeo, es por eso que lo coloco antes de que se procese algo y lo mismo para el resto de rutas aqui 
router.get('/notes/add', isAuthenticated, (req, res) => {
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
router.post('/notes/new-note', isAuthenticated, async(req, res) => {
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
    //cuando yo estoy agregando una nueva tarea digamos una nueva nota pues yo quisiera mostrarle 
    //un mensaje del usario que esta creando una nueva nota y todo a salido satisfactorio
    //para probarlo y ver este mensaje pues tambien al igual como le habiamos hecho con los errores 
    //nosotros vamos a poder recorrer los pero si recuerdas cuando hicimos esto de los errores 
    //tuvimos que pasarlo a la vista que estabamos renderizando para poder mostrarlo no vamos 
    //a tener que hacer eso con flash porque si recuerdas estamos creando una variable global 
    //entonces a crear la variable global simplemente voy a recorrer este success message   
    req.flash('success_msg', 'Note Added Successfully');
    //pues aqui debajo voy a en lugar de enviar un ok voy a redireccionar lo a otra vista 
    //voy a rediccionar lo a la vista /notes
    res.redirect('/notes');
  }
});

//esta otra ruta sera encargada de consultar todos los datos desde la base de datos 
//entonces cuando guardo un nuevo dato luego el se mostrara al usuario esa vista con la lista de los 
//datos guardados dentro de la base de datos 
router.get('/notes', isAuthenticated, async (req, res) => {
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

// Edit Notes
// vamos a crear una ruta para editar las notas vamos a decir router.get() cuando me pide las ruta
// /notes/edit pues voy a enviarle un formulario pero para saber que voy a estar lidiando tan solo 
// una tarea en particular vamos a usar /notes/edit/:id
// pero como podemos obtener el id no hay problema porque nosotros cuando estamos obteniendo esta tarjeta 
// con sus datos tambien estamos obteniendo la id porque recuerda que cuando guardamos un dato 
// nosotros estamos guardando el titulo la descripcion la fecha y el _id que es la id de la especifica tarea
// cuando te pidan las rutas las /notas /edit /el id de la nota especificamente pues vamos a tomar los nuevos datos
// pero en este caso cuando el usario de un clic en alguno de los iconos de edit yo voy a renderizar un nuevo
// formulario para que inicarte los nuevos datos entonces voy a hacer aqui un req y res y voy a escribir 
router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
  // aqui una funcion que diga res.render() y voy a renderizar una vista que se llama notes/edit-note
  // lo que voy a enviar aqui dentro de este formulario si el usario tiene que evitar algo el 
  // tiene que saber la diferencia de lo que a guardado con lo nuevo que quiere cambiar entonces
  // vamos a pasarle aqui los datos de la nota especificamente es decir si da unclic en el icon de edit 
  // yo quiero enviarle un formulario con los datos de esa nota especificamente para que vea los datos de la nota
  // pero para eso tengo que obtenerla pero no hay ningun problema porque como estoy obteniendo el id 
  // puedo consultar la base de datos para traerme los datos y luego pasarselo a este formulario 
  // vamos a decir Note quiero buscar un dato por id .findById() y adentro de este id voy a pasarte el 
  // (req.params.id) lo que estoy haceiendo aqui es pasarle el id que me esta enviando el usario
  // es decir cuando el usario de un clic en el icono de edit esta enviando un id para esa nota 
  // y esa id es la que le estoy pasando aqui y de esa manera lo puedo obtener y esto es una consulta 
  // a la base de datos es tambien codigo asíncrono asi que le digo await y aqui arriba necesita de async 
   const note = await Note.findById(req.params.id);
  // una vez se haga la consulta me va devolver la nota entonces la voy a guardar en una constancia 
  // llamada note cuando me develva la nota lo voy a enviar a este formulario y voy a pasarle esa nota 
  // entonces con eso le estoy pasando los datos 
  res.render('notes/edit-note', { note });
});

//esta ruta se llama /notes/edit-note/:id
//estoy agregando todos esos valores ocultos y esas consultas simplemente para poder recibir el metodo 
//PUT tambien lo puedes hacerlo a travez de metodos ajax por ejemplo pero en este caso vamos a utilizar 
//el mismo formulario html
//y como estamos utilizando un metodo asincrono usamos async enfrente de el (req, res)
router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
  //como estoy recibiendo desde el req.body valores ya que es un formulario pues voy a obtener 
  //tanto el titulo en la descripcion entonces voy a guardar en una constante el titulo y la descripcion 
  const { title, description } = req.body;
  //aqui voy empezar a guardar o actualizar esos datos. para actualizarlos desde Note que es el modelo 
  //voy a buscar por id y luego voy a actualizar, .findByIdAndUpdate() es un metodo que me permite buscar 
  //primero por un id entonces le voy a pasar el id y desde donde lo obtengo desde req.params.id 
  //y los nuevos datos que quiero realizar que son el titulo y la descripcion
  //con esto estoy actualizando pero si de nuevo te fijas un poco obseva que es un metodo asincrono
  //asi que le agregamos await  
  await Note.findByIdAndUpdate(req.params.id, {title, description});
  //el momento que estamos editando una tarea aqui al editar con el PUT vamos a enviar un req.flash()
  //y necesitamos y si dictamos algo correctamente es decir algo satisfactorio entonces vamos a 
  //decir success message vamos a querer aqui dentro del flash success message y vamos a colocar aqui 
  //Note Updated Successfully. entonces tambien vamos a enviar un mensaje de satisfactorio cuando el usario 
  //actualice algo correctamente
  req.flash('success_msg', 'Note Updated Successfully');
  //una vez que se actualice yo quiero rediccionarlo a todas las notas anteriores
  //con res.redirect('/notes') estamos redirigiendo a la lista de todas las notas
  res.redirect('/notes');
});

// Delete Notes
//si queremos eliminar vamos a tener que usar el metodo delete y para hacerlo 
//funcional vamos a utilizar tambien un formulario dentro
//la ruta se va llamar /notes/delete/:id que es el id de la nota que queremos eliminar 
//tambien vamos a usar un req y res para ponder manejar esa ruta 
//cada nota tiene un boton delete y yo lo quiero enlazar con un formulario para que pueda enviar
//una peticion delete 
router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
  //con este console.log(req.params.id) podemos ver si estamos recibiendo el id
  //como estamos recibiendo el id podemos eliminarlo. dicimos que desde el modelo de datos Note
  //quiero buscar por id y eliminar esa nota. con el metodo .findByIdAndDelete() estoy encontrando
  //ese id y removiendolo desde la base de datos pero tengo que pasarle el id para que sepa cual va eliminar
  //y como es una peticion asincrona necesitamos usar async y await
  //entonces esto lo elimina de la base de datos
  await Note.findByIdAndDelete(req.params.id);
  //aqui vamos hacer lo miso que arriba pero vamos a cambiar el mensaje a Note Deleted Successfully
  req.flash('success_msg', 'Note Deleted Successfully');
  //y luego lo voy a redireccionar a la lista de tareas
  res.redirect('/notes');
});

module.exports = router;


