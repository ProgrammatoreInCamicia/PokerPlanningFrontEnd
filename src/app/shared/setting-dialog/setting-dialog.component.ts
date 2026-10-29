import { Component, computed, inject, signal } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/theme/theme.service';
import { EffectsSettingsService } from '../../core/settings/effects-settings.service';
import { RoomStore } from '../../state/room.store';
import { IconComponent } from '../icon/icon.component';
import { saveSession } from '../../core/session/session.store';

@Component({
  selector: 'app-setting-dialog',
  imports: [ModalComponent, FormsModule, IconComponent],
  templateUrl: './setting-dialog.component.html',
  styleUrl: './setting-dialog.component.scss',
})
export class SettingDialogComponent {
  readonly themeService = inject(ThemeService);
  readonly effectsSettings = inject(EffectsSettingsService);
  readonly roomStore = inject(RoomStore);

  readonly open = signal(false);
  readonly editingName = signal(false);
  readonly nameInput = signal('');

  readonly uploadingCardBack = signal(false);

  readonly myCardBackCss = computed<string | null>(() => {
    const id = this.roomStore.currentUser()?.userId;
    const url = id ? this.roomStore.cardBackUrls()[id] : undefined;
    return url ? `url("${url}")` : null;
  });

  openDialog(): void {
    this.nameInput.set(this.roomStore.currentUser()?.userName ?? '');
    this.editingName.set(false);
    this.open.set(true);
  }

  close(): void {
    this.open.set(false);
  }

  startEditingName(): void {
    this.editingName.set(true);
  }

  confirmName(): void {
    const name = this.nameInput().trim();
    if (!name) return;

    this.roomStore.changeUserName(name);

    this.roomStore.changeUserName(name);

    const current = this.roomStore.currentUser();
    if (current) {
      saveSession(this.roomStore.roomId(), { ...current, userName: name }); // nota sotto
    }
    this.editingName.set(false);
  }

  async onCardBackSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = ''; // permette di riselezionare lo stesso file
    if (!file) return;

    this.uploadingCardBack.set(true);
    try {
      await this.roomStore.setCardBack(file);
    } finally {
      this.uploadingCardBack.set(false);
    }
  }

  removeCardBack(): void {
    void this.roomStore.removeCardBack();
  }
}
