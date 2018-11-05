const PedTypes = {
    Player: 1,
    Male: 4,
    Female: 5,
    Cop: 6,
    Human: 26,
    SWAT: 27,
    Animal: 28,
    Army: 29
}
class AiPlayer
{
    AiPlayer(modelHash,position)
    {
        var pedType = PedTypes.Human;
        var heading; //Rotation
        var networkHandle;
        var pedHandle;
        this.object = mp.game.ped.createPed(pedType, modelHash, position.x, position.y, position.z, heading, networkHandle, pedHandle);
    }

    kill()
    {

    }
}
//mp.game.ped.createPed(pedType, modelHash, x, y, z, heading, networkHandle, pedHandle);

module.exports = AiPlayer;