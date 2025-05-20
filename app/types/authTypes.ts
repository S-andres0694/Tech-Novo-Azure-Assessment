// User object at the time of registration
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  festivalsIDs: string[];
};

// User object at the time of login
export type UserLogin = {
  email: string;
  password: string;
};
