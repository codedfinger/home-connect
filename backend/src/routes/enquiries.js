import { Router } from "express";
import { db } from "@workspace/db";
import { enquiriesTable, propertiesTable, usersTable } from "@workspace/db/schema";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { formatPropertyResponse } from "../lib/formatProperty";

const router = Router();

function formatUser(u) {
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

async function buildEnquiry(e, includeProperty, includeTenant) {
  let property = null;
  let tenant = null;
  if (includeProperty) {
    const [prop] = await db
      .select()
      .from(propertiesTable)
      .where(eq(propertiesTable.id, e.propertyId));
    if (prop) {
      let landlordUser = null;
      if (prop.landlordId) {
        const [lu] = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.id, prop.landlordId));
        landlordUser = lu ?? null;
      }
      property = formatPropertyResponse(prop, landlordUser, false);
    }
  }
  if (includeTenant) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, e.tenantId));
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
    createdAt:
      e.createdAt?.toISOString?.() ?? new Date().toISOString(),
  };
}

const createEnquirySchema = z.object({
  propertyId: z.number().int().positive(),
  message: z.string().min(1),
  phone: z.string().nullable().optional(),
});

router.post("/enquiries", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const parsed = createEnquirySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const [created] = await db
    .insert(enquiriesTable)
    .values({
      ...parsed.data,
      tenantId: req.user.id,
      phone: parsed.data.phone ?? null,
    })
    .returning();
  const formatted = await buildEnquiry(created, true, false);
  res.status(201).json(formatted);
});

router.get("/enquiries/received", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const role = req.user.role;
  let enqs;
  if (role === "admin") {
    enqs = await db.select().from(enquiriesTable);
  } else if (role === "landlord") {
    const myPropertyIds = await db
      .select({ id: propertiesTable.id })
      .from(propertiesTable)
      .where(eq(propertiesTable.landlordId, req.user.id));
    const ids = myPropertyIds.map((p) => p.id);
    if (!ids.length) {
      res.json({ enquiries: [], total: 0 });
      return;
    }
    enqs = await db
      .select()
      .from(enquiriesTable)
      .where(inArray(enquiriesTable.propertyId, ids));
  } else {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const formatted = await Promise.all(
    enqs.map((e) => buildEnquiry(e, true, true))
  );
  res.json({ enquiries: formatted, total: formatted.length });
});

router.get("/enquiries/sent", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const enqs = await db
    .select()
    .from(enquiriesTable)
    .where(eq(enquiriesTable.tenantId, req.user.id));
  const formatted = await Promise.all(
    enqs.map((e) => buildEnquiry(e, true, false))
  );
  res.json({ enquiries: formatted, total: formatted.length });
});

export default router;
