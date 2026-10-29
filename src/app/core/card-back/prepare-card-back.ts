const TARGET_W = 168;
const TARGET_H = 240; // 7:10, come la carta (56x80)
const MAX_INPUT_BYTES = 15 * 1024 * 1024;

export class CardBackError extends Error {}

export async function prepareCardBack(file: File): Promise<Blob> {
    if (file.size > MAX_INPUT_BYTES) {
        throw new CardBackError('Immagine troppo grande (max 15 MB)');
    }

    let bitmap: ImageBitmap;
    try {
        bitmap = await createImageBitmap(file);
    } catch {
        throw new CardBackError('Formato non supportato (usa PNG, JPEG o WebP)');
    }

    try {
        const targetRatio = TARGET_W / TARGET_H;
        let sw = bitmap.width;
        let sh = bitmap.height;
        if (sw / sh > targetRatio) {
            sw = sh * targetRatio;
        } else {
            sh = sw / targetRatio;
        }
        const sx = (bitmap.width - sw) / 2;
        const sy = (bitmap.height - sh) / 2;

        const canvas = document.createElement('canvas');
        canvas.width = TARGET_W;
        canvas.height = TARGET_H;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new CardBackError('Canvas non disponibile');

        // sfondo bianco: le trasparenze di un PNG diventerebbero nere in JPEG
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, TARGET_W, TARGET_H);
        ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, TARGET_W, TARGET_H);

        return await new Promise<Blob>((resolve, reject) =>
            canvas.toBlob(
                (b) => (b ? resolve(b) : reject(new CardBackError('Conversione fallita'))),
                'image/jpeg',
                0.85,
            ),
        );
    } finally {
        bitmap.close();
    }
}