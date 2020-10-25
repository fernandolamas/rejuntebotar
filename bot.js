const Discord = require("discord.js");
const client = new Discord.Client();
const Compute = require("@google-cloud/compute");
const compute = new Compute();
const zone = compute.zone("southamerica-east1-b");
const vm = zone.vm("tfctestbr");

var db = require("./interact");

var serverbr = require("./rconnectbr");

//modulos creados para organizar el trabajo
var suscripcion = require("./suscription");
var rconcommands = require("./rconcommands");

//modulos esenciales del bot
var capitanes = require("./capitanes");

//exports.discord = Discord; innecesario ?
var token = require("./token");
var quotes = require("./quotes");
var mapas = require("./mapcycle");

//admin commands
var gestion = require("./gestion");
var funcgestion = require("./funcgestion");

//contiene todas las variables de lo que esta ocurriendo en este momento
var state = require("./state");

var flush = require("./reflush");

//Roles comentar los no usados?
var rolRejuntero = "Rejuntero"; //Rol que tiene acceso a cambiar los capitanes
var rolBaneado = "No jugará el próximo rejunte";
var rolBaneadoID = 720436890146177074;
var rolBaneadoPermanente = "Borracho / drogado";
var rolBaneadoPermanenteID = 724771020648611982;

//booleanos
var botEnabled = true;

client.on("message", (message) => {
  if (message.guild !== null) {
    if ((message.content == "!add" || message.content == "++") && botEnabled) {
      console.log("state state: " + state.rejunteArray.length);
      if (state.rejunteArray.length < state.rejunteMaxSize) {
        if (
          !state.rejunteArray.includes(message.author.id) &&
          !state.rejunteArray.includes(message.author.id)
        ) {
          if (
            !message.member.roles.cache.some(
              (role) =>
                role.name === rolBaneado || role.name === rolBaneadoPermanente
            )
          )
            state.rejunteArray.push(message.author.id);
          else if (
            message.member.roles.cache.some((role) => role.name === rolBaneado)
          ) {
            message.author.send(
              "No podras jugar este rejunte por un inconveniente que tuviste en el anterior rejunte"
            );
            //setTimeout(message.member.roles.remove('[720436890146177074]'), 1800000);

            state.timeoutBan = setTimeout(
              funcgestion.desbanearUsuario,
              1800000,
              message
            );
          } else if (
            message.member.roles.cache.some(
              (role) => role.name === rolBaneadoPermanente
            )
          ) {
            message.author.send(
              "No puedes jugar rejuntes, por favor habla con el administrador"
            );
          }
          funcgestion.mostrarJugadoresEnRejunte(
            state,
            message,
            client,
            Discord
          );

          switch (state.rejunteArray.length) {
            case 4:
            case 7:
              message.channel
                .send("<@&" + suscripcion.rolNotificacionesID + ">")
                .then((msg) => {
                  message.channel.bulkDelete(1);
                });
              break;
          }

          clearTimeout(state.timeoutAdd);

          state.timeoutAdd = setTimeout(
            funcgestion.resetearRejunte,
            state.timeoutAddDelay,
            state,
            message
          );

          state.timeoutAddStart = Date.now();




          if (state.rejunteArray.lenght === state.mitadDelTotalDeJugadores) {
            //conseguir todos los miembros del rol y mandarles un msj privado
            //let membersWithRole = message.guild.roles.get('415665311828803584').members.map(m=>m.user.tag); #deprecated
            for (let i = 0; i < message.guild.members.size; i++) {
              if (message.guild.members[i].roles.has(415665311828803584)) {
                message.guild.members[i].user.send(
                  "¡Hay `4/8` jugadores en el rejunte, venite a rejuntear!"
                );
              }
            }
          }

          if (state.rejunteArray.length === state.rejunteMaxSize) {
            funcgestion.shuffle(message, state, client, Discord);
            funcgestion.rotacionDeMapas(state, message, Discord, mapas);
            vm.start(function (err, operation, apiResponse) {
              //console.log(err,operation,apiResponse)
              console.log("instance start successfully");
            });
            serverbr.rcon.send(
              "say Un nuevo pickup a comenzado y ya estan los equipos listos"
            );



            //prepare a shutdown of the server 1 hour and 30 minutes after the pickup start 4680000ms
            //for testing will be 1 minute so 60000ms
            clearTimeout(state.doShutDownServer);
            console.log("Shutdown of the server programmed for 1h 30m")
            state.doShutDownServer = setTimeout(funcgestion.tfcServerDown, 4680000, vm, zone, compute, Compute)

            //do brretry in 50 seconds 50000
            clearTimeout(state.doBrRetry);
            state.doBrRetry = setTimeout(funcgestion.brretry, 50000, serverbr);

          }
        } else {
          message.channel.send("Ya estas en el rejunte");
        }
      } else {

        state.timeoutAddElapsed = Date.now() - state.timeoutAddStart;

        state.timeoutAddRemaining = state.timeoutAddDelay - state.timeoutAddElapsed;

        var minutes = Math.floor(state.timeoutAddRemaining / 60000);
        var seconds = ((state.timeoutAddRemaining % 60000) / 1000).toFixed(0);

        message.channel.send("el rejunte esta lleno... faltan " + minutes + " minutos " + (seconds < 10 ? '0' : '') + seconds + " segundos para el proximo rejunte");

      }
    }

    if (message.content == "!remove" || message.content == "--") {
      if (state.rejunteArray.includes(message.author.id)) {
        if (
          !state.equipoAzul.includes(message.author.id) &&
          !state.equipoRojo.includes(message.author.id)
        ) {
          state.rejunteAux = [];

          for (var i = 0; i < state.rejunteArray.length; i++) {
            if (!(message.author.id === state.rejunteArray[i])) {
              state.rejunteAux.push(state.rejunteArray[i]);
            }
          }
          state.rejunteArray = [];

          for (var i = 0; i < state.rejunteAux.length; i++) {
            state.rejunteArray.push(state.rejunteAux[i]);
          }

          funcgestion.mostrarJugadoresEnRejunte(
            state,
            message,
            client,
            Discord
          );
          //usuariosEnRejunte();
          message.channel.send(
            "<@" + message.author.id + ">" + " saliste del rejunte"
          );
        } else
          message.channel.send("El rejunte ya ha comenzado y no puedes salir");
      } else message.channel.send("No estas en el rejunte");
    }

    if (message.content === "!rejunte") {
      funcgestion.mostrarJugadoresEnRejunte(state, message, client, Discord);
    }

    if (message.content === "!sub") {
      console.log("ingreso al sub");
      if (state.rejunteArray.includes(message.author.id)) {
        if (state.equipoAzul.length > 0) {
          state.playerNecesitaReemplazo = message.author.id;
          message.channel.send(
            "<@" +
            state.playerNecesitaReemplazo +
            ">" +
            " necesita un reemplazo, escribe !entrar para reemplazarlo"
          );
        }
      } else {
        message.channel.send(
          message.author.username + " no estas en el rejunte"
        );
      }
    }

    if (message.content === "!entrar") {
      if (
        state.playerNecesitaReemplazo != undefined &&
        message.author.id != state.playerNecesitaReemplazo
      ) {
        "<@" +
          state.playerNecesitaReemplazo +
          ">" +
          " ahora esta siendo reemplazado por" +
          message.author.username +
          " por favor ingresa al servidor";
        state.playerNecesitaReemplazo = undefined;
      } else {
        message.channel.send("No hay nadie a quien reemplazar en el rejunte");
      }
    }

    if (message.content.includes("!match")) {
      if (state.rejunteEnMatch.length > 0) {
        var mensajeEmbed = new Discord.MessageEmbed()
          .setColor("#F0D70B")
          .setTitle("**Actualmente jugando**: ")
          .setDescription(state.verJugadoresEnMatch())
          .setThumbnail(
            "https://wiki.teamfortress.com/w/images/f/f9/Flagyellow_tfc.png"
          );
        message.channel.send({ embed: mensajeEmbed });
      } else {
        message.channel.send("No hay jugadores compitiendo en simultaneo");
      }
    }

    if (message.content === "!tbl") {
      if (message.member.roles.cache.some((role) => role.name === rolRejuntero)) {
        if (botEnabled) {
          botEnabled = false;
          message.channel.send("Rejunte desactivado por un partido internacional");
          vm.start(function (err, operation, apiResponse) {
            //console.log(err,operation,apiResponse)
            console.log("instance start successfully");
          });

        } else {
          botEnabled = true;
          message.channel.send("Rejunte activado");
          vm.stop(function (err, operation, apiResponse) {
            console.log("instance stopped successfully");
          });
        };
      } else {
        message.channel.send("Permisos insuficientes para usar el comando !tbl")
      }
    }
  }

  if (
    message.content === "!power" &&
    message.member.roles.cache.some((role) => role.name === rolRejuntero)
  ) {
    if (botEnabled) {
      botEnabled = false;
      message.channel.send("Rejunte desactivado");
    } else {
      botEnabled = true;
      message.channel.send("Rejunte activado");
    }
  }
  //// svdown command here
  if (message.content === "!svdown") {
    if (message.member.roles.cache.some((role) => role.name === rolRejuntero)) {
      message.channel.send("Server going down");
      vm.stop(function (err, operation, apiResponse) {
        console.log("instance stop successfully");
      });
    }else{
      message.channel.send("No tienes permisos para cerrar el servidor");
    }
  }
  if (message.content === "!svup") {
    if (message.member.roles.cache.some((role) => role.name === rolRejuntero)) {
      message.channel.send("Server going up");
      vm.start(function (err, operation, apiResponse) {
        //console.log(err,operation,apiResponse)
        console.log("instance start successfully");
      });
    }else{
      message.channel.send("No tienes permisos para abrir el servidor");
    }
  }

  //quotes

  quotes.emilio(message);

  quotes.redxll(message);

  quotes.pelotudo(message);

  //quotes.mentionbot(message); sale cada @here o everyone

  quotes.jason(message);

  //quotes.chicho(message);

  //Inicialización del modulo de la base de datos 👌😔

  db.interact(message);

  suscripcion.subs(message);

  capitanes.cmds(
    message,
    state.rejunteArray,
    state.equipoAzul,
    state.equipoRojo,
    state.rejunteMaxSize,
    rolRejuntero,
    state.mitadDelTotalDeJugadores
  );

  gestion.cmds(message, rolRejuntero, state, client, Discord, mapas, serverbr);


  /* comentado por q tira el bot
        if (message.content.includes("!map")) {
          //find busca un valor en el array de mapas con la funcion element(valor), en donde valor es asignado en la misma funcion find. Element(valor) busca que el valor incluya el asignado
          const mapa = message.content.match(/(?<=map )\w{0,18}/)
          if (rotacionMapasArray.includes(mapa[0])) {
            server.rcon.send("changelevel " + mapa[0]);
            message.channel.send("Cambiando a " + mapa[0])
            console.log("rcon changelevel " + mapa[0]);
          } else {
            (message.channel.send("El mapa " + mapa[0] + " no esta en la lista de mapas admitidos"))
            console.log(mapa);
          }
        }
        */



  //rcon section -> interaccion con webhooks (otros bots) y servidores
  rconcommands.cmd(
    message,
    serverbr,
    state.equipoAzulFinalRcon,
    state.equipoRojoFinalRcon,
    funcgestion,
    state,
    client,
    Discord
  );

  if (message.content === "!help") {
    message.author.send(
      "Unirse a un mix !add removerse del mix !remove, tambien hay !sub y !entrar para subear al que ponga !sub, !suscribe y !unsuscribe" +
      "Si sos capitan podes elegir con !elegir y @ al nombre de quien quieras elegir (esta persona debe formar parte del rejunte)"
    );
  }
});

client.once("ready", () => {
  console.log("Logueado y funcionando!");
  client.user.setActivity("siege es el diablo");
});

console.log("sin errores");
client.login(token.login);
console.log("Not flushing rcon since its commented in the code");
//let reflush = setInterval(flush.startflush, 1800000, serverbr);

