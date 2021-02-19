import Joi from "@hapi/joi";
import { User } from "../../models";
import bcrypt from "bcryptjs";
import { registerRules, loginRules } from "../validators";
import {
  issueToken,
  getAuthUser,
  getRefreshTokenUser,
} from "../../functions/auth";

export default {
  Query: {
    // Return user list
    users: async (root, args, { req }, info) => {
      await getAuthUser(req, true);
      let users = await User.find();
      return users;
    },
    // login resolver
    login: async (root, args, { req }, info) => {
      let validationResult = await loginRules.validate(args, {
        abortEarly: true,
      });

      if (validationResult.error) throw new Error(validationResult.error);

      // Check if the user in in the db with the username or not
      let user = await User.findOne({ username: args.username });

      if (!user) throw new Error("Username not found.");

      // Compare password
      let isMatch = await bcrypt.compare(args.password, user.password);

      if (!isMatch) throw new Error("Invalid password");

      // Issue the token and refresh token
      let tokens = await issueToken(user);

      return {
        user,
        ...tokens,
      };
    },
    // Protected resolver
    profile: async (root, args, { req }, info) => {
      let authUser = await getAuthUser(req, true);
      return authUser;
    },
    // Refresh Token Mechanism
    refreshToken: async (root, args, { req }, info) => {
      let authUser = await getRefreshTokenUser(req, true);

      let tokens = await issueToken(authUser);

      return {
        user: authUser,
        ...tokens,
      };
    },
  },
  Mutation: {
    // Register resolver
    register: async (root, args, { req }, info) => {
      // Validate the User Data
      let validationResult = await registerRules.validate(args, {
        abortEarly: false,
      });

      if (validationResult.error) throw new Error(validationResult.error);

      // Check if the user is already in the DB with the same username
      let user = await User.findOne({ username: args.username });

      if (user) throw new Error("Username is already taken.");

      user = await User.findOne({ email: args.email });

      if (user) throw new Error("Email is already registered.");

      // That means user registration is valid
      args.password = await bcrypt.hash(args.password, 10);
      let newUser = await User.create(args);
      let tokens = await issueToken(newUser);

      return {
        user: newUser,
        ...tokens,
      };
    },
  },
};
