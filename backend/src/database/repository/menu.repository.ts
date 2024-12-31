import mongoose from 'mongoose';
import { IMenu } from '../../types';
import { IMenuDocument, MenuModel } from '../model';

export class MenuRepository {
    async create(menuData: IMenu, session?: mongoose.ClientSession): Promise<IMenuDocument> {
        const menu: IMenuDocument[] = await MenuModel.create([menuData], { session });
        return menu[0];
    }

    async findMenu(menuId: string): Promise<IMenuDocument | null> {
        return await MenuModel.findById(menuId);
    }

    async findMenus(restaurantId: string, skip: number, limit: number): Promise<IMenuDocument[]> {
        return await MenuModel.find({ restaurantId })
            .skip(skip ?? 0)
            .limit(limit ?? 0);
    }

    async update(menuId: string, updatedData: Partial<IMenu>): Promise<IMenuDocument | null> {
        const menu: IMenuDocument | null = await MenuModel.findByIdAndUpdate(menuId, updatedData, {
            new: true,
        });
        return menu;
    }

    async countRestaurantMenus(restaurantId: string): Promise<number> {
        return MenuModel.countDocuments({ restaurantId });
    }
}
