module.exports = {
    //Eventually move config here
    teams: [
    {
        color: "yellow",
        name: "President",
        maxPlayers: 1,
        minPlayers: 1,
        spawns: [new mp.Vector3(-427,1115,327)],
        blipColor: 70,
        weapons: [{
            datablock: 'knife',
            ammo: 1000
        },{
            datablock: "heavyPistol",
            ammo: 1000
        }],
        vehicles: [
            {
                position: new mp.Vector3(-399,1199,325),
                datablock: mp.joaat("FBI2")
            },{
                position: new mp.Vector3(-396,1209,325),
                datablock: mp.joaat("FBI2")
            },{
                position: new mp.Vector3(-404,1216,325),
                datablock: mp.joaat("baller5")
            },{
                position: new mp.Vector3(-407,1206,325),
                datablock: mp.joaat("FBI")
            },{
                datablock: mp.joaat("FBI"),
                position: new mp.Vector3(-405,1238,325),
            },{
                datablock: mp.joaat("FBI2"),
                position: new mp.Vector3(-390,1191,325)
            },{
                datablock: mp.joaat("FBI"),
                position: new mp.Vector3(-386,1201,325)
            },{
                datablock: mp.joaat("FBI"),
                position: new mp.Vector3(-383,1214,325)
            },{
                datablock: mp.joaat("FBI"),
                position: new mp.Vector3(-399,1235,325)
        }]
    },{
        color: "yellow",
        name: "Vice President",
        maxPlayers: 1,
        minPlayers: 0,
        hidden: true,
        spawns: [new mp.Vector3(-427,1110,327)],
        blipColor: 70,
        weapons: [{
            datablock: 'micro_smg',
            ammo: 1000
        }],
        vehicles: []
    },{
        color: "green",
        name: "Security",
        maxPlayers: false,
        minPlayers: 0,
        spawns: [new mp.Vector3(-422,1213,325)],
        blipColor: 11,
        weapons: [{
            datablock: 'micro_smg',
            ammo: 1000
        }],
        vehicles: []
    },{
        color: "blue",
        name: "Police",
        maxPlayers: false,
        minPlayers: 0,
        spawns: [new mp.Vector3(455,-1017,28)],
        blipColor: 3,
        weapons: [{
            datablock: 'micro_smg',
            ammo: 1000
        }],
        vehicles: [
        {
                datablock: mp.joaat("Police3"),
                position: new mp.Vector3(446,-1025,28)
            },{
                datablock: mp.joaat("Police3"),
                position: new mp.Vector3(442,-1025,28)
            },{
                datablock: mp.joaat("Sheriff2"),
                position: new mp.Vector3(438,-1026,28)
            },{
                datablock: mp.joaat("Sheriff2"),
                position: new mp.Vector3(434,-1026,28)
            },{
                datablock: mp.joaat("PoliceT"),
                position: new mp.Vector3(431,-1027,28)
            },{
                datablock: mp.joaat("PoliceT"),
                position: new mp.Vector3(427,-1027,28)
        }]
    },{
        color: "red",
        name: "Terrorist",
        maxPlayers: false,
        minPlayers: 1,
        spawns: [new mp.Vector3(-497,-2187,8)],
        blipColor: 6,
        weapons: [{
            datablock: 'micro_smg',
            ammo: 1000
        }],
        vehicles: [{
            datablock: mp.joaat("Cheetah"),
            position: new mp.Vector3(-510,-2176,7)
         },{
             datablock: mp.joaat("SultanRS"),
             position: new mp.Vector3(-513,-2179,7)
         },{
            datablock: mp.joaat("Bullet"),
            position: new mp.Vector3(-515,-2181,8)
         },{
             datablock: mp.joaat("Bati"),
            position: new mp.Vector3(-517,-2184,8)
         }]
    }]
}