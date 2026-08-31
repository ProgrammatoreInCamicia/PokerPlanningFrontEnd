import { Component, inject, signal } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { FormsModule } from '@angular/forms';
import { RoomStore } from '../../state/room.store';

@Component({
  selector: 'app-break-popover',
  imports: [FormsModule, IconComponent],
  templateUrl: './break-popover.component.html',
  styleUrl: './break-popover.component.scss',
})
export class BreakPopoverComponent {
  readonly roomStore = inject(RoomStore);
  readonly customMinutes = signal<number | null>(null);
  readonly closed = signal(false); 

  startQuick(minutes: number): void {
    this.roomStore.startBreak(minutes);
  }

  startCustom(): void {
    const minutes = this.customMinutes();
    if (!minutes || minutes <= 0) return;
    this.roomStore.startBreak(minutes);
    this.customMinutes.set(null);
  }
}
