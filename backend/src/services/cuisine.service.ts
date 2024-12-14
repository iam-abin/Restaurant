import { autoInjectable } from 'tsyringe';
import { CuisineRepository } from '../database/repository';
import { ICuisineDocument } from '../database/model';

@autoInjectable()
export class CuisineService {
    constructor(private readonly cuisineRepository: CuisineRepository) {}

    public async searchCuisines(searchText: string): Promise<ICuisineDocument[]> {
        const limit: number = 5;
        if (!searchText) {
            return await this.cuisineRepository.findCuisines(limit);
        }
        // console.log("searchText 3", searchText);
        return await this.cuisineRepository.searchCuisines(searchText, limit);
    }

    public async getCuisines(): Promise<ICuisineDocument[]> {
        return await this.cuisineRepository.findCuisines();
    }
}
