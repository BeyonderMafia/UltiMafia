const Card = require("../../Card");
const { PRIORITY_MODIFY_ACTION_DELAY } = require("../../const/Priority");

module.exports = class DelayAction extends Card {
  constructor(role) {
    super(role);

    this.meetings = {
      "Stick Honey": {
        states: ["Night"],
        flags: ["voting"],
        //whoever originally coded this was extremely lazy
        targets: { include: ["alive"], exclude: ["Cult"] },
        action: {
          labels: ["delayAction"],
          priority: PRIORITY_MODIFY_ACTION_DELAY,
          run: function () {
            if (this.dominates()) {
              for (let action of this.game.actions[0]) {
                if (action.actor === this.target) {
                  this.game.dequeueAction(action, true);
                  action.delay = 1;
                  this.game.queueAction(action);
                }
              }
            }
          },
        },
      },
    };
  }
};
