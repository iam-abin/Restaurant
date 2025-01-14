export interface ICuisine {
    name: string;
    // description: string
}

export interface ICuisineResponse1 extends ICuisine {
    cuisineId: any;
    _id: string;
}

export interface ICuisineResponse {
    cuisineId: ICuisine;
}
