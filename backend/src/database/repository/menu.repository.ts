import { IMenu } from '../../types';
import { IMenuDocument, MenuModel } from '../model';

export class MenuRepository {
    async createMenu(menuData: IMenu): Promise<IMenuDocument> {
        const menu: IMenuDocument = await MenuModel.create(menuData);
        return menu;
    }

    async updateMenu(menuId: string, updatedData: Partial<IMenu>): Promise<IMenuDocument | null> {
        const menu: IMenuDocument | null = await MenuModel.findByIdAndUpdate(menuId, updatedData, {
            new: true,
        });
        return menu;
    }
}
