import {
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  HostListener,
  ElementRef
} from '@angular/core';

import { CustomSelectService } from './custom-select.service';
import { Subscription } from 'rxjs';
import { NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true,
    }
  ]
})
export class CustomSelectComponent implements OnInit, OnDestroy {


  @Input() options: string[] = [];


  selectedOption = 'all';

  dropdownOpen = false;


  private customSelectSubscription!: Subscription;


  private onChange: (value: any) => void = () => {};

  private onTouched: () => void = () => {};



  constructor(
    private customSelectService: CustomSelectService,
    private elementRef: ElementRef
  ){}



  ngOnInit(): void {

    this.subscribeToCustomSelect();

  }




  private subscribeToCustomSelect(): void {

    this.customSelectSubscription =
      this.customSelectService
        .getOpenSelectStatus
        .subscribe(openSelect => {

          this.dropdownOpen =
            openSelect === this;

        });

  }





  toggleDropdown(): void {

    if (!this.dropdownOpen) {

      this.customSelectService.open(this);

    }
    else {

      this.customSelectService.close(this);

    }

  }





  selectOption(
    option: string,
    event: Event
  ): void {


    event.stopPropagation();


    this.selectedOption = option;


    this.customSelectService.close(this);



    this.onChange(option);

    this.onTouched();

  }





  /*
  ==================================================
  CLOSE WHEN CLICK OUTSIDE
  ==================================================
  */


  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent): void {


    if (!this.dropdownOpen) {
      return;
    }



    const clickedInside =
      this.elementRef
        .nativeElement
        .contains(event.target);



    if (!clickedInside) {

      this.customSelectService.close(this);

    }

  }





  writeValue(value: any): void {

    this.selectedOption =
      value ?? 'all';

  }



  registerOnChange(fn: any): void {

    this.onChange = fn;

  }



  registerOnTouched(fn: any): void {

    this.onTouched = fn;

  }





  ngOnDestroy(): void {

    this.customSelectSubscription?.unsubscribe();

  }

}
