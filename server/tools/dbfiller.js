const { Client } = require('pg')
const fsp = require('fs').promises
const path = require('path')

const client = new Client({
    user: 'mapstat',
    host: 'localhost',
    database: 'postgres',
    password: 'mapstat',
    port: 5432,
})

const wordlist = `But I must explain to you how all this mistaken idea of
 denouncing pleasure and praising pain was born and I will give you a complete
  account of the system, and expound the actual teachings of the great explorer
   of the truth, the master-builder of human happiness. No one rejects, dislikes,
    or avoids pleasure itself, because it is pleasure, but because those who do
     not know how to pursue pleasure rationally encounter consequences that are
      extremely painful. Nor again is there anyone who loves or pursues or desires
       to obtain pain of itself, because it is pain, but because occasionally circumstances
        occur in which toil and pain can procure him some great pleasure. To take a trivial
         example, which of us ever undertakes laborious physical exercise, except to obtain
          some advantage from it? But who has any right to find fault with a man who chooses
           to enjoy a pleasure that has no annoying consequences, or one who avoids a pain
            that produces no resultant pleasure?`.split(" ");
const mapFeatures = [
    "nosave",
    "nonoclip",
    "nonjd",
    "noworldspawns",
    "noportal",
    "nopenis",
    "noload",
    "nocrash",
    "notimeruns",
    "nospectator"
]
const insertQuery = `INSERT INTO maps VALUES 
    ( DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12,  $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)`
function getRandomWord() {
    return wordlist[Math.floor(Math.random() * insertQuery.length)];
}

function randomDigit() {
    return Math.floor(Math.random() * 10);
}

function randomMapFeature() {
    let arr = [];
    for (var i = randomDigit(); i < 8; i++) {
        let rand = mapFeatures[randomDigit()];
        if (arr.indexOf(rand) === -1) {
            arr.push(rand);
        }
    }
    return arr;
}

function randomDiff() {
    var min = 0.0,
        max = 5.0,
        highlightedNumber = Math.random() * (max - min) + min;
    return highlightedNumber;
};

function randomDate() {
    return new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
}

async function populateDB() {
    await client.connect();
    for (var i = 0; i < 1000; i++) {
        const values = [
            getRandomWord(),  //1 mechanical
            getRandomWord(), //2 strafe
            getRandomWord(), //3 style
            getRandomWord() + ".pk3", //4 pkname
            getRandomWord(), //5 author
            getRandomWord() + getRandomWord() + getRandomWord(), //6 description,
            randomDigit() + "." + randomDigit() + "." + randomDigit(), //7 version
            randomDigit() * randomDigit() * randomDigit(), //8 size
            randomDiff(), //9 difficulty low 
            randomDiff(), //10 difficulty high
            randomDate(), //9 release date
            getRandomWord() + randomDigit() + randomDigit(), //10 mapname
            getRandomWord() + "-" + getRandomWord(), //11 maplongname
            getRandomWord(), //12 map type
            getRandomWord(), //13 map briefing
            randomDigit() * randomDigit(), //14 timelimit
            randomDigit(), //15 map pos x
            randomDigit(), //16 map pos y
            randomMapFeature(),
            "random txt file in map",
            randomDigit % 2 === 0,
            `{"inputTest":"test", "simulated":true}` //17 metadata
        ];
        client.query(
            insertQuery,
            values)
    }
}

populateDB();
