import crypto from "crypto";
import { db, sessionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
const SESSION_COOKIE = "sid";
const SESSION_TTL = 7 * 24 * 60 * 60 * 1e3;
async function createSession(data) {
  const sid = crypto.randomBytes(32).toString("hex");
  await db.insert(sessionsTable).values({
    sid,
    sess: data,
    expire: new Date(Date.now() + SESSION_TTL)
  });
  return sid;
}
async function getSession(sid) {
  const [row] = await db.select().from(sessionsTable).where(eq(sessionsTable.sid, sid));
  if (!row || row.expire < /* @__PURE__ */ new Date()) {
    if (row) await deleteSession(sid);
    return null;
  }
  return row.sess;
}
async function deleteSession(sid) {
  await db.delete(sessionsTable).where(eq(sessionsTable.sid, sid));
}
async function clearSession(res, sid) {
  if (sid) await deleteSession(sid);
  res.clearCookie(SESSION_COOKIE, { path: "/" });
}
function getSessionId(req) {
  const authHeader = req.headers["authorization"];
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return req.cookies?.[SESSION_COOKIE];
}
export {
  SESSION_COOKIE,
  SESSION_TTL,
  clearSession,
  createSession,
  deleteSession,
  getSession,
  getSessionId
};
