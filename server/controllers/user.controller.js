const { User } = require("../models");

/** @typedef {import("../models/user.model").UserDoc} UserDoc */
/** @typedef {import("express").Request} Context */

/**
 * Create a user in the database with the given information
 *
 * @param {import("../graphql/resolvers.gen").NewUserInput} accountData
 * @param {(password: string) => Promise<string>} hashFn function to hash the password
 * @returns {Promise<UserDoc | null>}
 * Mongoose document of the created user, or null if the email already exists
 */
module.exports.createUser = async (accountData, hashFn) => {
  const existing = await User.findOne({ email: accountData.email })
    .select({ _id: 1 })
    .lean();
  if (existing) return null;
  accountData.password = await hashFn(accountData.password);
  return new User(accountData).save();
};

/**
 * Get the healthcare provider (nurse) of a user
 *
 * The return value should be null if
 * 1. the requesting user is not logged in
 * 2. the given user is not a patient
 * 3. the given user does not have the provider assigned yet
 *    (i.e., the field is null)
 *
 * @param {UserDoc} user
 * @param {Context} context
 * @returns {Promise<UserDoc | null>}
 */
module.exports.getProvider = async (user, context) => {
  // Case 1
  if (!context.user) return null;

  // Case 2
  if (user.role !== "PATIENT") return null;

  // Case 3
  if (!user.provider) return null;

  return User.findById(user.provider);
};

/**
 * Get a list of patients whose provider is the requesting user
 *
 * The return value should be null if
 * 1. the requesting user is not logged in
 * 2. the requesting user is not a nurse
 *
 * @param {Context} context
 * @returns {Promise<UserDoc[] | null>}
 */
module.exports.myPatients = async (context) => {
  // Case 1
  if (!context.user) return null;

  // Case 2
  if (context.user.role !== "NURSE") return null;

  return User.find({ provider: context.user._id });
};
