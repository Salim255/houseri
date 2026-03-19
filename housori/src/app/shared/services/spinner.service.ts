import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({providedIn: 'root'})

export class SpinnerService {
  private loadingCount = 0;
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Store timeout handle for delayed spinner display
  private showTimeout: ReturnType<typeof setTimeout> | null = null;

  // Minimum visible time (ms) to prevent flicker
  private minShowTime = 2000;

  // Track when spinner was shown (for min display logic)
  private lastShowTime = 0;

  constructor(){}

  showSpinner(): void{

    if (this.loadingCount === 0) {
      // Delay showing spinner (e.g. 100ms)
      this.showTimeout = setTimeout(() => {
        this.lastShowTime = Date.now();
        this.loadingSubject.next(true);
      }, 100);
    }
    this.loadingCount++;
  }

  hideSpinner(): void{
    this.loadingCount--;

    // Cancel any pending show timeout
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }


    const elapsed = Date.now() - this.lastShowTime;

    if (elapsed < this.minShowTime && this.lastShowTime > 0) {
      // Wait until min show time has passed
      setTimeout(() => {
        this.loadingSubject.next(false);
        this.lastShowTime = 0;
      }, this.minShowTime - elapsed);
    } else {
      // Hide immediately if min time has passed
      this.loadingSubject.next(false);
      this.lastShowTime = 0;
    }
  }

  get isLoading():Observable<boolean> {
    return this.loadingSubject.asObservable();
  }
}
