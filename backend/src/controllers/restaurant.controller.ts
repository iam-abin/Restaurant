import { Request, Response } from 'express';
import { createSuccessResponse } from '../utils';
import { IRestaurantDocument } from '../database/model';
import { container } from 'tsyringe';
import { RestaurantService } from '../services';
import { IRestaurant } from '../types';

const restaurantService = container.resolve(RestaurantService);

class RestaurantController {
    public async addRestaurant(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        const file: Express.Multer.File = req.file!;
        const restaurant: IRestaurantDocument | null = await restaurantService.createRestaurant(
            userId,
            req.body as Omit<IRestaurant, 'userId' | 'imageUrl'>,
            file,
        );
        res.status(200).json(createSuccessResponse('Restaurant created successfully', restaurant));
    }
}

export const restaurantController = new RestaurantController();
