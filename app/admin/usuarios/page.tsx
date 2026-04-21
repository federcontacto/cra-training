'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { Plus, Trash2, Save, X, KeyRound, ShieldCheck, AlertCircle } from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [changingPwd, setChangingPwd] = useState<string | null>(null);
  const [newPwd, setNewPwd] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [noServiceKey, setNoServiceKey] = useState(false);

  const supabase = createClient();

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.error) {
        if (data.error.includes('SERVICE_ROLE') || data.error.includes('service_role')) {
          setNoServiceKey(true);
        } else {
          setError(data.error);
        }
      } else {
        setUsers(data.users || []);
      }
    } catch {
      setError('Error al cargar usuarios');
    }
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setCurrentUserId(data.session?.user?.id || '');
    });
    fetchUsers();
  }, []);

  const handleCreate = async () => {
    if (!newEmail || !newPassword) { setFormError('Completá email y contraseña'); return; }
    if (newPassword.length < 6) { setFormError('La contraseña debe tener al menos 6 caracteres'); return; }
    setSaving(true);
    setFormError('');
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newEmail, password: newPassword }),
    });
    const data = await res.json();
    if (data.error) {
      setFormError(data.error);
    } else {
      setShowForm(false);
      setNewEmail('');
      setNewPassword('');
      fetchUsers();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, email: string) => {
    if (id === currentUserId) {
      alert('No podés eliminar tu propia cuenta.');
      return;
    }
    if (!confirm(`¿Eliminar el usuario ${email}? Esta acción no se puede deshacer.`)) return;
    const res = await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (data.error) {
      alert('Error: ' + data.error);
    } else {
      fetchUsers();
    }
  };

  const handleChangePwd = async (id: string) => {
    if (!newPwd || newPwd.length < 6) { alert('Mínimo 6 caracteres'); return; }
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, password: newPwd }),
    });
    const data = await res.json();
    if (data.error) {
      alert('Error: ' + data.error);
    } else {
      setChangingPwd(null);
      setNewPwd('');
      alert('Contraseña actualizada ✓');
    }
  };

  const formatDate = (str?: string) => {
    if (!str) return '—';
    return new Date(str).toLocaleDateString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-bebas text-3xl tracking-wider">USUARIOS</h1>
          <p className="text-sm text-cra-gray">Administradores con acceso al panel</p>
        </div>
        {!noServiceKey && (
          <button
            onClick={() => { setShowForm(true); setFormError(''); }}
            className="admin-btn flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Nuevo usuario
          </button>
        )}
      </div>

      {/* Aviso sin service key */}
      {noServiceKey && (
        <div className="admin-card border-yellow-500/30 mb-6">
          <div className="flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-barlow-condensed font-bold text-sm tracking-wider uppercase text-yellow-400 mb-1">
                Falta configurar la Service Role Key
              </div>
              <p className="text-sm text-cra-gray mb-3">
                Para gestionar usuarios necesitás agregar la clave <code className="text-cra-green bg-white/[0.05] px-1.5 py-0.5 rounded text-xs">SUPABASE_SERVICE_ROLE_KEY</code> en el archivo <code className="text-cra-green bg-white/[0.05] px-1.5 py-0.5 rounded text-xs">.env.local</code>.
              </p>
              <ol className="text-sm text-cra-gray space-y-1 list-decimal list-inside">
                <li>Ir a <span className="text-white">Supabase Dashboard → Project Settings → API</span></li>
                <li>Copiar la clave <span className="text-white">service_role</span> (secret)</li>
                <li>Pegarla en <span className="text-white">.env.local</span> como <code className="text-cra-green">SUPABASE_SERVICE_ROLE_KEY=tu_clave</code></li>
                <li>Reiniciar el servidor</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Formulario nuevo usuario */}
      {showForm && (
        <div className="admin-card mb-6 border-cra-green/30">
          <h3 className="font-barlow-condensed font-bold text-sm tracking-wider uppercase text-cra-green mb-4">
            Nuevo administrador
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Email *</label>
              <input
                className="admin-input"
                type="email"
                value={newEmail}
                placeholder="admin@cratraining.com"
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="admin-label">Contraseña * (mín. 6 caracteres)</label>
              <input
                className="admin-input"
                type="password"
                value={newPassword}
                placeholder="••••••••"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
          {formError && (
            <div className="mt-3 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
              {formError}
            </div>
          )}
          <div className="flex gap-3 mt-5">
            <button onClick={handleCreate} disabled={saving} className="admin-btn flex items-center gap-2">
              <Save className="w-4 h-4" /> {saving ? 'Creando...' : 'Crear usuario'}
            </button>
            <button onClick={() => { setShowForm(false); setFormError(''); }}
              className="px-4 py-2 text-sm text-cra-gray hover:text-white transition-colors flex items-center gap-2">
              <X className="w-4 h-4" /> Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de usuarios */}
      {loading ? (
        <div className="text-cra-gray text-sm">Cargando...</div>
      ) : error ? (
        <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded px-3 py-2">{error}</div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="admin-card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <ShieldCheck className="w-4 h-4 text-cra-green shrink-0" />
                    <span className="font-barlow-condensed font-bold tracking-wider">{user.email}</span>
                    {user.id === currentUserId && (
                      <span className="text-[0.6rem] bg-cra-green/20 text-cra-green px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                        Vos
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-cra-gray mt-1 space-y-0.5 pl-7">
                    <div>Creado: {formatDate(user.created_at)}</div>
                    <div>Último acceso: {formatDate(user.last_sign_in_at)}</div>
                  </div>

                  {/* Cambiar contraseña inline */}
                  {changingPwd === user.id && (
                    <div className="flex gap-2 mt-3 pl-7">
                      <input
                        className="admin-input w-48 text-sm"
                        type="password"
                        value={newPwd}
                        placeholder="Nueva contraseña"
                        onChange={(e) => setNewPwd(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleChangePwd(user.id)}
                      />
                      <button onClick={() => handleChangePwd(user.id)} className="admin-btn text-xs py-1.5 px-3">
                        Guardar
                      </button>
                      <button onClick={() => { setChangingPwd(null); setNewPwd(''); }}
                        className="p-1.5 text-cra-gray hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {!noServiceKey && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => { setChangingPwd(changingPwd === user.id ? null : user.id); setNewPwd(''); }}
                      className="p-2 text-cra-gray hover:text-cra-green transition-colors"
                      title="Cambiar contraseña"
                    >
                      <KeyRound className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id, user.email)}
                      className="p-2 text-cra-gray hover:text-red-400 transition-colors"
                      title="Eliminar usuario"
                      disabled={user.id === currentUserId}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
