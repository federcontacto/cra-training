'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import type { Plan, Sede } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { Plus, Pencil, Trash2, Save, X, Star } from 'lucide-react';

const EMPTY: Partial<Plan> & { featuresText?: string } = {
  sede_id: '',
  nombre: '',
  precio: 0,
  moneda: 'ARS',
  frecuencia: 'mensual',
  descripcion: '',
  features: [],
  destacado: false,
  activo: true,
  orden: 0,
  featuresText: '',
};

export default function PlanesPage() {
  const supabase = createClient();
  const [planes, setPlanes] = useState<(Plan & { sede?: Sede })[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [editing, setEditing] = useState<(Partial<Plan> & { featuresText?: string }) | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [planesRes, sedesRes] = await Promise.all([
      supabase.from('planes').select('*, sede:sedes(id, nombre)').order('orden'),
      supabase.from('sedes').select('*').order('orden'),
    ]);
    setPlanes((planesRes.data as any[]) || []);
    setSedes((sedesRes.data as Sede[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const startEdit = (plan: Plan) => {
    setEditing({
      ...plan,
      featuresText: (plan.features as string[]).join('\n'),
    });
    setIsNew(false);
  };

  const handleSave = async () => {
    if (!editing?.nombre || !editing?.sede_id || !editing.precio) return;

    const features = (editing.featuresText || '')
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const payload = {
      sede_id: editing.sede_id,
      nombre: editing.nombre,
      precio: editing.precio,
      moneda: editing.moneda || 'ARS',
      frecuencia: editing.frecuencia || 'mensual',
      descripcion: editing.descripcion || null,
      features: features,
      destacado: editing.destacado ?? false,
      activo: editing.activo ?? true,
      orden: editing.orden ?? 0,
    };

    if (isNew) {
      await supabase.from('planes').insert(payload);
    } else {
      await supabase.from('planes').update(payload).eq('id', editing.id);
    }
    setEditing(null);
    setIsNew(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este plan?')) return;
    await supabase.from('planes').delete().eq('id', id);
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-bebas text-3xl tracking-wider">PLANES</h1>
          <p className="text-sm text-cra-gray">Administrá los planes y precios</p>
        </div>
        <button
          onClick={() => { setEditing({ ...EMPTY, sede_id: sedes[0]?.id || '' }); setIsNew(true); }}
          className="admin-btn flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Nuevo plan
        </button>
      </div>

      {/* Form */}
      {editing && (
        <div className="admin-card mb-6 border-cra-green/30">
          <h3 className="font-barlow-condensed font-bold text-sm tracking-wider uppercase text-cra-green mb-4">
            {isNew ? 'Nuevo plan' : 'Editar plan'}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="admin-label">Sede *</label>
              <select className="admin-input" value={editing.sede_id || ''}
                onChange={(e) => setEditing({ ...editing, sede_id: e.target.value })}>
                <option value="">Seleccionar</option>
                {sedes.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="admin-label">Nombre *</label>
              <input className="admin-input" value={editing.nombre || ''} placeholder="Plan Full"
                onChange={(e) => setEditing({ ...editing, nombre: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Precio *</label>
              <input className="admin-input" type="number" value={editing.precio ?? 0}
                onChange={(e) => setEditing({ ...editing, precio: parseFloat(e.target.value) || 0 })} />
            </div>
            <div>
              <label className="admin-label">Moneda</label>
              <select className="admin-input" value={editing.moneda || 'ARS'}
                onChange={(e) => setEditing({ ...editing, moneda: e.target.value })}>
                <option value="ARS">ARS</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div>
              <label className="admin-label">Frecuencia</label>
              <select className="admin-input" value={editing.frecuencia || 'mensual'}
                onChange={(e) => setEditing({ ...editing, frecuencia: e.target.value })}>
                <option value="mensual">Mensual</option>
                <option value="por clase">Por clase</option>
                <option value="trimestral">Trimestral</option>
                <option value="semestral">Semestral</option>
                <option value="anual">Anual</option>
              </select>
            </div>
            <div>
              <label className="admin-label">Descripción corta</label>
              <input className="admin-input" value={editing.descripcion || ''} placeholder="Acceso ilimitado"
                onChange={(e) => setEditing({ ...editing, descripcion: e.target.value })} />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="admin-label">Features (una por línea)</label>
              <textarea className="admin-input h-28 resize-none font-mono text-xs"
                value={editing.featuresText || ''}
                placeholder={"Acceso a clases de CrossFit\nOpen Box incluido\nSeguimiento de progreso"}
                onChange={(e) => setEditing({ ...editing, featuresText: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Orden</label>
              <input className="admin-input" type="number" value={editing.orden ?? 0}
                onChange={(e) => setEditing({ ...editing, orden: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-cra-gray">
                <input type="checkbox" checked={editing.destacado ?? false}
                  onChange={(e) => setEditing({ ...editing, destacado: e.target.checked })}
                  className="accent-cra-green" />
                Destacado
              </label>
              <label className="flex items-center gap-2 text-sm text-cra-gray">
                <input type="checkbox" checked={editing.activo ?? true}
                  onChange={(e) => setEditing({ ...editing, activo: e.target.checked })}
                  className="accent-cra-green" />
                Activo
              </label>
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
      ) : planes.length === 0 ? (
        <div className="text-center text-cra-gray py-12">No hay planes cargados.</div>
      ) : (
        <div className="space-y-3">
          {planes.map((plan) => (
            <div key={plan.id} className={`admin-card flex items-center justify-between ${plan.destacado ? 'border-cra-green/30' : ''}`}>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  {plan.destacado && <Star className="w-4 h-4 text-cra-green fill-cra-green" />}
                  <h3 className="font-barlow-condensed font-bold tracking-wider uppercase">{plan.nombre}</h3>
                  <span className="font-bebas text-xl text-cra-green">{formatPrice(plan.precio, plan.moneda)}</span>
                  <span className="text-xs text-cra-gray">/ {plan.frecuencia}</span>
                  {!plan.activo && (
                    <span className="text-[0.6rem] bg-red-500/20 text-red-400 px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                      Inactivo
                    </span>
                  )}
                </div>
                <p className="text-sm text-cra-gray mt-0.5">
                  {(plan as any).sede?.nombre} — {plan.descripcion || 'Sin descripción'}
                  {' — '}{(plan.features as string[]).length} features
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(plan)}
                  className="p-2 text-cra-gray hover:text-cra-green transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(plan.id)}
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
