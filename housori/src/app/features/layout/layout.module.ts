import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LayoutComponent } from "./layout.component";
import { LayoutRoutingModule } from "./layout-routing.module";
import { NavbarComponent } from "../navbar/navbar.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { IonicModule } from "@ionic/angular";


@NgModule({
  imports: [IonicModule, CommonModule, LayoutRoutingModule],
  declarations: [LayoutComponent, NavbarComponent, SidebarComponent]
})
export class LayoutModule {}
