import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Product } from "../model/product.model";

@Injectable({providedIn: 'root'})
export class SingleProductService {
  singleProductSubject = new BehaviorSubject<Product | null>(null);

  setSingleProduct(clickedProduct: Product ): void {

    this.singleProductSubject.next(clickedProduct);
  }

  get getClickedProduct(): Observable< Product | null> {
    return this.singleProductSubject.asObservable();
  }
}
