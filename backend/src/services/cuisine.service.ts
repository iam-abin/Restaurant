import { autoInjectable } from 'tsyringe';
import { CuisineRepository } from '../database/repository';
import { ICuisineDocument } from '../database/model';

@autoInjectable()
export class CuisineService {
    constructor(private readonly cuisineRepository: CuisineRepository) {}

    public async searchCuisines(searchText: string): Promise<ICuisineDocument[]> {
        if (!searchText) {
            // console.log("searchText 2", searchText);
            return await this.cuisineRepository.findCuisines();
        }
        // console.log("searchText 3", searchText);
        return await this.cuisineRepository.searchCuisines(searchText);
    }
}
