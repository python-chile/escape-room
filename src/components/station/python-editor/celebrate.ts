import confetti from "canvas-confetti";

let celebrationInterval: number | undefined;

export function celebrate() {
  document.documentElement.dataset.pyschoolCelebrated = "true";

  if (celebrationInterval !== undefined) {
    window.clearInterval(celebrationInterval);
  }

  const endTime = Date.now() + 1_800;

  celebrationInterval = window.setInterval(() => {
    confetti({
      particleCount: 45,
      spread: 70,
      startVelocity: 35,
      origin: {
        x: Math.random() * 0.6 + 0.2,
        y: 0.65,
      },
      colors: ["#0879e8", "#f2c94c", "#16a34a", "#7c3aed"],
      disableForReducedMotion: true,
    });

    if (Date.now() >= endTime) {
      window.clearInterval(celebrationInterval);
      celebrationInterval = undefined;
    }
  }, 260);
}
