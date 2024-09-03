import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  boolean,
  pgEnum,
  unique,
  PgTable,
  serial,
  real,
  index
} from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  image: text("image"),
  password: text("password")
});
