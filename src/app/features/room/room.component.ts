import { Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrentUser, RoomStore } from '../../state/room.store';
import { clearSession, loadSession, saveSession } from '../../core/session/session.store';
import { FormsModule } from '@angular/forms';
import { VotingPanelComponent } from './components/voting-panel/voting-panel.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { CommonModule } from '@angular/common';
import { ParticipantsTableComponent } from './components/participants-table/participants-table.component';
import { ConnectionBadgeComponent } from '../../shared/connection-badge/connection-badge.component';
import { ThemeToggleComponent } from '../../shared/theme-toggle/theme-toggle.component';
import { formatRoomName } from '../../core/utils/room-name-format';
import { ModalComponent } from '../../shared/modal/modal.component';
import { EmojiFlyOverlayComponent } from '../../shared/emoji-fly-overlay/emoji-fly-overlay.component';
import { ResultsComponent } from './components/results/results.component';
import { HitFlashComponent } from '../../shared/hit-flash/hit-flash.component';
import { EffectsSettingsService } from '../../core/settings/effects-settings.service';
import { SettingDialogComponent } from '../../shared/setting-dialog/setting-dialog.component';
import { FacilitatorDialogComponent } from '../../shared/facilitator-dialog/facilitator-dialog.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { RoomApiService } from '../../core/http/room-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-room',
  imports: [CommonModule, FormsModule, VotingPanelComponent, RouterLink,
    TaskListComponent, ParticipantsTableComponent, ConnectionBadgeComponent, 
    ModalComponent, EmojiFlyOverlayComponent, ResultsComponent, IconComponent,
    HitFlashComponent, SettingDialogComponent, FacilitatorDialogComponent],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss',
})
export class RoomComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly roomStore = inject(RoomStore);
  readonly effectsSettings = inject(EffectsSettingsService);
  readonly roomApiService = inject(RoomApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly roomId = signal('');
  readonly needsName = signal(false);
  readonly voterName = signal('');
  readonly joining = signal(false);
  readonly joinError = signal<string | null>(null);

  readonly roomNotFound = signal(false);

  readonly displayRoomName = computed(() => formatRoomName(this.roomId()));
  readonly sidebarOpen = signal(false);

  constructor() {
    effect(() => {
      const reason = this.roomStore.kickedOrRejected();
      if (reason) {
        clearSession(this.roomId());
        this.router.navigate(['/'], { queryParams: { notice: reason } });
      }
    });
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const id = params.get('roomId');
        if (!id) return;
        this.initializeRoom(id);
      });
  }

  initializeRoom(id: string): void {
    this.roomId.set(id);
    this.roomNotFound.set(false);
    this.joinError.set(null);

    const existingSession = loadSession(id);
    if (existingSession) {
      this.doJoin(existingSession);
    } else {
      this.needsName.set(true);
    }
  }

  async submitVoterName(): Promise<void> {
    const name = this.voterName().trim();
    if (!name) return;

    const user: CurrentUser = {
      userId: crypto.randomUUID(),
      userName: name,
      role: 'voter',
    };

    saveSession(this.roomId(), user);
    await this.doJoin(user);
  }

  private async doJoin(user: CurrentUser): Promise<void> {
    this.joining.set(true);
    this.joinError.set(null);
    this.roomNotFound.set(false);

    const exists = await this.roomApiService.roomExists(this.roomId());
    if (!exists) {
      this.roomNotFound.set(true);
      this.needsName.set(false);
      this.joining.set(false);
      return;
    }

    try {
      await this.roomStore.connectAndJoin(this.roomId(), user);
      this.needsName.set(false);
    } catch (err) {
      console.error('Errore di connessione alla stanza:', err);

      this.needsName.set(true);
      this.joinError.set('Impossibile connettersi alla stanza. Riprova.');
      
    } finally {
      this.joining.set(false);
    }
  }

  async createRoomWithSameName(): Promise<void> {
    // Nota: il nome originale (roomId sbagliato) va perso - creiamo una stanza NUOVA,
    // il facilitator sarà chi clicca questo pulsante
    const user = loadSession(this.roomId()) ?? {
      userId: crypto.randomUUID(),
      userName: this.voterName().trim() || 'Facilitator',
      role: 'facilitator' as const,
    };

    this.joining.set(true);
    try {
      const newRoomId = await this.roomApiService.createRoom();
      saveSession(newRoomId, { ...user, role: 'facilitator' });
      await this.router.navigate(['/room', newRoomId]);
    } catch (err) {
      console.error('Errore nella creazione della stanza:', err);
    } finally {
      this.joining.set(false);
    }
  }

  onPresetChange(preset: string): void {
    this.roomStore.changePreset(preset);
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }
}
