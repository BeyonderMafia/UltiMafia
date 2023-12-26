const Card = require("../../Card");

module.exports = class TownCore extends Card {
  constructor(role) {
    super(role);

    this.meetings = {
      Town: {
        states: ["*"],
        flags: ["group", "speech"],
        priority: 0,
        whileDead: true,
        speakDead: true,
      },
    };
  }
};