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
import {
    IAddressDocument,
    ICuisineDocument,
    IMenuDocument,
    IRestaurantCuisineDocument,
    IRestaurantDocument,
} from '../database/model';
import {
    executeTransaction,
    getPaginationSkipValue,
    getPaginationTotalNumberOfPages,
    uploadImageOnCloudinary,
} from '../utils';
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

    public createMenu = async (
        userId: string,
        menuData: Omit<IMenu, 'imageUrl' | 'restaurantId' | 'cuisineId'>,
        file: Express.Multer.File,
    ): Promise<IMenuDocument> => {
        return executeTransaction(async (session) => {
            const restaurant: IRestaurantDocument = await this.validateRestaurantOwnership(userId);
            const { cuisine } = menuData;

            const addressData: IAddressDocument | null =
                await this.addressRepository.findAddressByUserId(userId);
            if (!addressData) throw new BadRequestError('Must have address to create menu');
            if (!addressData.city && !addressData.country)
                throw new BadRequestError('Must have city and country to create menu');

            const cuisineData: ICuisineDocument | null = await this.handleCuisine(
                cuisine,
                restaurant._id.toString(),
                session,
            );

            const imageUrl: string = await uploadImageOnCloudinary(file);
            const menu: IMenuDocument | null = await this.menuRepository.createMenu(
                {
                    ...menuData,
                    restaurantId: restaurant._id.toString(),
                    cuisineId: cuisineData._id.toString(),
                    imageUrl,
                },
                session,
            );
            return menu;
        });
    };

    public getMenus = async (restaurantId: string, page: number, limit: number): Promise<Menus> => {
        const restaurant: IRestaurantDocument | null =
            await this.restaurantRepository.findRestaurantById(restaurantId);
        if (!restaurant) throw new NotFoundError('Restaurant not found');
        const skip: number = getPaginationSkipValue(page, limit);

        const [menus, myOrdersCount]: [IMenuDocument[], number] = await Promise.all([
            this.menuRepository.findMenus(restaurantId, skip, limit),
            this.menuRepository.countRestaurantMenus(restaurantId),
        ]);

        const numberOfPages: number = getPaginationTotalNumberOfPages(myOrdersCount, limit);
        return { menus, numberOfPages };
    };

    public getMenu = async (menuId: string): Promise<IMenuDocument> => {
        const menu: IMenuDocument | null = await this.menuRepository.findMenu(menuId);
        if (!menu) throw new NotFoundError('Menu not found');
        return menu;
    };

    public updateMenu = async (
        userId: string,
        menuId: string,
        updateData: Partial<IMenu>,
        file: Express.Multer.File,
    ): Promise<IMenuDocument | null> => {
        return executeTransaction(async (session) => {
            const restaurant: IRestaurantDocument = await this.validateRestaurantOwnership(userId);

            const menu: IMenuDocument | null = await this.menuRepository.findMenu(menuId);
            if (!menu) throw new NotFoundError('Menu not found');

            if (updateData.salePrice && updateData.salePrice > menu.price) {
                throw new BadRequestError('Sale price must be less than or equal to the original price');
            }
            if (updateData.price && updateData.price < menu.salePrice) {
                throw new BadRequestError('price must be grater than or equal to the original sale price');
            }

            const { cuisine } = updateData;
            let cuisineData: ICuisineDocument | null = null;
            if (cuisine) {
                cuisineData = await this.handleCuisine(cuisine, restaurant._id.toString(), session);
            }

            if (!cuisineData) throw new BadRequestError('Menu must have a cuisine');

            let imageUrl: string | undefined;
            if (file) {
                imageUrl = await uploadImageOnCloudinary(file);
            }

            const updatedMenu: IMenuDocument | null = await this.menuRepository.updateMenu(menuId, {
                ...updateData,
                cuisineId: cuisineData._id.toString(),
                imageUrl,
            });
            return updatedMenu;
        });
    };

    private validateRestaurantOwnership = async (userId: string): Promise<IRestaurantDocument> => {
        const restaurant: IRestaurantDocument | null =
            await this.restaurantRepository.findMyRestaurant(userId);
        if (!restaurant) throw new NotFoundError('Restaurant not found');
        return restaurant;
    };

    private handleCuisine = async (
        cuisineName: string,
        restaurantId: string,
        session: mongoose.ClientSession,
    ): Promise<ICuisineDocument> => {
        let cuisine: ICuisineDocument | null = await this.cuisineRepository.findCuisineByName(cuisineName);
        if (!cuisine) {
            cuisine = await this.cuisineRepository.createCuisine({ name: cuisineName }, session);
        }

        const restaurantCuisine: IRestaurantCuisineDocument | null =
            await this.restaurantCuisineRepository.findRestaurantCuisine(
                restaurantId,
                cuisine._id.toString(),
            );
        if (!restaurantCuisine) {
            await this.restaurantCuisineRepository.createRestaurant(
                { cuisineId: cuisine._id.toString(), restaurantId },
                session,
            );
        }

        return cuisine;
    };
}
