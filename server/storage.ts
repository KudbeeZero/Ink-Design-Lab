import { db } from "./db";
import { designs, type InsertDesign, type Design } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createDesign(design: InsertDesign): Promise<Design>;
  getDesigns(): Promise<Design[]>;
  getDesign(id: number): Promise<Design | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createDesign(design: InsertDesign): Promise<Design> {
    const [newDesign] = await db
      .insert(designs)
      .values(design)
      .returning();
    return newDesign;
  }

  async getDesigns(): Promise<Design[]> {
    return await db.select().from(designs).orderBy(desc(designs.createdAt));
  }

  async getDesign(id: number): Promise<Design | undefined> {
    const [design] = await db.select().from(designs).where(eq(designs.id, id));
    return design;
  }
}

export const storage = new DatabaseStorage();
