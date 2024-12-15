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

module.exports = class RoleInfo extends Information {
  constructor(creator, game, amount, goodRolesOnly) {
    super("Excess Roles Info", creator, game);
    if (amount == null) {
      amount = 1;
    }
    this.amount = amount;
    if (goodRolesOnly == null || goodRolesOnly == false) {
      this.goodRolesOnly = false;
    }
    else{
      this.goodRolesOnly = true;
    }

    let roles = this.game.PossibleRoles.filter((r) => r);
    let players = this.game.players.filter((p) => p.role);
    let currentRoles = [];

              for (let x = 0; x < players.length; x++) {
                currentRoles.push(`${players[x].role.name}:${players[x].role.modifier}`);
              }
              for (let y = 0; y < currentRoles.length; y++) {
                roles = roles.filter(
                  (r) => r != `${currentRoles[y].name}:${currentRoles[y].modifier}`
                );
              }
          if (this.goodRolesOnly) {
          roles = roles.filter(
            (r) => this.game.getRoleAlignment(r) == "Village"
          );
        }
    let info = [];
    if(this.amount > roles.length){
      this.LimtedExcess = true;
      for(let x = 0; x < roles.length; x++){
        info.push(roles[x]);
      }
    }
    else{
      this.LimtedExcess = false;
      roles = Random.randomizeArray(roles);
        for(let x = 0; x < this.amount; x++){
        info.push(roles[x]);
      }
    }
    
this.mainInfo = info;
  }

  getInfoRaw() {
    super.getInfoRaw();
    return this.mainInfo;
  }

  getInfoFormated() {
    super.getInfoRaw();
    if(this.LimtedExcess){
      return `You Learn that All of the Excess Roles are ${this.mainInfo}`;
    }
    return `You Learn that ${this.amount} Excess Roles are ${this.mainInfo}`;
    //return `You Learn that your Target's Role is ${this.mainInfo}`
  }

  isTrue() {
    let roles = this.game.PossibleRoles.filter((r) => r);
    let players = this.game.players.filter((p) => p.role);
    let currentRoles = [];

              for (let x = 0; x < players.length; x++) {
                currentRoles.push(`${players[x].role.name}:${players[x].role.modifier}`);
              }
              for (let y = 0; y < currentRoles.length; y++) {
                roles = roles.filter(
                  (r) => r != `${currentRoles[y].name}:${currentRoles[y].modifier}`
                );
              }
              if (this.goodRolesOnly) {
          roles = roles.filter(
            (r) => this.game.getRoleAlignment(r) == "Village"
          );
        }
    for(let info of this.mainInfo){
      if(currentRoles.includes(info)){
        return false;
      }
    }
    return true;
  }
  isFalse() {
    if (this.trueRole != this.mainInfo) {
      return true;
    } else {
      return false;
    }
  }
  isFavorable() {
      return true;
  }
  isUnfavorable() {
      return true;
  }

  makeTrue() {
        let roles = this.game.PossibleRoles.filter((r) => r);
    let players = this.game.players.filter((p) => p.role);
    let currentRoles = [];

              for (let x = 0; x < players.length; x++) {
                currentRoles.push(`${players[x].role.name}:${players[x].role.modifier}`);
              }
              for (let y = 0; y < currentRoles.length; y++) {
                roles = roles.filter(
                  (r) => r != `${currentRoles[y].name}:${currentRoles[y].modifier}`
                );
              }
          if (this.goodRolesOnly) {
          roles = roles.filter(
            (r) => this.game.getRoleAlignment(r) == "Village"
          );
        }
    let info = [];
    if(this.amount > roles.length){
      this.LimtedExcess = true;
      for(let x = 0; x < roles.length; x++){
        info.push(roles[x]);
      }
    }
    else{
      this.LimtedExcess = false;
      roles = Random.randomizeArray(roles);
        for(let x = 0; x < this.amount; x++){
        info.push(roles[x]);
      }
    }
    
this.mainInfo = info;
  }
  makeFalse() {
    let roles = this.game.PossibleRoles.filter((r) => r);
    let players = this.game.players.filter((p) => p.role);
    let currentRoles = [];

              for (let x = 0; x < players.length; x++) {
                currentRoles.push(`${players[x].role.name}:${players[x].role.modifier}`);
              }
              for (let y = 0; y < currentRoles.length; y++) {
                roles = roles.filter(
                  (r) => r != `${currentRoles[y].name}:${currentRoles[y].modifier}`
                );
              }
          if (this.goodRolesOnly) {
          currentRoles = currentRoles.filter(
            (r) => this.game.getRoleAlignment(r) == "Village"
          );
        }
    let info = [];
    if(this.amount > currentRoles.length){
      this.LimtedExcess = true;
      for(let x = 0; x < currentRoles.length; x++){
        info.push(currentRoles[x]);
      }
    }
    else{
      this.LimtedExcess = false;
      currentRoles = Random.randomizeArray(currentRoles);
        for(let x = 0; x < this.amount; x++){
        info.push(currentRoles[x]);
      }
    }
    
this.mainInfo = info;
  }
  makeFavorable() {
  }
  makeUnfavorable() {
  }
};
