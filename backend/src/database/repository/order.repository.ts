import mongoose from 'mongoose';
import { IOrder, IOrderStatusWithCounts } from '../../types';
import { IOrderDocument, OrderModel } from '../model';

export class OrderRepository {
    async create(orderData: IOrder, session?: mongoose.ClientSession): Promise<IOrderDocument> {
        const order: IOrderDocument[] = await OrderModel.create([orderData], { session });
        return order[0];
    }

    async findMyOrders(userId: string): Promise<IOrderDocument[]> {
        const userOrders = await OrderModel.aggregate([
            // Match orders for the specific user
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },

            // Lookup for restaurant details
            {
                $lookup: {
                    from: 'restaurants',
                    localField: 'restaurantId',
                    foreignField: '_id',
                    as: 'restaurantDetails',
                },
            },

            // Unwind the restaurantDetails array
            { $unwind: '$restaurantDetails' },

            {
                $lookup: {
                    from: 'users',
                    localField: 'restaurantDetails.ownerId',
                    foreignField: '_id',
                    as: 'restaurantDetails',
                },
            },

            { $unwind: '$restaurantDetails' },

            // Lookup for ordered items related to this order
            {
                $lookup: {
                    from: 'ordereditems', // Collection name of OrderedItemModel
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'orderedItems',
                },
            },

            // Unwind the orderedItems array
            { $unwind: '$orderedItems' },

            // Lookup menu details
            {
                $lookup: {
                    from: 'menus',
                    localField: 'orderedItems.menuItemId',
                    foreignField: '_id',
                    as: 'menuItemDetails',
                },
            },

            // // Unwind the menuItemDetails array
            { $unwind: '$menuItemDetails' },

            // // Group by Order ID to aggregate ordered items into arrays
            {
                $group: {
                    _id: '$_id', // Group by order ID
                    items: { $push: '$menuItemDetails' }, // Array of item names
                    restaurantDetails: { $first: '$restaurantDetails.name' },
                    imageUrl: { $first: '$menuItemDetails.imageUrl' }, // Representative image
                    status: { $first: '$status' }, // Delivery status
                    createdAt: { $first: '$createdAt' }, // Order date and time
                },
            },

            // // Project the final structure
            // {
            //     $project: {
            //         _id: 1, // Include Order ID
            //         items: 1, // Ordered item names
            //         imageUrl: 1, // Image URL for reference
            //         restaurantName: 1, // Restaurant name
            //         status: 1, // Delivery status
            //         createdAt: 1, // Ordered date and time
            //     },
            // },
        ]);
        return userOrders;
    }

    async findOrders(restaurantId: string): Promise<IOrderDocument[]> {
        const restaurantOrders = await OrderModel.aggregate([
            // Match orders by restaurantId
            { $match: { restaurantId: new mongoose.Types.ObjectId(restaurantId) } },
            
            // Lookup to populate user details
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails',
                },
            },
            // Unwind userDetails array
            { $unwind: '$userDetails' },
            
            // Lookup to populate ordered items
            {
                $lookup: {
                    from: 'ordereditems',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'orderedItems',
                },
            },
            // Unwind orderedItems array to process each menuItemId
            { $unwind: { path: '$orderedItems', preserveNullAndEmptyArrays: true } },
            
            // Lookup to populate menu items in orderedItems
            {
                $lookup: {
                    from: 'menus',
                    localField: 'orderedItems.menuItemId',
                    foreignField: '_id',
                    as: 'menuItemDetails',
                },
            },
            // Unwind menuItemDetails if needed
            { $unwind: { path: '$menuItemDetails', preserveNullAndEmptyArrays: true } },
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
            // Group ordered items by orderId
            {
                $group: {
                    _id: '$_id', // Group by order ID
                    userDetails: { $first: '$userDetails' }, // Preserve user details
                    status: { $first: '$status' }, // Preserve status
                    createdAt: { $first: '$createdAt' }, // Preserve creation date
                    totalAmound: { $first: '$totalAmound' }, // Preserve totalAmound
                    address: { $first: '$address' }, // Preserve address
                    orderedItems: {
                        $push: {
                            item: '$menuItemDetails.name',
                            imageUrl: '$menuItemDetails.imageUrl',
                            quantity: '$orderedItems.quantity', // Example: Include additional fields
                            price: '$orderedItems.menuItemPrice',
                        },
                    },
                },
            },
            
            // Optionally project the final structure
            {
                $project: {
                    _id: 1, // Include Order ID
                    userDetails: { name: '$userDetails.name' , email: '$userDetails.email' }, // Include only the email field
                    status: 1,
                    totalAmound: 1,
                    address: 1,
                    createdAt: 1,
                    orderedItems: 1, // Array of grouped ordered items
                },
            },
        ]);
        return restaurantOrders;
    }

    async findOrder(orderId: string): Promise<IOrderDocument | null> {
        return await OrderModel.findById(orderId).populate('userId');
    }

    async updateStatus(orderId: string, status: string): Promise<IOrderDocument | null> {
        const order: IOrderDocument | null = await OrderModel.findByIdAndUpdate(
            orderId,
            { status },
            {
                new: true,
            },
        );
        return order;
    }

    async countStatuses(restaurantId?: string): Promise<IOrderStatusWithCounts[]> {
        const statsCounts: IOrderStatusWithCounts[] = await OrderModel.aggregate([
            // It will perform $match only if the restaurantId is present
            ...(restaurantId
                ? [
                      {
                          $match: { restaurantId: new mongoose.Types.ObjectId(restaurantId) },
                      },
                  ]
                : []),
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    status: '$_id',
                    _id: 0,
                    count: 1,
                },
            },
        ]);
        return statsCounts;
    }

    // menuItemPrice

    async totalOrderedPrice(): Promise<number> {
        const total = await OrderModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalSellPrice: {
                        $sum: '$totalAmound',
                    },
                },
            },
        ]);
        return total.length ? total[0].totalSellPrice : 0;
    }

    async percentageCommitionAmound(percentageDecimal: number): Promise<number> {
        const result = await OrderModel.aggregate([
            {
                $project: {
                    // Multiply totalAmount by the percentage
                    percentageAmount: { $multiply: ['$totalAmound', percentageDecimal] },
                },
            },
            {
                $group: {
                    _id: null, // No grouping (we want to sum everything)
                    totalPercentageSum: { $sum: '$percentageAmount' }, // Sum the calculated percentage amounts
                },
            },
        ]);
        return result[0]?.totalPercentageSum || 0;
    }
}
