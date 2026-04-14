import {Component, OnDestroy, OnInit, signal} from "@angular/core";
import { CartItem, CartService } from "../cart/services/cart-service";
import { Subscription } from "rxjs";
import { TotalOrderDetails } from "src/app/shared/components/order-total/order-total.component";
import { CheckoutService } from "./services/checkout.service";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  standalone: false,
})

export class CheckoutComponent implements OnInit, OnDestroy{
  private cartStateSubscription!: Subscription;
  private orderIsPlacedSubscription!: Subscription;
  orderIsPlaced = signal<boolean>(false);
  totalDetails = signal< TotalOrderDetails | null>(null);
  cartItems = signal<  CartItem []>([]);

  constructor(
    private checkoutService: CheckoutService,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.subscribeToCartState();
    this.subscribeToOrderIsPlaced();
  }

  subscribeToOrderIsPlaced(): void {
    this.orderIsPlacedSubscription = this.checkoutService
      .getOrderIsPlaced
      .subscribe(isPlaced => {
        this.orderIsPlaced.set(isPlaced) }
      )
  }
  subscribeToCartState(){
    this.cartStateSubscription = this.cartService
    .getCartState
    .subscribe(cartState => {
      if (cartState) {
        const {cartItems, ...rest} = cartState;
        this.cartItems.set(cartItems);
        this.totalDetails.set(rest);
      }
    })
  }

  ngOnDestroy(): void {
    this.cartStateSubscription?.unsubscribe();
    this.orderIsPlacedSubscription?.unsubscribe();
  }
}
