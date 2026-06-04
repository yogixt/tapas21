import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  telegramChatId: text("telegram_chat_id"),
  telegramCode: text("telegram_code"),
  notifyMorning: integer("notify_morning", { mode: "boolean" }).default(true),
  notifyStudy: integer("notify_study", { mode: "boolean" }).default(true),
  notifyWalk: integer("notify_walk", { mode: "boolean" }).default(false),
  notifyReflection: integer("notify_reflection", { mode: "boolean" }).default(true),
  notifyNoJunkFood: integer("notify_no_junk_food", { mode: "boolean" }).default(true),
  notifyYogicLife: integer("notify_yogic_life", { mode: "boolean" }).default(true),
  botHistory: text("bot_history").default("[]"),
  resetCode: text("reset_code"),
  resetCodeExpiresAt: text("reset_code_expires_at"),
  createdAt: text("created_at").notNull().default("(datetime('now'))"),
});

export const dailyEntries = sqliteTable("daily_entries", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  date: text("date").notNull(),
  wakeUp5am: integer("wake_up_5am", { mode: "boolean" }).default(false),
  yogaPranayama: integer("yoga_pranayama", { mode: "boolean" }).default(false),
  studyHours: real("study_hours").default(0),
  walkSwim: integer("walk_swim", { mode: "boolean" }).default(false),
  caloriesUnderTarget: integer("calories_under_target", { mode: "boolean" }).default(false),
  proteinGoalHit: integer("protein_goal_hit", { mode: "boolean" }).default(false),
  sleepBefore1030pm: integer("sleep_before_1030pm", { mode: "boolean" }).default(false),
  actualCalories: integer("actual_calories").default(0),
  actualProtein: real("actual_protein").default(0),
  actualWaterL: real("actual_water_l").default(0),
  notes: text("notes").default(""),
  createdAt: text("created_at").notNull().default("(datetime('now'))"),
});

export const weightRecords = sqliteTable("weight_records", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  date: text("date").notNull(),
  weightKg: real("weight_kg").notNull(),
  createdAt: text("created_at").notNull().default("(datetime('now'))"),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type DailyEntry = typeof dailyEntries.$inferSelect;
export type NewDailyEntry = typeof dailyEntries.$inferInsert;
export type WeightRecord = typeof weightRecords.$inferSelect;
export type NewWeightRecord = typeof weightRecords.$inferInsert;
