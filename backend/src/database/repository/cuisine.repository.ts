import { ClientSession } from 'mongoose';
import { ICuisineDocument, CuisineModel } from '../model';

export class CuisineRepository {
    async insertCuisines(cuisines: { name: string }[], session?: ClientSession): Promise<ICuisineDocument[]> {
        return await CuisineModel.insertMany(cuisines, {
            ordered: true,
            session,
        });
    }

    async findArrayItems(cuisines: string[]): Promise<ICuisineDocument[]> {
        return await CuisineModel.find({ name: { $in: cuisines } });
    }
}
