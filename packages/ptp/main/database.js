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
        this.config = config;  
    }
    close()
    {
        this.pool.end();
    }
    connect(callback)
    {
        return new Promise((resolve,reject) => {
            this.pool.connect((err) => {
                if(err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
    query(q,callback)
    {
        this.pool.query(q,callback);
    }
    select(tbl,callback)
    {
        this.pool.query(`SELECT * FROM ${tbl}`, callback);
    }
    check() //Create the database if it does not exist
    {
        return true;
        //Try to create database
        return new Promise((resolve,reject) => {
            this.query(`CREATE DATABASE ${this.config.database}`,(err,res) =>
            {
                if(err)
                    reject();
                else
                    resolve();
            });
        });
        
        return false;
    }

    login(cred) {
        var tbl = 'accounts';
        return new Promise((resolve,reject) => {
        
            this.pool.query(`SELECT * FROM ${this.config.database}.${tbl} WHERE username='${cred.username}' AND password='${cred.password}'`,(err,rows) => {
                if(err)
                {
                    reject(err);
                }
                else if(rows.length == 0)
                {
                    reject(new Error("Invalid login credentials"));
                }
                else
                    resolve(rows);
            });
        });
    }
    accountExists(username) {
        var tbl = 'accounts';
        return new Promise((resolve,reject) => {
        
            this.pool.query(`SELECT id FROM ${this.config.database}.${tbl} WHERE username='${username}'`,(err,rows) => {
                if(err)
                {
                    reject(err);
                }
                else if(rows.length == 0)
                {
                    reject(new Error("Account with username does not exist"));
                }
                else
                    resolve(rows);
            });
        });
    }
    createAccount(cred) {
        var tbl = 'accounts';
        return new Promise((resolve,reject) => {
            this.pool.query(`INSERT INTO ${this.config.database}.${tbl} (\`username\`, \`password\`) VALUES ('${cred.username}', '${cred.password}')`,(err,rows) => {
                if(err)
                {
                    reject(err);
                }
                resolve();
            });
        });
    }
}
module.exports = Database;