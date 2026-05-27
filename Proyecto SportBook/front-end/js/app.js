/* ============================= */
/* app.js - SportReserve         */
/* NeuroCode Systems S.A.S       */
/* Conectado a API REST Java     */
/* ============================= */

const API_URL = "http://localhost:8080/api";

/* ===================================== */
/* IMÁGENES DE CANCHAS                   */
/* ===================================== */

function imagenCancha(nombreCancha, tipoSuperficie) {
    const nombre = (nombreCancha || "").toLowerCase();
    if (nombre.includes("fútbol #1") || nombre.includes("futbol #1"))
        return "https://images.unsplash.com/photo-1551958219-acbc630e2914?w=400&h=220&fit=crop";
    if (nombre.includes("fútbol #2") || nombre.includes("futbol #2"))
        return "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&h=220&fit=crop";
    if (nombre.includes("fútbol #3") || nombre.includes("futbol #3"))
        return "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=220&fit=crop";
    if (nombre.includes("fútbol") || nombre.includes("futbol"))
        return "https://images.unsplash.com/photo-1551958219-acbc630e2914?w=400&h=220&fit=crop";
    if (nombre.includes("tenis #2"))
        return "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=220&fit=crop";
    if (nombre.includes("tenis #3"))
        return "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400&h=220&fit=crop";
    if (nombre.includes("tenis #4"))
        return "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&h=220&fit=crop";
    if (nombre.includes("tenis"))
        return "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=220&fit=crop";
    if (nombre.includes("basket #1") || nombre.includes("baloncesto #1"))
        return "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=220&fit=crop";
    if (nombre.includes("basket #2") || nombre.includes("baloncesto #2"))
        return "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=400&h=220&fit=crop";
    if (nombre.includes("basket") || nombre.includes("baloncesto"))
        return "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=220&fit=crop";
    if (nombre.includes("pádel #1") || nombre.includes("padel #1"))
        return "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=220&fit=crop";
    if (nombre.includes("pádel #2") || nombre.includes("padel #2"))
        return "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=400&h=220&fit=crop";
    if (nombre.includes("pádel") || nombre.includes("padel"))
        return "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=220&fit=crop";
    if (nombre.includes("volei"))
        return "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=220&fit=crop";
    if (nombre.includes("multiuso"))
        return "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400&h=220&fit=crop";
    const fallbacks = {
        "Sintética": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&h=220&fit=crop",
        "Cemento":   "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=220&fit=crop",
        "Grass":     "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=220&fit=crop"
    };
    return fallbacks[tipoSuperficie] || "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400&h=220&fit=crop";
}

function obtenerImagenCancha(nombreCancha, tipoSuperficie, imagenUrl) {
    // Si tiene imagen guardada en el servidor, usarla
    if (imagenUrl && imagenUrl.trim() !== "") return imagenUrl;
    // Si no, usar imagen de Unsplash según el tipo
    return imagenCancha(nombreCancha, tipoSuperficie);
}

/* ===================================== */
/* UTILIDADES GENERALES                  */
/* ===================================== */

/** Guarda el token y datos del usuario en sessionStorage */
function guardarSesion(data) {
  sessionStorage.setItem("token", data.token);
  sessionStorage.setItem("nombre", data.nombre);
  sessionStorage.setItem("correo", data.correo);
  sessionStorage.setItem("rol", data.rol);
}

/** Obtiene el token guardado */
function getToken() {
  return sessionStorage.getItem("token");
}

/** Obtiene el rol del usuario */
function getRol() {
  return sessionStorage.getItem("rol");
}

/** Obtiene el nombre del usuario */
function getNombre() {
  return sessionStorage.getItem("nombre");
}

/** Cierra sesión y redirige al login */
function cerrarSesion() {
  sessionStorage.clear();
  window.location.href = "login.html";
}

/** Headers con JWT para peticiones autenticadas */
function headersAuth() {
  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + getToken(),
  };
}

/** Verifica que haya sesión activa, si no redirige al login */
function verificarSesion() {
  if (!getToken()) {
    window.location.href = "login.html";
  }
}

/** Verifica que el usuario sea Administrador */
function verificarAdmin() {
  verificarSesion();
  if (getRol() !== "Administrador") {
    alert("Acceso denegado. Solo administradores.");
    window.location.href = "dashboard-user.html";
  }
}

/** Muestra una alerta visual en la página */
function mostrarAlerta(
  mensaje,
  tipo = "success",
  contenedorId = "alertaContenedor"
) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;
  contenedor.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show shadow-sm" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`;
}

/* ===================================== */
/* LOGIN                                 */
/* ===================================== */

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!correo || !password) {
      mostrarAlerta("Por favor complete todos los campos.", "danger");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        guardarSesion(json.data);

        if (json.data.rol === "Administrador") {
          window.location.href = "dashboard-admin.html";
        } else {
          window.location.href = "dashboard-user.html";
        }
      } else {
        mostrarAlerta(
          json.message || "Correo o contraseña incorrectos.",
          "danger"
        );
      }
    } catch (error) {
      mostrarAlerta(
        "Error de conexión con el servidor. Verifica que el backend esté corriendo.",
        "danger"
      );
    }
  });
}

/* ===================================== */
/* REGISTRO                              */
/* ===================================== */

const registroForm = document.getElementById("registroForm");

if (registroForm) {
  registroForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const terminos = document.getElementById("terminos").checked;

    if (!nombre || !correo || !password || !confirmPassword) {
      mostrarAlerta(
        "Todos los campos obligatorios deben completarse.",
        "danger"
      );
      return;
    }

    if (password !== confirmPassword) {
      mostrarAlerta("Las contraseñas no coinciden.", "danger");
      return;
    }

    if (!terminos) {
      mostrarAlerta("Debe aceptar los términos y condiciones.", "danger");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, password, telefono }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        mostrarAlerta("¡Registro exitoso! Redirigiendo al login...", "success");
        setTimeout(() => (window.location.href = "login.html"), 2000);
      } else {
        mostrarAlerta(json.message || "Error al registrar usuario.", "danger");
      }
    } catch (error) {
      mostrarAlerta("Error de conexión con el servidor.", "danger");
    }
  });
}

/* ===================================== */
/* DASHBOARD USUARIO                     */
/* ===================================== */

if (document.getElementById("nombreUsuario")) {
  verificarSesion();
  document.getElementById("nombreUsuario").textContent =
    getNombre() || "Usuario";

  // Cargar resumen del usuario
  cargarResumenUsuario();
}

async function cargarResumenUsuario() {
  try {
    const res = await fetch(`${API_URL}/reservas/mis-reservas`, {
      headers: headersAuth(),
    });
    const json = await res.json();

    if (res.ok && json.success) {
      const reservas = json.data;
      const activas = reservas.filter(
        (r) => r.estadoPago !== "Cancelado"
      ).length;
      const pendientes = reservas.filter(
        (r) => r.estadoPago === "Pendiente"
      ).length;
      const total = reservas
        .filter((r) => r.estadoPago === "Pagado")
        .reduce((sum, r) => sum + (r.montoTotal || 0), 0);

      const elActivas = document.getElementById("reservasActivas");
      const elPendientes = document.getElementById("pagosPendientes");
      const elTotal = document.getElementById("totalInvertido");

      if (elActivas) elActivas.textContent = activas;
      if (elPendientes) elPendientes.textContent = pendientes;
      if (elTotal) elTotal.textContent = "$" + total.toLocaleString("es-CO");

      // Cargar últimas 3 reservas en la tabla
      cargarTablaReservasHome(reservas.slice(-3).reverse());
    } else {
      throw new Error(json.message || "Error cargando resumen");
    }
  } catch (error) {
    console.error("Error cargando resumen:", error);
    const tbody = document.getElementById("tablaUltimasReservas");
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger"><strong>Error cargando reservas:</strong> ${error.message}</td></tr>`;
    }
  }
}

function cargarTablaReservasHome(reservas) {
  const tbody = document.getElementById("tablaUltimasReservas");
  if (!tbody) return;

  if (reservas.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center">No tienes reservas aún.</td></tr>`;
    return;
  }

  tbody.innerHTML = reservas
    .map(
      (r) => `
        <tr>
            <td>${r.nombreCancha}</td>
            <td>${r.fecha}</td>
            <td>${r.horaInicio} - ${r.horaFin}</td>
            <td>${badgePago(r.estadoPago)}</td>
            <td>$${(r.montoTotal || 0).toLocaleString("es-CO")}</td>
        </tr>`
    )
    .join("");
}

/* ===================================== */
/* DASHBOARD ADMIN                       */
/* ===================================== */

if (document.getElementById("totalUsuarios")) {
  verificarAdmin();
  cargarResumenAdmin();
}

async function cargarResumenAdmin() {
  try {
    const res = await fetch(`${API_URL}/reportes/resumen`, {
      headers: headersAuth(),
    });
    const json = await res.json();

    if (res.ok && json.success) {
      const d = json.data;
      setText("totalUsuarios", d.totalUsuarios);
      setText("reservasActivas", d.reservasActivas);
      setText("canchasDisponibles", d.totalCanchas);
      setText(
        "ingresosMensuales",
        "$" + (d.ingresosTotales || 0).toLocaleString("es-CO")
      );
    } else {
      throw new Error(json.message || "Error cargando resumen");
    }
  } catch (error) {
    console.error("Error cargando resumen admin:", error);
    setText("totalUsuarios", "Error");
    setText("reservasActivas", "Error");
    setText("canchasDisponibles", "Error");
    setText("ingresosMensuales", "Error");
  }

  // Cargar reservas recientes
  try {
    const res = await fetch(`${API_URL}/reservas`, { headers: headersAuth() });
    const json = await res.json();

    if (res.ok && json.success) {
      const tbody = document.getElementById("tablaReservasRecientes");
      if (!tbody) return;

      const reservas = json.data.slice(0, 5);
      tbody.innerHTML = reservas
        .map(
          (r) => `
                <tr>
                    <td>${r.nombreUsuario}</td>
                    <td>${r.nombreCancha}</td>
                    <td>${r.fecha}</td>
                    <td>${r.horaInicio} - ${r.horaFin}</td>
                    <td>${badgePago(r.estadoPago)}</td>
                    <td>$${(r.montoTotal || 0).toLocaleString("es-CO")}</td>
                </tr>`
        )
        .join("");
    } else {
      throw new Error(json.message || "Error cargando reservas");
    }
  } catch (error) {
    console.error("Error cargando reservas admin:", error);
    const tbody = document.getElementById("tablaReservasRecientes");
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger"><strong>Error cargando reservas:</strong> ${error.message}</td></tr>`;
    }
  }
}

/* ===================================== */
/* CANCHAS — Vista pública               */
/* ===================================== */

if (document.getElementById("listaCanchas")) {
  verificarSesion();
  cargarCanchas();
}

async function cargarCanchas(estado = null, superficie = null) {
  const contenedor = document.getElementById("listaCanchas");
  if (!contenedor) return;

  // Detectar si es admin usando sessionStorage (donde guardamos el token al login)
  const rol = sessionStorage.getItem("rol");
  const mostrarGestion = rol === "Administrador";

  let url = `${API_URL}/canchas`;
  const params = [];
  if (estado) params.push(`estado=${estado}`);
  if (superficie) params.push(`superficie=${superficie}`);
  if (params.length) url += "?" + params.join("&");

  try {
    const res = await fetch(url, { headers: headersAuth() });
    const json = await res.json();

    if (res.ok && json.success) {
      const canchas = json.data;

      contenedor.innerHTML = canchas
        .map((c) => {
          const nombreLower = c.nombreCancha.toLowerCase();
          let icono = "⚽";
          if (nombreLower.includes("tenis")) icono = "🎾";
          if (nombreLower.includes("basket")) icono = "🏀";
          if (nombreLower.includes("pádel") || nombreLower.includes("padel")) icono = "🏓";
          if (nombreLower.includes("volei")) icono = "🏐";

          // Imagen: primero busca foto subida localmente, si no usa Unsplash
          const imgSrc = obtenerImagenCancha(c.nombreCancha, c.tipoSuperficie, c.imagenUrl);

          // BOTONES DINÁMICOS
          let botonesAccion = "";

          if (mostrarGestion) {
            botonesAccion = `
                        <div class="d-flex gap-2">
                            <button onclick="prepararEdicion(${c.idCancha})" class="btn btn-warning flex-grow-1 text-white">
                                ✏️ Editar
                            </button>
                            <button onclick="eliminarCancha(${c.idCancha}, '${c.nombreCancha}')" class="btn btn-danger">
                                🗑️
                            </button>
                        </div>
                    `;
          } else {
            botonesAccion =
              c.estado === "Disponible"
                ? `<a href="reservar.html?cancha=${c.idCancha}" class="btn btn-success w-100">Reservar</a>`
                : `<button class="btn btn-secondary w-100" disabled>No Disponible</button>`;
          }

          return `
                <div class="col-md-4 mb-4">
                    <div class="card shadow h-100 border-0 bg-dark text-white">
                        <img src="${imgSrc}"
                             class="card-img-top"
                             style="height: 180px; object-fit: cover;"
                             alt="${c.nombreCancha}"
                             onerror="this.src='https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400&h=220&fit=crop'">
                        <div class="card-body d-flex flex-column">
                            <h4 class="card-title d-flex justify-content-between">
                                ${c.nombreCancha} <span>${icono}</span>
                            </h4>
                            <p class="mb-1"><strong>Superficie:</strong> ${c.tipoSuperficie}</p>
                            <p class="mb-1"><strong>Precio:</strong> $${(c.precioHora || 0).toLocaleString("es-CO")}/hora</p>
                            <p class="mb-2"><strong>Estado:</strong> ${badgeEstado(c.estado)}</p>
                            <div class="mt-auto">
                                ${botonesAccion}
                            </div>
                        </div>
                    </div>
                </div>`;
        })
        .join("");
    }
  } catch (error) {
    console.error("Error cargando canchas:", error);
  }
}

// FUNCIÓN PARA ELIMINAR (Asegúrate de tenerla en app.js)
async function eliminarCancha(id, nombre) {
    if (!confirm(`¿Está seguro que desea eliminar "${nombre}"?\nEsta acción eliminará también sus reservas asociadas y no se puede deshacer.`)) return;

    try {
        const res  = await fetch(`${API_URL}/canchas/${id}`, {
            method:  "DELETE",
            headers: headersAuth()
        });
        const json = await res.json();

        if (res.ok && json.success) {
            mostrarAlerta(`Cancha eliminada exitosamente.`, "success");
            cargarGestionCanchas();
        } else {
            mostrarAlerta(json.message || "Error al eliminar la cancha.", "danger");
        }
    } catch (error) {
        mostrarAlerta("Error de conexión con el servidor.", "danger");
    }
}

// Botón filtrar canchas
const btnFiltrarCanchas = document.getElementById("btnFiltrarCanchas");
if (btnFiltrarCanchas) {
  btnFiltrarCanchas.addEventListener("click", () => {
    const estado = document.getElementById("filtroEstado")?.value;
    const superficie = document.getElementById("filtroSuperficie")?.value;
    cargarCanchas(
      estado === "Todos" ? null : estado,
      superficie === "Todas" ? null : superficie
    );
  });
}

/* ===================================== */
/* RESERVAR                              */
/* ===================================== */

if (document.getElementById("reservaForm")) {
  verificarSesion();
  cargarOpcionesCanchas();

  // Pre-seleccionar cancha si viene por parámetro URL
  const params = new URLSearchParams(window.location.search);
  const idCancha = params.get("cancha");
  if (idCancha) {
    document.addEventListener("canchasListas", () => {
      const select = document.getElementById("cancha");
      if (select) select.value = idCancha;
    });
  }
}

async function cargarOpcionesCanchas() {
  const select = document.getElementById("cancha");
  if (!select) return;

  try {
    const res = await fetch(`${API_URL}/canchas?estado=Disponible`, {
      headers: headersAuth(),
    });
    const json = await res.json();

    if (res.ok && json.success) {
      select.innerHTML =
        `<option selected disabled>Seleccione una opción</option>` +
        json.data
          .map(
            (c) =>
              `<option value="${c.idCancha}" data-precio="${c.precioHora}">
                        ${c.nombreCancha} - $${(
                c.precioHora || 0
              ).toLocaleString("es-CO")}/hora
                    </option>`
          )
          .join("");

      document.dispatchEvent(new Event("canchasListas"));
    } else {
      throw new Error(json.message || "Error cargando canchas");
    }
  } catch (error) {
    console.error("Error cargando canchas para reservar:", error);
    select.innerHTML = `<option selected disabled style="color: red;">Error cargando canchas: ${error.message}</option>`;
  }
}

// Calcular monto
function calcularReserva() {
  const select = document.getElementById("cancha");
  const horaInicio = document.getElementById("horaInicio").value;
  const horaFin = document.getElementById("horaFin").value;

  if (!select?.value || !horaInicio || !horaFin) {
    alert("Debe seleccionar cancha y horarios.");
    return;
  }

  const precio = parseFloat(select.selectedOptions[0]?.dataset.precio || 0);
  const inicio = horaInicio.split(":");
  const fin = horaFin.split(":");
  const horas =
    parseInt(fin[0]) +
    parseInt(fin[1]) / 60 -
    (parseInt(inicio[0]) + parseInt(inicio[1]) / 60);

  if (horas <= 0) {
    alert("Horario inválido.");
    return;
  }

  const total = horas * precio;
  document.getElementById("horasReservadas").textContent = horas;
  document.getElementById("montoTotal").textContent =
    total.toLocaleString("es-CO");
}

// Enviar reserva
const reservaForm = document.getElementById("reservaForm");
if (reservaForm) {
  reservaForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const idCancha = document.getElementById("cancha").value;
    const fecha = document.getElementById("fecha").value;
    const horaInicio = document.getElementById("horaInicio").value;
    const horaFin = document.getElementById("horaFin").value;
    const estadoPago = document.getElementById("estadoPago").value;

    if (!idCancha || !fecha || !horaInicio || !horaFin) {
      mostrarAlerta("Debe completar todos los campos.", "danger");
      return;
    }

    if (horaInicio >= horaFin) {
      mostrarAlerta(
        "La hora de inicio debe ser menor que la hora de fin.",
        "danger"
      );
      return;
    }

    try {
      const res = await fetch(`${API_URL}/reservas`, {
        method: "POST",
        headers: headersAuth(),
        body: JSON.stringify({
          idCancha: parseInt(idCancha),
          fecha,
          horaInicio,
          horaFin,
          estadoPago,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        mostrarAlerta(
          "¡Reserva confirmada exitosamente! Redirigiendo...",
          "success"
        );
        setTimeout(() => (window.location.href = "mis-reservas.html"), 2000);
      } else {
        mostrarAlerta(json.message || "Error al crear la reserva.", "danger");
      }
    } catch (error) {
      mostrarAlerta("Error de conexión con el servidor.", "danger");
    }
  });
}

/* ===================================== */
/* MIS RESERVAS                          */
/* ===================================== */

if (document.getElementById("tablaMisReservas")) {
  verificarSesion();
  cargarMisReservas();
}

async function cargarMisReservas(estadoFiltro = null) {
  const tbody = document.getElementById("tablaMisReservas");
  if (!tbody) return;

  try {
    const res = await fetch(`${API_URL}/reservas/mis-reservas`, {
      headers: headersAuth(),
    });
    const json = await res.json();

    if (res.ok && json.success) {
      let reservas = json.data;

      if (estadoFiltro && estadoFiltro !== "Todos") {
        reservas = reservas.filter((r) => r.estadoPago === estadoFiltro);
      }

      // Actualizar resumen
      setText("totalReservas", reservas.length);
      setText(
        "pagosPendientes",
        reservas.filter((r) => r.estadoPago === "Pendiente").length
      );
      setText(
        "totalGastado",
        "$" +
          reservas
            .filter((r) => r.estadoPago === "Pagado")
            .reduce((s, r) => s + (r.montoTotal || 0), 0)
            .toLocaleString("es-CO")
      );

      if (reservas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center">No tienes reservas.</td></tr>`;
        return;
      }

      tbody.innerHTML = reservas
        .map(
          (r) => `
                <tr>
                    <td>#${r.idReserva}</td>
                    <td>${r.nombreCancha}</td>
                    <td>${r.fecha}</td>
                    <td>${r.horaInicio} - ${r.horaFin}</td>
                    <td>$${(r.montoTotal || 0).toLocaleString("es-CO")}</td>
                    <td>${badgePago(r.estadoPago)}</td>
                    <td>
                        ${r.estadoPago === "Pendiente" ? `
                            <div class="d-flex gap-1">
                                <button class="btn btn-xs btn-success btn-sm py-0 px-2"
                                    onclick="cambiarEstadoReserva(${r.idReserva}, 'Pagado')">
                                    Pagar
                                </button>
                                <button class="btn btn-xs btn-danger btn-sm py-0 px-2"
                                    onclick="cancelarReserva(${r.idReserva})">
                                    Cancelar
                                </button>
                            </div>`
                        : r.estadoPago === "Pagado" ? `
                            <div class="d-flex gap-1">
                                <button class="btn btn-xs btn-secondary btn-sm py-0 px-2"
                                    onclick="cambiarEstadoReserva(${r.idReserva}, 'Finalizado')">
                                    Finalizar
                                </button>
                                <button class="btn btn-xs btn-danger btn-sm py-0 px-2"
                                    onclick="cancelarReserva(${r.idReserva})">
                                    Cancelar
                                </button>
                            </div>`
                        : `<button class="btn btn-sm btn-secondary py-0 px-2" disabled>
                                ${r.estadoPago === "Cancelado" ? "Cancelada" : "Finalizada"}
                            </button>`
                        }
                    </td>
                </tr>`
        )
        .join("");
    } else {
      throw new Error(json.message || "Error cargando reservas");
    }
  } catch (error) {
    console.error("Error cargando reservas:", error);
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger"><strong>Error cargando reservas:</strong> ${error.message}</td></tr>`;
  }
}

async function cancelarReserva(id) {
  if (!confirm("¿Desea cancelar esta reserva?")) return;

  try {
    const res = await fetch(`${API_URL}/reservas/${id}`, {
      method: "DELETE",
      headers: headersAuth(),
    });
    const json = await res.json();

    if (res.ok && json.success) {
      mostrarAlerta("Reserva cancelada exitosamente.", "success");
      cargarMisReservas();
    } else {
      mostrarAlerta(json.message || "Error al cancelar.", "danger");
    }
  } catch (error) {
    mostrarAlerta("Error de conexión.", "danger");
  }
}

async function cambiarEstadoReserva(id, nuevoEstado) {
    const mensajes = {
        "Pagado":     "¿Confirmar pago de esta reserva?",
        "Finalizado": "¿Marcar esta reserva como finalizada?"
    };

    if (!confirm(mensajes[nuevoEstado] || `¿Cambiar estado a ${nuevoEstado}?`)) return;

    try {
        const res = await fetch(`${API_URL}/reservas/${id}/estado`, {
            method:  "PATCH",
            headers: headersAuth(),
            body:    JSON.stringify({ estadoPago: nuevoEstado })
        });
        const json = await res.json();

        if (res.ok && json.success) {
            mostrarAlerta(`Estado actualizado a: ${nuevoEstado}`, "success");
            cargarMisReservas();
        } else {
            mostrarAlerta(json.message || "Error al actualizar estado.", "danger");
        }
    } catch (error) {
        mostrarAlerta("Error de conexión con el servidor.", "danger");
    }
}

// Filtro mis reservas
const btnFiltrarReservas = document.getElementById("btnFiltrarReservas");
if (btnFiltrarReservas) {
  btnFiltrarReservas.addEventListener("click", () => {
    const estado = document.getElementById("filtroEstadoPago")?.value;
    cargarMisReservas(estado);
  });
}

/* ===================================== */
/* GESTIÓN CANCHAS — Admin               */
/* ===================================== */

if (document.getElementById("tablaGestionCanchas")) {
  verificarAdmin();

  cargarGestionCanchas();
}

async function cargarGestionCanchas() {
  const tbody = document.getElementById("tablaGestionCanchas");

  if (!tbody) return;

  try {
    const res = await fetch(`${API_URL}/canchas`, {
      headers: headersAuth(),
    });

    const json = await res.json();

    if (res.ok && json.success) {
      const canchas = json.data;

      console.log("Canchas:", canchas);

      // =========================
      // MÉTRICAS
      // =========================

      setText("totalCanchas", canchas.length);

      setText(
        "canchasDisp",
        canchas.filter((c) => c.estado?.trim().toLowerCase() === "disponible")
          .length
      );

      setText(
        "canchasMant",
        canchas.filter(
          (c) => c.estado?.trim().toLowerCase() === "mantenimiento"
        ).length
      );

      // =========================
      // TABLA
      // =========================

      if (canchas.length === 0) {
        tbody.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center">
                            No hay canchas registradas.
                        </td>
                    </tr>
                `;

        return;
      }

      tbody.innerHTML = canchas
        .map((c) => {
          const estadoNormalizado = c.estado?.trim().toLowerCase();

          return `

                    <tr>

                        <td>${c.idCancha}</td>

                        <td>
                            <strong>${c.nombreCancha}</strong>
                        </td>

                        <td>${c.tipoSuperficie}</td>

                        <td>
                            $${(c.precioHora || 0).toLocaleString("es-CO")}
                        </td>

                        <td>
                            ${badgeEstado(c.estado)}
                        </td>

                        <td>
                            <span class="badge bg-info">
                                Activa
                            </span>
                        </td>

                        <td>

                            ${
                              estadoNormalizado === "disponible"
                                ? `

                                    <button
                                        class="btn btn-sm btn-warning"

                                        onclick="cambiarEstadoCancha(
                                            ${c.idCancha},
                                            'Mantenimiento'
                                        )">

                                        Mantenimiento

                                    </button>

                                `
                                : `

                                    <button
                                        class="btn btn-sm btn-success"

                                        onclick="cambiarEstadoCancha(
                                            ${c.idCancha},
                                            'Disponible'
                                        )">

                                        Reactivar

                                    </button>

                                `
                            }

                            <button
                                class="btn btn-sm btn-danger mt-1"
                                onclick="eliminarCancha(${c.idCancha}, '${c.nombreCancha}')">
                                🗑️ Eliminar
                            </button>

                        </td>

                    </tr>

                `;
        })
        .join("");
    } else {
      throw new Error(json.message || "Error cargando canchas");
    }
  } catch (error) {
    console.error("Error cargando gestión canchas:", error);

    tbody.innerHTML = `

            <tr>

                <td colspan="7"
                    class="text-center text-danger">

                    <strong>
                        Error cargando canchas:
                    </strong>

                    ${error.message}

                </td>

            </tr>

        `;
  }
}

async function cambiarEstadoCancha(id, nuevoEstado) {
  const confirmar = confirm(
    `¿Desea cambiar el estado de la cancha a "${nuevoEstado}"?`
  );

  if (!confirmar) return;

  try {
    const res = await fetch(`${API_URL}/canchas/${id}/estado`, {
      method: "PATCH",

      headers: headersAuth(),

      body: JSON.stringify({
        estado: nuevoEstado,
      }),
    });

    const json = await res.json();

    console.log("Respuesta PATCH:", json);

    if (res.ok && json.success) {
      mostrarAlerta(`Cancha actualizada a: ${nuevoEstado}`, "success");

      // Esperar un poco antes de recargar
      setTimeout(() => {
        cargarGestionCanchas();
      }, 300);
    } else {
      mostrarAlerta(json.message || "Error cambiando estado.", "danger");
    }
  } catch (error) {
    console.error("Error cambiando estado:", error);

    mostrarAlerta("Error de conexión con el servidor.", "danger");
  }
}

/* ===================================== */
/* GESTIÓN USUARIOS — Admin              */
/* ===================================== */

if (document.getElementById("tablaGestionUsuarios")) {
  verificarAdmin();
  cargarGestionUsuarios();
}

async function cargarGestionUsuarios() {
  const tbody = document.getElementById("tablaGestionUsuarios");
  if (!tbody) return;

  try {
    const res = await fetch(`${API_URL}/usuarios`, { headers: headersAuth() });
    const json = await res.json();

    if (res.ok && json.success) {
      const usuarios = json.data;
      tbody.innerHTML = usuarios
        .map(
          (u) => `
                <tr>
                    <td>${u.idUsuario}</td>
                    <td>${u.nombre}</td>
                    <td>${u.correo}</td>
                    <td>${u.telefono || "-"}</td>
                    <td><span class="badge bg-${
                      u.rol === "Administrador" ? "dark" : "success"
                    }">${u.rol}</span></td>
                    <td><span class="badge bg-success">Activo</span></td>
                    <td>
                        <button class="btn btn-sm btn-primary"
                            onclick="verReservasDeUsuario(${u.idUsuario}, '${u.nombre}')">
                            Ver Reservas
                        </button>
                    </td>
                </tr>`
        )
        .join("");
    } else {
      throw new Error(json.message || "Error cargando usuarios");
    }
  } catch (error) {
    console.error("Error cargando usuarios:", error);
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger"><strong>Error cargando usuarios:</strong> ${error.message}</td></tr>`;
  }
}

async function verReservasDeUsuario(idUsuario, nombreUsuario) {
    // Crear modal dinámico si no existe
    let modal = document.getElementById("modalReservasUsuario");
    if (!modal) {
        modal = document.createElement("div");
        modal.innerHTML = `
            <div class="modal fade" id="modalReservasUsuario" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content" style="background:#1b263b; color:#f8f9fa; border:1px solid #39ff14;">
                        <div class="modal-header" style="border-bottom:1px solid #39ff14;">
                            <h5 class="modal-title" style="color:#39ff14; font-weight:bold;">
                                Reservas de <span id="modalNombreUsuario"></span>
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div id="modalContenidoReservas">
                                <p class="text-center">Cargando...</p>
                            </div>
                        </div>
                        <div class="modal-footer" style="border-top:1px solid #39ff14;">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(modal);
    }

    // Actualizar nombre en el modal
    document.getElementById("modalNombreUsuario").textContent = nombreUsuario;
    document.getElementById("modalContenidoReservas").innerHTML = "<p class='text-center'>Cargando...</p>";

    // Abrir modal
    const bsModal = new bootstrap.Modal(document.getElementById("modalReservasUsuario"));
    bsModal.show();

    // Cargar reservas del usuario
    try {
        const res  = await fetch(`${API_URL}/reservas`, { headers: headersAuth() });
        const json = await res.json();

        if (res.ok && json.success) {
            const reservas = json.data.filter(r => r.idUsuario === idUsuario ||
                r.nombreUsuario === nombreUsuario);

            if (reservas.length === 0) {
                document.getElementById("modalContenidoReservas").innerHTML =
                    `<p class="text-center text-muted">Este usuario no tiene reservas registradas.</p>`;
                return;
            }

            document.getElementById("modalContenidoReservas").innerHTML = `
                <div class="table-responsive">
                    <table class="table table-striped table-hover align-middle mb-0">
                        <thead class="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Cancha</th>
                                <th>Fecha</th>
                                <th>Horario</th>
                                <th>Monto</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reservas.map(r => `
                                <tr>
                                    <td>#${r.idReserva}</td>
                                    <td>${r.nombreCancha}</td>
                                    <td>${r.fecha}</td>
                                    <td>${r.horaInicio} - ${r.horaFin}</td>
                                    <td>$${(r.montoTotal || 0).toLocaleString("es-CO")}</td>
                                    <td>${badgePago(r.estadoPago)}</td>
                                </tr>`).join("")}
                        </tbody>
                    </table>
                </div>`;
        }
    } catch (error) {
        document.getElementById("modalContenidoReservas").innerHTML =
            `<p class="text-center text-danger">Error cargando reservas.</p>`;
    }
}

/* ===================================== */
/* REPORTES — Admin                      */
/* ===================================== */

if (document.getElementById("tablaFacturacion")) {
  verificarAdmin();
  cargarReportes();
}

async function cargarReportes(estadoPago = null) {
  try {
    // Resumen
    const resRes = await fetch(`${API_URL}/reportes/resumen`, {
      headers: headersAuth(),
    });
    const resJson = await resRes.json();
    if (resRes.ok && resJson.success) {
      const d = resJson.data;
      setText(
        "ingresosTotales",
        "$" + (d.ingresosTotales || 0).toLocaleString("es-CO")
      );
      setText("reservasTotales", d.reservasActivas);
      setText(
        "pagosPendientes",
        "$" + (d.pagosPendientes || 0).toLocaleString("es-CO")
      );
      setText("canchaTopReservada", d.canchaTopReservada);
    } else {
      throw new Error(resJson.message || "Error cargando resumen");
    }

    // Facturación
    let url = `${API_URL}/reportes/facturacion`;
    if (estadoPago && estadoPago !== "Todos")
      url += `?estadoPago=${estadoPago}`;

    const facRes = await fetch(url, { headers: headersAuth() });
    const facJson = await facRes.json();
    if (facRes.ok && facJson.success) {
      const tbody = document.getElementById("tablaFacturacion");
      if (tbody) {
        tbody.innerHTML = facJson.data
          .map(
            (r) => `
                    <tr>
                        <td>#${r.idReserva}</td>
                        <td>${r.usuario}</td>
                        <td>${r.cancha}</td>
                        <td>${r.fecha}</td>
                        <td>$${(r.montoTotal || 0).toLocaleString("es-CO")}</td>
                        <td>${badgePago(r.estadoPago)}</td>
                    </tr>`
          )
          .join("");
      }
    } else {
      throw new Error(facJson.message || "Error cargando facturación");
    }

    // Rendimiento por cancha
    const rendRes = await fetch(`${API_URL}/reportes/canchas`, {
      headers: headersAuth(),
    });
    const rendJson = await rendRes.json();
    if (rendRes.ok && rendJson.success) {
      const tbody = document.getElementById("tablaRendimiento");
      if (tbody) {
        tbody.innerHTML = rendJson.data
          .map(
            (c) => `
                    <tr>
                        <td>${c.nombreCancha}</td>
                        <td>${c.totalReservas}</td>
                        <td>$${(c.ingresosGenerados || 0).toLocaleString(
                          "es-CO"
                        )}</td>
                        <td>${badgeEstado(c.estado)}</td>
                    </tr>`
          )
          .join("");
      }
    } else {
      throw new Error(rendJson.message || "Error cargando rendimiento");
    }
  } catch (error) {
    console.error("Error cargando reportes:", error);
    const tbody1 = document.getElementById("tablaFacturacion");
    if (tbody1)
      tbody1.innerHTML = `<tr><td colspan="6" class="text-center text-danger"><strong>Error:</strong> ${error.message}</td></tr>`;

    const tbody2 = document.getElementById("tablaRendimiento");
    if (tbody2)
      tbody2.innerHTML = `<tr><td colspan="4" class="text-center text-danger"><strong>Error:</strong> ${error.message}</td></tr>`;
  }
}

// Filtro reportes
const btnGenerarReporte = document.getElementById("btnGenerarReporte");
if (btnGenerarReporte) {
  btnGenerarReporte.addEventListener("click", () => {
    const estado = document.getElementById("filtroEstadoPagoReporte")?.value;
    cargarReportes(estado);
  });
}

// Exportar PDF funcional con jsPDF
document.addEventListener("DOMContentLoaded", () => {
    const btnPDF = document.getElementById("btnExportarPDF");
    if (btnPDF) {
        btnPDF.addEventListener("click", exportarPDF);
    }
});

async function exportarPDF() {
    if (!window.jspdf) {
        alert("La librería PDF aún no cargó. Intenta de nuevo en unos segundos.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Encabezado
    doc.setFontSize(18);
    doc.setTextColor(0, 150, 80);
    doc.text("SportReserve — Reporte de Facturación", 14, 20);

    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text("NeuroCode Systems S.A.S · " + new Date().toLocaleDateString("es-CO"), 14, 28);

    // Métricas generales
    const ingresos   = document.getElementById("ingresosTotales")?.textContent  || "-";
    const reservas   = document.getElementById("reservasTotales")?.textContent  || "-";
    const pendientes = document.getElementById("pagosPendientes")?.textContent  || "-";
    const topCancha  = document.getElementById("canchaTopReservada")?.textContent || "-";

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Ingresos Totales: ${ingresos}`,       14, 40);
    doc.text(`Reservas Totales: ${reservas}`,       14, 48);
    doc.text(`Pagos Pendientes: ${pendientes}`,     14, 56);
    doc.text(`Cancha más reservada: ${topCancha}`,  14, 64);

    // Tabla de facturación
    const filasFacturacion = [];
    document.querySelectorAll("#tablaFacturacion tr").forEach(tr => {
        const celdas = [...tr.querySelectorAll("td")].map(td => td.textContent.trim());
        if (celdas.length) filasFacturacion.push(celdas);
    });

    if (filasFacturacion.length) {
        doc.setFontSize(13);
        doc.setTextColor(0, 150, 80);
        doc.text("Detalle de Facturación", 14, 74);

        doc.autoTable({
            head: [["ID", "Usuario", "Cancha", "Fecha", "Monto", "Estado"]],
            body: filasFacturacion,
            startY: 80,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [0, 150, 80] }
        });
    }

    // Tabla rendimiento por cancha
    const filasRendimiento = [];
    document.querySelectorAll("#tablaRendimiento tr").forEach(tr => {
        const celdas = [...tr.querySelectorAll("td")].map(td => td.textContent.trim());
        if (celdas.length) filasRendimiento.push(celdas);
    });

    if (filasRendimiento.length) {
        const finalY = doc.lastAutoTable?.finalY || 140;
        doc.setFontSize(13);
        doc.setTextColor(0, 150, 80);
        doc.text("Rendimiento por Cancha", 14, finalY + 12);

        doc.autoTable({
            head: [["Cancha", "Reservas", "Ingresos Generados", "Estado"]],
            body: filasRendimiento,
            startY: finalY + 18,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [0, 150, 80] }
        });
    }

    // Guardar PDF
    doc.save("SportReserve_Reporte_" + new Date().toISOString().slice(0, 10) + ".pdf");
}

/* ===================================== */
/* CERRAR SESIÓN                         */
/* ===================================== */

document.addEventListener("click", function (e) {
  if (e.target.textContent.trim() === "Cerrar Sesión") {
    e.preventDefault();
    cerrarSesion();
  }
});

/* ===================================== */
/* HELPERS DE UI                         */
/* ===================================== */

function setText(id, valor) {
  const el = document.getElementById(id);
  if (el) el.textContent = valor;
}

function badgePago(estado) {
  const mapa = {
    Pendiente:  `<span class="badge bg-warning text-dark">Pendiente</span>`,
    Pagado:     `<span class="badge bg-success">Pagado</span>`,
    Cancelado:  `<span class="badge bg-danger">Cancelado</span>`,
    Finalizado: `<span class="badge bg-info text-dark">Finalizado</span>`,
  };
  return mapa[estado] || `<span class="badge bg-secondary">${estado}</span>`;
}

function badgeEstado(estado) {
  return estado === "Disponible"
    ? `<span class="badge bg-success">Disponible</span>`
    : `<span class="badge bg-danger">Mantenimiento</span>`;
}

/* ===================================== */
/* REGISTRAR NUEVA CANCHA                */
/* ===================================== */

const formNuevaCancha = document.getElementById("formNuevaCancha");

// Previsualizar imagen al seleccionarla
const inputImagen = document.getElementById("imagenCancha");
if (inputImagen) {
    inputImagen.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById("previewImagen");
                const container = document.getElementById("previewContainer");
                if (preview && container) {
                    preview.src = e.target.result;
                    container.style.display = "block";
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

if (formNuevaCancha) {
    formNuevaCancha.addEventListener("submit", async function (e) {
        e.preventDefault();

        const nombreCancha   = document.getElementById("nombreCancha").value.trim();
        const tipoSuperficie = document.getElementById("tipoSuperficie").value;
        const precioHora     = parseFloat(document.getElementById("precioHora").value);
        const estado         = document.getElementById("estadoCancha")?.value || "Disponible";
        const imagenFile     = document.getElementById("imagenCancha")?.files[0];

        // Validaciones
        if (!nombreCancha) {
            mostrarAlerta("El nombre de la cancha es obligatorio.", "danger", "alertaModalCancha");
            return;
        }
        if (!tipoSuperficie) {
            mostrarAlerta("Seleccione un tipo de superficie.", "danger", "alertaModalCancha");
            return;
        }
        if (!precioHora || precioHora <= 0) {
            mostrarAlerta("El precio debe ser mayor a cero.", "danger", "alertaModalCancha");
            return;
        }

        // Si hay imagen, guardarla en localStorage asociada al nombre
        if (imagenFile) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                localStorage.setItem("img_" + nombreCancha.toLowerCase(), e.target.result);
                await enviarNuevaCancha(nombreCancha, tipoSuperficie, precioHora, estado);
            };
            reader.readAsDataURL(imagenFile);
        } else {
            await enviarNuevaCancha(nombreCancha, tipoSuperficie, precioHora, estado);
        }
    });
}

async function enviarNuevaCancha(nombreCancha, tipoSuperficie, precioHora, estado) {
    try {
        // 1. Crear la cancha primero
        const res = await fetch(`${API_URL}/canchas`, {
            method:  "POST",
            headers: headersAuth(),
            body:    JSON.stringify({ nombreCancha, tipoSuperficie, precioHora, estado })
        });

        const json = await res.json();

        if (!res.ok || !json.success) {
            mostrarAlerta(json.message || "Error registrando cancha.", "danger", "alertaModalCancha");
            return;
        }

        const idCancha = json.data.idCancha;

        // 2. Si hay imagen, subirla al servidor
        const imagenFile = document.getElementById("imagenCancha")?.files[0];
        if (imagenFile) {
            const formData = new FormData();
            formData.append("imagen", imagenFile);

            await fetch(`${API_URL}/canchas/${idCancha}/imagen`, {
                method:  "POST",
                headers: { "Authorization": "Bearer " + getToken() },
                body:    formData
            });
        }

        // 3. Cerrar modal y recargar
        const modalElement = document.getElementById("modalNuevaCancha");
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();

        document.getElementById("formNuevaCancha").reset();
        const previewContainer = document.getElementById("previewContainer");
        if (previewContainer) previewContainer.style.display = "none";

        mostrarAlerta("✅ Cancha registrada exitosamente.", "success");
        cargarGestionCanchas();

    } catch (error) {
        console.error("Error creando cancha:", error);
        mostrarAlerta("Error de conexión con el servidor.", "danger", "alertaModalCancha");
    }
}

cargarGestionCanchas;