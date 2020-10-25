module.exports = {
  startflush: (serverbr) => {
    serverbr.rcon.send("status")
  }
}
