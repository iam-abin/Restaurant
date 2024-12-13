import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { createSuccessResponse } from '../utils';
import { CuisineService } from '../services';
import { ICuisineDocument } from '../database/model';

const cuisineService = container.resolve(CuisineService);

class CuisineController {
    public async searchCuisine(req: Request, res: Response): Promise<void> {
        const searchText: string = (req.query.searchText as string) || '';

        const cuisines: ICuisineDocument[] = await cuisineService.searchCuisines(searchText);
        res.status(200).json(createSuccessResponse('Searched cuisines fetched successfully', cuisines));
    }
}

export const cuisineController = new CuisineController();
