export interface Sede {
  id: string;
  nombre: string;
  direccion: string;
  piso: string | null;
  whatsapp: string;
  google_maps_url: string | null;
  lat: number | null;
  lng: number | null;
  activa: boolean;
  orden: number;
  created_at: string;
  updated_at: string;
}

export interface Clase {
  id: string;
  sede_id: string;
  nombre: string;
  descripcion: string | null;
  tag: string | null;
  color: string;
  activa: boolean;
  orden: number;
  created_at: string;
  updated_at: string;
  // joined
  sede?: Sede;
  horarios?: Horario[];
}

export interface Horario {
  id: string;
  clase_id: string;
  dia_semana: number; // 0-6
  hora_inicio: string; // "07:00:00"
  hora_fin: string;
  cupo_max: number | null;
  activo: boolean;
  created_at: string;
  // joined
  clase?: Clase;
}

export interface Plan {
  id: string;
  sede_id: string;
  nombre: string;
  precio: number;
  moneda: string;
  frecuencia: string;
  descripcion: string | null;
  features: string[];
  destacado: boolean;
  activo: boolean;
  orden: number;
  created_at: string;
  updated_at: string;
  // joined
  sede?: Sede;
}

export const DIAS_SEMANA = [
  'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
] as const;

export const DIAS_CORTOS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'] as const;
