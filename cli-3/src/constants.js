const { version } = require("../package.json");

// /Users/xxx/.template
const downloadPath = `${
  process.env[process.platform === "darwin" ? "HOME" : "USERPROFILE"]
}/.template`;

module.exports = {
  version,
  downloadPath
};
