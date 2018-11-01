var mp = {

};
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

//Bind methods to object
mp.Vector3 = Vector3;
mp.joaat = joaat;
mp.Player = Player;
mp.vehicles = new EntityArray();
mp.blips = new EntityArray();
module.exports = mp;