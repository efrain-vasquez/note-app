//  views
//en nuestro servidor la carpeta views va amacenar todas los archivos que vamos enviar al navegador
//es decir todas las vistas html's anque en este projecto vamos a utilizar handle bars que es un motor de plantillas
//al final todo eso se convirte en html y es lo vamos a estar enviando al navegador

//  routes
//esta carpeta nos va servir para crear las url o las rutas para nuestro servidor

//  public
//esta carpeta es para poder insertar todos los archivos estaticos
//por ejemplo imagenes, fuentes, archivos de ccs, archivos de javascript y cualquier otro
//archivo que queremos enviar al navegador y que lo pueda pintar por pantalla

//  models
//esta carpet es para poder definir como van a lucir los datos dentro de la base de datos
//es decir aqui vamos a definir como un especie de mis notas tendra un descripcion una fecha y un autor
//un usuario que es un autor. tambien vamos a definir el usuario. mi usario tendra un nombre una fecha de 
//creacion talvez algun user name un correo una contrasena y tal. aqui lo vamos a definir

//  helpers
//en la carpeta helpers voy a poder local functions que mi sevidor puede utilizar.
//la carpeta helpers en realidad no es necesaria pero la voy a criar simplemente porque aqui podemos criar 
//cualquier funccion y luego podamos reutilizar en cualquier parte. al criar la aqui puedo llamar esa
//funccion a cada rato. 

//  config
//la carpeta config puede amacenar distintos archivos
//por ejemplo aqui podria colocar mi connection de la base de datos que es database.js
//pero ahora no lo voy hacer porque es mucho mas practico colocarlo adonde esta. 
//otras cosas que podria colocar en la carpeta config son variables de configuracion del entorno, 
//mi configuracion de como estoy authenticando y vamos a utilizarlo para eso
//entonces aqui colocaria por ejemplo los modolos o como estan configurados ciertos modolos