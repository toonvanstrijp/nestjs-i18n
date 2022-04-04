function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

window.addEventListener('load', function () {
  document.querySelector('img[alt="debugged"]').onclick = () => {
    confetti({
      angle: randomInRange(55, 125),
      spread: randomInRange(50, 70),
      particleCount: randomInRange(50, 100),
      origin: { y: 0.8 },
    });
  };
});
