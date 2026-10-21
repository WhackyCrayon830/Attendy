import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["student", "teacher", "admin"]);
export const attendanceStatus = pgEnum("attendance_status", ["present", "absent", "late"]);

export const users = pgTable("users", {
  id: uuid().defaultRandom().primaryKey(),
  email: text().notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRole().notNull().default("student"),
  displayName: text("display_name"),
  profileCompletedAt: timestamp("profile_completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const subjects = pgTable("subjects", {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
  code: text().notNull().unique(),
  room: text(),
  teacherId: uuid("teacher_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const enrollments = pgTable(
  "enrollments",
  {
    id: uuid().defaultRandom().primaryKey(),
    studentId: uuid("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    subjectId: uuid("subject_id").notNull().references(() => subjects.id, { onDelete: "cascade" }),
    enrolledAt: timestamp("enrolled_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("enrollments_student_subject_unique").on(table.studentId, table.subjectId),
    index("enrollments_student_idx").on(table.studentId),
  ],
);

export const classSessions = pgTable(
  "class_sessions",
  {
    id: uuid().defaultRandom().primaryKey(),
    subjectId: uuid("subject_id").notNull().references(() => subjects.id, { onDelete: "cascade" }),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
    room: text(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("class_sessions_subject_start_idx").on(table.subjectId, table.startsAt)],
);

export const attendanceRecords = pgTable(
  "attendance_records",
  {
    id: uuid().defaultRandom().primaryKey(),
    sessionId: uuid("session_id").notNull().references(() => classSessions.id, { onDelete: "cascade" }),
    studentId: uuid("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    status: attendanceStatus().notNull(),
    markedAt: timestamp("marked_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("attendance_records_session_student_unique").on(table.sessionId, table.studentId),
    index("attendance_records_student_marked_idx").on(table.studentId, table.markedAt),
  ],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Subject = typeof subjects.$inferSelect;
export type ClassSession = typeof classSessions.$inferSelect;
export type AttendanceRecord = typeof attendanceRecords.$inferSelect;
