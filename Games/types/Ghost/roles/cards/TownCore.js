const Card = require("../../Card");

module.exports = class TownCore extends Card {
  constructor(role) {
    super(role);

    this.meetings = {
      Village: {
        states: ["Day"],
        flags: ["group", "speech", "voting"],
        targets: { include: ["alive"] },
        whileDead: true,
        passiveDead: true,
        speakDead: true,
        action: {
          labels: ["lynch"],
          run: function () {
            this.game.continueVoting = true;
            if (this.dominates()) this.target.kill();
          },
        },
      },
    };
  }
};
