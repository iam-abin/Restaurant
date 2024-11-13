import { Request, Response } from 'express';
import { createSuccessResponse } from '../utils';
import { IRestaurantDocument } from '../database/model';
import { container } from 'tsyringe';
import { RestaurantService } from '../services';
import { IRestaurant } from '../types';

const restaurantService = container.resolve(RestaurantService);

class RestaurantController {
    public async editRestaurant(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        // const { restaurantId } = req.params;
        const file: Express.Multer.File = req.file!;
        const restaurant: IRestaurantDocument | null = await restaurantService.updateRestaurant(
            userId,
            req.body as Partial<Omit<IRestaurant, 'userId' | 'imageUrl'>>,
            file,
        );
        res.status(200).json(createSuccessResponse('Restaurant updated successfully', restaurant));
    }

    public async getMyRestaurant(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        const restaurant: IRestaurantDocument | null = await restaurantService.getMyRestaurant(userId);
        res.status(200).json(createSuccessResponse('Your restaurant fetched successfully', restaurant));
    }

    public async getARestaurant(req: Request, res: Response): Promise<void> {
        const { restaurantId } = req.params;
        const restaurant: IRestaurantDocument | null = await restaurantService.getARestaurant(restaurantId);
        res.status(200).json(createSuccessResponse('Restaurant fetched successfully', restaurant));
    }

    public async searchRestaurant(req: Request, res: Response): Promise<void> {
        const searchText: string = req.params.searchText || ''; // From home page search bar
        const searchQuery: string = (req.query.searchQuery as string) || ''; // From search page search bar
        const selectedCuisines: string = (req.query.selectedCuisines as string) || ''; // From filter area
        const restaurant: any[] | [] = await restaurantService.searchRestaurant(
            searchText,
            searchQuery,
            selectedCuisines,
        );
        res.status(200).json(createSuccessResponse('Restaurant fetched successfully', restaurant));
    }
}

export const restaurantController = new RestaurantController();
