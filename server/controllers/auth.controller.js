const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtSecret, jwtDuration } = require("../config");
const { User } = require("../models");
const { createUser } = require("./user.controller");

/**
 * @typedef {object} AdditionalPayload
 * @property {string} id stringified `ObjectId` of the user
 */

/**
 * @typedef {jwt.JwtPayload & AdditionalPayload} Payload
 */

/**
 * Create and sign a jwt
 *
 * This wraps {@link jwt.sign} function to utilise {@link Promise Promises}.
 *
 * @param {AdditionalPayload} payload information to include in jwt
 * @returns {Promise<string>} signed token
 */
const signJwt = (payload) =>
  new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: jwtDuration },
      (error, encoded) => {
        if (error ?? !encoded) {
          // Error occurred or the token is empty
          // Practically, the token cannot be empty if there isn't an error, but
          // it's just to get around a false type error due to a careless type
          // declaration of the module.
          reject(error ?? new Error("Failed to sign a JWT"));
        } else {
          // Token issued
          resolve(encoded);
        }
      }
    );
  });

/**
 * Decode and validate a jwt
 *
 * This wraps {@link jwt.verity} function to utilise {@link Promise Promises}.
 *
 * @param {string} token
 * @returns {Promise<AdditionalPayload | null>} payload if valid, null if not
 */
const verifyJwt = (token) =>
  // Here, we do not call `reject` at all because in case of invalid token, we
  // just want to notify the result by returning null.
  new Promise((resolve) => {
    jwt.verify(token, jwtSecret, {}, (error, decoded) => {
      resolve(
        error || !decoded || typeof decoded === "string"
          ? null
          : !decoded.id || typeof decoded.id !== "string"
          ? null
          : { id: decoded.id }
      );
    });
  });

/**
 * Hash the password
 *
 * @param {string} password
 * @returns {Promise<string>} hashed password
 */
const hashPassword = (password) => bcrypt.hash(password, 10);

/** @typedef {import("../graphql/resolvers.gen").ResolversParentTypes["AuthOutput"]} AuthOutput */

/**
 * Check the credentials and sign a jwt if valid
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<AuthOutput | null>}
 */
const authenticate = async (email, password) => {
  // Does the user with the email exist?
  const user = await User.findOne({ email });
  if (!user) {
    return null;
  }

  // Does the password match?
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return null;
  }

  // Issue a token
  const token = await signJwt({ id: user._id.toHexString() });
  return { user, token };
};

/**
 * Register a user
 *
 * @param {import("../graphql/resolvers.gen").NewUserInput} accountData
 * @returns {Promise<AuthOutput | null>}
 */
const register = async (accountData) => {
  const user = await createUser(accountData, hashPassword);
  if (!user) return null;
  const token = await signJwt({ id: user._id.toHexString() });
  return { user, token };
};

/**
 * Express middleware that checks the `Authorization` header for jwt and store
 * the user info to the request object if it contains a valid data for the user
 *
 * @type {import("express").RequestHandler}
 */
const parseUserMiddleware = async (request, response, next) => {
  // Set the default value
  request.user = null;

  // Get the header and check if it starts with correct keyword
  const authHeader = request.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  // Get the token value and try to parse the data
  const token = authHeader.substring("Bearer ".length);
  const payload = await verifyJwt(token);
  if (!payload) {
    return next();
  }

  // Check if we have the user with that id
  const user = await User.findById(payload.id);
  if (user) {
    request.user = user;
  }

  // Invoke next handlers
  next();
};

module.exports = {
  authenticate,
  register,
  parseUserMiddleware,
};
