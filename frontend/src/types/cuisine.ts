export interface ICuisine {
    name: string;
    // description: string
}

export interface ICuisineResponse1 {
    _id: string
    name: string;
}

export interface ICuisineResponse {
    cuisineId: ICuisine;
}
