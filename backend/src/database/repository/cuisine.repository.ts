import { ClientSession } from 'mongoose';
import { ICuisineDocument, CuisineModel } from '../model';

export class CuisineRepository {
    async createCuisine(cuisineData: { name: string }, session?: ClientSession): Promise<ICuisineDocument> {
        const cuisine: ICuisineDocument[] = await CuisineModel.create([cuisineData], { session });
        return cuisine[0];
    }

    async findCuisine(cuisine: string): Promise<ICuisineDocument | null> {
        return await CuisineModel.findOne({ name: cuisine });
    }

    async findCuisines(limit?: number): Promise<ICuisineDocument[]> {
        return await CuisineModel.find().limit(limit ?? 0); // limit(0) is equivalent to setting no limit.
    }

    async searchCuisines(searchText: string, limit: number): Promise<ICuisineDocument[]> {
        const regex: RegExp = new RegExp(searchText, 'i');
        return await CuisineModel.find({ name: { $regex: regex } }).limit(limit);
    }
}
