'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Design } from '@/types';
import { useWindowSize } from '@/hooks/useWindowSize';

export default function AdminDesignsPage() {
    const [designs, setDesigns] = useState<Design[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const { isMobile } = useWindowSize();

    const fetchDesigns = async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = { page: String(page), per_page: '10' };
            if (search) params.search = search;
            const res = await api.get('/admin/designs', { params });
            setDesigns(res.data.data);
            setLastPage(res.data.last_page);
            setTotal(res.data.total);
        } catch { }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchDesigns(); }, [page]);

    useEffect(() => {
        const timer = setTimeout(() => { setPage(1); fetchDesigns(); }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin ingin menghapus desain ini?')) return;
        setDeletingId(id);
        try {
            await api.delete(`/admin/designs/${id}`);
            fetchDesigns();
        } catch {
            alert('Gagal menghapus desain.');
        } finally {
            setDeletingId(null);
        }
    };

    const handleToggleActive = async (design: Design) => {
        try {
            await api.put(`/admin/designs/${design.id}`, { is_active: !design.is_active });
            fetchDesigns();
        } catch { }
    };

    return (
        <div style={{ animation: 'fadeUp 0.5s ease both' }}>
            <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
      `}</style>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{
                        fontFamily: 'DM Sans, sans-serif', fontSize: '11px',
                        letterSpacing: '3px', color: '#C9956C',
                        textTransform: 'uppercase', marginBottom: '6px',
                    }}>Kelola</div>
                    <h1 style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '36px', color: '#FDFAF7', fontWeight: 300,
                    }}>Desain <em style={{ color: '#C9956C' }}>Katalog</em></h1>
                </div>
                <Link href="/admin/designs/create" style={{ textDecoration: 'none' }}>
                    <button style={{
                        background: 'linear-gradient(135deg, #C9956C, #B87355)',
                        color: 'white', border: 'none',
                        padding: '12px 24px', borderRadius: '12px',
                        fontSize: '13px', fontFamily: 'DM Sans, sans-serif',
                        fontWeight: 500, cursor: 'pointer',
                        boxShadow: '0 0 20px rgba(201,149,108,0.2)',
                    }}>+ Tambah Desain</button>
                </Link>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: '400px' }}>
                <span style={{
                    position: 'absolute', left: '16px', top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(253,250,247,0.3)', fontSize: '14px',
                }}>⌕</span>
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Cari desain..."
                    style={{
                        width: '100%', padding: '12px 16px 12px 40px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(255,255,255,0.04)',
                        color: '#FDFAF7', fontSize: '14px',
                        fontFamily: 'DM Sans, sans-serif', outline: 'none',
                    }}
                />
            </div>

            {/* Total */}
            <div style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: '12px',
                color: 'rgba(253,250,247,0.3)', marginBottom: '1rem',
            }}>
                {loading ? '...' : `${total} desain ditemukan`}
            </div>

            {/* Table - Desktop */}
            {!isMobile && (
                <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '16px', overflow: 'hidden',
                    marginBottom: '1.5rem',
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr 1fr 120px',
                        padding: '12px 1.5rem',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        background: 'rgba(255,255,255,0.02)',
                    }}>
                        {['Desain', 'Kategori', 'Harga', 'Status', 'Aksi'].map(h => (
                            <div key={h} style={{
                                fontFamily: 'DM Sans, sans-serif', fontSize: '11px',
                                color: 'rgba(253,250,247,0.3)', letterSpacing: '1px',
                                textTransform: 'uppercase',
                            }}>{h}</div>
                        ))}
                    </div>

                    {loading && (
                        <div style={{ padding: '3rem', textAlign: 'center' }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                border: '2px solid rgba(201,149,108,0.2)',
                                borderTop: '2px solid #C9956C',
                                margin: '0 auto', animation: 'spin 1s linear infinite',
                            }} />
                        </div>
                    )}

                    {!loading && designs.length === 0 && (
                        <div style={{ padding: '3rem', textAlign: 'center' }}>
                            <div style={{
                                fontFamily: 'Cormorant Garamond, serif',
                                fontSize: '40px', color: 'rgba(201,149,108,0.3)', marginBottom: '1rem',
                            }}>✦</div>
                            <div style={{
                                fontFamily: 'DM Sans, sans-serif', fontSize: '13px',
                                color: 'rgba(253,250,247,0.3)',
                            }}>Belum ada desain</div>
                        </div>
                    )}

                    {!loading && designs.map((design, i) => (
                        <div key={design.id} style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1fr 1fr 1fr 120px',
                            padding: '1rem 1.5rem',
                            borderBottom: i < designs.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                            alignItems: 'center', transition: 'background 0.2s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '8px',
                                    background: 'rgba(201,149,108,0.1)', border: '1px solid rgba(201,149,108,0.2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', color: '#C9956C', flexShrink: 0,
                                }}>✦</div>
                                <div>
                                    <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#FDFAF7', fontWeight: 500 }}>{design.title}</div>
                                    <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(253,250,247,0.3)', marginTop: '2px' }}>
                                        {design.view_count} views {design.is_featured && '· Featured'}
                                    </div>
                                </div>
                            </div>
                            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(253,250,247,0.5)' }}>{design.category?.name || '—'}</div>
                            <div>
                                <span style={{
                                    background: design.price_type === 'free' ? 'rgba(52,211,153,0.1)' : 'rgba(251,191,36,0.1)',
                                    color: design.price_type === 'free' ? '#34d399' : '#fbbf24',
                                    border: `1px solid ${design.price_type === 'free' ? 'rgba(52,211,153,0.3)' : 'rgba(251,191,36,0.3)'}`,
                                    fontSize: '11px', padding: '3px 10px', borderRadius: '100px', fontFamily: 'DM Sans, sans-serif',
                                }}>{design.price_type === 'free' ? 'Gratis' : 'Premium'}</span>
                            </div>
                            <div>
                                <button onClick={() => handleToggleActive(design)} style={{
                                    background: design.is_active ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.05)',
                                    color: design.is_active ? '#34d399' : 'rgba(253,250,247,0.3)',
                                    border: `1px solid ${design.is_active ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.1)'}`,
                                    fontSize: '11px', padding: '4px 12px', borderRadius: '100px',
                                    fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', transition: 'all 0.2s',
                                }}>{design.is_active ? 'Aktif' : 'Nonaktif'}</button>
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <Link href={`/admin/designs/${design.id}/edit`} style={{ textDecoration: 'none' }}>
                                    <button style={{
                                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                                        color: 'rgba(253,250,247,0.6)', padding: '6px 12px', borderRadius: '8px',
                                        fontSize: '12px', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
                                    }}>Edit</button>
                                </Link>
                                <button onClick={() => handleDelete(design.id)} disabled={deletingId === design.id} style={{
                                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                                    color: '#f87171', padding: '6px 12px', borderRadius: '8px',
                                    fontSize: '12px', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
                                }}>{deletingId === design.id ? '...' : 'Hapus'}</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Cards - Mobile */}
            {isMobile && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.5rem' }}>
                    {loading && (
                        <div style={{ padding: '3rem', textAlign: 'center' }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                border: '2px solid rgba(201,149,108,0.2)',
                                borderTop: '2px solid #C9956C',
                                margin: '0 auto', animation: 'spin 1s linear infinite',
                            }} />
                        </div>
                    )}

                    {!loading && designs.length === 0 && (
                        <div style={{ padding: '3rem', textAlign: 'center' }}>
                            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '40px', color: 'rgba(201,149,108,0.3)', marginBottom: '1rem' }}>✦</div>
                            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(253,250,247,0.3)' }}>Belum ada desain</div>
                        </div>
                    )}

                    {!loading && designs.map((design) => (
                        <div key={design.id} style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '16px', padding: '1.2rem',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                                        background: 'rgba(201,149,108,0.1)', border: '1px solid rgba(201,149,108,0.2)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', color: '#C9956C',
                                    }}>✦</div>
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{
                                            fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: '#FDFAF7', fontWeight: 500,
                                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                        }}>{design.title}</div>
                                        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(253,250,247,0.35)', marginTop: '2px' }}>
                                            {design.category?.name} · {design.view_count} views
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => handleToggleActive(design)} style={{
                                    background: design.is_active ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.05)',
                                    color: design.is_active ? '#34d399' : 'rgba(253,250,247,0.3)',
                                    border: `1px solid ${design.is_active ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.1)'}`,
                                    fontSize: '11px', padding: '5px 12px', borderRadius: '100px',
                                    fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', flexShrink: 0, marginLeft: '8px',
                                }}>{design.is_active ? 'Aktif' : 'Nonaktif'}</button>
                            </div>

                            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                <span style={{
                                    background: design.price_type === 'free' ? 'rgba(52,211,153,0.1)' : 'rgba(251,191,36,0.1)',
                                    color: design.price_type === 'free' ? '#34d399' : '#fbbf24',
                                    border: `1px solid ${design.price_type === 'free' ? 'rgba(52,211,153,0.3)' : 'rgba(251,191,36,0.3)'}`,
                                    fontSize: '11px', padding: '3px 10px', borderRadius: '100px', fontFamily: 'DM Sans, sans-serif',
                                }}>{design.price_type === 'free' ? 'Gratis' : 'Premium'}</span>
                                {design.is_featured && (
                                    <span style={{
                                        background: 'rgba(201,149,108,0.1)', color: '#C9956C',
                                        border: '1px solid rgba(201,149,108,0.3)',
                                        fontSize: '11px', padding: '3px 10px', borderRadius: '100px', fontFamily: 'DM Sans, sans-serif',
                                    }}>Featured</span>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Link href={`/admin/designs/${design.id}/edit`} style={{ textDecoration: 'none', flex: 1 }}>
                                    <button style={{
                                        width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                                        color: 'rgba(253,250,247,0.7)', padding: '10px', borderRadius: '10px',
                                        fontSize: '13px', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
                                    }}>Edit</button>
                                </Link>
                                <button onClick={() => handleDelete(design.id)} disabled={deletingId === design.id} style={{
                                    flex: 1, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                                    color: '#f87171', padding: '10px', borderRadius: '10px',
                                    fontSize: '13px', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
                                }}>{deletingId === design.id ? '...' : 'Hapus'}</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!loading && lastPage > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: page === 1 ? 'rgba(253,250,247,0.2)' : 'rgba(253,250,247,0.6)',
                            padding: '8px 20px', borderRadius: '100px',
                            fontSize: '13px', fontFamily: 'DM Sans, sans-serif',
                            cursor: page === 1 ? 'not-allowed' : 'pointer',
                        }}>← Prev</button>
                    {Array.from({ length: lastPage }, (_, i) => i + 1).map(p => (
                        <button key={p} onClick={() => setPage(p)} style={{
                            background: page === p ? '#C9956C' : 'rgba(255,255,255,0.04)',
                            border: page === p ? '1px solid #C9956C' : '1px solid rgba(255,255,255,0.08)',
                            color: page === p ? 'white' : 'rgba(253,250,247,0.5)',
                            width: '40px', height: '40px', borderRadius: '50%',
                            fontSize: '13px', fontFamily: 'DM Sans, sans-serif',
                            cursor: 'pointer', transition: 'all 0.2s',
                        }}>{p}</button>
                    ))}
                    <button
                        onClick={() => setPage(p => Math.min(lastPage, p + 1))}
                        disabled={page === lastPage}
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: page === lastPage ? 'rgba(253,250,247,0.2)' : 'rgba(253,250,247,0.6)',
                            padding: '8px 20px', borderRadius: '100px',
                            fontSize: '13px', fontFamily: 'DM Sans, sans-serif',
                            cursor: page === lastPage ? 'not-allowed' : 'pointer',
                        }}>Next →</button>
                </div>
            )}
        </div>
    );
}