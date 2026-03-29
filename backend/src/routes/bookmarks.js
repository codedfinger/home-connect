import { Router } from "express";
import { db } from "@workspace/db";
import { bookmarksTable, propertiesTable, usersTable } from "@workspace/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { z } from "zod";
import { formatPropertyResponse } from "../lib/formatProperty";

const router = Router();
router.get("/bookmarks", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const bms = await db.select().from(bookmarksTable).where(eq(bookmarksTable.userId, req.user.id));
  if (!bms.length) {
    res.json({ properties: [], total: 0 });
    return;
  }
  const propIds = bms.map((b) => b.propertyId);
  const props = await db
    .select()
    .from(propertiesTable)
    .where(inArray(propertiesTable.id, propIds));
  const landlordIds = [
    ...new Set(props.map((p) => p.landlordId).filter(Boolean)),
  ];
  const landlords = landlordIds.length
    ? await db.select().from(usersTable).where(inArray(usersTable.id, landlordIds))
    : [];
  const landlordMap = Object.fromEntries(landlords.map((l) => [l.id, l]));
  const formatted = props.map((p) =>
    formatPropertyResponse(
      p,
      p.landlordId ? landlordMap[p.landlordId] ?? null : null,
      true
    )
  );
  res.json({ properties: formatted, total: formatted.length });
});
const bookmarkSchema = z.object({
  propertyId: z.number().int().positive()
});
router.post("/bookmarks", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const parsed = bookmarkSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  await db.insert(bookmarksTable).values({ userId: req.user.id, propertyId: parsed.data.propertyId }).onConflictDoNothing();
  res.status(201).json({ success: true });
});
router.delete("/bookmarks/:propertyId", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const propertyId = Number(req.params.propertyId);
  if (isNaN(propertyId)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  await db.delete(bookmarksTable).where(and(eq(bookmarksTable.userId, req.user.id), eq(bookmarksTable.propertyId, propertyId)));
  res.json({ success: true });
});
var stdin_default = router;
export {
  stdin_default as default
};
