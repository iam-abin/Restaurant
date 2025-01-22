import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { createSuccessResponse } from '../utils';
import { IOrderDocument } from '../database/model';
import { OrderService } from '../services';
import { IJwtPayload, OrderId, Orders, OrderStatus, Pagination, RestaurantId, Status } from '../types';
import { DEFAULT_LIMIT_VALUE, DEFAULT_PAGE_VALUE, HTTP_STATUS_CODE } from '../constants';

@autoInjectable()
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    public addOrder = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.currentUser as IJwtPayload;

        const checkoutSessionData = req.body as RestaurantId;
        const order = await this.orderService.createOrder(userId, checkoutSessionData);
        res.status(HTTP_STATUS_CODE.CREATED).json(createSuccessResponse('Order created successfully', order));
    };

    public confirmOrderStripeWebhook = async (req: Request, res: Response): Promise<void> => {
        const signature = req.headers['stripe-signature'] as string | Buffer | Array<string>;
        const order = await this.orderService.confirmOrder(OrderStatus.CONFIRMED, req.body, signature);
        res.status(HTTP_STATUS_CODE.OK).json(createSuccessResponse('Order Confirmed successfully', order));
    };

    public getRestaurantOrders = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.currentUser as IJwtPayload;
        const { restaurantId } = req.params as RestaurantId;
        const { page = DEFAULT_PAGE_VALUE, limit = DEFAULT_LIMIT_VALUE } = req.query as Pagination;
        const orders: Orders = await this.orderService.getRestaurantOrders({
            restaurantId,
            ownerId: userId,
            page: page as number,
            limit: limit as number,
        });
        res.status(HTTP_STATUS_CODE.OK).json(
            createSuccessResponse('Restaurant orders fetched successfully', orders),
        );
    };

    public getMyOrders = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.currentUser as IJwtPayload;
        const { page = DEFAULT_PAGE_VALUE, limit = DEFAULT_LIMIT_VALUE } = req.query as Pagination;
        const orders: Orders = await this.orderService.getMyOrders(userId, page as number, limit as number);
        res.status(HTTP_STATUS_CODE.OK).json(
            createSuccessResponse('Your orders fetched successfully', orders),
        );
    };

    public updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.currentUser as IJwtPayload;
        const { orderId } = req.params as OrderId;
        const { status } = req.body as Status;
        const order: IOrderDocument | null = await this.orderService.updateOrderStatus(
            orderId,
            status,
            userId,
        );
        res.status(HTTP_STATUS_CODE.OK).json(
            createSuccessResponse('Order status updated successfully', order),
        );
    };
}
