import Database from 'better-sqlite3';
import path from 'path';
import { randomBytes } from 'crypto';

const dbPath = path.join(process.cwd(), 'stockflow.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
function initDB() {
    db.exec(`
    CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      passwordHash TEXT NOT NULL,
      organizationId TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      FOREIGN KEY (organizationId) REFERENCES organizations(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      organizationId TEXT NOT NULL,
      name TEXT NOT NULL,
      sku TEXT NOT NULL,
      description TEXT,
      quantityOnHand INTEGER NOT NULL DEFAULT 0,
      costPrice REAL,
      sellingPrice REAL,
      lowStockThreshold INTEGER,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      FOREIGN KEY (organizationId) REFERENCES organizations(id) ON DELETE CASCADE,
      UNIQUE(organizationId, sku)
    );

    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY,
      organizationId TEXT NOT NULL UNIQUE,
      defaultLowStockThreshold INTEGER NOT NULL DEFAULT 5,
      updatedAt INTEGER NOT NULL,
      FOREIGN KEY (organizationId) REFERENCES organizations(id) ON DELETE CASCADE
    );
  `);
}

// Initialize on first import
initDB();

// Helper to generate ID
export function generateId(): string {
    return randomBytes(16).toString('hex');
}

// Helper to get current timestamp
export function now(): number {
    return Date.now();
}

export default db;
