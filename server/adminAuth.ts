import bcrypt from "bcryptjs";
import { storage } from "./storage";
import type { Request, Response, NextFunction } from "express";

// Session interface for admin users
declare module 'express-session' {
  interface SessionData {
    adminUser?: {
      id: number;
      username: string;
      email?: string;
    };
  }
}

export async function loginAdmin(username: string, password: string) {
  const user = await storage.getAdminUserByUsername(username);
  
  if (!user || !user.isActive) {
    return null;
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    return null;
  }

  // Update last login
  await storage.updateAdminUserLastLogin(user.id);

  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
}

export async function createAdminUser(username: string, password: string, email?: string) {
  const existingUser = await storage.getAdminUserByUsername(username);
  if (existingUser) {
    throw new Error("Username already exists");
  }

  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  return await storage.createAdminUser({
    username,
    passwordHash,
    email,
    isActive: true,
  });
}

export const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.adminUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

export const getCurrentAdmin = (req: Request) => {
  return req.session.adminUser || null;
};