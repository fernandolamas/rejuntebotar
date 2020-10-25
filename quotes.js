var quotes = "pitfall";

module.exports = {
  emilio: message => {
    if (message.content === "emilio") {
      const emoji =
        "<:bestia:" +
        message.guild.emojis.cache.find(emoji => emoji.name === "bestia") +
        ">"+
	":beers:" +
	"<:emilio:" +
	message.guild.emojis.cache.find(emoji => emoji.name === "emilio") +
	">";
      message.channel.send(emoji);
    }
  },
  
  redxll: message => {
    if (message.author.id === "641108756511588352") {
      var prob = Math.trunc(Math.random() * 5+1);
      if(prob === 1)
        message.react("☕");
              
    }
  },
  pelotudo: message => {
    var regexPuteadas = /(?<=(bot).*)mierda|choto|pelotudo|asqueroso|poronga/;
    if(regexPuteadas.test(message.content)){
      //var prob = Math.trunc(Math.random() * 5+1);
      //if(prob === 1)
        //switch
      message.channel.send("pegate un tiro hijo de puta");
    }
  },
  
  mentionbot: message =>{
    if( message.mentions.has('718171345120264203')){
      console.log("entre a mi mention");
      message.channel.send("Que mierda queres ?");
    }
  },
  
  jason: message =>{
      if (message.content.includes(quotes)) {
      switch (quotes) {
        case "pitfall":
          message.channel.send("pitfall es una mierda a jason solo le gusta");
          break;}


    }
  },
  
  chicho: message =>{
  if (message.author.id === "695055359668256849") {
    var prob = Math.trunc(Math.random() * 5+1);
      if(prob === 1)
        {
          message.react("💩");
        }
    }
  }
};

