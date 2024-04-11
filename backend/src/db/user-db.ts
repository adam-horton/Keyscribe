import bcrypt from 'bcrypt';
import { queryPool } from './db-setup';

/**
 * Ensures that user credentials is correct
 * @param username Username of the user
 * @param password Password of the user
 * @returns True if user exists in database
 */
const validateLogin = async (username: string, password: string): Promise<Express.User | null> => {
  const query = 'SELECT username, emailaddress, user_id, password FROM users WHERE username = $1 LIMIT 1';

  const result = await queryPool(query, [username]);

  if (result.rows.length === 0) {
    return null;
  }

  const hashedPassword = result.rows[0].password;
  const isValid = await bcrypt.compare(password, hashedPassword);
  if (isValid) {
    // Password matches
    return {
      username: result.rows[0].username,
      email: result.rows[0].emailaddress,
      id: result.rows[0].user_id,
    };
  }

  return null;
};

/**
 * Adds a user to the database. First checks if user exists
 * @param user
 * @param password
 * @param email Used for password retrieval purposes
 * @param firstName
 * @param lastName
 * @returns True if user account creation was successful
 */
const createAccount = async (user: string, password: string, email: string, firstName: string, lastName: string) => {
  const checkUser = `
    SELECT EXISTS (
      SELECT 1
      FROM users
      WHERE username = $1
      AND emailAddress = $2
    )
  `;
  const userExists = await queryPool(checkUser, [user, email]);
  const { exists } = userExists.rows[0];
  if (exists) {
    return false; // User already exists in database
  }

  // Create an account for the user
  // Hash the password
  const salt = await bcrypt.genSalt(11);
  const hashedPassword = await bcrypt.hash(password, salt);
  const insert = `
      INSERT INTO Users (username, password, firstname, lastname, emailaddress, user_id) VALUES 
      ($1, $2, $3, $4, $5, gen_random_uuid())
      RETURNING user_id
    `;

  const result = await queryPool(insert, [user, hashedPassword, firstName, lastName, email]);
  return result.rows.length === 1;
};

const getUserById = async (id: string): Promise<Express.User | null> => {
  const query = 'SELECT username, emailaddress FROM users WHERE user_id = $1';

  const result = await queryPool(query, [id]);

  if (result.rows.length === 0) {
    return null;
  }
  return {
    username: result.rows[0].username,
    email: result.rows[0].emailaddress,
    id,
  };
};

const getInfo = async (id: string): Promise<any> => {
  const query = 'SELECT firstname, lastname, username, emailaddress FROM users WHERE user_id = $1';

  const result = await queryPool(query, [id]);

  if (result.rows.length === 0) {
    return '';
  }

  return {
    first: result.rows[0].firstname,
    last: result.rows[0].lastname,
    user: result.rows[0].username,
    email: result.rows[0].emailaddress,
  };
};

export {
  validateLogin,
  createAccount,
  getUserById,
  getInfo,
};
