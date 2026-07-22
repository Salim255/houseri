import { NgModule } from "@angular/core";
import { SingleProductComponent } from "./single-product.component";
import { SingleProductRoutingModule } from "./single-product-routing.module";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";


@NgModule({
  declarations: [ SingleProductComponent],
  imports: [SingleProductRoutingModule, IonicModule, CommonModule, SharedModule],
})

export class SingleProductModule{}
