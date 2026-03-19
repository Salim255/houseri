import { Component, OnDestroy, OnInit, signal } from "@angular/core";
import { ProductsService } from "./services/products.service";
import { filter, Subscription } from "rxjs";
import { NavigationEnd, Router } from "@angular/router";
import { Product } from "./model/product.model";
import { HttpParams } from "@angular/common/http";
import { ApiMetaData } from "./services/products-http.service";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  standalone: false
})

export class ProductsComponent implements OnInit, OnDestroy {
  private productsSubscription!: Subscription;
  allProducts = signal< Product[]>([]);
  metaData = signal<ApiMetaData>({});

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const params = new HttpParams();
    this.productsService.getAllProducts(params).subscribe();
    this.subscribeToProducts();
  }

  private subscribeToProducts(){
    this.productsSubscription = this.productsService.productsSourceBehavior
    .subscribe({
      next: (data) => {

      if (data){
       this.allProducts.set(data.products);
       this.metaData.set(data.meta);
      }
    }
    });
  }

  ngOnDestroy(): void {
    this.productsSubscription?.unsubscribe()
  }
}
