// used to verify JWT authority
const jwtSecret = `changed for public`;

/**
 * Save all files under tmp to avoid overfill
 */
const savePath = process.platform === 'win32' ? "C:/temp/" : "/tmp/";

module.exports = {
    secret: jwtSecret,
    savePath: savePath
}