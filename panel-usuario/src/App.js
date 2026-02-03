import { useEffect, useState } from "react";

function App() {
  const [orders, setOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      // VALIDAR SESIÓN 
      const sessionRes = await fetch("/api/check-session", {
        credentials: "include",
      });

      const sessionData = await sessionRes.json();

      if (!sessionData.authenticated) {
        alert("Debes iniciar sesión");
        setLoading(false);
        return;
      }

      const userId = sessionData.userId;

      // PEDIDOS
      const ordersRes = await fetch(`/api/orders/customer/${userId}`, {
        credentials: "include",
      });
      const ordersData = await ordersRes.json();

      // CITAS
      const appRes = await fetch("/api/appointments/my-appointments", {
        credentials: "include",
      });
      const appData = await appRes.json();

      setOrders(ordersData || []);
      setAppointments(appData.appointments || []);
      setLoading(false);
    } catch (error) {
      console.error("Error cargando datos:", error);
      alert("Error cargando datos");
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container my-5">
        <p>Cargando información...</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">Mi Panel Personal</h2>

      <h4>Mis pedidos</h4>
      {orders.length === 0 ? (
        <p className="text-muted">No tienes pedidos</p>
      ) : (
        orders.map(o => (
          <div key={o.id} className="card mb-3 shadow-sm">
            <div className="card-body">
              <strong>Pedido #{o.id}</strong>
              <p>Fecha: {o.order_date}</p>
              <p>Total: ${o.total_amount}</p>
              <p>Estado: {o.status}</p>
              <p>Pago: {o.payment_status}</p>
            </div>
          </div>
        ))
      )}

      <h4 className="mt-4">Mis citas</h4>
      {appointments.length === 0 ? (
        <p className="text-muted">No tienes citas</p>
      ) : (
        appointments.map(c => (
          <div key={c.id} className="card mb-3 shadow-sm">
            <div className="card-body">
              <strong>Cita #{c.id}</strong>
              <p>Fecha: {c.appointment_date}</p>
              <p>Hora: {c.appointment_time}</p>
              <p>Especialista: {c.employee_name}</p>
              <p>Estado: {c.status}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
