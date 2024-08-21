const Card = require("../../Card");
const Action = require("../../../../core/Action");
const { PRIORITY_DAY_DEFAULT } = require("../../const/Priority");
const { PRIORITY_INVESTIGATIVE_DEFAULT } = require("../../const/Priority");

module.exports = class CountEvilVotes extends Card {
  constructor(role) {
    super(role);

    this.actions = [
      {
        priority: PRIORITY_DAY_DEFAULT + 1,
        labels: ["hidden", "absolute"],
        run: function () {
          if (this.game.getStateName() != "Day") return;

          let villageMeeting = this.game.getMeetingByName("Village");

          //New code
          const voteCounts = Object.values(villageMeeting.votes).reduce(
            (acc, vote) => {
              acc[vote] = (acc[vote] || 0) + 1;
              return acc;
            },
            {}
          );

          const minVotes = Math.min(...Object.values(voteCounts));
          const maxVotes = Math.max(...Object.values(voteCounts));
          let villageVotes = this.actor.role.data.VotingLog;
          this.actor.role.data.evilVoted = false;
          //this.actor.queueAlert(`${maxVotes}`);

          for (let x = 0; x < villageVotes.length; x++) {
            if (
              this.game.getRoleAlignment(
                villageVotes[x].voter.getRoleAppearance().split(" (")[0]
              ) == "Cult" ||
              this.game.getRoleAlignment(
                villageVotes[x].voter.getRoleAppearance().split(" (")[0]
              ) == "Mafia"
            ) {
              if (voteCounts[villageVotes[x].target] == maxVotes) {
                this.actor.role.data.evilVoted = true;
              }
            }
          }
        },
      },
      {
        priority: PRIORITY_INVESTIGATIVE_DEFAULT,
        labels: ["investigate"],
        run: function () {
          if (this.game.getStateName() != "Night") return;

          let outcome = "No";
          var alert;
          if (this.actor.role.data.VotingLog.length <= 0) return;
          if (this.actor.hasEffect("FalseMode")) {
            if (this.actor.role.data.evilVoted) {
              this.actor.role.data.evilVoted = false;
            } else {
              this.actor.role.data.evilVoted = true;
            }
          }

          if (this.actor.role.data.evilVoted == true) {
            alert = `:invest: You learn that at least 1 Evil Player voted with the Majority yesterday!`;
          } else {
            alert = `:invest: You learn that no evil players voted with the Majority yesterday!`;
          }

          this.actor.queueAlert(alert);
        },
      },
    ];

    this.listeners = {
      state: function (stateInfo) {
        if (!this.player.alive) return;

        if (stateInfo.name.match(/Day/)) {
          this.player.role.data.VotingLog = [];
        }
      },
      vote: function (vote) {
        if (vote.meeting.name === "Village") {
          let votes = this.player.role.data.VotingLog;

          for (let y = 0; y < votes.length; y++) {
            if (votes[y].voter == vote.voter) {
              this.player.role.data.VotingLog[y] = vote;
              return;
            }
          }
          this.player.role.data.VotingLog.push(vote);
        }
      },
    };
  }
};
