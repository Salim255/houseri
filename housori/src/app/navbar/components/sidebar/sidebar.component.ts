import { Component } from "@angular/core";
import { NavbarService } from "../../services/navbar.service";
import { AuthService, AuthType } from "src/app/features/auth/services/auth.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: false,
})

export class SidebarComponent {
  constructor(
    private authService  : AuthService,
    private navbarService: NavbarService){}

  onClose(): void{
    this.navbarService.onCloseSideBar();
  }
  onLogin(): void {

    this.authService.setAuthType(AuthType.LOGIN);
    this.onClose();
  }
}
