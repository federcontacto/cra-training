'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import type { Clase, Sede } from '@/lib/types';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';

const EMPTY: Partial<Clase> = {
  sede_id: '',
  nombre: '',
  descripcion: '',
  tag: '',
  color: '#a3d44a',
  activa: true,
  orden: 0,
};

export default function ClasesPage() {
  const supabase = createClient();
  const [clases, setClases] = useState<(Clase & { sede?: Sede })[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [editing, setEditing] = useState<Partial<Clase> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterSede, setFilterSede] = useState<string>('');

  const fetchData = async () => {
    const [clasesRes, sedesRes] = await Promise.all([
      supabase.from('clases').select('*, sede:sedes(id, nombre)').order('orden'),
      supabase.from('sedes').select('*').order('orden'),
    ]);
    setClases((clasesRes.data as any[]) || []);
    setSedes((sedesRes.data as Sede[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = filterSede ? clases.filter((c) => c.sede_id === filterSede) : clases;

  const handleSave = async () => {
    if (!editing?.nombre || !editing?.sede_id) return;

    const payload = {
      sede_id: editing.sede_id,
      nombre: editing.nombre,
      descripcion: editing.descripcion || null,
      tag: editing.tag || null,
      color: editing.color || '#a3d44a',
      activa: editing.activa ?? true,
      orden: editing.orden ?? 0,
    };

    if (isNew) {
      await supabase.from('clases').insert(payload);
    } else {
      await supabase.from('clases').update(payload).eq('id', editing.id);
    }
    setEditing(null);
    setIsNew(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta clase? Se borrarán también sus horarios.')) return;
    await supabase.from('clases').delete().eq('id', id);
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-bebas text-3xl tracking-wider">CLASES</h1>
          <p className="text-sm text-cra-gray">Administrá las clases de cada sede</p>
        </div>
        <button
          onClick={() => { setEditing({ ...EMPTY, sede_id: filterSede || sedes[0]?.id || '' }); setIsNew(true); }}
          className="admin-btn flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Nueva clase
        </button>
      </div>

      {/* Sede filter */}
      {sedes.length > 1 && (
        <div className="mb-6">
          <select value={filterSede} onChange={(e) => setFilterSede(e.target.value)}
            className="admin-input w-auto">
            <option value="">Todas las sedes</option>
            {sedes.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
          </select>
        </div>
      )}

      {/* Form */}
      {editing && (
        <div className="admin-card mb-6 border-cra-green/30">
          <h3 className="font-barlow-condensed font-bold text-sm tracking-wider uppercase text-cra-green mb-4">
            {isNew ? 'Nueva clase' : 'Editar clase'}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Sede *</label>
              <select className="admin-input" value={editing.sede_id || ''}
                onChange={(e) => setEditing({ ...editing, sede_id: e.target.value })}>
                <option value="">Seleccionar sede</option>
                {sedes.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="admin-label">Nombre *</label>
              <input className="admin-input" value={editing.nombre || ''} placeholder="CrossFit — Turno Mañana"
                onChange={(e) => setEditing({ ...editing, nombre: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="admin-label">Descripción</label>
              <textarea className="admin-input h-20 resize-none" value={editing.descripcion || ''}
                placeholder="Descripción breve de la clase..."
                onChange={(e) => setEditing({ ...editing, descripcion: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Tag (días)</label>
              <input className="admin-input" value={editing.tag || ''} placeholder="Lunes a Viernes"
                onChange={(e) => setEditing({ ...editing, tag: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Orden</label>
              <input className="admin-input" type="number" value={editing.orden ?? 0}
                onChange={(e) => setEditing({ ...editing, orden: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="clase-activa" checked={editing.activa ?? true}
                onChange={(e) => setEditing({ ...editing, activa: e.target.checked })}
                className="accent-cra-green" />
              <label htmlFor="clase-activa" className="text-sm text-cra-gray">Clase activa</label>
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
        <div className="text-center text-cra-gray py-12">No hay clases cargadas.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((clase) => (
            <div key={clase.id} className="admin-card flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-barlow-condensed font-bold tracking-wider uppercase">{clase.nombre}</h3>
                  {clase.tag && (
                    <span className="text-[0.6rem] bg-cra-green/10 text-cra-green px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                      {clase.tag}
                    </span>
                  )}
                  {!clase.activa && (
                    <span className="text-[0.6rem] bg-red-500/20 text-red-400 px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                      Inactiva
                    </span>
                  )}
                </div>
                <p className="text-sm text-cra-gray mt-0.5">
                  {(clase as any).sede?.nombre} — {clase.descripcion || 'Sin descripción'}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => { setEditing({ ...clase }); setIsNew(false); }}
                  className="p-2 text-cra-gray hover:text-cra-green transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(clase.id)}
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
