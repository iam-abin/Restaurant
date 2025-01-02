import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { createSuccessResponse } from '../utils';
import { IRestaurantCuisineDocument, IRestaurantDocument } from '../database/model';
import { RestaurantService } from '../services';
import { IRestaurantResult, IRestaurantsData, IRestaurantUpdate, SearchData } from '../types';

const restaurantService = container.resolve(RestaurantService);

export type RestaurantWithCuisines = {
    restaurant: IRestaurantDocument | null;
    cuisines: IRestaurantCuisineDocument[];
    restaurantRating: number;
    restaurantRatingsCount: number;
};

class RestaurantController {
    public async editRestaurant(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        const file: Express.Multer.File = req.file!;
        const restaurants: IRestaurantDocument | null = await restaurantService.updateRestaurant(
            userId,
            req.body as IRestaurantUpdate,
            file,
        );
        res.status(200).json(createSuccessResponse('Restaurant updated successfully', restaurants));
    }

    public async getMyRestaurant(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        const restaurant: RestaurantWithCuisines = await restaurantService.getMyRestaurant(userId);
        res.status(200).json(createSuccessResponse('Your restaurant fetched successfully', restaurant));
    }

    public async getARestaurant(req: Request, res: Response): Promise<void> {
        const { restaurantId } = req.params;
        const { userId } = req.currentUser!;
        const restaurant: IRestaurantResult | null = await restaurantService.getARestaurant(
            restaurantId,
            userId,
        );
        res.status(200).json(createSuccessResponse('Restaurant fetched successfully', restaurant));
    }

    public async getRestaurants(req: Request, res: Response): Promise<void> {
        const { page = 1, limit = 10 } = req.query;
        const restaurantsData: IRestaurantsData = await restaurantService.getRestaurants(
            page as number,
            limit as number,
        );
        res.status(200).json(createSuccessResponse('Restaurants fetched successfully', restaurantsData));
    }

    public async searchRestaurant(req: Request, res: Response): Promise<void> {
        const searchText: string = req.params.searchText || ''; // From home page search bar
        const searchQuery: string = (req.query.searchQuery as string) || ''; // From search page search bar
        const { page = 1, limit = 10 } = req.query;
        const selectedCuisines: string = (req.query.selectedCuisines as string) || ''; // From filter area
        const restaurant: SearchData = await restaurantService.searchRestaurant({
            searchText,
            searchQuery,
            selectedCuisines,
            page: page as number,
            limit: limit as number,
        });
        res.status(200).json(createSuccessResponse('Searched restaurants fetched successfully', restaurant));
    }
}

export const restaurantController = new RestaurantController();
