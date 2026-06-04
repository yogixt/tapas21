import { createClient } from "@libsql/client";

async function main() {
  const client = createClient({
    url: process.env.TURSO_DB_URL || "file:./data/sqlite.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      telegram_chat_id TEXT DEFAULT NULL,
      telegram_code TEXT DEFAULT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  await client.execute(`
    ALTER TABLE users ADD COLUMN telegram_chat_id TEXT DEFAULT NULL
  `).catch(() => {});

  await client.execute(`
    ALTER TABLE users ADD COLUMN telegram_code TEXT DEFAULT NULL
  `).catch(() => {});

  await client.execute(`
    ALTER TABLE users ADD COLUMN notify_morning INTEGER DEFAULT 1
  `).catch(() => {});
  await client.execute(`
    ALTER TABLE users ADD COLUMN notify_study INTEGER DEFAULT 1
  `).catch(() => {});
  await client.execute(`
    ALTER TABLE users ADD COLUMN notify_walk INTEGER DEFAULT 0
  `).catch(() => {});
  await client.execute(`
    ALTER TABLE users ADD COLUMN notify_reflection INTEGER DEFAULT 1
  `).catch(() => {});
  await client.execute(`
    ALTER TABLE users ADD COLUMN notify_no_junk_food INTEGER DEFAULT 1
  `).catch(() => {});
  await client.execute(`
    ALTER TABLE users ADD COLUMN notify_yogic_life INTEGER DEFAULT 1
  `).catch(() => {});
  await client.execute(`
    ALTER TABLE users ADD COLUMN bot_history TEXT DEFAULT '[]'
  `).catch(() => {});

  await client.execute(`
    CREATE TABLE IF NOT EXISTS daily_entries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      date TEXT NOT NULL,
      wake_up_5am INTEGER DEFAULT 0,
      yoga_pranayama INTEGER DEFAULT 0,
      study_hours REAL DEFAULT 0,
      walk_swim INTEGER DEFAULT 0,
      calories_under_target INTEGER DEFAULT 0,
      protein_goal_hit INTEGER DEFAULT 0,
      sleep_before_1030pm INTEGER DEFAULT 0,
      actual_calories INTEGER DEFAULT 0,
      actual_protein REAL DEFAULT 0,
      actual_water_l REAL DEFAULT 0,
      notes TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS weight_records (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      date TEXT NOT NULL,
      weight_kg REAL NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  console.log("Database migrated successfully.");
  client.close();
}

main();
