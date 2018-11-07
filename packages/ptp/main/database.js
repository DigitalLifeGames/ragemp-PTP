const mysql = require("mysql");

class Database
{
    constructor(config,callback)
    {
        var pool = mysql.createConnection({
            host: config.host,
            user: config.username,
            password: config.password
        });
        this.pool = pool;        
        
        pool.connect(callback);
    }
    check() //Create the database if it does not exist
    {
    }
}
module.exports = Database;