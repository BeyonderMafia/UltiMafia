const Card = require("../../Card");
const Random = require("../../../../../lib/Random");
const {
  PRIORITY_INVESTIGATIVE_AFTER_RESOLVE_DEFAULT,
} = require("../../const/Priority");
const { addArticle } = require("../../../../core/Utils");

module.exports = class ModifierLoud extends Card {
  constructor(role) {
    super(role);

    this.startEffects = ["Leak Whispers"];
    this.actions = [
      {
        priority: PRIORITY_INVESTIGATIVE_AFTER_RESOLVE_DEFAULT + 2,
        labels: [
          "investigate",
          "alerts",
          "hidden",
          "absolute",
          "uncontrollable",
        ],
        run: function () {
          if (this.game.getStateName() != "Night") return;

          let visitors = this.getVisitors();
          if (visitors?.length) {
            let names = visitors?.map((visitor) => visitor.name);

            if (this.actor.hasEffect("FalseMode")) {
              let players = this.game
                .alivePlayers()
                .filter((p) => p != this.actor);

              for (let v of visitors) {
                players = players.filter((p) => p != v);
              }
              names = [];
              for (let x = 0; x < visitors.length; x++) {
                let randomPlayer = Random.randArrayVal(players).name;
                names.push(randomPlayer);
              }
            }

            this.game.queueAlert(
              `:loud: Someone shouts during the night: ` +
                `Curses! ${names.join(", ")} disturbed my slumber!`
            );
            this.actor.role.data.visitors = [];
          }

          let reports = this.getReports(this.actor);
          for (let report of reports) {
            this.game.queueAlert(
              `:loud: ${addArticle(
                this.actor.getRoleAppearance()
              )} is overheard reading: ${report}`
            );
          }
        },
      },
    ];
  }
};
