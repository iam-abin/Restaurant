import mongoose, { ClientSession } from 'mongoose';
import { singleton } from 'tsyringe';
import { IMenu } from '../../types';
import { IMenuDocument, MenuModel } from '../model';

@singleton()
export class MenuRepository {
    private readonly excludedFields: string[] = ['-createdAt', '-updatedAt', '-__v'];

    createMenuItem = async (menuData: IMenu, session?: mongoose.ClientSession): Promise<IMenuDocument> => {
        const menu: IMenuDocument[] = await MenuModel.create([menuData], { session });
        return menu[0];
    };

    findMenuItemById = async (
        menuItemId: string,
        session?: ClientSession | null,
    ): Promise<IMenuDocument | null> => {
        return await MenuModel.findById(menuItemId).session(session!).lean<IMenuDocument | null>();
    };

    findMenu = async (
        restaurantId: string,
        skip: number = 0,
        limit: number = 0,
    ): Promise<IMenuDocument[]> => {
        return await MenuModel.find({ restaurantId })
            .populate('cuisineId', ['-_id', 'name'])
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)
            .select(this.excludedFields)
            .lean<IMenuDocument[]>();
    };

    updateMenuItem = async (
        menuId: string,
        updatedData: Partial<IMenu>,
        session?: ClientSession,
    ): Promise<IMenuDocument | null> => {
        const menu: IMenuDocument | null = await MenuModel.findByIdAndUpdate(menuId, updatedData, {
            new: true,
            session,
        }).populate('cuisineId', ['-_id', 'name']);
        return menu;
    };

    countRestaurantMenuItems = async (restaurantId: string): Promise<number> => {
        return MenuModel.countDocuments({ restaurantId });
    };
}
