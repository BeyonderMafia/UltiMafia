const Role = require("../../Role");

module.exports = class Doomsayer extends Role {
  constructor(player, data) {
    super("Doomsayer", player, data);

    this.alignment = "Cult";
    this.cards = [
      "VillageCore",
      "WinWithFaction", "MeetingFaction",
      
      "ConvertVisitors",
      "KillCultistsOnDeath",
    ];
  }
};
