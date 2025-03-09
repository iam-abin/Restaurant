import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { createSuccessResponse } from '../utils';
import { ICartDocument } from '../database/models';
import { CartService } from '../services';
import { CartItemId, ICart, ICartItemsData, IJwtPayload, Pagination, Quantity, RestaurantId } from '../types';
import { DEFAULT_LIMIT_VALUE, DEFAULT_PAGE_VALUE, HTTP_STATUS_CODE } from '../constants';

@autoInjectable()
export class CartController {
    constructor(private readonly cartService: CartService) {}

    public addToCart = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.currentUser as IJwtPayload;
        const cartItem: ICartDocument = await this.cartService.createCartItem(
            userId,
            req.body as Pick<ICart, 'itemId' | 'restaurantId'>,
        );
        res.status(HTTP_STATUS_CODE.CREATED).json(
            createSuccessResponse('Item added to cart successfully', cartItem),
        );
    };

    public getCartItems = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.currentUser as IJwtPayload;
        const { restaurantId } = req.params as RestaurantId;
        const { page = DEFAULT_PAGE_VALUE, limit = DEFAULT_LIMIT_VALUE } = req.query as Pagination;
        const cartItems: ICartItemsData = await this.cartService.getCartItemsByRestaurant({
            userId,
            restaurantId,
            page: page as number,
            limit: limit as number,
        });
        res.status(HTTP_STATUS_CODE.OK).json(
            createSuccessResponse('Cart items fetched successfully', cartItems),
        );
    };

    public updateQuantity = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.currentUser as IJwtPayload;
        const { cartItemId } = req.params as CartItemId;
        const { quantity } = req.body as Quantity;

        const cartItem: ICartDocument | null = await this.cartService.updateItemQuantity(
            userId,
            cartItemId,
            quantity,
        );
        res.status(HTTP_STATUS_CODE.OK).json(
            createSuccessResponse('Cart item quantity updated successfully', cartItem),
        );
    };

    public removeCartItems = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.currentUser as IJwtPayload;
        const cartItems: { deleted: boolean } = await this.cartService.removeCartItems(userId);
        res.status(HTTP_STATUS_CODE.OK).json(
            createSuccessResponse('Cart items removed successfully', cartItems),
        );
    };

    public removeCartItem = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.currentUser as IJwtPayload;
        const { cartItemId } = req.params as CartItemId;
        const cartItem: ICartDocument = await this.cartService.removeCartItem(cartItemId, userId);
        res.status(HTTP_STATUS_CODE.OK).json(
            createSuccessResponse('Cart item removed successfully', cartItem),
        );
    };
}
