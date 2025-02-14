const Card = require("../../Card");

module.exports = class MeetingTurkey extends Card {
  constructor(role) {
    super(role);

    this.meetings = {
      "Turkey Meeting": {
        states: ["Night"],
        flags: ["group", "speech"],
      },
    };

    this.listeners = {
      roleAssigned: function (player) {
        if (player != this.player) return;

        if (
          this.game.CurrentEvents.filter((e) => e.split(":")[0] == "Famine")
            .length <= 0
        ) {
          this.game.CurrentEvents.push("Famine");
        }
      },
    };
  }
};
