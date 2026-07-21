import {
    ChangeDetectionStrategy,
    Component,
    Input
} from '@angular/core';


@Component({
    selector: 'app-card',
    standalone: false,
    templateUrl: './app-card.component.html',
    styleUrls: ['./app-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppCardComponent {


    @Input()
    title?: string;


    @Input()
    subtitle?: string;


    @Input()
    footer = false;


    @Input()
    hoverable = false;


}
