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

    public async createMenu(
        userId: string,
        menuData: Omit<IMenu, 'imageUrl' | 'restaurantId' | 'cuisineId'>,
        file: Express.Multer.File,
    ): Promise<IMenuDocument> {
        
        return executeTransaction(async (session) => {
            const restaurant: IRestaurantDocument = await this.validateRestaurantOwnership(userId);
            const { cuisine } = menuData;

            const addressData: IAddressDocument | null = await this.addressRepository.findByUserId(userId);
            if (!addressData) throw new BadRequestError('Must have address to create menu');
            if (!addressData.city && !addressData.country)
                throw new BadRequestError('Must have city and country to create menu');

            const cuisineData: ICuisineDocument | null = await this.handleCuisine(
                cuisine,
                restaurant._id.toString(),
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
            return menu;
        });
    }

    public async getMenus(restaurantId: string, page: number, limit: number): Promise<Menus> {
        const restaurant = await this.restaurantRepository.findRestaurant(restaurantId);
        if (!restaurant) throw new NotFoundError('Restaurant not found');
        const skip: number = getPaginationSkipValue(page, limit);

        const [menus, myOrdersCount]: [IMenuDocument[], number] = await Promise.all([
            this.menuRepository.findMenus(restaurantId, skip, limit),
            this.menuRepository.countRestaurantMenus(restaurantId),
        ]);

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
        return executeTransaction(async(session)=>{
            
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

            const updatedMenu: IMenuDocument | null = await this.menuRepository.update(menuId, {
                ...updateData,
                cuisineId: cuisineData._id.toString(),
                imageUrl,
            });
            return updatedMenu;
        })
     
    }

    private async validateRestaurantOwnership(userId: string): Promise<IRestaurantDocument> {
        const restaurant: IRestaurantDocument | null =
            await this.restaurantRepository.findMyRestaurant(userId);
        if (!restaurant) throw new NotFoundError('Restaurant not found');
        return restaurant;
    }

    private async handleCuisine(
        cuisineName: string,
        restaurantId: string,
        session: mongoose.ClientSession,
    ): Promise<ICuisineDocument> {
        let cuisine = await this.cuisineRepository.findCuisineByName(cuisineName);
        if (!cuisine) {
            cuisine = await this.cuisineRepository.createCuisine({ name: cuisineName }, session);
        }

        const restaurantCuisine = await this.restaurantCuisineRepository.findRestaurantCuisine(
            restaurantId,
            cuisine._id.toString(),
        );
        if (!restaurantCuisine) {
            await this.restaurantCuisineRepository.create(
                { cuisineId: cuisine._id.toString(), restaurantId },
                session,
            );
        }

        return cuisine;
    }
}
