const Role = require("../../Role");

module.exports = class Vampire extends Role {
  constructor(player, data) {
    super("Vampire", player, data);

    this.alignment = "Cult";
    this.cards = [
      "VillageCore",
      "WinWithCult",
      "MeetingCult",
      "VampireKill",
      "VampireSetup",
      "VampireVotes",
    ];
    this.meetingMods = {
      Village: {
        voteWeight: 0,
      },
    };
  }
};
