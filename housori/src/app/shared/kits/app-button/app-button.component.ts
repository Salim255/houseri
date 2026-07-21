import { Component, Input } from "@angular/core";

@Component({
  selector: "app-button",
  templateUrl: "./app-button.component.html",
  styleUrls: ["./app-button.component.scss"],
  standalone: false
})
export class AppButtonComponent {
  @Input()

  variant:
  'primary'
  | 'secondary'
  | 'outline'
  | 'danger'
  | 'ghost'
  = 'primary';


  @Input()

  type:
  'button'
  | 'submit'
  | 'reset'
  = 'button';


  @Input()

  disabled = false;


  @Input()

  loading = false;


  @Input()

  fullWidth = false;
}
