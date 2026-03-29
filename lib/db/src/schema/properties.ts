import { pgTable, serial, text, integer, boolean, numeric, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const propertyTypeEnum = pgEnum("property_type", ["rent", "sale"]);
export const propertyStatusEnum = pgEnum("property_status", ["available", "rented", "sold"]);

export const propertiesTable = pgTable("properties", {
  id: serial("id").primaryKey(),
  landlordId: text("landlord_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: propertyTypeEnum("type").notNull(),
  status: propertyStatusEnum("status").notNull().default("available"),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  area: numeric("area", { precision: 10, scale: 2 }),
  images: text("images").array().notNull().default([]),
  isVerified: boolean("is_verified").notNull().default(false),
  hasLandDocuments: boolean("has_land_documents").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPropertySchema = createInsertSchema(propertiesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof propertiesTable.$inferSelect;
