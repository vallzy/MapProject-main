let parseMapInfo = require('../autoparser').parseMapInfo;


async function parseInfo() {
    console.log(JSON.stringify(await parseMapInfo("C:/temp/tmp-3-1625464126843")));
}

parseInfo();