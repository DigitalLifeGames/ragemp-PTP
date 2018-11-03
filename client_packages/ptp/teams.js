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

AddRelationshipGroup('President');
AddRelationshipGroup('Vice President');
AddRelationshipGroup('Security');
AddRelationshipGroup('Police');
AddRelationshipGroup('Terrorist');

SetRelationshipBetweenGroups(RelationshipTypes.Companion, 'President', 'Vice President');
SetRelationshipBetweenGroups(RelationshipTypes.Companion, 'President', 'Security');
SetRelationshipBetweenGroups(RelationshipTypes.Neutral, 'President', 'Police'); //Maybe change

SetRelationshipBetweenGroups(RelationshipTypes.Companion, 'Vice President', 'Security');
SetRelationshipBetweenGroups(RelationshipTypes.Neutral, 'Vice President', 'Police'); //Maybe change

SetRelationshipBetweenGroups(RelationshipTypes.Companion, 'Police', 'Security'); //Maybe change

SetRelationshipBetweenGroups(RelationshipTypes.Hate, 'Terrorist', 'President');
SetRelationshipBetweenGroups(RelationshipTypes.Hate, 'Terrorist', 'Police');
SetRelationshipBetweenGroups(RelationshipTypes.Hate, 'Terrorist', 'Security');
SetRelationshipBetweenGroups(RelationshipTypes.Hate, 'Terrorist', 'Vice President');



mp.events.add("entityStreamIn", (entity) => {
    if (entity.type !== "player") return;
    let currentTeam = entity.getVariable("currentTeam");

    if(!currentTeam)
        return;
    
    entity.setRelationshipGroupHash(currentTeam);
});