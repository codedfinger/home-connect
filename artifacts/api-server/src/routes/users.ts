import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router: IRouter = Router();

router.get("/users/profile", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const user = await db.select().from(usersTable).where(eq(usersTable.id, req.user.id)).limit(1);
  if (!user[0]) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  const u = user[0];
  res.json({
    id: u.id,
    username: u.username ?? u.email ?? u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    profileImage: u.profileImageUrl,
    role: u.role,
    phone: u.phone,
    isVerified: u.isVerified === "true",
    bio: u.bio,
  });
});

const updateProfileSchema = z.object({
  role: z.enum(["landlord", "tenant"]),
  phone: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
});

router.put("/users/profile", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  const { role, phone, bio } = parsed.data;
  const [updated] = await db
    .update(usersTable)
    .set({ role, phone: phone ?? null, bio: bio ?? null })
    .where(eq(usersTable.id, req.user.id))
    .returning();

  res.json({
    id: updated.id,
    username: updated.username ?? updated.email ?? updated.id,
    firstName: updated.firstName,
    lastName: updated.lastName,
    profileImage: updated.profileImageUrl,
    role: updated.role,
    phone: updated.phone,
    isVerified: updated.isVerified === "true",
    bio: updated.bio,
  });
});

export default router;
