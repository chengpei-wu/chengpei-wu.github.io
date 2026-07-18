(function () {
  "use strict";

  function initializeNavigation() {
    var nav = document.getElementById("site-nav");
    if (!nav) return;

    var button = nav.querySelector("button");
    var hiddenLinks = document.getElementById("site-nav-hidden-links");
    if (!button || !hiddenLinks) return;

    function syncMenuState() {
      var isOpen = !hiddenLinks.classList.contains("hidden");
      button.setAttribute("aria-expanded", String(isOpen));
      button.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
    }

    function refreshNavigationWidth() {
      window.dispatchEvent(new Event("resize"));
      window.requestAnimationFrame(syncMenuState);
    }

    button.addEventListener("click", function () {
      window.requestAnimationFrame(syncMenuState);
    });

    new MutationObserver(syncMenuState).observe(hiddenLinks, {
      attributes: true,
      attributeFilter: ["class"],
      childList: true
    });

    window.addEventListener("load", refreshNavigationWidth, { once: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refreshNavigationWidth);
    }

    syncMenuState();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeNavigation);
  } else {
    initializeNavigation();
  }
})();
