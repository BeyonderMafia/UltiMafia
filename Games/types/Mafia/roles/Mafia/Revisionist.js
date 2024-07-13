const Role = require("../../Role");

module.exports = class Revisionist extends Role {
  constructor(player, data) {
    super("Revisionist", player, data);
    this.alignment = "Mafia";
    this.cards = [
      "VillageCore",
      "WinWithMafia",
      "MeetingMafia",
      "ReceiveAllReports",
    ];
    this.meetingMods = {
      ReceiveAllReports: {
        actionName: "Check Records",
      },
    };
  }
};
