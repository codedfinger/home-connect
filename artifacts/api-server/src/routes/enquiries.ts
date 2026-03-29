import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { enquiriesTable, propertiesTable, usersTable } from "@workspace/db/schema";
import { eq, sql } from "drizzle-orm";
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

function formatUser(u: any) {
  return {
    id: u.id,
    username: u.username ?? u.email ?? u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    profileImage: u.profileImageUrl,
    phone: u.phone,
    isVerified: u.isVerified === "true",
  };
}

async function buildEnquiry(e: any, includeProperty: boolean, includeTenant: boolean) {
  let property = null;
  let tenant = null;

  if (includeProperty) {
    const [prop] = await db.select().from(propertiesTable).where(eq(propertiesTable.id, e.propertyId));
    if (prop) {
      property = formatProperty(prop, null, false);
    }
  }

  if (includeTenant) {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, e.tenantId));
    if (user) tenant = formatUser(user);
  }

  return {
    id: e.id,
    propertyId: e.propertyId,
    tenantId: e.tenantId,
    message: e.message,
    phone: e.phone ?? null,
    status: e.status,
    property,
    tenant,
    createdAt: e.createdAt?.toISOString() ?? new Date().toISOString(),
  };
}

const createEnquirySchema = z.object({
  propertyId: z.number().int().positive(),
  message: z.string().min(1),
  phone: z.string().nullable().optional(),
});

router.post("/enquiries", async (req, res) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }

  const parsed = createEnquirySchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input" }); return; }

  const [created] = await db
    .insert(enquiriesTable)
    .values({ ...parsed.data, tenantId: req.user.id, phone: parsed.data.phone ?? null })
    .returning();

  const formatted = await buildEnquiry(created, true, false);
  res.status(201).json(formatted);
});

router.get("/enquiries/received", async (req, res) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }

  const myPropertyIds = await db
    .select({ id: propertiesTable.id })
    .from(propertiesTable)
    .where(eq(propertiesTable.landlordId, req.user.id));

  const ids = myPropertyIds.map((p) => p.id);
  if (!ids.length) { res.json({ enquiries: [], total: 0 }); return; }

  const enqs = await db
    .select()
    .from(enquiriesTable)
    .where(sql`${enquiriesTable.propertyId} = ANY(ARRAY[${sql.join(ids.map(id => sql`${id}`), sql`, `)}]::int[])`);

  const formatted = await Promise.all(enqs.map((e) => buildEnquiry(e, true, true)));
  res.json({ enquiries: formatted, total: formatted.length });
});

router.get("/enquiries/sent", async (req, res) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }

  const enqs = await db.select().from(enquiriesTable).where(eq(enquiriesTable.tenantId, req.user.id));
  const formatted = await Promise.all(enqs.map((e) => buildEnquiry(e, true, false)));
  res.json({ enquiries: formatted, total: formatted.length });
});

export default router;
