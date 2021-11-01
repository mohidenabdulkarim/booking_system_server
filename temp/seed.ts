require('dotenv').config();

import { ObjectId } from "mongodb";
import { connectDatabase } from '../src/database'
import { Listing } from '../src/lib/types'


const seed = async () => {
    try {
        console.log("[seed]: running ...");
        const db = await connectDatabase();

        const listings: Listing[] = [
            {
                _id: new ObjectId(),
                title: "title 1",
                image: "image 1",
                address: "ad1",
                price: 2000,
                numOfBaths: 10,
                numOfBeds: 21,
                numOfGuests: 12,
                rating: 10
            },
            {
                _id: new ObjectId(),
                title: "title 2",
                image: "image 2",
                address: "ad2",
                price: 2000,
                numOfBaths: 10,
                numOfBeds: 21,
                numOfGuests: 12,
                rating: 10
            },
            {
                _id: new ObjectId(),
                title: "title 3",
                image: "image 3",
                address: "ad3",
                price: 2000,
                numOfBaths: 10,
                numOfBeds: 21,
                numOfGuests: 12,
                rating: 10
            },
        ];

        for (const listing of listings) {
            await db.listings.insertOne(listing);
        }

        console.log("[seed]: success!");

    } catch (error) {
        throw new Error('field to seed database');

    }
}

seed();