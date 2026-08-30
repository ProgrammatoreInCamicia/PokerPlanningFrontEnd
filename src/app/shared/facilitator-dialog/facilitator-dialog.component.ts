import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { RoomStore } from '../../state/room.store';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-facilitator-dialog',
  imports: [ModalComponent, FormsModule, IconComponent],
  templateUrl: './facilitator-dialog.component.html',
  styleUrl: './facilitator-dialog.component.scss',
})
export class FacilitatorDialogComponent {
  readonly roomStore = inject(RoomStore);
  readonly open = signal(false);

  openDialog(): void {
    this.open.set(true);
  }

  close(): void {
    this.open.set(false);
  }
}
