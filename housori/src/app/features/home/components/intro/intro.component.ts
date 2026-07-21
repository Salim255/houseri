import { Component, OnInit } from "@angular/core";
import { HomeService } from "../../services/home.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
  standalone: false,
})

export class IntroComponent  implements OnInit{
  homeHeader: string ="";
  description: string = "";

  constructor(
    private router: Router,
    private homeService: HomeService,
  ){}

  ngOnInit(): void {
    this.homeHeader = this.homeService.homeHeader;
    this.description = this.homeService.homeDescription;
  }

  onNavigate(){
    this.router.navigate(["/products"])
  }
}
