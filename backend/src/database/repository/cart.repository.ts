import { ClientSession, DeleteResult } from 'mongoose';
import { ICartDocument, CartModel } from '../model';
import { ICart } from '../../types';

export class CartRepository {
    async create(cartItemData: Omit<ICart, 'quantity'>): Promise<ICartDocument> {
        const cartItem: ICartDocument = await CartModel.create(cartItemData);
        return cartItem;
    }

    async find(userId: string, restaurantId: string, itemId: string): Promise<ICartDocument | null> {
        return await CartModel.findOne({ userId, restaurantId, itemId });
    }

    async findById(cartItemId: string): Promise<ICartDocument | null> {
        return await CartModel.findById(cartItemId).populate('userId').populate('itemId');
    }

    async getCartItemsByRestaurant(
        userId: string,
        restaurantId: string,
        skip?: number,
        limit?: number,
    ): Promise<ICartDocument[]> {
        return await CartModel.find({ userId, restaurantId })
            .skip(skip ?? 0) // If skip is undefined or null, it defaults to 0, ensuring no skipping of documents
            .limit(limit ?? 0) // If limit is undefined or null, it defaults to 0, which means no limit is applied
            .populate('itemId');
    }

    async update(cartItemId: string, quantity: number): Promise<ICartDocument | null> {
        return await CartModel.findByIdAndUpdate(cartItemId, { quantity }, { new: true });
    }

    async delete(cartItemId: string, session?: ClientSession): Promise<DeleteResult | null> {
        return await CartModel.findByIdAndDelete(cartItemId, { new: true, session });
    }

    async deleteAllItems(userId: string, session?: ClientSession): Promise<DeleteResult> {
        return await CartModel.deleteMany({ userId }, { session });
    }

    async countCartItems(userId: string, restaurantId: string): Promise<number> {
        return CartModel.countDocuments({ userId, restaurantId });
    }
}
