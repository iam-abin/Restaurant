import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { createSuccessResponse } from '../utils';
import { IOrderDocument } from '../database/model';
import { OrderService } from '../services';
import { IOrder, Orders } from '../types';

@autoInjectable()
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    public async addOrder(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        const checkoutSessionData = req.body;
        const order = await this.orderService.createOrder(
            userId,
            checkoutSessionData as Pick<IOrder, 'restaurantId'>,
        );
        res.status(201).json(createSuccessResponse('Order created successfully', order));
    }

    public async confirmOrderStripeWebhook(req: Request, res: Response): Promise<void> {
        const signature = req.headers['stripe-signature'] as string | Buffer | Array<string>;
        const order = await this.orderService.confirmOrder(
            'confirmed',
            req.body,
            signature,
            // userId,
        );
        res.status(201).json(createSuccessResponse('Order Confirmed successfully', order));
    }

    public async getRestaurantOrders(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        const { restaurantId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const orders: Orders = await this.orderService.getRestaurantOrders({
            restaurantId,
            ownerId: userId,
            page: page as number,
            limit: limit as number,
        });
        res.status(200).json(createSuccessResponse('Restaurant orders fetched successfully', orders));
    }

    public async getMyOrders(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        const { page = 1, limit = 10 } = req.query;

        const orders: Orders = await this.orderService.getMyOrders(userId, page as number, limit as number);
        res.status(200).json(createSuccessResponse('Your orders fetched successfully', orders));
    }

    public async updateOrderStatus(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        const { orderId } = req.params;
        const { status } = req.body;
        const order: IOrderDocument | null = await this.orderService.updateOrderStatus(
            orderId,
            status,
            userId,
        );
        res.status(200).json(createSuccessResponse('Order status updated successfully', order));
    }
}
