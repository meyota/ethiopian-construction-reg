import { users, type User, type InsertUser, professionals, type Professional, type InsertProfessional } from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private professionals: Map<number, Professional>;
  private userCurrentId: number;
  private professionalCurrentId: number;

  constructor() {
    this.users = new Map();
    this.professionals = new Map();
    this.userCurrentId = 1;
    this.professionalCurrentId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Professional methods
  async getProfessionals(): Promise<Professional[]> {
    return Array.from(this.professionals.values());
  }

  async searchProfessionals(searchTerm: string): Promise<Professional[]> {
    if (!searchTerm) {
      return this.getProfessionals();
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return Array.from(this.professionals.values()).filter(
      (professional) => 
        professional.fullName.toLowerCase().includes(lowerSearchTerm) || 
        professional.phoneNumber.toLowerCase().includes(lowerSearchTerm)
    );
  }

  async createProfessional(insertProfessional: InsertProfessional): Promise<Professional> {
    const id = this.professionalCurrentId++;
    const professional: Professional = { ...insertProfessional, id };
    this.professionals.set(id, professional);
    return professional;
  }

  async updateProfessional(id: number, updateData: Partial<InsertProfessional>): Promise<Professional | undefined> {
    const professional = this.professionals.get(id);
    if (!professional) {
      return undefined;
    }

    const updatedProfessional: Professional = { ...professional, ...updateData };
    this.professionals.set(id, updatedProfessional);
    return updatedProfessional;
  }

  async deleteProfessional(id: number): Promise<boolean> {
    return this.professionals.delete(id);
  }
}

export const storage = new MemStorage();
