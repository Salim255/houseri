import { Injectable } from "@angular/core";
import { Product } from "../model/product.model";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";

export interface ApiMetaData {
  pagination?: {
    pageSize: number;
    pageCount: number;
    total: number;
    currentPage: number;
  };
  categories?: string[];
  companies?: string[];
}

export interface GetProductsResponseDto {
  status: string;
  data: { products: Product []};
  meta: ApiMetaData
}

@Injectable({ providedIn: 'root' })
export class ProductHttpService {
  private ENV = environment;
  private readonly basePath = `${this.ENV.apiUrl}/products`;

  constructor(private httpClient:  HttpClient ){}

  fetchAllProducts(params: HttpParams): Observable<GetProductsResponseDto>{
    return this.httpClient.get<GetProductsResponseDto>(
        `${this.basePath}`, { params,   withCredentials: true }
    );
  }

  fetchFeaturedProducts(): Observable<GetProductsResponseDto>{
    return this.httpClient.get<GetProductsResponseDto>(
        `${this.basePath}/featured-products?featured=true`, { withCredentials: true }
    );
  }
}
