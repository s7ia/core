import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server';
import gql from 'graphql-tag';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
const port = process.env.HTTP_PORT || 8080;

app.use(express.json());
app.use(cookieParser());

app.use(cors({
	origin: [process.env.FRONT_END_ORIGIN],  // for the web client
	credentials: true
}));

app.use ("/api/user", require("./api/userApi"));

app.listen(port, function () {
	console.log ("|=============================================================|")
	console.log ("| Core: Express on port ("+ port + ") started successfully.    ")
	console.log ("|=============================================================|")
});

// connect to mongo db server
mongoose.connect(process.env.MDATABASE, { useNewUrlParser: true, useUnifiedTopology: true} , function () {
	console.log ("|=============================================================|")
	console.log ("| Core: Connected to MongoDB.                                  ")
	console.log ("|=============================================================|")

});

// start GraphQL server
const typeDefs = gql`
	type Query {
		testing: String!
	}
`;

const resolvers = {
	Query: {
		testing: function () {
			return 'Hello World!';
		}
	}
}

const apollo = new ApolloServer({
	typeDefs,
	resolvers
});

apollo.listen({ port: process.env.APOLLO_PORT })
	.then(function (res) {
	console.log ("|=============================================================|")
	console.log ("| Core: GraphQL Initialized ("+res.url+").                     ")
	console.log ("|=============================================================|")

});




