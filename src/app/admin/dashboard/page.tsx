'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useWindowSize } from '@/hooks/useWindowSize';
import { statCardLabels } from '@/lib/constants';

interface Stats {
    total_designs: number;
    total_categories: number;
    total_views: number;
    featured_designs: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats>({
        total_designs: 0,
        total_categories: 0,
        total_views: 0,
        featured_designs: 0,
    });
    const [recentDesigns, setRecentDesigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { isMobile } = useWindowSize();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [designsRes, categoriesRes] = await Promise.all([
                    api.get('/designs?per_page=100'),
                    api.get('/categories'),
                ]);

                const designs = designsRes.data.data;
                const categories = categoriesRes.data;

                setStats({
                    total_designs: designsRes.data.total,
                    total_categories: categories.length,
                    total_views: designs.reduce((acc: number, d: any) => acc + d.view_count, 0),
                    featured_designs: designs.filter((d: any) => d.is_featured).length,
                });

                setRecentDesigns(designs.slice(0, 5));
            } catch { }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    const statCards = statCardLabels(stats).map((card, i) => ({
        ...card,
        value: Object.values(stats)[i],
    }));

    return (
        <div style={{ animation: 'fadeUp 0.5s ease both' }}>
            <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}`}</style>

            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{
                    fontFamily: 'DM Sans, sans-serif', fontSize: '11px',
                    letterSpacing: '3px', color: '#C9956C',
                    textTransform: 'uppercase', marginBottom: '6px',
                }}>Selamat Datang</div>
                <h1 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '36px', color: '#FDFAF7', fontWeight: 300,
                }}>Dashboard <em style={{ color: '#C9956C' }}>Admin</em></h1>
            </div>

            {/* STAT CARDS */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '12px', marginBottom: '2.5rem',
            }}>
                {statCards.map((card, i) => (
                    <div key={i} style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '16px', padding: isMobile ? '1rem' : '1.5rem',
                        transition: 'all 0.2s',
                    }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = `${card.color}40`;
                            e.currentTarget.style.transform = 'translateY(-4px)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div style={{
                            width: '36px', height: '36px',
                            background: `${card.color}15`,
                            border: `1px solid ${card.color}30`,
                            borderRadius: '10px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '16px', color: card.color,
                            fontFamily: 'Cormorant Garamond, serif',
                            marginBottom: '0.8rem',
                        }}>{card.icon}</div>
                        <div style={{
                            fontFamily: 'Cormorant Garamond, serif',
                            fontSize: isMobile ? '28px' : '36px',
                            color: '#FDFAF7', fontWeight: 400, lineHeight: 1,
                        }}>
                            {loading ? '—' : card.value.toLocaleString()}
                        </div>
                        <div style={{
                            fontFamily: 'DM Sans, sans-serif',
                            fontSize: '12px', color: 'rgba(253,250,247,0.4)',
                            marginTop: '6px',
                        }}>{card.label}</div>
                    </div>
                ))}
            </div>

            {/* QUICK ACTIONS */}
            <div style={{ marginBottom: '2.5rem' }}>
                <div style={{
                    fontFamily: 'DM Sans, sans-serif', fontSize: '11px',
                    letterSpacing: '3px', color: 'rgba(253,250,247,0.3)',
                    textTransform: 'uppercase', marginBottom: '1rem',
                }}>Aksi Cepat</div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, auto)',
                    gap: '10px',
                    justifyContent: isMobile ? 'stretch' : 'start',
                }}>
                    <Link href="/admin/designs/create" style={{ textDecoration: 'none' }}>
                        <button style={{
                            width: isMobile ? '100%' : 'auto',
                            background: 'linear-gradient(135deg, #C9956C, #B87355)',
                            color: 'white', border: 'none',
                            padding: '12px 24px', borderRadius: '12px',
                            fontSize: '13px', fontFamily: 'DM Sans, sans-serif',
                            fontWeight: 500, cursor: 'pointer',
                            boxShadow: '0 0 20px rgba(201,149,108,0.2)',
                        }}>+ Tambah Desain</button>
                    </Link>
                    <Link href="/admin/categories" style={{ textDecoration: 'none' }}>
                        <button style={{
                            width: isMobile ? '100%' : 'auto',
                            background: 'rgba(255,255,255,0.04)',
                            color: 'rgba(253,250,247,0.6)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            padding: '12px 24px', borderRadius: '12px',
                            fontSize: '13px', fontFamily: 'DM Sans, sans-serif',
                            cursor: 'pointer',
                        }}>Kelola Kategori</button>
                    </Link>
                    <Link href="/katalog" target="_blank" style={{ textDecoration: 'none' }}>
                        <button style={{
                            width: isMobile ? '100%' : 'auto',
                            background: 'rgba(255,255,255,0.04)',
                            color: 'rgba(253,250,247,0.6)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            padding: '12px 24px', borderRadius: '12px',
                            fontSize: '13px', fontFamily: 'DM Sans, sans-serif',
                            cursor: 'pointer',
                        }}>Lihat Katalog ↗</button>
                    </Link>
                </div>
            </div>

            {/* RECENT DESIGNS */}
            <div>
                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '1rem',
                }}>
                    <div style={{
                        fontFamily: 'DM Sans, sans-serif', fontSize: '11px',
                        letterSpacing: '3px', color: 'rgba(253,250,247,0.3)',
                        textTransform: 'uppercase',
                    }}>Desain Terbaru</div>
                    <Link href="/admin/designs" style={{ textDecoration: 'none' }}>
                        <span style={{
                            fontFamily: 'DM Sans, sans-serif', fontSize: '12px',
                            color: '#C9956C', cursor: 'pointer',
                        }}>Lihat semua →</span>
                    </Link>
                </div>

                <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '16px', overflow: 'hidden',
                }}>
                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center' }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                border: '2px solid rgba(201,149,108,0.2)',
                                borderTop: '2px solid #C9956C',
                                margin: '0 auto', animation: 'spin 1s linear infinite',
                            }} />
                            <style>{`@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}`}</style>
                        </div>
                    ) : recentDesigns.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center' }}>
                            <div style={{
                                fontFamily: 'DM Sans, sans-serif', fontSize: '13px',
                                color: 'rgba(253,250,247,0.3)',
                            }}>Belum ada desain</div>
                        </div>
                    ) : (
                        recentDesigns.map((design, i) => (
                            <div key={design.id} style={{
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: isMobile ? '0.8rem 1rem' : '1rem 1.5rem',
                                borderBottom: i < recentDesigns.length - 1
                                    ? '1px solid rgba(255,255,255,0.04)' : 'none',
                                transition: 'background 0.2s', gap: '8px',
                            }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                                        background: 'rgba(201,149,108,0.1)',
                                        border: '1px solid rgba(201,149,108,0.2)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontFamily: 'Cormorant Garamond, serif', fontSize: '14px', color: '#C9956C',
                                    }}>✦</div>
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{
                                            fontFamily: 'DM Sans, sans-serif',
                                            fontSize: isMobile ? '13px' : '14px',
                                            color: '#FDFAF7', fontWeight: 500,
                                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                        }}>{design.title}</div>
                                        <div style={{
                                            fontFamily: 'DM Sans, sans-serif',
                                            fontSize: '11px', color: 'rgba(253,250,247,0.3)', marginTop: '2px',
                                        }}>{design.category?.name} · {design.view_count} views</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                    {!isMobile && (
                                        <div style={{
                                            background: design.price_type === 'free' ? 'rgba(52,211,153,0.1)' : 'rgba(251,191,36,0.1)',
                                            color: design.price_type === 'free' ? '#34d399' : '#fbbf24',
                                            border: `1px solid ${design.price_type === 'free' ? 'rgba(52,211,153,0.3)' : 'rgba(251,191,36,0.3)'}`,
                                            fontSize: '11px', padding: '3px 10px',
                                            borderRadius: '100px', fontFamily: 'DM Sans, sans-serif',
                                        }}>
                                            {design.price_type === 'free' ? 'Gratis' : 'Premium'}
                                        </div>
                                    )}
                                    <Link href={`/admin/designs/${design.id}/edit`} style={{ textDecoration: 'none' }}>
                                        <button style={{
                                            background: 'rgba(255,255,255,0.04)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            color: 'rgba(253,250,247,0.5)',
                                            padding: '6px 14px', borderRadius: '8px',
                                            fontSize: '12px', fontFamily: 'DM Sans, sans-serif',
                                            cursor: 'pointer',
                                        }}>Edit</button>
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}