'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import type { Horario, Clase, Sede } from '@/lib/types';
import { DIAS_SEMANA } from '@/lib/types';
import { formatTime } from '@/lib/utils';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';

const EMPTY: Partial<Horario> = {
  clase_id: '',
  dia_semana: 1,
  hora_inicio: '07:00',
  hora_fin: '08:00',
  cupo_max: null,
  activo: true,
};

export default function HorariosPage() {
  const supabase = createClient();
  const [horarios, setHorarios] = useState<(Horario & { clase?: Clase & { sede?: Sede } })[]>([]);
  const [clases, setClases] = useState<(Clase & { sede?: Sede })[]>([]);
  const [editing, setEditing] = useState<Partial<Horario> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterClase, setFilterClase] = useState('');

  const fetchData = async () => {
    const [horariosRes, clasesRes] = await Promise.all([
      supabase.from('horarios').select('*, clase:clases(*, sede:sedes(id, nombre))').order('dia_semana').order('hora_inicio'),
      supabase.from('clases').select('*, sede:sedes(id, nombre)').order('orden'),
    ]);
    setHorarios((horariosRes.data as any[]) || []);
    setClases((clasesRes.data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = filterClase ? horarios.filter((h) => h.clase_id === filterClase) : horarios;

  const handleSave = async () => {
    if (!editing?.clase_id || editing.dia_semana === undefined || !editing.hora_inicio || !editing.hora_fin) return;

    const payload = {
      clase_id: editing.clase_id,
      dia_semana: editing.dia_semana,
      hora_inicio: editing.hora_inicio,
      hora_fin: editing.hora_fin,
      cupo_max: editing.cupo_max || null,
      activo: editing.activo ?? true,
    };

    if (isNew) {
      await supabase.from('horarios').insert(payload);
    } else {
      await supabase.from('horarios').update(payload).eq('id', editing.id);
    }
    setEditing(null);
    setIsNew(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este horario?')) return;
    await supabase.from('horarios').delete().eq('id', id);
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-bebas text-3xl tracking-wider">HORARIOS</h1>
          <p className="text-sm text-cra-gray">Configurá los horarios de cada clase</p>
        </div>
        <button
          onClick={() => { setEditing({ ...EMPTY, clase_id: filterClase || clases[0]?.id || '' }); setIsNew(true); }}
          className="admin-btn flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Nuevo horario
        </button>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <select value={filterClase} onChange={(e) => setFilterClase(e.target.value)} className="admin-input w-auto">
          <option value="">Todas las clases</option>
          {clases.map((c) => (
            <option key={c.id} value={c.id}>
              {(c as any).sede?.nombre} — {c.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Form */}
      {editing && (
        <div className="admin-card mb-6 border-cra-green/30">
          <h3 className="font-barlow-condensed font-bold text-sm tracking-wider uppercase text-cra-green mb-4">
            {isNew ? 'Nuevo horario' : 'Editar horario'}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="admin-label">Clase *</label>
              <select className="admin-input" value={editing.clase_id || ''}
                onChange={(e) => setEditing({ ...editing, clase_id: e.target.value })}>
                <option value="">Seleccionar</option>
                {clases.map((c) => (
                  <option key={c.id} value={c.id}>{(c as any).sede?.nombre} — {c.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="admin-label">Día *</label>
              <select className="admin-input" value={editing.dia_semana ?? 1}
                onChange={(e) => setEditing({ ...editing, dia_semana: parseInt(e.target.value) })}>
                {DIAS_SEMANA.map((dia, i) => <option key={i} value={i}>{dia}</option>)}
              </select>
            </div>
            <div>
              <label className="admin-label">Hora inicio *</label>
              <input className="admin-input" type="time" value={editing.hora_inicio || '07:00'}
                onChange={(e) => setEditing({ ...editing, hora_inicio: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Hora fin *</label>
              <input className="admin-input" type="time" value={editing.hora_fin || '08:00'}
                onChange={(e) => setEditing({ ...editing, hora_fin: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Cupo máximo</label>
              <input className="admin-input" type="number" value={editing.cupo_max ?? ''} placeholder="Sin límite"
                onChange={(e) => setEditing({ ...editing, cupo_max: e.target.value ? parseInt(e.target.value) : null })} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="horario-activo" checked={editing.activo ?? true}
                onChange={(e) => setEditing({ ...editing, activo: e.target.checked })}
                className="accent-cra-green" />
              <label htmlFor="horario-activo" className="text-sm text-cra-gray">Activo</label>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={handleSave} className="admin-btn flex items-center gap-2">
              <Save className="w-4 h-4" /> Guardar
            </button>
            <button onClick={() => { setEditing(null); setIsNew(false); }}
              className="px-4 py-2 text-sm text-cra-gray hover:text-white transition-colors flex items-center gap-2">
              <X className="w-4 h-4" /> Cancelar
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="text-cra-gray text-sm">Cargando...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-cra-gray py-12">No hay horarios cargados.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((h) => (
            <div key={h.id} className="admin-card flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-bebas text-xl text-cra-green">
                    {formatTime(h.hora_inicio)} — {formatTime(h.hora_fin)}
                  </span>
                  <span className="text-sm font-semibold">{DIAS_SEMANA[h.dia_semana]}</span>
                  {!h.activo && (
                    <span className="text-[0.6rem] bg-red-500/20 text-red-400 px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                      Inactivo
                    </span>
                  )}
                </div>
                <p className="text-sm text-cra-gray mt-0.5">
                  {(h.clase as any)?.sede?.nombre} — {h.clase?.nombre}
                  {h.cupo_max ? ` — Cupo: ${h.cupo_max}` : ''}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => { setEditing({ ...h }); setIsNew(false); }}
                  className="p-2 text-cra-gray hover:text-cra-green transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(h.id)}
                  className="p-2 text-cra-gray hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
