import { autoInjectable } from 'tsyringe';
import { IMenu, IRestaurantResponse } from '../types';
import {
    CuisineRepository,
    MenuRepository,
    RestaurantCuisineRepository,
    RestaurantRepository,
} from '../database/repository';
import { ICuisineDocument, IMenuDocument, IRestaurantDocument } from '../database/model';
import { uploadImageOnCloudinary } from '../utils';
import { BadRequestError, ForbiddenError, NotFoundError } from '../errors';
import mongoose from 'mongoose';

@autoInjectable()
export class MenuService {
    constructor(
        private readonly menuRepository: MenuRepository,
        private readonly restaurantRepository: RestaurantRepository,
        private readonly cuisineRepository: CuisineRepository,
        private readonly restaurantCuisineRepository: RestaurantCuisineRepository,
    ) {}

    public async createMenu(
        userId: string,
        menuData: Omit<IMenu, 'imageUrl' | 'restaurantId' | 'cuisineId'>,
        file: Express.Multer.File,
    ): Promise<IMenuDocument> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const restaurant: IRestaurantDocument | null =
                await this.restaurantRepository.findMyRestaurant(userId);
            if (!restaurant) throw new NotFoundError('Restaurant not found');
            if (restaurant?.isBlocked) throw new BadRequestError('This restaurant is blocked');

            const { cuisine } = menuData;
            const restaurantId = restaurant._id.toString();

            let cuisineData: ICuisineDocument | null = await this.cuisineRepository.findCuisine(cuisine);
            if (!cuisineData) {
                cuisineData = await this.cuisineRepository.createCuisine({ name: cuisine }, session);
            }
            await this.restaurantCuisineRepository.create(
                { cuisineId: cuisineData._id.toString(), restaurantId },
                session,
            );

            const imageUrl: string = await uploadImageOnCloudinary(file);
            const menu: IMenuDocument | null = await this.menuRepository.create(
                {
                    ...menuData,
                    restaurantId: restaurant._id.toString(),
                    cuisineId: cuisineData._id.toString(),
                    imageUrl,
                },
                session,
            );
            // Commit the transaction
            await session.commitTransaction();
            return menu;
        } catch (error) {
            // Rollback the transaction if something goes wrong
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    public async getMenus(restaurantId: string): Promise<IMenuDocument[]> {
        const restaurant = await this.restaurantRepository.findRestaurant(restaurantId);
        if (!restaurant) throw new NotFoundError('Restaurant not found');
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
        const restaurant: IRestaurantResponse | null = await this.restaurantRepository.findRestaurant(
            menu.restaurantId.toString(),
        );
        if (!restaurant) throw new NotFoundError('Restaurant not found');

        if ('id' in restaurant.owner! && userId !== restaurant.owner._id.toString())
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
