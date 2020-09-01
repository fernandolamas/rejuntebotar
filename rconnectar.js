var Rcon = require('rcon');

var options = {
  tcp: false, //udp
  challenge: true //hlds uses challenge

};

var conn = new Rcon('ip', 27116, 'rconpw', options);


conn.on('auth', function () {
  console.log("Autenticado en el servidor HLDS argentino");

}).on('response', function (str) {
  console.log("El servidor arg respondio: \n" + str);

}).on('end', function () {
  console.log("Conexion con el servidor cerrada! Todos alguna vez morimos");
}).on('error', function() {
  console.log("Error durante la conexion argentina... reintentando la reconección");
  conn.connect();
});


conn.connect();

exports.rcon = conn;