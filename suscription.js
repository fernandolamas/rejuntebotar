const rolNotificaciones = "Suscrito";
const rolNotificacionesID = "719584586706976888";

module.exports = {
  
  rolNotificaciones : rolNotificaciones,
  rolNotificacionesID : rolNotificacionesID,
  
  
  subs: (message) => {
    
    
    if (message.content === "!suscribe") {
      
      if (
        message.member.roles.cache.some(role => role.name === rolNotificaciones)
      ) {
        message.channel.send(message.author.username + " ya estas subscrito");
      } else {
        message.member.roles.add([rolNotificacionesID]);

        message.channel.send(
          message.author.username +
            " ahora te avisaremos por privado cuando falte gente para el mix"
        );
      }
    }

    if (message.content === "!unsuscribe") {
      if (
        message.member.roles.cache.some(role => role.name === rolNotificaciones)
      ) {
        message.member.roles.remove([rolNotificacionesID]);
        message.channel.send(
          message.author.username + " ya no recibiras mas notificaciones"
        );
      }
    }
  }
};
