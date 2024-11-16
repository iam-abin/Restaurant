import { ClientSession, DeleteResult } from 'mongoose';
import { ICartDocument, CartModel } from '../model';
import { ICart } from '../../types';

export class CartRepository {
    async create(cartItemData: Pick<ICart, 'userId'>, session?: ClientSession): Promise<ICartDocument> {
        const cartItem: ICartDocument[] = await CartModel.create([cartItemData], { session });
        return cartItem[0];
    }

    async findAllByUserId(userId: string): Promise<ICartDocument[]> {
        return await CartModel.find({ userId }).populate('userId').populate('menuItemId');
    }

    async deleteItems(userId: string, session?: ClientSession): Promise<DeleteResult> {
        return await CartModel.deleteMany({ userId }, { session });
    }

    async update(cartItemId: string, count: number): Promise<ICartDocument | null> {
        return await CartModel.findByIdAndUpdate(cartItemId, { count }, { new: true });
    }
}
