import { Injectable } from "@angular/core";
import { ApiMetaData, GetProductsResponseDto, ProductHttpService } from "./products-http.service";
import { Product } from "../model/product.model";
import { BehaviorSubject, catchError, Observable, of, tap } from "rxjs";
import { HttpParams } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private productsSourceBehavior = new BehaviorSubject<{ products: Product[], meta: ApiMetaData } | null>(null);
  getAllProtects$ =  this.productsSourceBehavior.asObservable();
  private featuredProductsSourceBehavior = new BehaviorSubject< { products: Product[] } | null>(null);
  getFeaturedProductsSource$ = this.featuredProductsSourceBehavior.asObservable();

  constructor(private productHttpService: ProductHttpService){}

  getAllProducts(
    paramsObject: HttpParams,
  ): Observable<GetProductsResponseDto>{
    return this.productHttpService.fetchAllProducts(paramsObject).pipe(
      tap((response => {
        console.log(response);
        if (response.data) {
          this.productsSourceBehavior.next({
            products: response.data.products,
            meta: response.meta,
          })
        }
      })),
      catchError((err) => of(err))
    );
  }

   getFeaturedProducts(): Observable<GetProductsResponseDto>{
    return this.productHttpService.fetchFeaturedProducts().pipe(
      tap((response => {
        if (response.data, "hello") {
          this.featuredProductsSourceBehavior.next({
            products: response.data.products,
          })
        }
      })),
      catchError((err) => of(err))
    );
  }

}
