import { users, type User, type InsertUser, professionals, type Professional, type InsertProfessional } from "@shared/schema";
import { db } from "./db";
import { eq, like, or } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

// Modify the interface with CRUD methods for professionals
export interface IStorage {
  // Original user methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Professional methods
  getProfessionals(): Promise<Professional[]>;
  searchProfessionals(searchTerm: string): Promise<Professional[]>;
  createProfessional(professional: InsertProfessional): Promise<Professional>;
  updateProfessional(id: number, professional: Partial<InsertProfessional>): Promise<Professional | undefined>;
  deleteProfessional(id: number): Promise<boolean>;
  
  // Session store for authentication
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    const PostgresSessionStore = connectPg(session);
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true,
      tableName: 'user_sessions'
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Professional methods
  async getProfessionals(): Promise<Professional[]> {
    return db.select().from(professionals);
  }

  async searchProfessionals(searchTerm: string): Promise<Professional[]> {
    if (!searchTerm) {
      return this.getProfessionals();
    }
    
    return db.select()
      .from(professionals)
      .where(
        or(
          like(professionals.fullName, `%${searchTerm}%`),
          like(professionals.phoneNumber, `%${searchTerm}%`)
        )
      );
  }

  async createProfessional(insertProfessional: InsertProfessional): Promise<Professional> {
    const [professional] = await db.insert(professionals).values(insertProfessional).returning();
    return professional;
  }

  async updateProfessional(id: number, updateData: Partial<InsertProfessional>): Promise<Professional | undefined> {
    const [professional] = await db
      .update(professionals)
      .set(updateData)
      .where(eq(professionals.id, id))
      .returning();
    
    return professional;
  }

  async deleteProfessional(id: number): Promise<boolean> {
    const result = await db
      .delete(professionals)
      .where(eq(professionals.id, id))
      .returning();
    
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
