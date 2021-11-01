//loading .env variables
require('dotenv').config();

// main imports
import express, { Application } from 'express'
import { ApolloServer } from 'apollo-server-express'
import { resolvers, typeDefs } from './graphql/';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { connectDatabase } from './database';


const mount = async (app: Application) => {

    // DB connection function
    const db = await connectDatabase();


    // setup apollo server
    const apolloServer = new ApolloServer({
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground
        ],
        typeDefs,
        resolvers,
        context: () => ({ db })
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: '/api' });

    app.listen(process.env.PORT);
    console.log("Running on port: ", process.env.PORT);

}


mount(express()).catch(err => console.log("ERROR IS : ", err));





