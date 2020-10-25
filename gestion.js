var funcgestion = require("./funcgestion");
const db = require("./dbconnect");

module.exports = {
  cmds: (message, rolRejuntero, state, client, Discord, mapas) => {


    if (message.content === "!reset") {
      if (message.member.roles.cache.some(role => role.name === rolRejuntero)) {
        funcgestion.resetearRejunte(state, message);
      } else {
        message.channel.send(
          "No tienes permiso para resetear el rejunte!! " +
          message.author.username
        );
      }
    }

    if (message.content === "!shuffle") {
      if (message.member.roles.cache.some(role => role.name === rolRejuntero)) {
        funcgestion.shuffle(message, state, client, Discord);
      } else {
        message.channel.send(
          "No tienes los permisos suficientes para mezclar los equipos " +
          message.author.username
        );
      }
    }

    if (message.content.includes("!kick") && message.mentions.users.first() !== undefined && message.member.roles.cache.some(role => role.name === rolRejuntero)) {
      funcgestion.removerUsuarioDeRejunte(message.mentions.users.first().id, state, message, client, Discord);
    }

    if (message.content.includes("!ban") && message.member.roles.cache.some(role => role.name === rolRejuntero)) {
      let member = message.mentions.members.first();
      member.roles.add("720436890146177074");
      if (state.rejunteArray.includes(member.id)) {
        funcgestion.removerUsuarioDeRejunte(member.id, state, message);
      }
    }

    if (message.content.includes("!unban")) {
      if (message.member.roles.cache.some(role => role.name === rolRejuntero)) {
        let member = message.mentions.members.first();
        member.roles.remove("720436890146177074");
      }
    }
    if (message.content.includes("!maxsize")) {
      if (message.member.roles.cache.some(role => role.name === rolRejuntero)) {
        var maxSize = /1|2|4|6|8|16/;

        if (maxSize.test(message.content)) {
          var newMaxSize = maxSize.exec(message.content);
          state.rejunteMaxSize = parseInt(newMaxSize[0]);

          //cambiar mitad de los jugadores aunque ya hayan equipos armados
          state.mitadDelTotalDeJugadores = state.rejunteMaxSize / 2;
          state.equipoRojo = [];
          state.equipoAzul = [];

          message.channel.send(
            "Se cambió el MaxSize a `" + state.rejunteMaxSize + "`"
          );
          if (state.rejunteArray.length > state.rejunteMaxSize) {
            for (
              var i = state.rejunteArray.length;
              i > state.rejunteMaxSize;
              i--
            ) {
              state.rejunteArray.pop();
            }
          }
          if (state.rejunteArray.length === state.rejunteMaxSize) {
            funcgestion.shuffle(message, state, client, Discord);
            state.rotacionDeMapas(state, message, Discord, mapas);
            console.log(
              "Hago shuffle desde maxsize: " + state.rejunteArray.length
            );
          }

          console.log("maxsize" + state.rejunteMaxSize);
        } else
          message.channel.send(
            "El comando fue erróneo: `!maxSize #` #: **4 6 8 16**"
          );
      } else {
        message.channel.send(
          "No tienes los permisos suficientes para cambiar la cantidad maxima de jugadores " +
          message.author.username
        );
      }
    }
    if (message.content === "!shufflemaps") {
      if (message.member.roles.cache.some(role => role.name === rolRejuntero)) {
        funcgestion.rotacionDeMapas(state, message, Discord, mapas);
      }
    }

    if (message.content === "!teams") {
      if (
        state.equipoAzul != "undefined" &&
        state.equipoAzul != null &&
        state.equipoAzul.length != null &&
        state.equipoAzul.length > 0
      ) {
        funcgestion.teams(message, state, client, Discord);
      } else message.channel.send("No se han creado equipos");
    }

    if (message.content === "!score") {
      console.log("consultando rows");
      var query = db.connection.query("SELECT * FROM partidas ORDER BY MatchID  DESC LIMIT 1,1");
      let rowFinal = "";
      query
        .on("result", function (row) {
          console.log("row " + row)
          rowFinal = row.CapturasAzul + " score final en " + row.Mapname;
          message.channel.send(rowFinal);
        })

        .on("error", function (err) {
          message.channel.send("No se pudo obtener los resultados" + err);
        });
    }

    if (message.content === "!timeleft") {

      state.timeoutAddElapsed = Date.now() - state.timeoutAddStart;

      state.timeoutAddRemaining = state.timeoutAddDelay - state.timeoutAddElapsed;

      var minutes = Math.floor(state.timeoutAddRemaining / 60000);
      var seconds = ((state.timeoutAddRemaining % 60000) / 1000).toFixed(0);

      message.channel.send("Faltan: " + minutes + ":" + (seconds < 10 ? '0' : '') + seconds + " minutos para el proximo rejunte");

    }
  }

}
