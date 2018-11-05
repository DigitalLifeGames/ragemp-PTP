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