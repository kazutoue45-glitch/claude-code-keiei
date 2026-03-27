import {
  pgTable,
  text,
  timestamp,
  varchar,
  integer,
  boolean,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { nanoid } from "nanoid";

// ============================================================
// Enums
// ============================================================

export const orgRoleEnum = pgEnum("org_role", ["admin", "editor", "viewer"]);

// ============================================================
// Organizations (組織 = 塾単位)
// ============================================================

export const organizations = pgTable("organizations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: varchar("name", { length: 255 }).notNull(),
  inviteCode: varchar("invite_code", { length: 20 })
    .notNull()
    .unique()
    .$defaultFn(() => nanoid(10)),
  // Notion連携設定（組織単位）
  notionToken: text("notion_token"),
  notionCampusDbId: text("notion_campus_db_id"),
  notionInstructorDbId: text("notion_instructor_db_id"),
  notionStudentDbId: text("notion_student_db_id"),
  notionClassDbId: text("notion_class_db_id"),
  notionScheduleDbId: text("notion_schedule_db_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================================
// Users (認証 + RBAC)
// ============================================================

export const users = pgTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull().unique(),
    image: text("image"),
    // Google OAuth
    googleId: varchar("google_id", { length: 255 }).unique(),
    // 組織・権限
    organizationId: text("organization_id").references(() => organizations.id),
    role: orgRoleEnum("role").default("viewer").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("users_org_idx").on(table.organizationId),
    uniqueIndex("users_google_id_idx").on(table.googleId),
  ]
);

// ============================================================
// Campuses (校舎マスタ)
// ============================================================

export const campuses = pgTable(
  "campuses",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    notionPageId: varchar("notion_page_id", { length: 255 }),
    name: varchar("name", { length: 255 }).notNull(),
    status: varchar("status", { length: 50 }).default("active").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("campuses_org_idx").on(table.organizationId),
    uniqueIndex("campuses_notion_idx").on(table.notionPageId),
  ]
);

// ============================================================
// Instructors (講師マスタ)
// ============================================================

export const instructors = pgTable(
  "instructors",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    notionPageId: varchar("notion_page_id", { length: 255 }),
    name: varchar("name", { length: 255 }).notNull(),
    status: varchar("status", { length: 50 }).default("active").notNull(),
    subjects: text("subjects"), // JSON array
    favoriteSubjects: text("favorite_subjects"), // JSON array
    sortOrder: integer("sort_order").default(0),
    isDirty: boolean("is_dirty").default(false),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("instructors_org_idx").on(table.organizationId),
    uniqueIndex("instructors_notion_idx").on(table.notionPageId),
  ]
);

// ============================================================
// Students (生徒マスタ)
// ============================================================

export const students = pgTable(
  "students",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    notionPageId: varchar("notion_page_id", { length: 255 }),
    name: varchar("name", { length: 255 }).notNull(),
    status: varchar("status", { length: 50 }).default("active").notNull(),
    grade: varchar("grade", { length: 50 }),
    birthDate: timestamp("birth_date"),
    isDirty: boolean("is_dirty").default(false),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("students_org_idx").on(table.organizationId),
    uniqueIndex("students_notion_idx").on(table.notionPageId),
  ]
);

// ============================================================
// Instructor ↔ Campus (M:N)
// ============================================================

export const instructorCampuses = pgTable(
  "instructor_campuses",
  {
    instructorId: text("instructor_id")
      .notNull()
      .references(() => instructors.id, { onDelete: "cascade" }),
    campusId: text("campus_id")
      .notNull()
      .references(() => campuses.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("instructor_campus_idx").on(
      table.instructorId,
      table.campusId
    ),
  ]
);

// ============================================================
// Student ↔ Campus (M:N)
// ============================================================

export const studentCampuses = pgTable(
  "student_campuses",
  {
    studentId: text("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    campusId: text("campus_id")
      .notNull()
      .references(() => campuses.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("student_campus_idx").on(table.studentId, table.campusId),
  ]
);

// ============================================================
// Relations
// ============================================================

export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  campuses: many(campuses),
  instructors: many(instructors),
  students: many(students),
}));

export const usersRelations = relations(users, ({ one }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
}));

export const campusesRelations = relations(campuses, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [campuses.organizationId],
    references: [organizations.id],
  }),
  instructorCampuses: many(instructorCampuses),
  studentCampuses: many(studentCampuses),
}));

export const instructorsRelations = relations(instructors, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [instructors.organizationId],
    references: [organizations.id],
  }),
  instructorCampuses: many(instructorCampuses),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [students.organizationId],
    references: [organizations.id],
  }),
  studentCampuses: many(studentCampuses),
}));

export const instructorCampusesRelations = relations(
  instructorCampuses,
  ({ one }) => ({
    instructor: one(instructors, {
      fields: [instructorCampuses.instructorId],
      references: [instructors.id],
    }),
    campus: one(campuses, {
      fields: [instructorCampuses.campusId],
      references: [campuses.id],
    }),
  })
);

export const studentCampusesRelations = relations(
  studentCampuses,
  ({ one }) => ({
    student: one(students, {
      fields: [studentCampuses.studentId],
      references: [students.id],
    }),
    campus: one(campuses, {
      fields: [studentCampuses.campusId],
      references: [campuses.id],
    }),
  })
);
