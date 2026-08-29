import { Service, signal, effect } from '@angular/core';

const BLINK_KEY = 'poker-effects-blink';
const SOUND_KEY = 'poker-effects-sound';

@Service()
export class EffectsSettingsService {
    private readonly _blinkEnabled = signal<boolean>(this.loadPref(BLINK_KEY, true));
    private readonly _soundEnabled = signal<boolean>(this.loadPref(SOUND_KEY, true));

    readonly blinkEnabled = this._blinkEnabled.asReadonly();
    readonly soundEnabled = this._soundEnabled.asReadonly();

    constructor() {
        effect(() => localStorage.setItem(BLINK_KEY, JSON.stringify(this._blinkEnabled())));
        effect(() => localStorage.setItem(SOUND_KEY, JSON.stringify(this._soundEnabled())));
    }

    setBlinkEnabled(value: boolean): void {
        this._blinkEnabled.set(value);
    }

    setSoundEnabled(value: boolean): void {
        this._soundEnabled.set(value);
    }

    private loadPref(key: string, fallback: boolean): boolean {
        const stored = localStorage.getItem(key);
        return stored !== null ? JSON.parse(stored) : fallback;
    }
}