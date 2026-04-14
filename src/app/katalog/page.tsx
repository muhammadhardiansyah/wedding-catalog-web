'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { Design, Category, PaginatedResponse } from '@/types';
import { useWindowSize } from '@/hooks/useWindowSize';
import { useRouter } from 'next/navigation';

const categoriesList = ['Semua', 'Rustic', 'Modern', 'Islami', 'Floral', 'Minimalist', 'Elegant'];

function KatalogContent() {
    const router = useRouter();
    const { isMobile, isTablet } = useWindowSize();
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category');

    const [designs, setDesigns] = useState<Design[]>([]);
    const [categories, setCategories] = useState<string[]>(['Semua']);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [search, setSearch] = useState('');
    const [priceFilter, setPriceFilter] = useState('');
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);

    const initialized = useRef(false);

    const fetchDesigns = async (categoryOverride?: string, pageOverride?: number) => {
        setLoading(true);
        const cat = categoryOverride !== undefined ? categoryOverride : activeCategory;
        const pg = pageOverride !== undefined ? pageOverride : page;
        try {
            const params: Record<string, string> = { page: String(pg), per_page: '12' };
            if (cat !== 'Semua') params.category = cat.toLowerCase();
            if (search) params.search = search;
            if (priceFilter) params.price_type = priceFilter;

            const res = await api.get<PaginatedResponse<Design>>('/designs', { params });
            setDesigns(res.data.data);
            setLastPage(res.data.last_page);
            setTotal(res.data.total);
        } catch {
            setDesigns([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories');
                const names = ['Semua', ...res.data.map((c: any) => c.name)];
                setCategories(names);

                if (categoryParam) {
                    const matched = names.find(
                        (c: string) => c.toLowerCase() === categoryParam.toLowerCase()
                    );
                    const resolvedCategory = matched || 'Semua';
                    setActiveCategory(resolvedCategory);
                    await fetchDesigns(resolvedCategory, 1);
                } else {
                    await fetchDesigns('Semua', 1);
                }
            } catch {
                await fetchDesigns('Semua', 1);
            } finally {
                initialized.current = true;
            }
        };
        fetchCategories();
    }, [categoryParam]);

    useEffect(() => {
        if (!initialized.current) return;
        fetchDesigns(activeCategory, page);
    }, [activeCategory, page, priceFilter]);

    useEffect(() => {
        if (!initialized.current) return;
        const timer = setTimeout(() => fetchDesigns(activeCategory, 1), 400);
        return () => clearTimeout(timer);
    }, [search]);

    const handlePreview = async (design: Design) => {
        setSelectedDesign(design);
        await api.post(`/designs/${design.slug}/view`).catch(() => { });
    };

    // ... sisa kode return tetap sama persis seperti sebelumnya

    return (
        <div style={{ background: 'var(--background)', minHeight: '100vh' }}>

            <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px);} to{opacity:1;transform:translateY(0);} }
        @keyframes pulse { 0%,100%{opacity:.5;} 50%{opacity:1;} }
        @keyframes spin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
        .card-anim { animation: fadeUp 0.5s ease both; }
      `}</style>

            {/* HEADER */}
            <div style={{
                padding: '4rem 2rem 2rem',
                borderBottom: '1px solid var(--border-light)',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(ellipse at top, rgba(201,149,108,0.08) 0%, transparent 60%)',
                    pointerEvents: 'none',
                }} />
                <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{
                        fontFamily: 'DM Sans, sans-serif', fontSize: '11px',
                        letterSpacing: '4px', color: 'var(--accent-light)',
                        textTransform: 'uppercase', marginBottom: '8px',
                    }}>✦ Koleksi Lengkap</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                        <h1 style={{
                            fontFamily: 'Cormorant Garamond, serif',
                            fontSize: 'clamp(32px, 6vw, 52px)',
                            color: 'var(--foreground)', fontWeight: 300,
                            lineHeight: 1.1,
                        }}>
                            Katalog <em style={{ color: 'var(--accent-light)' }}>Undangan</em>
                        </h1>
                        <div style={{
                            fontFamily: 'DM Sans, sans-serif', fontSize: '13px',
                            color: 'var(--text-muted)',
                        }}>
                            {loading ? '...' : `${total} desain tersedia`}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>

                {/* SEARCH + FILTER */}
                <div style={{
                    display: 'flex', gap: '12px',
                    marginBottom: '1.5rem',
                    flexDirection: isMobile ? 'column' : 'row',
                    flexWrap: 'wrap',
                }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                        <span style={{
                            position: 'absolute', left: '16px', top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--text-muted-lighter)', fontSize: '14px',
                        }}>⌕</span>
                        <input
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Cari desain impianmu..."
                            style={{
                                width: '100%', padding: '13px 16px 13px 40px',
                                borderRadius: '100px',
                                border: '1px solid var(--border-medium)',
                                background: 'var(--bg-overlay-medium)',
                                color: 'var(--foreground)', fontSize: '14px',
                                fontFamily: 'DM Sans, sans-serif', outline: 'none',
                            }}
                        />
                    </div>
                    <select
                        value={priceFilter}
                        onChange={e => { setPriceFilter(e.target.value); setPage(1); }}
                        style={{
                            padding: '13px 20px', borderRadius: '100px',
                            border: '1px solid var(--border-medium)',
                            background: 'var(--bg-overlay-medium)',
                            color: priceFilter ? 'var(--foreground)' : 'var(--text-muted)',
                            fontSize: '13px', fontFamily: 'DM Sans, sans-serif',
                            outline: 'none', cursor: 'pointer',
                            colorScheme: 'dark',
                        }}
                    >
                        <option value="" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>Semua Harga</option>
                        <option value="free" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>Gratis</option>
                        <option value="premium" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>Premium</option>
                    </select>
                </div>

                {/* CATEGORY PILLS */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
                    {categories.map(cat => (
                        <button key={cat} onClick={() => { setActiveCategory(cat); setPage(1); }} style={{
                            background: activeCategory === cat ? 'var(--accent-light)' : 'var(--bg-overlay-medium)',
                            color: activeCategory === cat ? 'white' : 'var(--text-muted-light)',
                            border: activeCategory === cat ? '1px solid var(--accent-light)' : '1px solid var(--border-medium)',
                            padding: '8px 20px', borderRadius: '100px',
                            fontSize: '12px', fontFamily: 'DM Sans, sans-serif',
                            cursor: 'pointer', transition: 'all 0.2s',
                            fontWeight: activeCategory === cat ? 500 : 300,
                        }}>{cat}</button>
                    ))}
                </div>

                {/* LOADING */}
                {loading && (
                    <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            border: '2px solid rgba(201,149,108,0.2)',
                            borderTop: '2px solid var(--accent-light)',
                            margin: '0 auto 1rem',
                            animation: 'spin 1s linear infinite',
                        }} />
                        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--text-muted-lighter)' }}>
                            Memuat desain...
                        </div>
                    </div>
                )}

                {/* EMPTY STATE */}
                {!loading && designs.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                        <div style={{
                            fontFamily: 'Cormorant Garamond, serif',
                            fontSize: '48px', color: 'rgba(201,149,108,0.3)', marginBottom: '1rem',
                        }}>✦</div>
                        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', color: 'var(--foreground)', marginBottom: '8px' }}>
                            Belum ada desain
                        </div>
                        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--text-muted-lighter)' }}>
                            Coba ubah filter atau kata kunci pencarian
                        </div>
                    </div>
                )}

                {/* GRID */}
                {!loading && designs.length > 0 && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile
                            ? '1fr'
                            : isTablet
                                ? 'repeat(2, 1fr)'
                                : 'repeat(auto-fill, minmax(240px, 1fr))',
                        gap: '20px', marginBottom: '3rem',
                    }}>
                        {designs.map((design, i) => (
                            <div key={design.id}
                                className="card-anim"
                                onMouseEnter={() => setHoveredCard(i)}
                                onMouseLeave={() => setHoveredCard(null)}
                                style={{
                                    background: 'var(--bg-overlay-light)',
                                    borderRadius: '20px', overflow: 'hidden',
                                    border: hoveredCard === i
                                        ? '1px solid rgba(201,149,108,0.6)'
                                        : '1px solid var(--border-light)',
                                    transition: 'all 0.3s',
                                    transform: hoveredCard === i ? 'translateY(-8px)' : 'translateY(0)',
                                    cursor: 'pointer',
                                    animationDelay: `${i * 0.05}s`,
                                    boxShadow: hoveredCard === i ? '0 20px 60px rgba(201,149,108,0.12)' : 'none',
                                }}>

                                {/* Thumbnail */}
                                <div style={{
                                    height: '200px', position: 'relative', overflow: 'hidden',
                                    background: 'var(--background-secondary)',
                                }}>
                                    {design.thumbnail_url ? (
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_API_URL}${design.thumbnail_url}`}
                                            alt={design.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: '100%', height: '100%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: 'radial-gradient(circle, rgba(201,149,108,0.15), transparent)',
                                        }}>
                                            <div style={{
                                                fontFamily: 'Cormorant Garamond, serif',
                                                fontSize: '32px', color: 'rgba(201,149,108,0.4)',
                                            }}>✦</div>
                                        </div>
                                    )}

                                    {design.is_featured && (
                                        <div style={{
                                            position: 'absolute', top: '12px', left: '12px',
                                            background: 'rgba(201,149,108,0.15)',
                                            border: '1px solid rgba(201,149,108,0.4)',
                                            borderRadius: '100px', padding: '4px 12px',
                                            fontFamily: 'DM Sans, sans-serif', fontSize: '10px',
                                            color: 'var(--accent-light)', letterSpacing: '2px',
                                            textTransform: 'uppercase', backdropFilter: 'blur(8px)',
                                        }}>Featured</div>
                                    )}

                                    <div style={{
                                        position: 'absolute', top: '12px', right: '12px',
                                        width: '32px', height: '32px',
                                        background: 'rgba(0,0,0,0.4)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '50%', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        fontSize: '14px', color: 'var(--accent-light)',
                                        backdropFilter: 'blur(8px)', cursor: 'pointer',
                                    }}>♡</div>
                                </div>

                                {/* Info */}
                                <div style={{ padding: '1.2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                        <div>
                                            <div style={{
                                                fontFamily: 'Cormorant Garamond, serif',
                                                fontSize: '18px', color: 'var(--foreground)', fontWeight: 500,
                                            }}>{design.title}</div>
                                            <div style={{
                                                fontFamily: 'DM Sans, sans-serif',
                                                fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px',
                                            }}>{design.category?.name}</div>
                                        </div>
                                        <div style={{
                                            background: design.price_type === 'free' ? 'rgba(52,211,153,0.1)' : 'rgba(251,191,36,0.1)',
                                            color: design.price_type === 'free' ? '#34d399' : '#fbbf24',
                                            border: `1px solid ${design.price_type === 'free' ? 'rgba(52,211,153,0.3)' : 'rgba(251,191,36,0.3)'}`,
                                            fontSize: '11px', padding: '4px 12px',
                                            borderRadius: '100px', fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
                                        }}>
                                            {design.price_type === 'free' ? 'Gratis' : 'Premium'}
                                        </div>
                                    </div>

                                    {design.tags?.length > 0 && (
                                        <div style={{ display: 'flex', gap: '4px', marginBottom: '14px', flexWrap: 'wrap' }}>
                                            {design.tags.map(tag => (
                                                <span key={tag.id} style={{
                                                    background: 'var(--bg-overlay-medium)',
                                                    border: '1px solid var(--border-light)',
                                                    color: 'var(--text-muted-light)',
                                                    fontSize: '11px', padding: '3px 10px',
                                                    borderRadius: '100px', fontFamily: 'DM Sans, sans-serif',
                                                }}>{tag.name}</span>
                                            ))}
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => router.push(`/demo/${design.slug}`)}
                                            style={{
                                                flex: 1,
                                                background: 'var(--rose-gradient-button)',
                                                color: 'white', border: 'none',
                                                padding: '11px', borderRadius: '12px',
                                                fontSize: '12px', cursor: 'pointer',
                                                fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
                                            }}>Preview ✦</button>
                                        <a href={design.canva_public_url} target="_blank" rel="noopener noreferrer"
                                            style={{ flex: 1, textDecoration: 'none' }}>
                                            <button style={{
                                                width: '100%',
                                                background: 'transparent', color: 'var(--text-muted-light)',
                                                border: '1px solid var(--border-light)',
                                                padding: '11px', borderRadius: '12px',
                                                fontSize: '12px', cursor: 'pointer',
                                                fontFamily: 'DM Sans, sans-serif',
                                            }}>Lihat Desain ↗</button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* PAGINATION */}
                {!loading && lastPage > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '3rem' }}>
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            style={{
                                background: 'var(--bg-overlay-medium)',
                                border: '1px solid var(--border-medium)',
                                color: page === 1 ? 'var(--text-muted-lighter)' : 'var(--text-muted-light)',
                                padding: '8px 20px', borderRadius: '100px',
                                fontSize: '13px', fontFamily: 'DM Sans, sans-serif',
                                cursor: page === 1 ? 'not-allowed' : 'pointer',
                            }}>← Prev</button>

                        {Array.from({ length: lastPage }, (_, i) => i + 1).map(p => (
                            <button key={p} onClick={() => setPage(p)} style={{
                                background: page === p ? 'var(--accent-light)' : 'var(--bg-overlay-medium)',
                                border: page === p ? '1px solid var(--accent-light)' : '1px solid var(--border-medium)',
                                color: page === p ? 'white' : 'var(--text-muted-light)',
                                width: '40px', height: '40px', borderRadius: '50%',
                                fontSize: '13px', fontFamily: 'DM Sans, sans-serif',
                                cursor: 'pointer', transition: 'all 0.2s',
                            }}>{p}</button>
                        ))}

                        <button
                            onClick={() => setPage(p => Math.min(lastPage, p + 1))}
                            disabled={page === lastPage}
                            style={{
                                background: 'var(--bg-overlay-medium)',
                                border: '1px solid var(--border-medium)',
                                color: page === lastPage ? 'var(--text-muted-lighter)' : 'var(--text-muted-light)',
                                padding: '8px 20px', borderRadius: '100px',
                                fontSize: '13px', fontFamily: 'DM Sans, sans-serif',
                                cursor: page === lastPage ? 'not-allowed' : 'pointer',
                            }}>Next →</button>
                    </div>
                )}
            </div>

            {/* MODAL PREVIEW */}
            {selectedDesign && (
                <div
                    onClick={() => setSelectedDesign(null)}
                    style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(0,0,0,0.85)',
                        backdropFilter: 'blur(8px)',
                        zIndex: 1000,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '2rem',
                    }}>
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: 'var(--background-secondary)',
                            border: '1px solid rgba(201,149,108,0.2)',
                            borderRadius: '24px', overflow: 'hidden',
                            width: '100%', maxWidth: '900px',
                            maxHeight: '90vh', overflowY: 'auto',
                        }}>

                        {/* Modal Header */}
                        <div style={{
                            padding: '16px 24px',
                            borderBottom: '1px solid rgba(201,149,108,0.1)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}>
                            <div style={{
                                fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--accent-light)',
                            }}>✦ Preview — {selectedDesign.title}</div>
                            <button
                                onClick={() => setSelectedDesign(null)}
                                style={{
                                    background: 'var(--bg-overlay-heavy)',
                                    border: '1px solid var(--border-light)',
                                    color: 'var(--text-muted-light)',
                                    width: '32px', height: '32px', borderRadius: '50%',
                                    cursor: 'pointer', fontSize: '14px',
                                    fontFamily: 'DM Sans, sans-serif',
                                }}>✕</button>
                        </div>

                        {/* Iframe */}
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '300px', minHeight: '400px', position: 'relative' }}>
                                <iframe
                                    src={selectedDesign.canva_embed_url}
                                    style={{ width: '100%', height: '450px', border: 'none' }}
                                    allowFullScreen
                                />
                            </div>

                            {/* Sidebar */}
                            <div style={{
                                width: '260px', minWidth: '220px',
                                padding: '2rem', borderLeft: 'var(--border-light)',
                                display: 'flex', flexDirection: 'column', gap: '16px',
                            }}>
                                <div>
                                    <div style={{
                                        fontFamily: 'Cormorant Garamond, serif',
                                        fontSize: '22px', color: 'var(--foreground)', fontWeight: 400,
                                    }}>{selectedDesign.title}</div>
                                    <div style={{
                                        fontFamily: 'DM Sans, sans-serif',
                                        fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px',
                                    }}>{selectedDesign.category?.name}</div>
                                </div>

                                {selectedDesign.description && (
                                    <p style={{
                                        fontFamily: 'DM Sans, sans-serif',
                                        fontSize: '13px', color: 'var(--text-muted-light)',
                                        lineHeight: 1.7, fontWeight: 300,
                                    }}>{selectedDesign.description}</p>
                                )}

                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {selectedDesign.tags?.map(tag => (
                                        <span key={tag.id} style={{
                                            background: 'rgba(201,149,108,0.1)',
                                            border: '1px solid rgba(201,149,108,0.2)',
                                            color: '#C9956C', fontSize: '11px',
                                            padding: '4px 10px', borderRadius: '100px',
                                            fontFamily: 'DM Sans, sans-serif',
                                        }}>{tag.name}</span>
                                    ))}
                                </div>

                                <div style={{
                                    fontFamily: 'DM Sans, sans-serif', fontSize: '12px',
                                    color: 'rgba(253,250,247,0.3)',
                                }}>
                                    {selectedDesign.view_count} kali dilihat
                                </div>

                                <a href={selectedDesign.canva_public_url} target="_blank" rel="noopener noreferrer"
                                    style={{ textDecoration: 'none', marginTop: 'auto' }}>
                                    <button style={{
                                        width: '100%',
                                        background: 'linear-gradient(135deg, #C9956C, #B87355)',
                                        color: 'white', border: 'none',
                                        padding: '13px', borderRadius: '12px',
                                        fontSize: '13px', cursor: 'pointer',
                                        fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
                                    }}>Gunakan Desain Ini ↗</button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default function KatalogPage() {
    return (
        <Suspense fallback={
            <div style={{
                minHeight: '100vh', background: '#0a0604',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    border: '2px solid rgba(201,149,108,0.2)',
                    borderTop: '2px solid #C9956C',
                    animation: 'spin 1s linear infinite',
                }} />
                <style>{`@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}`}</style>
            </div>
        }>
            <KatalogContent />
        </Suspense>
    );
}