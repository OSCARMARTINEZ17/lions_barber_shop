/* *
 * ==========================================================================
 * LIONS BARBER SHOP - CAMBIO DE TEMA (theme.js)
 * Botón flotante para alternar entre modo oscuro y modo claro.
 * La preferencia se guarda en localStorage y aplica en todas las páginas.
 * ==========================================================================
 */
(function () {
  const STORAGE_KEY = "lions_theme";

  function getSavedTheme() {
    return localStorage.getItem(STORAGE_KEY) || "dark";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const icon = document.getElementById("theme-toggle-icon");
    if (icon) {
      icon.className =
        theme === "light" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }
  }

  function toggleTheme() {
    const current =
      document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "light" ? "dark" : "light";
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  function createToggleButton() {
    if (document.getElementById("theme-toggle-btn")) return;

    const btn = document.createElement("button");
    btn.id = "theme-toggle-btn";
    btn.className = "theme-toggle-btn";
    btn.type = "button";
    btn.title = "Cambiar entre modo oscuro y modo claro";
    btn.setAttribute("aria-label", "Cambiar tema");
    btn.innerHTML = '<i id="theme-toggle-icon" class="fa-solid fa-moon"></i>';
    btn.addEventListener("click", toggleTheme);
    document.body.appendChild(btn);

    // Sincroniza el ícono con el tema ya aplicado (evita parpadeo)
    applyTheme(
      document.documentElement.getAttribute("data-theme") || getSavedTheme(),
    );
  }

  // Aplica el tema guardado lo antes posible (ya se hizo también en el
  // script inline del <head>, esto es una confirmación de respaldo).
  applyTheme(getSavedTheme());

  document.addEventListener("DOMContentLoaded", createToggleButton);
})();
