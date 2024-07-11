const Card = require("../../Card");
const Random = require("../../../../../lib/Random");
const { PRIORITY_INVESTIGATIVE_DEFAULT } = require("../../const/Priority");

module.exports = class LearnOneOfTwoPlayers extends Card {
  constructor(role) {
    super(role);

    this.actions = [
      {
        priority: PRIORITY_INVESTIGATIVE_DEFAULT,
        run: function () {
          if (!this.actor.alive) return;
          if (this.game.getStateName() != "Night") return;
          if (this.actor.role.hasInfo) return;

          var alive = this.game.players.filter(
            (p) => p.alive && p != this.actor
          );

          if (Random.randInt(0, 1) == 0) {
            var townPlayers = alive.filter(
              (p) =>
                this.game.getRoleAlignment(
                  p.getRoleAppearance().split(" (")[0]
                ) == "Village"
            );

            if (townPlayers.length == 0) {
              this.actor.queueAlert(
                ` You learn that you are the only Village Aligned Player.`
              );
              this.actor.role.hasInfo = true;
              return;
            } else {
              const chosenTown = Random.randArrayVal(townPlayers);
              var aliveRemoveTarget = alive.filter((p) => p != chosenTown);
              const chosenRandom = Random.randArrayVal(aliveRemoveTarget);
              let chosenRole = chosenTown.getRoleAppearance();
              let chosenNames = [chosenTown, chosenRandom];
              let chosenNamesRan = Random.randomizeArray(chosenNames);
              this.actor.queueAlert(
                ` You learn that ${chosenNamesRan[0].name} or ${chosenNamesRan[1].name} is a ${chosenRole}.`
              );
              this.actor.role.hasInfo = true;
            }
          } else {
            var evilPlayers = alive.filter(
              (p) =>
                this.game.getRoleAlignment(
                  p.getRoleAppearance().split(" (")[0]
                ) == "Cult" ||
                this.game.getRoleAlignment(
                  p.getRoleAppearance().split(" (")[0]
                ) == "Mafia"
            );
            if (evilPlayers.length == 0) {
              this.actor.queueAlert(
                ` You learn that no Cult or Mafia are present.`
              );
              this.actor.role.hasInfo = true;
              return;
            } else {
              const chosenEvil = Random.randArrayVal(evilPlayers);
              var aliveRemoveTarget = alive.filter((p) => p != chosenEvil);
              const chosenRandom = Random.randArrayVal(aliveRemoveTarget);
              let chosenRole = chosenEvil.getRoleAppearance();
              let chosenNames = [chosenEvil, chosenRandom];
              let chosenNamesRan = Random.randomizeArray(chosenNames);
              this.actor.queueAlert(
                ` You learn that ${chosenNamesRan[0].name} or ${chosenNamesRan[1].name} is a ${chosenRole}.`
              );
              this.actor.role.hasInfo = true;
            }
          }
        },
      },
    ];
  }
};
