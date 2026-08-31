/**
 * ==========================================================================
 * LIONS BARBER SHOP - IBAGUÉ, COLOMBIA (script.js)
 * CEO: Yeico Quintero
 * ==========================================================================
 */

class LionsBarberShopApp {
  constructor() {
    this.storageKey = "lions_barber_appointments_v1";
    this.configKey = "lions_barber_config_v1";

    // Configuración Contable
    this.config = this.loadConfig();

    // Enlace de WhatsApp Oficial de Lions Barber Shop
    this.officialWhatsAppUrl =
      "https://api.whatsapp.com/message/2GRNX7WWAKYKN1?autoload=1&app_absent=0&utm_source=ig";

    // Sedes reales de Ibagué
    this.branches = [
      {
        id: "sede-principal",
        name: "Sede Principal (Cl. 11 #12-38)",
        address: "Cl. 11 #12-38, Ibagué, Tolima",
        mapsUrl: "https://maps.app.goo.gl/zGFsDWxk14tmvYZAA",
        phone: "+57 (Ibagué)",
        hours: "Lun - Sáb: 9:00 AM - 8:30 PM | Dom: 10:00 AM - 6:00 PM",
        icon: "fa-crown",
        description:
          "Sede Principal con 3 barberos de élite, zona lounge y atención personalizada.",
      },
      {
        id: "sede-segunda",
        name: "2da Sede (Cra. 13 A #5-13)",
        address: "Cra. 13 A #5-13, Ibagué, Tolima",
        mapsUrl: "https://maps.app.goo.gl/zGFsDWxk14tmvYZAA",
        phone: "+57 (Ibagué)",
        hours: "Lun - Sáb: 9:00 AM - 8:30 PM | Dom: 10:00 AM - 6:00 PM",
        icon: "fa-gem",
        description:
          "Atención exclusiva con nuestro CEO Yeico Quintero. Imagen, clase y máxima precisión.",
      },
    ];

    // Catálogo de Barberos (3 en la principal y Yeico en la 2da sede)
    this.barbers = [
      // 2da Sede (CEO)
      {
        id: "barber-yeico",
        name: "Yeico Quintero (CEO)",
        role: "CEO & Master Barber",
        branchId: "sede-segunda",
        branchName: "2da Sede (Cra. 13 A #5-13)",
        specialty:
          "Cortes exclusivos, visagismo ejecutivo, degradados de alta gama y diseño de barba",
        rating: 5.0,
        avatarIcon: "fa-crown",
        instagram: "https://www.instagram.com/yeico_quintero/",
      },
      // Sede Principal (3 Barberos)
      {
        id: "barber-principal-1",
        name: 'Carlos "Fade Master"',
        role: "Barbero Profesional Senior",
        branchId: "sede-principal",
        branchName: "Sede Principal (Cl. 11 #12-38)",
        specialty: "Skin Fade, Taper Fade, Texturizados & Perfilado clásico",
        rating: 4.9,
        avatarIcon: "fa-scissors",
      },
      {
        id: "barber-principal-2",
        name: 'Andrés "The Razor"',
        role: "Especialista en Barba & Navaja",
        branchId: "sede-principal",
        branchName: "Sede Principal (Cl. 11 #12-38)",
        specialty:
          "Ritual de barba imperial, toalla caliente y corte clásico a tijera",
        rating: 4.9,
        avatarIcon: "fa-user-ninja",
      },
      {
        id: "barber-principal-3",
        name: 'Mateo "Freestyle"',
        role: "Especialista en Color & Diseños",
        branchId: "sede-principal",
        branchName: "Sede Principal (Cl. 11 #12-38)",
        specialty: "Platinados, líneas creativas, degradados modernos y cejas",
        rating: 4.8,
        avatarIcon: "fa-palette",
      },
    ];

    // Servicios & Tarifas
    this.services = [
      {
        id: "serv-corte-clasico",
        name: "Corte Moderno / Clásico Lions",
        category: "Corte de Cabello",
        price: 25000,
        duration: "40 min",
        description:
          "Asesoría de visagismo, corte personalizado a máquina y tijera, lavado refrescante y peinado con cera/pomada.",
        icon: "fa-scissors",
        popular: true,
      },
      {
        id: "serv-barba-imperial",
        name: "Ritual de Barba & Toalla Caliente",
        category: "Barba",
        price: 18000,
        duration: "30 min",
        description:
          "Perfilado milimétrico con navaja tradicional, toalla caliente aromatizada, aceites hidratantes y masaje relajante.",
        icon: "fa-wand-magic-sparkles",
        popular: false,
      },
      {
        id: "serv-combo-vip",
        name: "Combo Lions VIP (Corte + Barba + Cejas)",
        category: "Combos Exclusivos",
        price: 40000,
        duration: "60 min",
        description:
          "La experiencia completa: Corte signature, perfilado de barba, doble toalla caliente, perfilado de cejas y bebida de cortesía.",
        icon: "fa-crown",
        popular: true,
      },
      {
        id: "serv-corte-nino",
        name: "Corte Junior (Niños)",
        category: "Corte de Cabello",
        price: 20000,
        duration: "35 min",
        description:
          "Atención paciente y dedicada para los pequeños caballeros, incluye diseño suave y fijación.",
        icon: "fa-child",
        popular: false,
      },
      {
        id: "serv-limpieza-facial",
        name: "Exfoliación & Mascarilla Black Mask",
        category: "Faciales",
        price: 22000,
        duration: "30 min",
        description:
          "Limpieza de impurezas, extracción de puntos negros, hidratación profunda y tónico refrescante.",
        icon: "fa-spa",
        popular: false,
      },
      {
        id: "serv-tinte-platinado",
        name: "Colorimetría & Platinado",
        category: "Color",
        price: 80000,
        duration: "90 min",
        description:
          "Decoloración profesional cuidando la hebra capilar, matización platinada o tonos de tendencia.",
        icon: "fa-palette",
        popular: false,
      },
    ];

    this.bookingState = {
      branchId: null,
      barberId: null,
      serviceId: null,
      date: null,
      time: null,
    };

    this.appointments = this.loadAppointments();
    this.init();
  }

  init() {
    this.renderLandingServices();
    this.renderLandingBarbers();
    this.renderLandingBranches();
    this.initNavigation();
    this.setupDateConstraints();
    this.renderBookingBranches();
    this.renderBookingServices();
  }

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
    const samples = this.generateSampleAppointments();
    this.saveAppointments(samples);
    return samples;
  }

  saveAppointments(data = this.appointments) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  formatMoney(amount) {
    return "$ " + Number(amount || 0).toLocaleString("es-CO");
  }

  renderLandingServices() {
    const container = document.getElementById("services-grid");
    if (!container) return;

    container.innerHTML = this.services
      .map(
        (serv) => `
      <div class="service-card">
        ${serv.popular ? '<span class="service-badge-popular"><i class="fa-solid fa-fire"></i> Más Pedido</span>' : ""}
        <div>
          <div class="service-icon-box"><i class="fa-solid ${serv.icon}"></i></div>
          <h3 class="service-name">${serv.name}</h3>
          <p class="service-desc">${serv.description}</p>
        </div>
        <div>
          <div class="service-meta">
            <span class="service-price">${this.formatMoney(serv.price)}</span>
            <span class="service-duration"><i class="fa-regular fa-clock"></i> ${serv.duration}</span>
          </div>
          <button class="btn btn-gold btn-block" onclick="app.quickBookService('${serv.id}')">
            <i class="fa-solid fa-calendar-check"></i> Agendar Este Servicio
          </button>
        </div>
      </div>
    `,
      )
      .join("");
  }

  renderLandingBarbers() {
    const container = document.getElementById("barbers-grid");
    if (!container) return;

    container.innerHTML = this.barbers
      .map(
        (barber) => `
      <div class="barber-card">
        <div class="barber-img-wrap">
          <i class="fa-solid ${barber.avatarIcon} barber-avatar-icon"></i>
          <span class="barber-branch-pill"><i class="fa-solid fa-location-dot"></i> ${barber.branchName.split("(")[0]}</span>
        </div>
        <div class="barber-info">
          <h3 class="barber-name">${barber.name}</h3>
          <p class="barber-role">${barber.role}</p>
          <div class="barber-rating">
            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
            <span>(${barber.rating})</span>
          </div>
          <p class="card-desc mb-3">${barber.specialty}</p>
          ${barber.instagram ? `<a href="${barber.instagram}" target="_blank" class="text-gold" style="font-size:0.85rem; display:block; margin-bottom:0.8rem;"><i class="fa-brands fa-instagram"></i> Ver Instagram</a>` : ""}
          <button class="btn btn-outline btn-block btn-sm mt-2" onclick="app.quickBookBarber('${barber.id}', '${barber.branchId}')">
            <i class="fa-solid fa-scissors"></i> Reservar con ${barber.name.split(" ")[0]}
          </button>
        </div>
      </div>
    `,
      )
      .join("");
  }

  renderLandingBranches() {
    const container = document.getElementById("locations-grid");
    if (!container) return;

    container.innerHTML = this.branches
      .map((branch) => {
        const branchBarbers = this.barbers.filter(
          (b) => b.branchId === branch.id,
        );
        return `
        <div class="location-card">
          <div class="location-header">
            <div class="location-icon"><i class="fa-solid ${branch.icon}"></i></div>
            <div>
              <h3 class="location-name">${branch.name}</h3>
              <span class="card-desc">${branchBarbers.length} Barbero(s) Asignado(s)</span>
            </div>
          </div>
          <p class="card-desc mb-3">${branch.description}</p>
          <p class="location-address">
            <i class="fa-solid fa-location-dot text-gold"></i>
            <span>${branch.address}</span>
          </p>
          <p class="location-hours">
            <i class="fa-regular fa-clock text-gold"></i>
            <span>${branch.hours}</span>
          </p>
          <div class="form-row-2 mt-3">
            <button class="btn btn-gold btn-block btn-sm" onclick="app.quickBookBranch('${branch.id}')">
              <i class="fa-solid fa-calendar-plus"></i> Agendar Aquí
            </button>
            <a href="${branch.mapsUrl}" target="_blank" class="btn btn-outline btn-block btn-sm">
              <i class="fa-solid fa-map-location-dot"></i> Google Maps
            </a>
          </div>
        </div>
      `;
      })
      .join("");
  }

  initNavigation() {
    const toggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("nav-menu");
    if (toggle && menu) {
      toggle.addEventListener("click", () => menu.classList.toggle("open"));
      document.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", () => menu.classList.remove("open"));
      });
    }
  }

  // Modales y Agendamiento
  openBookingModal() {
    const modal = document.getElementById("booking-modal");
    if (modal) {
      modal.classList.add("active");
      if (!this.bookingState.branchId) this.selectBranch(this.branches[0].id);
      if (!this.bookingState.serviceId) this.selectService(this.services[0].id);
    }
  }

  closeBookingModal() {
    const modal = document.getElementById("booking-modal");
    if (modal) modal.classList.remove("active");
  }

  quickBookService(id) {
    this.openBookingModal();
    this.selectService(id);
  }
  quickBookBarber(barberId, branchId) {
    this.openBookingModal();
    this.selectBranch(branchId);
    this.selectBarber(barberId);
  }
  quickBookBranch(id) {
    this.openBookingModal();
    this.selectBranch(id);
  }

  renderBookingBranches() {
    const container = document.getElementById("branches-selection");
    if (!container) return;
    container.innerHTML = this.branches
      .map(
        (branch) => `
      <div class="custom-radio-card ${this.bookingState.branchId === branch.id ? "selected" : ""}" onclick="app.selectBranch('${branch.id}')">
        <i class="fa-solid fa-circle-check card-check-icon"></i>
        <div class="card-title"><i class="fa-solid ${branch.icon} text-gold"></i> ${branch.name}</div>
        <div class="card-desc">${branch.address}</div>
      </div>
    `,
      )
      .join("");
  }

  selectBranch(branchId) {
    this.bookingState.branchId = branchId;
    this.renderBookingBranches();
    this.renderBookingBarbers(branchId);
    this.updateSummary();
  }

  renderBookingBarbers(branchId) {
    const container = document.getElementById("barbers-selection");
    if (!container) return;

    const available = this.barbers.filter((b) => b.branchId === branchId);
    let html = `
      <div class="custom-radio-card ${this.bookingState.barberId === "any" || !this.bookingState.barberId ? "selected" : ""}" onclick="app.selectBarber('any')">
        <i class="fa-solid fa-circle-check card-check-icon"></i>
        <div class="card-title"><i class="fa-solid fa-users text-gold"></i> Primer Barbero Disponible</div>
        <div class="card-desc">Asignación automática rápida</div>
      </div>
    `;

    html += available
      .map(
        (barber) => `
      <div class="custom-radio-card ${this.bookingState.barberId === barber.id ? "selected" : ""}" onclick="app.selectBarber('${barber.id}')">
        <i class="fa-solid fa-circle-check card-check-icon"></i>
        <div class="card-title">${barber.name}</div>
        <div class="card-desc">${barber.role}</div>
      </div>
    `,
      )
      .join("");

    container.innerHTML = html;
    if (
      this.bookingState.barberId !== "any" &&
      !available.some((b) => b.id === this.bookingState.barberId)
    ) {
      this.selectBarber("any");
    }
  }

  selectBarber(barberId) {
    this.bookingState.barberId = barberId;
    const container = document.getElementById("barbers-selection");
    if (container) {
      const cards = container.querySelectorAll(".custom-radio-card");
      cards.forEach((c) => c.classList.remove("selected"));
      const available = this.barbers.filter(
        (b) => b.branchId === this.bookingState.branchId,
      );
      if (barberId === "any") {
        cards[0]?.classList.add("selected");
      } else {
        const idx = available.findIndex((b) => b.id === barberId);
        if (idx !== -1 && cards[idx + 1])
          cards[idx + 1].classList.add("selected");
      }
    }
    this.updateSummary();
  }

  renderBookingServices() {
    const container = document.getElementById("services-selection");
    if (!container) return;
    container.innerHTML = this.services
      .map(
        (serv) => `
      <div class="custom-radio-card ${this.bookingState.serviceId === serv.id ? "selected" : ""}" onclick="app.selectService('${serv.id}')">
        <i class="fa-solid fa-circle-check card-check-icon"></i>
        <div class="card-title">${serv.name}</div>
        <div class="card-desc">${serv.duration} • ${serv.category}</div>
        <div class="card-price-tag">${this.formatMoney(serv.price)}</div>
      </div>
    `,
      )
      .join("");
  }

  selectService(serviceId) {
    this.bookingState.serviceId = serviceId;
    this.renderBookingServices();
    this.updateSummary();
  }

  setupDateConstraints() {
    const dateInput = document.getElementById("booking-date");
    if (dateInput) {
      const today = new Date().toISOString().split("T")[0];
      dateInput.min = today;
      dateInput.value = today;
      this.onDateSelected();
    }
  }

  onDateSelected() {
    const timeSelect = document.getElementById("booking-time");
    if (!timeSelect) return;
    const slots = [
      "09:00 AM",
      "09:45 AM",
      "10:30 AM",
      "11:15 AM",
      "12:00 PM",
      "01:00 PM",
      "01:45 PM",
      "02:30 PM",
      "03:15 PM",
      "04:00 PM",
      "04:45 PM",
      "05:30 PM",
      "06:15 PM",
      "07:00 PM",
      "07:45 PM",
    ];
    timeSelect.innerHTML = slots
      .map((s) => `<option value="${s}">${s}</option>`)
      .join("");
  }

  updateSummary() {
    const service = this.services.find(
      (s) => s.id === this.bookingState.serviceId,
    );
    const branch = this.branches.find(
      (b) => b.id === this.bookingState.branchId,
    );
    let barberName = "Primer Barbero Disponible";
    if (this.bookingState.barberId && this.bookingState.barberId !== "any") {
      const b = this.barbers.find(
        (bar) => bar.id === this.bookingState.barberId,
      );
      if (b) barberName = b.name;
    }

    const nameEl = document.getElementById("summary-service-name");
    const locEl = document.getElementById("summary-location-barber");
    const priceEl = document.getElementById("summary-total-price");

    if (nameEl && service) nameEl.textContent = service.name;
    if (locEl && branch)
      locEl.textContent = `${branch.name.split("(")[0].trim()} / ${barberName}`;
    if (priceEl && service)
      priceEl.textContent = this.formatMoney(service.price);
  }

  // Envío y WhatsApp
  handleBookingSubmit(e) {
    e.preventDefault();

    const branch =
      this.branches.find((b) => b.id === this.bookingState.branchId) ||
      this.branches[0];
    const service =
      this.services.find((s) => s.id === this.bookingState.serviceId) ||
      this.services[0];
    let barber = this.barbers.find((b) => b.id === this.bookingState.barberId);
    if (!barber || this.bookingState.barberId === "any") {
      barber = { id: "barber-any", name: "Primer Barbero Disponible (Sede)" };
    }

    const dateVal = document.getElementById("booking-date").value;
    const timeVal = document.getElementById("booking-time").value;
    const clientName = document.getElementById("client-name").value.trim();
    const clientPhone = document.getElementById("client-phone").value.trim();
    const notes = document.getElementById("booking-notes").value.trim();

    if (!dateVal || !timeVal || !clientName || !clientPhone) {
      alert("Por favor completa todos los campos requeridos.");
      return;
    }

    const newAppointment = {
      id: "LIONS-" + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString(),
      date: dateVal,
      time: timeVal,
      clientName: clientName,
      clientPhone: clientPhone,
      branchId: branch.id,
      branchName: branch.name,
      barberId: barber.id,
      barberName: barber.name,
      serviceId: service.id,
      serviceName: service.name,
      price: service.price,
      barberCommission: Math.round(
        service.price * (this.config.barberPercent / 100),
      ),
      shopProfit: Math.round(service.price * (this.config.shopPercent / 100)),
      paymentMethod: "Pendiente en Sede",
      status: "Pendiente",
      notes: notes || "Ninguna",
    };

    this.appointments.unshift(newAppointment);
    this.saveAppointments();

    const whatsappMsg = `💈 *NUEVA RESERVA - LIONS BARBER SHOP IBAGUÉ* 💈
━━━━━━━━━━━━━━━━━━━━
📌 *Código de Cita:* #${newAppointment.id}
👤 *Cliente:* ${clientName}
📱 *Teléfono:* ${clientPhone}
🏢 *Sede:* ${branch.name}
📍 *Dirección:* ${branch.address}
✂️ *Barbero:* ${barber.name}
🛎️ *Servicio:* ${service.name}
💰 *Valor:* ${this.formatMoney(service.price)}
📅 *Fecha:* ${dateVal}
⏰ *Hora:* ${timeVal}
📝 *Notas:* ${notes || "Sin observaciones"}
━━━━━━━━━━━━━━━━━━━━
_Por favor confírmame disponibilidad para quedar agendado. ¡Muchas gracias!_`;

    // Enlace oficial de WhatsApp con el mensaje pre-cargado
    const whatsappUrl = `https://api.whatsapp.com/message/2GRNX7WWAKYKN1?text=${encodeURIComponent(whatsappMsg)}`;

    this.closeBookingModal();

    if (typeof confetti === "function") {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }

    this.showSuccessModal(newAppointment, whatsappUrl);
  }

  showSuccessModal(appointment, whatsappUrl) {
    const modal = document.getElementById("success-modal");
    const ticket = document.getElementById("ticket-card-content");
    const btnDirect = document.getElementById("btn-open-whatsapp-direct");

    if (ticket) {
      ticket.innerHTML = `
        <div class="ticket-row"><span class="ticket-label">Código Cita:</span><span class="ticket-value text-gold">#${appointment.id}</span></div>
        <div class="ticket-row"><span class="ticket-label">Cliente:</span><span class="ticket-value">${appointment.clientName}</span></div>
        <div class="ticket-row"><span class="ticket-label">Sede:</span><span class="ticket-value">${appointment.branchName}</span></div>
        <div class="ticket-row"><span class="ticket-label">Barbero:</span><span class="ticket-value">${appointment.barberName}</span></div>
        <div class="ticket-row"><span class="ticket-label">Servicio:</span><span class="ticket-value">${appointment.serviceName}</span></div>
        <div class="ticket-row"><span class="ticket-label">Fecha y Hora:</span><span class="ticket-value">${appointment.date} | ${appointment.time}</span></div>
        <div class="ticket-row" style="border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 0.5rem; margin-top: 0.5rem;">
          <span class="ticket-label">Total a Pagar en Sede:</span>
          <span class="ticket-value text-gold" style="font-size: 1.1rem;">${this.formatMoney(appointment.price)}</span>
        </div>
      `;
    }

    if (btnDirect) btnDirect.href = whatsappUrl;
    if (modal) modal.classList.add("active");
    window.open(whatsappUrl, "_blank");
  }

  closeSuccessModal() {
    const modal = document.getElementById("success-modal");
    if (modal) modal.classList.remove("active");
  }

  // Panel Admin & Contabilidad
  openAdminModal() {
    const modal = document.getElementById("admin-modal");
    if (modal) {
      modal.classList.add("active");
      this.populateBranchFilters();
      this.renderAdminDashboard();
    }
  }

  closeAdminModal() {
    const modal = document.getElementById("admin-modal");
    if (modal) modal.classList.remove("active");
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

    if (kpiRev) kpiRev.textContent = this.formatMoney(totalRev);
    if (kpiCount) kpiCount.textContent = `${paid.length} cortes pagados`;
    if (kpiBarber) kpiBarber.textContent = this.formatMoney(barbersPayout);
    if (kpiShop) kpiShop.textContent = this.formatMoney(shopProfit);
    if (kpiTotal) kpiTotal.textContent = this.appointments.length;
    if (kpiBreakdown)
      kpiBreakdown.textContent = `${pending.length} Pendientes | ${paid.length} Pagadas`;
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
        a.clientName.toLowerCase().includes(search) ||
        a.clientPhone.toLowerCase().includes(search) ||
        a.barberName.toLowerCase().includes(search) ||
        a.id.toLowerCase().includes(search);
      const matchStatus = statusFilter === "all" || a.status === statusFilter;
      const matchBranch = branchFilter === "all" || a.branchId === branchFilter;
      let matchTime = true;
      if (timeFilter === "today") matchTime = a.date === todayStr;
      else if (timeFilter === "month")
        matchTime = (a.date || "").substring(0, 7) === todayStr.substring(0, 7);
      return matchSearch && matchStatus && matchBranch && matchTime;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="11" class="text-center" style="padding: 2.5rem; color: var(--text-muted);"><i class="fa-solid fa-inbox" style="font-size: 2rem; display: block; margin-bottom: 0.5rem;"></i>No hay registros que coincidan con los filtros.</td></tr>`;
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
            <a href="https://wa.me/${a.clientPhone.replace(/[^0-9]/g, "")}" target="_blank" class="text-gold">
              <i class="fa-brands fa-whatsapp"></i> ${a.clientPhone}
            </a>
          </td>
          <td><small>${a.branchName.split("(")[0]}</small></td>
          <td>${a.barberName.split(" ")[0]}</td>
          <td>${a.serviceName}</td>
          <td><strong>${this.formatMoney(a.price)}</strong></td>
          <td><small>${a.paymentMethod || "Efectivo"}</small></td>
          <td><span class="status-badge ${badgeClass}">${a.status}</span></td>
          <td>
            <div class="table-actions">
              ${a.status !== "Completado / Pagado" ? `<button class="action-btn pay" title="Marcar como Pagado" onclick="app.quickMarkPaid('${a.id}')"><i class="fa-solid fa-check"></i></button>` : ""}
              ${a.status === "Pendiente" ? `<button class="action-btn" title="Cancelar Cita" onclick="app.quickCancelAppointment('${a.id}')"><i class="fa-solid fa-xmark"></i></button>` : ""}
              <button class="action-btn delete" title="Eliminar" onclick="app.deleteAppointment('${a.id}')"><i class="fa-solid fa-trash-can"></i></button>
            </div>
          </td>
        </tr>
      `;
      })
      .join("");
  }

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
      appt.price * (this.config.barberPercent / 100),
    );
    appt.shopProfit = Math.round(appt.price * (this.config.shopPercent / 100));

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

  deleteAppointment(appointmentId) {
    if (confirm(`¿Eliminar definitivamente el registro #${appointmentId}?`)) {
      this.appointments = this.appointments.filter(
        (a) => a.id !== appointmentId,
      );
      this.saveAppointments();
      this.renderAdminDashboard();
    }
  }

  renderBarbersAccounting() {
    const container = document.getElementById("barbers-accounting-container");
    if (!container) return;

    container.innerHTML = this.barbers
      .map((barber) => {
        const paid = this.appointments.filter(
          (a) =>
            (a.barberId === barber.id ||
              a.barberName.includes(barber.name.split(" ")[0])) &&
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
          <div class="mt-3">
            <button class="btn btn-outline btn-block btn-sm" onclick="app.filterTableByBarber('${barber.name.split(" ")[0]}')">
              <i class="fa-solid fa-filter"></i> Ver Cortes de ${barber.name.split(" ")[0]}
            </button>
          </div>
        </div>
      `;
      })
      .join("");
  }

  filterTableByBarber(name) {
    this.switchAdminTab("citas");
    const search = document.getElementById("admin-search-input");
    if (search) {
      search.value = name;
      this.renderAdminAppointmentsTable();
    }
  }

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

  // Venta Manual en Mostrador
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
            a.barberName.includes(barber.name.split(" ")[0])) &&
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
        "Métrica Contable": "Total Citas Registradas",
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

    const wb = XLSX.utils.book_new();
    const wsAppts = XLSX.utils.json_to_sheet(appointmentsData);
    const wsBarbers = XLSX.utils.json_to_sheet(barbersSummary);
    const wsBalance = XLSX.utils.json_to_sheet(balanceData);

    XLSX.utils.book_append_sheet(wb, wsAppts, "Detalle de Citas");
    XLSX.utils.book_append_sheet(wb, wsBarbers, "Liquidación Barberos");
    XLSX.utils.book_append_sheet(wb, wsBalance, "Balance Contable");

    XLSX.writeFile(
      wb,
      `Contabilidad_Lions_Barber_Shop_Ibague_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  }

  generateSampleAppointments() {
    const today = new Date().toISOString().split("T")[0];
    return [
      {
        id: "LIONS-1045",
        date: today,
        time: "10:30 AM",
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
      {
        id: "LIONS-2311",
        date: today,
        time: "11:15 AM",
        clientName: "Santiago Herrera",
        clientPhone: "3201122334",
        branchId: "sede-principal",
        branchName: "Sede Principal (Cl. 11 #12-38)",
        barberId: "barber-principal-1",
        barberName: 'Carlos "Fade Master"',
        serviceId: "serv-corte-clasico",
        serviceName: "Corte Moderno / Clásico Lions",
        price: 25000,
        barberCommission: 12500,
        shopProfit: 12500,
        paymentMethod: "Efectivo",
        status: "Completado / Pagado",
        notes: "Tijera arriba",
      },
      {
        id: "LIONS-3920",
        date: today,
        time: "04:00 PM",
        clientName: "Daniel Benítez",
        clientPhone: "3142233445",
        branchId: "sede-principal",
        branchName: "Sede Principal (Cl. 11 #12-38)",
        barberId: "barber-principal-2",
        barberName: 'Andrés "The Razor"',
        serviceId: "serv-barba-imperial",
        serviceName: "Ritual de Barba & Toalla Caliente",
        price: 18000,
        barberCommission: 9000,
        shopProfit: 9000,
        paymentMethod: "Pendiente en Sede",
        status: "Pendiente",
        notes: "Toalla caliente aromatizada",
      },
    ];
  }

  resetSampleData() {
    if (confirm("¿Deseas restaurar los datos de ejemplo iniciales?")) {
      this.appointments = this.generateSampleAppointments();
      this.saveAppointments();
      this.renderAdminDashboard();
    }
  }

  clearAllData() {
    if (confirm("⚠️ ¿Estás seguro de borrar todas las citas registradas?")) {
      this.appointments = [];
      this.saveAppointments();
      this.renderAdminDashboard();
    }
  }
}

const app = new LionsBarberShopApp();