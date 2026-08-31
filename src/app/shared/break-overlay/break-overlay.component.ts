import { Component, computed, inject, signal } from '@angular/core';
import { RoomStore } from '../../state/room.store';

@Component({
  selector: 'app-break-overlay',
  imports: [],
  templateUrl: './break-overlay.component.html',
  styleUrl: './break-overlay.component.scss',
})
export class BreakOverlayComponent {
  readonly roomStore = inject(RoomStore);

  private readonly _now = signal(Date.now());

  readonly remainingSeconds = computed<number>(() => {
    const endsAt = this.roomStore.breakEndsAt();
    if (!endsAt) return 0;
    return Math.max(0, Math.floor((endsAt.getTime() - this._now()) / 1000));
  });

  readonly isActive = computed<boolean>(() => {
    return this.roomStore.breakEndsAt() !== null && this.remainingSeconds() > 0;
  });

  readonly displayTime = computed<string>(() => {
    const total = this.remainingSeconds();
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  });

  constructor() {
    setInterval(() => this._now.set(Date.now()), 1000);
  }
}
