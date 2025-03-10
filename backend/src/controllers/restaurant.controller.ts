import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { createSuccessResponse } from '../utils';
import { IRestaurantDocument } from '../database/models';
import { RestaurantService } from '../services';
import {
    IJwtPayload,
    IRestaurantResult,
    IRestaurantsData,
    IRestaurantUpdate,
    IRestaurantWithCuisines,
    ISearchRestaurantData,
    Pagination,
    RestaurantId,
    SearchFilterData,
    SearchQueryParams,
} from '../types';
import { DEFAULT_LIMIT_VALUE, DEFAULT_PAGE_VALUE, HTTP_STATUS_CODE } from '../constants';

@autoInjectable()
export class RestaurantController {
    constructor(private readonly restaurantService: RestaurantService) {}

    public editRestaurant = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.currentUser as IJwtPayload;
        const file: Express.Multer.File = req.file!;
        const restaurants: IRestaurantDocument | null = await this.restaurantService.updateRestaurant(
            userId,
            req.body as IRestaurantUpdate,
            file,
        );
        res.status(HTTP_STATUS_CODE.OK).json(
            createSuccessResponse('Restaurant updated successfully', restaurants),
        );
    };

    public getMyRestaurant = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.currentUser as IJwtPayload;
        const restaurant: IRestaurantWithCuisines = await this.restaurantService.getMyRestaurant(userId);
        res.status(HTTP_STATUS_CODE.OK).json(
            createSuccessResponse('Your restaurant fetched successfully', restaurant),
        );
    };

    public getARestaurant = async (req: Request, res: Response): Promise<void> => {
        const { restaurantId } = req.params as RestaurantId;
        const { userId } = req.currentUser as IJwtPayload;
        const restaurant: IRestaurantResult | null = await this.restaurantService.getARestaurant(
            restaurantId,
            userId,
        );
        res.status(HTTP_STATUS_CODE.OK).json(
            createSuccessResponse('Restaurant fetched successfully', restaurant),
        );
    };

    public getRestaurants = async (req: Request, res: Response): Promise<void> => {
        const { page = DEFAULT_PAGE_VALUE, limit = DEFAULT_LIMIT_VALUE } = req.query as Pagination;
        const restaurantsData: IRestaurantsData = await this.restaurantService.getRestaurants(
            page as number,
            limit as number,
        );
        res.status(HTTP_STATUS_CODE.OK).json(
            createSuccessResponse('Restaurants fetched successfully', restaurantsData),
        );
    };

    public searchRestaurant = async (req: Request, res: Response): Promise<void> => {
        const {
            searchText,
            page = DEFAULT_PAGE_VALUE,
            limit = DEFAULT_LIMIT_VALUE,
        } = req.query as SearchQueryParams;
        const profilesData: ISearchRestaurantData = await this.restaurantService.searchRestaurantByName(
            searchText as string,
            page as number,
            limit as number,
        );
        res.status(HTTP_STATUS_CODE.OK).json(
            createSuccessResponse('User Profiles fetched successfully', profilesData),
        );
    };

    public searchFilterRestaurant = async (req: Request, res: Response): Promise<void> => {
        const searchText: string = (req.query.searchText as string) || ''; // From home page search bar
        const searchQuery: string = (req.query.searchQuery as string) || ''; // From search page search bar
        const selectedCuisines: string = (req.query.selectedCuisines as string) || ''; // From filter area
        const { page = DEFAULT_PAGE_VALUE, limit = DEFAULT_LIMIT_VALUE } = req.query as Pagination;
        const restaurant: SearchFilterData = await this.restaurantService.searchFilterRestaurant({
            searchText,
            searchQuery,
            selectedCuisines,
            page: page as number,
            limit: limit as number,
        });
        res.status(HTTP_STATUS_CODE.OK).json(
            createSuccessResponse('Searched restaurants fetched successfully', restaurant),
        );
    };
}
