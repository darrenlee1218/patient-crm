export interface IPaginatedResults<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface PaginatedModel<TDocument> {
  paginate(filter: any, options: any): Promise<IPaginatedResults<TDocument>>;
}

export enum SORT_ORDER {
  DESC = "desc",
  ASC = "asc",
}

export interface IOptions {
  sortBy?: string;
  orderBy?: SORT_ORDER;
  limit?: number;
  page?: number;
  cached?: boolean;
}
