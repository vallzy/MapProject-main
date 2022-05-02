const axios = require("axios").default;
console.log(process.env.NODE_ENV);

const apiRoot = process.env.NODE_ENV === "development" ? "http://localhost:3000" : '.';

async function fetchMaps(worldSettings) {
  return axios.post(`${apiRoot}/api/maps`, {
    worldSettings,
  });
}

async function fetchMap(mapId) {
  return axios.get(`${apiRoot}/api/maps/${mapId}`);
}

async function login(username, password) {
  return axios.post(`${apiRoot}/login`, {
    username,
    password,
  });
}

async function upload(formData) {
  return axios.post(`${apiRoot}/api/upload`, formData, {
    headers: { Authorization: "Bearer " + window.localStorage.getItem("jwt") },
  });
}

async function submitClassification(classification) {
  return axios.post(
    `${apiRoot}/api/maps/${classification.mapId}`,
    classification,
    {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("jwt"),
      },
    }
  );
}

module.exports = {
  fetchMaps,
  fetchMap,
  login,
  upload,
  apiRoot,
  submitClassification,
};
