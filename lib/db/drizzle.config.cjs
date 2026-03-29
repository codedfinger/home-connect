require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

const fs = require("fs");
const path = require("path");
const { defineConfig } = require("drizzle-kit");

const repoRoot = path.resolve(__dirname, "../..");

function resolveSqlitePath() {
  const fromEnv = process.env.SQLITE_PATH;
  let resolved;
  if (fromEnv) {
    resolved = path.isAbsolute(fromEnv)
      ? fromEnv
      : path.resolve(repoRoot, fromEnv);
  } else {
    resolved = path.join(repoRoot, "data", "homeconnect.db");
  }
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  return resolved;
}

module.exports = defineConfig({
  schema: path.join(__dirname, "./src/schema/index.js"),
  dialect: "sqlite",
  dbCredentials: {
    url: resolveSqlitePath(),
  },
});
