'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import type { Sede } from '@/lib/types';
import { Plus, Pencil, Trash2, Save, X, MessageCircle } from 'lucide-react';

const EMPTY_SEDE: Partial<Sede> = {
  nombre: '',
  direccion: '',
  piso: '',
  whatsapp: '',
  google_maps_url: '',
  activa: true,
  orden: 0,
};

export default function SedesPage() {
  const supabase = createClient();
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [editing, setEditing] = useState<Partial<Sede> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSedes = async () => {
    const { data } = await supabase.from('sedes').select('*').order('orden');
    setSedes((data as Sede[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchSedes(); }, []);

  const handleSave = async () => {
    if (!editing?.nombre || !editing?.direccion || !editing?.whatsapp) return;

    if (isNew) {
      await supabase.from('sedes').insert({
        nombre: editing.nombre,
        direccion: editing.direccion,
        piso: editing.piso || null,
        whatsapp: editing.whatsapp,
        google_maps_url: editing.google_maps_url || null,
        activa: editing.activa ?? true,
        orden: editing.orden ?? 0,
      });
    } else {
      await supabase.from('sedes').update({
        nombre: editing.nombre,
        direccion: editing.direccion,
        piso: editing.piso || null,
        whatsapp: editing.whatsapp,
        google_maps_url: editing.google_maps_url || null,
        activa: editing.activa,
        orden: editing.orden,
      }).eq('id', editing.id);
    }

    setEditing(null);
    setIsNew(false);
    fetchSedes();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta sede? Se borrarán también sus clases, horarios y planes.')) return;
    await supabase.from('sedes').delete().eq('id', id);
    fetchSedes();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-bebas text-3xl tracking-wider">SEDES</h1>
          <p className="text-sm text-cra-gray">Administrá las sedes de C.R.A Training</p>
        </div>
        <button
          onClick={() => { setEditing({ ...EMPTY_SEDE }); setIsNew(true); }}
          className="admin-btn flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Nueva sede
        </button>
      </div>

      {/* Edit / Create Form */}
      {editing && (
        <div className="admin-card mb-6 border-cra-green/30">
          <h3 className="font-barlow-condensed font-bold text-sm tracking-wider uppercase text-cra-green mb-4">
            {isNew ? 'Nueva sede' : 'Editar sede'}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Nombre *</label>
              <input className="admin-input" value={editing.nombre || ''} placeholder="CRA Almagro"
                onChange={(e) => setEditing({ ...editing, nombre: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Dirección *</label>
              <input className="admin-input" value={editing.direccion || ''} placeholder="Av. Corrientes 6131"
                onChange={(e) => setEditing({ ...editing, direccion: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Piso / Dpto</label>
              <input className="admin-input" value={editing.piso || ''} placeholder="2do Piso"
                onChange={(e) => setEditing({ ...editing, piso: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">WhatsApp *</label>
              <input className="admin-input" value={editing.whatsapp || ''} placeholder="5491100000000"
                onChange={(e) => setEditing({ ...editing, whatsapp: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Google Maps URL</label>
              <input className="admin-input" value={editing.google_maps_url || ''} placeholder="https://maps.google.com/..."
                onChange={(e) => setEditing({ ...editing, google_maps_url: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Orden</label>
              <input className="admin-input" type="number" value={editing.orden ?? 0}
                onChange={(e) => setEditing({ ...editing, orden: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <input type="checkbox" id="activa" checked={editing.activa ?? true}
                onChange={(e) => setEditing({ ...editing, activa: e.target.checked })}
                className="accent-cra-green" />
              <label htmlFor="activa" className="text-sm text-cra-gray">Sede activa</label>
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

      {/* Table */}
      {loading ? (
        <div className="text-cra-gray text-sm">Cargando...</div>
      ) : sedes.length === 0 ? (
        <div className="text-center text-cra-gray py-12">
          No hay sedes cargadas. Creá la primera.
        </div>
      ) : (
        <div className="space-y-3">
          {sedes.map((sede) => (
            <div key={sede.id} className="admin-card flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-barlow-condensed font-bold tracking-wider uppercase">{sede.nombre}</h3>
                  {!sede.activa && (
                    <span className="text-[0.6rem] bg-red-500/20 text-red-400 px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                      Inactiva
                    </span>
                  )}
                </div>
                <p className="text-sm text-cra-gray mt-0.5">
                  {sede.direccion}{sede.piso ? `, ${sede.piso}` : ''}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <MessageCircle className="w-3.5 h-3.5 text-cra-green" />
                  <span className="text-sm font-mono text-cra-green">+{sede.whatsapp}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => { setEditing({ ...sede }); setIsNew(false); }}
                  className="p-2 text-cra-gray hover:text-cra-green transition-colors" title="Editar">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(sede.id)}
                  className="p-2 text-cra-gray hover:text-red-400 transition-colors" title="Eliminar">
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
