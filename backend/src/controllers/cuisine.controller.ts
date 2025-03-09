import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { createSuccessResponse } from '../utils';
import { CuisineService } from '../services';
import { ICuisineDocument } from '../database/models';
import { HTTP_STATUS_CODE } from '../constants';

@autoInjectable()
export class CuisineController {
    constructor(private readonly cuisineService: CuisineService) {}

    public getCuisines = async (req: Request, res: Response): Promise<void> => {
        const cuisines: ICuisineDocument[] = await this.cuisineService.getCuisines();
        res.status(HTTP_STATUS_CODE.OK).json(
            createSuccessResponse('Cuisines fetched successfully', cuisines),
        );
    };

    public searchCuisine = async (req: Request, res: Response): Promise<void> => {
        const searchText: string = (req.query.searchText as string) || '';

        const cuisines: ICuisineDocument[] = await this.cuisineService.searchCuisines(searchText);
        res.status(HTTP_STATUS_CODE.OK).json(
            createSuccessResponse('Searched cuisines fetched successfully', cuisines),
        );
    };
}
