module.exports = {
  cmds: (
    message,
    rejunteArray,
    equipoAzul,
    equipoRojo,
    rejunteMaxSize,
    rolRejuntero,
    mitadDelTotalDeJugadores
  ) => {
    var capitanAzul;
    var capitanRojo;
    var eligeAzul;
    var eligeRojo;
    var eligioPrimero;
    if (message.content.includes("!cap azul")) {
      if (message.member.roles.cache.some(role => role.name === rolRejuntero)) {
        {
          if (rejunteArray.length === rejunteMaxSize) {
            equipoAzul = [];

            if (rejunteArray.includes(message.mentions.users.first().id)) {
              message.channel.send(
                "El capitan azul ahora es:" +
                  "<@" +
                  message.mentions.users.first().id +
                  ">"
              );
              var user = message.mentions.users.first().id;
              equipoAzul.push(user);
              capitanAzul = user;
            }
          } else {
            message.channel.send(
              "El rejunte aun no está lleno como para elegir capitanes"
            );
          }
        }
      } else {
        message.channel.send(
          "No tienes permiso para elegir al capitan " + message.author.username
        );
      }
    }

    if (message.content.includes("!cap rojo")) {
      if (message.member.roles.cache.some(role => role.name === rolRejuntero)) {
        if (rejunteArray.length === rejunteMaxSize) {
          equipoRojo = [];
          if (rejunteArray.includes(message.mentions.users.first().id)) {
            message.channel.send(
              "El capitan rojo ahora es:" +
                "<@" +
                message.mentions.users.first().id +
                ">"
            );
            var user = message.mentions.users.first().id;
            equipoRojo.push(user);
            capitanRojo = user;
          }
        } else {
          message.channel.send(
            "El rejunte aun no está lleno como para elegir capitanes"
          );
        }
      } else {
        message.channel.send(
          "No tienes permiso para elegir al capitan " + message.author.username
        );
      }
    }
    if (capitanAzul && capitanRojo) {
      var random = Math.trunc(Math.random() * 2);

      switch (random) {
        case 0:
          eligeAzul = true;
          eligioPrimero = "azul";
          message.channel.send("Debera elegir primero el equipo azul");
          break;
        case 1:
          eligeRojo = true;
          eligioPrimero = "rojo";
          message.channel.send("Debera elegir primero el equipo rojo");
          break;
      }
    }
        if (message.content.includes("!elegir")) {
      //obtener el equipo de la persona que esta eligiendo

      if (rejunteArray.length >= 4) {
        if (message.author.id === capitanAzul && eligeAzul) {
          if (rejunteArray.includes(message.mentions.users.first().id)) {
            message.channel.send(
              "<@" +
                message.mentions.users.first().id +
                "> Ahora forma parte del equipo azul"
            );
            equipoAzul.push(message.mentions.users.first().id);

            if (
              equipoAzul.length === mitadDelTotalDeJugadores - 2 &&
              eligioPrimero === "rojo"
            ) {
              eligeAzul = true;
              eligeRojo = false;
            } else {
              eligeAzul = false;
              eligeRojo = true;
            }
          }
        } else {
          message.channel.send("No es tu turno de elegir");
        }

        if (message.author.id === capitanRojo && eligeRojo) {
          if (rejunteArray.includes(message.mentions.users.first().id)) {
            message.channel.send(
              "<@" +
                message.mentions.users.first().id +
                "> Ahora forma parte del equipo rojo"
            );
            equipoRojo.push(message.mentions.users.first().id);

            if (
              equipoAzul.length === mitadDelTotalDeJugadores - 2 &&
              eligioPrimero === "azul"
            ) {
              eligeAzul = false;
              eligeRojo = true;
            } else {
              eligeAzul = true;
              eligeRojo = false;
            }
          }
        } else {
          message.channel.send("No es tu turno de elegir");
        }
      } else
        message.channel.send("Solo se permite elegir en partidas de 2v2 o más");
    }

  }
};
