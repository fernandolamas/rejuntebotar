var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'host',
  user     : 'username',
  password : 'pw',
  database : 'database'
});

exports.connection = connection;


/*
connection.query('SELECT * FROM players'), function(error,results,fields){
if(error) throw error;
console.log('The solution is: ', results[0].solution);
if(results){
  console.log("Resultados: " + results);
}
}
*/