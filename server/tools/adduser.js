const { Client } = require('pg')
var bcrypt = require('bcryptjs');

const client = new Client({
    user: 'mapstat',
    host: 'localhost',
    database: 'postgres',
    password: 'mapstat',
    port: 5432,
})
const createUserSql = `INSERT INTO users VALUES 
    ( DEFAULT, $1, $2, $3, $4)`;

async function populateDB() {
    await client.connect();
    var args = process.argv.slice(2);
    if (args[0] && args[1] && args[2] && args[3]) {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(args[1], salt);
        args[1] = hash;
        client.query(createUserSql, args).then((value) => {
            console.log("User account created: ", value.rowCount);
        }).catch(err => {
            console.log(err);
        })
    } else {
        console.log("Use as 'node adduser.js <username> <password> <email> <role>");
    }
}

populateDB();