import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { createSuccessResponse } from '../utils';
import { ICartDocument } from '../database/model';
import { CartService } from '../services';
import { ICart, ICartItemsData, IJwtPayload, Pagination, RestaurantIdParam } from '../types';

@autoInjectable()
export class CartController {
    constructor(private readonly cartService: CartService) {}

    public addToCart = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.currentUser as IJwtPayload;
        const cartItem: ICartDocument = await this.cartService.createCartItem(
            userId,
            req.body as Pick<ICart, 'itemId' | 'restaurantId'>,
        );
        res.status(201).json(createSuccessResponse('Item added to cart successfully', cartItem));
    };

    public getCartItems = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.currentUser as IJwtPayload;
        const { restaurantId } = req.params as RestaurantIdParam;
        const { page = 1, limit = 10 } = req.query as Pagination;
        const cartItems: ICartItemsData = await this.cartService.getCartItemsByRestaurant({
            userId,
            restaurantId,
            page: page as number,
            limit: limit as number,
        });
        res.status(200).json(createSuccessResponse('Cart items fetched successfully', cartItems));
    };

    public updateQuantity = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.currentUser as IJwtPayload;
        const { cartItemId } = req.params;
        const { quantity } = req.body;

        const cartItem: ICartDocument | null = await this.cartService.updateItemQuantity(
            userId,
            cartItemId,
            quantity,
        );
        res.status(200).json(createSuccessResponse('Cart item quantity updated successfully', cartItem));
    };

    public removeCartItems = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.currentUser as IJwtPayload;
        const cartItems: { deleted: boolean } = await this.cartService.removeCartItems(userId);
        res.status(200).json(createSuccessResponse('Cart items removed successfully', cartItems));
    };

    public removeCartItem = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.currentUser as IJwtPayload;
        const { cartItemId } = req.params;
        const cartItem: ICartDocument = await this.cartService.removeCartItem(cartItemId, userId);
        res.status(200).json(createSuccessResponse('Cart item removed successfully', cartItem));
    };
}
