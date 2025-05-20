import type { User, UserRegistration, UserIdentifier } from "~/types/authTypes";
import { createHash } from "crypto";
import { users } from "~/database/schema";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { CONSTANTS } from "~/database/schema";
import { eq } from "drizzle-orm";

export class UserModel {
  private db: NodePgDatabase;
  constructor(db: NodePgDatabase) {
    this.db = db;
  }

  /**
   * Creates a new user in the database.
   * @param name The name of the user to create.
   * @param email The email of the user to create.
   * @param password The password of the user to create.
   * @returns True if the user was created successfully, false otherwise.
   */

  public async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> {
    if (name.length > CONSTANTS.MAX_USERS_NAME_LENGTH || name.length < 1) {
      return false; // Name is too long.
    }
    if (email.length > CONSTANTS.MAX_USERS_EMAIL_LENGTH || email.length < 1) {
      return false; // Email is too long.
    }
    if (
      password.length > CONSTANTS.MAX_USERS_PASSWORD_LENGTH ||
      password.length < 1
    ) {
      return false; // Password is too long.
    }

    const user: UserRegistration = {
      id: parseInt(
        createHash("sha256")
          .update(name + email + password)
          .digest("hex"),
        16,
      ), //Generate a unique id for each user.
      name: name,
      email: email,
      password: createHash("sha256").update(password).digest("hex"), // Encrypt the password.
    } satisfies UserRegistration;

    await this.db.transaction(async (transaction) => {
      try {
        await transaction.insert(users).values(user);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        }
        transaction.rollback(); // Rollback the transaction if an error occurs.
        return false;
      }
    });
    return true;
  }

  /**
   * Gets a user from the database.
   * @param userIdentifier The identifier of the user to get, which can be an email or an id.
   * @returns The user if found, null otherwise.
   */

  public async getUser(userIdentifier: UserIdentifier): Promise<User | null> {
    if (!userIdentifier.email && !userIdentifier.id) {
      return null;
    }

    try {
      if (userIdentifier.email) {
        const user: User[] = await this.db
          .select()
          .from(users)
          .where(eq(users.email, userIdentifier.email))
          .limit(1);
        return user[0] ?? null;
      }

      if (userIdentifier.id) {
        const user: User[] = await this.db
          .select()
          .from(users)
          .where(eq(users.id, userIdentifier.id))
          .limit(1);
        return user[0] ?? null;
      }

      return null;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      return null;
    }
  }

  /**
   * Checks the credentials of a user to determine if they are valid.
   * @param email The email of the user to login.
   * @param password The password of the user to login.
   * @returns True if the credentials are valid, false if the credentials are invalid, or null if the user does not exist.
   */

  public async areCredentialsValid(
    email: string,
    password: string,
  ): Promise<boolean | null> {
    const user: User | null = await this.getUser({ email: email });

    if (!user) {
      // No user found with the given email.
      return null;
    }

    if (user.password !== createHash("sha256").update(password).digest("hex")) {
      // The password is incorrect.
      return false;
    }

    return true;
  }
}
