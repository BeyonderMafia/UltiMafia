const Role = require("../../Role");

module.exports = class Satyr extends Role {
  constructor(player, data) {
    super("Satyr", player, data);

    this.alignment = "Cult";
    this.cards = [
      "VillageCore",
      "WinWithCult",
      "MeetingCult",
      "Endangered",
      "MindRotNeighbors",
      "NightKiller",
    ];
    this.meetingMods = {
      "Solo Kill": {
        targets: { include: ["alive"], exclude: ["Cult"] },
      },
    };
  }
};
