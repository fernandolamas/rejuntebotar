const { rcon } = require("./rconnectbr");
let enviado = true;

module.exports = {
  cmd: (message, serverbr, serverar, equipoAzulFinalRcon, equipoRojoFinalRcon, funcgestion, state, client, Discord) => {
    if (message.content.includes("!rcon")) {
      var rconArgs = message.content.match(/(?<=rcon )\w{0,18}/);
      switch (rconArgs[0]) {
        case "brteams":
          if (enviado) {
            enviado = false;
            message.channel.send("Respondiendo teams");
            if (equipoAzulFinalRcon !== "" && equipoRojoFinalRcon !== "") {

              function teamRed() {
                serverbr.rcon.send("say Equipo rojo: " + equipoRojoFinalRcon);
                enviado = true;
              }
              function teamBlue() {
                serverbr.rcon.send("say Equipo azul: " + equipoAzulFinalRcon);
                setTimeout(teamRed, 2000);
              }

              setTimeout(teamBlue, 2000);

              break;
            } else {
              function noTeams() {
                serverbr.rcon.send("say No hay equipos en este momento");
                enviado = true;
              }
              setTimeout(noTeams, 2000);
              break;
            }
          }
        case "arteams":
          message.channel.send("Respondiendo teams");
          if (equipoAzulFinalRcon !== "" && equipoRojoFinalRcon !== "") {
            serverar.rcon.send("say Equipo azul: " + equipoAzulFinalRcon);
            serverar.rcon.send("say Equipo rojo: " + equipoRojoFinalRcon);
            break;
          } else {
            serverar.rcon.send("say No hay equipos en este momento");
            break;
          }
        case "arretry":
          serverar.rcon.connect();
          message.channel.send("Reconectando ar");
          break;
        case "brretry":
          serverbr.rcon.connect();
          message.channel.send("Reconectando br")
          break;
        case "arshuffle":
          funcgestion.shuffle(message, state, client, Discord);
          if (equipoAzulFinalRcon !== "" && equipoRojoFinalRcon !== "") {
            serverar.rcon.send("say Equipo azul: " + equipoAzulFinalRcon);
            serverar.rcon.send("say Equipo rojo: " + equipoRojoFinalRcon);
            break;
          } else {
            serverar.rcon.send("say No hay equipos en este momento");
          }
          message.channel.send("Mezclando equipos...");
          break;
        case "brshuffle":
          funcgestion.shuffle(message, state, client, Discord);
          if (equipoAzulFinalRcon !== "" && equipoRojoFinalRcon !== "") {
            serverbr.rcon.send("say Equipo azul: " + equipoAzulFinalRcon);
            serverbr.rcon.send("say Equipo rojo: " + equipoRojoFinalRcon);
            break;
          } else {
            serverbr.rcon.send("say No hay equipos en este momento");
          }
          message.channel.send("Mezclando equipos...");
          break;
      }
    }
  }
}