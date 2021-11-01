import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLNonNull } from 'graphql';


const Listing = new GraphQLObjectType({
    name: "Listing",
    fields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        image: { type: new GraphQLNonNull(GraphQLString) },
        address: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: new GraphQLNonNull(GraphQLInt) },
        numOfGuests: { type: new GraphQLNonNull(GraphQLInt) },
        numOfBeds: { type: new GraphQLNonNull(GraphQLInt) },
        numOfBaths: { type: new GraphQLNonNull(GraphQLInt) },
        rating: { type: new GraphQLNonNull(GraphQLInt) },
    }
})

const query = new GraphQLObjectType({
    name: "Query",
    fields: {
        Listings: {
            type: Listing,
            resolve: () => {
                return Listing;
            }
        }
    },
});

const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        hey: {
            type: GraphQLString,
            args: { name: { type: GraphQLString } },
            resolve: (_root, args) => {
                return args.name;
            }
        }
    }
});


export const schema = new GraphQLSchema({ query, mutation });