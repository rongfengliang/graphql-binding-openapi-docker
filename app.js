const { OpenApi } = require('graphql-binding-openapi')
const { GraphQLServer } = require('graphql-yoga')
const {importSchema}  = require("graphql-import")

const typeDefs = importSchema("./petstore.graphql")
const resolvers = {
  Query: {
    findPetsByStatus: async (parent, args, context, info) => {
      return context.petstore.query.findPetsByStatus({ status: "available" }, context, info)
    }
  }
}

const server = new GraphQLServer({ 
  resolvers, 
  typeDefs,
  context: async req => ({
    ...req,
    petstore: await OpenApi.init('./petstore.json', 'http://petstore.swagger.io/v2')
  })
});

server.start(() => console.log('Server running on http://localhost:4000'))