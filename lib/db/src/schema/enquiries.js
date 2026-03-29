import { pgTable, serial, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
const enquiryStatusEnum = pgEnum("enquiry_status", ["pending", "read"]);
const enquiriesTable = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  tenantId: text("tenant_id").notNull(),
  message: text("message").notNull(),
  phone: text("phone"),
  status: enquiryStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
const insertEnquirySchema = createInsertSchema(enquiriesTable).omit({
  id: true,
  createdAt: true
});
export {
  enquiriesTable,
  enquiryStatusEnum,
  insertEnquirySchema
};
