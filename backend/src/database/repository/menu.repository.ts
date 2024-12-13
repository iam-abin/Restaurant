import mongoose from 'mongoose';
import { IMenu } from '../../types';
import { IMenuDocument, MenuModel } from '../model';

export class MenuRepository {
    async create(menuData: IMenu, session?: mongoose.ClientSession): Promise<IMenuDocument> {
        const menu: IMenuDocument[] = await MenuModel.create([menuData], { session });
        return menu[0];
    }

    async findMenu(menuId: string): Promise<IMenuDocument | null> {
        console.log(menuId);

        const menu: IMenuDocument | null = await MenuModel.findById(menuId);
        return menu;
    }

    async findMenus(restaurantId: string): Promise<IMenuDocument[]> {
        const menu: IMenuDocument[] = await MenuModel.find({ restaurantId });
        return menu;
    }

    async update(menuId: string, updatedData: Partial<IMenu>): Promise<IMenuDocument | null> {
        const menu: IMenuDocument | null = await MenuModel.findByIdAndUpdate(menuId, updatedData, {
            new: true,
        });
        return menu;
    }
}
