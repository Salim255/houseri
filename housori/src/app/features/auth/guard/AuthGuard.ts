import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from "@angular/router";
import { map, Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable({providedIn: "root"})
export class AuthGuard implements CanMatch {

  constructor(
    private router: Router,
    private authService: AuthService
  ){}

  canMatch(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean | UrlTree> {
      return this.authService.userIsAuthenticated.pipe(
        map((user) => {
            if(user) {
              return true;
            }

            const urlTree = this.router.parseUrl('/landing');
            return urlTree;
         })
      )

  }
}
