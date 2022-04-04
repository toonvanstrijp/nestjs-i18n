var observeDOM = (function () {
  var MutationObserver =
    window.MutationObserver || window.WebKitMutationObserver;

  return function (obj, callback) {
    if (!obj || obj.nodeType !== 1) return;

    if (MutationObserver) {
      // define a new observer
      var mutationObserver = new MutationObserver(callback);

      // have the observer observe foo for changes in children
      mutationObserver.observe(obj, { childList: true, subtree: true });
      return mutationObserver;
    }

    // browser support fallback
    else if (window.addEventListener) {
      obj.addEventListener('DOMNodeInserted', callback, false);
      obj.addEventListener('DOMNodeRemoved', callback, false);
    }
  };
})();

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function setHandler() {
  document.querySelector('img[alt="debugged"]').onclick = () => {
    confetti({
      angle: randomInRange(55, 125),
      spread: randomInRange(50, 70),
      particleCount: randomInRange(50, 100),
      origin: { y: 0.8 },
    });
    var audio = new Audio();
    var popper = document.createElement('source');
    popper.type = 'audio/mpeg';
    popper.src = 'mp3/popper.mp3';
    audio.appendChild(popper);
    audio.play();
  };
}

window.addEventListener('load', function () {
  observeDOM(
    document.querySelector('.footer__bottom.text--center .margin-bottom--sm'),
    setHandler,
  );
  setHandler();
});
