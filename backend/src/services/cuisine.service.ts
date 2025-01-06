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
        return await this.cuisineRepository.searchCuisinesByName(searchText, limit);
    }

    public async getCuisines(): Promise<ICuisineDocument[]> {
        return await this.cuisineRepository.findCuisines();
    }
}
