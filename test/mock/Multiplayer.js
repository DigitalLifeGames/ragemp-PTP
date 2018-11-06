class EntityPool
{
    addCommand(event,callback)
    {

    }
    add(event,callback)
    {

    }
    forEach()
    {

    }
}
class PlayerPool extends EntityPool
{
    broadcast(message)
    {
        
    }
}
class Vector3
{
    constructor(x,y,z)
    {
        
    }
}
class Player
{
    constructor(name = "Mock Player")
    {
        this.name = name;
        this.data = {
            
        }
    }

    setVariable(prop,data) {
        this.data[prop] = data;
    }
    getVariable(prop) {
        return this.data[prop];
    }

    removeAllWeapons(){};
    giveWeapon(){}
    outputChatBox(message){};
    spawn(location){};
}
class EntityArray
{
    new(a,b,c,d,e,f){}
}
function joaat(asset)
{
    return "hashvalue";
}

var mp = {
    events: new EntityPool(),
    players: new EntityPool()
};

//Bind methods to object
mp.Vector3 = Vector3;
mp.joaat = joaat;
mp.Player = Player;
mp.vehicles = new EntityArray();
mp.blips = new EntityArray();
mp.players = new PlayerPool();
module.exports = mp;