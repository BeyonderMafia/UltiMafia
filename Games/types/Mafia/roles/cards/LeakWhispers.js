const Card = require("../../Card");
const { PRIORITY_EFFECT_GIVER_DEFAULT } = require("../../const/Priority");

module.exports = class LeakWhispers extends Card {
  constructor(role) {
    super(role);

    this.meetings = {
      Leak: {
        states: ["Night"],
        flags: ["voting"],
        targets: { include: ["alive"], exclude: ["Mafia"] },
        action: {
          labels: ["effect", "blind"],
          priority: PRIORITY_EFFECT_GIVER_DEFAULT,
          run: function () {
            if (this.dominates()) {
              this.target.giveEffect("Leak Whispers", 2);
            }
          },
        },
      },
    };
  }
};
