import { METODO_PAGO_OPTIONS, ESTADO_VENTA_OPTIONS } from "@/shared/constants/dbEnums.js";
import { mockReservas, mockClientes, mockTours } from "@/features/admin/reservas/bookingServices";
import { apiRequest } from "@/shared/lib/api.js";

const IMPUESTO_PORCENTAJE = 0.19;

function withMockDelay(data, delayMs = 350) {
  return new Promise((resolve) => setTimeout(() => resolve(data), delayMs));
}

export const metodosPagoCatalogo = METODO_PAGO_OPTIONS.map((o) => ({
  id_metodo_pago: o.value,
  codigo: o.code,
  nombre: o.label,
}));

export const SALE_STATUS_OPTIONS = [
  { value: "all", label: "Todos" },
  ...ESTADO_VENTA_OPTIONS,
];

export const PAYMENT_METHOD_OPTIONS = [
  { value: "all", label: "Todos" },
  ...metodosPagoCatalogo.map((m) => ({ value: m.codigo, label: m.nombre })),
];

export const mockReservasParaVentas = mockReservas.map((b) => {
  const tour = mockTours.find((t) => t.name === (b.salida_tour_nombre ?? b.tour));
  const cliente = mockClientes.find((c) => (c.nombre_completo ?? c.name) === (b.turista_nombre ?? b.customer));
  const pax = b.people ?? (b.cantidad_adultos ?? 0) + (b.cantidad_ninos ?? 0);
  return {
    id_reserva: b.id_reserva ?? b.id,
    codigo_reserva: b.codigo_reserva ?? `RES-${String(b.id_reserva ?? b.id).padStart(5, "0")}`,
    id_turista: b.id_turista ?? cliente?.id_turista ?? cliente?.id ?? null,
    id_salida_tour: b.id_salida ?? tour?.id ?? null,
    cliente_nombre: b.turista_nombre ?? b.customer ?? "",
    tour_nombre: b.salida_tour_nombre ?? b.tour ?? "",
    fecha_salida: b.salida_fecha ?? b.date ?? "",
    hora_salida: b.salida_hora ?? b.time ?? "",
    cantidad_personas: pax,
    subtotal: b.subtotal ?? b.total ?? 0,
    descuento: b.descuento ?? 0,
    estado_reserva: b.estado ?? b.status ?? "PENDIENTE",
  };
});

let nextVentaId = 600;
let nextAbonoId = 100;

export let mockVentas = [
  {
    id_venta: 501,
    numero_venta: "FAC-2026-0501",
    id_reserva: 1001,
    fecha_venta: "2026-06-05",
    subtotal: 180000,
    impuestos: 0,
    descuento: 0,
    total: 180000,
    estado: "PAGADA",
    observaciones: "Pago completo en tarjeta.",
  },
  {
    id_venta: 502,
    numero_venta: "FAC-2026-0502",
    id_reserva: 1002,
    fecha_venta: "2026-06-05",
    subtotal: 120000,
    impuestos: 0,
    descuento: 12000,
    total: 108000,
    estado: "PENDIENTE",
    observaciones: "Pago pendiente en hotel.",
  },
  {
    id_venta: 503,
    numero_venta: "FAC-2026-0503",
    id_reserva: 1003,
    fecha_venta: "2026-06-04",
    subtotal: 330000,
    impuestos: 0,
    descuento: 0,
    total: 330000,
    estado: "PAGADA",
    observaciones: "",
  },
  {
    id_venta: 504,
    numero_venta: "FAC-2026-0504",
    id_reserva: 1006,
    fecha_venta: "2026-06-03",
    subtotal: 350000,
    impuestos: 0,
    descuento: 10000,
    total: 340000,
    estado: "PARCIAL",
    observaciones: "Abono inicial realizado.",
  },
];

export let mockAbonos = [
  {
    id_abono: 1,
    id_venta: 501,
    fecha_abono: "2026-06-05",
    id_metodo_pago: 2,
    monto: 180000,
    referencia: "TXN-0001",
    comprobante_url: "",
    observaciones: "",
  },
  {
    id_abono: 2,
    id_venta: 503,
    fecha_abono: "2026-06-03",
    id_metodo_pago: 2,
    monto: 165000,
    referencia: "TXN-0002",
    comprobante_url: "",
    observaciones: "Primer abono 50%",
  },
  {
    id_abono: 3,
    id_venta: 503,
    fecha_abono: "2026-06-04",
    id_metodo_pago: 2,
    monto: 165000,
    referencia: "TXN-0003",
    comprobante_url: "",
    observaciones: "Segundo abono",
  },
  {
    id_abono: 4,
    id_venta: 504,
    fecha_abono: "2026-06-01",
    id_metodo_pago: 4,
    monto: 100000,
    referencia: "NEQUI-001",
    comprobante_url: "",
    observaciones: "Abono inicial",
  },
];

export const emptyVentaForm = {
  id_reserva: null,
  fecha_venta: new Date().toISOString().split("T")[0],
  subtotal: 0,
  impuestos: 0,
  descuento: 0,
  total: 0,
  estado: "PENDIENTE",
  observaciones: "",
};

export const emptyAbonoForm = {
  id_venta: null,
  fecha_abono: new Date().toISOString().split("T")[0],
  id_metodo_pago: null,
  monto: 0,
  referencia: "",
  comprobante_url: "",
  observaciones: "",
};

function enriquecerVenta(v) {
  const reserva = mockReservasParaVentas.find((r) => r.id_reserva === v.id_reserva) ?? null;
  return {
    ...v,
    reserva,
    cliente_nombre: reserva?.cliente_nombre ?? "",
    tour_nombre: reserva?.tour_nombre ?? "",
    fecha_salida: reserva?.fecha_salida ?? "",
    codigo_reserva: reserva?.codigo_reserva ?? "",
  };
}

function calcularSumaAbonos(idVenta) {
  return mockAbonos
    .filter((a) => a.id_venta === idVenta)
    .reduce((s, a) => s + Number(a.monto ?? 0), 0);
}

function recalcularEstadoVenta(idVenta) {
  const idx = mockVentas.findIndex((v) => v.id_venta === idVenta);
  if (idx === -1) return null;
  const venta = mockVentas[idx];
  if (venta.estado === "CANCELADA") return venta;
  const sumaAbonos = calcularSumaAbonos(idVenta);
  const total = Number(venta.total ?? 0);
  let nuevoEstado = "PENDIENTE";
  if (sumaAbonos >= total && total > 0) {
    nuevoEstado = "PAGADA";
  } else if (sumaAbonos > 0) {
    nuevoEstado = "PARCIAL";
  }
  mockVentas[idx] = { ...venta, estado: nuevoEstado };
  return mockVentas[idx];
}

export const ventaServices = {
  async getVentas() {
    const ventas = mockVentas.map((v) => enriquecerVenta(v));
    return withMockDelay([...ventas]);
  },

  async getVentaById(id_venta) {
    const venta = mockVentas.find((v) => v.id_venta === id_venta);
    if (!venta) return withMockDelay(null);
    return withMockDelay(enriquecerVenta(venta));
  },

  async createVenta(payload) {
    const existe = mockVentas.some((v) => v.id_reserva === payload.id_reserva);
    if (existe) {
      return withMockDelay(Promise.reject(new Error("Ya existe una venta para esta reserva (1:1 UNIQUE).")));
    }
    const nueva = {
      id_venta: nextVentaId++,
      numero_venta: `FAC-2026-${String(nextVentaId - 1).padStart(4, "0")}`,
      id_reserva: Number(payload.id_reserva),
      fecha_venta: payload.fecha_venta,
      subtotal: Number(payload.subtotal ?? 0),
      impuestos: Number(payload.impuestos ?? 0),
      descuento: Number(payload.descuento ?? 0),
      total: Number(payload.total ?? 0),
      estado: payload.estado ?? "PENDIENTE",
      observaciones: payload.observaciones ?? "",
    };
    mockVentas.push(nueva);
    return withMockDelay(enriquecerVenta(nueva));
  },

  async updateVenta(id_venta, payload) {
    const idx = mockVentas.findIndex((v) => v.id_venta === id_venta);
    if (idx === -1) return withMockDelay(null);
    mockVentas[idx] = {
      ...mockVentas[idx],
      id_reserva: payload.id_reserva != null ? Number(payload.id_reserva) : mockVentas[idx].id_reserva,
      fecha_venta: payload.fecha_venta ?? mockVentas[idx].fecha_venta,
      subtotal: payload.subtotal != null ? Number(payload.subtotal) : mockVentas[idx].subtotal,
      impuestos: payload.impuestos != null ? Number(payload.impuestos) : mockVentas[idx].impuestos,
      descuento: payload.descuento != null ? Number(payload.descuento) : mockVentas[idx].descuento,
      total: payload.total != null ? Number(payload.total) : mockVentas[idx].total,
      estado: payload.estado ?? mockVentas[idx].estado,
      observaciones: payload.observaciones ?? mockVentas[idx].observaciones,
    };
    return withMockDelay(enriquecerVenta(mockVentas[idx]));
  },

  async deleteVenta(id_venta) {
    const tieneAbonos = mockAbonos.some((a) => a.id_venta === id_venta);
    if (tieneAbonos) {
      return withMockDelay(Promise.reject(new Error("No se puede eliminar la venta: tiene abonos asociados (ON DELETE RESTRICT).")));
    }
    const idx = mockVentas.findIndex((v) => v.id_venta === id_venta);
    if (idx === -1) return withMockDelay(false);
    mockVentas.splice(idx, 1);
    return withMockDelay(true);
  },

  computeImpuestos(subtotal, porcentaje = IMPUESTO_PORCENTAJE) {
    return Math.round(Number(subtotal ?? 0) * porcentaje * 100) / 100;
  },

  computeTotal({ subtotal, impuestos, descuento }) {
    return Math.max(
      0,
      Number(subtotal ?? 0) + Number(impuestos ?? 0) - Number(descuento ?? 0)
    );
  },

  computeSalesStats(ventas, filteredCount) {
    const revenue = ventas.reduce((s, v) => s + Number(v.total ?? 0), 0);
    return {
      total: ventas.length,
      pagada: ventas.filter((v) => v.estado === "PAGADA").length,
      pendiente: ventas.filter((v) => v.estado === "PENDIENTE").length,
      parcial: ventas.filter((v) => v.estado === "PARCIAL").length,
      cancelada: ventas.filter((v) => v.estado === "CANCELADA").length,
      revenue: `$${revenue.toLocaleString()}`,
      filtered: filteredCount ?? 0,
    };
  },

  exportVentasCSV(ventas) {
    const headers = [
      "NroVenta", "CodReserva", "Cliente", "Tour", "FechaVenta",
      "Subtotal", "Impuestos", "Descuento", "Total", "Estado", "Observaciones",
    ];
    const rows = ventas.map((v) => [
      v.numero_venta,
      v.codigo_reserva,
      v.cliente_nombre,
      v.tour_nombre,
      v.fecha_venta,
      v.subtotal,
      v.impuestos,
      v.descuento,
      v.total,
      v.estado,
      (v.observaciones ?? "").replace(/"/g, '""'),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ventas-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  },
};

export const abonoServices = {
  async getAbonosByVenta(id_venta) {
    const abonos = mockAbonos
      .filter((a) => a.id_venta === id_venta)
      .map((a) => ({
        ...a,
        metodo_pago: metodosPagoCatalogo.find((m) => m.id_metodo_pago === a.id_metodo_pago)?.nombre ?? "",
      }));
    return withMockDelay([...abonos]);
  },

  async getAllAbonosConVenta() {
    const result = [];
    mockAbonos.forEach((a) => {
      const venta = mockVentas.find((v) => v.id_venta === a.id_venta);
      const ventaR = venta ? enriquecerVenta(venta) : null;
      result.push({
        ...a,
        metodo_pago: metodosPagoCatalogo.find((m) => m.id_metodo_pago === a.id_metodo_pago)?.nombre ?? "",
        numero_venta: ventaR?.numero_venta ?? "",
        codigo_reserva: ventaR?.codigo_reserva ?? "",
        cliente_nombre: ventaR?.cliente_nombre ?? "",
        tour_nombre: ventaR?.tour_nombre ?? "",
        venta_total: ventaR?.total ?? 0,
        suma_abonos: calcularSumaAbonos(a.id_venta),
      });
    });
    return withMockDelay(result);
  },

  async createAbono(payload) {
    const nuevo = {
      id_abono: nextAbonoId++,
      id_venta: Number(payload.id_venta),
      fecha_abono: payload.fecha_abono,
      id_metodo_pago: Number(payload.id_metodo_pago),
      monto: Number(payload.monto ?? 0),
      referencia: payload.referencia ?? "",
      comprobante_url: payload.comprobante_url ?? "",
      observaciones: payload.observaciones ?? "",
    };
    mockAbonos.push(nuevo);
    recalcularEstadoVenta(nuevo.id_venta);
    return withMockDelay({
      ...nuevo,
      metodo_pago: metodosPagoCatalogo.find((m) => m.id_metodo_pago === nuevo.id_metodo_pago)?.nombre ?? "",
    });
  },

  async updateAbono(id_abono, payload) {
    const idx = mockAbonos.findIndex((a) => a.id_abono === id_abono);
    if (idx === -1) return withMockDelay(null);
    const idVenta = payload.id_venta != null ? Number(payload.id_venta) : mockAbonos[idx].id_venta;
    const idVentaAnterior = mockAbonos[idx].id_venta;
    mockAbonos[idx] = {
      ...mockAbonos[idx],
      id_venta: idVenta,
      fecha_abono: payload.fecha_abono ?? mockAbonos[idx].fecha_abono,
      id_metodo_pago: payload.id_metodo_pago != null ? Number(payload.id_metodo_pago) : mockAbonos[idx].id_metodo_pago,
      monto: payload.monto != null ? Number(payload.monto) : mockAbonos[idx].monto,
      referencia: payload.referencia ?? mockAbonos[idx].referencia,
      comprobante_url: payload.comprobante_url ?? mockAbonos[idx].comprobante_url,
      observaciones: payload.observaciones ?? mockAbonos[idx].observaciones,
    };
    recalcularEstadoVenta(idVenta);
    if (idVentaAnterior !== idVenta) recalcularEstadoVenta(idVentaAnterior);
    return withMockDelay({
      ...mockAbonos[idx],
      metodo_pago: metodosPagoCatalogo.find((m) => m.id_metodo_pago === mockAbonos[idx].id_metodo_pago)?.nombre ?? "",
    });
  },

  async deleteAbono(id_abono) {
    const idx = mockAbonos.findIndex((a) => a.id_abono === id_abono);
    if (idx === -1) return withMockDelay(false);
    const idVenta = mockAbonos[idx].id_venta;
    mockAbonos.splice(idx, 1);
    recalcularEstadoVenta(idVenta);
    return withMockDelay(true);
  },

  getSumaAbonos(id_venta) {
    return calcularSumaAbonos(id_venta);
  },

  getSaldoPendiente(venta) {
    if (!venta) return 0;
    const suma = calcularSumaAbonos(venta.id_venta ?? venta.id);
    return Math.max(0, Number(venta.total ?? 0) - suma);
  },

  computeAbonosStats(abonos, filteredCount) {
    const collected = abonos.reduce((s, a) => s + Number(a.monto ?? 0), 0);
    return {
      total: abonos.length,
      collected: `$${collected.toLocaleString()}`,
      filtered: filteredCount ?? 0,
    };
  },

  exportAbonosCSV(abonos) {
    const headers = [
      "NroVenta", "Cliente", "Tour", "FechaAbono",
      "MetodoPago", "Monto", "Referencia", "ComprobanteURL", "Observaciones",
    ];
    const rows = abonos.map((a) => [
      a.numero_venta ?? "",
      a.cliente_nombre ?? "",
      a.tour_nombre ?? "",
      a.fecha_abono,
      a.metodo_pago ?? "",
      a.monto,
      a.referencia ?? "",
      a.comprobante_url ?? "",
      (a.observaciones ?? "").replace(/"/g, '""'),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `abonos-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  },
};

Object.assign(ventaServices, {
  async getVentas() { return (await apiRequest("/ventas")).ventas ?? []; },
  async getVentaById(id) { return (await apiRequest(`/ventas/${id}`)).venta; },
  async createVenta(payload) { return (await apiRequest("/ventas", { method: "POST", body: JSON.stringify(payload) })).venta; },
  async updateVenta(id, payload) { return (await apiRequest(`/ventas/${id}/estado`, { method: "PUT", body: JSON.stringify({ estado: payload.estado }) })).venta; },
  async deleteVenta(id) { await apiRequest(`/ventas/${id}`, { method: "DELETE" }); return true; },
});

Object.assign(abonoServices, {
  async getAbonosByVenta(id) { return (await apiRequest(`/abonos?id_venta=${id}`)).abonos ?? []; },
  async getAllAbonosConVenta() { return (await apiRequest("/abonos")).abonos ?? []; },
  async createAbono(payload) { return (await apiRequest("/abonos", { method: "POST", body: JSON.stringify(payload) })); },
  async updateAbono(id, payload) { return (await apiRequest(`/abonos/${id}`, { method: "PUT", body: JSON.stringify(payload) })).abono; },
  async deleteAbono(id) { await apiRequest(`/abonos/${id}`, { method: "DELETE" }); return true; },
});

export const paymentServices = {
  ...ventaServices,
  ...abonoServices,
};

export const emptySaleForm = {
  invoice: "FAC-2026-XXXX",
  client: "",
  tour: "",
  date: new Date().toISOString().split("T")[0],
  subtotal: 0,
  discount: 0,
  commission: 0,
  total: 0,
  status: "pending",
  paymentMethod: "Tarjeta",
  payments: [
    {
      id: 1,
      date: new Date().toISOString().split("T")[0],
      amount: 0,
      method: "Tarjeta",
      status: "pending",
      reference: "",
    },
  ],
};

export const emptyPaymentForm = {
  saleId: null,
  date: "",
  amount: 0,
  method: "Tarjeta",
  status: "pending",
  reference: "",
};

function ventaASalesAntiguo(v) {
  const reserva = v.reserva ?? mockReservasParaVentas.find((r) => r.id_reserva === v.id_reserva) ?? null;
  const statusMap = { PENDIENTE: "pending", PARCIAL: "partial", PAGADA: "paid", CANCELADA: "cancelled" };
  const abonosV = mockAbonos.filter((a) => a.id_venta === v.id_venta);
  const primerMetodo = metodosPagoCatalogo.find((m) => m.id_metodo_pago === abonosV[0]?.id_metodo_pago);
  return {
    id: v.id_venta,
    invoice: v.numero_venta,
    client: reserva?.cliente_nombre ?? "",
    tour: reserva?.tour_nombre ?? "",
    date: v.fecha_venta,
    subtotal: v.subtotal,
    discount: v.descuento,
    commission: Math.round(Number(v.subtotal ?? 0) * 0.06),
    total: v.total,
    status: statusMap[v.estado] ?? "pending",
    paymentMethod: primerMetodo?.nombre ?? "Tarjeta",
    payments: abonosV.map((a) => ({
      id: a.id_abono,
      date: a.fecha_abono,
      amount: a.monto,
      method: metodosPagoCatalogo.find((m) => m.id_metodo_pago === a.id_metodo_pago)?.nombre ?? "",
      status: "completed",
      reference: a.referencia ?? "",
    })),
    id_venta: v.id_venta,
    numero_venta: v.numero_venta,
    estado: v.estado,
    codigo_reserva: reserva?.codigo_reserva ?? "",
    id_reserva: v.id_reserva,
  };
}

export const mockSales = mockVentas.map((v) =>
  ventaASalesAntiguo(enriquecerVenta(v))
);

export function buildPaymentsView(ventasONombresAntiguos) {
  const result = [];
  const lista = Array.isArray(ventasONombresAntiguos) ? ventasONombresAntiguos : mockSales;
  lista.forEach((s) => {
    const pagos = Array.isArray(s.payments) ? s.payments : [];
    pagos.forEach((p) => {
      result.push({
        id: p.id,
        invoice: s.invoice ?? s.numero_venta ?? "",
        client: s.client ?? s.cliente_nombre ?? "",
        tour: s.tour ?? s.tour_nombre ?? "",
        saleId: s.id ?? s.id_venta,
        date: p.date,
        amount: p.amount,
        method: p.method,
        status: p.status ?? "completed",
        reference: p.reference,
        saleTotal: s.total,
        payments: s.payments,
      });
    });
  });
  return result;
}

const originalComputeSalesStats = ventaServices.computeSalesStats;
const originalComputePaymentsStats = abonoServices.computeAbonosStats;
const originalExportSalesCSV = ventaServices.exportVentasCSV;
const originalExportPaymentsCSV = abonoServices.exportAbonosCSV;

ventaServices.computeSalesStats = function (sales, filteredCount) {
  if (Array.isArray(sales) && sales.length > 0 && typeof sales[0].status === "string" && sales[0].status === sales[0].status?.toLowerCase()) {
    const revenue = sales.reduce((s, v) => s + Number(v.total ?? 0), 0);
    return {
      total: sales.length,
      paid: sales.filter((s) => s.status === "paid").length,
      pending: sales.filter((s) => s.status === "pending").length,
      partial: sales.filter((s) => s.status === "partial").length,
      revenue: `$${revenue.toLocaleString()}`,
      filtered: filteredCount ?? 0,
    };
  }
  return originalComputeSalesStats(sales, filteredCount);
};

abonoServices.computeAbonosStats = function (payments, filteredCount) {
  if (Array.isArray(payments) && payments.length > 0 && "status" in payments[0]) {
    const collected = payments
      .filter((p) => p.status === "completed")
      .reduce((s, p) => s + Number(p.amount ?? 0), 0);
    const pending = payments
      .filter((p) => p.status === "pending" || p.status === "partial")
      .reduce((s, p) => s + Number(p.amount ?? 0), 0);
    return {
      total: payments.length,
      completed: payments.filter((p) => p.status === "completed").length,
      collected: `$${collected.toLocaleString()}`,
      pending: `$${pending.toLocaleString()}`,
      filtered: filteredCount ?? 0,
    };
  }
  return originalComputePaymentsStats(payments, filteredCount);
};

ventaServices.exportVentasCSV = function (ventasOCsv) {
  if (Array.isArray(ventasOCsv) && ventasOCsv.length > 0 && "invoice" in ventasOCsv[0]) {
    const headers = ["Factura", "Cliente", "Tour", "Fecha", "Subtotal", "Descuento", "Comisión", "Total", "Estado", "MétodoPago"];
    const rows = ventasOCsv.map((s) => [
      s.invoice,
      s.client,
      s.tour,
      s.date,
      s.subtotal,
      s.discount,
      s.commission,
      s.total,
      s.status,
      s.paymentMethod,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ventas-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    return;
  }
  return originalExportSalesCSV(ventasOCsv);
};

abonoServices.exportAbonosCSV = function (paymentsOCsv) {
  if (Array.isArray(paymentsOCsv) && paymentsOCsv.length > 0 && "invoice" in paymentsOCsv[0]) {
    const headers = ["Factura", "Cliente", "Tour", "FechaPago", "Método", "Monto", "Estado", "Referencia"];
    const rows = paymentsOCsv.map((p) => [
      p.invoice,
      p.client,
      p.tour,
      p.date,
      p.method,
      p.amount,
      p.status,
      p.reference ?? "",
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `abonos-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    return;
  }
  return originalExportPaymentsCSV(paymentsOCsv);
};

ventaServices.exportSalesCSV = ventaServices.exportVentasCSV;
abonoServices.exportPaymentsCSV = abonoServices.exportAbonosCSV;
ventaServices.buildPaymentsView = buildPaymentsView;
paymentServices.exportSalesCSV = ventaServices.exportVentasCSV;
paymentServices.exportPaymentsCSV = abonoServices.exportAbonosCSV;
paymentServices.computeSalesStats = ventaServices.computeSalesStats;
paymentServices.computePaymentsStats = abonoServices.computeAbonosStats;
paymentServices.buildPaymentsView = buildPaymentsView;
