const { buildSchema } = require('graphql');

module.exports = buildSchema(`

    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        email: String!
        name: String!
        password: String!
        status: String!
        posts: [Post!]!
        createdAt: String!
        updatedAt: String!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    type RootQuery {
        hello: String!
    }
    
    type RootMutation {
        createUser(userInput: UserInputData!): User!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);