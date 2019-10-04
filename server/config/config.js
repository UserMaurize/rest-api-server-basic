
//===== PORT ======
process.env.PORT = process.env.PORT || 3000;

//==== Conections MongoDB Entorno=====
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==== Database =====
let urlDB;

if (  process.env.NODE_ENV === 'dev'  ) {
    urlDB = 'mongodb://localhost:27017/coffee';
} else{
    urlDB = 'mongodb://mcoba:Mauri1983%$#@ds151853.mlab.com:51853/cafe';
}
 
process.env.URLDB = urlDB;

