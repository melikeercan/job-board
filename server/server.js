import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloMiddleware } from "@apollo/server/express4";
import cors from 'cors';
import express from 'express';
import { authMiddleware, handleLogin } from './auth.js';
import { readFile } from 'node:fs/promises';
import { resolvers } from "./resolvers.js";
import {getUser} from "./db/users.js";

const PORT = 9000;

const app = express();

app.use(cors(), express.json(), authMiddleware);

app.post('/login', handleLogin);

const typeDefs = await readFile('./schema.graphql', 'utf8');

const apolloServer = new ApolloServer({typeDefs, resolvers});
await apolloServer.start();

const getContext = async ({req}) => {
    if (req.auth) {
        const user = await getUser(req.auth.sub);
        return { user };
    }
    return { };
}

app.use('/graphql', apolloMiddleware(apolloServer, {context: getContext}));

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL server running at http://localhost:${PORT}/graphql`);
});
