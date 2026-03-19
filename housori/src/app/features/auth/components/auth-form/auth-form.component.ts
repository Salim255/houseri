import { Component, Input, OnChanges, OnDestroy, OnInit, signal, SimpleChanges } from "@angular/core";
import { AuthType } from "../../services/auth.service";
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn  } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { combineLatest, Subscription} from "rxjs";
import { AuthField, AuthFormService } from "../../services/auth-form.service";
import { ToastService } from "src/app/shared/services/toast.service";

const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirm = group.get('passwordConfirm')?.value;

  return password && confirm && password !== confirm
    ? { passwordsMismatch: true }
    : null;
};

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
  standalone: false
})
export class AuthFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() authType!: AuthType;
  formInputData: AuthField []
  passwordMismatchLive = signal<boolean>(false);
  authFormFields!: FormGroup;
  private previousState: 'VALID' | 'INVALID' = 'INVALID';
  private statusSub?: Subscription;
  private submitFormSubscription!: Subscription;

  constructor(
    private toastService: ToastService,
    private authFormService: AuthFormService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
  ){
    this.formInputData = this.authFormService.formFields;
  }

  ngOnInit(): void {
    this.onSubmit();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['authType']){
      this.buildForm();
      this.subscribeToStatusChange();
      this.listenToPasswordConfirm();
    }
  }

  onSubmit():void {

    this.submitFormSubscription = this.authFormService
    .getSubmitForm
    .subscribe(value => {
      if (!value) return;
      if (this.authFormFields.invalid){
        this.authFormFields.markAllAsTouched();
        return
      }
      const { email, password, passwordConfirm, firstName, lastName } = this.authFormFields.value;
      if (this.authType === AuthType.LOGIN) {
        this.handleLogin(email, password);
      } else if (this.authType === AuthType.SIGNUP){
        if (
          !email
          || ! password
          || !passwordConfirm
          || !firstName
          || !lastName
        ) return;

        this.handleSignup(email, password, passwordConfirm, firstName, lastName);
      }
    })
  }

  private handleLogin(email: string, password: string){
    if (!email || ! password) return;
    this.authService
    .signIn({email, password})
    .subscribe(
      {
      next: (response) => {
        const user = response.body?.data.user;
        if(user) {
          this.authService.authenticateUser().subscribe(
            {
              next: ()=> {
                this.toastService.success('Glad to see you again!', 'Login successful')
              },
              error: () => {
                this.toastService.error("Please check your credentials and try again.", "Login failed.");
              }
            }
          );
        }

      },
      error: (err) => {
        this.toastService.error("Login failed. Please check your credentials and try again.");
      }
      }
    );
  }

  private handleSignup(
    email: string,
    password: string,
    passwordConfirm: string,
    firstName: string,
    lastName: string,
  ){
    if (
    !email
    || ! password
    || !passwordConfirm
    || !firstName
    || !lastName
    ) return;

    this.authService
    .register({email,password,passwordConfirm,firstName,lastName})
    .subscribe(response => {

    });

  }
  buildForm(): void {
    this.previousState = 'INVALID';
     this.authFormService.setFormValidationStatus('INVALID');
    this.authFormFields = this.formBuilder
    .group(
      this.formFields(),
      { validators: passwordMatchValidator },
    );
  }

  formFields() {
    if (this.authType === AuthType.LOGIN) {
      return {
        email: [
          this.authFormFields?.get('email')?.value ||null,
          [Validators.required, Validators.email],
        ],
        password: [
          '',
          Validators.required,
        ],
      }
    } else {
      return  {
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        email: [
          this.authFormFields?.get('email')?.value || null,
          [Validators.required, Validators.email],
        ],
        password: [
          '',
          Validators.required,
        ],
        passwordConfirm: ['', Validators.required],
      }
    }
  }

  subscribeToStatusChange(){
    this.statusSub?.unsubscribe();
    this.statusSub = this.authFormFields?.statusChanges.subscribe(status => {
      //VALID // INVALID
      if (this.previousState !== status)  {
        if (status === 'VALID' || status === 'INVALID') {
          this.authFormService.setFormValidationStatus(status);
          this.previousState = status;  // update previousState to avoid repeated calls
        }
      }
    })
  }

  listenToPasswordConfirm(): void{
    // Observable for password field changes
    const password$ = this.authFormFields.get('password')?.valueChanges;

     // Observable for confirm password field changes
    const confirm$ = this.authFormFields.get('passwordConfirm')?.valueChanges;

    // If either control is missing, stop (prevents runtime errors)
    if (!password$ || !confirm$) return;

    // Combine the latest values from both fields whenever either changes
    combineLatest([password$, confirm$]).subscribe(([password, confirm]) => {
      // Trim spaces and ensure non-null strings
      const p1 = password?.trim() || '';
      const p2 = confirm?.trim() || '';

      /**
       * Logic:
       * 1. Both fields empty → no mismatch
       * 2. Password filled, confirm empty → no mismatch
       * 3. Password empty, confirm filled → mismatch
       * 4. Both filled → mismatch if not equal
      */
      if (!p1 && !p2) {
        // Case 1: Both empty
        this.passwordMismatchLive.set(false);
      }
      else if (p1 && !p2) {
        // Case 2: Only password filled
        this.passwordMismatchLive.set(false);
      }
      else if (!p1 && p2) {
        // Case 3: Only confirm filled
        this.passwordMismatchLive.set(true);
      }
      else {
        // Case 4: Both filled → compare equality
        this.passwordMismatchLive.set(p1 !== p2);
      }
    });
  }

  get passwordsMismatch(): boolean {
    return  this.passwordMismatchLive();
  }
  get isLogin(): boolean {
    return this.authType === AuthType.LOGIN ;
  }

  ngOnDestroy(): void {
    this.statusSub?.unsubscribe();
    this.submitFormSubscription?.unsubscribe();
  }
}
