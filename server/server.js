const express = require('express');
//import apollo server
const {ApolloServer} = require('apollo-server-express');
//import typeDefs and resolvers
const {typeDefs, resolvers} = require('./schemas');
const db = require('./config/connection');
const {authMiddleware} = require('./utils/auth');

const PORT = process.env.PORT || 3001;
const app = express();

//start server
const startServer = async () => {
  //creaye a new apollo server and pass in our schema data
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware
  });

  //start apollo server
  await server.start();

  //integrate apollo server with express app as middleware
  server.applyMiddleware({app});

  //log where we can go to test GQL API
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};

//initialize apollo server
startServer();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
