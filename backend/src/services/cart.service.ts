import { autoInjectable } from 'tsyringe';
import { ICart } from '../types';
import { CartRepository, MenuRepository } from '../database/repository';
import { ICartDocument, IMenuDocument, IUserDocument } from '../database/model';
import { BadRequestError, ForbiddenError, NotFoundError } from '../errors';

@autoInjectable()
export class CartService {
    constructor(
        private readonly cartRepository: CartRepository,
        private readonly menuRepository: MenuRepository,
    ) {}

    public async createCartItem(
        userId: string,
        cartData: Pick<ICart, 'itemId' | 'restaurantId'>,
    ): Promise<ICartDocument> {
        const { itemId, restaurantId } = cartData;
        const menuItem: IMenuDocument | null = await this.menuRepository.findMenu(itemId);
        if (!menuItem) throw new NotFoundError('MenuItem not found');
        const cartItem: ICartDocument | null = await this.cartRepository.find(userId, restaurantId, itemId);
        if (cartItem) throw new BadRequestError('CartItem already exist');
        const addedCartItem: ICartDocument = await this.cartRepository.create({
            ...cartData,
            userId,
        });

        return addedCartItem;
    }

    public async getCartItemsByRestaurant(userId: string, restaurantId: string): Promise<ICartDocument[]> {
        const cartItems = await this.cartRepository.getCartItemsByRestaurant(userId, restaurantId);
        return cartItems;
    }

    public async updateItemQuantity(
        userId: string,
        cartItemId: string,
        quantity: number,
    ): Promise<ICartDocument | null> {
        const cartItem: ICartDocument | null = await this.cartRepository.findById(cartItemId);
        if (!cartItem) throw new NotFoundError('CartItem not found');
        if (userId !== (cartItem.userId as IUserDocument)._id.toString())
            throw new ForbiddenError('You cannot modify others cart item');
        const updatedCartItem: ICartDocument | null = await this.cartRepository.update(cartItemId, quantity);
        console.log('after update updatedCartItem ', updatedCartItem);

        return updatedCartItem;
    }

    public async removeCartItem(cartItemId: string, userId: string): Promise<ICartDocument> {
        const cartItem: ICartDocument | null = await this.cartRepository.findById(cartItemId);
        if (!cartItem) throw new NotFoundError('Cart item not found');
        console.log(cartItem);
        console.log(userId);

        if (userId !== (cartItem.userId as IUserDocument)._id.toString())
            throw new ForbiddenError('You cannot remove others cart item');
        await this.cartRepository.delete(cartItemId);
        return cartItem;
    }

    public async removeCartItems(userId: string): Promise<{ deleted: boolean }> {
        this.cartRepository.deleteAllItems(userId);
        return { deleted: true };
    }
}
