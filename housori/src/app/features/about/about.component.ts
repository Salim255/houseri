import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  standalone: false
})

export class AboutComponent {
  aboutHero = "https://images.unsplash.com/photo-1693578616322-c8abe6c7393d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzR8fEhpZ2glMjBxdWFsaXR5JTIwc29mYXxlbnwwfHwwfHx8MA%3D%3D";



  constructor(private router: Router){}

  onNavigate(){
    this.router.navigate(["/products"])
  }
}
