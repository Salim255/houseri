import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({providedIn: 'root'})

export class PaginationService {
  private currentPageSubject = new BehaviorSubject<number | null>(null);

  setCurrentPage(currentPage: number | null){

    this.currentPageSubject.next(currentPage);
  }

  get getCurrentPage(): Observable<number | null>{
    return this.currentPageSubject.asObservable();
  }
}
