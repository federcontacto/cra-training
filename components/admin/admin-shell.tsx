'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Building2, Dumbbell, Clock, CreditCard, LogOut, Zap } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin/sedes', label: 'Sedes', icon: Building2 },
  { href: '/admin/clases', label: 'Clases', icon: Dumbbell },
  { href: '/admin/horarios', label: 'Horarios', icon: Clock },
  { href: '/admin/planes', label: 'Planes', icon: CreditCard },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/admin/login');
      } else {
        setEmail(session.user.email || '');
        setLoading(false);
      }
    });
  }, [isLoginPage]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/admin/login');
  };

  if (isLoginPage) return <>{children}</>;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cra-dark">
        <Zap className="w-8 h-8 text-cra-green animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-cra-dark">
      <aside className="w-64 border-r border-white/[0.06] flex flex-col shrink-0">
        <div className="p-6 border-b border-white/[0.06]">
          <Link href="/admin/sedes" className="font-bebas text-xl tracking-[3px]">
            <span className="text-cra-green">C.R.A</span> ADMIN
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded text-sm font-medium transition-colors ${
                  active
                    ? 'bg-cra-green/10 text-cra-green'
                    : 'text-cra-gray hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/[0.06]">
          <div className="text-xs text-cra-gray truncate mb-2 px-2">{email}</div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-cra-gray hover:text-red-400 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
