const Compute = require("@google-cloud/compute");
const compute = new Compute();
const zone = compute.zone("southamerica-east1-b");
const vm = zone.vm("tfctestbr");
const { rcon } = require("./rconnectbr");

module.exports = {
  resetearRejunte: function resetearRejunte(state, message) {
    if (
      state.rejunteArray != undefined &&
      state.rejunteArray != null &&
      state.rejunteArray.length != null &&
      state.rejunteArray.length > 0
    ) {
      state.rejunteArray = [];
      state.rejunteAux = [];
      state.equipoRojo = [];
      state.equipoAzul = [];
      clearTimeout(state.timeoutAdd);
      message.channel.send("El rejunte se reseteo");
    }
  },

  brretry: function brretry(serverbr){
    console.log("doing br retry");
    serverbr.rcon.connect();
    serverbr.rcon.send("say Consulta los !teams")
  },

  shuffle: function shuffle(message, state, client, Discord) {
    if (state.rejunteMaxSize === state.rejunteArray.length) {
      state.equipoAzul = [];
      state.equipoRojo = [];
      var elegido = [];
      var azulLleno = false;
      var rojoLleno = false;
      for (var i = 0; i <= state.rejunteMaxSize; i++) {
        elegido.push(false);
      }
      while (!rojoLleno) {
        //que se pueda definir capitanes o mesclar los equipos

        // Math.floor(Math.random() * 10)-3;     // returns a random integer from 0 to 9
        // Math.random() * 8;
        var random = Math.trunc(Math.random() * state.rejunteMaxSize);

        if (!elegido[random] && !azulLleno) {
          state.equipoAzul.push(state.rejunteArray[random]);
          elegido[random] = true;
          console.log("Agregando jugador al azul");
          if (state.equipoAzul.length === state.mitadDelTotalDeJugadores) {
            azulLleno = true;
            console.log("El azul está lleno");
          }
        }

        if (!elegido[random] && !rojoLleno) {
          state.equipoRojo.push(state.rejunteArray[random]);
          elegido[random] = true;
          console.log("Agregando jugador al rojo");
          if (state.equipoRojo.length === state.mitadDelTotalDeJugadores) {
            rojoLleno = true;
            console.log("El rojo está lleno");
          }
        }
      }

      this.teams(message, state, client, Discord);

      if (state.rejuntesExtra) {
        state.timeoutMatch = setTimeout(this.agregarJugadoresEnMatch, 300000); //5 minutos
      }
    } else
      state.message.channel.send("No hay jugadores suficientes para mezclar");
  },

  teams: function teams(message, state, client, Discord) {
    state.equipoAzulFinal = "";
    state.equipoAzulFinalRcon = "";
    for (var i = 0; i < state.mitadDelTotalDeJugadores; i++) {
      //var userID = "'"+ equipoAzul[i]+"\'"
      var usuarioAzul = client.users.cache.get(state.equipoAzul[i]);
      state.equipoAzulFinal += "\n**" + usuarioAzul.toString() + "**";
      var usuarioAzulRcon = client.users.cache.get(state.equipoAzul[i]);
      state.equipoAzulFinalRcon += "\n" + usuarioAzulRcon.username + " ";
    }

    var mensajeEmbed = new Discord.MessageEmbed()
      .setColor("#0652DD")
      .setTitle("**Equipo Azul**: ")
      .setDescription(state.equipoAzulFinal)
      .setThumbnail("https://imgur.com/9IO4Dcu.png");
    message.channel.send({ embed: mensajeEmbed });

    state.equipoRojoFinal = "";
    state.equipoRojoFinalRcon = "";
    for (var i = 0; i < state.mitadDelTotalDeJugadores; i++) {
      var usuarioRojo = client.users.cache.get(state.equipoRojo[i]);
      state.equipoRojoFinal += "\n**" + usuarioRojo.toString() + "**";
      var usuarioRojoRcon = client.users.cache.get(state.equipoRojo[i]);
      state.equipoRojoFinalRcon += "\n" + usuarioRojoRcon.username + " ";
    }

    mensajeEmbed = new Discord.MessageEmbed()
      .setColor("#EA2027")
      .setTitle("**Equipo Rojo**: ")
      .setDescription(state.equipoRojoFinal)
      .setThumbnail("https://imgur.com/uHzrsGr.png");
    message.channel.send({ embed: mensajeEmbed });
  },

  //match

  /*
  resetearMatch: function resetearMatch(state) {
    state.rejunteEnMatch = [];
  },
  
  resetearMatch2: function resetearMatch2(state) {
    state.rejunteEnMatch2 = [];
  },
    
    agregarJugadoresEnMatch: function agregarJugadoresEnMatch(state) {
    //rejunteEnMatch = [];
  
    if (state.rejunteEnMatch.length <= 0) {
      for (var i = 0; i < state.rejunteMaxSize; i++) {
        state.rejunteEnMatch.push(state.rejunteArray.pop());
      }
      state.timeoutMatch = setTimeout(resetearMatch(state), 1800000);
    } else {
      for (var i = 0; i < state.rejunteMaxSize; i++) {
        state.rejunteEnMatch2.push(state.rejunteArray.pop());
      }
      state.timeoutMatch2 = setTimeout(resetearMatch2(state), 1800000);
    }
    resetearRejunte(state);
  },
  */
  verJugadoresEnMatch: function verJugadoresEnMatch(state, client) {
    var rejunteEnMatchFinal = "";
    for (var i = 0; i < state.rejunteMaxSize; i++) {
      //var userID = "'"+ equipoAzul[i]+"\'"
      ///var usuarioEnMatch = client.users.cache.get(rejunteEnMatch[i]);
      //console.log(usuarioEnMatch);
      //rejunteEnMatchFinal += "\n" + usuarioEnMatch.toString();
      var usuarioMatch = client.users.cache.get(state.rejunteEnMatch[i]);
      rejunteEnMatchFinal += "\n**" + usuarioMatch.toString() + "**";
    }
    return rejunteEnMatchFinal;
  },

  rotacionDeMapas: function rotacionDeMapas(state, message, Discord, mapas) {
    var seleccionDeRotacion = false;
    state.rotacionRandomArray = [];
    while (!seleccionDeRotacion) {
      var eleccionRandom = Math.trunc(
        Math.random() * mapas.rotacionMapasArray.length
      );
      if (
        !state.rotacionRandomArray.includes(
          mapas.rotacionMapasArray[eleccionRandom]
        )
      ) {
        state.rotacionRandomArray.push(
          mapas.rotacionMapasArray[eleccionRandom]
        );
      }
      if (state.rotacionRandomArray.length === 4) seleccionDeRotacion = true;
    }

    var misMapas = "";
    misMapas += "1⃣  `" + state.rotacionRandomArray[0] + "`\n";
    misMapas += "2⃣  `" + state.rotacionRandomArray[1] + "`\n";
    misMapas += "3⃣  `" + state.rotacionRandomArray[2] + "`\n";
    misMapas += "4⃣  `" + state.rotacionRandomArray[3] + "`\n";
    misMapas += "5⃣  `" + " Mezclar mapas " + "`\n";

    const mensajeEmbed = new Discord.MessageEmbed()
      .setColor("#f1c40f")
      .setTitle("**Elige mapa**:")
      .setDescription(
        misMapas +
        "\n*Cónectate:* :flag_br: steam://connect/34.95.232.99:27015/rjt"
      );

    message.channel.send({ embed: mensajeEmbed }).then(embedMessage => {

      embedMessage.react("1⃣");
      embedMessage.react("2⃣");
      embedMessage.react("3⃣");
      embedMessage.react("4⃣");
      embedMessage.react("5⃣");
      const filter = (reaction) => {
        return reaction.emoji.name === "5⃣";
      };

      embedMessage.awaitReactions(filter, { max: 5, time: 15000, errors: ['time'] })
        .then(collected => rotacionDeMapas(state, message, Discord, mapas))
        .catch(collected => {
          message.channel.send('15 segundos pasaron y votaron '+collected.size+'/4 jugadores, el bot no mezclará automáticamente los mapas');
          err => console.error("surgio un error al no llegar a los 5 jugadores en el shuffle maps "+ err);
        });


    })
      .catch(err => console.error("surgió un error mientras esperamos los votos del shufflemaps " + err));
  },

  mostrarJugadoresEnRejunte: function mostrarJugadoresEnRejunte(
    state,
    message,
    client,
    Discord
  ) {
    //usuariosEnRejunte();
    var jugadoresEnRejunte = "";
    if (state.rejunteArray.length > 0) {
      for (var i = 0; i < state.rejunteArray.length; i++) {
        var usuarioRejunteID = state.rejunteArray[i];
        var usuarioRejunte = client.users.cache.get(usuarioRejunteID);
        jugadoresEnRejunte += "\n" + usuarioRejunte.toString();
      }

      //message.channel.send(jugadoresEnRejunte);

      var mensajeEmbed = new Discord.MessageEmbed()
        .setColor("#2ecc71")
        .setTitle(this.usuariosEnRejunte(state))
        .setDescription(jugadoresEnRejunte)
        .setThumbnail("https://imgur.com/byEIU8T.png");
      message.channel.send({ embed: mensajeEmbed });
    } else {
      message.channel.send("El rejunte está vacío");
    }
  },

  usuariosEnRejunte: function usuariosEnRejunte(state) {
    return (
      "Usuarios en el rejunte `" +
      state.rejunteArray.length +
      "/" +
      state.rejunteMaxSize +
      "`"
    );
  },

  removerUsuarioDeRejunte: function removerUsuarioDeRejunte(
    id,
    state,
    message,
    client,
    Discord
  ) {
    //Usado para !kick @mention -- !ban @mention
    var usuarioAKickear = id;
    state.rejunteAux = [];
    if (state.rejunteArray.includes(usuarioAKickear)) {
      for (var i = 0; i < state.rejunteArray.length; i++) {
        if (!(usuarioAKickear === state.rejunteArray[i])) {
          state.rejunteAux.push(state.rejunteArray[i]);
        }
      }
      state.rejunteArray = [];
      for (var i = 0; i < state.rejunteAux.length; i++) {
        state.rejunteArray.push(state.rejunteAux[i]);
      }

      if (state.equipoAzul.length > 0 && state.equipoRojo.length > 0) {
        state.equipoAzul = [];
        state.equipoRojo = [];
        message.channel.send(
          "❌ Los equipos se deshicieron, volviendo al rejunte..."
        );
      }
      this.mostrarJugadoresEnRejunte(state, message, client, Discord);
      //usuariosEnRejunte();
      message.channel.send(
        "<@" + usuarioAKickear + ">" + " fuiste kickeado del rejunte"
      );
    } else {
      message.channel.send(
        "<@" + usuarioAKickear + ">" + " no está en el rejunte"
      );
    }
  },

  desbanearUsuario: function desbanearUsuario(message) {
    message.member.roles.remove("720436890146177074");
    //message.member.roles.remove(["719584586706976888"]);
    message.author.send("Ya estas desbaneado mogolico");
  },

  tfcServerUp: function () {
    vm.start(function (err, operation, apiResponse) {
      console.log(err);
      console.log(apiResponse);
      console.log(operation);
    });
  },

  tfcServerDown: function () {
    vm.stop(function (err, operation, apiResponse) {
      console.log(err);
      console.log(apiResponse);
      console.log(operation);
    });
  },
};

