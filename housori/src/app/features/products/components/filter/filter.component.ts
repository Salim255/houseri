import { HttpParams } from "@angular/common/http";
import { Component, Input, signal } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ProductsService } from "../../services/products.service";
import { ApiMetaData } from "../../services/products-http.service";

export  type EditProfilePayload = {
  search: string;
  category: string;
  company:  string;
  sortBy: string;
  price: number;
}


@Component({
  selector: "app-filter",
  templateUrl: "./filter.component.html",
  styleUrls: ["./filter.component.scss"],
  standalone: false
})

export class FilterComponent {
  @Input() metaData!: ApiMetaData;
  products = ['Laptop', 'Phone', 'Headphones']; // Example
  filterFormFields!: FormGroup;
  selectedProduct = '';
  customPopoverOptions = {
    cssClass: 'custom-popover'
  };

  companyValue = signal<string>("all");
  categoryValue = signal<string>("all");
  sortValue = signal<string>("all");
  priceValue = signal<number>(100000);
  shippingValue = signal<boolean>(false);

  categoryOptions = ['Chairs', 'Tables', 'Beds', 'Sofas'];
  companyOptions = ['Savanna Craft', 'Elevara Home', 'IvoryNest', 'Tusker Living', 'Luxora'];
  sortOptions = ['a-z', 'z-a', 'high', 'low'];
   params = new HttpParams();
  constructor(
    private productsService: ProductsService,
    private formBuilder: FormBuilder,
  ){}

  ngOnInit(): void {
    this.buildForm();
    this.listenToFormChange();
  }

 submitSearch() {

  let params = new HttpParams();

  const {
    price,
    search,
    company,
    category,
    alphaSort,
    shipping
  } = this.filterFormFields.value;


  if(price) {
    params = params.set(
      'price[lte]',
      price.toString()
    );
  }


  if(search) {
    params = params.set(
      'search',
      search.trim()
    );
  }


  if(company) {
    params = params.set(
      'company',
      company
    );
  }


  if(category) {
    params = params.set(
      'category',
      category
    );
  }


  if(alphaSort) {
    params = params.set(
      'alphaSort',
      alphaSort
    );
  }


  if(shipping !== null) {
    params = params.set(
      'shipping',
      shipping
    );
  }

  console.log(params);
  this.productsService
      .getAllProducts(params)
      .subscribe();

}
  resetFilter(){
    this.buildForm();
    this.categoryValue.set('all');
    this.companyValue.set('all');
    this.sortValue.set('all');
    this.priceValue.set(1000000);
    this.params =  new HttpParams();
    this.productsService.getAllProducts(this.params).subscribe()
  }

  buildForm(): void{
    this.filterFormFields = this.formBuilder.group({
      search: [null],
      category: [null],
      company: [null],
      alphaSort: [null],
      price: [100000],
      shipping: [null],
    });
  }

  listenToFormChange(): void{
    this.filterFormFields.get('category')?.valueChanges.subscribe(value => {
      this.categoryValue.set(value);
    });

    this.filterFormFields.get('company')?.valueChanges.subscribe(value => {
      this.companyValue.set(value);
    });

    this.filterFormFields.get('alphaSort')?.valueChanges.subscribe(value => {
      this.sortValue.set(value);
    })

    this.filterFormFields.get('price')?.valueChanges.subscribe(value => {
      this.priceValue.set(value);
    })

     this.filterFormFields.get('shipping')?.valueChanges.subscribe(value => {

      this.shippingValue.set(value);
    })

  }
}
