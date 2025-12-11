import * as SQLite from 'expo-sqlite';
import { SCHEMA_VERSION, MIGRATIONS } from './schema';

const DATABASE_NAME = 'hackernews.db';

class Database {
  private db: SQLite.SQLiteDatabase | null = null;
  private initialized: boolean = false;

  /**
   * Initialize the database and run migrations
   */
  async init(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Open database connection
      this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      console.log('Database opened successfully');

      // Enable foreign keys
      await this.db.execAsync('PRAGMA foreign_keys = ON;');

      // Get current schema version
      const currentVersion = await this.getSchemaVersion();
      console.log(`Current schema version: ${currentVersion}`);

      // Run migrations if needed
      if (currentVersion < SCHEMA_VERSION) {
        await this.runMigrations(currentVersion);
      }

      this.initialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  /**
   * Get the current schema version from the database
   */
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
      console.error('Error getting schema version:', error);
      return 0;
    }
  }

  /**
   * Set the schema version in the database
   */
  private async setSchemaVersion(version: number): Promise<void> {
    if (!this.db) {
      throw new Error('Database not opened');
    }

    await this.db.execAsync(`PRAGMA user_version = ${version};`);
  }

  /**
   * Run database migrations
   */
  private async runMigrations(fromVersion: number): Promise<void> {
    if (!this.db) {
      throw new Error('Database not opened');
    }

    console.log(`Running migrations from version ${fromVersion} to ${SCHEMA_VERSION}`);

    try {
      // Start transaction
      await this.db.execAsync('BEGIN TRANSACTION;');

      // Run each migration in sequence
      for (const migration of MIGRATIONS) {
        if (migration.version > fromVersion && migration.version <= SCHEMA_VERSION) {
          console.log(`Applying migration ${migration.version}`);

          for (const statement of migration.up) {
            await this.db.execAsync(statement);
          }
        }
      }

      // Update schema version
      await this.setSchemaVersion(SCHEMA_VERSION);

      // Commit transaction
      await this.db.execAsync('COMMIT;');
      console.log('Migrations completed successfully');
    } catch (error) {
      // Rollback on error
      await this.db.execAsync('ROLLBACK;');
      console.error('Migration failed, rolled back:', error);
      throw error;
    }
  }

  /**
   * Get the database instance
   */
  getDatabase(): SQLite.SQLiteDatabase {
    if (!this.db || !this.initialized) {
      throw new Error('Database not initialized. Call init() first.');
    }
    return this.db;
  }

  /**
   * Execute a SQL statement
   */
  async exec(sql: string, params?: unknown[]): Promise<void> {
    const db = this.getDatabase();
    await db.runAsync(sql, params);
  }

  /**
   * Execute multiple SQL statements in a transaction
   */
  async transaction(statements: { sql: string; params?: unknown[] }[]): Promise<void> {
    const db = this.getDatabase();

    try {
      await db.execAsync('BEGIN TRANSACTION;');

      for (const { sql, params } of statements) {
        await db.runAsync(sql, params);
      }

      await db.execAsync('COMMIT;');
    } catch (error) {
      await db.execAsync('ROLLBACK;');
      throw error;
    }
  }

  /**
   * Run a SELECT query and return all results
   */
  async getAll<T>(sql: string, params?: unknown[]): Promise<T[]> {
    const db = this.getDatabase();
    return await db.getAllAsync<T>(sql, params);
  }

  /**
   * Run a SELECT query and return the first result
   */
  async getFirst<T>(sql: string, params?: unknown[]): Promise<T | null> {
    const db = this.getDatabase();
    return await db.getFirstAsync<T>(sql, params);
  }

  /**
   * Run an INSERT/UPDATE/DELETE query
   */
  async run(sql: string, params?: unknown[]): Promise<SQLite.SQLiteRunResult> {
    const db = this.getDatabase();
    return await db.runAsync(sql, params);
  }

  /**
   * Close the database connection
   */
  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
      this.initialized = false;
      console.log('Database closed');
    }
  }

  /**
   * Delete the database (for testing or reset)
   */
  async deleteDatabase(): Promise<void> {
    await this.close();
    await SQLite.deleteDatabaseAsync(DATABASE_NAME);
    console.log('Database deleted');
  }

  /**
   * Vacuum the database to reclaim space
   */
  async vacuum(): Promise<void> {
    const db = this.getDatabase();
    await db.execAsync('VACUUM;');
    console.log('Database vacuumed');
  }

  /**
   * Get database file size (approximation)
   */
  async getSize(): Promise<number> {
    const db = this.getDatabase();

    // Get page count and page size
    const pageCount = await db.getFirstAsync<{ page_count: number }>('PRAGMA page_count;');
    const pageSize = await db.getFirstAsync<{ page_size: number }>('PRAGMA page_size;');

    if (pageCount && pageSize) {
      return pageCount.page_count * pageSize.page_size;
    }

    return 0;
  }

  /**
   * Check if database is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }
}

// Export singleton instance
export const database = new Database();
