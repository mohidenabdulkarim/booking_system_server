import { Collection, ObjectId } from "mongodb";

export enum ListingType {
    Apartment = "apartment", //change to capital latter
    House = "house",         //change to capital latter
}

export interface BookingIndexMonth {
    [key: string]: boolean;
}

export interface BookingIndexYear {
    [key: string]: BookingIndexMonth;
}

// export interface BookingsIndex {
//     [key: string]: BookingIndexYear;
// }

export interface Booking {
    _id: ObjectId;
    listing: ObjectId;
    tenat: string;
    checkIn: string;
    checkOut: string;
}

export interface Listing {
    _id: ObjectId;
    title: string;
    description: string;
    image: string;
    host: string;
    type: ListingType,
    address: string;
    country: string;
    admin: string;
    city: string;
    price: number;
    bookings: ObjectId[]
    bookingsIndex: BookingIndexYear;
    numOfGuests: number;
}

export interface User {
    _id: string;
    token: string;
    name: string;
    avatar: string;
    contact: string;
    walletId?: string;
    income: number;
    bookings: ObjectId[];
    listings: ObjectId[];
}

export interface Database {
    bookings: Collection<Booking>;
    listings: Collection<Listing>;
    users: Collection<User>;
}