const Card = require("../../Card");

module.exports = class Solitary extends Card {

	constructor(role) {
		super(role);

		this.meetingMods = {
			"Mafia": {
				disabled: true
			},
			"Monsters": {
				disabled: true
			},
			"Illuminati Meeting": {
				disabled: true
			},
			"Learn Alignment": {
				disabled: true
			},
		};
	}

}
