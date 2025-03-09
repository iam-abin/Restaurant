import mongoose, { ClientSession } from 'mongoose';
import { autoInjectable } from 'tsyringe';
import { IMenu, Menu } from '../types';
import {
    AddressRepository,
    CuisineRepository,
    MenuRepository,
    RestaurantCuisineRepository,
    RestaurantRepository,
} from '../database/repositories';
import {
    IAddressDocument,
    ICuisineDocument,
    IMenuDocument,
    IRestaurantCuisineDocument,
    IRestaurantDocument,
} from '../database/models';
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

    public createMenuItem = async (
        userId: string,
        menuData: Omit<IMenu, 'imageUrl' | 'restaurantId' | 'cuisineId'>,
        file: Express.Multer.File,
    ): Promise<IMenuDocument> => {
        return executeTransaction(async (session) => {
            const restaurant: IRestaurantDocument = await this.validateRestaurantOwnership(userId, session);
            const { cuisine } = menuData;
            if (!file) throw new BadRequestError('Must have image file to create menu');
            const addressData: IAddressDocument | null = await this.addressRepository.findAddressByUserId(
                userId,
                session,
            );
            if (!addressData) throw new BadRequestError('Must have address to create menu');

            // Ensure city and country are present
            const { city, country } = addressData;
            if (!city || !country) throw new BadRequestError('Must have city and country to create menu');

            const cuisineData: ICuisineDocument | null = await this.handleCuisine(
                cuisine,
                restaurant._id.toString(),
                session,
            );

            const imageUrl: string = await uploadImageOnCloudinary(file);
            const menu: IMenuDocument | null = await this.menuRepository.createMenuItem(
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

    public getMenu = async (restaurantId: string, page: number, limit: number): Promise<Menu> => {
        const restaurant: IRestaurantDocument | null =
            await this.restaurantRepository.findRestaurantById(restaurantId);
        if (!restaurant) throw new NotFoundError('Restaurant not found');
        const skip: number = getPaginationSkipValue(page, limit);

        const [menu, myOrdersCount]: [IMenuDocument[], number] = await Promise.all([
            this.menuRepository.findMenu(restaurantId, skip, limit),
            this.menuRepository.countRestaurantMenuItems(restaurantId),
        ]);

        const numberOfPages: number = getPaginationTotalNumberOfPages(myOrdersCount, limit);
        return { menu, numberOfPages };
    };

    public getMenuItem = async (menuId: string): Promise<IMenuDocument> => {
        const menu: IMenuDocument | null = await this.menuRepository.findMenuItemById(menuId);
        if (!menu) throw new NotFoundError('Menu not found');
        return menu;
    };

    public updateMenuItem = async (
        userId: string,
        menuItemId: string,
        updateData: Partial<IMenu>,
        file: Express.Multer.File,
    ): Promise<IMenuDocument | null> => {
        return executeTransaction(async (session) => {
            const restaurant: IRestaurantDocument = await this.validateRestaurantOwnership(userId, session);

            const menu: IMenuDocument | null = await this.menuRepository.findMenuItemById(
                menuItemId,
                session,
            );
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

            const updatedMenu: IMenuDocument | null = await this.menuRepository.updateMenuItem(
                menuItemId,
                {
                    ...updateData,
                    cuisineId: cuisineData._id.toString(),
                    imageUrl,
                },
                session,
            );
            return updatedMenu;
        });
    };

    public updateCloseMenuItemStatus = async (menuItemId: string): Promise<IMenuDocument | null> => {
        const menuItem: IMenuDocument | null = await this.menuRepository.findMenuItemById(menuItemId);
        if (!menuItem) throw new NotFoundError('This menuItem does not exist');

        const menuItemWithUpdatedBlockStatus: IMenuDocument | null = await this.menuRepository.updateMenuItem(
            menuItemId,
            {
                isClosed: !menuItem.isClosed,
            },
        );
        return menuItemWithUpdatedBlockStatus;
    };

    private validateRestaurantOwnership = async (
        userId: string,
        session?: ClientSession,
    ): Promise<IRestaurantDocument> => {
        const restaurant: IRestaurantDocument | null =
            await this.restaurantRepository.findRestaurantByOwnerId(userId, session);
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
