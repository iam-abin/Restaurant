import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { createSuccessResponse } from '../utils';
import { CuisineService } from '../services';
import { ICuisineDocument } from '../database/model';

@autoInjectable()
export class CuisineController {
    constructor(private readonly cuisineService: CuisineService) {}

    public async getCuisines(req: Request, res: Response): Promise<void> {
        const cuisines: ICuisineDocument[] = await this.cuisineService.getCuisines();
        res.status(200).json(createSuccessResponse('Cuisines fetched successfully', cuisines));
    }

    public async searchCuisine(req: Request, res: Response): Promise<void> {
        const searchText: string = (req.query.searchText as string) || '';

        const cuisines: ICuisineDocument[] = await this.cuisineService.searchCuisines(searchText);
        res.status(200).json(createSuccessResponse('Searched cuisines fetched successfully', cuisines));
    }
}
