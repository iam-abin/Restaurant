import { IMenu } from '../../types';
import { IMenuDocument, MenuModel } from '../model';

export class MenuRepository {
    async create(menuData: IMenu): Promise<IMenuDocument> {
        const menu: IMenuDocument = await MenuModel.create(menuData);
        return menu;
    }

    async findMenu(menuId: string): Promise<IMenuDocument | null> {
        const menu: IMenuDocument | null = await MenuModel.findById(menuId);
        return menu;
    }

    async findMenus(restaurantId: string): Promise<IMenuDocument[] | []> {
        const menu: IMenuDocument[] | [] = await MenuModel.find({ restaurantId });
        return menu;
    }

    async update(menuId: string, updatedData: Partial<IMenu>): Promise<IMenuDocument | null> {
        const menu: IMenuDocument | null = await MenuModel.findByIdAndUpdate(menuId, updatedData, {
            new: true,
        });
        return menu;
    }
}
