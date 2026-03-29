import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { bookmarksTable, propertiesTable, usersTable } from "@workspace/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { z } from "zod";

const router: IRouter = Router();

function formatProperty(p: any, landlord: any | null) {
  return {
    id: p.id,
    landlordId: p.landlordId,
    title: p.title,
    description: p.description,
    type: p.type,
    status: p.status,
    price: Number(p.price),
    city: p.city,
    address: p.address,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    area: p.area ? Number(p.area) : null,
    images: p.images ?? [],
    isVerified: p.isVerified,
    hasLandDocuments: p.hasLandDocuments,
    landlord: landlord
      ? {
          id: landlord.id,
          username: landlord.username ?? landlord.email ?? landlord.id,
          firstName: landlord.firstName,
          lastName: landlord.lastName,
          profileImage: landlord.profileImageUrl,
          phone: landlord.phone,
          isVerified: landlord.isVerified === "true",
        }
      : null,
    isBookmarked: true,
    createdAt: p.createdAt?.toISOString() ?? new Date().toISOString(),
  };
}

router.get("/bookmarks", async (req, res) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }

  const bms = await db.select().from(bookmarksTable).where(eq(bookmarksTable.userId, req.user.id));
  if (!bms.length) { res.json({ properties: [], total: 0 }); return; }

  const propIds = bms.map((b) => b.propertyId);
  const props = await db
    .select()
    .from(propertiesTable)
    .where(sql`${propertiesTable.id} = ANY(ARRAY[${sql.join(propIds.map(id => sql`${id}`), sql`, `)}]::int[])`);

  const landlordIds = [...new Set(props.map((p) => p.landlordId))];
  const landlords = landlordIds.length
    ? await db.select().from(usersTable).where(sql`${usersTable.id} = ANY(ARRAY[${sql.join(landlordIds.map(id => sql`${id}`), sql`, `)}]::text[])`)
    : [];
  const landlordMap = Object.fromEntries(landlords.map((l) => [l.id, l]));

  const formatted = props.map((p) => formatProperty(p, landlordMap[p.landlordId] ?? null));
  res.json({ properties: formatted, total: formatted.length });
});

const bookmarkSchema = z.object({
  propertyId: z.number().int().positive(),
});

router.post("/bookmarks", async (req, res) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }

  const parsed = bookmarkSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }

  await db
    .insert(bookmarksTable)
    .values({ userId: req.user.id, propertyId: parsed.data.propertyId })
    .onConflictDoNothing();

  res.status(201).json({ success: true });
});

router.delete("/bookmarks/:propertyId", async (req, res) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }

  const propertyId = Number(req.params.propertyId);
  if (isNaN(propertyId)) { res.status(400).json({ error: "Invalid ID" }); return; }

  await db
    .delete(bookmarksTable)
    .where(and(eq(bookmarksTable.userId, req.user.id), eq(bookmarksTable.propertyId, propertyId)));

  res.json({ success: true });
});

export default router;
