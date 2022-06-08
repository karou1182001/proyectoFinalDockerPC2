const mysql = require('mysql');


//Conecto con la base de datos
const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '112358',
  database: 'dockerapp',
  multipleStatements: true
});

mysqlConnection.connect(function (err) {
    console.log('Conexión con base de datos:');
    if (err) {
        console.log('nok');
      return;
    } else {
      console.log('ok');
    }
  });

module.exports = mysqlConnection;