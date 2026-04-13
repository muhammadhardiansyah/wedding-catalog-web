'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Category } from '@/types';
import { useWindowSize } from '@/hooks/useWindowSize';

const categoryColors = [
    { bg: 'rgba(201,149,108,0.1)', border: 'rgba(201,149,108,0.3)', accent: '#C9956C' },
    { bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.3)', accent: '#a78bfa' },
    { bg: 'rgba(244,114,182,0.1)', border: 'rgba(244,114,182,0.3)', accent: '#f472b6' },
    { bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.3)', accent: '#34d399' },
    { bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)', accent: '#fbbf24' },
    { bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.3)', accent: '#60a5fa' },
];

const categoryIcons: Record<string, string> = {
    rustic: '🌿',
    modern: '◈',
    islami: '☪',
    floral: '❋',
    minimalist: '○',
    elegant: '✦',
};

export default function KategoriPage() {
    const { isMobile, isTablet } = useWindowSize();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories');
                setCategories(res.data);
            } catch { }
            finally { setLoading(false); }
        };
        fetchCategories();
    }, []);

    return (
        <div
            onMouseMove={e => setMousePos({ x: e.clientX, y: e.clientY })}
            style={{ background: '#0a0604', minHeight: '100vh' }}
        >

            {/* CURSOR GLOW */}
            <div style={{
                position: 'fixed',
                left: mousePos.x - 200, top: mousePos.y - 200,
                width: 400, height: 400, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(201,149,108,0.06) 0%, transparent 70%)',
                pointerEvents: 'none', zIndex: 9999,
                transition: 'left 0.1s, top 0.1s',
            }} />

            <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px);} to{opacity:1;transform:translateY(0);} }
        @keyframes float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-10px);} }
        @keyframes spin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
        @keyframes cardIn { from{opacity:0;transform:translateY(40px) scale(.97);} to{opacity:1;transform:translateY(0) scale(1);} }
        @keyframes skeleton { 0%{opacity:.4;} 50%{opacity:.8;} 100%{opacity:.4;} }
        .skeleton { animation: skeleton 1.5s ease-in-out infinite; }
      `}</style>

            {/* HEADER */}
            <div style={{
                padding: '5rem 2rem 3rem',
                textAlign: 'center',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(ellipse at top, rgba(201,149,108,0.08) 0%, transparent 60%)',
                    pointerEvents: 'none',
                }} />

                {/* Spinning ring decoration */}
                <div style={{
                    position: 'absolute', top: '2rem', right: '10%',
                    width: 60, height: 60,
                    border: '1px solid rgba(201,149,108,0.2)',
                    borderTop: '1px solid rgba(201,149,108,0.7)',
                    borderRadius: '50%',
                    animation: 'spin 8s linear infinite',
                }} />
                <div style={{
                    position: 'absolute', bottom: '1rem', left: '8%',
                    width: 40, height: 40,
                    border: '1px solid rgba(167,139,250,0.2)',
                    borderTop: '1px solid rgba(167,139,250,0.7)',
                    borderRadius: '50%',
                    animation: 'spin 6s linear infinite reverse',
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        fontFamily: 'DM Sans, sans-serif', fontSize: '11px',
                        letterSpacing: '5px', color: '#C9956C',
                        textTransform: 'uppercase', marginBottom: '1rem',
                        animation: 'fadeUp 0.6s ease both',
                    }}>✦ Jelajahi Tema</div>

                    <h1 style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: 'clamp(36px, 7vw, 64px)',
                        color: '#FDFAF7', fontWeight: 300,
                        lineHeight: 1.1, marginBottom: '1rem',
                        animation: 'fadeUp 0.6s ease 0.1s both',
                    }}>
                        Temukan <em style={{ color: '#C9956C' }}>Kategori</em><br />
                        yang Cocok Untukmu
                    </h1>

                    <div style={{
                        width: '60px', height: '1px',
                        background: '#C9956C',
                        margin: '0 auto 1.5rem',
                        animation: 'fadeUp 0.6s ease 0.2s both',
                    }} />

                    <p style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '15px', color: 'rgba(253,250,247,0.45)',
                        lineHeight: 1.8, fontWeight: 300,
                        maxWidth: '480px', margin: '0 auto',
                        animation: 'fadeUp 0.6s ease 0.3s both',
                    }}>
                        Setiap tema dirancang untuk mencerminkan kepribadian dan
                        kisah cinta yang unik milikmu.
                    </p>
                </div>
            </div>

            {/* CATEGORIES GRID */}
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 2rem 5rem' }}>

                {/* Loading Skeleton */}
                {loading && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile
                            ? '1fr'
                            : isTablet
                                ? 'repeat(2, 1fr)'
                                : 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '20px', marginBottom: '3rem',
                    }}>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="skeleton" style={{
                                height: '220px',
                                background: 'rgba(255,255,255,0.04)',
                                borderRadius: '20px',
                                border: '1px solid rgba(255,255,255,0.06)',
                            }} />
                        ))}
                    </div>
                )}

                {/* Category Cards */}
                {!loading && (
                    <>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '20px', marginBottom: '3rem',
                        }}>
                            {categories.map((cat, i) => {
                                const color = categoryColors[i % categoryColors.length];
                                const icon = categoryIcons[cat.slug] || '✦';
                                const isHovered = hoveredId === cat.id;

                                return (
                                    <Link key={cat.id} href={`/katalog?category=${cat.slug}`} style={{ textDecoration: 'none' }}>
                                        <div
                                            onMouseEnter={() => setHoveredId(cat.id)}
                                            onMouseLeave={() => setHoveredId(null)}
                                            style={{
                                                background: isHovered ? color.bg : 'rgba(255,255,255,0.02)',
                                                border: `1px solid ${isHovered ? color.border : 'rgba(255,255,255,0.06)'}`,
                                                borderRadius: '20px', padding: '2rem',
                                                transition: 'all 0.3s',
                                                transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                                                cursor: 'pointer', height: '220px',
                                                display: 'flex', flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                position: 'relative', overflow: 'hidden',
                                                animation: `cardIn 0.5s ease ${i * 0.08}s both`,
                                                boxShadow: isHovered ? `0 20px 60px ${color.accent}20` : 'none',
                                            }}>

                                            {/* BG Glow */}
                                            <div style={{
                                                position: 'absolute', inset: 0,
                                                background: `radial-gradient(circle at 80% 20%, ${color.accent}10, transparent 60%)`,
                                                opacity: isHovered ? 1 : 0,
                                                transition: 'opacity 0.3s',
                                                pointerEvents: 'none',
                                            }} />

                                            {/* Decorative circle */}
                                            <div style={{
                                                position: 'absolute', bottom: '-30px', right: '-30px',
                                                width: '120px', height: '120px', borderRadius: '50%',
                                                border: `1px solid ${color.border}`,
                                                opacity: isHovered ? 0.6 : 0.2,
                                                transition: 'opacity 0.3s',
                                            }} />

                                            {/* Top */}
                                            <div style={{ position: 'relative', zIndex: 1 }}>
                                                <div style={{
                                                    width: '52px', height: '52px',
                                                    background: color.bg,
                                                    border: `1px solid ${color.border}`,
                                                    borderRadius: '14px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '22px', color: color.accent,
                                                    marginBottom: '1rem',
                                                    fontFamily: 'Cormorant Garamond, serif',
                                                    transition: 'transform 0.3s',
                                                    transform: isHovered ? 'scale(1.1) rotate(-5deg)' : 'scale(1) rotate(0)',
                                                }}>{icon}</div>

                                                <div style={{
                                                    fontFamily: 'Cormorant Garamond, serif',
                                                    fontSize: '24px', color: '#FDFAF7',
                                                    fontWeight: 400,
                                                }}>{cat.name}</div>
                                            </div>

                                            {/* Bottom */}
                                            <div style={{
                                                display: 'flex', justifyContent: 'space-between',
                                                alignItems: 'center', position: 'relative', zIndex: 1,
                                            }}>
                                                <div style={{
                                                    fontFamily: 'DM Sans, sans-serif',
                                                    fontSize: '13px', color: 'rgba(253,250,247,0.4)',
                                                }}>
                                                    {cat.designs_count || 0} desain tersedia
                                                </div>
                                                <div style={{
                                                    width: '32px', height: '32px',
                                                    background: isHovered ? color.bg : 'rgba(255,255,255,0.04)',
                                                    border: `1px solid ${isHovered ? color.border : 'rgba(255,255,255,0.08)'}`,
                                                    borderRadius: '50%',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: isHovered ? color.accent : 'rgba(253,250,247,0.3)',
                                                    fontSize: '14px', transition: 'all 0.3s',
                                                    transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                                                }}>→</div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* ALL DESIGNS CTA */}
                        <div style={{
                            textAlign: 'center',
                            padding: '3rem',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '24px',
                            position: 'relative', overflow: 'hidden',
                        }}>
                            <div style={{
                                position: 'absolute', inset: 0,
                                background: 'radial-gradient(ellipse at center, rgba(201,149,108,0.06) 0%, transparent 70%)',
                                pointerEvents: 'none',
                            }} />
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{
                                    fontFamily: 'Cormorant Garamond, serif',
                                    fontSize: '32px', color: '#FDFAF7',
                                    fontWeight: 300, marginBottom: '8px',
                                }}>
                                    Tidak yakin pilih mana?
                                </div>
                                <p style={{
                                    fontFamily: 'DM Sans, sans-serif',
                                    fontSize: '14px', color: 'rgba(253,250,247,0.4)',
                                    marginBottom: '1.5rem', fontWeight: 300,
                                }}>Lihat semua koleksi dan temukan yang paling cocok.</p>
                                <Link href="/katalog" style={{ textDecoration: 'none' }}>
                                    <button style={{
                                        background: 'linear-gradient(135deg, #C9956C, #B87355)',
                                        color: 'white', border: 'none',
                                        padding: '13px 36px', borderRadius: '100px',
                                        fontSize: '14px', fontFamily: 'DM Sans, sans-serif',
                                        fontWeight: 500, cursor: 'pointer',
                                        boxShadow: '0 0 40px rgba(201,149,108,0.25)',
                                        transition: 'all 0.3s',
                                    }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                            e.currentTarget.style.boxShadow = '0 0 60px rgba(201,149,108,0.4)';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.boxShadow = '0 0 40px rgba(201,149,108,0.25)';
                                        }}
                                    >
                                        Jelajahi Semua Desain ✦
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}