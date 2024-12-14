const Information = require("../Information");
const Random = require("../../../../lib/Random");
const {
  EVIL_FACTIONS,
  NOT_EVIL_FACTIONS,
  CULT_FACTIONS,
  MAFIA_FACTIONS,
  FACTION_LEARN_TEAM,
  FACTION_WIN_WITH_MAJORITY,
  FACTION_WITH_MEETING,
  FACTION_KILL,
} = require("../const/FactionList");

module.exports = class EvilDeadCountInfo extends Information {
  constructor(creator, game) {
    super("Evil Dead Count Info", creator, game);

            let evilCount;
            let players = this.game.deadPlayers();

            if (players.length <= 0) {
              this.mainInfo = 0;
              return;
            }

            var evilPlayers = players.filter(
              (p) => this.isAppearanceEvil(p)
            );
            evilCount = evilPlayers.length;            
            this.mainInfo = evilCount;
          
  }

  getInfoRaw() {
    super.getInfoRaw();
    return this.mainInfo;
  }

  getInfoFormated() {
    super.getInfoRaw();
    return `You Learn that ${this.mainInfo} Dead Players are Evil.`;
  }

  isTrue() {
    let evilCount;
    let players = this.game.deadPlayers();

            var evilPlayers = players.filter(
              (p) => this.isEvil(p)
            );
            evilCount = evilPlayers.length;  
    if(this.mainInfo == evilCount){
      return true;
    }
    else{
      return false;
    }
            
  }
  isFalse() {
    if (this.isTrue()) {
      return false;
    } else {
      return true;
    }
  }
  isUnfavorable() {
    let players = this.game.deadPlayers();
    let totalEvilCount = this.game.players.filter((p) => p.isAppearanceEvil(p));
    let number = 0;
    for(let x = 0; x <= players.length && x <= (totalEvilCount.length-1);x++){
      number++;
    }
    if (this.mainInfo == number) {
      return true;
    } else {
      return false;
    }
  }
  isFavorable() {
    if (this.mainInfo == 0) {
      return true;
    } else {
      return false;
    }
  }

  makeTrue() {
            let evilCount;
            let players = this.game.deadPlayers();

            if (players.length <= 0) {
              this.mainInfo = 0;
            }

            var evilPlayers = players.filter(
              (p) => this.isEvil(p)
            );
            evilCount = evilPlayers.length;            
            this.mainInfo = evilCount;
  }
  makeFalse() {
    this.makeTrue();
    let totalEvilCount = this.game.players.filter((p) => this.isAppearanceEvil(p));
    let trueEvilCount = this.game.players.filter((p) => this.isEvil(p));
    let deadPlayers = this.game.deadPlayers();
    let alivePlayers = this.game.alivePlayers();

    
    
   if(this.mainInfo == 0 && deadPlayers.length < 2){
     this.mainInfo = 1;
   }
  else if(this.mainInfo == 0){
    this.mainInfo = this.mainInfo+1;
    if(deadPlayers.length >= 2 && trueEvilCount.length > 2){
      this.mainInfo = this.mainInfo+1;
    }
  }
  else{
    this.mainInfo = this.mainInfo-1;
  }
  }
  makeFavorable() {
    this.mainInfo = 0;
  }
  makeUnfavorable() {
    let players = this.game.deadPlayers();
    let totalEvilCount = this.game.players.filter((p) => p.isAppearanceEvil(p));
    let number = 0;
    for(let x = 0; x <= players.length && x <= (totalEvilCount.length-1);x++){
      number++;
    }
    this.mainInfo = number;
  }
};
