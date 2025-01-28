import mongoose from 'mongoose';
import { singleton } from 'tsyringe';
import { IOrder, IOrderStatusWithCounts, OrderStatus } from '../../types';
import { IOrderDocument, OrderModel } from '../model';

@singleton()
export class OrderRepository {
    createOrder = async (orderData: IOrder, session?: mongoose.ClientSession): Promise<IOrderDocument> => {
        const order: IOrderDocument[] = await OrderModel.create([orderData], { session });
        return order[0];
    };

    findUserOrders = async (
        userId: string,
        skip: number = 0,
        limit: number = 10,
    ): Promise<IOrderDocument[]> => {
        const userOrders = await OrderModel.aggregate([
            // Match orders for the specific user
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },

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

            // Unwind the menuItemDetails array
            { $unwind: '$menuItemDetails' },

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

            // Group by Order ID to aggregate ordered items into arrays
            {
                $group: {
                    _id: '$_id', // Group by order ID
                    restaurantDetails: { $first: '$restaurantDetails' },
                    userDetails: { $first: '$userDetails' },
                    status: { $first: '$status' }, // Delivery status
                    totalAmount: { $first: '$totalAmount' }, // Preserve totalAmount
                    address: { $first: '$address' }, // Preserve address
                    orderedItems: {
                        $push: {
                            name: '$menuItemDetails.name',
                            imageUrl: '$menuItemDetails.imageUrl',
                            quantity: '$orderedItems.quantity', // Example: Include additional fields
                            price: '$orderedItems.menuItemPrice',
                        },
                    }, // Array of item names
                    createdAt: { $first: '$createdAt' }, // Order date and time
                },
            },

            // Optionally project the final structure
            {
                $project: {
                    _id: 1, // Include Order ID
                    restaurantDetails: {
                        name: '$restaurantDetails.name',
                        email: '$restaurantDetails.email',
                        phone: '$restaurantDetails.phone',
                    }, // Include only the email field
                    userDetails: {
                        name: '$userDetails.name',
                        email: '$userDetails.email',
                        phone: '$userDetails.phone',
                    }, // Include only the email field
                    status: 1,
                    totalAmount: 1,
                    address: {
                        _id: 1,
                        userId: 1,
                        address: 1,
                        city: 1,
                        country: 1,
                    },
                    orderedItems: 1, // Array of grouped ordered items
                    createdAt: 1,
                },
            },

            { $sort: { createdAt: -1 } },
            // Add skip and limit stages for pagination
            { $skip: skip },
            { $limit: limit },
        ]);

        return userOrders;
    };

    findRestaurantOrders = async (
        restaurantId: string,
        skip: number = 0,
        limit: number = 10,
    ): Promise<IOrderDocument[]> => {
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
                    totalAmount: { $first: '$totalAmount' }, // Preserve totalAmount
                    address: { $first: '$address' }, // Preserve address
                    orderedItems: {
                        $push: {
                            name: '$menuItemDetails.name',
                            imageUrl: '$menuItemDetails.imageUrl',
                            quantity: '$orderedItems.quantity', // Example: Include additional fields
                            price: '$orderedItems.menuItemPrice',
                        },
                    },
                    createdAt: { $first: '$createdAt' }, // Preserve creation date
                },
            },

            // Optionally project the final structure
            {
                $project: {
                    _id: 1, // Include Order ID
                    userDetails: {
                        name: '$userDetails.name',
                        email: '$userDetails.email',
                        phone: '$userDetails.phone',
                    }, // Include only the email field
                    status: 1,
                    totalAmount: 1,
                    address: {
                        _id: 1,
                        userId: 1,
                        address: 1,
                        city: 1,
                        country: 1,
                    },
                    orderedItems: 1, // Array of grouped ordered items
                    createdAt: 1,
                },
            },

            { $sort: { createdAt: -1 } },
            // Add skip and limit stages for pagination
            { $skip: skip },
            { $limit: limit },
        ]);
        return restaurantOrders;
    };

    findOrderById = async (orderId: string): Promise<IOrderDocument | null> => {
        return await OrderModel.findById(orderId).populate('restaurantId').lean<IOrderDocument | null>();
    };

    updateOrderStatus = async (orderId: string, status: string): Promise<IOrderDocument | null> => {
        const order: IOrderDocument | null = await OrderModel.findByIdAndUpdate(
            orderId,
            { status },
            {
                new: true,
            },
        );
        return order;
    };

    countOrderStatuses = async (restaurantId?: string): Promise<IOrderStatusWithCounts[]> => {
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
    };

    // menuItemPrice
    findAllOrdersPrice = async (): Promise<number> => {
        const total = await OrderModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalSellPrice: {
                        $sum: '$totalAmount',
                    },
                },
            },
        ]);
        return total.length ? total[0].totalSellPrice : 0;
    };

    findRestaurantTotalOrdersPrice = async (restaurantId: string): Promise<number> => {
        const total = await OrderModel.aggregate([
            {
                $match: {
                    restaurantId: new mongoose.Types.ObjectId(restaurantId),
                    status: OrderStatus.DELIVERED,
                },
            },
            {
                $group: {
                    _id: null,
                    totalSellPrice: {
                        $sum: '$totalAmount',
                    },
                },
            },
        ]);
        return total.length ? total[0].totalSellPrice : 0;
    };

    countUserOrders = async ({ userId }: { userId: string }): Promise<number> => {
        return await OrderModel.countDocuments({ userId });
    };

    countRestaurantOrders = async ({ restaurantId }: { restaurantId: string }): Promise<number> => {
        return await OrderModel.countDocuments({ restaurantId });
    };
}
