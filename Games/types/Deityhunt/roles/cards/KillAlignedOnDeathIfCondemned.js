const Card = require("../../Card");

module.exports = class KillAlignedOnDeathIfCondemned extends Card {
  constructor(role) {
    super(role);

    this.listeners = {
      death: function (player, killer, killType, instant) {
        
        if (player !== this.player) return;
        if (killType !== "lynch") return;

        let alive = this.game.players.filter((p) => p.alive);

        for (let p of this.game.alivePlayers()) {
          if (p.role.alignment === this.player.role.alignment) {
            p.kill("basic", this.player, instant);
          }
        }
      },
    };
  }
};
