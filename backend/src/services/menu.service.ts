import { autoInjectable } from 'tsyringe';
import { IMenu } from '../types';
import { MenuRepository } from '../database/repository';
import { IMenuDocument } from '../database/model';
import { uploadImageOnCloudinary } from '../utils';

@autoInjectable()
export class MenuService {
    constructor(private readonly menuRepository: MenuRepository) {}

    public async createMenu(
        userId: string,
        menuData: Omit<IMenu, 'imageUrl' | 'restaurantId'>,
        file: Express.Multer.File,
    ): Promise<IMenuDocument | null> {
        const imageUrl = await uploadImageOnCloudinary(file);

        const menu: IMenuDocument | null = await this.menuRepository.createMenu({
            ...menuData,
            restaurantId: userId,
            imageUrl,
        });

        return menu;
    }
}
