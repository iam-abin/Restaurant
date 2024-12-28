import { autoInjectable } from 'tsyringe';
import { IRating, IRestaurantResponse } from '../types';
import { RatingRepository, RestaurantRepository } from '../database/repository';
import { IRatingDocument } from '../database/model';
import { NotFoundError } from '../errors';

@autoInjectable()
export class RatingService {
    constructor(
        private readonly restaurantRepository: RestaurantRepository,
        private readonly RatingRepository: RatingRepository,
    ) {}

    public async addRating(
        userId: string,
        ratingData: Omit<IRating, 'userId'>,
    ): Promise<IRatingDocument | null> {
        const { restaurantId, rating } = ratingData;
        const restaurant: IRestaurantResponse | null =
            await this.restaurantRepository.findRestaurant(restaurantId);
        if (!restaurant) throw new NotFoundError('Restaurant not found');

        if (rating === 0) {
            await this.RatingRepository.deleteRating(userId, restaurantId);
            return null;
        } else {
            const ratingResponse: IRatingDocument | null = await this.RatingRepository.updateRating({
                userId,
                ...ratingData,
            });
            return ratingResponse;
        }
    }
}
