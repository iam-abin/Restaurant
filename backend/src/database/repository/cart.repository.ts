import { ClientSession, DeleteResult } from 'mongoose';
import { singleton } from 'tsyringe';
import { ICartDocument, CartModel } from '../model';
import { ICart } from '../../types';

@singleton()
export class CartRepository {
    createCartItem = async (cartItemData: Omit<ICart, 'quantity'>): Promise<ICartDocument> => {
        const cartItem: ICartDocument = await CartModel.create(cartItemData);
        return cartItem;
    };

    findCartItem = async (
        userId: string,
        restaurantId: string,
        itemId: string,
    ): Promise<ICartDocument | null> => {
        return await CartModel.findOne({ userId, restaurantId, itemId }).lean<ICartDocument | null>();
    };

    findCartItemById = async (cartItemId: string): Promise<ICartDocument | null> => {
        return await CartModel.findById(cartItemId)
            .populate('userId')
            .populate('itemId')
            .lean<ICartDocument | null>();
    };

    findCartItemsByRestaurant = async (
        userId: string,
        restaurantId: string,
        skip?: number,
        limit?: number,
    ): Promise<ICartDocument[]> => {
        return await CartModel.find({ userId, restaurantId })
            .sort({ createdAt: -1 })
            .skip(skip ?? 0) // If skip is undefined or null, it defaults to 0, ensuring no skipping of documents
            .limit(limit ?? 0) // If limit is undefined or null, it defaults to 0, which means no limit is applied
            .populate('itemId')
            .lean<ICartDocument[]>();
    };

    updateCartItem = async (cartItemId: string, quantity: number): Promise<ICartDocument | null> => {
        return await CartModel.findByIdAndUpdate(cartItemId, { quantity }, { new: true });
    };

    deleteCartItemById = async (
        cartItemId: string,
        session?: ClientSession,
    ): Promise<DeleteResult | null> => {
        return await CartModel.findByIdAndDelete(cartItemId, { new: true, session });
    };

    deleteAllCartItems = async (userId: string, session?: ClientSession): Promise<DeleteResult> => {
        return await CartModel.deleteMany({ userId }, { session });
    };

    countCartItems = async (restaurantId: string, userId: string): Promise<number> => {
        return CartModel.countDocuments({ restaurantId, userId });
    };
}
