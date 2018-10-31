//Extensions for multiplayer object
function fcbn(name)
{
    name = name.toLowerCase();
    for(var i=0;i<this.players.length;i++)
    {
        if(this.players[i].name.toLowerCase() == name)
            return this.players[i];
    }
    return false;
}
mp.fcbn = fcbn.bind(mp);