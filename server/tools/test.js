const db = require('../data/dbinit');
const handler = require('../data/dbhandler');
const fs = require('fs');

db.initSchema().then(() => {
    fs.readFile("C:/temp/nodown.png", 'hex', async function (err, imgData) {
        console.log('imgData', imgData);
        imgData = '\\x' + imgData;
        console.log((await handler.insertLevelshot(imgData)).rows)
    });
})