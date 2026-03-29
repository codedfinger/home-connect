import { pgTable, serial, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const enquiryStatusEnum = pgEnum("enquiry_status", ["pending", "read"]);

export const enquiriesTable = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  tenantId: text("tenant_id").notNull(),
  message: text("message").notNull(),
  phone: text("phone"),
  status: enquiryStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEnquirySchema = createInsertSchema(enquiriesTable).omit({
  id: true,
  createdAt: true,
});
export type InsertEnquiry = z.infer<typeof insertEnquirySchema>;
export type Enquiry = typeof enquiriesTable.$inferSelect;
