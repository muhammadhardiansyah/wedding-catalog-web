'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useWindowSize } from '@/hooks/useWindowSize';
import { ThemeToggle } from './ThemeToggle';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isMobile, isTablet } = useWindowSize();

    return (
        <nav style={{
            background: 'var(--background-secondary)',
            borderBottom: '1px solid var(--border-color)',
            position: 'sticky', top: 0, zIndex: 50,
            backdropFilter: 'blur(12px)',
        }}>
            <div style={{
                maxWidth: '1100px', margin: '0 auto',
                padding: '0 1.5rem', height: '64px',
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
            }}>

                {/* Logo */}
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '32px', height: '32px',
                        background: 'linear-gradient(135deg, #C9956C, #B87355)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: '14px',
                        fontFamily: 'Cormorant Garamond, serif',
                        boxShadow: '0 0 20px rgba(201,149,108,0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}>✦</div>
                    <span style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '20px', color: 'var(--foreground)', letterSpacing: '0.5px',
                        fontWeight: 400,
                    }}>
                        Undangan<span style={{ color: 'var(--accent-light)' }}>Id</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                {!isMobile && !isTablet && (
                    <div style={{ display: 'flex', gap: '28px', fontSize: '13px' }}>
                        {[
                            { label: 'Beranda', href: '/' },
                            { label: 'Katalog', href: '/katalog' },
                            { label: 'Kategori', href: '/kategori' },
                        ].map(item => (
                            <Link key={item.href} href={item.href} style={{
                                textDecoration: 'none', color: 'var(--text-muted)',
                                fontFamily: 'DM Sans, sans-serif', fontWeight: 300,
                                transition: 'color 0.2s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.color = '#C9956C'}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                            >{item.label}</Link>
                        ))}
                    </div>
                )}

                {/* Right Side */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ThemeToggle />
                    {!isMobile && (
                        <Link href="/katalog" style={{ textDecoration: 'none' }}>
                            <button style={{
                                background: 'linear-gradient(135deg, #C9956C, #B87355)',
                                color: 'white', border: 'none',
                                padding: '9px 22px', borderRadius: '100px',
                                fontSize: '13px', fontFamily: 'DM Sans, sans-serif',
                                fontWeight: 500, cursor: 'pointer',
                                boxShadow: '0 0 20px rgba(201,149,108,0.2)',
                            }}>Jelajahi</button>
                        </Link>
                    )}

                    {/* Hamburger */}
                    {(isMobile || isTablet) && (
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            style={{
                                background: 'var(--bg-overlay-medium)',
                                border: '1px solid var(--border-medium)',
                                color: 'var(--foreground)', width: '40px', height: '40px',
                                borderRadius: '10px', cursor: 'pointer',
                                fontSize: '16px', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                            }}>
                            {menuOpen ? '✕' : '☰'}
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {(isMobile || isTablet) && menuOpen && (
                <div style={{
                    background: 'var(--background-secondary)',
                    borderTop: '1px solid var(--border-color)',
                    padding: '1rem 1.5rem 1.5rem',
                }}>
                    {[
                        { label: 'Beranda', href: '/' },
                        { label: 'Katalog', href: '/katalog' },
                        { label: 'Kategori', href: '/kategori' },
                    ].map(item => (
                        <Link key={item.href} href={item.href}
                            onClick={() => setMenuOpen(false)}
                            style={{
                                textDecoration: 'none', display: 'block',
                                padding: '14px 0',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                color: 'var(--text-muted)',
                                fontFamily: 'DM Sans, sans-serif', fontSize: '15px',
                            }}
                        >{item.label}</Link>
                    ))}
                    <Link href="/katalog" style={{ textDecoration: 'none' }}
                        onClick={() => setMenuOpen(false)}>
                        <button style={{
                            width: '100%', marginTop: '1rem',
                            background: 'linear-gradient(135deg, #C9956C, #B87355)',
                            color: 'white', border: 'none',
                            padding: '13px', borderRadius: '12px',
                            fontSize: '14px', fontFamily: 'DM Sans, sans-serif',
                            fontWeight: 500, cursor: 'pointer',
                        }}>Jelajahi Katalog ✦</button>
                    </Link>
                </div>
            )}
        </nav>
    );
}