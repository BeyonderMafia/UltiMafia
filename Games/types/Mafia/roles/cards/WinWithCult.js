const Card = require("../../Card");
const {
  PRIORITY_WIN_CHECK_DEFAULT,
  PRIORITY_SUNSET_DEFAULT,
} = require("../../const/Priority");

module.exports = class WinWithCult extends Card {
  constructor(role) {
    super(role);

    this.winCheck = {
      priority: PRIORITY_WIN_CHECK_DEFAULT,
      check: function (counts, winners, aliveCount) {
        function cultWin(role) {
          winners.addPlayer(
            role.player,
            role.alignment === "Cult" ? "Cult" : role.name
          );
        }

        if (this.player.hasItem("IsTheTelevangelist")) {
          return;
        }

        const aliveNyarlathotep = this.game
          .alivePlayers()
          .filter(
            (p) => p.role.name === "Nyarlathotep" && p.role.data.NyarlathotepWin
          );
        if (aliveNyarlathotep.length > 0) {
          if (
            this.game.getStateName() == "Day" &&
            aliveNyarlathotep[0].role.data.NyarlathotepWin
          ) {
            cultWin(this);
            return;
          }
        }

        const soldiersInGame = this.game
          .alivePlayers()
          .filter((p) => p.role.name == "Soldier");

        if (soldiersInGame.length > 0) {
          if (soldiersInGame.length == aliveCount / 2 && aliveCount > 0) {
            // soldiers are present, cult cannot win
            return;
          }
        }

        const ShoggothInGame = this.game
          .alivePlayers()
          .filter((p) => p.role.name == "Shoggoth" && !p.role.revived);

        if (ShoggothInGame.length > 0) {
          // shoggoth hasn't Revived, cult cannot win
          return;
        }

        let lunatics = this.game.players.filter(
          (p) => p.hasItem("IsTheTelevangelist") && p.role.alignment == "Cult"
        );
        if (lunatics.length > 0) {
          return;
        }

        // win by majority
        const hasMajority = counts["Cult"] >= aliveCount / 2 && aliveCount > 0;
        if (hasMajority) {
          cultWin(this);
          return;
        }

        // win by Changeling
        const aliveChangelings = this.game
          .alivePlayers()
          .filter(
            (p) => p.role.name === "Changeling" && p.role.data.twincondemned
          );
        if (aliveChangelings.length > 0) {
          cultWin(this);
          return;
        }

        // win by guessing seer
        const seersInGame = this.game.players.filter(
          (p) => p.role.name == "Seer"
        );
        if (seersInGame.length <= 0) {
          return;
        }

        if (
          seersInGame.length > 0 &&
          seersInGame.length == this.game.guessedSeers["Cult"].length
        ) {
          cultWin(this);
          return;
        }
      },
    };
    this.listeners = {
      roleAssigned: function (player) {
        if (player !== this.player) return;

        if (!this.game.guessedSeers) {
          this.game.guessedSeers = {};
        }
        this.game.guessedSeers["Cult"] = [];

        if (this.oblivious["Cult"]) return;

        if (this.player.hasItem("IsTheTelevangelist")) {
          this.player.role.appearance.reveal = "Televangelist";
          for (let player of this.game.players) {
            if (
              player.role.alignment === "Cult" &&
              player !== this.player &&
              player.role.name !== "Politician" &&
              player.role.name !== "Hitchhiker" &&
              !player.role.oblivious["self"] &&
              !player.hasItem("IsTheTelevangelist")
            ) {
              this.revealToPlayer(player);
            }
          }
          return;
        }

        for (let player of this.game.players) {
          if (
            player.role.alignment === "Cult" &&
            player !== this.player &&
            player.role.name !== "Politician" &&
            player.role.name !== "Hitchhiker" &&
            !player.role.oblivious["self"] &&
            !player.hasItem("IsTheTelevangelist")
          ) {
            this.revealToPlayer(player);
          } else if (
            player.hasItem("IsTheTelevangelist") &&
            !this.game
              .getRoleTags(this.player.role.name)
              .join("")
              .includes("Endangered") &&
            !this.game
              .getRoleTags(this.player.role.name)
              .join("")
              .includes("Kills Cultist")
          ) {
            this.revealToPlayer(player);
          }
        }
      },
    };

    // seer meeting and state mods
    this.meetings = {
      "Guess Seer": {
        states: ["Sunset"],
        flags: ["voting"],
        shouldMeet: function () {
          if (
            this.game.players.filter((p) => p.role.name == "Seer").length <= 0
          ) {
            return false;
          }

          for (const action of this.game.actions[0]) {
            if (action.hasLabel("condemn") && action.target == this.player) {
              return true;
            }
          }

          return false;
        },
        action: {
          labels: ["kill"],
          priority: PRIORITY_SUNSET_DEFAULT,
          run: function () {
            if (this.target.role.name !== "Seer") {
              return;
            }

            this.game.guessedSeers["Cult"].push(this.target);
            this.target.kill("condemnRevenge", this.actor);
          },
        },
      },
    };

    this.stateMods = {
      Day: {
        type: "delayActions",
        delayActions: true,
      },
      Overturn: {
        type: "delayActions",
        delayActions: true,
      },
      Sunset: {
        type: "add",
        index: 6,
        length: 1000 * 30,
        shouldSkip: function () {
          if (
            this.game.players.filter((p) => p.role.name == "Seer").length <= 0
          ) {
            return true;
          }

          if (this.player.hasItem("IsTheTelevangelist")) {
            return true;
          }

          for (let action of this.game.actions[0])
            if (action.target == this.player && action.hasLabel("condemn"))
              return false;

          return true;
        },
      },
    };
  }
};
