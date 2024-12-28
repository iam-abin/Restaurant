import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { createSuccessResponse } from '../utils';
import { IRatingDocument } from '../database/model';
import { RatingService } from '../services';
import { IRating } from '../types';

const ratingService = container.resolve(RatingService);

class RatingController {
    public async addRating(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        const rating: IRatingDocument | null = await ratingService.addRating(
            userId,
            req.body as Omit<IRating, 'userId'>,
        );
        res.status(201).json(createSuccessResponse('Rating updated successfully', rating));
    }
}

export const ratingController = new RatingController();
