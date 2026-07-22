import { Component, OnDestroy, OnInit, signal } from "@angular/core";
import { CartDetails, CartService } from "../cart/services/cart-service";
import { Subscription } from "rxjs";
import { AuthType } from "../auth/services/auth.service";
import { AuthService } from "../auth/services/auth.service";
import {CoreService} from "../../core/services/core.service";
import { LikeContent, NavbarService } from "./services/navbar.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
  standalone: false
})

export class NavbarComponent implements OnInit, OnDestroy {
  cartState = signal< CartDetails | null>(null);
  authType = signal<AuthType | null>(null);
  openMenu = signal<boolean>(false);
  showMenuBtn = signal<boolean>(false);
  userInfo = signal<{ firstName: string; isGuest: boolean } | null>(null);

  cartStateSubscription!: Subscription;
  authTypeSubscription!: Subscription;
  authSubscription!: Subscription;
  sidBarStatusSubscription!: Subscription;
  userIsAuthenticated: boolean = false;
  navLinks: LikeContent[];

  constructor(
    private router: Router,
    private navbarService: NavbarService,
    private coreService: CoreService,
    private authService: AuthService,
    private cartService: CartService,
  ){
    this.navLinks = this.navbarService.navLinks;
  }

  ngOnInit(): void {
    this.subscribeToCartState();
    this.subscribeToAuthType();
    this.subscribeToUserInfo();
    this.subscribeToSideBarStatus();

     window.addEventListener('resize', () => {
      const currentWidth = window.innerWidth;
      this.showMenuBtn.set(currentWidth<=896);
      // 896
     });
  }

  subscribeToSideBarStatus(): void{
    this.sidBarStatusSubscription = this.navbarService.getSidebarStatus.subscribe(status => {
        this.openMenu.set(false);
    })
  }

  subscribeToUserInfo():void{
    this.authSubscription = this.authService.getUserInfo.subscribe((userInfo: { isGuest: boolean; firstName: string; } | null) => {
      this.userInfo.set(userInfo);
    })
  }

  subscribeToAuthType(){
    this.authTypeSubscription = this.authService.getAuthType.subscribe(type => {
      this.authType.set(type);
    })
  }

  subscribeToCartState(){
    this.cartStateSubscription = this.cartService.getCartState.subscribe(cartState => {
      this.cartState.set(cartState);
    })
  }

  get numItemInCart(): number{
    const numItem = this.cartState()?.numItemInCart;
    return numItem ?? 0;
  }

  disableScroll():void{
    this.coreService.setDisableScroll(
      this.authType() === AuthType.GUEST || this.userIsAuthenticated
    );
  }

  onSignUp(): void{
    this.authService.logout();
    this.authService.setAuthType(AuthType.LOGIN);
    this.router.navigateByUrl("/auth")
  }

  onRegister(): void{
    this.authService.logout();
    this.authService.setAuthType(AuthType.SIGNUP);
    this.router.navigateByUrl("/auth")
  }

  get showAuthBar(): boolean {
    return (this.authType() === AuthType.GUEST) && (!this.userIsAuthenticated);
  }

  onMenu(): void {
    this.openMenu.set(this.showMenuBtn());
  };

  get showGuestActions(): boolean {
    const user = this.userInfo();

    return !user || !user.isGuest;
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.sidBarStatusSubscription?.unsubscribe();
    this.cartStateSubscription?.unsubscribe();
    this.authSubscription?.unsubscribe();
  }
}
