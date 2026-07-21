import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input
} from '@angular/core';

export type AppCardAppearance =
    | 'default'
    | 'outlined'
    | 'elevated';

@Component({
    selector: 'app-card',
    standalone: true,
    templateUrl: './app-card.component.html',
    styleUrls: ['./app-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppCardComponent {

    @Input()
    appearance: AppCardAppearance = 'default';


    @Input()
    padding = true;


    @Input()
    hoverable = false;


    @HostBinding('class')
    get hostClasses(): string {

        return [
            'app-card',
            `app-card--${this.appearance}`,
            this.padding ? 'app-card--padding' : '',
            this.hoverable ? 'app-card--hoverable' : ''
        ].join(' ');

    }

}
