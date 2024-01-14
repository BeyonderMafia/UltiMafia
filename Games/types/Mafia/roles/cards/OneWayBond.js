const Card = require("../../Card");
const { PRIORITY_EFFECT_GIVER_DEFAULT } = require("../../const/Priority");

module.exports = class OneWayBond extends Card {
  constructor(role) {
    super(role);

    this.meetings = {
      "Love Forever": {
        actionName: "Fall in Love",
        states: ["Night"],
        flags: ["voting"],
        action: {
          priority: PRIORITY_EFFECT_GIVER_DEFAULT,
          run: function () {
            if (this.actor.role.name == "Yandere") {
              this.actor.giveEffect("InLoveWith", this.target);
            }
            this.queueGetEffectAlert(
              "InLoveWith",
              this.actor,
              this.target.name
            );

            this.actor.role.loved = true;
          },
        },
        shouldMeet() {
          return !this.loved;
        },
      },
    };
  }
};
