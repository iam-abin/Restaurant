import { autoInjectable } from 'tsyringe';
import { IMenu } from '../types';
import { MenuRepository, RestaurantRepository } from '../database/repository';
import { IMenuDocument } from '../database/model';
import { uploadImageOnCloudinary } from '../utils';
import { BadRequestError } from '../errors';

@autoInjectable()
export class MenuService {
    constructor(
        private readonly menuRepository: MenuRepository,
        private readonly restaurantRepository: RestaurantRepository,
    ) {}

    public async createMenu(
        userId: string,
        menuData: Omit<IMenu, 'imageUrl' | 'restaurantId'>,
        file: Express.Multer.File,
    ): Promise<IMenuDocument | null> {
        const restaurant = await this.restaurantRepository.findMyRestaurant(userId);
        if (restaurant?.isBlocked) throw new BadRequestError('This restaurant is blocked');

        const imageUrl = await uploadImageOnCloudinary(file);

        const menu: IMenuDocument | null = await this.menuRepository.createMenu({
            ...menuData,
            restaurantId: userId,
            imageUrl,
        });

        return menu;
    }
}
