import { ClientSession, DeleteResult } from 'mongoose';
import { ICartDocument, CartModel } from '../model';
import { ICart } from '../../types';

export class CartRepository {
    async create(cartItemData: Omit<ICart, 'quantity'>): Promise<ICartDocument> {
        const cartItem: ICartDocument = await CartModel.create(cartItemData);
        return cartItem;
    }

    async find(userId: string, itemId: string): Promise<ICartDocument | null> {
        return await CartModel.findOne({ userId, itemId });
    }

    async findById(cartItemId: string): Promise<ICartDocument | null> {
        return await CartModel.findById(cartItemId).populate('userId').populate('itemId');
    }

    async findAllByUserId(userId: string): Promise<ICartDocument[]> {
        return await CartModel.find({ userId }).populate('itemId');
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
}
