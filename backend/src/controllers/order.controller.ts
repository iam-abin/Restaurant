import { Request, Response } from 'express';
import { createSuccessResponse } from '../utils';
import { IOrderDocument } from '../database/model';
import { container } from 'tsyringe';
import { OrderService } from '../services';
import { IOrder } from '../types';

const orderService = container.resolve(OrderService);

class OrderController {
    public async addOrder(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        const order: IOrderDocument | null = await orderService.createOrder(userId, req.body as IOrder);
        res.status(200).json(createSuccessResponse('Order created successfully', order));
    }
}

export const orderController = new OrderController();
