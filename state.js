//el estado son variables globales... sin setter ni getter ni class

var rejunteMaxSize = 8; // NO PUEDEN SER NUMEROS IMPARES NI menores a 4
var rejunteArray = []; //array de integrantes del rejunte
var rejunteEnMatch = [];
var rejunteEnMatch2 = [];
var rejunteAux = []; //array auxiliar en caso de que haga falta
var equipoAzul = []; //equipo azul una vez que todos los jugadores se unieron
var equipoRojo = []; //equipo rojo una vez que todos los jugadores se unieron
var equipoAzulFinal = "";
var equipoRojoFinal = "";
var equipoAzulFinalRcon = "";
var equipoRojoFinalRcon = "";

var mitadDelTotalDeJugadores = rejunteMaxSize / 2;

var doBrRetry;
var doShutDownServer;

var timeoutAddStart; // milliseconds
const timeoutAddDelay = 1800000;
var timeoutAddElapsed;
var timeoutAddRemaining;
var timeoutAdd;
var timeoutBan;
var timeoutMatch;
var timeoutMatch2;
var playerNecesitaReemplazo;
var rejuntesExtra = false; //If true, permite multiples colas (hasta 2 xd)
var rotacionRandomArray = [];

module.exports = {
  doBrRetry,
  rejunteMaxSize,
  rejunteArray,
  rejunteEnMatch,
  rejunteEnMatch2,
  rejunteAux,
  equipoAzul,
  equipoRojo,
  equipoAzulFinal,
  equipoRojoFinal,
  equipoAzulFinalRcon,
  equipoRojoFinalRcon,
  mitadDelTotalDeJugadores,
  timeoutAddStart,
  timeoutAddDelay,
  timeoutAddElapsed,
  timeoutAddRemaining,
  timeoutAdd,
  timeoutBan,
  timeoutMatch,
  timeoutMatch2,
  playerNecesitaReemplazo,
  rotacionRandomArray,
  rejuntesExtra
};
