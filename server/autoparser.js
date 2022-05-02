"use strict";
var fs = require("fs");
var JSZip = require("jszip");
const crypto = require("crypto");
const configs = require("./configs");

const worldspawns = [
  "nonoclip",
  "nosave",
  "noexplosives",
  "nogoto",
  "nojumpdelay",
  "nooverbounce",
];
const shaders = [
  { name: "nooverbounce", value: "monsterslicksouth" },
  { name: "nosave", value: "clusterportal" },
  { name: "nojumpdelay", value: "monsterslicknorth " },
  { name: "portalsurfaces", value: "monsterslickeast" },
];
const mapfeatures = [
  { key: "timerun", value: "target_starttimer" },
  { key: "portalgun", value: "weapon_portalgun" },
];

const generateUuid = () => {
  return [4, 2, 2, 2, 6] // or 8-4-4-4-12 in hex
    .map((group) => crypto.randomBytes(group).toString("hex"))
    .join("-");
};

function findWorldSpawns(data) {
  let spawns = [];
  for (const wspawn of worldspawns) {
    let regex = new RegExp('"' + wspawn + '" "*."');
    let m;
    let br = false;
    let item = "";
    while ((m = regex.exec(data)) !== null && !br) {
      if (m.index === regex.lastIndex) regex.lastIndex++;

      m.forEach((match) => {
        br = true;
        item = match;
      });
    }
    if (item.includes("1")) {
      spawns.push(wspawn);
    }
  }
  return spawns;
}

function findMapFeatures(data) {
  let features = {
    keys: [],
    counts: {},
  };
  for (const mf of mapfeatures) {
    const regex = new RegExp(`${mf.value}`, "gm");
    let m;
    let count = 0;
    while ((m = regex.exec(data)) !== null) {
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      m.forEach((match) => {
        if (features.keys.indexOf(match) === -1) {
          features.keys.push(match);
        }
        count++;
      });
    }
    features.counts[mf.value] = count;
  }
  return features;
}

function parseArenaFile(data) {
  const keys = [
    "map",
    "longname",
    "type",
    "timelimit",
    "axisRespawnTime",
    "alliedRespawnTime",
    "briefing",
    "mapposition_x",
    "mapposition_y",
  ];
  const arena = {
    map: null,
    longname: null,
    type: null,
    timelimit: null,
    axisRespawnTime: null,
    alliedRespawnTime: null,
    briefing: null,
    mapposition_x: null,
    mapposition_y: null,
  };
  keys.forEach((key) => {
    const regex = new RegExp(`\\b${key}\\s+(?:\\"|\\d+)\\b.*`, "gm");
    let m;
    while ((m = regex.exec(data)) !== null) {
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      m.forEach((match) => {
        match = match.replace(key, "").replace(/"/g, "").trim();
        arena[key] = match;
      });
    }
  });

  /**
   * Try to parse to integers for DB insert.
   */
  try {
    arena.timelimit = parseInt(arena.timelimit);
    arena.axisRespawnTime = parseInt(arena.axisRespawnTime);
    arena.alliedRespawnTime = parseInt(arena.alliedRespawnTime);
    arena.mapposition_x = parseInt(arena.mapposition_x);
    arena.mapposition_y = parseInt(arena.mapposition_y);
  } catch (err) {
    console.warn(err);
  }
  return arena;
}

function generateZipTree(files) {
  let filestruct = { folder_count: 0, file_count: 0 };
  let filetree = [];
  let level = { filetree };

  Object.keys(files).forEach((path) => {
    path.split("/").reduce((r, name) => {
      if (!name) {
        return;
      }

      if (!r[name]) {
        r[name] = { filetree: [] };
        let entry = { name, type: files[path].dir ? "directory" : "file" };
        files[path].dir && (entry.children = r[name].filetree);
        files[path].dir ? filestruct.folder_count++ : filestruct.file_count++;
        r.filetree.push(entry);
      }

      return r[name];
    }, level);
  });
  filestruct.filetree = filetree;

  return filestruct;
}

/**
 * Parses a pk3 ET map file and fetches all info known to the parser.
 * @param {*} mapPath absolute path to map file
 * @returns info of map parsed
 */
async function parseMapInfo(mapPath) {
  let info = {
    pkName: "",
    name: "",
    size: 0,
    worldspawns: [],
    levelshots: { default: undefined, cc: undefined },
    mapfeatures: [],
    arena: {},
    textFiles: [],
    shaderInfo: [],
    fileTree: [],
    release: null,
  };
  const fileData = fs.readFileSync(mapPath);
  const zip = await JSZip.loadAsync(fileData);
  info.fileTree = generateZipTree(zip.files);
  info.pkName = zip.name;

  /**
   * Base map info parsing from .bsp
   */
  const mapBsp = Object.values(zip.files).find(
    (file) => file.name.endsWith(".bsp") && file.name.startsWith("maps/")
  );
  if (mapBsp) {
    info.name = mapBsp.name.split("/").splice(-1, 1)[0].replace(".bsp", "");
    const bspContent = await zip.file(mapBsp.name).async("string");
    info.worldspawns = findWorldSpawns(bspContent);
    info.mapfeatures = findMapFeatures(bspContent).keys;
    if (info.mapfeatures.length === 0) {
      info.mapfeatures = ["nofeatures"];
    }
    info.release = mapBsp.date.toLocaleDateString("en-GB");
  } else {
    throw new Error('Unable to find map ".bsp" file.');
  }

  /**
   * Base map info parsing from .arena
   */
  const mapArena = Object.values(zip.files).find(
    (file) => file.name.endsWith(".arena") && file.name.startsWith("scripts/")
  );
  if (mapArena) {
    const arenaFile = await zip.file(mapArena.name).async("string");
    info.arena = parseArenaFile(arenaFile);
  } else {
    throw new Error('Unable to find map ".arena" file.');
  }

  /**
   * Iterating all shader files
   */
  const shaderFiles = Object.values(zip.files).filter((file) =>
    file.name.endsWith(".shader")
  );
  for (const shaderFile of shaderFiles) {
    const shaderContent = await zip.file(shaderFile.name).async("string");
    for (let s of shaders)
      if (shaderContent.search(s.value) !== -1) info.shaderInfo.push(s);
  }

  /**
   * Find all .txt files
   */
  const textFiles = Object.values(zip.files).filter((file) =>
    file.name.endsWith(".txt")
  );
  for (const textFile of textFiles) {
    const textContent = await zip.file(textFile.name).async("string");
    info.textFiles.push({
      name: textFile.name,
      content: textContent,
    });
  }

  /**
   * Find levelshot images and save them with unique name
   */
  const levelshots = Object.values(zip.files).filter(
    (file) =>
      file.name.toLocaleLowerCase() ===
        `levelshots/${info.arena.map}.tga`.toLocaleLowerCase() ||
      file.name.toLocaleLowerCase() ===
        `levelshots/${info.arena.map}_cc.tga`.toLocaleLowerCase()
  );
  for (const levelshot of levelshots) {
    const lsContent = await zip.file(levelshot.name).async("nodebuffer");
    const lsSavedAs = generateUuid() + ".tga";
    try {
      fs.writeFileSync(configs.savePath + lsSavedAs, lsContent);
      if (levelshot.name.endsWith("_cc.tga")) {
        info.levelshots.cc = lsSavedAs;
      } else {
        info.levelshots.default = lsSavedAs;
      }
    } catch (err) {
      console.warn("Levelshot unzipping went wrong: ", err);
    }
  }
  return info;
}

module.exports = {
  parseMapInfo,
};
