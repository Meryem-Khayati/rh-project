import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
  @Input() show = false;
  @Input() title = '';
  @Input() message = '';
  @Input() type: 'success' | 'error' = 'success';

  @Output() closed = new EventEmitter<void>();

  onClose() {
    this.closed.emit();
  }
}