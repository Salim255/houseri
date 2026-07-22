import { Component, OnInit } from "@angular/core";
import { AuthService, AuthType } from "src/app/features/auth/services/auth.service";
import { NavbarService, LikeContent } from "../navbar/services/navbar.service";
import { Router } from "@angular/router";


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: false,
})
export class SidebarComponent implements OnInit {


  navLinks: LikeContent[] = [];

  constructor(
    private router: Router,
    private navbarService: NavbarService,
    private authService: AuthService
  ) {}


  ngOnInit(): void {
    this.navLinks = this.navbarService.navLinks;
  }

  onClose(): void {
    this.navbarService.onCloseSideBar();
  }


  onLogin(): void {
    this.authService.logout();
    this.authService.setAuthType(AuthType.LOGIN);
    this.router.navigateByUrl("/auth")
    this.onClose();
  }
}
