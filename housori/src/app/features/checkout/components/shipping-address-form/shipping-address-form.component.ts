import { Component } from "@angular/core";
import { CheckoutService } from "../../services/checkout.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ShippingAddress } from "../../services/checkout-http.service";

type Field = {
  label: string;
  placeHolder: string;
  formControlName: string;
 }
@Component({
  selector: 'app-shipping-address-form',
  templateUrl: './shipping-address-form.component.html',
  styleUrls: ['./shipping-address-form.component.scss'],
  standalone: false
})
export class ShippingAddressForm{
  shippingFields!: FormGroup;
  fromFields: Field [] = [];
  constructor(
    private formBuilder: FormBuilder,
    private checkoutService: CheckoutService,
  ){
    this.fromFields = [
      { label: 'Full name', placeHolder: 'Full name',  formControlName: 'fullName'},
      { label: 'Country', placeHolder: 'Country',  formControlName: 'country'},
      { label: 'Address', placeHolder: 'Address line',  formControlName: 'address'},
      { label: 'City', placeHolder: 'City',  formControlName: 'city'},
      { label: 'Postal code', placeHolder: 'Postal code',  formControlName: 'postalCode'},
      { label: 'Phone', placeHolder: 'Phone',  formControlName: 'phone'},
    ]
  }

  ngOnInit(): void {
    this.buildForm();
    this.shippingFields.get('country')?.valueChanges.subscribe(result=> {

    })
  }


  onPlaceOrder(){
    if (this.shippingFields.invalid){
      this.shippingFields.markAllAsTouched();
      return;
    };
    const {country, fullName, city, postalCode, phone, address} = this.shippingFields.value;
    const shippingAddress:ShippingAddress = { country, fullName, city, postalCode, phone, address };
    this.checkoutService.setOrderIsPlaced(true);
    this.checkoutService.checkoutPayment(shippingAddress).subscribe();
  }

  buildForm(){
    this.shippingFields = this.formBuilder.group({
      fullName: [null, [ Validators.required ]],
      country: [null, [ Validators.required ]],
      address: [null, [ Validators.required ]],
      city:  [null, [ Validators.required ]],
      postalCode: [null, [ Validators.required ]],
      phone: [null, [ Validators.required ]],
    })
  }

  get isValid():boolean{
    return this.shippingFields.valid;
  }
}
