import mongoose from 'mongoose';
import { singleton } from 'tsyringe';
import { IOrderedItem } from '../../types';
import { OrderedItemModel, IOrderedItemDocument } from '../model';

@singleton()
export class OrderedItemRepository {
    async create(
        orderedItemData: IOrderedItem[],
        session?: mongoose.ClientSession,
    ): Promise<IOrderedItemDocument[]> {
        const orderedItems: IOrderedItemDocument[] = await OrderedItemModel.insertMany(orderedItemData, {
            session,
        });
        return orderedItems;
    }
}
