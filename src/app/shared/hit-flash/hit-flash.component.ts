import { Component, inject, effect, signal, untracked } from '@angular/core';
import { RoomStore } from '../../state/room.store';
import { EffectsSettingsService } from '../../core/settings/effects-settings.service';

@Component({
  selector: 'app-hit-flash',
  imports: [],
  templateUrl: './hit-flash.component.html',
  styleUrl: './hit-flash.component.scss',
})
export class HitFlashComponent {
    private readonly roomStore = inject(RoomStore);
    private readonly settings = inject(EffectsSettingsService);

    readonly active = signal(false);
    private lastHandledId: string | null = null;

    constructor() {
        effect(() => {
            const hit = this.roomStore.hitEvent();
            if (!hit || hit.id === this.lastHandledId) return;

            this.lastHandledId = hit.id;

            if (!untracked(() => this.settings.blinkEnabled())) return;

            this.active.set(true);
            setTimeout(() => this.active.set(false), 400);
        });
    }
}