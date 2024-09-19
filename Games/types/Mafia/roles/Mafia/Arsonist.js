const Role = require("../../Role");

module.exports = class Arsonist extends Role {
  constructor(player, data) {
    super("Arsonist", player, data);
    this.alignment = "Mafia";
    this.cards = [
      "VillageCore",
      "WinWithFaction", "MeetingFaction",
      
      "DouseInGasoline",
    ];
  }
};
