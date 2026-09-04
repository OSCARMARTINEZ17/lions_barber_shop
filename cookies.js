/**
 * ==========================================================================
 * LIONS BARBER SHOP - AVISO DE COOKIES (cookies.js)
 * Banner de consentimiento de cookies/almacenamiento local.
 * Se muestra una sola vez por navegador hasta que el usuario acepte.
 * ==========================================================================
 */
(function () {
  const CONSENT_KEY = "lions_cookie_consent";

  function hasConsent() {
    return localStorage.getItem(CONSENT_KEY) === "accepted";
  }

  function saveConsent() {
    localStorage.setItem(CONSENT_KEY, "accepted");
  }

  function closeBanner() {
    const banner = document.getElementById("cookie-consent-banner");
    if (banner) banner.classList.remove("show");
    document.body.classList.remove("cookie-banner-active");
  }

  function acceptCookies() {
    saveConsent();
    closeBanner();
  }

  function openCookieInfo() {
    const modal = document.getElementById("cookie-info-modal");
    if (modal) modal.classList.add("active");
  }

  function closeCookieInfo() {
    const modal = document.getElementById("cookie-info-modal");
    if (modal) modal.classList.remove("active");
  }

  function createBanner() {
    if (document.getElementById("cookie-consent-banner")) return;

    const banner = document.createElement("div");
    banner.id = "cookie-consent-banner";
    banner.className = "cookie-consent-banner";
    banner.innerHTML = `
      <div class="cookie-consent-content">
        <i class="fa-solid fa-cookie-bite cookie-consent-icon"></i>
        <p class="cookie-consent-text">
          Usamos cookies y almacenamiento local para recordar tus preferencias
          (como el modo oscuro/claro) y para el funcionamiento de las agendas
          de citas. Al continuar navegando, aceptas su uso.
          <a href="javascript:void(0)" id="cookie-consent-more">Más información</a>
        </p>
        <div class="cookie-consent-actions">
          <button type="button" class="btn btn-gold btn-sm" id="cookie-consent-accept">
            <i class="fa-solid fa-check"></i> Aceptar
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    const modal = document.createElement("div");
    modal.id = "cookie-info-modal";
    modal.className = "modal-backdrop";
    modal.innerHTML = `
      <div class="modal-box payment-modal-box text-center">
        <button class="modal-close" id="cookie-info-close">&times;</button>
        <div class="modal-icon-badge" style="margin: 0 auto 1rem">
          <i class="fa-solid fa-cookie-bite text-gold"></i>
        </div>
        <h3 class="modal-title text-gold">Uso de Cookies y Almacenamiento Local</h3>
        <p class="modal-subtitle mb-3" style="text-align: left; line-height: 1.7;">
          Lions Barber Shop utiliza el almacenamiento local de tu navegador
          (<em>localStorage</em> y <em>sessionStorage</em>) para:
        </p>
        <ul style="text-align: left; color: var(--text-muted); margin: 0 0 1.2rem 1.2rem; line-height: 1.8; font-size: 0.9rem;">
          <li>Recordar si prefieres el modo oscuro o claro del sitio.</li>
          <li>Guardar las citas agendadas y mostrarlas en el panel del barbero y del administrador.</li>
          <li>Mantener tu sesión activa mientras usas el portal del barbero o el panel admin.</li>
        </ul>
        <p class="modal-subtitle mb-3" style="text-align: left; line-height: 1.7;">
          No compartimos esta información con terceros ni la usamos con fines
          publicitarios. Puedes borrarla en cualquier momento desde la
          configuración de tu navegador.
        </p>
        <button class="btn btn-gold btn-block mt-2" id="cookie-info-accept">
          <i class="fa-solid fa-check"></i> Entendido, aceptar
        </button>
      </div>
    `;
    document.body.appendChild(modal);

    document
      .getElementById("cookie-consent-accept")
      .addEventListener("click", acceptCookies);
    document
      .getElementById("cookie-consent-more")
      .addEventListener("click", openCookieInfo);
    document
      .getElementById("cookie-info-close")
      .addEventListener("click", closeCookieInfo);
    document
      .getElementById("cookie-info-accept")
      .addEventListener("click", function () {
        acceptCookies();
        closeCookieInfo();
      });

    if (!hasConsent()) {
      // Pequeño retraso para que la animación de entrada se note
      setTimeout(function () {
        banner.classList.add("show");
        document.body.classList.add("cookie-banner-active");
      }, 400);
    }
  }

  document.addEventListener("DOMContentLoaded", createBanner);
})();
