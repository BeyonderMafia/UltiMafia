const Card = require("../../Card");

module.exports = class Warlockracy extends Card {
  constructor(role) {
    super(role);

    this.meetings = {
      "Predict Vote": {
        states: ["Night"],
        flags: ["voting"],
        action: {
          run: function () {
            this.actor.role.predictedVote = this.target;
          },
        },
      },
    };

    this.listeners = {
      state: function (stateInfo) {
        if (!this.player.alive) {
          return;
        }

        if (!stateInfo.name.match(/Night/)) {
          return;
        }

        delete this.predictedVote;
      },
    };
  }
};
