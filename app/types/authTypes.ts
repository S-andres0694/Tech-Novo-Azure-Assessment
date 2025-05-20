import { users } from "~/database/schema";

// User object at the time of registration
export type User = typeof users.$inferSelect;

// User object at the time of login
export type UserLogin = {
  email: string;
  password: string;
};
