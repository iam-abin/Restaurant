import { ClientSession, DeleteResult } from 'mongoose';
import { singleton } from 'tsyringe';
import { ICartDocument, CartModel } from '../models';
import { ICart, IFindCartItemsByRestaurant } from '../../types';

@singleton()
export class CartRepository {
    private readonly excludedFields: string[] = ['-createdAt', '-updatedAt', '-__v'];

    createCartItem = async (cartItemData: Omit<ICart, 'quantity'>): Promise<ICartDocument> => {
        const cartItem: ICartDocument = await CartModel.create(cartItemData);
        return cartItem;
    };

    findCartItem = async (
        userId: string,
        restaurantId: string,
        itemId: string,
    ): Promise<ICartDocument | null> => {
        return await CartModel.findOne({ userId, restaurantId, itemId })
            .select(this.excludedFields)
            .lean<ICartDocument | null>();
    };

    findCartItemById = async (cartItemId: string): Promise<ICartDocument | null> => {
        return await CartModel.findById(cartItemId)
            .populate('userId')
            .populate('itemId')
            .lean<ICartDocument | null>();
    };

    findCartItemsByRestaurant = async ({
        userId,
        restaurantId,
        skip = 0,
        limit = 0,
        session,
    }: IFindCartItemsByRestaurant): Promise<ICartDocument[]> => {
        return await CartModel.find({ userId, restaurantId })
            .session(session!)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('itemId', this.excludedFields) // Exclude from subdocument 'itemId'
            .select(this.excludedFields) // Exclude from main subdocument
            .lean<ICartDocument[]>();
    };

    updateCartItem = async (cartItemId: string, quantity: number): Promise<ICartDocument | null> => {
        return await CartModel.findByIdAndUpdate(cartItemId, { quantity }, { new: true }).select(
            this.excludedFields,
        );
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
