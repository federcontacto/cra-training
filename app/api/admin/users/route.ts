import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { createServerSupabase } from '@/lib/supabase-server';

// Verifica que el request venga de un usuario autenticado
async function requireAuth() {
  const supabase = createServerSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('No autorizado');
}

// GET /api/admin/users — lista todos los usuarios
export async function GET() {
  try {
    await requireAuth();
    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.listUsers();
    if (error) throw error;
    return NextResponse.json({ users: data.users });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

// POST /api/admin/users — crea un nuevo usuario
export async function POST(req: NextRequest) {
  try {
    await requireAuth();
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 });
    }
    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) throw error;
    return NextResponse.json({ user: data.user });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

// DELETE /api/admin/users — elimina un usuario por id
export async function DELETE(req: NextRequest) {
  try {
    await requireAuth();
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

// PATCH /api/admin/users — cambia contraseña de un usuario
export async function PATCH(req: NextRequest) {
  try {
    await requireAuth();
    const { id, password } = await req.json();
    if (!id || !password) {
      return NextResponse.json({ error: 'ID y contraseña requeridos' }, { status: 400 });
    }
    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.updateUserById(id, { password });
    if (error) throw error;
    return NextResponse.json({ user: data.user });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
