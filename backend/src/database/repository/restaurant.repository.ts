import { ClientSession } from 'mongoose';
import { singleton } from 'tsyringe';
import { CountByDay, IRestaurant, SearchResult } from '../../types';
import { IRestaurantDocument, RestaurantModel } from '../model';

@singleton()
export class RestaurantRepository {
    create = async (
        restaurantData: Pick<IRestaurant, 'ownerId' | 'imageUrl'>,
        session?: ClientSession,
    ): Promise<IRestaurantDocument> => {
        const restaurant: IRestaurantDocument[] = await RestaurantModel.create([restaurantData], { session });
        return restaurant[0];
    };

    findRestaurants = async (skip: number, limit: number): Promise<IRestaurantDocument[]> => {
        return await RestaurantModel.find()
            .skip(skip ?? 0)
            .limit(limit ?? 0)
            .populate('ownerId');
    };

    findRestaurant = async (restaurantId: string): Promise<IRestaurantDocument | null> => {
        return await RestaurantModel.findById(restaurantId)
            .populate([
                {
                    path: 'ownerId',
                    select: 'name email phone', // Exclude fields from ownerId
                },
                {
                    path: 'addressId',
                    select: '-createdAt -updatedAt', // Exclude fields from addressId
                },
            ])
            .select('-createdAt -updatedAt'); // Exclude fields from the main restaurant document
    };

    findMyRestaurant = async (ownerId: string): Promise<IRestaurantDocument | null> => {
        return await RestaurantModel.findOne({ ownerId }).populate(['ownerId', 'addressId']);
    };

    update = async (
        ownerId: string,
        updatedData: Partial<Pick<IRestaurant, 'addressId' | 'deliveryTime' | 'imageUrl'>>,
        session?: ClientSession,
    ): Promise<IRestaurantDocument | null> => {
        const restaurant: IRestaurantDocument | null = await RestaurantModel.findOneAndUpdate(
            { ownerId },
            updatedData,
            {
                new: true,
                session,
            },
        );
        return restaurant;
    };

    searchRestaurants = async (
        searchText: string,
        searchQuery: string,
        selectedCuisines: string[],
        skip: number,
        limit: number,
    ): Promise<SearchResult> => {
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
            // Use $facet to separate the total count and paginated results
            {
                $facet: {
                    results: [
                        { $skip: skip }, // Skip documents for pagination
                        { $limit: limit }, // Limit the number of documents returned
                    ],
                    totalCount: [
                        { $count: 'count' }, // Count the total number of matched documents
                    ],
                },
            },
        ];

        const result = await RestaurantModel.aggregate(pipeline);

        // Extract results and totalCount from the pipeline output
        const restaurants = result[0]?.results || [];
        const totalCount = result[0]?.totalCount?.[0]?.count || 0;

        return { restaurants, totalCount };
    };

    countRestaurants = async (): Promise<number> => {
        return RestaurantModel.countDocuments();
    };

    countLast7DaysCreatedRestaurants = async (startDate: Date): Promise<CountByDay[]> => {
        const counts: CountByDay[] = await RestaurantModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }, // Only include documents from the last 7 days
                },
            },
            {
                $project: {
                    date: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }, // Format date to 'YYYY-MM-DD'
                    },
                },
            },
            {
                $group: {
                    _id: '$date', // Group by formatted date
                    count: { $sum: 1 }, // Count the number of restaurants for each date
                },
            },
            {
                $addFields: { date: '$_id' }, // Copy `_id` to `date`
            },
            {
                $project: { _id: 0 }, // Remove the `_id` field
            },
            {
                $sort: { date: 1 }, // Sort by date in ascending order
            },
        ]);
        return counts;
    };
}
