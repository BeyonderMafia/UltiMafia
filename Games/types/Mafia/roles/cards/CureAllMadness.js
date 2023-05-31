const Card = require("../../Card");
const { PRIORITY_EFFECT_GIVER_DEFAULT } = require("../../const/Priority");

module.exports = class CureAllMadness extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Cure Madness": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    priority: PRIORITY_EFFECT_GIVER_DEFAULT + 1,
                    run: function () {
                        // cure insanity
                        if (this.target.hasEffect("Insanity")) {
                            this.target.removeEffect("Insanity", true);
                        }

                        // prevents conversion
                        this.target.setTempImmunity("convert", 1);

                        // converts serial killers to villagers
                        if (this.target.role.name == "Serial Killer") {
                            this.target.setRole("Villager")
                        }
                    }
                }
            }
        };
    }

}
