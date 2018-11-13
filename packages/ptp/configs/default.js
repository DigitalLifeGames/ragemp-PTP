module.exports = {
    roundLength: 15,
    //Eventually move config here
    teams: [
    {
        color: "yellow",
        teamColor: "DDDD22",
        teamDamageType: "TEAM_GOVERNMENT",
        name: "President",
        armour: 100,
        maxPlayers: 1,
        minPlayers: 1,
        autoAssign: true,
        spawns: [new mp.Vector3(-427,1115,327)],
        blipColor: 70,
        weapons: [{
            datablock: 'weapon_bat',
            ammo: 1000
        },{
            datablock: "weapon_heavyPistol",
            ammo: 1000
        }],
        skins: ["cs_paper"],
        vehicles: [
            {
                position: new mp.Vector3(-399,1199,325),
                datablock: "FBI2"
            },{
                position: new mp.Vector3(-396,1209,325),
                datablock: "FBI2"
            },{
                position: new mp.Vector3(-404,1216,325),
                datablock: "baller5"
            },{
                position: new mp.Vector3(-407,1206,325),
                datablock: "FBI"
            },{
                datablock: "FBI",
                position: new mp.Vector3(-405,1238,325),
            },{
                datablock: "FBI2",
                position: new mp.Vector3(-390,1191,325)
            },{
                datablock: "FBI",
                position: new mp.Vector3(-386,1201,325)
            },{
                datablock: "FBI",
                position: new mp.Vector3(-383,1214,325)
            },{
                datablock: "FBI",
                position: new mp.Vector3(-399,1235,325)
        }]
    },{
        color: "yellow",
        teamColor: "3333EE",
        teamDamageType: "TEAM_GOVERNMENT",
        name: "Vice President",
        armour: 100,
        maxPlayers: 1,
        minPlayers: 0,
        autoAssign: false,
        hidden: true,
        spawns: [new mp.Vector3(-427,1110,327)],
        blipColor: 70,
        weapons: [{
            datablock: 'weapon_vintagepistol',
            ammo: 1000
        }],
        vehicles: [],
        skins: ["mp_m_boatstaff_01"]
    },{
        color: "green",
        teamColor: "00FF00",
        teamDamageType: "TEAM_GOVERNMENT",
        name: "Security",
        armour: 100,
        maxPlayers: false,
        minPlayers: 0,
        autoAssign: true,
        spawns: [new mp.Vector3(-422,1213,325)],
        blipColor: 11,
        weapons: [{
            datablock: 'weapon_nightstick',
            ammo: 1000
        },{
            datablock: 'weapon_flashlight',
            ammo: 1000
        },{
            datablock: 'weapon_smg',
            ammo: 1000
        },{
            datablock: 'weapon_combatpistol',
            ammo: 1000
        },{
            datablock: 'weapon_heavyshotgun',
            ammo: 1000
        },{
            datablock: 'weapon_specialcarbine_mk2',
            ammo: 1000
        },{
            datablock: 'weapon_grenade',
            ammo: 1000
        },{
            datablock: 'weapon_sniperrifle',
            ammo: 1000
        }],
        vehicles: [],
        skins: ["s_m_y_blackops_01","ig_casey","s_m_m_highsec_01","s_m_m_highsec02"]
    },{
        color: "blue",
        teamColor: "0000FF",
        teamDamageType: "TEAM_GOVERNMENT",
        name: "Police",
        armour: 100,
        maxPlayers: false,
        minPlayers: 0,
        autoAssign: true,
        spawns: [new mp.Vector3(455,-1017,28)],
        blipColor: 3,
        weapons: [{
            datablock: 'weapon_nightstick',
            ammo: 1000
        },{
            datablock: 'weapon_flashlight',
            ammo: 1000
        },{
            datablock: 'weapon_microsmg',
            ammo: 1000
        },{
            datablock: 'weapon_machinepistol',
            ammo: 1000
        },{
            datablock: 'weapon_pumpshotgun',
            ammo: 1000
        },{
            datablock: 'weapon_compactrifle',
            ammo: 1000
        },{
            datablock: 'weapon_smokegrenade',
            ammo: 1000
        }],
        vehicles: [
        {
                datablock: "Police3",
                position: new mp.Vector3(446,-1025,28)
            },{
                datablock: "Police3",
                position: new mp.Vector3(442,-1025,28)
            },{
                datablock: "Sheriff2",
                position: new mp.Vector3(438,-1026,28)
            },{
                datablock: "Sheriff2",
                position: new mp.Vector3(434,-1026,28)
            },{
                datablock: "PoliceT",
                position: new mp.Vector3(431,-1027,28)
            },{
                datablock: "PoliceT",
                position: new mp.Vector3(427,-1027,28)
        }],
        skins: ["s_f_y_cop_01","s_m_y_cop_01","s_m_y_sheriff_01","csb_trafficwarden"]
    },{
        color: "red",
        teamColor: "FF0000",
        teamDamageType: "TEAM_TERRORIST",
        name: "Terrorist",
        armour: 0,
        maxPlayers: false,
        minPlayers: 1,
        autoAssign: true,
        spawns: [new mp.Vector3(-497,-2187,8)],
        blipColor: 6,
        weapons: [{
            datablock: 'weapon_crowbar',
            ammo: 1000
        },{
            datablock: 'weapon_machette',
            ammo: 1000
        },{
            datablock: 'weapon_pistol',
            ammo: 1000
        },{
            datablock: 'weapon_machinepistol',
            ammo: 1000
        },{
            datablock: 'weapon_sawnoffshotgun',
            ammo: 1000
        },{
            datablock: 'weapon_assaultrifle',
            ammo: 1000
        },{
            datablock: 'weapon_molotov',
            ammo: 1000
        }],
        vehicles: [{
            datablock: "Cheetah",
            position: new mp.Vector3(-510,-2176,7)
         },{
             datablock: "SultanRS",
             position: new mp.Vector3(-513,-2179,7)
         },{
            datablock: "Bullet",
            position: new mp.Vector3(-515,-2181,8)
         },{
             datablock: "Bati",
            position: new mp.Vector3(-517,-2184,8)
         }],
         skins: ["a_m_m_eastsa_01","u_m_m_edtoh","g_m_y_korlieut_01","cs_lestercrest","cs_terry"]
    }]
}
