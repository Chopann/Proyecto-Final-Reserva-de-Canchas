/* ============================= */
/* app.js - SportReserve         */
/* NeuroCode Systems S.A.S       */
/* Conectado a API REST Java     */
/* ============================= */

const API_URL = "http://localhost:8080/api";

/* ===================================== */
/* UTILIDADES GENERALES                  */
/* ===================================== */

/** Guarda el token y datos del usuario en sessionStorage */
function guardarSesion(data) {
    sessionStorage.setItem("token",   data.token);
    sessionStorage.setItem("nombre",  data.nombre);
    sessionStorage.setItem("correo",  data.correo);
    sessionStorage.setItem("rol",     data.rol);
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
        "Authorization": "Bearer " + getToken()
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
function mostrarAlerta(mensaje, tipo = "success", contenedorId = "alertaContenedor") {
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

        const correo   = document.getElementById("correo").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!correo || !password) {
            mostrarAlerta("Por favor complete todos los campos.", "danger");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo, password })
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
                mostrarAlerta(json.message || "Correo o contraseña incorrectos.", "danger");
            }

        } catch (error) {
            mostrarAlerta("Error de conexión con el servidor. Verifica que el backend esté corriendo.", "danger");
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

        const nombre          = document.getElementById("nombre").value.trim();
        const correo          = document.getElementById("correo").value.trim();
        const telefono        = document.getElementById("telefono").value.trim();
        const password        = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const terminos        = document.getElementById("terminos").checked;

        if (!nombre || !correo || !password || !confirmPassword) {
            mostrarAlerta("Todos los campos obligatorios deben completarse.", "danger");
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
                body: JSON.stringify({ nombre, correo, password, telefono })
            });

            const json = await res.json();

            if (res.ok && json.success) {
                mostrarAlerta("¡Registro exitoso! Redirigiendo al login...", "success");
                setTimeout(() => window.location.href = "login.html", 2000);
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
    document.getElementById("nombreUsuario").textContent = getNombre() || "Usuario";

    // Cargar resumen del usuario
    cargarResumenUsuario();
}

async function cargarResumenUsuario() {
    try {
        const res  = await fetch(`${API_URL}/reservas/mis-reservas`, { headers: headersAuth() });
        const json = await res.json();

        if (res.ok && json.success) {
            const reservas   = json.data;
            const activas    = reservas.filter(r => r.estadoPago !== "Cancelado").length;
            const pendientes = reservas.filter(r => r.estadoPago === "Pendiente").length;
            const total      = reservas
                .filter(r => r.estadoPago === "Pagado")
                .reduce((sum, r) => sum + (r.montoTotal || 0), 0);

            const elActivas    = document.getElementById("reservasActivas");
            const elPendientes = document.getElementById("pagosPendientes");
            const elTotal      = document.getElementById("totalInvertido");

            if (elActivas)    elActivas.textContent    = activas;
            if (elPendientes) elPendientes.textContent = pendientes;
            if (elTotal)      elTotal.textContent      = "$" + total.toLocaleString("es-CO");

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

    tbody.innerHTML = reservas.map(r => `
        <tr>
            <td>${r.nombreCancha}</td>
            <td>${r.fecha}</td>
            <td>${r.horaInicio} - ${r.horaFin}</td>
            <td>${badgePago(r.estadoPago)}</td>
            <td>$${(r.montoTotal || 0).toLocaleString("es-CO")}</td>
        </tr>`).join("");
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
        const res  = await fetch(`${API_URL}/reportes/resumen`, { headers: headersAuth() });
        const json = await res.json();

        if (res.ok && json.success) {
            const d = json.data;
            setText("totalUsuarios",      d.totalUsuarios);
            setText("reservasActivas",    d.reservasActivas);
            setText("canchasDisponibles", d.totalCanchas);
            setText("ingresosMensuales",  "$" + (d.ingresosTotales || 0).toLocaleString("es-CO"));
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
        const res  = await fetch(`${API_URL}/reservas`, { headers: headersAuth() });
        const json = await res.json();

        if (res.ok && json.success) {
            const tbody = document.getElementById("tablaReservasRecientes");
            if (!tbody) return;

            const reservas = json.data.slice(0, 5);
            tbody.innerHTML = reservas.map(r => `
                <tr>
                    <td>${r.nombreUsuario}</td>
                    <td>${r.nombreCancha}</td>
                    <td>${r.fecha}</td>
                    <td>${r.horaInicio} - ${r.horaFin}</td>
                    <td>${badgePago(r.estadoPago)}</td>
                    <td>$${(r.montoTotal || 0).toLocaleString("es-CO")}</td>
                </tr>`).join("");
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

    let url = `${API_URL}/canchas`;
    const params = [];
    if (estado)     params.push(`estado=${estado}`);
    if (superficie) params.push(`superficie=${superficie}`);
    if (params.length) url += "?" + params.join("&");

    try {
        const res  = await fetch(url, { headers: headersAuth() });
        const json = await res.json();

        if (res.ok && json.success) {
            const canchas = json.data;

            if (canchas.length === 0) {
                contenedor.innerHTML = `<p class="text-center">No hay canchas disponibles con ese filtro.</p>`;
                return;
            }

            contenedor.innerHTML = canchas.map(c => `
                <div class="col-md-4">
                    <div class="card shadow h-100">
                        <div class="card-body">
                            <h4>${c.nombreCancha}</h4>
                            <p><strong>Superficie:</strong> ${c.tipoSuperficie}</p>
                            <p><strong>Precio:</strong> $${(c.precioHora || 0).toLocaleString("es-CO")} / hora</p>
                            <p><strong>Estado:</strong> ${badgeEstado(c.estado)}</p>
                            ${c.estado === "Disponible"
                                ? `<a href="reservar.html?cancha=${c.idCancha}" class="btn btn-success w-100">Reservar</a>`
                                : `<button class="btn btn-secondary w-100" disabled>No Disponible</button>`
                            }
                        </div>
                    </div>
                </div>`).join("");
        } else {
            throw new Error(json.message || "Error cargando canchas");
        }
    } catch (error) {
        contenedor.innerHTML = `<p class="text-danger"><strong>Error cargando canchas:</strong> ${error.message}</p>`;
    }
}

// Botón filtrar canchas
const btnFiltrarCanchas = document.getElementById("btnFiltrarCanchas");
if (btnFiltrarCanchas) {
    btnFiltrarCanchas.addEventListener("click", () => {
        const estado     = document.getElementById("filtroEstado")?.value;
        const superficie = document.getElementById("filtroSuperficie")?.value;
        cargarCanchas(
            estado     === "Todos" ? null : estado,
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
    const params   = new URLSearchParams(window.location.search);
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
        const res  = await fetch(`${API_URL}/canchas?estado=Disponible`, { headers: headersAuth() });
        const json = await res.json();

        if (res.ok && json.success) {
            select.innerHTML = `<option selected disabled>Seleccione una opción</option>` +
                json.data.map(c =>
                    `<option value="${c.idCancha}" data-precio="${c.precioHora}">
                        ${c.nombreCancha} - $${(c.precioHora || 0).toLocaleString("es-CO")}/hora
                    </option>`
                ).join("");

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
    const select     = document.getElementById("cancha");
    const horaInicio = document.getElementById("horaInicio").value;
    const horaFin    = document.getElementById("horaFin").value;

    if (!select?.value || !horaInicio || !horaFin) {
        alert("Debe seleccionar cancha y horarios.");
        return;
    }

    const precio = parseFloat(select.selectedOptions[0]?.dataset.precio || 0);
    const inicio = horaInicio.split(":");
    const fin    = horaFin.split(":");
    const horas  = (parseInt(fin[0]) + parseInt(fin[1]) / 60) -
                   (parseInt(inicio[0]) + parseInt(inicio[1]) / 60);

    if (horas <= 0) {
        alert("Horario inválido.");
        return;
    }

    const total = horas * precio;
    document.getElementById("horasReservadas").textContent = horas;
    document.getElementById("montoTotal").textContent      = total.toLocaleString("es-CO");
}

// Enviar reserva
const reservaForm = document.getElementById("reservaForm");
if (reservaForm) {
    reservaForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const idCancha   = document.getElementById("cancha").value;
        const fecha      = document.getElementById("fecha").value;
        const horaInicio = document.getElementById("horaInicio").value;
        const horaFin    = document.getElementById("horaFin").value;
        const estadoPago = document.getElementById("estadoPago").value;

        if (!idCancha || !fecha || !horaInicio || !horaFin) {
            mostrarAlerta("Debe completar todos los campos.", "danger");
            return;
        }

        if (horaInicio >= horaFin) {
            mostrarAlerta("La hora de inicio debe ser menor que la hora de fin.", "danger");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/reservas`, {
                method:  "POST",
                headers: headersAuth(),
                body:    JSON.stringify({
                    idCancha:   parseInt(idCancha),
                    fecha,
                    horaInicio,
                    horaFin,
                    estadoPago
                })
            });

            const json = await res.json();

            if (res.ok && json.success) {
                mostrarAlerta("¡Reserva confirmada exitosamente! Redirigiendo...", "success");
                setTimeout(() => window.location.href = "mis-reservas.html", 2000);
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
        const res  = await fetch(`${API_URL}/reservas/mis-reservas`, { headers: headersAuth() });
        const json = await res.json();

        if (res.ok && json.success) {
            let reservas = json.data;

            if (estadoFiltro && estadoFiltro !== "Todos") {
                reservas = reservas.filter(r => r.estadoPago === estadoFiltro);
            }

            // Actualizar resumen
            setText("totalReservas",   reservas.length);
            setText("pagosPendientes", reservas.filter(r => r.estadoPago === "Pendiente").length);
            setText("totalGastado",    "$" + reservas
                .filter(r => r.estadoPago === "Pagado")
                .reduce((s, r) => s + (r.montoTotal || 0), 0)
                .toLocaleString("es-CO"));

            if (reservas.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" class="text-center">No tienes reservas.</td></tr>`;
                return;
            }

            tbody.innerHTML = reservas.map(r => `
                <tr>
                    <td>#${r.idReserva}</td>
                    <td>${r.nombreCancha}</td>
                    <td>${r.fecha}</td>
                    <td>${r.horaInicio} - ${r.horaFin}</td>
                    <td>$${(r.montoTotal || 0).toLocaleString("es-CO")}</td>
                    <td>${badgePago(r.estadoPago)}</td>
                    <td>
                        ${r.estadoPago === "Pendiente" ? `
                            <button class="btn btn-sm btn-danger" onclick="cancelarReserva(${r.idReserva})">
                                Cancelar
                            </button>` :
                            `<button class="btn btn-sm btn-secondary" disabled>
                                ${r.estadoPago === "Cancelado" ? "Cancelada" : "Finalizada"}
                            </button>`
                        }
                    </td>
                </tr>`).join("");
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
        const res  = await fetch(`${API_URL}/reservas/${id}`, {
            method:  "DELETE",
            headers: headersAuth()
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
        const res  = await fetch(`${API_URL}/canchas`, { headers: headersAuth() });
        const json = await res.json();

        if (res.ok && json.success) {
            const canchas = json.data;

            setText("totalCanchas",      canchas.length);
            setText("canchasDisp",       canchas.filter(c => c.estado === "Disponible").length);
            setText("canchasMant",       canchas.filter(c => c.estado === "Mantenimiento").length);

            tbody.innerHTML = canchas.map(c => `
                <tr>
                    <td>${c.idCancha}</td>
                    <td>${c.nombreCancha}</td>
                    <td>${c.tipoSuperficie}</td>
                    <td>$${(c.precioHora || 0).toLocaleString("es-CO")}</td>
                    <td>${badgeEstado(c.estado)}</td>
                    <td>
                        ${c.estado === "Disponible"
                            ? `<button class="btn btn-sm btn-warning"
                                onclick="cambiarEstadoCancha(${c.idCancha}, 'Mantenimiento')">
                                Mantenimiento</button>`
                            : `<button class="btn btn-sm btn-success"
                                onclick="cambiarEstadoCancha(${c.idCancha}, 'Disponible')">
                                Reactivar</button>`
                        }
                    </td>
                </tr>`).join("");
        } else {
            throw new Error(json.message || "Error cargando canchas");
        }
    } catch (error) {
        console.error("Error cargando gestión canchas:", error);
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger"><strong>Error cargando canchas:</strong> ${error.message}</td></tr>`;
    }
}

async function cambiarEstadoCancha(id, nuevoEstado) {
    try {
        const res = await fetch(`${API_URL}/canchas/${id}/estado`, {
            method:  "PATCH",
            headers: headersAuth(),
            body:    JSON.stringify({ estado: nuevoEstado })
        });
        const json = await res.json();

        if (res.ok && json.success) {
            mostrarAlerta(`Cancha actualizada a: ${nuevoEstado}`, "success");
            cargarGestionCanchas();
        } else {
            mostrarAlerta(json.message || "Error al cambiar estado.", "danger");
        }
    } catch (error) {
        mostrarAlerta("Error de conexión.", "danger");
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
        const res  = await fetch(`${API_URL}/usuarios`, { headers: headersAuth() });
        const json = await res.json();

        if (res.ok && json.success) {
            const usuarios = json.data;
            tbody.innerHTML = usuarios.map(u => `
                <tr>
                    <td>${u.idUsuario}</td>
                    <td>${u.nombre}</td>
                    <td>${u.correo}</td>
                    <td>${u.telefono || "-"}</td>
                    <td><span class="badge bg-${u.rol === "Administrador" ? "dark" : "success"}">${u.rol}</span></td>
                    <td><span class="badge bg-success">Activo</span></td>
                    <td><button class="btn btn-sm btn-secondary" disabled>Gestionar</button></td>
                </tr>`).join("");
        } else {
            throw new Error(json.message || "Error cargando usuarios");
        }
    } catch (error) {
        console.error("Error cargando usuarios:", error);
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger"><strong>Error cargando usuarios:</strong> ${error.message}</td></tr>`;
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
        const resRes  = await fetch(`${API_URL}/reportes/resumen`, { headers: headersAuth() });
        const resJson = await resRes.json();
        if (resRes.ok && resJson.success) {
            const d = resJson.data;
            setText("ingresosTotales",   "$" + (d.ingresosTotales || 0).toLocaleString("es-CO"));
            setText("reservasTotales",   d.reservasActivas);
            setText("pagosPendientes",   "$" + (d.pagosPendientes || 0).toLocaleString("es-CO"));
            setText("canchaTopReservada", d.canchaTopReservada);
        } else {
            throw new Error(resJson.message || "Error cargando resumen");
        }

        // Facturación
        let url = `${API_URL}/reportes/facturacion`;
        if (estadoPago && estadoPago !== "Todos") url += `?estadoPago=${estadoPago}`;

        const facRes  = await fetch(url, { headers: headersAuth() });
        const facJson = await facRes.json();
        if (facRes.ok && facJson.success) {
            const tbody = document.getElementById("tablaFacturacion");
            if (tbody) {
                tbody.innerHTML = facJson.data.map(r => `
                    <tr>
                        <td>#${r.idReserva}</td>
                        <td>${r.usuario}</td>
                        <td>${r.cancha}</td>
                        <td>${r.fecha}</td>
                        <td>$${(r.montoTotal || 0).toLocaleString("es-CO")}</td>
                        <td>${badgePago(r.estadoPago)}</td>
                    </tr>`).join("");
            }
        } else {
            throw new Error(facJson.message || "Error cargando facturación");
        }

        // Rendimiento por cancha
        const rendRes  = await fetch(`${API_URL}/reportes/canchas`, { headers: headersAuth() });
        const rendJson = await rendRes.json();
        if (rendRes.ok && rendJson.success) {
            const tbody = document.getElementById("tablaRendimiento");
            if (tbody) {
                tbody.innerHTML = rendJson.data.map(c => `
                    <tr>
                        <td>${c.nombreCancha}</td>
                        <td>${c.totalReservas}</td>
                        <td>$${(c.ingresosGenerados || 0).toLocaleString("es-CO")}</td>
                        <td>${badgeEstado(c.estado)}</td>
                    </tr>`).join("");
            }
        } else {
            throw new Error(rendJson.message || "Error cargando rendimiento");
        }

    } catch (error) {
        console.error("Error cargando reportes:", error);
        const tbody1 = document.getElementById("tablaFacturacion");
        if (tbody1) tbody1.innerHTML = `<tr><td colspan="6" class="text-center text-danger"><strong>Error:</strong> ${error.message}</td></tr>`;
        
        const tbody2 = document.getElementById("tablaRendimiento");
        if (tbody2) tbody2.innerHTML = `<tr><td colspan="4" class="text-center text-danger"><strong>Error:</strong> ${error.message}</td></tr>`;
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

// Exportar (simulado)
document.addEventListener("click", function (e) {
    if (e.target.textContent.includes("Exportar PDF")) {
        alert("Función de exportación PDF disponible en siguiente versión.");
    }
    if (e.target.textContent.includes("Exportar Excel")) {
        alert("Función de exportación Excel disponible en siguiente versión.");
    }
    if (e.target.textContent.includes("Imprimir")) {
        window.print();
    }
});

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
        "Pendiente": `<span class="badge bg-warning text-dark">Pendiente</span>`,
        "Pagado":    `<span class="badge bg-success">Pagado</span>`,
        "Cancelado": `<span class="badge bg-danger">Cancelado</span>`
    };
    return mapa[estado] || `<span class="badge bg-secondary">${estado}</span>`;
}

function badgeEstado(estado) {
    return estado === "Disponible"
        ? `<span class="badge bg-success">Disponible</span>`
        : `<span class="badge bg-danger">Mantenimiento</span>`;
}
