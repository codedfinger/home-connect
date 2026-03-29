import { pgTable, text, integer, timestamp, primaryKey } from "drizzle-orm/pg-core";

export const bookmarksTable = pgTable("bookmarks", {
  userId: text("user_id").notNull(),
  propertyId: integer("property_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [
  primaryKey({ columns: [t.userId, t.propertyId] }),
]);

export type Bookmark = typeof bookmarksTable.$inferSelect;
