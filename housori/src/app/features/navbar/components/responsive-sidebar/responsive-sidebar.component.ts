import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LikeContent } from '../services/navbar.service';

@Component({
  selector: 'app-responsive-sidebar',
  templateUrl: './responsive-sidebar.component.html',
  styleUrls: ['./responsive-sidebar.component.scss']
})
export class ResponsiveSidebarComponent {


  @Input()
  navLinks: LikeContent[] = [];


  @Input()
  isOpen = false;


  @Output()
  closeSidebar = new EventEmitter<void>();



  close(): void {

    this.closeSidebar.emit();

  }


}
