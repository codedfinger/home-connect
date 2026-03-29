import { sql } from "drizzle-orm";
import { index, jsonb, pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
const userRoleEnum = pgEnum("user_role", ["landlord", "tenant"]);
const sessionsTable = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
const usersTable = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  username: varchar("username"),
  passwordHash: varchar("password_hash"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role"),
  phone: varchar("phone"),
  bio: varchar("bio"),
  isVerified: varchar("is_verified").notNull().default("false"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => /* @__PURE__ */ new Date())
});
export {
  sessionsTable,
  userRoleEnum,
  usersTable
};
