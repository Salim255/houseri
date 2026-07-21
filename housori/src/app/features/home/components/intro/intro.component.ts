import { Component, OnInit } from "@angular/core";
import { HomeService } from "../../services/home.service";

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
  standalone: false,
})

export class IntroComponent  implements OnInit{
  homeHeader: string ="";
  description: string = "";
  constructor(private homeService : HomeService ){}

  ngOnInit(): void {
    this.homeHeader = this.homeService.homeHeader;
    this.description = this.homeService.homeDescription;
  }
}
