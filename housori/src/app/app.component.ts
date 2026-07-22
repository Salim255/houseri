import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './features/auth/services/auth.service';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  authSubscription!: Subscription;
  previousAuthSate: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subscribeToAuth();
  }

  private subscribeToAuth(){
    this.authSubscription = this.authService.userIsAuthenticated.subscribe(auth => {
      //Updates only when auth changes to false (unauthenticated).
      // Will not update if auth changes to true
      if (auth) {
        this.router.navigateByUrl('/');
      } else {
        this.router.navigateByUrl('/auth');
      }
    })
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }
}
