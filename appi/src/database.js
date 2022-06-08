const mysql = require('mysql');

//Para hacer el wait fot it https://keepgrowing.in/tools/how-to-make-one-docker-container-wait-for-another/

//Conecto con la base de datos
const mysqlConnection = mysql.createConnection({
  host: 'mysqldb',
  user: 'root',
  password: '112358',
  database: 'dockerapp',
  multipleStatements: true
});

mysqlConnection.connect(function (err) {
    if (err) {
        console.log(JSON.stringify({ "Conexión con base de datos: ": "nok"}));
      return;
    } else {
      console.log(JSON.stringify({ "Conexión con base de datos: ": "ok"}));
    }
  });

module.exports = mysqlConnection;