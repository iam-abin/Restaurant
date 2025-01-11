import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { createSuccessResponse } from '../utils';
import { IRatingDocument } from '../database/model';
import { RatingService } from '../services';
import { IRating } from '../types';

@autoInjectable()
export class RatingController {
    constructor(private readonly ratingService: RatingService) {}

    public async addRating(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        const rating: IRatingDocument | null = await this.ratingService.addRating(
            userId,
            req.body as Omit<IRating, 'userId'>,
        );
        res.status(201).json(createSuccessResponse('Rating updated successfully', rating));
    }
}
