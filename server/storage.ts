import { db } from "./db";
import { designs, users, type InsertDesign, type Design, type User } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getOrCreateUserByReplitId(replitId: string, username: string): Promise<User>;
  createDesign(userId: string | undefined, design: InsertDesign): Promise<Design>;
  getDesigns(userId?: string): Promise<Design[]>;
  getDesign(id: number): Promise<Design | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getOrCreateUserByReplitId(replitId: string, username: string): Promise<User> {
    const [existing] = await db.select().from(users).where(eq(users.id, replitId));
    if (existing) return existing;
    
    const [newUser] = await db.insert(users).values({ 
      id: replitId,
      email: username.includes("@") ? username : undefined,
      firstName: username.split(" ")[0],
      lastName: username.split(" ")[1] || "",
    }).returning();
    return newUser;
  }

  async createDesign(userId: string | undefined, design: InsertDesign): Promise<Design> {
    const [newDesign] = await db
      .insert(designs)
      .values({ ...design, userId })
      .returning();
    return newDesign;
  }

  async getDesigns(userId?: string): Promise<Design[]> {
    if (userId) {
      return await db.select().from(designs).where(eq(designs.userId, userId)).orderBy(desc(designs.createdAt));
    }
    return await db.select().from(designs).orderBy(desc(designs.createdAt));
  }

  async getDesign(id: number): Promise<Design | undefined> {
    const [design] = await db.select().from(designs).where(eq(designs.id, id));
    return design;
  }
}

export const storage = new DatabaseStorage();
