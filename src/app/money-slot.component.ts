import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-money-slot',
  standalone: true,
  templateUrl: './money-slot.component.html',
  styleUrls: ['./money-slot.component.css']
})
export class MoneySlotComponent {
  @Input() amountInserted = 0;
  @Output() insertQuarter = new EventEmitter<void>();

  handleClick() {
    this.insertQuarter.emit();
  }
}