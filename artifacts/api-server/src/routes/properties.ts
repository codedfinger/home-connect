import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { propertiesTable, bookmarksTable, usersTable } from "@workspace/db/schema";
import { eq, and, ilike, gte, lte, sql } from "drizzle-orm";
import { z } from "zod";

const router: IRouter = Router();

function formatProperty(p: any, landlord: any | null, isBookmarked: boolean) {
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
    isBookmarked,
    createdAt: p.createdAt?.toISOString() ?? new Date().toISOString(),
  };
}

router.get("/properties", async (req, res) => {
  const { type, city, minPrice, maxPrice, bedrooms, verified } = req.query;

  const conditions = [];
  if (type) conditions.push(eq(propertiesTable.type, type as "rent" | "sale"));
  if (city) conditions.push(ilike(propertiesTable.city, `%${city}%`));
  if (minPrice) conditions.push(gte(propertiesTable.price, String(minPrice)));
  if (maxPrice) conditions.push(lte(propertiesTable.price, String(maxPrice)));
  if (bedrooms) conditions.push(eq(propertiesTable.bedrooms, Number(bedrooms)));
  if (verified === "true") conditions.push(eq(propertiesTable.isVerified, true));

  const props = await db.select().from(propertiesTable).where(conditions.length ? and(...conditions) : undefined);

  const currentUserId = req.isAuthenticated() ? req.user.id : null;

  const landlordIds = [...new Set(props.map((p) => p.landlordId))];
  const landlords = landlordIds.length
    ? await db.select().from(usersTable).where(sql`${usersTable.id} = ANY(ARRAY[${sql.join(landlordIds.map(id => sql`${id}`), sql`, `)}]::text[])`)
    : [];
  const landlordMap = Object.fromEntries(landlords.map((l) => [l.id, l]));

  let bookmarkedIds = new Set<number>();
  if (currentUserId) {
    const bms = await db.select().from(bookmarksTable).where(eq(bookmarksTable.userId, currentUserId));
    bookmarkedIds = new Set(bms.map((b) => b.propertyId));
  }

  const formatted = props.map((p) =>
    formatProperty(p, landlordMap[p.landlordId] ?? null, bookmarkedIds.has(p.id))
  );

  res.json({ properties: formatted, total: formatted.length });
});

router.get("/properties/my", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const props = await db.select().from(propertiesTable).where(eq(propertiesTable.landlordId, req.user.id));
  const [landlord] = await db.select().from(usersTable).where(eq(usersTable.id, req.user.id));

  const formatted = props.map((p) => formatProperty(p, landlord ?? null, false));
  res.json({ properties: formatted, total: formatted.length });
});

router.get("/properties/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

  const [prop] = await db.select().from(propertiesTable).where(eq(propertiesTable.id, id));
  if (!prop) { res.status(404).json({ error: "Not found" }); return; }

  const [landlord] = await db.select().from(usersTable).where(eq(usersTable.id, prop.landlordId));

  let isBookmarked = false;
  if (req.isAuthenticated()) {
    const [bm] = await db
      .select()
      .from(bookmarksTable)
      .where(and(eq(bookmarksTable.userId, req.user.id), eq(bookmarksTable.propertyId, id)));
    isBookmarked = !!bm;
  }

  res.json(formatProperty(prop, landlord ?? null, isBookmarked));
});

const createPropertySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(["rent", "sale"]),
  price: z.number().positive(),
  city: z.string().min(1),
  address: z.string().min(1),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
  area: z.number().nullable().optional(),
  images: z.array(z.string()).default([]),
  hasLandDocuments: z.boolean(),
});

router.post("/properties", async (req, res) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }

  const parsed = createPropertySchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() }); return; }

  const { price, area, ...rest } = parsed.data;
  const [created] = await db
    .insert(propertiesTable)
    .values({ ...rest, price: String(price), area: area ? String(area) : null, landlordId: req.user.id })
    .returning();

  const [landlord] = await db.select().from(usersTable).where(eq(usersTable.id, req.user.id));
  res.status(201).json(formatProperty(created, landlord ?? null, false));
});

const updatePropertySchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  type: z.enum(["rent", "sale"]).optional(),
  status: z.enum(["available", "rented", "sold"]).optional(),
  price: z.number().positive().optional(),
  city: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  area: z.number().nullable().optional(),
  images: z.array(z.string()).optional(),
  hasLandDocuments: z.boolean().optional(),
});

router.put("/properties/:id", async (req, res) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }

  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

  const [prop] = await db.select().from(propertiesTable).where(eq(propertiesTable.id, id));
  if (!prop) { res.status(404).json({ error: "Not found" }); return; }
  if (prop.landlordId !== req.user.id) { res.status(403).json({ error: "Forbidden" }); return; }

  const parsed = updatePropertySchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() }); return; }

  const { price, area, ...rest } = parsed.data;
  const updateData: any = { ...rest };
  if (price !== undefined) updateData.price = String(price);
  if (area !== undefined) updateData.area = area ? String(area) : null;

  const [updated] = await db.update(propertiesTable).set(updateData).where(eq(propertiesTable.id, id)).returning();
  const [landlord] = await db.select().from(usersTable).where(eq(usersTable.id, req.user.id));
  res.json(formatProperty(updated, landlord ?? null, false));
});

router.delete("/properties/:id", async (req, res) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }

  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

  const [prop] = await db.select().from(propertiesTable).where(eq(propertiesTable.id, id));
  if (!prop) { res.status(404).json({ error: "Not found" }); return; }
  if (prop.landlordId !== req.user.id) { res.status(403).json({ error: "Forbidden" }); return; }

  await db.delete(propertiesTable).where(eq(propertiesTable.id, id));
  res.json({ success: true });
});

export default router;
