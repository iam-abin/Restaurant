import { ClientSession } from 'mongoose';
import { singleton } from 'tsyringe';
import { ICuisineDocument, CuisineModel } from '../models';

@singleton()
export class CuisineRepository {
    private readonly excludedFields: string[] = ['-createdAt', '-updatedAt', '-__v'];

    createCuisine = async (
        cuisineData: { name: string },
        session?: ClientSession,
    ): Promise<ICuisineDocument> => {
        const cuisine: ICuisineDocument[] = await CuisineModel.create([cuisineData], { session });
        return cuisine[0];
    };

    findCuisineByName = async (cuisine: string): Promise<ICuisineDocument | null> => {
        return await CuisineModel.findOne({ name: cuisine })
            .select(this.excludedFields)
            .sort({ name: 1 })
            .lean<ICuisineDocument | null>();
    };

    findCuisines = async (limit: number = 0): Promise<ICuisineDocument[]> => {
        return await CuisineModel.find()
            .select(this.excludedFields)
            .limit(limit)
            .sort({ name: 1 })
            .lean<ICuisineDocument[]>();
    };

    searchCuisinesByName = async (searchText: string, limit: number = 0): Promise<ICuisineDocument[]> => {
        const regex: RegExp = new RegExp(searchText, 'i');
        return await CuisineModel.find({ name: { $regex: regex } })
            .select(this.excludedFields)
            .sort({ name: 1 })
            .limit(limit)
            .lean<ICuisineDocument[]>();
    };
}
