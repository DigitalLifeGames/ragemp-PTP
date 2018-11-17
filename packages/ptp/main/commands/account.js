mp.events.addCommand('signup',(player,password) => {
    if(!CurrentGame.database())
        return;
    var Database = CurrentGame.database();
    
    if(!password || password.length < 4)
    {
        player.outputChatBox("!{#FF0000}Your password must be at least 4 characters.");
        return;
    }
    Database.select("accounts",{
        username: player.name,
        locked: 1
    }).then(() => {
        player.outputChatBox("Your account already exists. Please use /login or /changepassword!");
    }).catch((error) => {
        //We can make them an account!
        return Database.setPassword(player.name,password);
    }).catch(err => {
        player.outputChatBox("Unknown error occured. Could not lock user account.");
        console.log("Could not lock user account");
    });
});
mp.events.addCommand('login',(player,password) => {
    if(CurrentGame.database())
        CurrentGame.database().login(player,password).then((data) => {
            var acc = data[0];
            player.logged = true;
            player.admin = acc.admin;
            player.outputChatBox(`${acc.admin ? "!{#00FF00}[Admin]!{#FFFFFF} ":""}Logged in successfully!`);

        }).catch((error) => {
            player.outputChatBox(`!{#FF0000}Invalid password/Username not found.`);
        });
});
mp.events.addCommand('changepassword',(player,password) => {
    if(!CurrentGame.database())
        return;
    var Database = CurrentGame.database();

    if(!Database.isLogged(player))
    {
        player.outputChatBox(`!{#FF0000}You are not currently logged in. Please use !{#FFFF00}/login`);
        return;
    }
    if(!password || password.length < 4)
    {
        player.outputChatBox("!{#FF0000}Your password must be at least 4 characters.");
        return;
    }
    Database.update('accounts',{
        username: player.name,
    },{
        password: password
    }).then(() => {
        player.outputChatBox(`!{#00FF00}Password updated successfully!`);
    }).catch(() => {
        player.outputChatBox("!{#FF0000}Unknown error occured. Could not update password for account.");
        console.log("Could not update password for account.");
    });
});