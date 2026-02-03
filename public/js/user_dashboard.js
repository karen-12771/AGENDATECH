document.addEventListener("DOMContentLoaded", () => {
  cargarPedidos();
  cargarCitas();
});

// ====================
// PEDIDOS DEL USUARIO
// ====================
async function cargarPedidos() {
  const contenedor = document.getElementById("userOrders");

  try {
    // 1️⃣ obtenemos usuario de la sesión
    const userRes = await fetch("/api/auth/me");
    const userData = await userRes.json();

    if (!userData.ok) {
      contenedor.innerHTML = "<p class='text-danger'>Debes iniciar sesión</p>";
      return;
    }

    const userId = userData.user.id;

    // 2️⃣ pedidos del usuario
    const res = await fetch(`/api/orders/customer/${userId}`);
    const pedidos = await res.json();

    if (!pedidos.length) {
      contenedor.innerHTML = "<p class='text-muted'>No tienes pedidos aún</p>";
      return;
    }

    contenedor.innerHTML = "";

    pedidos.forEach(pedido => {
      contenedor.innerHTML += `
        <div class="card mb-3 shadow-sm">
          <div class="card-body">
            <h6 class="fw-bold">Pedido #${pedido.id}</h6>
            <p class="mb-1"><strong>Fecha:</strong> ${pedido.order_date}</p>
            <p class="mb-1"><strong>Total:</strong> $${pedido.total_amount}</p>
            <p class="mb-1"><strong>Estado:</strong> ${pedido.status}</p>
            <p class="mb-0"><strong>Pago:</strong> ${pedido.payment_status}</p>
          </div>
        </div>
      `;
    });

  } catch (error) {
    console.error(error);
    contenedor.innerHTML = "<p class='text-danger'>Error cargando pedidos</p>";
  }
}

// ====================
// CITAS DEL USUARIO
// ====================
async function cargarCitas() {
  const contenedor = document.getElementById("userAppointments");

  try {
    const res = await fetch("/api/appointments/my-appointments");
    const data = await res.json();

    if (!data.ok) {
      contenedor.innerHTML = "<p class='text-danger'>No autorizado</p>";
      return;
    }

    if (!data.appointments.length) {
      contenedor.innerHTML = "<p class='text-muted'>No tienes citas programadas</p>";
      return;
    }

    contenedor.innerHTML = "";

    data.appointments.forEach(cita => {
      contenedor.innerHTML += `
        <div class="card mb-3 shadow-sm">
          <div class="card-body">
            <h6 class="fw-bold">Cita #${cita.id}</h6>
            <p class="mb-1"><strong>Fecha:</strong> ${cita.appointment_date}</p>
            <p class="mb-1"><strong>Hora:</strong> ${cita.appointment_time}</p>
            <p class="mb-1"><strong>Especialista:</strong> ${cita.employee_name}</p>
            <p class="mb-0"><strong>Estado:</strong> ${cita.status}</p>
          </div>
        </div>
      `;
    });

  } catch (error) {
    console.error(error);
    contenedor.innerHTML = "<p class='text-danger'>Error cargando citas</p>";
  }
}
