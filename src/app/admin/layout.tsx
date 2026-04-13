'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { token, admin, logout, isAuthenticated } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        if (!isAuthenticated() && pathname !== '/admin/login') {
            router.push('/admin/login');
        }
    }, [token]);

    if (pathname === '/admin/login') return <>{children}</>;

    if (!isAuthenticated()) return null;

    const handleLogout = async () => {
        try { await api.post('/admin/logout'); } catch { }
        logout();
        router.push('/admin/login');
    };

    const navItems = [
        { label: 'Dashboard', href: '/admin/dashboard', icon: '◈' },
        { label: 'Desain', href: '/admin/designs', icon: '✦' },
        { label: 'Kategori', href: '/admin/categories', icon: '❋' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0604' }}>

            <style>{`
        @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
      `}</style>

            {/* SIDEBAR */}
            <aside style={{
                width: sidebarOpen ? '240px' : '64px',
                background: 'rgba(255,255,255,0.02)',
                borderRight: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', flexDirection: 'column',
                transition: 'width 0.3s ease',
                overflow: 'hidden', flexShrink: 0,
            }}>

                {/* Logo */}
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center',
                    gap: '12px', minHeight: '64px',
                }}>
                    <div style={{
                        width: '32px', height: '32px', flexShrink: 0,
                        background: 'linear-gradient(135deg, #C9956C, #B87355)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '14px', color: 'white',
                    }}>✦</div>
                    {sidebarOpen && (
                        <span style={{
                            fontFamily: 'Cormorant Garamond, serif',
                            fontSize: '18px', color: '#FDFAF7',
                            whiteSpace: 'nowrap',
                        }}>
                            Undangan<span style={{ color: '#C9956C' }}>Id</span>
                        </span>
                    )}
                </div>

                {/* Nav Items */}
                <nav style={{ flex: 1, padding: '1rem 0' }}>
                    {navItems.map(item => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center',
                                    gap: '12px', padding: '12px 1.5rem',
                                    background: isActive ? 'rgba(201,149,108,0.1)' : 'transparent',
                                    borderRight: isActive ? '2px solid #C9956C' : '2px solid transparent',
                                    transition: 'all 0.2s', cursor: 'pointer',
                                }}
                                    onMouseEnter={e => {
                                        if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                    }}
                                    onMouseLeave={e => {
                                        if (!isActive) e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    <span style={{
                                        fontSize: '16px',
                                        color: isActive ? '#C9956C' : 'rgba(253,250,247,0.4)',
                                        flexShrink: 0, width: '20px', textAlign: 'center',
                                        fontFamily: 'Cormorant Garamond, serif',
                                    }}>{item.icon}</span>
                                    {sidebarOpen && (
                                        <span style={{
                                            fontFamily: 'DM Sans, sans-serif',
                                            fontSize: '13px', fontWeight: isActive ? 500 : 300,
                                            color: isActive ? '#FDFAF7' : 'rgba(253,250,247,0.4)',
                                            whiteSpace: 'nowrap',
                                        }}>{item.label}</span>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* User + Logout */}
                <div style={{
                    padding: '1rem 1.5rem',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                }}>
                    {sidebarOpen && (
                        <div style={{ marginBottom: '12px' }}>
                            <div style={{
                                fontFamily: 'DM Sans, sans-serif',
                                fontSize: '13px', color: '#FDFAF7', fontWeight: 500,
                            }}>{admin?.name}</div>
                            <div style={{
                                fontFamily: 'DM Sans, sans-serif',
                                fontSize: '11px', color: 'rgba(253,250,247,0.3)',
                                marginTop: '2px',
                            }}>{admin?.email}</div>
                        </div>
                    )}
                    <button onClick={handleLogout} style={{
                        width: '100%',
                        background: 'rgba(239,68,68,0.08)',
                        border: '1px solid rgba(239,68,68,0.2)',
                        color: '#f87171', padding: '8px',
                        borderRadius: '10px', fontSize: '12px',
                        fontFamily: 'DM Sans, sans-serif',
                        cursor: 'pointer', transition: 'all 0.2s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                    >
                        {sidebarOpen ? 'Logout' : '✕'}
                    </button>
                </div>
            </aside>

            {/* MAIN */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                {/* TOPBAR */}
                <header style={{
                    height: '64px', padding: '0 2rem',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(255,255,255,0.01)',
                }}>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: 'rgba(253,250,247,0.6)',
                            width: '36px', height: '36px',
                            borderRadius: '10px', cursor: 'pointer',
                            fontSize: '14px', fontFamily: 'DM Sans, sans-serif',
                        }}>☰</button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Link href="/" target="_blank" style={{ textDecoration: 'none' }}>
                            <div style={{
                                fontFamily: 'DM Sans, sans-serif', fontSize: '12px',
                                color: 'rgba(253,250,247,0.4)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                padding: '6px 14px', borderRadius: '100px', cursor: 'pointer',
                            }}>Lihat Website ↗</div>
                        </Link>
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <main style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}