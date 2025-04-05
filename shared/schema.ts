import { pgTable, text, serial, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Original users table - keeping for reference
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Professional registration table
export const professionals = pgTable("professionals", {
  id: serial("id").primaryKey(),
  trackingNumber: text("tracking_number").notNull(),
  fullName: text("full_name").notNull(),
  gender: text("gender").notNull(),
  dateOfRegistration: date("date_of_registration").notNull(),
  phoneNumber: text("phone_number").notNull(),
  professionalTitle: text("professional_title").notNull(),
  professionalNumber: text("professional_number").notNull(),
  sector: text("sector").notNull(),
  serviceType: text("service_type").notNull(),
});

export const insertProfessionalSchema = createInsertSchema(professionals).omit({
  id: true,
});

export const professionalSearchSchema = z.object({
  searchTerm: z.string().optional(),
});

export type InsertProfessional = z.infer<typeof insertProfessionalSchema>;
export type Professional = typeof professionals.$inferSelect;
