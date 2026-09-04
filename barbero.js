/**
 * ==========================================================================
 * LIONS BARBER SHOP - PORTAL EXCLUSIVO DEL BARBERO (barbero.js)
 * Agenda en tiempo real, aviso a clientes por WhatsApp y comisiones privadas.
 * ==========================================================================
 */

class LionsBarberPortal {
  constructor() {
    this.storageKey = "lions_barber_appointments_v1";
    this.configKey = "lions_barber_config_v1";
    this.barberPinsKey = "lions_barber_pins_v1";

    // PINs por defecto de cada barbero (Almacenados en SHA-256)
    this.defaultBarberPins = {
      "barber-yeico": "1111", // Yeico Quintero (CEO)
      "barber-principal-1": "2222", // Carlos "Fade Master"
      "barber-principal-2": "3333", // Andrés "The Razor"
      "barber-principal-3": "4444", // Mateo "Freestyle"
    };

    // Catálogo de Barberos
    this.barbers = [
      {
        id: "barber-yeico",
        name: "Yeico Quintero (CEO)",
        branchName: "2da Sede (Cra. 13 A #5-13)",
      },
      {
        id: "barber-principal-1",
        name: 'Carlos "Fade Master"',
        branchName: "Sede Principal (Cl. 11 #12-38)",
      },
      {
        id: "barber-principal-2",
        name: 'Andrés "The Razor"',
        branchName: "Sede Principal (Cl. 11 #12-38)",
      },
      {
        id: "barber-principal-3",
        name: 'Mateo "Freestyle"',
        branchName: "Sede Principal (Cl. 11 #12-38)",
      },
    ];

    this.currentBarber = null;
    this.currentFilter = "today"; // 'today' o 'all'
    this.pendingAppointmentId = null;

    this.init();
  }

  init() {
    this.populateBarberSelect();
    this.checkSession();
  }

  // ==================== GENERADOR DE HASH SHA-256 ====================
  async sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  getSavedPins() {
    const saved = localStorage.getItem(this.barberPinsKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return this.defaultBarberPins;
  }

  savePins(pins) {
    localStorage.setItem(this.barberPinsKey, JSON.stringify(pins));
  }

  // ==================== LOGIN Y SESIÓN DEL BARBERO ====================
  populateBarberSelect() {
    const select = document.getElementById("select-barber-login");
    if (!select) return;

    select.innerHTML = this.barbers
      .map(
        (b) => `
      <option value="${b.id}">${b.name} (${b.branchName.split("(")[0]})</option>
    `,
      )
      .join("");
  }

  checkSession() {
    const loggedBarberId = sessionStorage.getItem("lions_logged_barber_id");
    const loginScreen = document.getElementById("barber-login-screen");
    const dashboardScreen = document.getElementById("barber-dashboard-screen");

    if (loggedBarberId) {
      this.currentBarber = this.barbers.find((b) => b.id === loggedBarberId);
      if (this.currentBarber) {
        if (loginScreen) loginScreen.style.display = "none";
        if (dashboardScreen) dashboardScreen.style.display = "block";
        this.renderBarberDashboard();
        return;
      }
    }

    if (loginScreen) loginScreen.style.display = "flex";
    if (dashboardScreen) dashboardScreen.style.display = "none";
  }

  handleLogin(e) {
    e.preventDefault();
    const barberId = document.getElementById("select-barber-login").value;
    const pinEntered = document.getElementById("barber-pin").value.trim();

    const pins = this.getSavedPins();
    const correctPin = pins[barberId] || "1234";

    if (pinEntered === correctPin) {
      sessionStorage.setItem("lions_logged_barber_id", barberId);
      this.checkSession();
    } else {
      alert("⚠️ PIN incorrecto para este barbero. Intenta de nuevo.");
      document.getElementById("barber-pin").value = "";
    }
  }

  logout() {
    sessionStorage.removeItem("lions_logged_barber_id");
    this.currentBarber = null;
    this.checkSession();
  }

  changeMyPin() {
    if (!this.currentBarber) return;
    const currentPin = prompt("Ingresa tu PIN actual:");
    const pins = this.getSavedPins();

    if (currentPin !== (pins[this.currentBarber.id] || "1234")) {
      alert("❌ PIN actual incorrecto.");
      return;
    }

    const newPin = prompt("Ingresa tu NUEVO PIN (4 dígitos):");
    if (!newPin || newPin.length < 4) {
      alert("❌ El PIN debe tener al menos 4 caracteres.");
      return;
    }

    pins[this.currentBarber.id] = newPin;
    this.savePins(pins);
    alert("🔒 ¡PIN personal actualizado con éxito!");
  }

  // ==================== RENDERIZADO DEL DASHBOARD ====================
  getAppointments() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        return JSON.parse(saved) || [];
      } catch (e) {}
    }
    return [];
  }

  saveAppointments(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  formatMoney(amount) {
    return "$ " + Number(amount || 0).toLocaleString("es-CO");
  }

  renderBarberDashboard() {
    if (!this.currentBarber) return;

    // Encabezado
    const nameEl = document.getElementById("barber-display-name");
    const branchEl = document.getElementById("barber-display-branch");
    if (nameEl) nameEl.textContent = this.currentBarber.name.toUpperCase();
    if (branchEl)
      branchEl.textContent = this.currentBarber.branchName.toUpperCase();

    const allAppts = this.getAppointments();
    const todayStr = new Date().toISOString().split("T")[0];
    const currentMonth = todayStr.substring(0, 7);

    // Filtrar solo las citas que pertenecen a este barbero
    const myAppts = allAppts.filter(
      (a) =>
        a.barberId === this.currentBarber.id ||
        (a.barberName &&
          a.barberName.includes(this.currentBarber.name.split(" ")[0])),
    );

    // Métricas
    const myTodayAppts = myAppts.filter((a) => a.date === todayStr);
    const myTodayPaid = myTodayAppts.filter(
      (a) => a.status === "Completado / Pagado",
    );
    const myTodayPending = myTodayAppts.filter((a) => a.status === "Pendiente");
    const myMonthPaid = myAppts.filter(
      (a) =>
        (a.date || "").substring(0, 7) === currentMonth &&
        a.status === "Completado / Pagado",
    );

    const todayEarnings = myTodayPaid.reduce(
      (sum, a) => sum + Number(a.barberCommission || 0),
      0,
    );
    const monthEarnings = myMonthPaid.reduce(
      (sum, a) => sum + Number(a.barberCommission || 0),
      0,
    );

    // Pintar KPIs
    document.getElementById("barber-today-count").textContent =
      myTodayAppts.length;
    document.getElementById("barber-today-status").textContent =
      `${myTodayPending.length} Pendientes | ${myTodayPaid.length} Listos`;
    document.getElementById("barber-today-earnings").textContent =
      this.formatMoney(todayEarnings);
    document.getElementById("barber-month-earnings").textContent =
      this.formatMoney(monthEarnings);

    // Tabla de citas
    this.renderAppointmentsList(myAppts);
  }

  filterDay(type) {
    this.currentFilter = type;
    const btnToday = document.getElementById("btn-filter-today");
    const btnAll = document.getElementById("btn-filter-all");

    if (type === "today") {
      btnToday?.classList.add("active");
      btnAll?.classList.remove("active");
    } else {
      btnAll?.classList.add("active");
      btnToday?.classList.remove("active");
    }

    this.renderBarberDashboard();
  }

  renderAppointmentsList(myAppts) {
    const tbody = document.getElementById("barber-appointments-tbody");
    if (!tbody) return;

    const todayStr = new Date().toISOString().split("T")[0];
    let filtered = myAppts;

    if (this.currentFilter === "today") {
      filtered = myAppts.filter((a) => a.date === todayStr);
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center" style="padding: 2.5rem; color: var(--text-muted);">
            <i class="fa-solid fa-champagne-glasses" style="font-size: 2rem; display: block; margin-bottom: 0.5rem;"></i>
            ${this.currentFilter === "today" ? "No tienes más citas programadas para hoy." : "No tienes citas en tu historial."}
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered
      .map((a) => {
        let badgeClass =
          a.status === "Completado / Pagado"
            ? "status-paid"
            : a.status === "Cancelado"
              ? "status-canceled"
              : "status-pending";

        // Mensaje de WhatsApp personalizado para el cliente
        const clientMsg = encodeURIComponent(
          `💈 ¡Hola ${a.clientName}! Te saluda ${this.currentBarber.name.split(" ")[0]} de Lions Barber Shop.\nTu cita para *${a.serviceName}* está programada a las *${a.time}*.\n¡Ya tengo todo listo para tu turno!`,
        );
        const cleanPhone = (a.clientPhone || "").replace(/[^0-9]/g, "");

        return `
        <tr>
          <td><strong class="text-gold" style="font-size: 1.05rem;">${a.time}</strong><br><small class="card-desc">${a.date}</small></td>
          <td><strong>${a.clientName}</strong></td>
          <td>
            <a href="https://wa.me/${cleanPhone}?text=${clientMsg}" target="_blank" class="text-gold" title="Enviar WhatsApp al cliente">
              <i class="fa-brands fa-whatsapp"></i> ${a.clientPhone}
            </a>
          </td>
          <td>${a.serviceName}</td>
          <td><small>${a.notes || "Sin observaciones"}</small></td>
          <td><strong class="val-highlight">${this.formatMoney(a.barberCommission)}</strong></td>
          <td><span class="status-badge ${badgeClass}">${a.status}</span></td>
          <td>
            <div class="table-actions">
              ${
                a.status === "Pendiente"
                  ? `
                <button class="btn btn-gold btn-sm" onclick="barberApp.completeCut('${a.id}')" title="Marcar como Corte Listo">
                  <i class="fa-solid fa-check"></i> Listo / Cobrado
                </button>
                <button class="action-btn action-btn-danger" onclick="barberApp.requestCancel('${a.id}')" title="Cancelar esta cita">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              `
                  : `
                <span class="text-muted">
                  <i class="fa-solid ${a.status === "Cancelado" ? "fa-circle-xmark" : "fa-circle-check"} ${a.status === "Cancelado" ? "text-danger" : "text-gold"}"></i>
                  ${a.status === "Cancelado" ? "Cancelado" : "Cobrado"}
                </span>
                <button class="reopen-link" onclick="barberApp.reopenAppointment('${a.id}')" title="Volver a marcar como Pendiente">
                  <i class="fa-solid fa-rotate-left"></i> Reabrir
                </button>
              `
              }
              <a href="https://wa.me/${cleanPhone}?text=${clientMsg}" target="_blank" class="action-btn" title="Avisar turno por WhatsApp">
                <i class="fa-brands fa-whatsapp"></i>
              </a>
            </div>
          </td>
        </tr>
      `;
      })
      .join("");
  }

  // ==================== MARCAR CORTE COMO LISTO ====================
  completeCut(appointmentId) {
    this.pendingAppointmentId = appointmentId;
    const modal = document.getElementById("payment-modal");
    if (modal) modal.classList.add("active");
  }

  closePaymentModal() {
    const modal = document.getElementById("payment-modal");
    if (modal) modal.classList.remove("active");
    this.pendingAppointmentId = null;
  }

  confirmPayment(method) {
    const appointmentId = this.pendingAppointmentId;
    if (!appointmentId) return;

    const allAppts = this.getAppointments();
    const appt = allAppts.find((a) => a.id === appointmentId);
    if (!appt) {
      this.closePaymentModal();
      return;
    }

    appt.status = "Completado / Pagado";
    appt.paymentMethod = method;
    this.saveAppointments(allAppts);
    this.closePaymentModal();

    // Efecto de Confetti
    if (typeof confetti === "function") {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    }

    this.renderBarberDashboard();

    const textEl = document.getElementById("payment-success-text");
    if (textEl) {
      textEl.innerHTML = `¡Excelente! Se sumaron <strong class="text-gold">${this.formatMoney(appt.barberCommission)}</strong> a tu ganancia de hoy.`;
    }
    const successModal = document.getElementById("payment-success-modal");
    if (successModal) successModal.classList.add("active");
  }

  closePaymentSuccessModal() {
    const modal = document.getElementById("payment-success-modal");
    if (modal) modal.classList.remove("active");
  }

  // ==================== CANCELAR / REABRIR CITA ====================
  requestCancel(appointmentId) {
    this.pendingAppointmentId = appointmentId;
    const modal = document.getElementById("cancel-confirm-modal");
    if (modal) modal.classList.add("active");
  }

  closeCancelModal() {
    const modal = document.getElementById("cancel-confirm-modal");
    if (modal) modal.classList.remove("active");
    this.pendingAppointmentId = null;
  }

  confirmCancelAppointment() {
    const appointmentId = this.pendingAppointmentId;
    if (!appointmentId) return;

    const allAppts = this.getAppointments();
    const appt = allAppts.find((a) => a.id === appointmentId);
    if (appt) {
      appt.status = "Cancelado";
      this.saveAppointments(allAppts);
      this.renderBarberDashboard();
    }
    this.closeCancelModal();
  }

  reopenAppointment(appointmentId) {
    const allAppts = this.getAppointments();
    const appt = allAppts.find((a) => a.id === appointmentId);
    if (!appt) return;

    appt.status = "Pendiente";
    this.saveAppointments(allAppts);
    this.renderBarberDashboard();
  }
}

// Inicializar Portal del Barbero
const barberApp = new LionsBarberPortal();