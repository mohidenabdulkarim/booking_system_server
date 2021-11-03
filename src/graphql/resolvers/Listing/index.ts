import { IResolvers } from "@graphql-tools/utils";
import { ObjectId } from "bson";
import { Database, Listing } from "../../../lib/types";

export const listingResolver: IResolvers = {
    Query: {
        listings: async (
            _root: undefined,
            _args: {},
            { db }: { db: Database }
        ): Promise<Listing[]> => {
            // throw new Error("custom error!");
            return await db.listings.find({}).toArray();
        },
    },

    Mutation: {
        deleteListing: async (
            _root: undefined,
            { id }: { id: string },
            { db }: { db: Database }
        ): Promise<Listing> => {
            const deletedListing = await db.listings.findOneAndDelete({
                _id: new ObjectId(id),
            });

            if (!deletedListing.value) {
                throw new Error("Failed to delete listing!");
            }

            return deletedListing.value;
        },
    },
    Listing: {
        id: (listing: Listing): string => listing._id.toString(),
    },
};

