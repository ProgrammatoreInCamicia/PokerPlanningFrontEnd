const KEY = 'poker-card-back';

export async function saveCardBack(blob: Blob): Promise<void> {
    const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
    });

    try {
        localStorage.setItem(KEY, dataUrl);
    } catch {
        // quota piena o storage disabilitato: l'immagine funziona ma non ti segue
    }
}

export async function loadCardBack(): Promise<Blob | null> {
    try {
        const dataUrl = localStorage.getItem(KEY);
        if (!dataUrl) return null;
        return await (await fetch(dataUrl)).blob();
    } catch {
        return null;
    }
}

export function clearCardBack(): void {
    try {
        localStorage.removeItem(KEY);
    } catch {
        // niente da pulire
    }
}