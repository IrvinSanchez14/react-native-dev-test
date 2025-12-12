import * as SQLite from 'expo-sqlite';
import { SCHEMA_VERSION, MIGRATIONS } from './schema';

const DATABASE_NAME = 'hackernews.db';

class Database {
  private db: SQLite.SQLiteDatabase | null = null;
  private initialized: boolean = false;

  async init(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);

      await this.db.execAsync('PRAGMA foreign_keys = ON;');

      const currentVersion = await this.getSchemaVersion();


      if (currentVersion < SCHEMA_VERSION) {
        await this.runMigrations(currentVersion);
      }

      this.initialized = true;
    } catch (error) {
      throw error;
    }
  }

  private async getSchemaVersion(): Promise<number> {
    if (!this.db) {
      throw new Error('Database not opened');
    }

    try {
      const result = await this.db.getFirstAsync<{ user_version: number }>(
        'PRAGMA user_version;'
      );
      return result?.user_version || 0;
    } catch (error) {
      return 0;
    }
  }

  private async setSchemaVersion(version: number): Promise<void> {
    if (!this.db) {
      throw new Error('Database not opened');
    }

    await this.db.execAsync(`PRAGMA user_version = ${version};`);
  }

  private async runMigrations(fromVersion: number): Promise<void> {
    if (!this.db) {
      throw new Error('Database not opened');
    }

    try {

      await this.db.execAsync('BEGIN TRANSACTION;');


      for (const migration of MIGRATIONS) {
        if (migration.version > fromVersion && migration.version <= SCHEMA_VERSION) {
          for (const statement of migration.up) {
            await this.db.execAsync(statement);
          }
        }
      }

      await this.setSchemaVersion(SCHEMA_VERSION);

      await this.db.execAsync('COMMIT;');
    } catch (error) {
      await this.db.execAsync('ROLLBACK;');
      throw error;
    }
  }

  getDatabase(): SQLite.SQLiteDatabase {
    if (!this.db || !this.initialized) {
      throw new Error('Database not initialized. Call init() first.');
    }
    return this.db;
  }

  async exec(sql: string, params?: unknown[]): Promise<void> {
    const db = this.getDatabase();
    if (params) {
      await db.runAsync(sql, params as SQLite.SQLiteBindParams);
    } else {
      await db.runAsync(sql);
    }
  }

  async transaction(statements: { sql: string; params?: unknown[] }[]): Promise<void> {
    const db = this.getDatabase();

    try {
      await db.execAsync('BEGIN TRANSACTION;');

      for (const { sql, params } of statements) {
        if (params) {
          await db.runAsync(sql, params as SQLite.SQLiteBindParams);
        } else {
          await db.runAsync(sql);
        }
      }

      await db.execAsync('COMMIT;');
    } catch (error) {
      await db.execAsync('ROLLBACK;');
      throw error;
    }
  }

  async getAll<T>(sql: string, params?: unknown[]): Promise<T[]> {
    const db = this.getDatabase();
    if (params) {
      return await db.getAllAsync<T>(sql, params as SQLite.SQLiteBindParams);
    } else {
      return await db.getAllAsync<T>(sql);
    }
  }

  async getFirst<T>(sql: string, params?: unknown[]): Promise<T | null> {
    const db = this.getDatabase();
    if (params) {
      return await db.getFirstAsync<T>(sql, params as SQLite.SQLiteBindParams);
    } else {
      return await db.getFirstAsync<T>(sql);
    }
  }

  async run(sql: string, params?: unknown[]): Promise<SQLite.SQLiteRunResult> {
    const db = this.getDatabase();
    if (params) {
      return await db.runAsync(sql, params as any);
    } else {
      return await db.runAsync(sql);
    }
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
      this.initialized = false;
    }
  }

  async deleteDatabase(): Promise<void> {
    await this.close();
    await SQLite.deleteDatabaseAsync(DATABASE_NAME);
  }

  async vacuum(): Promise<void> {
    const db = this.getDatabase();
    await db.execAsync('VACUUM;');
  }

  async getSize(): Promise<number> {
    const db = this.getDatabase();


    const pageCount = await db.getFirstAsync<{ page_count: number }>('PRAGMA page_count;');
    const pageSize = await db.getFirstAsync<{ page_size: number }>('PRAGMA page_size;');

    if (pageCount && pageSize) {
      return pageCount.page_count * pageSize.page_size;
    }

    return 0;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}


export const database = new Database();
