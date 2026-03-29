import { sql } from "drizzle-orm";
import {
  integer,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

const propertiesTable = sqliteTable("properties", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  landlordId: text("landlord_id"),
  listingContactName: text("listing_contact_name"),
  listingContactPhone: text("listing_contact_phone"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type", { enum: ["rent", "sale"] }).notNull(),
  status: text("status", { enum: ["available", "rented", "sold"] })
    .notNull()
    .default("available"),
  price: real("price").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  area: real("area"),
  images: text("images", { mode: "json" }).notNull().default(sql`(json_array())`),
  isVerified: integer("is_verified", { mode: "boolean" }).notNull().default(false),
  hasLandDocuments: integer("has_land_documents", { mode: "boolean" })
    .notNull()
    .default(false),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

const insertPropertySchema = createInsertSchema(propertiesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export { insertPropertySchema, propertiesTable };
