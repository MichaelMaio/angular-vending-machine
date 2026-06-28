import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  @Input() products: any[] = [];
  @Input() buttonLabel = 'Add to Cart';
  @Output() action = new EventEmitter<number>();

  handleAction(index: number) {
    this.action.emit(index);
  }
}