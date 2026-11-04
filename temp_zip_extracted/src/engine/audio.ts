/* Speaker de placa: pitidos cuadrados a 880 Hz, como el buzzer piezo real */

let ctx: AudioContext | null = null;

export function ensureAudio(): void {
  if (typeof window === "undefined") return;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") void ctx.resume();
}

/**
 * Reproduce un patrón de pitidos.
 * @param pattern duraciones en ms de cada beep (separación fija 220 ms)
 * @param sound si está desactivado, solo dispara el callback visual
 * @param onFlash callback al inicio de cada pitido (para el LED visual)
 */
export function playBeepPattern(
  pattern: number[],
  sound: boolean,
  onFlash?: (i: number) => void
): void {
  if (sound) ensureAudio();
  const c = ctx;
  let offset = 0.06;
  pattern.forEach((ms, i) => {
    const dur = ms / 1000;
    if (sound && c) {
      try {
        const t0 = c.currentTime + offset;
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = "square";
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(0.07, t0 + 0.008);
        gain.gain.setValueAtTime(0.07, t0 + Math.max(0.01, dur - 0.015));
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start(t0);
        osc.stop(t0 + dur + 0.03);
      } catch {
        /* audio bloqueado: ignorar */
      }
    }
    if (onFlash) {
      window.setTimeout(() => onFlash(i), offset * 1000);
    }
    offset += dur + 0.22;
  });
}
