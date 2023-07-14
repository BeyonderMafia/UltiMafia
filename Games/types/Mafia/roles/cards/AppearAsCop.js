const Card = require("../../Card");

module.exports = class AppearAsCop extends Card {
  constructor(role) {
    super(role);

    this.appearance = {
      self: "Cop",
      reveal: "Cop",
      condemn: "Cop",
      death: "Cop",
      investigate: "Cop",
    };
  }
};
