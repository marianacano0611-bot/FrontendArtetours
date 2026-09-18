import { apiRequest } from "@/shared/lib/api.js";

export const authServices = {
  login: async ({ correo, password, redirectTo = "/dashboard" }) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ correo, password }),
    });
    window.localStorage.setItem("artetours_token", data.token);
    window.localStorage.setItem("artetours_user", JSON.stringify(data.usuario));
    window.location.href = redirectTo;
    return data;
  },

  register: async (payload) => {
    const usuario = payload.usuario || {};
    const turista = payload.turista || {};
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        password: usuario.password,
        telefono: usuario.telefono,
        tipo_documento: turista.tipo_documento,
        numero_documento: turista.numero_documento,
        rol: usuario.rol || "cliente",
      }),
    });
    window.localStorage.setItem("artetours_token", data.token);
    window.localStorage.setItem("artetours_user", JSON.stringify(data.usuario));
    window.location.href = "/dashboard";
    return data;
  },

  forgotPassword: async () => {
    throw new Error("El backend todavía no expone recuperación de contraseña");
  },

  validatePasswordStrength: (password) => {
    if (!password || password.length < 8) return false;
    return /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);
  },

  validatePasswordsMatch: (password, confirmPassword) => {
    return Boolean(password && confirmPassword && password === confirmPassword);
  },
};

export function logout() {
  window.localStorage.removeItem("artetours_token");
  window.localStorage.removeItem("artetours_user");
  window.location.href = "/login";
}

export function currentUser() {
  const raw = window.localStorage.getItem("artetours_user");
  return raw ? JSON.parse(raw) : null;
}
