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
    const price = this.filterFormFields.get('price')?.value;
    const search = this.filterFormFields.get('search')?.value;
    const company = this.filterFormFields.get('company')?.value
    const category = this.filterFormFields.get('category')?.value;
    const sort =  this.filterFormFields.get('alphaSort')?.value;
    const shipping = this.filterFormFields.get('shipping')?.value;

    if (price) this.params = this.params.set('price[lte]', price.toString());
    if (search) this.params = this.params.set('search', search);
    if (company) this.params = this.params.set('company', company);
    if (category) this.params = this.params.set('category', category);
    if (sort) this.params = this.params.set('alphaSort', sort);
    if (typeof shipping === 'boolean') this.params = this.params.set('shipping', shipping);

    this.productsService.getAllProducts(this.params).subscribe(data =>{

    });
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
