import { clearSession, getSessionId, getSession } from "../lib/auth";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

async function authMiddleware(req, res, next) {
  req.isAuthenticated = function () {
    return this.user != null;
  };
  const sid = getSessionId(req);
  if (!sid) {
    next();
    return;
  }
  const session = await getSession(sid);
  if (!session?.user?.id) {
    await clearSession(res, sid);
    next();
    return;
  }
  const [u] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, session.user.id));
  if (!u) {
    await clearSession(res, sid);
    next();
    return;
  }
  let role = u.role;
  if (!role) {
    role = "tenant";
    await db
      .update(usersTable)
      .set({ role: "tenant" })
      .where(eq(usersTable.id, u.id));
  }
  req.user = {
    id: u.id,
    email: u.email,
    username: u.username,
    firstName: u.firstName,
    lastName: u.lastName,
    profileImageUrl: u.profileImageUrl,
    role,
  };
  next();
}

export { authMiddleware };
