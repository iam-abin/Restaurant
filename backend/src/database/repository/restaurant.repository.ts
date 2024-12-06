import mongoose, { ClientSession } from 'mongoose';
import { IRestaurant, IRestaurantResponse, ISearchResult } from '../../types';
import { IRestaurantDocument, RestaurantModel } from '../model';

export class RestaurantRepository {
    async create(restaurantData: Pick<IRestaurant, 'ownerId'>): Promise<IRestaurantDocument> {
        const restaurant: IRestaurantDocument = await RestaurantModel.create(restaurantData);
        return restaurant;
    }

    async findRestaurants(): Promise<IRestaurantDocument[]> {
        const restaurants = await RestaurantModel.find().populate('ownerId');
        return restaurants;
    }

    async findRestaurant(restaurantId: string): Promise<IRestaurantResponse | null> {
        const restaurant = await RestaurantModel.aggregate([
            // Match the restaurant by ID
            {
                $match: { _id: new mongoose.Types.ObjectId(restaurantId) },
            },
            // Lookup to join with the Address collection
            {
                $lookup: {
                    from: 'addresses', // Address collection
                    localField: 'addressId',
                    foreignField: '_id',
                    as: 'address',
                },
            },
            {
                $unwind: {
                    path: '$address',
                    preserveNullAndEmptyArrays: true, // Optional, if some restaurants may not have an address
                },
            },
            // Lookup to join with the Menu collection
            {
                $lookup: {
                    from: 'menus',
                    localField: '_id',
                    foreignField: 'restaurantId',
                    as: 'menus',
                },
            },
            // Lookup to join with the RestaurantCuisine collection
            {
                $lookup: {
                    from: 'restaurantcuisines',
                    localField: '_id',
                    foreignField: 'restaurantId',
                    as: 'restaurantCuisines',
                },
            },
            // Lookup to join with the Cuisine collection
            {
                $lookup: {
                    from: 'cuisines',
                    localField: 'restaurantCuisines.cuisineId',
                    foreignField: '_id',
                    as: 'cuisines',
                },
            },
            // Lookup to join with the users collection
            {
                $lookup: {
                    from: 'users', // User collection (owners are stored here)
                    localField: 'ownerId',
                    foreignField: '_id',
                    as: 'owner',
                },
            },
            {
                $unwind: {
                    path: '$owner',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    owner: {
                        _id: 1,
                        name: 1,
                        email: 1,
                    },
                    address: 1,
                    menus: 1,
                    cuisines: 1,
                    deliveryTime: 1,
                    imageUrl: 1,
                },
            },
        ]);
        return restaurant[0];
    }

    async findMyRestaurant(ownerId: string): Promise<IRestaurantDocument | null> {
        return await RestaurantModel.findOne({ ownerId }).populate(['ownerId', 'addressId']);
    }

    async update(
        ownerId: string,
        updatedData: Partial<Pick<IRestaurant, 'addressId' | 'deliveryTime' | 'imageUrl'>>,
        session?: ClientSession,
    ): Promise<IRestaurantDocument | null> {
        const restaurant: IRestaurantDocument | null = await RestaurantModel.findOneAndUpdate(
            { ownerId },
            updatedData,
            {
                new: true,
                session,
            },
        );
        return restaurant;
    }

    async searchRestaurants(
        searchText: string,
        searchQuery: string,
        selectedCuisines: string[],
    ): Promise<ISearchResult[]> {
        console.log(searchText, searchQuery, selectedCuisines);

        const pipeline = [
            // Lookup address details
            {
                $lookup: {
                    from: 'addresses',
                    localField: 'addressId',
                    foreignField: '_id',
                    as: 'address',
                },
            },
            {
                $unwind: '$address',
            },
            // Lookup owner details
            {
                $lookup: {
                    from: 'users',
                    localField: 'ownerId',
                    foreignField: '_id',
                    as: 'owner',
                },
            },
            {
                $unwind: '$owner',
            },
            // Lookup cuisines associated with the restaurant
            {
                $lookup: {
                    from: 'restaurantcuisines',
                    localField: '_id',
                    foreignField: 'restaurantId',
                    as: 'restaurantCuisines',
                },
            },
            // {
            //     $unwind: { path: '$restaurantCuisines', preserveNullAndEmptyArrays: true },
            // },
            {
                $lookup: {
                    from: 'cuisines',
                    localField: 'restaurantCuisines.cuisineId',
                    foreignField: '_id',
                    as: 'cuisines',
                },
            },
            {
                $unwind: { path: '$cuisines', preserveNullAndEmptyArrays: true },
            },
            // Match conditions
            {
                $match: {
                    $and: [
                        // Match city, country, or name based on searchText
                        {
                            $or: [
                                { 'address.city': { $regex: searchText, $options: 'i' } },
                                { 'address.country': { $regex: searchText, $options: 'i' } },
                                { 'owner.name': { $regex: searchText, $options: 'i' } },
                            ],
                        },
                        // Match searchQuery in both owner name and cuisine names
                        {
                            $or: [
                                { 'owner.name': { $regex: searchQuery, $options: 'i' } },
                                { 'cuisines.name': { $regex: searchQuery, $options: 'i' } },
                            ],
                        },
                        // Match selected cuisines if provided
                        ...(selectedCuisines.length > 0
                            ? [{ 'cuisines.name': { $in: selectedCuisines } }]
                            : []),
                    ],
                },
            },
            // Group results by restaurant to aggregate cuisines and avoid duplicates
            {
                $group: {
                    _id: '$_id',
                    restaurantName: { $first: '$owner.name' },
                    city: { $first: '$address.city' },
                    country: { $first: '$address.country' },
                    imageUrl: { $first: '$imageUrl' },
                    cuisines: { $addToSet: '$cuisines.name' },
                },
            },
            // Optionally project only the required fields
            {
                $project: {
                    _id: 1,
                    restaurantName: 1,
                    city: 1,
                    country: 1,
                    imageUrl: 1,
                    cuisines: 1,
                },
            },
        ];

        const restaurants = await RestaurantModel.aggregate(pipeline);
        return restaurants;
    }

    async countRestaurants(): Promise<number> {
        return RestaurantModel.countDocuments();
    }
}
