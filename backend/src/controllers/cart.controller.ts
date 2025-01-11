import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { createSuccessResponse } from '../utils';
import { ICartDocument } from '../database/model';
import { CartService } from '../services';
import { ICart, ICartItemsData } from '../types';

@autoInjectable()
export class CartController {
    constructor(private readonly cartService: CartService) {}
    public async addToCart(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        const cartItem: ICartDocument = await this.cartService.createCartItem(
            userId,
            req.body as Pick<ICart, 'itemId' | 'restaurantId'>,
        );
        res.status(201).json(createSuccessResponse('Item added to cart successfully', cartItem));
    }

    public async getCartItems(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        const { restaurantId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const cartItems: ICartItemsData = await this.cartService.getCartItemsByRestaurant({
            userId,
            restaurantId,
            page: page as number,
            limit: limit as number,
        });
        res.status(200).json(createSuccessResponse('Cart items fetched successfully', cartItems));
    }

    public async updateQuantity(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        const { cartItemId } = req.params;
        const { quantity } = req.body;

        const cartItem: ICartDocument | null = await this.cartService.updateItemQuantity(
            userId,
            cartItemId,
            quantity,
        );
        res.status(200).json(createSuccessResponse('Cart item quantity updated successfully', cartItem));
    }

    public async removeCartItems(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        const cartItems: { deleted: boolean } = await this.cartService.removeCartItems(userId);
        res.status(200).json(createSuccessResponse('Cart items removed successfully', cartItems));
    }

    public async removeCartItem(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        const { cartItemId } = req.params;
        const cartItem: ICartDocument = await this.cartService.removeCartItem(cartItemId, userId);
        res.status(200).json(createSuccessResponse('Cart item removed successfully', cartItem));
    }
}
