import { Router } from "express";
import { db } from "@workspace/db";
import { propertiesTable, bookmarksTable, usersTable } from "@workspace/db/schema";
import { eq, and, gte, lte, like, inArray } from "drizzle-orm";
import { z } from "zod";
import { formatPropertyResponse } from "../lib/formatProperty";

const router = Router();

function assertAdmin(req, res) {
  if (!req.isAuthenticated() || req.user.role !== "admin") {
    res.status(403).json({ error: "Only admins can add or edit listings" });
    return false;
  }
  return true;
}

router.get("/properties", async (req, res) => {
  const { type, city, minPrice, maxPrice, bedrooms, verified } = req.query;
  const conditions = [];
  if (type) conditions.push(eq(propertiesTable.type, type));
  if (city) conditions.push(like(propertiesTable.city, `%${city}%`));
  if (minPrice) conditions.push(gte(propertiesTable.price, Number(minPrice)));
  if (maxPrice) conditions.push(lte(propertiesTable.price, Number(maxPrice)));
  if (bedrooms) conditions.push(eq(propertiesTable.bedrooms, Number(bedrooms)));
  if (verified === "true") conditions.push(eq(propertiesTable.isVerified, true));
  const props = await db
    .select()
    .from(propertiesTable)
    .where(conditions.length ? and(...conditions) : void 0);
  const currentUserId = req.isAuthenticated() ? req.user.id : null;
  const landlordIds = [
    ...new Set(props.map((p) => p.landlordId).filter(Boolean)),
  ];
  const landlords = landlordIds.length
    ? await db.select().from(usersTable).where(inArray(usersTable.id, landlordIds))
    : [];
  const landlordMap = Object.fromEntries(landlords.map((l) => [l.id, l]));
  let bookmarkedIds = /* @__PURE__ */ new Set();
  if (currentUserId) {
    const bms = await db
      .select()
      .from(bookmarksTable)
      .where(eq(bookmarksTable.userId, currentUserId));
    bookmarkedIds = new Set(bms.map((b) => b.propertyId));
  }
  const formatted = props.map((p) =>
    formatPropertyResponse(
      p,
      p.landlordId ? landlordMap[p.landlordId] ?? null : null,
      bookmarkedIds.has(p.id)
    )
  );
  res.json({ properties: formatted, total: formatted.length });
});

router.get("/properties/my", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const role = req.user.role;
  if (role === "admin") {
    const props = await db.select().from(propertiesTable);
    const landlordIds = [
      ...new Set(props.map((p) => p.landlordId).filter(Boolean)),
    ];
    const landlords = landlordIds.length
      ? await db
          .select()
          .from(usersTable)
          .where(inArray(usersTable.id, landlordIds))
      : [];
    const landlordMap = Object.fromEntries(landlords.map((l) => [l.id, l]));
    const formatted = props.map((p) =>
      formatPropertyResponse(
        p,
        p.landlordId ? landlordMap[p.landlordId] ?? null : null,
        false
      )
    );
    res.json({ properties: formatted, total: formatted.length });
    return;
  }
  if (role === "landlord") {
    const props = await db
      .select()
      .from(propertiesTable)
      .where(eq(propertiesTable.landlordId, req.user.id));
    const [landlord] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.user.id));
    const formatted = props.map((p) =>
      formatPropertyResponse(p, landlord ?? null, false)
    );
    res.json({ properties: formatted, total: formatted.length });
    return;
  }
  res.status(403).json({ error: "Forbidden" });
});

router.get("/properties/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  const [prop] = await db
    .select()
    .from(propertiesTable)
    .where(eq(propertiesTable.id, id));
  if (!prop) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  let landlordUser = null;
  if (prop.landlordId) {
    const [lu] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, prop.landlordId));
    landlordUser = lu ?? null;
  }
  let isBookmarked = false;
  if (req.isAuthenticated()) {
    const [bm] = await db
      .select()
      .from(bookmarksTable)
      .where(
        and(
          eq(bookmarksTable.userId, req.user.id),
          eq(bookmarksTable.propertyId, id)
        )
      );
    isBookmarked = !!bm;
  }
  res.json(formatPropertyResponse(prop, landlordUser, isBookmarked));
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
  listingContactName: z.string().min(1, "Owner or agent name is required"),
  listingContactPhone: z.string().min(5, "Contact phone is required"),
});

router.post("/properties", async (req, res) => {
  if (!assertAdmin(req, res)) return;
  const parsed = createPropertySchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  const { price, area, ...rest } = parsed.data;
  const [created] = await db
    .insert(propertiesTable)
    .values({
      ...rest,
      price,
      area: area ?? null,
      landlordId: null,
    })
    .returning();
  res
    .status(201)
    .json(formatPropertyResponse(created, null, false));
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
  listingContactName: z.string().min(1).optional(),
  listingContactPhone: z.string().min(5).optional(),
});

router.put("/properties/:id", async (req, res) => {
  if (!assertAdmin(req, res)) return;
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  const [prop] = await db
    .select()
    .from(propertiesTable)
    .where(eq(propertiesTable.id, id));
  if (!prop) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const parsed = updatePropertySchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  const { price, area, ...rest } = parsed.data;
  const updateData = { ...rest };
  if (price !== void 0) updateData.price = price;
  if (area !== void 0) updateData.area = area ?? null;
  const [updated] = await db
    .update(propertiesTable)
    .set(updateData)
    .where(eq(propertiesTable.id, id))
    .returning();
  let landlordUser = null;
  if (updated.landlordId) {
    const [lu] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, updated.landlordId));
    landlordUser = lu ?? null;
  }
  res.json(formatPropertyResponse(updated, landlordUser, false));
});

router.delete("/properties/:id", async (req, res) => {
  if (!assertAdmin(req, res)) return;
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  const [prop] = await db
    .select()
    .from(propertiesTable)
    .where(eq(propertiesTable.id, id));
  if (!prop) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  await db.delete(propertiesTable).where(eq(propertiesTable.id, id));
  res.json({ success: true });
});

export default router;
