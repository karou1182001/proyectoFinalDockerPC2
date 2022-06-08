const express = require('express');
const router = express.Router();

//Importamos la conexión
const mysqlConnection  = require('./database.js');


// GET all users
router.get('/users', (req, res) => {
    mysqlConnection.query('SELECT * FROM users', (err, rows, fields) => {
      //Si no obtuvimos ningún error, mostramos las filas en formato json
      if(!err) {
        res.json(rows);
        console.log(rows[0]);
      } else {
        console.log(err);
      }
    });  
  });


//GET table s en formato JSON
router.get('/s', (req, res) => {
    mysqlConnection.query('SELECT * FROM s', (err, rows, fields) => {
      //Si no obtuvimos ningún error, mostramos las filas en formato json
      if(!err) {
        res.json(rows);
        console.log(rows);
      } else {
        console.log(err);
      }
    });  
  });


//GET table a en formato JSON
router.get('/a', (req, res) => {
    mysqlConnection.query('SELECT * FROM a', (err, rows, fields) => {
      //Si no obtuvimos ningún error, mostramos las filas en formato json
      if(!err) {
        res.json(rows);
        console.log(rows);
      } else {
        console.log(err);
      }
    });  
  });



/*Obteniendo como parámetro un id y hash devolver 
un ok si el hash el válido y un nok en caso
contrario. Almacenar en la base de datos el id,
hash enviado, timestamp y la respuesta (tabla a). */
router.get('/verifidhash', (req, res) => {
    console.log('Validez del hash:');
    //const { idUser } = req.query.idUser; 
    //const { hash } = req.query.hash; 
    const { idUser } = 1; 
    const { hash } = 123; 
    mysqlConnection.query('SELECT * FROM s WHERE idUser = ? AND hash = ?', [idUser, hash], (err, rows, fields) => {
      if (!err) {
        res.json(rows[0]);
        //verificamos si se encuentra o no se encuentra y de acuerdo a eso devolvemos el mensaje
        /*if(rows[0] === undefined){
            console.log("nok");
             //2. Se almacena en la base de datos el id del hash enviado, timestamp y la respuesta nok
            mysqlConnection.query('INSERT INTO a (idUser, hashEnviado, timestamp, respuesta) VALUES ?', [idUser, hash, "b", "nok"], (err, rows, fields) => {
                if (!err) {
                res.json(rows[0]);
                console.log("Almacenado con nok");
                } else {
                console.log(err);
                }
            });
        }else{
            console.log(rows[0]);
            console.log("ok");
             //2. Se almacena en la base de datos el id del hash enviado, timestamp y la respuesta ok
             mysqlConnection.query('INSERT INTO a (idUser, hashEnviado, timestamp, respuesta) VALUES ?', [idUser, hash, rows[0].hash, "ok"], (err, rows, fields) => {
                if (!err) {
                res.json(rows[0]);
                console.log("Almacenado con ok");
                } else {
                console.log(err);
                }
            });
        }*/
      } else {
        console.log(err);
        console.log("nok");
      }
    });

   
  });


module.exports = router;