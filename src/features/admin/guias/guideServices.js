import { TIPO_DOCUMENTO_OPTIONS, GENERO_OPTIONS, NIVEL_IDIOMA_OPTIONS, ESTADO_USUARIO_OPTIONS } from "@/shared/constants/dbEnums";
import { apiRequest } from "@/shared/lib/api.js";

export const IDIOMA_OPTIONS = [
    { value: 1, label: "Español" },
    { value: 2, label: "Inglés" },
    { value: 3, label: "Francés" },
    { value: 4, label: "Portugués" },
    { value: 5, label: "Alemán" },
    { value: 6, label: "Italiano" },
];

export const CERTIFICACION_OPTIONS = [
    { value: 1, label: "Certificación Guía Oficial de Turismo" },
    { value: 2, label: "Certificación First Aid" },
    { value: 3, label: "Licencia de Conducción Comercial" },
    { value: 4, label: "Certificación Internacional Guides Association" },
    { value: 5, label: "Curso de Interpretación del Patrimonio" },
];

export const emptyGuideForm = {
    firstName: "",
    lastName: "",
    correo: "",
    telefono: "",
    estado: "ACTIVO",
    tipo_documento: "CC",
    numero_documento: "",
    fecha_nacimiento: "",
    genero: "",
    nacionalidad: "",
    pais_residencia: "",
    ciudad_residencia: "",
    direccion: "",
    especialidad: "",
    experiencia_anios: "",
    certificaciones: "",
    foto_url: "",
    disponibilidad: true,
    activo: true,
    biografia: "",
    idiomas: [],
    certificaciones_puente: [],
};

export const mockGuias = [
    {
        id_guia: 1,
        id_usuario: 1,
        firstName: "Carlos",
        lastName: "Muñoz",
        correo: "carlos.g@artetours.com",
        telefono: "+57 300 111 2222",
        estado: "ACTIVO",
        tipo_documento: "CC",
        numero_documento: "1234567890",
        fecha_nacimiento: "1988-05-15",
        genero: "MASCULINO",
        nacionalidad: "Colombiano",
        pais_residencia: "Colombia",
        ciudad_residencia: "Medellín",
        direccion: "Carrera 70 #1-100, El Poblado",
        especialidad: "Historia y Cultura Urbana de Medellín",
        experiencia_anios: 5,
        certificaciones: "Guía Oficial de Turismo, First Aid",
        foto_url: "https://randomuser.me/api/portraits/men/1.jpg",
        disponibilidad: true,
        activo: true,
        biografia: "Guía turístico con 5 años de experiencia en recorridos históricos y culturales por Medellín. Apasionado por la transformación social de la ciudad.",
        idiomas: [
            { id_idioma: 1, nivel: "NATIVO" },
            { id_idioma: 2, nivel: "AVANZADO" },
        ],
        certificaciones_puente: [
            { id_certificacion: 1, fecha_obtencion: "2019-03-10", fecha_vencimiento: "2029-03-10", numero_certificado: "GT-001-2019" },
        ],
        toursCount: 156,
        rating: 4.9,
        joinedAt: "2023-03-15",
    },
    {
        id_guia: 2,
        id_usuario: 2,
        firstName: "Luisa Fernanda",
        lastName: "Zuluaga",
        correo: "luisa.z@artetours.com",
        telefono: "+57 301 222 3333",
        estado: "ACTIVO",
        tipo_documento: "CC",
        numero_documento: "2345678901",
        fecha_nacimiento: "1992-08-22",
        genero: "FEMENINO",
        nacionalidad: "Colombiana",
        pais_residencia: "Colombia",
        ciudad_residencia: "Medellín",
        direccion: "Avenida El Poblado #10-20",
        especialidad: "Gastronomía local y mercados tradicionales",
        experiencia_anios: 4,
        certificaciones: "Guía Oficial de Turismo",
        foto_url: "https://randomuser.me/api/portraits/women/2.jpg",
        disponibilidad: true,
        activo: true,
        biografia: "Apasionada por la comida local y los mercados tradicionales. Conoce los mejores rincones gastronómicos de Medellín.",
        idiomas: [
            { id_idioma: 1, nivel: "NATIVO" },
        ],
        certificaciones_puente: [
            { id_certificacion: 1, fecha_obtencion: "2020-06-15", fecha_vencimiento: "2030-06-15", numero_certificado: "GT-045-2020" },
        ],
        toursCount: 138,
        rating: 4.8,
        joinedAt: "2023-04-20",
    },
    {
        id_guia: 3,
        id_usuario: 3,
        firstName: "Andrés Felipe",
        lastName: "Patiño",
        correo: "andres.p@artetours.com",
        telefono: "+57 302 333 4444",
        estado: "ACTIVO",
        tipo_documento: "CC",
        numero_documento: "3456789012",
        fecha_nacimiento: "1985-12-03",
        genero: "MASCULINO",
        nacionalidad: "Colombiano",
        pais_residencia: "Colombia",
        ciudad_residencia: "Medellín",
        direccion: "Calle 10 #50-30, Laureles",
        especialidad: "Historia política y arquitectónica",
        experiencia_anios: 8,
        certificaciones: "Guía Oficial, Interpretación del Patrimonio",
        foto_url: "https://randomuser.me/api/portraits/men/3.jpg",
        disponibilidad: true,
        activo: true,
        biografia: "Historiador de profesión con maestría en estudios urbanos. Especialista en la historia política y arquitectónica de Medellín.",
        idiomas: [
            { id_idioma: 1, nivel: "NATIVO" },
            { id_idioma: 2, nivel: "AVANZADO" },
            { id_idioma: 3, nivel: "INTERMEDIO" },
        ],
        certificaciones_puente: [
            { id_certificacion: 1, fecha_obtencion: "2016-02-01", fecha_vencimiento: "2026-02-01", numero_certificado: "GT-010-2016" },
            { id_certificacion: 5, fecha_obtencion: "2021-08-20", fecha_vencimiento: "", numero_certificado: "CPP-020-2021" },
        ],
        toursCount: 92,
        rating: 4.7,
        joinedAt: "2023-05-10",
    },
    {
        id_guia: 4,
        id_usuario: 4,
        firstName: "Daniela",
        lastName: "Torres",
        correo: "daniela.t@artetours.com",
        telefono: "+57 303 444 5555",
        estado: "INACTIVO",
        tipo_documento: "CC",
        numero_documento: "4567890123",
        fecha_nacimiento: "1998-04-18",
        genero: "FEMENINO",
        nacionalidad: "Colombiana",
        pais_residencia: "Colombia",
        ciudad_residencia: "Medellín",
        direccion: "Barrio Belén, Calle 22 #78-45",
        especialidad: "",
        experiencia_anios: 0,
        certificaciones: "",
        foto_url: "https://randomuser.me/api/portraits/women/4.jpg",
        disponibilidad: false,
        activo: false,
        biografia: "En proceso de formación y certificación como guía turístico.",
        idiomas: [
            { id_idioma: 1, nivel: "NATIVO" },
        ],
        certificaciones_puente: [],
        toursCount: 45,
        rating: 4.6,
        joinedAt: "2023-06-01",
    },
    {
        id_guia: 5,
        id_usuario: 5,
        firstName: "José",
        lastName: "Gutiérrez",
        correo: "jose.g@artetours.com",
        telefono: "+57 304 555 6666",
        estado: "ACTIVO",
        tipo_documento: "CC",
        numero_documento: "5678901234",
        fecha_nacimiento: "1978-11-30",
        genero: "MASCULINO",
        nacionalidad: "Colombiano",
        pais_residencia: "Colombia",
        ciudad_residencia: "Medellín",
        direccion: "Comuna 13, Calle 65B #45-12",
        especialidad: "Historia local y transformación social de la Comuna 13",
        experiencia_anios: 12,
        certificaciones: "Guía Oficial, First Aid, Licencia Comercial",
        foto_url: "https://randomuser.me/api/portraits/men/5.jpg",
        disponibilidad: true,
        activo: true,
        biografia: "El guía más experimentado del equipo. Nacido y criado en la Comuna 13, conoce de primera mano la historia de transformación de su barrio.",
        idiomas: [
            { id_idioma: 1, nivel: "NATIVO" },
            { id_idioma: 2, nivel: "AVANZADO" },
        ],
        certificaciones_puente: [
            { id_certificacion: 1, fecha_obtencion: "2012-01-15", fecha_vencimiento: "2032-01-15", numero_certificado: "GT-002-2012" },
            { id_certificacion: 2, fecha_obtencion: "2018-05-01", fecha_vencimiento: "2028-05-01", numero_certificado: "FA-100-2018" },
            { id_certificacion: 3, fecha_obtencion: "2015-09-20", fecha_vencimiento: "2025-09-20", numero_certificado: "LC-050-2015" },
        ],
        toursCount: 201,
        rating: 4.9,
        joinedAt: "2023-01-12",
    },
];

let localMockGuias = JSON.parse(JSON.stringify(mockGuias));

function obtenerNextId() {
    return localMockGuias.reduce((max, g) => Math.max(max, g.id_guia ?? 0, g.id_usuario ?? 0), 0) + 1;
}

export const guideServices = {
    getGuias() {
        return JSON.parse(JSON.stringify(localMockGuias));
    },

    getGuiaById(id) {
        const guia = localMockGuias.find((g) => g.id_guia === id || g.id_usuario === id);
        return guia ? JSON.parse(JSON.stringify(guia)) : null;
    },

    createGuia(payload) {
        const nuevoId = obtenerNextId();
        const {
            firstName,
            lastName,
            correo,
            telefono,
            estado,
            tipo_documento,
            numero_documento,
            fecha_nacimiento,
            genero,
            nacionalidad,
            pais_residencia,
            ciudad_residencia,
            direccion,
            especialidad,
            experiencia_anios,
            certificaciones,
            foto_url,
            disponibilidad,
            activo,
            biografia,
            idiomas = [],
            certificaciones_puente = [],
        } = payload;

        const nuevoGuia = {
            id_guia: nuevoId,
            id_usuario: nuevoId,
            firstName,
            lastName,
            correo,
            telefono,
            estado,
            tipo_documento,
            numero_documento,
            fecha_nacimiento: fecha_nacimiento || null,
            genero: genero || null,
            nacionalidad: nacionalidad || null,
            pais_residencia: pais_residencia || null,
            ciudad_residencia: ciudad_residencia || null,
            direccion: direccion || null,
            especialidad: especialidad || null,
            experiencia_anios: experiencia_anios ?? null,
            certificaciones: certificaciones || null,
            foto_url: foto_url || null,
            disponibilidad: Boolean(disponibilidad),
            activo: Boolean(activo),
            biografia: biografia || null,
            idiomas: JSON.parse(JSON.stringify(idiomas)),
            certificaciones_puente: JSON.parse(JSON.stringify(certificaciones_puente)),
            toursCount: 0,
            rating: 0,
            joinedAt: new Date().toISOString().split("T")[0],
        };

        localMockGuias.push(nuevoGuia);
        return JSON.parse(JSON.stringify(nuevoGuia));
    },

    updateGuia(id, payload) {
        const idx = localMockGuias.findIndex((g) => g.id_guia === id || g.id_usuario === id);
        if (idx === -1) return null;

        const actual = localMockGuias[idx];
        const actualizado = {
            ...actual,
            ...payload,
            idiomas: payload.idiomas !== undefined ? JSON.parse(JSON.stringify(payload.idiomas)) : actual.idiomas,
            certificaciones_puente: payload.certificaciones_puente !== undefined
                ? JSON.parse(JSON.stringify(payload.certificaciones_puente))
                : actual.certificaciones_puente,
            disponibilidad: payload.disponibilidad !== undefined ? Boolean(payload.disponibilidad) : actual.disponibilidad,
            activo: payload.activo !== undefined ? Boolean(payload.activo) : actual.activo,
        };
        localMockGuias[idx] = actualizado;
        return JSON.parse(JSON.stringify(actualizado));
    },

    deleteGuia(id) {
        const idx = localMockGuias.findIndex((g) => g.id_guia === id || g.id_usuario === id);
        if (idx === -1) return false;
        localMockGuias[idx].idiomas = [];
        localMockGuias[idx].certificaciones_puente = [];
        localMockGuias.splice(idx, 1);
        return true;
    },

    computeStats(guides, filteredCount) {
        return {
            total: guides.length,
            disponibles: guides.filter((g) => g.disponibilidad === true && g.activo === true).length,
            ocupados: guides.filter((g) => g.disponibilidad === false && g.activo === true).length,
            inactivos: guides.filter((g) => g.activo === false).length,
            avgRating: guides.length > 0
                ? (guides.reduce((sum, g) => sum + (g.rating ?? 0), 0) / guides.length).toFixed(1)
                : "0.0",
            filtered: filteredCount ?? guides.length,
        };
    },

    stars(rating) {
        return { filled: Math.round(rating ?? 0), empty: 5 - Math.round(rating ?? 0) };
    },

    exportCSV(guides) {
        const headers = [
            "ID",
            "Nombre",
            "Apellido",
            "Email",
            "Teléfono",
            "Estado Usuario",
            "Tipo Documento",
            "Número Documento",
            "Disponible",
            "Activo",
            "Especialidad",
            "Tours",
            "Rating",
            "Idiomas",
            "Fecha Ingreso",
        ];
        const csv = [
            headers.join(","),
            ...guides.map((g) => {
                const idiomasStr = (g.idiomas ?? [])
                    .map((i) => {
                        const nombreIdioma = IDIOMA_OPTIONS.find((opt) => opt.value === i.id_idioma)?.label ?? i.id_idioma;
                        return `${nombreIdioma} (${i.nivel ?? ""})`;
                    })
                    .join("; ");
                return [
                    g.id_guia,
                    `"${g.firstName ?? ""}"`,
                    `"${g.lastName ?? ""}"`,
                    g.correo ?? "",
                    g.telefono ?? "",
                    g.estado ?? "",
                    g.tipo_documento ?? "",
                    g.numero_documento ?? "",
                    g.disponibilidad ? "SI" : "NO",
                    g.activo ? "SI" : "NO",
                    `"${g.especialidad ?? ""}"`,
                    g.toursCount ?? 0,
                    g.rating ?? 0,
                    `"${idiomasStr}"`,
                    g.joinedAt ?? "",
                ].join(",");
            }),
        ].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `guias-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
    },
};

export const mockGuides = mockGuias;
export const GUIDE_STATUS_OPTIONS = [
    { value: "all", label: "Todos los estados" },
    { value: "ACTIVO", label: "Disponibles" },
    { value: "INACTIVO", label: "Inactivos" },
    { value: "BLOQUEADO", label: "Bloqueados" },
];
export const GUIDE_LANGUAGE_OPTIONS = IDIOMA_OPTIONS.map((o) => ({ value: o.label, label: o.label }));
export const GUIDE_SPECIALTY_OPTIONS = [
    { value: "Comuna 13", label: "Comuna 13" },
    { value: "Food Tour", label: "Food Tour" },
    { value: "City Tour", label: "City Tour" },
    { value: "Histórico", label: "Histórico" },
    { value: "Pablo Escobar", label: "Pablo Escobar" },
    { value: "Arte Urbano", label: "Arte Urbano" },
    { value: "Naturaleza", label: "Naturaleza" },
    { value: "Aventura", label: "Aventura" },
];

Object.assign(guideServices, {
    async getGuias() { return (await apiRequest("/guias")).guias ?? []; },
    async getGuiaById(id) { return (await apiRequest(`/guias/${id}`)).guia; },
    async createGuia(payload) { return (await apiRequest("/guias", { method: "POST", body: JSON.stringify(payload) })).guia; },
    async updateGuia(id, payload) { return (await apiRequest(`/guias/${id}`, { method: "PUT", body: JSON.stringify(payload) })).guia; },
    async deleteGuia(id) { await apiRequest(`/guias/${id}`, { method: "DELETE" }); return true; },
});
