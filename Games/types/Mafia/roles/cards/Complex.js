const Card = require("../../Card");
const Player = require("../../../../core/Player");
const { PRIORITY_NIGHT_ROLE_BLOCKER } = require("../../const/Priority");

module.exports = class Complex extends Card {
  constructor(role) {
    super(role);

    this.actions = [
      {
        priority: PRIORITY_NIGHT_ROLE_BLOCKER,
        labels: ["block", "hidden"],
        run: function () {
          if (
            this.game.getStateName() != "Night" &&
            this.game.getStateName() != "Dawn"
          )
            return;

          if (!this.actor.alive) return;

          for (let action of this.game.actions[0]) {
            if (action.hasLabel("absolute")) {
              continue;
            }
            if (action.hasLabel("mafia")) {
              continue;
            }
            if (action.hasLabel("hidden")) {
              continue;
            }

            let toCheck = action.target;
            if (!Array.isArray(action.target)) {
              toCheck = [action.target];
            }

            if (
              action.actors.indexOf(this.actor) != -1 &&
              !action.hasLabel("hidden") &&
              action.target &&
              toCheck[0] instanceof Player
            ) {
              for (let y = 0; y < toCheck.length; y++) {
                if (this.isVanillaRole(toCheck[y])) {
                  if (
                    action.priority > this.priority &&
                    !action.hasLabel("absolute")
                  ) {
                    action.cancelActor(this.actor);
                    break;
                  }
                }
              }
            }
          }
        },
      },
    ];
  }
};
