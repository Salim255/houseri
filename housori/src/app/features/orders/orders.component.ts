import { Component } from "@angular/core";
import { OrdersService } from "./services/orders.service";
import { Subscription } from "rxjs";
import { Order } from "./model/order.model";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  standalone: false
})

export class OrdersComponent {
  ordersList: Order [] = [];

  private ordersSubscription!: Subscription;
  constructor(private orderService: OrdersService){}
  ngOnInit(): void {
    this.subscribeToOrders();
  }

  private subscribeToOrders(): void {
    this.ordersSubscription = this.orderService
      .getOrders()
      .subscribe(orders => {


        if (orders.data.orders) {
          this.ordersList = orders.data.orders;

        }
      });
  }

  get isEmpty():boolean{
    return this.ordersList.length === 0;
  }
  ngOnDestroy(): void {
    this.ordersSubscription?.unsubscribe();
   }
}
