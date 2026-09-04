/**
 * ==========================================================================
 * LIONS BARBER SHOP - PANEL ADMINISTRATIVO CON SEGURIDAD CRIPTOGRÁFICA (admin.js)
 * Protección: Hash SHA-256, Anti-Fuerza Bruta y Auditoría Permanente
 * ==========================================================================
 */

class LionsAdminApp {
  constructor() {
    // Hash SHA-256 del PIN inicial '1234' (Nunca se guarda el PIN en texto plano)
    this.defaultPinHash =
      "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4";
    this.pinHashKey = "lions_admin_pinhash_v1";
    this.storageKey = "lions_barber_appointments_v1";
    this.archiveKey = "lions_barber_audit_archive_v1";
    this.configKey = "lions_barber_config_v1";

    // Intentos de login y bloqueo
    this.maxAttempts = 3;
    this.lockTimeMinutes = 5;

    // Catálogo de Sedes de Ibagué
    this.branches = [
      {
        id: "sede-principal",
        name: "Sede Principal (Cl. 11 #12-38)",
        address: "Cl. 11 #12-38, Ibagué, Tolima",
        icon: "fa-crown",
      },
      {
        id: "sede-segunda",
        name: "2da Sede (Cra. 13 A #5-13)",
        address: "Cra. 13 A #5-13, Ibagué, Tolima",
        icon: "fa-gem",
      },
    ];

    // Catálogo de Barberos
    this.barbers = [
      {
        id: "barber-yeico",
        name: "Yeico Quintero (CEO)",
        branchId: "sede-segunda",
        branchName: "2da Sede (Cra. 13 A #5-13)",
        avatarIcon: "fa-crown",
      },
      {
        id: "barber-principal-1",
        name: 'Carlos "Fade Master"',
        branchId: "sede-principal",
        branchName: "Sede Principal (Cl. 11 #12-38)",
        avatarIcon: "fa-scissors",
      },
      {
        id: "barber-principal-2",
        name: 'Andrés "The Razor"',
        branchId: "sede-principal",
        branchName: "Sede Principal (Cl. 11 #12-38)",
        avatarIcon: "fa-user-ninja",
      },
      {
        id: "barber-principal-3",
        name: 'Mateo "Freestyle"',
        branchId: "sede-principal",
        branchName: "Sede Principal (Cl. 11 #12-38)",
        avatarIcon: "fa-palette",
      },
    ];

    // Servicios
    this.services = [
      {
        id: "serv-corte-clasico",
        name: "Corte Moderno / Clásico Lions",
        price: 25000,
      },
      {
        id: "serv-barba-imperial",
        name: "Ritual de Barba & Toalla Caliente",
        price: 18000,
      },
      {
        id: "serv-combo-vip",
        name: "Combo Lions VIP (Corte + Barba + Cejas)",
        price: 40000,
      },
      { id: "serv-corte-nino", name: "Corte Junior (Niños)", price: 20000 },
      {
        id: "serv-limpieza-facial",
        name: "Exfoliación & Mascarilla Black Mask",
        price: 22000,
      },
      {
        id: "serv-tinte-platinado",
        name: "Colorimetría & Platinado",
        price: 80000,
      },
    ];

    this.config = this.loadConfig();
    this.appointments = this.loadAppointments();
    this.archivedAppointments = this.loadArchived();

    this.initInactivityTimer();
    this.checkAuth();
  }

  // ==================== GENERADOR DE HASH CRIPTOGRÁFICO SHA-256 ====================
  async sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  toWhatsAppNumber(phone) {
    let clean = (phone || "").replace(/[^0-9]/g, "");
    // Si son 10 dígitos (número colombiano sin indicativo), se le antepone 57
    if (clean.length === 10) clean = "57" + clean;
    return clean;
  }

  getSavedPinHash() {
    return localStorage.getItem(this.pinHashKey) || this.defaultPinHash;
  }

  // ==================== SEGURIDAD: VERIFICACIÓN Y ANTI-FUERZA BRUTA ====================
  checkAuth() {
    const isLogged = sessionStorage.getItem("lions_admin_logged") === "true";
    const loginScreen = document.getElementById("admin-login-screen");
    const dashboardScreen = document.getElementById("admin-dashboard-screen");

    if (isLogged) {
      if (loginScreen) loginScreen.style.display = "none";
      if (dashboardScreen) dashboardScreen.style.display = "block";
      this.initDashboard();
    } else {
      if (loginScreen) loginScreen.style.display = "flex";
      if (dashboardScreen) dashboardScreen.style.display = "none";
    }
  }

  async handleLogin(e) {
    e.preventDefault();

    // Comprobar si el acceso está bloqueado por intentos fallidos
    const lockUntil = localStorage.getItem("lions_admin_lock_until");
    if (lockUntil && Date.now() < Number(lockUntil)) {
      const remainingMin = Math.ceil((Number(lockUntil) - Date.now()) / 60000);
      alert(
        `⛔ Acceso bloqueado por demasiados intentos fallidos. Intenta nuevamente en ${remainingMin} minuto(s).`,
      );
      return;
    }

    const pinInput = document.getElementById("admin-pin");
    const enteredPin = pinInput ? pinInput.value.trim() : "";
    if (!enteredPin) return;

    const enteredHash = await this.sha256(enteredPin);
    const validHash = this.getSavedPinHash();

    if (enteredHash === validHash) {
      // Login exitoso: Limpiar intentos fallidos
      localStorage.removeItem("lions_admin_attempts");
      localStorage.removeItem("lions_admin_lock_until");
      sessionStorage.setItem("lions_admin_logged", "true");
      this.checkAuth();
    } else {
      // Intento fallido
      let attempts =
        Number(localStorage.getItem("lions_admin_attempts") || 0) + 1;
      localStorage.setItem("lions_admin_attempts", attempts);

      if (attempts >= this.maxAttempts) {
        const lockExpiration = Date.now() + this.lockTimeMinutes * 60 * 1000;
        localStorage.setItem("lions_admin_lock_until", lockExpiration);
        alert(
          `🚨 Has superado el límite de 3 intentos. El panel ha sido bloqueado por seguridad durante ${this.lockTimeMinutes} minutos.`,
        );
      } else {
        alert(
          `⚠️ PIN incorrecto. Te quedan ${this.maxAttempts - attempts} intento(s) antes del bloqueo.`,
        );
      }

      if (pinInput) {
        pinInput.value = "";
        pinInput.focus();
      }
    }
  }

  // ==================== AUTO-CIERRE DE SESIÓN POR INACTIVIDAD (15 MIN) ====================
  initInactivityTimer() {
    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      // 15 minutos = 900,000 ms
      timeout = setTimeout(() => {
        if (sessionStorage.getItem("lions_admin_logged") === "true") {
          alert(
            "⏱️ Tu sesión ha expirado por inactividad para proteger los datos financieros.",
          );
          this.logout();
        }
      }, 900000);
    };

    window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;
    document.ontouchstart = resetTimer;
  }

  logout() {
    sessionStorage.removeItem("lions_admin_logged");
    this.checkAuth();
  }

  // Cambiar PIN de Administrador
  async changePin() {
    const currentPin = prompt("Ingresa tu PIN actual:");
    if (!currentPin) return;

    const currentHash = await this.sha256(currentPin);
    if (currentHash !== this.getSavedPinHash()) {
      alert("❌ El PIN actual no es correcto.");
      return;
    }

    const newPin = prompt("Ingresa el NUEVO PIN (mínimo 4 dígitos):");
    if (!newPin || newPin.length < 4) {
      alert("❌ El PIN debe tener al menos 4 caracteres.");
      return;
    }

    const confirmPin = prompt("Confirma el NUEVO PIN:");
    if (newPin !== confirmPin) {
      alert("❌ Los PIN ingresados no coinciden.");
      return;
    }

    const newHash = await this.sha256(newPin);
    localStorage.setItem(this.pinHashKey, newHash);
    alert("🔒 ¡PIN de Administrador actualizado con éxito!");
  }

  // ==================== PERSISTENCIA Y CARGA DE DATOS ====================
  loadConfig() {
    const saved = localStorage.getItem(this.configKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return { barberPercent: 50, shopPercent: 50 };
  }

  saveConfig() {
    localStorage.setItem(this.configKey, JSON.stringify(this.config));
  }

  loadAppointments() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [];
  }

  saveAppointments(data = this.appointments) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  loadArchived() {
    const saved = localStorage.getItem(this.archiveKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [];
  }

  saveArchived(data = this.archivedAppointments) {
    localStorage.setItem(this.archiveKey, JSON.stringify(data));
  }

  formatMoney(amount) {
    return "$ " + Number(amount || 0).toLocaleString("es-CO");
  }

  // ==================== INICIALIZACIÓN DASHBOARD ====================
  initDashboard() {
    this.populateBranchFilters();
    this.renderAdminDashboard();
  }

  populateBranchFilters() {
    const select = document.getElementById("filter-branch");
    if (select) {
      select.innerHTML =
        '<option value="all">Todas las Sedes</option>' +
        this.branches
          .map((b) => `<option value="${b.id}">${b.name}</option>`)
          .join("");
    }

    const manualBranch = document.getElementById("manual-branch");
    if (manualBranch) {
      manualBranch.innerHTML = this.branches
        .map((b) => `<option value="${b.id}">${b.name}</option>`)
        .join("");
      this.updateManualBarbers();
    }

    const manualService = document.getElementById("manual-service");
    if (manualService) {
      manualService.innerHTML = this.services
        .map(
          (s) =>
            `<option value="${s.id}">${s.name} (${this.formatMoney(s.price)})</option>`,
        )
        .join("");
      this.updateManualServicePrice();
    }
  }

  renderAdminDashboard() {
    this.calculateKPIs();
    this.renderAdminAppointmentsTable();
    this.renderBarbersAccounting();
    this.renderBranchesAccounting();
    this.renderArchivedTable();
  }

  calculateKPIs() {
    const paid = this.appointments.filter(
      (a) => a.status === "Completado / Pagado",
    );
    const pending = this.appointments.filter((a) => a.status === "Pendiente");

    const totalRev = paid.reduce((sum, a) => sum + Number(a.price || 0), 0);
    const barbersPayout = paid.reduce(
      (sum, a) => sum + Number(a.barberCommission || 0),
      0,
    );
    const shopProfit = paid.reduce(
      (sum, a) => sum + Number(a.shopProfit || 0),
      0,
    );

    const kpiRev = document.getElementById("kpi-total-revenue");
    const kpiCount = document.getElementById("kpi-revenue-count");
    const kpiBarber = document.getElementById("kpi-barbers-payout");
    const kpiShop = document.getElementById("kpi-shop-profit");
    const kpiTotal = document.getElementById("kpi-total-appointments");
    const kpiBreakdown = document.getElementById("kpi-status-breakdown");
    const badgeArchive = document.getElementById("badge-archive-count");

    if (kpiRev) kpiRev.textContent = this.formatMoney(totalRev);
    if (kpiCount) kpiCount.textContent = `${paid.length} cortes pagados`;
    if (kpiBarber) kpiBarber.textContent = this.formatMoney(barbersPayout);
    if (kpiShop) kpiShop.textContent = this.formatMoney(shopProfit);
    if (kpiTotal) kpiTotal.textContent = this.appointments.length;
    if (kpiBreakdown)
      kpiBreakdown.textContent = `${pending.length} Pendientes | ${paid.length} Pagadas`;
    if (badgeArchive)
      badgeArchive.textContent = this.archivedAppointments.length;
  }

  renderAdminAppointmentsTable() {
    const tbody = document.getElementById("admin-appointments-tbody");
    if (!tbody) return;

    const search =
      document.getElementById("admin-search-input")?.value.toLowerCase() || "";
    const statusFilter =
      document.getElementById("filter-status")?.value || "all";
    const branchFilter =
      document.getElementById("filter-branch")?.value || "all";
    const timeFilter =
      document.getElementById("filter-timeframe")?.value || "all";
    const todayStr = new Date().toISOString().split("T")[0];

    const filtered = this.appointments.filter((a) => {
      const matchSearch =
        (a.clientName || "").toLowerCase().includes(search) ||
        (a.clientPhone || "").toLowerCase().includes(search) ||
        (a.barberName || "").toLowerCase().includes(search) ||
        (a.id || "").toLowerCase().includes(search);
      const matchStatus = statusFilter === "all" || a.status === statusFilter;
      const matchBranch = branchFilter === "all" || a.branchId === branchFilter;
      let matchTime = true;
      if (timeFilter === "today") matchTime = a.date === todayStr;
      else if (timeFilter === "month")
        matchTime = (a.date || "").substring(0, 7) === todayStr.substring(0, 7);
      return matchSearch && matchStatus && matchBranch && matchTime;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="11" class="text-center" style="padding: 2.5rem; color: var(--text-muted);"><i class="fa-solid fa-inbox" style="font-size: 2rem; display: block; margin-bottom: 0.5rem;"></i>No hay registros activos que coincidan con los filtros.</td></tr>`;
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
        return `
        <tr>
          <td><strong class="text-gold">#${a.id}</strong></td>
          <td>${a.date}<br><small class="card-desc">${a.time}</small></td>
          <td><strong>${a.clientName}</strong></td>
          <td>
            <a href="https://wa.me/${this.toWhatsAppNumber(a.clientPhone)}" target="_blank" class="text-gold">
              <i class="fa-brands fa-whatsapp"></i> ${a.clientPhone}
            </a>
          </td>
          <td><small>${(a.branchName || "").split("(")[0]}</small></td>
          <td>${(a.barberName || "").split(" ")[0]}</td>
          <td>${a.serviceName}</td>
          <td><strong>${this.formatMoney(a.price)}</strong></td>
          <td><small>${a.paymentMethod || "Efectivo"}</small></td>
          <td><span class="status-badge ${badgeClass}">${a.status}</span></td>
          <td>
            <div class="table-actions">
              ${a.status !== "Completado / Pagado" ? `<button class="action-btn pay" title="Marcar como Pagado" onclick="adminApp.quickMarkPaid('${a.id}')"><i class="fa-solid fa-check"></i></button>` : ""}
              ${a.status === "Pendiente" ? `<button class="action-btn" title="Marcar como Cancelado" onclick="adminApp.quickCancelAppointment('${a.id}')"><i class="fa-solid fa-xmark"></i></button>` : ""}
              <button class="action-btn archive" title="Archivar en Papelera de Seguridad" onclick="adminApp.archiveAppointment('${a.id}')">
                <i class="fa-solid fa-box-archive"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
      })
      .join("");
  }

  // ==================== ACCIONES & ARCHIVADO SEGURO ====================
  quickMarkPaid(appointmentId) {
    const appt = this.appointments.find((a) => a.id === appointmentId);
    if (!appt) return;

    const method = prompt(
      "Selecciona Método de Pago:\n1. Efectivo\n2. Nequi / Daviplata / Transferencia\n3. Tarjeta Débito/Crédito",
      "Efectivo",
    );
    if (method === null) return;

    let finalMethod = "Efectivo";
    if (
      method === "2" ||
      method.toLowerCase().includes("nequi") ||
      method.toLowerCase().includes("trans")
    )
      finalMethod = "Transferencia / Nequi / Daviplata";
    else if (method === "3" || method.toLowerCase().includes("tarjeta"))
      finalMethod = "Tarjeta Débito/Crédito";

    appt.status = "Completado / Pagado";
    appt.paymentMethod = finalMethod;
    appt.barberCommission = Math.round(
      Number(appt.price || 0) * (this.config.barberPercent / 100),
    );
    appt.shopProfit = Math.round(
      Number(appt.price || 0) * (this.config.shopPercent / 100),
    );

    this.saveAppointments();
    this.renderAdminDashboard();
  }

  quickCancelAppointment(appointmentId) {
    const appt = this.appointments.find((a) => a.id === appointmentId);
    if (
      appt &&
      confirm(`¿Deseas marcar como cancelada la cita #${appointmentId}?`)
    ) {
      appt.status = "Cancelado";
      this.saveAppointments();
      this.renderAdminDashboard();
    }
  }

  // Archivar en Papelera de Seguridad
  archiveAppointment(appointmentId) {
    const apptIndex = this.appointments.findIndex(
      (a) => a.id === appointmentId,
    );
    if (apptIndex === -1) return;

    const reason = prompt(
      "Indica el motivo del archivado (ej: Cliente no asistió, Registro duplicado, etc.):",
      "Cliente no asistió / Cancelación",
    );
    if (reason === null) return;

    const appt = this.appointments[apptIndex];
    appt.archivedAt = new Date().toLocaleString("es-CO");
    appt.archivedReason = reason || "Sin motivo especificado";

    this.archivedAppointments.unshift(appt);
    this.appointments.splice(apptIndex, 1);

    this.saveAppointments();
    this.saveArchived();
    this.renderAdminDashboard();
    alert(
      `✅ La cita #${appointmentId} fue trasladada a la Papelera de Auditoría.`,
    );
  }

  // Restaurar Cita
  restoreAppointment(appointmentId) {
    const archIndex = this.archivedAppointments.findIndex(
      (a) => a.id === appointmentId,
    );
    if (archIndex === -1) return;

    if (
      confirm(`¿Deseas restaurar la cita #${appointmentId} al registro activo?`)
    ) {
      const appt = this.archivedAppointments[archIndex];
      delete appt.archivedAt;
      delete appt.archivedReason;

      this.appointments.unshift(appt);
      this.archivedAppointments.splice(archIndex, 1);

      this.saveAppointments();
      this.saveArchived();
      this.renderAdminDashboard();
      alert(`✅ La cita #${appointmentId} ha sido restaurada exitosamente.`);
    }
  }

  // Tabla Papelera
  renderArchivedTable() {
    const tbody = document.getElementById("archived-appointments-tbody");
    if (!tbody) return;

    if (this.archivedAppointments.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" class="text-center" style="padding: 2.5rem; color: var(--text-muted);"><i class="fa-solid fa-folder-open" style="font-size: 2rem; display: block; margin-bottom: 0.5rem;"></i>No hay registros archivados en la papelera.</td></tr>`;
      return;
    }

    tbody.innerHTML = this.archivedAppointments
      .map(
        (a) => `
      <tr>
        <td><strong class="text-gold">#${a.id}</strong></td>
        <td>${a.date} (${a.time})</td>
        <td><strong>${a.clientName}</strong></td>
        <td><small>${(a.branchName || "").split("(")[0]}</small></td>
        <td>${(a.barberName || "").split(" ")[0]}</td>
        <td>${a.serviceName}</td>
        <td>${this.formatMoney(a.price)}</td>
        <td><small>${a.archivedAt || "-"}</small></td>
        <td><span class="status-badge status-canceled">${a.archivedReason || "Archivado"}</span></td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="adminApp.restoreAppointment('${a.id}')" title="Restaurar">
            <i class="fa-solid fa-rotate-left"></i> Restaurar
          </button>
        </td>
      </tr>
    `,
      )
      .join("");
  }

  switchAdminTab(tabName) {
    document
      .querySelectorAll(".admin-tab")
      .forEach((t) => t.classList.remove("active"));
    document
      .querySelectorAll(".admin-tab-content")
      .forEach((c) => c.classList.remove("active"));

    const activeBtn = Array.from(document.querySelectorAll(".admin-tab")).find(
      (b) => b.getAttribute("onclick")?.includes(tabName),
    );
    if (activeBtn) activeBtn.classList.add("active");

    const content = document.getElementById(`tab-${tabName}`);
    if (content) content.classList.add("active");

    if (tabName === "barberos-stats") this.renderBarbersAccounting();
    else if (tabName === "sedes-stats") this.renderBranchesAccounting();
    else if (tabName === "citas") this.renderAdminAppointmentsTable();
    else if (tabName === "papelera") this.renderArchivedTable();
  }

  // Contabilidad por Barbero
  renderBarbersAccounting() {
    const container = document.getElementById("barbers-accounting-container");
    if (!container) return;

    container.innerHTML = this.barbers
      .map((barber) => {
        const paid = this.appointments.filter(
          (a) =>
            (a.barberId === barber.id ||
              (a.barberName &&
                a.barberName.includes(barber.name.split(" ")[0]))) &&
            a.status === "Completado / Pagado",
        );
        const totalGen = paid.reduce((sum, a) => sum + Number(a.price || 0), 0);
        const payout = paid.reduce(
          (sum, a) => sum + Number(a.barberCommission || 0),
          0,
        );
        const shopProfit = totalGen - payout;

        return `
        <div class="barber-finance-card">
          <div>
            <div class="barber-finance-header">
              <div class="barber-finance-avatar"><i class="fa-solid ${barber.avatarIcon}"></i></div>
              <div><h4 class="card-title">${barber.name}</h4><small class="card-desc">${barber.branchName}</small></div>
            </div>
            <div class="finance-stats-row"><span class="card-desc">Cortes Pagados:</span><strong>${paid.length} servicios</strong></div>
            <div class="finance-stats-row"><span class="card-desc">Total Facturado:</span><span>${this.formatMoney(totalGen)}</span></div>
            <div class="finance-stats-row"><span class="card-desc">Comisión Barbero (${this.config.barberPercent}%):</span><span class="val-highlight">${this.formatMoney(payout)}</span></div>
            <div class="finance-stats-row"><span class="card-desc">Ganancia Neta Barbería:</span><strong class="text-gold">${this.formatMoney(shopProfit)}</strong></div>
          </div>
        </div>
      `;
      })
      .join("");
  }

  // Rendimiento por Sede
  renderBranchesAccounting() {
    const container = document.getElementById("branches-accounting-container");
    if (!container) return;

    container.innerHTML = this.branches
      .map((branch) => {
        const paid = this.appointments.filter(
          (a) => a.branchId === branch.id && a.status === "Completado / Pagado",
        );
        const totalRev = paid.reduce((sum, a) => sum + Number(a.price || 0), 0);
        const payouts = paid.reduce(
          (sum, a) => sum + Number(a.barberCommission || 0),
          0,
        );
        const branchNet = totalRev - payouts;

        return `
        <div class="branch-finance-card">
          <div>
            <div class="barber-finance-header">
              <div class="barber-finance-avatar" style="color: var(--info); border-color: var(--info);"><i class="fa-solid ${branch.icon}"></i></div>
              <div><h4 class="card-title">${branch.name}</h4><small class="card-desc">${branch.address}</small></div>
            </div>
            <div class="finance-stats-row"><span class="card-desc">Cortes Pagados en Sede:</span><strong>${paid.length} clientes</strong></div>
            <div class="finance-stats-row"><span class="card-desc">Ingresos Brutos:</span><span class="val-highlight">${this.formatMoney(totalRev)}</span></div>
            <div class="finance-stats-row"><span class="card-desc">Liquidación Barberos:</span><span>${this.formatMoney(payouts)}</span></div>
            <div class="finance-stats-row"><span class="card-desc">Margen Neto Barbería:</span><strong class="text-gold">${this.formatMoney(branchNet)}</strong></div>
          </div>
        </div>
      `;
      })
      .join("");
  }

  // Comisiones
  updateCommissionRate() {
    const input = document.getElementById("config-barber-percent");
    const shopInput = document.getElementById("config-shop-percent");
    if (!input || !shopInput) return;

    let val = Math.max(0, Math.min(100, parseInt(input.value) || 0));
    input.value = val;
    this.config.barberPercent = val;
    this.config.shopPercent = 100 - val;
    shopInput.value = `${this.config.shopPercent}%`;

    this.appointments.forEach((a) => {
      a.barberCommission = Math.round(
        Number(a.price || 0) * (this.config.barberPercent / 100),
      );
      a.shopProfit = Math.round(
        Number(a.price || 0) * (this.config.shopPercent / 100),
      );
    });

    this.saveConfig();
    this.saveAppointments();
    this.renderAdminDashboard();
  }

  // Venta Manual
  openManualAppointmentModal() {
    const modal = document.getElementById("manual-modal");
    if (modal) modal.classList.add("active");
  }

  closeManualModal() {
    const modal = document.getElementById("manual-modal");
    if (modal) modal.classList.remove("active");
  }

  updateManualBarbers() {
    const branchSelect = document.getElementById("manual-branch");
    const barberSelect = document.getElementById("manual-barber");
    if (!branchSelect || !barberSelect) return;
    const branchBarbers = this.barbers.filter(
      (b) => b.branchId === branchSelect.value,
    );
    barberSelect.innerHTML = branchBarbers
      .map((b) => `<option value="${b.id}">${b.name}</option>`)
      .join("");
  }

  updateManualServicePrice() {
    const serviceSelect = document.getElementById("manual-service");
    const priceInput = document.getElementById("manual-price");
    if (!serviceSelect || !priceInput) return;
    const serv = this.services.find((s) => s.id === serviceSelect.value);
    if (serv) priceInput.value = serv.price;
  }

  handleManualSaleSubmit(e) {
    e.preventDefault();
    const client = document.getElementById("manual-client").value.trim();
    const phone =
      document.getElementById("manual-phone").value.trim() || "3100000000";
    const branch = this.branches.find(
      (b) => b.id === document.getElementById("manual-branch").value,
    );
    const barber = this.barbers.find(
      (b) => b.id === document.getElementById("manual-barber").value,
    );
    const service = this.services.find(
      (s) => s.id === document.getElementById("manual-service").value,
    );
    const price = Number(document.getElementById("manual-price").value) || 0;
    const paymentMethod = document.getElementById(
      "manual-payment-method",
    ).value;
    const status = document.getElementById("manual-status").value;

    const now = new Date();
    const newSale = {
      id: "LIONS-" + Math.floor(1000 + Math.random() * 9000),
      createdAt: now.toISOString(),
      date: now.toISOString().split("T")[0],
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      clientName: client,
      clientPhone: phone,
      branchId: branch ? branch.id : "",
      branchName: branch ? branch.name : "Sede Principal",
      barberId: barber ? barber.id : "",
      barberName: barber ? barber.name : "Barbero",
      serviceId: service ? service.id : "",
      serviceName: service ? service.name : "Servicio",
      price: price,
      barberCommission: Math.round(price * (this.config.barberPercent / 100)),
      shopProfit: Math.round(price * (this.config.shopPercent / 100)),
      paymentMethod: paymentMethod,
      status: status,
      notes: "Registro directo en local",
    };

    this.appointments.unshift(newSale);
    this.saveAppointments();
    this.closeManualModal();
    this.renderAdminDashboard();
    alert("¡Venta registrada exitosamente en la contabilidad!");
  }

  // Exportar Excel Profesional (.xlsx)
  exportToExcel() {
    if (typeof XLSX === "undefined") {
      alert("Error: La librería SheetJS no está cargada.");
      return;
    }

    const appointmentsData = this.appointments.map((a) => ({
      "ID Cita": "#" + a.id,
      Fecha: a.date,
      Hora: a.time,
      Cliente: a.clientName,
      "Teléfono / WhatsApp": a.clientPhone,
      "Sede Ibagué": a.branchName,
      "Barbero Asignado": a.barberName,
      Servicio: a.serviceName,
      "Precio Total ($)": a.price,
      "Comisión Barbero ($)": a.barberCommission,
      "Ganancia Barbería ($)": a.shopProfit,
      "Método de Pago": a.paymentMethod || "Efectivo",
      Estado: a.status,
      Notas: a.notes || "",
    }));

    const barbersSummary = this.barbers.map((barber) => {
      const paid = this.appointments.filter(
        (a) =>
          (a.barberId === barber.id ||
            (a.barberName &&
              a.barberName.includes(barber.name.split(" ")[0]))) &&
          a.status === "Completado / Pagado",
      );
      const totalGen = paid.reduce((s, a) => s + Number(a.price || 0), 0);
      const payout = paid.reduce(
        (s, a) => s + Number(a.barberCommission || 0),
        0,
      );
      return {
        Barbero: barber.name,
        Sede: barber.branchName,
        "Cortes Realizados": paid.length,
        "Total Facturado ($)": totalGen,
        "Comisión Barbero a Pagar ($)": payout,
        "Ganancia Neta Barbería ($)": totalGen - payout,
      };
    });

    const paidOnly = this.appointments.filter(
      (a) => a.status === "Completado / Pagado",
    );
    const totalRev = paidOnly.reduce((s, a) => s + Number(a.price || 0), 0);
    const totalBarberPayout = paidOnly.reduce(
      (s, a) => s + Number(a.barberCommission || 0),
      0,
    );

    const balanceData = [
      {
        "Métrica Contable": "Total Citas Activas",
        Valor: this.appointments.length,
      },
      { "Métrica Contable": "Total Citas Pagadas", Valor: paidOnly.length },
      {
        "Métrica Contable": "Total Citas Pendientes",
        Valor: this.appointments.filter((a) => a.status === "Pendiente").length,
      },
      {
        "Métrica Contable": "Total Citas Canceladas",
        Valor: this.appointments.filter((a) => a.status === "Cancelado").length,
      },
      {
        "Métrica Contable": "Total Registros Archivados (Papelera)",
        Valor: this.archivedAppointments.length,
      },
      { "Métrica Contable": "INGRESOS TOTALES BRUTOS ($)", Valor: totalRev },
      {
        "Métrica Contable": "TOTAL A PAGAR A BARBEROS ($)",
        Valor: totalBarberPayout,
      },
      {
        "Métrica Contable": "GANANCIA NETA LIONS BARBER SHOP ($)",
        Valor: totalRev - totalBarberPayout,
      },
      {
        "Métrica Contable": "Comisión Barbero",
        Valor: `${this.config.barberPercent}%`,
      },
      {
        "Métrica Contable": "Margen Barbería",
        Valor: `${this.config.shopPercent}%`,
      },
      {
        "Métrica Contable": "Ubicación Principal",
        Valor: "Cl. 11 #12-38, Ibagué, Tolima",
      },
      {
        "Métrica Contable": "Fecha de Reporte",
        Valor: new Date().toLocaleString("es-CO"),
      },
    ];

    const archivedData = this.archivedAppointments.map((a) => ({
      "ID Cita": "#" + a.id,
      "Fecha Cita": a.date + " (" + a.time + ")",
      Cliente: a.clientName,
      Teléfono: a.clientPhone,
      Sede: a.branchName,
      Barbero: a.barberName,
      Servicio: a.serviceName,
      "Valor ($)": a.price,
      "Fecha Archivado": a.archivedAt || "-",
      "Motivo de Baja": a.archivedReason || "Archivado",
    }));

    const wb = XLSX.utils.book_new();
    const wsAppts = XLSX.utils.json_to_sheet(appointmentsData);
    const wsBarbers = XLSX.utils.json_to_sheet(barbersSummary);
    const wsBalance = XLSX.utils.json_to_sheet(balanceData);
    const wsArchived = XLSX.utils.json_to_sheet(
      archivedData.length > 0
        ? archivedData
        : [{ Información: "No hay registros archivados" }],
    );

    XLSX.utils.book_append_sheet(wb, wsAppts, "Detalle de Citas");
    XLSX.utils.book_append_sheet(wb, wsBarbers, "Liquidación Barberos");
    XLSX.utils.book_append_sheet(wb, wsBalance, "Balance Contable");
    XLSX.utils.book_append_sheet(wb, wsArchived, "Historial y Bajas");

    XLSX.writeFile(
      wb,
      `Contabilidad_Auditoria_Lions_Barber_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  }

  resetSampleData() {
    if (confirm("¿Deseas restaurar los datos de ejemplo iniciales?")) {
      const today = new Date().toISOString().split("T")[0];
      this.appointments = [
        {
          id: "LIONS-1045",
          date: today,
          time: "10:15 AM",
          clientName: "Juan Manuel Morales",
          clientPhone: "3104567890",
          branchId: "sede-segunda",
          branchName: "2da Sede (Cra. 13 A #5-13)",
          barberId: "barber-yeico",
          barberName: "Yeico Quintero (CEO)",
          serviceId: "serv-combo-vip",
          serviceName: "Combo Lions VIP (Corte + Barba + Cejas)",
          price: 40000,
          barberCommission: 20000,
          shopProfit: 20000,
          paymentMethod: "Transferencia / Nequi / Daviplata",
          status: "Completado / Pagado",
          notes: "Degradado medio",
        },
      ];
      this.saveAppointments();
      this.renderAdminDashboard();
    }
  }
}

// Inicialización Global
const adminApp = new LionsAdminApp();
