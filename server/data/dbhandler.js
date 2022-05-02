const dbclient = require("./dbinit").client;
const named = require("yesql").pg;
const _ = require("lodash");

const selectMaps = `SELECT * from maps`;
const selectCount = "SELECT count(*) from maps";

async function getMaps(limit, offset, filters) {
  return (
    await dbclient.query(queryBuilder(selectMaps, limit, offset, filters))
  ).rows;
}

async function getMapsCount(limit, offset, filters) {
  return (
    await dbclient.query(queryBuilder(selectCount, limit, offset, filters))
  ).rows;
}

async function getUsername(username) {
  return (
    await dbclient.query(`SELECT * from users where username = $1`, username)
  ).rows;
}

async function insertLevelshot(name, tmpName, data, type, mapId) {
  let insertLevelshotResult;
  try {
    insertLevelshotResult = await dbclient.query(
      `INSERT INTO levelshots VALUES(DEFAULT, $1, $2, $3, $4, $5)`,
      [name, tmpName, mapId, data, type]
    );
  } catch (err) {
    console.error(err);
  }

  return insertLevelshotResult;
}

async function loadImage(name) {
  return (
    await dbclient.query(
      `SELECT data from levelshots where original_name = $1`,
      [name]
    )
  ).rows;
}

async function saveMap(mapInfo) {
  const saveMapQuery = named(`
    INSERT INTO 
    maps(pkname, size, map_name, map_longname, map_type, map_briefing, map_timelimit, map_levelshot, map_pos_x, map_pos_y, map_features, releasedate, status, filetree, worldspawns)
    VALUES(:pkName, :size, :map, :longname, :type, :briefing, :timelimit, :map_levelshot, :mapposition_x, :mapposition_y, :mapfeatures, :release, 'uploaded', :filetree, :worldspawns)
    RETURNING id
  `)({
    ...mapInfo.arena,
    pkName: mapInfo.pkName,
    release: mapInfo.release,
    size: mapInfo.size,
    mapfeatures: mapInfo.mapfeatures,
    filetree: mapInfo.fileTree,
    worldspawns: mapInfo.worldspawns,
    map_levelshot:
      mapInfo.levelshots.default && mapInfo.levelshots.cc ? true : false,
  });

  console.log(saveMapQuery);
  let insertResult = {};
  try {
    const result = await dbclient.query(saveMapQuery);
    insertResult = result.rows[0];
  } catch (insertError) {
    console.error(insertError);
    insertResult.error = insertError;
  }
  return insertResult;
}

async function updateMapClassification(classificationInfo) {
  classificationInfo.strafeLow = classificationInfo.strafeSlider[0];
  classificationInfo.strafeHigh = classificationInfo.strafeSlider[1];
  classificationInfo.mechanicalLow = classificationInfo.mechSlider[0];
  classificationInfo.mechanicalHigh = classificationInfo.mechSlider[1];

  const updateMapClassificationQuery = named(`
  UPDATE maps SET author = :author, styles = :mapStyles, mechanical_low = :mechanicalLow, mechanical_high = :mechanicalHigh, strafe_low = :strafeLow, strafe_high = :strafeHigh
  WHERE id = :mapId
  `)(classificationInfo);

  let updateResult = {};

  try {
    const result = await dbclient.query(updateMapClassificationQuery);
    updateResult = result.rows[0];
  } catch (insertError) {
    console.error(insertError);
    updateResult.error = insertError;
  }
  return updateResult;
}

async function saveMapCloudFile(cloudInfo) {
  const saveCloudQuery = named(`
  INSERT INTO
  map_files(original_name, tmp_name, cloud_id, cloud_url, map_id, md5)
  values(:Key, :tmpName, :key, :Location, :mapId, :ETag)
  `)(cloudInfo);

  let insertResult = {};

  try {
    const result = await dbclient.query(saveCloudQuery);
    insertResult = result.rows[0];
  } catch (insertError) {
    console.error(insertError);
    insertResult.error = insertError;
  }
  return insertResult;
}

async function getMapById(mapId) {
  const queryMapById = named(`select * from maps where id = :mapId`)({ mapId });
  let mapFound = {};
  try {
    const result = await dbclient.query(queryMapById);
    mapFound = result.rows[0];
  } catch (fetchMapError) {
    console.error(fetchMapError);
    mapFound.error = fetchMapError;
  }

  const queryMapLevelshots = named(
    `select id,levelshot_type,map_id,original_name,tmp_name from levelshots where map_id = :mapId`
  )({ mapId });

  try {
    const levelshots = await dbclient.query(queryMapLevelshots);
    mapFound.levelshots = _.chain(levelshots.rows)
      .keyBy("levelshot_type")
      .value();
    mapFound.images = levelshots.rows;
  } catch (fetchLevelshotsError) {
    console.error("Unable to find levelshots for map: " + mapId);
    console.error(fetchLevelshotsError);
  }

  return mapFound;
}

function queryBuilder(query, limit, offset, filters) {
  let builtQuery = query;
  let values = [];

  if (filters) {
    console.debug(filters);
    values.push(filters);
    builtQuery += ` where map_features && $1 `;
  }

  if (!isNaN(limit) && !isNaN(offset)) {
    // apply paging to the query
    builtQuery += ` LIMIT ${limit} OFFSET ${offset}`;
  }

  return { text: builtQuery, values };
}

module.exports = {
  getMaps,
  getMapsCount,
  getMapById,
  getUsername,
  insertLevelshot,
  loadImage,
  saveMap,
  saveMapCloudFile,
  updateMapClassification,
};
