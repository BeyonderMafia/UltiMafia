const Role = require("../../Role");

module.exports = class Atheist extends Role {
  constructor(player, data) {
    super("Atheist", player, data);

    this.alignment = "Independent";
    this.winCount = "Village";
    this.cards = ["VillageCore", "WinWithVillage", "RemoveEvilRoles", "AtheistGame"];
  }
};
