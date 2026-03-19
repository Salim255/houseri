import { Component, signal } from "@angular/core";
import { CartDetails, CartItem, CartService } from "./services/cart-service";
import { Subscription } from "rxjs";
import { Product } from "../products/model/product.model";
import { TotalOrderDetails } from "src/app/shared/components/order-total/order-total.component";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: false
})

export class CartComponent {
  cartState = signal<CartDetails | null>(null);

  cartStateSubscription!: Subscription;
  constructor(private cartService : CartService ) {}

  ngOnInit(): void {
    this.subscribeToCartState();
  }

  subscribeToCartState(){
    this.cartStateSubscription =
      this.cartService.getCartState.subscribe(
        (cartState) => {
          this.cartState.set(cartState)
        });
  }

  get cartItems(): CartItem[]{
    return this.cartState()?.cartItems ?? [];
  }

  get totalDetails(): TotalOrderDetails | null {
    const cart = this.cartState();
    if (!cart) return null;
    const { cartItems, ...rest} = cart;
    return rest;
  }
  get productsNm(): number {
    return this.cartItems.length;
  }

  ngOnDestroy(): void {
    this.cartStateSubscription?.unsubscribe();
  }
}
