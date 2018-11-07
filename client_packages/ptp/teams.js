const relationshipNames = {
    Player: "PLAYER",
    Default: "RG_PLAYER_NEUTRAL",
    SameTeam: "RG_PLAYER_TEAMMATE"
};

const relationshipTypes = {
    Companion: 0,
    Respect: 1,
    Like: 2,
    Neutral: 3,
    Dislike: 4,
    Hate: 5,
    Pedestrians: 255
};

const defaultTeamHash = mp.game.joaat(relationshipNames.Default);
const sameTeamHash = mp.game.joaat(relationshipNames.SameTeam);

// just in case
mp.players.local.setRelationshipGroupHash(mp.game.joaat(relationshipNames.Player));

// create relationship groups
mp.game.ped.addRelationshipGroup(relationshipNames.Default, 0);
mp.game.ped.addRelationshipGroup(relationshipNames.SameTeam, 0);

// set relationships
mp.game.ped.setRelationshipBetweenGroups(relationshipTypes.Companion, mp.game.joaat(relationshipNames.Player), mp.game.joaat(relationshipNames.SameTeam));
mp.game.ped.setRelationshipBetweenGroups(relationshipTypes.Hate, mp.game.joaat(relationshipNames.Player), mp.game.joaat(relationshipNames.Default));

mp.events.add("entityStreamIn", (entity) => {
    if (entity.type === "player") {
        var myTeam = mp.players.local.getVariable("currentTeam");
        let entityTeam = entity.getVariable("currentTeam");
        entity.setRelationshipGroupHash((entityTeam != null && entityTeam === myTeam) ? sameTeamHash : defaultTeamHash);
    }
});

// todo: replace with addDataHandler
mp.events.add("entityDataChange", (entity, key, value) => {
    if (entity.type !== "player" || key !== "currentTeam" || !entity.handle) return;

    if (entity.handle === mp.players.local.handle) {
        if (value != null) {
            mp.players.forEachInStreamRange((player) => {
                if (player.handle !== mp.players.local.handle) {
                    let playerTeam = player.getVariable("currentTeam");
                    player.setRelationshipGroupHash((playerTeam != null && playerTeam === value) ? sameTeamHash : defaultTeamHash);
                }
            });
        } else {
            mp.players.forEachInStreamRange((player) => {
                if (player.handle !== mp.players.local.handle) player.setRelationshipGroupHash(defaultTeamHash);
            });
        }
    } else {
        var myTeam = mp.players.local.getVariable("currentTeam");
        entity.setRelationshipGroupHash((value != null && myTeam === value) ? sameTeamHash : defaultTeamHash);
    }
});





/*
const TeamNames = {
    President: ("President"),
    VicePresident: ("Vice President"),
    Terrorist: ("Terrorists"),
    Security: ("Security"),
    Police: ("Police")
};
const TeamHashTable = {
    President: mp.game.joaat("President"),
    VicePresident: mp.game.joaat("Vice President"),
    Terrorist: mp.game.joaat("Terrorists"),
    Security: mp.game.joaat("Security"),
    Police: mp.game.joaat("Police")
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

console.log("hit this");

mp.game.ped.addRelationshipGroup(TeamNames.President,0);
mp.game.ped.addRelationshipGroup(TeamNames.VicePresident,1);
mp.game.ped.addRelationshipGroup(TeamNames.Security,2);
mp.game.ped.addRelationshipGroup(TeamNames.Police,3);
mp.game.ped.addRelationshipGroup(TeamNames.Terrorist,4);

mp.game.ped.setRelationshipBetweenGroups(RelationshipTypes.Companion, TeamHashTable.President, TeamHashTable.VicePresident);
mp.game.ped.setRelationshipBetweenGroups(RelationshipTypes.Companion, TeamHashTable.President, TeamHashTable.Security);
mp.game.ped.setRelationshipBetweenGroups(RelationshipTypes.Neutral, TeamHashTable.President, TeamHashTable.Police); //Maybe change

mp.game.ped.setRelationshipBetweenGroups(RelationshipTypes.Companion, TeamHashTable.VicePresident, TeamHashTable.Security);
mp.game.ped.setRelationshipBetweenGroups(RelationshipTypes.Neutral, TeamHashTable.VicePresident, TeamHashTable.Police); //Maybe change

mp.game.ped.setRelationshipBetweenGroups(RelationshipTypes.Companion, TeamHashTable.Police, TeamHashTable.Security); //Maybe change

mp.game.ped.setRelationshipBetweenGroups(RelationshipTypes.Hate, TeamHashTable.Terrorist, TeamHashTable.President);
mp.game.ped.setRelationshipBetweenGroups(RelationshipTypes.Hate, TeamHashTable.Terrorist, TeamHashTable.Police);
mp.game.ped.setRelationshipBetweenGroups(RelationshipTypes.Hate, TeamHashTable.Terrorist, TeamHashTable.Security);
mp.game.ped.setRelationshipBetweenGroups(RelationshipTypes.Hate, TeamHashTable.Terrorist, TeamHashTable.VicePresident);


localPlayer.setRelationshipGroupHash(TeamHashTable[localPlayer.getVariable("currentTeam")]);



/*
mp.events.add("entityStreamIn", (entity) => {
    if (entity.type !== "player") return;
    let currentTeam = entity.getVariable("currentTeam");

    if(!currentTeam)
        return;
    
    mp.Game.message("Check team here");
    entity.setRelationshipGroupHash(currentTeam);
});
*/