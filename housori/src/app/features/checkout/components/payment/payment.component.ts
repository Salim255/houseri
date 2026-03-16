import { Component, Input, OnInit } from '@angular/core';
import {
  Appearance,
  Stripe,
  StripePaymentElement,
  loadStripe,
} from '@stripe/stripe-js';
import { TotalOrderDetails } from 'src/app/shared/components/order-total/order-total.component';
import { environment } from 'src/environments/environment';
import { CheckoutService } from '../../services/checkout.service';
import { Subscription } from 'rxjs';
import { Router } from "@angular/router";
import { CartService } from 'src/app/features/cart/services/cart-service';
import { PaymentService } from '../../services/payment.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  @Input() totalDetails!: TotalOrderDetails;
  ENV = environment ;
  stripe!: Stripe | null;
  payment!: StripePaymentElement;
  paymentElement: StripePaymentElement | null = null;
  billingAddressElement: any = null;
  shippingAddressElement: any = null;
  checkout: any;
  errorMessage: string = '';
  isLoading: boolean = false;
  stripeReady: boolean = false;
  clientSecretSubscription!: Subscription;
  private appearance: Appearance;
  private clientSecret: string | null = null;

  constructor(
    private toastService : ToastService ,
    private cartService: CartService,
    private router: Router,
    private checkoutService: CheckoutService,
    private paymentService: PaymentService,
  ) {
    this.appearance = this.paymentService.getAppearance;
  }

  async ngOnInit() {
    this.stripe = await loadStripe(`${this.ENV.stripePK}`); // Replace with your Stripe publishable key
    console.log(this.stripe, "test strip key ")
    if (!this.stripe) {
      return;
    }

    this.subscribeToClientSecret();
  }

  subscribeToClientSecret(){
     this.clientSecretSubscription = this.checkoutService.getClientSecret.subscribe((clientSecret) => {
      const clientSecret2 = "cs_test_b1QrQ5svPBm9KultXJTAdbNwFRypO2nmo5OEwlp5PIxFnJm9Y1FL5UUVrO_secret_fidwbEhqYWAnPydmcHZxamgneCUl"
      console.log("coming secret:" , clientSecret, "test strip key ", clientSecret2)
      if (clientSecret) {
        this.clientSecret = clientSecret;
        this.paymentElementWithCheckout();
      }

      if (!clientSecret) {
        console.log("Nono sectiot key 👹👹👹")
        this.clientSecret = clientSecret2;
        this.paymentElementWithCheckout();
      }
    });
  }
  async paymentElementWithCheckout(){
    if (!this.clientSecret) return;
      this.checkout = await this.stripe!.initCheckout({
      fetchClientSecret: () => this.clientSecret,
      elementsOptions: {
        appearance: this.appearance
      }
    } as any);

    this.paymentElement =
      this.checkout.createPaymentElement(
        {
          layout: {
            type: 'tabs', // or 'accordion'
          },
        },
      );
    this.paymentElement!.mount('#payment-element');
    this.stripeReady = true;
  }

  async handleSubmitWithCheckout() {
    this.isLoading = true;
    this.errorMessage = '';
    const result =
      await this.checkout!.confirm({ redirect: 'if_required' });
    if ( result.error) {
      this.errorMessage =  result.error?.message!;
      this.isLoading = false;
      return;
    }

    setTimeout(() => {
      this.isLoading = false;
      this.checkoutService.setOrderIsPlaced(false);
      this.clientSecretSubscription?.unsubscribe();
      this.clientSecret = null;
      this.paymentElement?.unmount();
      this.paymentElement = null;
      this.stripeReady = false;
      this.checkout = null;
      this.stripe = null;
      this.cartService.clearCart();
      this.toastService.success(
        'Your payment was successful',
        'Payment Confirmed'
      )
      this.router.navigate(['/orders']);
    }, 1000);

  }
}
