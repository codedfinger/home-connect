import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import fs from "node:fs";
import path from "node:path";
import router from "./routes";
import { logger } from "./lib/logger";
import { authMiddleware } from "./middlewares/authMiddleware";
const app = express();
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0]
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode
        };
      }
    }
  })
);
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authMiddleware);
app.use("/api", router);

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

const frontendDistDir = path.join(
  findRepoRoot(),
  "frontend",
  "dist",
  "public"
);
const indexHtmlPath = path.join(frontendDistDir, "index.html");

if (fs.existsSync(indexHtmlPath)) {
  app.use(express.static(frontendDistDir));
  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(indexHtmlPath);
  });
}
var stdin_default = app;
export {
  stdin_default as default
};
