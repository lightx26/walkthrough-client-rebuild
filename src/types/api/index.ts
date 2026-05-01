interface ApiResponse {
  success: boolean;
  message: string;
}

export interface DataResponse<T> extends ApiResponse {
  data: T;
}

export interface ErrorResponse extends ApiResponse {
  errorCode?: string;
  errors?: Record<string, string>;
}

export interface ListData<T> {
  items: T[];
}

export interface PageData<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface SliceData<T> {
  items: T[];
  hasNext: boolean;
}
