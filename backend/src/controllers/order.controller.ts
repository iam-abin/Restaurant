import { Request, Response } from 'express';
import { createSuccessResponse } from '../utils';
import { IOrderDocument } from '../database/model';
import { container } from 'tsyringe';
import { OrderService } from '../services';
import { IOrder } from '../types';

const orderService = container.resolve(OrderService);

type CheckoutSessionRequest = {
    cartItems: { menuId: string }[];
    deliveryDetails: {
        name: string;
        email: string;
        address: string;
        city: string;
    };
    restaurantId: string;
};

class OrderController {
    public async addOrder(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        const checkoutSessionData = req.body;
        const order = await orderService.createOrder(
            userId,
            checkoutSessionData as IOrder,
        );
        res.status(201).json(createSuccessResponse('Order created successfully', order));
    }

    public async confirmOrderStripeWebhook(req: Request, res: Response): Promise<void> {
        const sig = req.headers['stripe-signature'] as (string | string[] | Buffer );
        const order = await orderService.confirmOrder(
            "confirmed",
            req.body,
            sig,
            // userId,
        );
        res.status(201).json(createSuccessResponse('Order Confirmed successfully', order));
    }
    

    public async getRestaurantOrders(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        const { restaurantId } = req.params;

        const orders: IOrderDocument[] = await orderService.getOrders(restaurantId, userId);
        res.status(200).json(createSuccessResponse('Restaurant orders fetched successfully', orders));
    }

    public async getMyOrders(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        const orders: IOrderDocument[] = await orderService.getMyOrders(userId);
        res.status(200).json(createSuccessResponse('Your orders fetched successfully', orders));
    }

    public async updateOrderStatus(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        const { orderId } = req.params;
        const { status } = req.body;
        const order: IOrderDocument | null = await orderService.updateOrderStatus(orderId, status, userId);
        res.status(200).json(createSuccessResponse('Order status updated successfully', order));
    }
}

export const orderController = new OrderController();
