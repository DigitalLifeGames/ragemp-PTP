//Extensions for multiplayer object
function fcbn(name)
{
    var players = mp.players;
    name = name.toLowerCase();
    for(var i=0;i<players.length;i++)
    {
        if(players[i].name.toLowerCase() == name)
            return players[i];
    }
    return false;
}
function MessageAll(msg)
{
    mp.players.broadcast(msg);
    //Strip colors
    var clean = msg.replace(/!{#[0-F]*}/g,"");
    Console.log(clean);
}
global.fcbn = fcbn.bind(mp);
global.MessageAll = MessageAll.bind(mp);
mp.fcbn = fcbn.bind(mp);
global.Colors = {
    default: "!{#FFFFFF}",
    white: "!{#FFFFFF}",
    black: "!{#000000}",
    gray: "!{#555555}",
    red: "!{#FF0000}",
    green: "!{#00FF00}",
    blue: "!{#0000FF}",
    yellow: "!{#FFFF00}",
    cyan: "!{#00FFF}"
}