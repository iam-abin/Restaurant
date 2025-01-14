export interface ICuisine {
    name: string;
    // description: string
}

export interface ICuisineResponse1 extends ICuisine {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cuisineId: any;
    _id: string;
}

export interface ICuisineResponse {
    cuisineId: ICuisine;
}
