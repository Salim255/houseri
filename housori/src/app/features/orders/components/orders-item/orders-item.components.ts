import { Component, Input, SimpleChanges } from "@angular/core";
import { OrderItem } from "../../model/order.model";

@Component({
  selector:'app-orders-item',
  templateUrl: './orders-item.components.html',
  styleUrls: ['./orders-item.components.scss'],
  standalone: false,
})
export class OrdersItemComponent {
  @Input() updatedAt!: Date;
  @Input() orderItem!: OrderItem;

  ngOnChanges(changes: SimpleChanges): void {

  }

  get getImageUrl(): string {
    return this.orderItem.productId?.images[0];
  }

  get unitPrice(): number {
    return this.orderItem.productId?.price || 0;
  }
}
