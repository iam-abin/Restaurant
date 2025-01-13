import mongoose from 'mongoose';
import { singleton } from 'tsyringe';
import { IMenu } from '../../types';
import { IMenuDocument, MenuModel } from '../model';

@singleton()
export class MenuRepository {
     create= async (menuData: IMenu, session?: mongoose.ClientSession): Promise<IMenuDocument> =>{
        const menu: IMenuDocument[] = await MenuModel.create([menuData], { session });
        return menu[0];
    }

     findMenu= async (menuId: string): Promise<IMenuDocument | null> =>{
        return await MenuModel.findById(menuId);
    }

     findMenus= async (restaurantId: string, skip: number, limit: number): Promise<IMenuDocument[]> =>{
        return await MenuModel.find({ restaurantId })
            .populate('cuisineId', ['-_id', 'name'])
            .sort({ updatedAt: -1 })
            .skip(skip ?? 0)
            .limit(limit ?? 0);
    }

     update= async (menuId: string, updatedData: Partial<IMenu>): Promise<IMenuDocument | null> =>{
        const menu: IMenuDocument | null = await MenuModel.findByIdAndUpdate(menuId, updatedData, {
            new: true,
        }).populate('cuisineId', ['-_id', 'name']);
        return menu;
    }

     countRestaurantMenus= async (restaurantId: string): Promise<number> =>{
        return MenuModel.countDocuments({ restaurantId });
    }
}
