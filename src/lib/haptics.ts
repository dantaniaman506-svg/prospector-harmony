let audioCtx: AudioContext | null = null;

const KEY = "airleads-haptics";

export function hapticsEnabled() {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(KEY) !== "off";
}

export function setHapticsEnabled(on: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, on ? "on" : "off");
}

function tick(freq: number, gain: number) {
  if (typeof window === "undefined" || !hapticsEnabled()) return;
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    audioCtx = audioCtx ?? new Ctx();
    if (audioCtx.state === "suspended") void audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(gain, audioCtx.currentTime + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.09);
    osc.connect(g).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  } catch {
    /* audio unavailable */
  }
}

function vibrate(pattern: number | number[]) {
  if (!hapticsEnabled()) return;
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      /* ignore */
    }
  }
}

export const haptic = {
  tap() {
    vibrate(12);
    tick(880, 0.05);
  },
  select() {
    vibrate(8);
    tick(1320, 0.035);
  },
  success() {
    vibrate([14, 40, 22]);
    tick(1046, 0.06);
    setTimeout(() => tick(1568, 0.05), 90);
  },
  error() {
    vibrate([30, 50, 30]);
    tick(220, 0.07);
  },
  longPress() {
    vibrate(26);
    tick(660, 0.06);
  },
};
