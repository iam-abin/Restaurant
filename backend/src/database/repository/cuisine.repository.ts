import { ClientSession } from 'mongoose';
import { singleton } from 'tsyringe';
import { ICuisineDocument, CuisineModel } from '../model';

@singleton()
export class CuisineRepository {
     createCuisine= async (cuisineData: { name: string }, session?: ClientSession): Promise<ICuisineDocument> =>{
        const cuisine: ICuisineDocument[] = await CuisineModel.create([cuisineData], { session });
        return cuisine[0];
    }

     findCuisineByName= async (cuisine: string): Promise<ICuisineDocument | null> =>{
        return await CuisineModel.findOne({ name: cuisine });
    }

     findCuisines= async (limit?: number): Promise<ICuisineDocument[]> =>{
        return await CuisineModel.find().limit(limit ?? 0); // limit(0) is equivalent to setting no limit.
    }

     searchCuisinesByName= async (searchText: string, limit?: number): Promise<ICuisineDocument[]> =>{
        const regex: RegExp = new RegExp(searchText, 'i');
        return await CuisineModel.find({ name: { $regex: regex } }).limit(limit ?? 0);
    }
}
