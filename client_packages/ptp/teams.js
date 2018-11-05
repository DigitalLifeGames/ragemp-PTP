
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

console.log("hit this");

mp.game.ped.addRelationshipGroup('President');
mp.game.ped.addRelationshipGroup('Vice President');
mp.game.ped.addRelationshipGroup('Security');
mp.game.ped.addRelationshipGroup('Police');
mp.game.ped.addRelationshipGroup('Terrorist');

mp.game.ped.setRelationshipBetweenGroups(RelationshipTypes.Companion, 'President', 'Vice President');
mp.game.ped.setRelationshipBetweenGroups(RelationshipTypes.Companion, 'President', 'Security');
mp.game.ped.setRelationshipBetweenGroups(RelationshipTypes.Neutral, 'President', 'Police'); //Maybe change

mp.game.ped.setRelationshipBetweenGroups(RelationshipTypes.Companion, 'Vice President', 'Security');
mp.game.ped.setRelationshipBetweenGroups(RelationshipTypes.Neutral, 'Vice President', 'Police'); //Maybe change

mp.game.ped.setRelationshipBetweenGroups(RelationshipTypes.Companion, 'Police', 'Security'); //Maybe change

mp.game.ped.setRelationshipBetweenGroups(RelationshipTypes.Hate, 'Terrorist', 'President');
mp.game.ped.setRelationshipBetweenGroups(RelationshipTypes.Hate, 'Terrorist', 'Police');
mp.game.ped.setRelationshipBetweenGroups(RelationshipTypes.Hate, 'Terrorist', 'Security');
mp.game.ped.setRelationshipBetweenGroups(RelationshipTypes.Hate, 'Terrorist', 'Vice President');





mp.events.add("entityStreamIn", (entity) => {
    if (entity.type !== "player") return;
    let currentTeam = entity.getVariable("currentTeam");

    if(!currentTeam)
        return;
    
    entity.setRelationshipGroupHash(currentTeam);
});