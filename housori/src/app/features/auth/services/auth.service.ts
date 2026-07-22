import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap, throwError } from "rxjs";
import { AuthHttpService, AuthResponsePayload, AuthStatusPayload } from "./auth-http.service";
import { HttpResponse } from "@angular/common/http";
import { User } from "../../users/model/user.model";

export enum AuthType {
  LOGIN = 'log-in',
  SIGNUP = 'sign-up',
  GUEST = 'guest',
}

@Injectable({providedIn: 'root'})
export class AuthService {
  private userIsAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<User| null>(null)
  private authTypeSubject = new BehaviorSubject<AuthType>(AuthType.GUEST);

  constructor(private authHttpService: AuthHttpService ){}

  register(data: any): Observable<HttpResponse<AuthResponsePayload>>{
    return this.authHttpService.register(data);
  }

  signIn(data: any): Observable<HttpResponse<AuthResponsePayload>>{
    return this.authHttpService.signIn(data);
  }

  authenticateUser(): Observable<AuthStatusPayload> {
    return this.authHttpService.authStatus().pipe(
      tap((response) => {
        const authenticated: boolean = response.data.authenticated
        this.userIsAuthenticatedSubject.next(authenticated);
      }),
       catchError((err) => {
        this.userIsAuthenticatedSubject.next(false);
        // Re-throw the error to let subscribers handle it if needed
        return throwError(() => err);
      }) //// Wrap false in an Observable using 'of'
    )
  }

  get userIsAuthenticated(): Observable<boolean> {
    return this.userIsAuthenticatedSubject.asObservable();
  }

  setAuthType(authType: AuthType ): void {
    this.authTypeSubject.next(authType);
  }

  get getAuthType(): Observable<AuthType >{
    return this.authTypeSubject.asObservable();
  }

  setGuestUser(){
    const fakeUser = new User("guest", "guest", "guest@gmail.com", true, true, new Date() , new Date());
    this.userSubject.next(fakeUser);
    this.userIsAuthenticatedSubject.next(true);
  }

  get getUserInfo(): Observable<{isGuest: boolean, firstName: string} | null> {
    return this.userSubject.pipe(
      map(user => {
        if (user) return  {isGuest: user?.isGuestUser, firstName: user.userFirstName}
        else return null;
      })
    )
  }

  getCurrentUser(): boolean {
    return this.userSubject?.value?.isGuestUser ?? false;
  }

  logout(){
    this.userIsAuthenticatedSubject.next(false);
    this.userSubject.next(null)
  }
}
