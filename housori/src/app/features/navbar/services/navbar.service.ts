import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

export type LikeContent = {
  path: string;
  label: string;
   exact?: boolean;
}

@Injectable({providedIn: 'root'})
export class NavbarService {
  private closeSidebarSubject = new BehaviorSubject<'close' | null>(null);
  navLinks:  LikeContent[] = [
  { path: '/home', label: 'Home', exact: true },
  { path: '/about', label: 'About' },
  { path: '/products', label: 'Products' },
  { path: '/orders', label: 'Orders' },
  { path: '/checkout', label: 'Checkout' },
  { path: '/cart', label: 'Cart' }
];
  constructor(){}

  onCloseSideBar(): void{
    this.closeSidebarSubject.next('close')
  }

  get getSidebarStatus(): Observable<'close' | null> {
    return this.closeSidebarSubject.asObservable();
  }
}
