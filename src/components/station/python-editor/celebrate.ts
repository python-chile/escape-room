import confetti from "canvas-confetti";

export function celebrate() {
  document.documentElement.dataset.pyschoolCelebrated = "true";

  const end = Date.now() + 1_800;

  const interval = window.setInterval(() => {
    confetti({
      particleCount: 45,
      spread: 70,
      startVelocity: 35,
      origin: {
        x: Math.random() * 0.6 + 0.2,
        y: 0.65,
      },
      colors: ["#004574", "#f2c100", "#16a34a", "#7c3aed"],
    });

    if (Date.now() > end) {
      window.clearInterval(interval);
    }
  }, 260);
}
