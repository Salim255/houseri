import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService, AuthType } from "../auth/services/auth.service";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"],
  standalone: false,
})
export class LandingComponent {

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  onGuest(): void {
    this.authService.setAuthType(AuthType.GUEST);
    this.authService.setGuestUser();
  }

  onLogin(): void {
    this.authService.setAuthType(AuthType.LOGIN);
    this.router.navigateByUrl("/auth")
  }

  onRegister(): void {
    this.authService.setAuthType(AuthType.SIGNUP);
    this.router.navigateByUrl("/auth")
  }
}
