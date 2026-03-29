import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema/index.js";

function findRepoRoot() {
  let dir = process.cwd();
  for (let i = 0; i < 8; i++) {
    if (fs.existsSync(path.join(dir, "pnpm-workspace.yaml"))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return process.cwd();
}

function resolveSqlitePath() {
  const fromEnv = process.env.SQLITE_PATH;
  const repoRoot = findRepoRoot();
  if (fromEnv) {
    return path.isAbsolute(fromEnv)
      ? fromEnv
      : path.resolve(repoRoot, fromEnv);
  }
  return path.join(repoRoot, "data", "homeconnect.db");
}

const sqlitePath = resolveSqlitePath();
fs.mkdirSync(path.dirname(sqlitePath), { recursive: true });

const sqlite = new Database(sqlitePath);
sqlite.pragma("journal_mode = WAL");

const db = drizzle(sqlite, { schema });

export * from "./schema/index.js";
export { db, sqlite };
