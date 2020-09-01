var Rcon = require('rcon');

var options = {
  tcp: false, //udp
  challenge: true //hlds uses challenge

};

var conn = new Rcon('ip', 27015, 'rconpw', options);


conn.on('auth', function () {
  console.log("Autenticado en el servidor HLDS brasil");

}).on('response', function (str) {
  console.log("El servidor de brasil respondio: \n" + str);

}).on('end', function () {
  console.log("Conexion con el servidor de brasil cerrada! Todos alguna vez morimos");
}).on('error', function() {
  console.log("Error durante la conexion de brasil... reintentando la reconección");
  conn.connect();
});

conn.connect();

exports.rcon = conn;