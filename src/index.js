import express from "express";
import consola from "consola";
import mongoose from "mongoose";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import { ApolloServer } from "apollo-server-express";

import { DB, IN_PROD, APP_PORT } from "./config";

// Initialize the App
const app = express();

// Setting up the middleware
app.disable("x-powered-by");

// Starting Apollo-Express-Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (a) => a,
  playground: IN_PROD
    ? false
    : {
        settings: {
          "request.credentials": "include",
        },
      },
});

// Start Application Function
const startApp = async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    consola.success({
      message: `Successfully connecred with the database ${DB}`,
    });

    server.applyMiddleware({ app, cors: false });

    app.listen({ port: APP_PORT }, () => {
      consola.success({
        message: `Apollo Server starts on \nhttp://localhost:${APP_PORT}${server.graphqlPath}`,
        badge: true,
      });
    });
  } catch (err) {
    consola.error({
      message: `Unable to start the server \n${err.message}`,
      badge: true,
    });
  }
};

startApp();
