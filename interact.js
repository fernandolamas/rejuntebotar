const db = require("./dbconnect");
const Discord = require("discord.js");

const rolDesarrolladores = "Desarrolladores";
const rolDesarrolladoresID = 718165201702223922;

module.exports = {
  interact: (message, status)  => {
    if (message.content.includes("!db")) {
      if (
        //var regexTotal = new RegExp(/(?<=db )((insert\D?)STEAM\D\d\D\d\D\d{0,10}(\D{0,2}.*|)|show|remove\D?\D{0,2}.*|modify\D?<@!?(\d+)>\D<@!?(\d+)>|modify\D?(STEAM\D\d\D\d\D\d+)\D(STEAM\D\d\D\d\D\d+))/);
        message.member.roles.cache.some(
          role => role.name === rolDesarrolladores
        )
      ) {

        var regexTotal = new RegExp(/(?<=db )(insert\D?)STEAM\D\d\D\d\D\d{0,10}(\D{0,2}.*|)/g)
        //https://regexr.com/
        if (regexTotal) {
          //cmd = insert STEAM_0:1:23602676 <@!432423423423432>
          var cmd = message.content.match(/(?<=db )((insert\D)STEAM\D\d\D\d\D\d{0,10}(\D{0,2}.*|)|show|remove\D?\D{0,2}.*|modify\D?<@!?(\d+)>\D<@!?(\d+)>|modify\D?(STEAM\D\d\D\d\D\d+)\D(STEAM\D\d\D\d\D\d+))/g);
          console.log(cmd);
          var cmdargs = cmd[0].match(/(insert\D|remove\D?|show\D?|modify\D?)/g);
          console.log(cmdargs[0]);

          /*
          console.log(message.content);
          var cmd = message.content.match(
            /(?<=db )(insert\D)STEAM\D\d\D\d\D\d{0,10}\D<@!?(\d+)>/g
          );
          console.log(cmd[0]);
          if (cmd && (cmd != null || cmd != undefined)) {
            console.log(cmd[0]);
            var cmdargs = cmd[0].match(
              /(insert\D?|remove\D?|show\D?|modify\D?)/g
            ); // ❌
            console.log(cmdargs[0]);
            */
          switch (
          cmdargs[0] //<- ahora funciona 👌😔
          ) {
            case "insert ":
              //!db insert STEAM_0:1:23602676 @BESTIA - Uso en discord
              //!db insert STEAM_0:0:64012874 @Wenxi (ツ) - Uso en discord
              //cmd[0] = insert STEAM_0:1:23602676 @BESTIA - Como lo lee nuestro bot, un capo carpincho
              var steamid = cmd[0].match(/STEAM\D\d\D\d\D\d{0,10}/g);
              var dsmention = cmd[0].match(/(?<=@!)\d{0,25}/g);
              db.connection.query(
                "INSERT INTO players (DISCORDID, STEAMID)" +
                "VALUES ('" +
                dsmention[0] +
                "', '" +
                steamid[0] +
                "')"
              ),
                function (error, results, fields) {
                  if (error) throw error;
                  console.log("The solution is: ", results[0].solution);
                  if (results) {
                    console.log("Resultados: " + results);
                  }
                };
              message.channel.send("Usuario agregado exitosamente")

              break;
            case "show":
              console.log("entre al show");
              var query = db.connection.query("SELECT * FROM players");
              // Pausing the connnection is useful if your processing involves I/O
              query
                .on("result", function (row) {
                  //db.connection.pause();
                  //console.log(row);
                  var rowFinal = "";
                  rowFinal += "**id**= " + row.id;
                  rowFinal += "\n**DiscordID**= " + row.discordid;
                  rowFinal += "\n**Nickname**= " + "<@" + row.discordid + ">";
                  rowFinal += "\n**SteamID**= " + row.steamid;
                  rowFinal += "\n**MMR**= " + row.mmr;
                  rowFinal += "\n**is_Banned**= " + row.is_banned;
                  rowFinal += "\n**Airshots**= " + row.airshots;
                  rowFinal += "\n**Win**= " + row.win;
                  rowFinal += "\n**Loss**= " + row.loss;

                  var mensajeEmbed = new Discord.MessageEmbed()
                    .setColor("#8e44ad")
                    .setTitle("**Info Usuario**: ")
                    .setDescription(rowFinal);
                  message.channel.send({ embed: mensajeEmbed });
                  //db.connection.resume();
                  //https://dev.mysql.com/doc/refman/5.7/en/row-subqueries.html 👌😔
                })
                .on("error", function (err) {
                  message.channel.send("Hubo un error en la query");
                })
                .on("end", function () {
                  message.channel.send("Todos los jugadores fueron mostrados");
                  //db.connection.end();
                  //console.log("desconectado");
                });

              break;
            case "remove ":
              console.log("entre al remove");
              var idUser = message.mentions.users.first().id;
              console.log("id user " + idUser);
              db.connection.query(
                "DELETE FROM players WHERE discordid = " + idUser
              );
              message.channel.send("Usuario eliminado exitosamente");
              //"DELETE FROM usuarios WHERE id = " + id;
              break;
            case "modify ":
              console.log("Entre al modify");

              if (cmd[0].match(/(?<=modify.*)<@!?(\d+)>\D<@!?(\d+)>/)) {
                //quiere cambiar un discordid por otro discordid

                //!db modify @WenxiRL @TESLA
                var users = cmd[0].match(/(?<=modify.*)<@!?(\d+)>\D<@!?(\d+)>/);
                console.log("primer user: " + users[1]);
                console.log("segundo user: " + users[2]);
                db.connection.query(
                  "UPDATE players set discordid = " +
                  users[2] +
                  " WHERE discordid = " +
                  users[1]
                );

                var query = db.connection.query(
                  "SELECT * FROM players WHERE discordid = " + users[2]
                );
                query
                  .on("result", function (row) {
                    var rowFinal = "";
                    rowFinal += "**id**= " + row.id;
                    rowFinal += "\n**🔰 DiscordID**= " + row.discordid;
                    rowFinal +=
                      "\n**🔰 Nickname**= " + "<@" + row.discordid + ">";
                    rowFinal += "\n**SteamID**= " + row.steamid;
                    rowFinal += "\n**MMR**= " + row.mmr;
                    rowFinal += "\n**is_Banned**= " + row.is_banned;
                    rowFinal += "\n**Airshots**= " + row.airshots;
                    rowFinal += "\n**Win**= " + row.win;
                    rowFinal += "\n**Loss**= " + row.loss;

                    var mensajeEmbed = new Discord.MessageEmbed()
                      .setColor("#2ecc71")
                      .setTitle("**✅ Usuario modificado**: ")
                      .setDescription(rowFinal);
                    message.channel.send({ embed: mensajeEmbed });
                  })
                  .on("end", function () {
                    message.channel.send("✅ Usuario modificado con éxito");
                  });
              }

              if (
                cmd[0].match(
                  /(?<=modify.*)(STEAM\D\d\D\d\D\d+)\D(STEAM\D\d\D\d\D\d+)/
                )
              ) {
                var users = cmd[0].match(
                  /(?<=modify.*)(STEAM\D\d\D\d\D\d+)\D(STEAM\D\d\D\d\D\d+)/
                );
                //quiere cambiar un steamid por steamid
                console.log("primer steamid: " + users[1]);
                console.log("segundo steamid: " + users[2]);

                db.connection.query(
                  "UPDATE players set steamid = '" +
                  users[2] +
                  "' WHERE steamid = '" +
                  users[1] +
                  "'"
                );
                var query = db.connection.query(
                  "SELECT * FROM players WHERE steamid = '" + users[2] + "'"
                );
                query
                  .on("result", function (row) {
                    var rowFinal = "";
                    rowFinal += "**id**= " + row.id;
                    rowFinal += "\n**DiscordID**= " + row.discordid;
                    rowFinal += "\n**Nickname**= " + "<@" + row.discordid + ">";
                    rowFinal += "\n**🔰 SteamID**= " + row.steamid;
                    rowFinal += "\n**MMR**= " + row.mmr;
                    rowFinal += "\n**is_Banned**= " + row.is_banned;
                    rowFinal += "\n**Airshots**= " + row.airshots;
                    rowFinal += "\n**Win**= " + row.win;
                    rowFinal += "\n**Loss**= " + row.loss;

                    var mensajeEmbed = new Discord.MessageEmbed()
                      .setColor("#2ecc71")
                      .setTitle("**✅ Usuario modificado**: ")
                      .setDescription(rowFinal);
                    message.channel.send({ embed: mensajeEmbed });
                  })
                  .on("end", function () {
                    message.channel.send("✅ Usuario modificado con éxito");
                  });
              }

              break;
          }
        } else {
          message.channel.send("No entendi lo que quisiste poner de comando");
        }
      } else {
        message.channel.send("No tenes acceso para modificar la base");
      }
    }
    if (message.content.includes("!br")) {
      switch (message.content) {
        case includes("add"):
          console.log("consultando rows");
          var query = db.connection.query("SELECT discordid FROM players where STEAMID="+ steamid);
          query
            .on("result", function (row) {
              if(status.rejunteArray.includes(discordid)){
                serverbr.rcon.send("say Ya estas en el rejunte")
              }{
                status.rejunteArray.push(row.discordid);
                serverbr.rcon.send("say Fuiste agregado al rejunte")
              }
            })

            .on("error", function (err) {
              message.channel.send("No se pudo obtener los resultados" + err);
            });

        case includes("remove"):

      }

    }
  }
};
