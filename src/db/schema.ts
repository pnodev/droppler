// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  pgTableCreator,
  uuid,
  timestamp,
  varchar,
  text,
  integer,
  pgEnum,
  primaryKey,
  index,
  json,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `droppler_${name}`);

export const buckets = createTable(
  "buckets",
  {
    id: uuid("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
    owner: varchar("owner", { length: 256 }).notNull(),
    isPublic: boolean("is_public").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (example) => [index("bucket_owner_idx").on(example.owner)]
);

export type Bucket = typeof buckets.$inferSelect;
export const BucketSchema = createSelectSchema(buckets);
export const insertBucketValidator = createInsertSchema(buckets, {
  id: (schema) => schema.optional(),
  owner: (schema) => schema.optional(),
  isPublic: (schema) => schema.optional(),
  createdAt: (schema) => schema.optional(),
  updatedAt: (schema) => schema.optional(),
});

export const files = createTable(
  "files",
  {
    id: uuid("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    size: integer("size").notNull(),
    type: varchar("type", { length: 256 }).notNull(),
    url: varchar("url", { length: 256 }).notNull(),
    key: varchar("key", { length: 256 }).notNull(),
    bucketId: uuid("bucket_id").notNull(),
    owner: varchar("owner", { length: 256 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (example) => [index("file_owner_idx").on(example.owner)]
);

export const fileRelations = relations(files, ({ one }) => ({
  bucket: one(buckets, {
    fields: [files.bucketId],
    references: [buckets.id],
  }),
}));

export type File = typeof files.$inferSelect;
export const FileSchema = createSelectSchema(files);
export const insertFileValidator = createInsertSchema(files, {
  id: (schema) => schema.optional(),
  owner: (schema) => schema.optional(),
  createdAt: (schema) => schema.optional(),
  updatedAt: (schema) => schema.optional(),
});
export type FileInput = {
  name: string;
  size: number;
  type: string;
  url: string;
  key: string;
  bucketId: string;
};
