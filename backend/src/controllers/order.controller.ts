import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { createSuccessResponse } from '../utils';
import { IOrderDocument } from '../database/model';
import { OrderService } from '../services';
import { IJwtPayload, IOrder, Orders, OrderStatus, Pagination, RestaurantIdParam } from '../types';

@autoInjectable()
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    public addOrder = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.currentUser as IJwtPayload;

        const checkoutSessionData = req.body;
        const order = await this.orderService.createOrder(
            userId,
            checkoutSessionData as Pick<IOrder, 'restaurantId'>,
        );
        res.status(201).json(createSuccessResponse('Order created successfully', order));
    };

    public confirmOrderStripeWebhook = async (req: Request, res: Response): Promise<void> => {
        const signature = req.headers['stripe-signature'] as string | Buffer | Array<string>;
        const order = await this.orderService.confirmOrder(
            'confirmed',
            req.body,
            signature,
            // userId,
        );
        res.status(201).json(createSuccessResponse('Order Confirmed successfully', order));
    };

    public getRestaurantOrders = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.currentUser as IJwtPayload;
        const { restaurantId } = req.params as RestaurantIdParam;
        const { page = 1, limit = 10 } = req.query as Pagination;
        const orders: Orders = await this.orderService.getRestaurantOrders({
            restaurantId,
            ownerId: userId,
            page: page as number,
            limit: limit as number,
        });
        res.status(200).json(createSuccessResponse('Restaurant orders fetched successfully', orders));
    };

    public getMyOrders = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.currentUser as IJwtPayload;
        const { page = 1, limit = 10 } = req.query as Pagination;
        const orders: Orders = await this.orderService.getMyOrders(userId, page as number, limit as number);
        res.status(200).json(createSuccessResponse('Your orders fetched successfully', orders));
    };

    public updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.currentUser as IJwtPayload;
        const { orderId } = req.params as { orderId: string };
        const { status } = req.body as { status: OrderStatus };
        const order: IOrderDocument | null = await this.orderService.updateOrderStatus(
            orderId,
            status,
            userId,
        );
        res.status(200).json(createSuccessResponse('Order status updated successfully', order));
    };
}
