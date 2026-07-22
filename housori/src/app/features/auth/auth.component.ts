import { Component, ElementRef, OnInit, signal } from "@angular/core";
import { AuthService, AuthType } from "./services/auth.service";
import { Subscription } from "rxjs";
import { AuthFormService } from "./services/auth-form.service";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AuthComponent,
      multi: true
    }
  ]

})

export class AuthComponent implements OnInit {
  validForm = signal<boolean>(false);
  authType = signal<AuthType>(AuthType.GUEST) ;
  private authTypeSubscription!: Subscription;
  private formValidationSubscription!: Subscription;
  private authSubscription!: Subscription;
  private userIsAuthenticated: boolean = false;

  constructor(
    private router: Router,
    private authFormService: AuthFormService,
    private authService: AuthService,
    private elementRef: ElementRef
  ){}

  ngOnInit(): void {
    this.subscribeToAuthType();
    this.subscribeToFormValidation();
    this.subscribeToUserAuthenticated();
  }

  onSubmit(){
    this.authFormService.setSubmitFormSubject('submit');
  }

  subscribeToFormValidation(){
    this.formValidationSubscription =
      this.authFormService.getAuthFormValidationStatus.subscribe(status => {
        this.validForm.set(status);
      })
  }
  subscribeToAuthType(): void{
    this.authTypeSubscription =
      this.authService.getAuthType.subscribe((authType) => { this.authType.set(authType) })
  }

  subscribeToUserAuthenticated():void{
    this.authSubscription = this.authService.userIsAuthenticated.subscribe(auth => {
      if ((!auth && this.userIsAuthenticated) !== auth) {
        this.userIsAuthenticated = auth;
        this.authType.set(AuthType.LOGIN);
      }
    })
  }

  get switchTo(): string {
    return this.authType() ===  AuthType.LOGIN ? 'Register': 'Login';
  }

  get getCurrentAuthType(): string{
    return this.authType() ===  AuthType.LOGIN ? 'Login': 'Register';
  }

  onGuest(): void{
    this.authService.setGuestUser();
  }

  onSwitch(): void{
    if (this.authType() ===  AuthType.LOGIN) {
      this.authService.setAuthType(AuthType.SIGNUP);
    } else {
      this.authService.setAuthType(AuthType.LOGIN);
    }
  }

  get showAuthModal(): boolean {
    return (this.authType() !== AuthType.GUEST) && (!this.userIsAuthenticated);
  }

  ngOnDestroy(): void {
    this.authTypeSubscription?.unsubscribe();
    this.formValidationSubscription?.unsubscribe();
    this.authSubscription?.unsubscribe();
  }
}
