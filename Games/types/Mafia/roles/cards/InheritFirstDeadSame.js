const Card = require("../../Card");
const Action = require("../../Action");

module.exports = class InheritFirstDeadSame extends Card {
  constructor(role) {
    super(role);

    this.listeners = {
      death: function (player) {
        let modifiers = player.role.modifier;
        if (
          player !== this.player &&
          player.role.name === this.player.role.name &&
          !modifiers.match(/Reserve/) &&
          this.player.alive
        ) {
          let inheritAction = new Action({
            labels: ["hidden", "absolute"],
            actor: this.player,
            target: player,
            game: this.player.game,
            run: function () {
              this.actor.queueAlert(
                `:tomb: You decide to become ${this.target.role.getRevealText(
                  this.target.role.name,
                  this.target.role.modifier
                )}, filling up the gap that ${this.target.name} left.`
              );
              this.actor.setRole(
                `${this.target.role.name}:${this.target.role.modifier}`,
                this.target.role.data
              );
            },
          });
          inheritAction.do();
        }
      },
    };
  }
};
