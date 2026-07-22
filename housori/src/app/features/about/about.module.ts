import { NgModule } from "@angular/core";
import { AboutComponent } from "./about.component";
import { AboutRoutingModule } from "./about-routing.module";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";


@NgModule({
  declarations: [AboutComponent],
  imports: [CommonModule, AboutRoutingModule, SharedModule]
})

export class AboutModule {}
