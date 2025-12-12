import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {
  @Input() toastData: any;
  @Output() close = new EventEmitter<void>();

  closeToast() {
    this.close.emit();
  }
}
