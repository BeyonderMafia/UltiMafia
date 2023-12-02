const Card = require("../../Card");

module.exports = class VisitOnlyDead extends Card {
  constructor(role) {
    super(role);

    this.meetingMods = {
        "*": {
            ttargets: { include: ["dead"], exclude: ["self", excludeAliveOnlyIfSecondary] },
        },
      };
  }
};

function (meetingName) {
  // core meetings
  if (
    meetingName == "Village" ||
    meetingName == "Mafia" ||
    meetingName == "Cult" ||
    meetingName == "Graveyard"
  )
    return true;
  
  // meetings invited by others
  if (
    meetingName == "Party!" ||
    meetingName == "Hot Springs" ||
    meetingName == "Banquet" ||
    meetingName.startsWith("Jail with") ||
    meetingName.startsWith("Seance with")
  ) {
    return true;
  }

  return false;
}
