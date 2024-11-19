import { ClientSession } from 'mongoose';
import { IRestaurant } from '../../types';
import { IRestaurantDocument, RestaurantModel } from '../model';

export class RestaurantRepository {
    async create(restaurantData: Pick<IRestaurant, 'ownerId'>): Promise<IRestaurantDocument> {
        const restaurant: IRestaurantDocument = await RestaurantModel.create(restaurantData);
        return restaurant;
    }

    async findRestaurant(restaurantId: string): Promise<IRestaurantDocument | null> {
        return await RestaurantModel.findById(restaurantId).populate(['ownerId', 'addressId']);
    }

    async findMyRestaurant(ownerId: string): Promise<IRestaurantDocument | null> {
        console.log("owner id ", ownerId);
        
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

    async searchRestaurants(searchText: string, searchQuery: string, selectedCuisines: string[]) {
        const pipeline = [
            {
                $lookup: {
                    from: 'addresses',
                    localField: 'addressId',
                    foreignField: '_id',
                    as: 'address',
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'ownerId',
                    foreignField: '_id',
                    as: 'owner',
                },
            },
            {
                $unwind: '$address',
            },
            {
                $unwind: '$owner',
            },
            {
                $lookup: {
                    from: 'cuisines',
                    localField: '_id',
                    foreignField: 'restaurantId', // Assuming `restaurantId` exists in Cuisine documents
                    as: 'cuisines',
                },
            },
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
            {
                $project: {
                    ownerId: 1,
                    addressId: 1,
                    deliveryTime: 1,
                    imageUrl: 1,
                    isBlocked: 1,
                },
            },
        ];

        const restaurants = await RestaurantModel.aggregate(pipeline);
        return restaurants;
    }
}
