import mongoose from 'mongoose';
import { autoInjectable } from 'tsyringe';
import { IMenu, Menus } from '../types';
import {
    AddressRepository,
    CuisineRepository,
    MenuRepository,
    RestaurantCuisineRepository,
    RestaurantRepository,
} from '../database/repository';
import { IAddressDocument, ICuisineDocument, IMenuDocument, IRestaurantDocument } from '../database/model';
import { getPaginationSkipValue, getPaginationTotalNumberOfPages, uploadImageOnCloudinary } from '../utils';
import { BadRequestError, NotFoundError } from '../errors';

@autoInjectable()
export class MenuService {
    constructor(
        private readonly menuRepository: MenuRepository,
        private readonly restaurantRepository: RestaurantRepository,
        private readonly cuisineRepository: CuisineRepository,
        private readonly restaurantCuisineRepository: RestaurantCuisineRepository,
        private readonly addressRepository: AddressRepository,
    ) {}

    public async createMenu(
        userId: string,
        menuData: Omit<IMenu, 'imageUrl' | 'restaurantId' | 'cuisineId'>,
        file: Express.Multer.File,
    ): Promise<IMenuDocument> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const restaurant: IRestaurantDocument = await this.validateRestaurantOwnership(userId);
            const { cuisine } = menuData;

            const addressData: IAddressDocument | null = await this.addressRepository.findByUserId(userId);
            if (!addressData) throw new BadRequestError('Must have address to create menu');
            if (!addressData.city && !addressData.country)
                throw new BadRequestError('Must have city and country to create menu');

            let cuisineData: ICuisineDocument | null = await this.cuisineRepository.findCuisine(cuisine);
            if (!cuisineData) {
                cuisineData = await this.cuisineRepository.createCuisine({ name: cuisine }, session);
            }
            const restaurantCuisine = await this.restaurantCuisineRepository.findRestaurantCuisine(
                restaurant._id.toString(),
                cuisineData._id.toString(),
            );
            if (!restaurantCuisine) {
                await this.restaurantCuisineRepository.create(
                    { cuisineId: cuisineData._id.toString(), restaurantId: restaurant._id.toString() },
                    session,
                );
            }

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

    public async getMenus(restaurantId: string, page: number, limit: number): Promise<Menus> {
        const restaurant = await this.restaurantRepository.findRestaurant(restaurantId);
        if (!restaurant) throw new NotFoundError('Restaurant not found');
        const skip: number = getPaginationSkipValue(page, limit);
        const menus: IMenuDocument[] = await this.menuRepository.findMenus(restaurantId, skip, limit);
        const myOrdersCount: number = await this.menuRepository.countRestaurantMenus(restaurantId);
        const numberOfPages: number = getPaginationTotalNumberOfPages(myOrdersCount, limit);
        return { menus, numberOfPages };
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
        await this.validateRestaurantOwnership(userId);

        const menu: IMenuDocument | null = await this.menuRepository.findMenu(menuId);
        if (!menu) throw new NotFoundError('Menu not found');

        if (updateData.salePrice && updateData.salePrice > menu.price) {
            throw new BadRequestError('Sale price must be less than or equal to the original price');
        }
        if (updateData.price && updateData.price < menu.salePrice) {
            throw new BadRequestError('price must be grater than or equal to the original sale price');
        }

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

    private async validateRestaurantOwnership(userId: string): Promise<IRestaurantDocument> {
        const restaurant: IRestaurantDocument | null =
            await this.restaurantRepository.findMyRestaurant(userId);
        if (!restaurant) throw new NotFoundError('Restaurant not found');
        return restaurant;
    }
}
