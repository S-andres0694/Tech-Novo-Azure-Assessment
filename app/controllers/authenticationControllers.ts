import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { UserModel } from "~/model/UsersModel";

/**
 * Class that abstracts over the authentication process by simplifying the creation of users and the verification of their credentials.
 */

export class Authenticator {
  private db: NodePgDatabase;
  private userModel: UserModel;

  constructor(dbConnection: NodePgDatabase) {
    this.db = dbConnection;
    this.userModel = new UserModel(this.db);
  }

  /**
   * Creates a new user in the database.
   * @param userInformation The user information to create.
   * @returns True if the user was created successfully, false otherwise.
   */

  public async registerUser(
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> {
    const operationResult: boolean = await this.userModel.createUser(
      name,
      email,
      password,
    );
    const messageResult: () => string = () => {
      if (operationResult) {
        return `User \`${name}\` with email \`${email}\` created successfully`;
      }
      return `User creation failed`;
    };
    console.log(messageResult());
    return operationResult;
  }

  /**
   * Checks the credentials of a user to determine if they are valid.
   * @param email The email of the user to login.
   * @param password The password of the user to login.
   * @returns True if the credentials are valid, false if the credentials are invalid, or null if the user does not exist.
   */

  public async loginUser(
    email: string,
    password: string,
  ): Promise<boolean | null> {
    const credentialsResult: boolean | null =
      await this.userModel.areCredentialsValid(email, password);

    const messageResult: () => string = () => {
      if (credentialsResult === null) {
        return `User with email \`${email}\` does not exist`;
      }

      if (!credentialsResult) {
        return `User with email \`${email}\` has provided an invalid password`;
      }

      return `User with email \`${email}\` logged in successfully`;
    };

    console.log(messageResult());
    return credentialsResult;
  }
}
