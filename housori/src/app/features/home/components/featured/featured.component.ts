import { Component, effect, OnInit, signal } from "@angular/core";
import { Subscription } from "rxjs";
import { Product } from "src/app/features/products/model/product.model";
import { ProductsService } from "src/app/features/products/services/products.service";

@Component({
  selector: 'app-featured',
  templateUrl: './featured.component.html',
  styleUrls: ['./featured.component.scss'],
  standalone: false,
})
export class FeaturedComponent implements OnInit {
  products: Product [];
  private featuredSubscription!: Subscription;
  constructor(private productsService: ProductsService){
    this.products = [];
  }


  ngOnInit(): void {
    this.productsService.getFeaturedProducts().subscribe();
    this.subscribeToFeatured();
  }

  subscribeToFeatured(): void{
    this.featuredSubscription = this.productsService
    .getFeaturedProductsSource$
    .subscribe(data => {
      if (data?.products) {
        this.products = [...data.products];
      }
    })
  }


  ngOnDestroy(): void {
    this.featuredSubscription?.unsubscribe();
  }
}
