import { integer, sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core";

const bookmarksTable = sqliteTable(
  "bookmarks",
  {
    userId: text("user_id").notNull(),
    propertyId: integer("property_id").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [primaryKey({ columns: [t.userId, t.propertyId] })]
);

export { bookmarksTable };
