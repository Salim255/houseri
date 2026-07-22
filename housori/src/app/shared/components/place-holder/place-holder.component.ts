import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { Router } from "@angular/router";

interface PlaceholderConfig {
  text: string;
  button: string;
  route: string;
}

@Component({
  selector: 'app-place-holder',
  templateUrl: './place-holder.component.html',
  styleUrls: ['./place-holder.component.scss'],
  standalone: false,
})
export class Placeholder implements OnChanges {


  @Input()
  componentName!: 'cart' | 'orders' | 'checkout';


  mainText = '';
  btnText = '';



  private readonly placeholderData: Record<string, PlaceholderConfig> = {


    cart: {

      text:
        'Your cart is empty. Explore our products and find something you love.',

      button:
        'Keep Shopping',

      route:
        '/products'

    },



    orders: {

      text:
        'You have no orders yet. Start shopping and your orders will appear here.',

      button:
        'Start Shopping',

      route:
        '/products'

    },



    checkout: {

      text:
        'Your cart is empty. Add products before completing your order.',

      button:
        'Browse Products',

      route:
        '/products'

    }

  };




  constructor(
    private router: Router
  ){}



  ngOnChanges(changes: SimpleChanges): void {

    if(changes['componentName']) {

      this.setData();

    }

  }





  private setData(): void {

    const data = this.placeholderData[this.componentName];


    if(!data) {

      return;

    }


    this.mainText = data.text;

    this.btnText = data.button;

  }






  onNavigate(): void {

    const data = this.placeholderData[this.componentName];


    if(data) {

      this.router.navigateByUrl(data.route);

    }

  }

}
