import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { createSuccessResponse } from '../utils';
import { IOrderDocument } from '../database/model';
import { OrderService } from '../services';
import { IOrder, Orders } from '../types';

const orderService = container.resolve(OrderService);

// type CheckoutSessionRequest = {
//     cartItems: { menuId: string }[];
//     deliveryDetails: {
//         name: string;
//         email: string;
//         address: string;
//         city: string;
//     };
//     restaurantId: string;
// };

class OrderController {
    public async addOrder(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        const checkoutSessionData = req.body;
        const order = await orderService.createOrder(
            userId,
            checkoutSessionData as Pick<IOrder, 'restaurantId'>,
        );
        res.status(201).json(createSuccessResponse('Order created successfully', order));
    }

    public async confirmOrderStripeWebhook(req: Request, res: Response): Promise<void> {
        const signature = req.headers['stripe-signature'] as string | Buffer | Array<string>;
        const order = await orderService.confirmOrder(
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
        const orders: Orders = await orderService.getRestaurantOrders({
            restaurantId,
            ownerId: userId,
            page: parseInt(page as string),
            limit: parseInt(limit as string),
        });
        res.status(200).json(createSuccessResponse('Restaurant orders fetched successfully', orders));
    }

    public async getMyOrders(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        const { page = 1, limit = 10 } = req.query;

        console.log('page ', page, 'limit ', limit);
        console.log('page ', typeof page, 'limit ', typeof limit);

        const orders: Orders = await orderService.getMyOrders(userId, page as number, limit as number);
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
