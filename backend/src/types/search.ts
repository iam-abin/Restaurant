import { Pagination } from './pagination';

export type SearchQueryParams = Pagination & {
    searchText?: string;
};
