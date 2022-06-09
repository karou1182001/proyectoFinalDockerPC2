const express = require('express');
const router = express.Router();
//Importamos la conexión
const mysql = require('mysql');
//--------------------CONEXIÓN BASE DE DATOS---------------------
//Conecto con la base de datos
const mysqlConnection = mysql.createConnection({
  host: 'mysqldb',
  user: 'root',
  password: '112358',
  database: 'dockerapp',
  multipleStatements: true
});
var conexion;
mysqlConnection.connect(function (err) {
    if (err) {
      console.log("Conexión no exitosa");
        conexion= "nok";
      return;
    } else {
      console.log("Conectado a la base de datos");
      conexion= "ok";
    }
  });
//-----------------------CONSULTAS----------------------------------
//Vemos si conexión fue exitosa
router.get('/connect', (req, res) => {
  res.json({"Conexión con base de datos:": conexion});
});

// GET all users
router.get('/users', (req, res) => {
    mysqlConnection.query('SELECT * FROM users', (err, rows, fields) => {
      //Si no obtuvimos ningún error, mostramos las filas en formato json
      if(!err) {
        res.json(rows);
      } else {
        res.json({"error: ": err});
      }
    });  
  });


//GET table s en formato JSON
router.get('/s', (req, res) => {
    mysqlConnection.query('SELECT * FROM s', (err, rows,  result) => {
      //Si no obtuvimos ningún error, mostramos las filas en formato json
      if(!err) {
        res.json(rows);
      } else {
        res.json({"error: ": err});
      }
    });  
  });


//GET table a en formato JSON
router.get('/a', (req, res) => {
    mysqlConnection.query('SELECT * FROM a', (err, rows, fields) => {
      //Si no obtuvimos ningún error, mostramos las filas en formato json
      if(!err) {
        res.json(rows);
      } else {
        res.json({"error: ": err});
      }
    });  
  });


//---------------------CONSULTAS COMPUESTAS-------------------
/*1.Obteniendo como parámetro un id de usuario devolver un hash 
(combine el id con el timestamp). Almacena en la base de datos el 
id, timestamp y hash (tabla s). El hash solo tendrá una validez de cuatro horas.
*/
//Ej: http://localhost:3000/1002
router.get("/consulta/:idUser", (req, res)=> {
  //Se realizará esto en 5 pasos
  //1. Obetenemos el nuevo id que se le pasó por parámetro
  const idUser= req.params.idUser;  
  //Si  ya existe ese id, no lo inserta
  mysqlConnection.query("INSERT IGNORE INTO users (id) VALUES (?)", [idUser], (err, result)=>{
    //Si hay error lo mostramos
    if(err) {
      res.json({"error: ": err});
    }
  });

  //2. Obtenemos el timestap (Fecha y hora actual) en el formato de mysql
  var hoy = new Date();
  var timestamp = calculateTimestamp(hoy);

  //3.Obtenemos un hash a partir del id y el timestamp
  //Timestamp de milisegundos transcurridos
  var timestampMili= hoy.getTime();
  var hash= idUser+timestampMili.toString();
  

  //4. Inserción en la tabla s de la base de datos
  const sqlInsert=  "INSERT INTO s (idUser, timestamp, hash) VALUES (?, ?,  ?)";
  mysqlConnection.query(sqlInsert, [idUser, timestamp, hash], (err, result)=>{
    //Si no obtuvimos ningún error
    if(!err) {
      //console.log("Inserción realizada");
      //5. Después de que la inserción fue correctamente realizada, le damos su hash al usuario
      res.json({"Su hash es: ": hash});
      //console.log(JSON.stringify({ "Su hash es: ": hash}));
    } else {
      res.json({"error: ": err});
    }
  });
});



/*2.Obteniendo como parámetro un id y hash devolver un ok si el hash es válido y
un nok en caso contrario. Almacenar en la base de datos el id, hash enviado,
timestamp y la respuesta (tabla a). */
//Ej: http://localhost:3000/verif/1002/10021654703124867
router.get('/consulta/:idUser/:hash', (req, res) => {

    //1. Obtenemos como parámetro el id y el hash
    const idUser = req.params.idUser; 
    const hash = req.params.hash;

    //2.Calculamos el timestampactual y lo restamos con el inicial a ver si es válido
    var hoy = new Date();
    var timestamp = calculateTimestamp(hoy);
    var timestampFinMili= hoy.getTime();
    //Con el método obtenemos el inicial
    var timestampIni= obtenerTimestamoini(idUser, hash);
    //3. Verificamos si su diferencia es menor o igual a 4 horas para verificar su validez
    var validez= validacionHash(timestampIni, timestampFinMili);


    //4. Verificamos que ese id y hash existan en la base de datos
    mysqlConnection.query('SELECT * FROM s WHERE idUser = ? AND hash = ?', [idUser, hash], (err, rows, fields) => {
      if (!err) {
        //res.json(rows[0]);
        //verificamos si se encuentra o no se encuentra y de acuerdo a eso devolvemos el mensaje
        if(rows[0] === undefined){
          //console.log(JSON.stringify({ "Respuesta: ": "nok"}));
          res.json({ "Respuesta: ": "nok"});
        }else{
            //Si el hash es válido
            var respuesta;
            if (validez) {
              respuesta= "ok";
            } else {
              respuesta= "nok";
            }
             //4. Se almacena en la base de datos el id del hash enviado, timestamp y la respuesta 
             mysqlConnection.query('INSERT INTO a (idUser, hashEnviado, timestamp, respuesta) VALUES (?, ?, ?, ?)', [idUser, hash, timestamp, respuesta], (err, rows, fields) => {
                if (!err) {
                  res.json({"Respuesta: ": respuesta});
                  //console.log(JSON.stringify({ "Respuesta: ": respuesta}));
                } else {
                  res.json({ "Respuesta: ": "error"});
                }
            });
        }
      } else {
        //console.log(err);
        //console.log(JSON.stringify({ "Respuesta: ": "nok"}));
        res.json({ "Respuesta: ": "nok"});
      }
    });

  });




//--------------------ELIMINACIÓN-----------------------------

//Borrar todos los elementos de la tabla a y la tabla s
router.delete('/delete', (req, res) => {
  //Eliminamos la tabla a
  mysqlConnection.query('DELETE FROM s', (err, rows, fields) => {
    if(!err) {
      //Inicializamos nuevamente los id en 1
      mysqlConnection.query('ALTER TABLE s AUTO_INCREMENT = 1');
    } else {
      console.log(err);
    }
  });
  //Eliminamos la tabla a
  mysqlConnection.query('DELETE FROM a', (err, rows, fields) => {

    if(!err) {
      res.json({status: 'Tabla a  y s eliminada'});
      //console.log(JSON.stringify({ "Respuesta: ": "Tabla a  y s eliminada"}));
      //Inicializamos nuevamente los id en 1
      mysqlConnection.query('ALTER TABLE a AUTO_INCREMENT = 1');
    } else {
      res.json({ "Respuesta: ": err});
      //console.log(err);
    }
  });
});

//Borrar solo tabla a
router.delete('/a', (req, res) => {
  //Eliminamos la tabla a
  mysqlConnection.query('DELETE FROM a', (err, rows, fields) => {

    if(!err) {
      res.json({status: 'Tabla a eliminada'});
      //console.log(JSON.stringify({ "Respuesta: ": "Tabla a eliminada"}));
      //Inicializamos nuevamente los id en 1
      mysqlConnection.query('ALTER TABLE a AUTO_INCREMENT = 1');
    } else {
      res.json({"error: ": err});
    }
  });
});

//Borrar solo tabla a
router.delete('/s', (req, res) => {
  //Eliminamos la tabla a
  mysqlConnection.query('DELETE FROM s', (err, rows, fields) => {

    if(!err) {
      res.json({status: 'Tabla s eliminada'});
      //console.log(JSON.stringify({ "Respuesta: ": "Tabla s eliminada"}));
      //Inicializamos nuevamente los id en 1
      mysqlConnection.query('ALTER TABLE a AUTO_INCREMENT = 1');
    } else {
      res.json({"error: ": err});
    }
  });
});


//-----------------OTROS MÉTODOS------------------------------
function obtenerTimestamoini(idUser, hash)
{
  var largo= idUser.length;
  var time= hash.substring(largo,hash.length)
  return time;
}

function validacionHash(timestampIni, timestampFin)
{
  //Diferencia en milisegundos
  var difference= timestampFin- timestampIni;
  var valido=false;
  //Como 4 horas son 14400000 mseg. verificamos que esto sea menor o igual a este tiempo
  if (difference<= 14400000) {
    valido=true;
  } 
  return valido;
}

function calculateTimestamp(hoy){
  var fecha = hoy.getFullYear()+ '-' + padTo2Digits( hoy.getMonth() + 1 ) + '-' +  padTo2Digits(hoy.getDate());
  var hora = padTo2Digits(hoy.getHours()) + ':' + padTo2Digits(hoy.getMinutes()) + ':' + padTo2Digits(hoy.getSeconds());
  var timestamp = fecha + ' ' + hora;
  return timestamp;
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

module.exports = router;