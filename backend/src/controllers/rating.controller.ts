import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { createSuccessResponse } from '../utils';
import { IRatingDocument } from '../database/model';
import { RatingService } from '../services';
import { IJwtPayload, IRating } from '../types';
import { HTTP_STATUS_CODE } from '../constants';

@autoInjectable()
export class RatingController {
    constructor(private readonly ratingService: RatingService) {}

    public addRating = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.currentUser as IJwtPayload;
        const rating: IRatingDocument | null = await this.ratingService.addRating(
            userId,
            req.body as Omit<IRating, 'userId'>,
        );
        res.status(HTTP_STATUS_CODE.CREATED).json(
            createSuccessResponse('Rating updated successfully', rating),
        );
    };
}
