import { Component, Input, signal, SimpleChanges } from "@angular/core";
import { Router } from "@angular/router";
import { Product } from "../../model/product.model";
import { ApiMetaData } from "../../services/products-http.service";
import { HttpParams } from "@angular/common/http";
import { ProductsService } from "../../services/products.service";
import { SingleProductService } from "../../services/single-product.service";
import { PaginationService } from "src/app/shared/components/pagination/pagination-service";

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  standalone: false
})

export class ProductsListComponent {
  @Input() products!: Product[];
  @Input() pagination!: ApiMetaData['pagination'];
  pages: number[] = [];
  params = new HttpParams();
  currentPage = signal<number>(1);
  isGallery = signal<'list' | 'gallery'>('gallery');
  constructor(
    private paginationService: PaginationService,
    private singleProductService: SingleProductService,
    private productsService: ProductsService,
    private router: Router,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.generatePageNumbers();
  }

  onProduct(product: Product){
    this.singleProductService.setSingleProduct(product);
    this.router.navigateByUrl(`/products/${product._id}`);
  }

  generatePageNumbers(): void {
    if(!this.pagination?.pageCount) return;
    this.pages = Array.from({length: this.pagination?.pageCount }, (_, i) => i + 1);
  }

  goToPage(event: any): void {
    const { pageNumber } = event;

    if (this.currentPage() === pageNumber) return;
    this.currentPage.set(pageNumber);
    this.fetchProducts();
    this.paginationService.setCurrentPage(pageNumber);
  }

  goToPrevPage(event: any): void {
    if (this.currentPage() <= 1) return;
    this.currentPage.set(this.currentPage() - 1);
    this.fetchProducts();
    this.paginationService.setCurrentPage(this.currentPage());
  }

  goToNextPage(event: any): void{
    if (
      !this.pagination?.pageCount
      || this.currentPage() >= this.pagination?.pageCount
    ) return;
    this.currentPage.set(this.currentPage() + 1);
    this.fetchProducts();
    this.paginationService.setCurrentPage(this.currentPage());
  }

  fetchProducts(): void{
    this.params = this.params.set('page', this.currentPage());
    this.productsService.getAllProducts(this.params).subscribe();
  }

  onListToggle(view: 'list' | 'gallery'): void{
    this.isGallery.set(view);
  }
  ngOnDestroy(): void {
    this.currentPage.set(1);
  }
}
