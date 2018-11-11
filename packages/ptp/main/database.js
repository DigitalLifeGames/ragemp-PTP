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
    //TODO: Self creation of tables
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

    //Users
    login(cred) {
        var tbl = 'accounts';
        return this.select("accounts",{
            username: cred.username,
            password: cred.password
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
        var locked = 0;
        if(cred.password.length > 6)
            locked = 1;
        return this.insert("accounts",{
            username: cred.username,
            password: cred.password,
            locked: locked
        });
    }
    addScore(username,score)
    {
        //What are we adding
        return this.select("accounts",{
            username: username
        }).then(data => 
        {
            return this.select("account_detail",{id: data[0].id})
        }).then(data => {
            var row = data[0];
            //Add it
            for(var s in row)
            {
                if(!isNaN(score[s]))
                    row[s] += score[s];
            }
            return this.update("account_detail",{ id: row.id},row);
        });
    }
    //Main
    query(q)
    {
        return new Promise((resolve,reject) => {
            this.pool.query(q,(err,data) => {
                if(err)
                    reject(err);
                resolve(data);
            });
        });
    }
    insert(tbl,values)
    {
        var cols = "";
        var vals = "";
        for(var col in values)
        {
            var val = values[col];
            if(cols != "")
                cols += ",";
            cols += "\`" + col + "\`";

            if(vals != "")
                vals += ",";
            if(isNaN(val) || !val)
                vals += `'${val}'`;
            else
                vals += `${val}`;
        }
        var q = `INSERT INTO ${this.config.database}.${tbl} (${cols}) VALUES(${vals})`;
        return this.query(q);
    }
    update(tbl,where,values)
    {
        if(!where || !values)
            return Promise.reject();
        var cols = "";
        for(var col in values)
        {
            if(cols != "")
                cols += ", ";
            cols += `${col}='${values[col]}'`;
        }
        var w = "";
        for(var col in where)
        {
            if(w != "")
                w += " AND ";
            else
                w = " WHERE ";
            w += `${col} = '${where[col]}'`;
        }
        var q = `UPDATE ${this.config.database}.${tbl} SET ${cols} ${w}`;
        return this.query(q);
    }
    select(tbl,where)
    {
        var w = "";
        for(var col in where)
        {
            if(w != "")
                w += " AND ";
            else
                w = " WHERE ";
            w += `${col} = '${where[col]}'`;
        }
        var q = `SELECT * FROM ${this.config.database}.${tbl} ${w}`;
        return this.query(q).then(rows => {
            if(rows.length == 0)
                throw new Error("No rows found");
            return rows;
        });
    }
}
module.exports = Database;