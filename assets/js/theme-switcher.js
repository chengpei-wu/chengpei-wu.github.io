(function () {
  const root = document.documentElement;
  const toggles = document.querySelectorAll(".js-theme-toggle");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const preferences = ["auto", "dark", "light"];
  const themeDetails = {
    auto: { icon: "◐", label: "Auto" },
    dark: { icon: "☾", label: "Dark" },
    light: { icon: "☀", label: "Light" }
  };
  let preference = root.dataset.themePreference || "auto";

  function resolvedTheme() {
    return preference === "auto"
      ? (systemTheme.matches ? "dark" : "light")
      : preference;
  }

  function updateButtons() {
    const details = themeDetails[preference];
    toggles.forEach((toggle) => {
      const icon = toggle.querySelector("[data-theme-icon]");
      const label = toggle.querySelector("[data-theme-label]");
      if (icon) icon.textContent = details.icon;
      if (label) label.textContent = details.label;
      toggle.setAttribute("aria-label", `Theme: ${details.label}`);
    });
  }

  function applyTheme(shouldPersist) {
    const theme = resolvedTheme();
    root.dataset.theme = theme;
    root.dataset.themePreference = preference;
    updateButtons();

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute("content", theme === "dark" ? "#0f1419" : "#ffffff");
    }

    if (!shouldPersist) return;
    try {
      if (preference === "auto") {
        localStorage.removeItem("blog-theme-preference");
      } else {
        localStorage.setItem("blog-theme-preference", preference);
      }
    } catch (error) {}
  }

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const currentIndex = preferences.indexOf(preference);
      preference = preferences[(currentIndex + 1) % preferences.length];
      applyTheme(true);
    });
  });

  const handleSystemThemeChange = function () {
    if (preference === "auto") applyTheme(false);
  };
  if (systemTheme.addEventListener) {
    systemTheme.addEventListener("change", handleSystemThemeChange);
  } else {
    systemTheme.addListener(handleSystemThemeChange);
  }

  applyTheme(false);
})();
