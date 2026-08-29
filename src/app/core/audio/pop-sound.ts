let audioContext: AudioContext | null = null;

export function playPopSound(): void {
    try {
        audioContext ??= new AudioContext();

        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(700, audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.15);

        gain.gain.setValueAtTime(0.25, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.18);

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.start();
        osc.stop(audioContext.currentTime + 0.18);
    } catch (err) {
        console.warn('Impossibile riprodurre il suono:', err);
    }
}