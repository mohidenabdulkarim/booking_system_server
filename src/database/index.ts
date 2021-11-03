import { MongoClient } from 'mongodb';
import { Booking, Database, Listing, User } from 'src/lib/types';



const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

export const connectDatabase = async (): Promise<Database> => {
    const client = await MongoClient.connect(url);
    client.once('connectionCheckOutStarted', () => {
        console.log("Connected to db!");
    })
    const db = client.db('main');

    return {
        listings: db.collection<Listing>('listings'),
        users: db.collection<User>('users'),
        bookings: db.collection<Booking>('bookings'),
    }
}