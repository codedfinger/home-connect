import {
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

const enquiriesTable = sqliteTable("enquiries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  propertyId: integer("property_id").notNull(),
  tenantId: text("tenant_id").notNull(),
  message: text("message").notNull(),
  phone: text("phone"),
  status: text("status", { enum: ["pending", "read"] })
    .notNull()
    .default("pending"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

const insertEnquirySchema = createInsertSchema(enquiriesTable).omit({
  id: true,
  createdAt: true,
});

export { enquiriesTable, insertEnquirySchema };
