import { autoInjectable } from 'tsyringe';
import { IMenu } from '../types';
import { MenuRepository, RestaurantRepository } from '../database/repository';
import { IMenuDocument, IRestaurantDocument } from '../database/model';
import { uploadImageOnCloudinary } from '../utils';
import { BadRequestError, ForbiddenError, NotFoundError } from '../errors';

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
    ): Promise<IMenuDocument> {
        const restaurant: IRestaurantDocument | null =
            await this.restaurantRepository.findMyRestaurant(userId);
        if (restaurant?.isBlocked) throw new BadRequestError('This restaurant is blocked');

        const imageUrl: string = await uploadImageOnCloudinary(file);

        const menu: IMenuDocument | null = await this.menuRepository.create({
            ...menuData,
            restaurantId: userId,
            imageUrl,
        });

        return menu;
    }

    public async getMenus(restaurantId: string): Promise<IMenuDocument[]> {
        const menus: IMenuDocument[] = await this.menuRepository.findMenus(restaurantId);
        return menus;
    }

    public async getMenu(menuId: string): Promise<IMenuDocument> {
        const menu: IMenuDocument | null = await this.menuRepository.findMenu(menuId);
        if (!menu) throw new NotFoundError('Menu not found');
        return menu;
    }

    public async updateMenu(
        userId: string,
        menuId: string,
        updateData: Partial<IMenu>,
        file: Express.Multer.File,
    ): Promise<IMenuDocument | null> {
        const menu: IMenuDocument | null = await this.menuRepository.findMenu(menuId);
        if (!menu) throw new NotFoundError('Menu not found');
        const restaurant: IRestaurantDocument | null = await this.restaurantRepository.findRestaurant(
            menu.restaurantId.toString(),
        );
        if (!restaurant) throw new NotFoundError('Restaurant not found');
        console.log(restaurant);

        if ('id' in restaurant.ownerId && userId !== restaurant.ownerId.id.toString())
            throw new ForbiddenError('You cannot modify others restaurant menu');

        let imageUrl: string | undefined;
        if (file) {
            imageUrl = await uploadImageOnCloudinary(file);
        }

        const updatedMenu: IMenuDocument | null = await this.menuRepository.update(menuId, {
            ...updateData,
            imageUrl,
        });
        return updatedMenu;
    }
}
