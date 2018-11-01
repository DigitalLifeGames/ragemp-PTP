const RelationshipNames = {
    Player: "PLAYER",
    Default: "RG_PLAYER_NEUTRAL",
    SameTeam: "RG_PLAYER_TEAMMATE"
};

const RelationshipTypes = {
    Companion: 0,
    Respect: 1,
    Like: 2,
    Neutral: 3,
    Dislike: 4,
    Hate: 5,
    Pedestrians: 255
};

const TeamVariableName = "currentTeam";
const DefaultTeamHash = mp.game.joaat(RelationshipNames.Default);
const SameTeamHash = mp.game.joaat(RelationshipNames.SameTeam);

// just in case
mp.players.local.setRelationshipGroupHash(mp.game.joaat(RelationshipNames.Player));

// create relationship groups
mp.game.ped.addRelationshipGroup(RelationshipNames.Default, 0);
mp.game.ped.addRelationshipGroup(RelationshipNames.SameTeam, 0);

// set relationships
mp.game.ped.setRelationshipBetweenGroups(RelationshipTypes.Companion, mp.game.joaat(RelationshipNames.Player), mp.game.joaat(RelationshipNames.SameTeam));
mp.game.ped.setRelationshipBetweenGroups(RelationshipTypes.Hate, mp.game.joaat(RelationshipNames.Player), mp.game.joaat(RelationshipNames.Default));

mp.events.add("entityStreamIn", (entity) => {
    if (entity.type !== "player") return;
    let entityTeam = entity.getVariable(TeamVariableName);
    entity.setRelationshipGroupHash((entityTeam != null && entityTeam === mp.players.local.getVariable(TeamVariableName)) ? SameTeamHash : DefaultTeamHash);
});

mp.events.add("entityDataChange", (entity, key, value) => {
    if (entity.type !== "player" || key !== TeamVariableName || !entity.handle) return;

    if (entity.handle === mp.players.local.handle) {
        if (value != null) {
            mp.players.forEachInStreamRange((player) => {
                if (player.handle !== mp.players.local.handle) {
                    let playerTeam = player.getVariable(TeamVariableName);
                    player.setRelationshipGroupHash((playerTeam != null && playerTeam === value) ? SameTeamHash : DefaultTeamHash);
                }
            });
        } else {
            mp.players.forEachInStreamRange((player) => {
                if (player.handle !== mp.players.local.handle) player.setRelationshipGroupHash(DefaultTeamHash);
            });
        }
    } else {
        entity.setRelationshipGroupHash((value != null && mp.players.local.getVariable(TeamVariableName) === value) ? SameTeamHash : DefaultTeamHash);
    }
});