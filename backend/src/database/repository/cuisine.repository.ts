import { ClientSession } from 'mongoose';
import { singleton } from 'tsyringe';
import { ICuisineDocument, CuisineModel } from '../model';

@singleton()
export class CuisineRepository {
    createCuisine = async (
        cuisineData: { name: string },
        session?: ClientSession,
    ): Promise<ICuisineDocument> => {
        const cuisine: ICuisineDocument[] = await CuisineModel.create([cuisineData], { session });
        return cuisine[0];
    };

    findCuisineByName = async (cuisine: string): Promise<ICuisineDocument | null> => {
        return await CuisineModel.findOne({ name: cuisine })
            .select(['-createdAt', '-updatedAt'])
            .sort({ name: 1 })
            .lean<ICuisineDocument | null>();
    };

    findCuisines = async (limit?: number): Promise<ICuisineDocument[]> => {
        return await CuisineModel.find()
            .select(['-createdAt', '-updatedAt'])
            .limit(limit ?? 0)
            .sort({ name: 1 })
            .lean<ICuisineDocument[]>();
    };

    searchCuisinesByName = async (searchText: string, limit?: number): Promise<ICuisineDocument[]> => {
        const regex: RegExp = new RegExp(searchText, 'i');
        return await CuisineModel.find({ name: { $regex: regex } })
            .select(['-createdAt', '-updatedAt'])
            .sort({ name: 1 })
            .limit(limit ?? 0)
            .lean<ICuisineDocument[]>();
    };
}
