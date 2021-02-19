import jwt from "jsonwebtoken";
import { User } from "../models";
import { APP_REFRESH_SECRET, APP_SECRET } from "../config";
import user from "../graphql/typeDefs/user";

export const issueToken = async ({ username, email, name, id }) => {
  let token = await jwt.sign({ username, email, name, id }, APP_SECRET, {
    expiresIn: 120,
    // two minutes, 120 seconds
  });

  let refreshToken = await jwt.sign(
    { username, email, name, id },
    APP_REFRESH_SECRET,
    {
      expiresIn: "2d",
    }
  );

  return {
    token,
    refreshToken,
  };
};

export const getAuthUser = async (request, requiresAuth = false) => {
  const header = request.headers.authorization;
  if (header) {
    const token = jwt.verify(header, APP_SECRET);

    let authUser = await User.findById(token.id);

    if (!authUser)
      throw new Error("Invalid token, User Authentication failed.");

    if (requiresAuth) return authUser;

    return null;
  }
};

export const getRefreshTokenUser = async (request) => {
  const header = request.headers.refresh_token;
  if (header) {
    const token = jwt.verify(header, APP_REFRESH_SECRET);

    let authUser = await User.findById(token.id);

    if (!authUser)
      throw new Error("Invalid refresh token, User Authentication failed.");

    return authUser;
  }
};
