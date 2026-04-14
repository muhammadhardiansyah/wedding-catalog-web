'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import api from '@/lib/api';
import { Design } from '@/types';
import { useWindowSize } from '@/hooks/useWindowSize';
import { useRouter } from 'next/navigation';
import { whyUsFeatures } from '@/lib/constants';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [featuredDesigns, setFeaturedDesigns] = useState<Design[]>([]);
  const [categories, setCategories] = useState<string[]>(['Semua']);
  const [totalDesigns, setTotalDesigns] = useState(0);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const { isMobile, isTablet } = useWindowSize();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [designsRes, categoriesRes] = await Promise.all([
          api.get(`/designs?${activeCategory !== 'Semua' ? `category=${activeCategory.toLowerCase()}&` : ''}per_page=4`),
          api.get('/categories'),
        ]);
        setFeaturedDesigns(designsRes.data.data);
        setTotalDesigns(designsRes.data.total);
        setCategories(['Semua', ...categoriesRes.data.map((c: any) => c.name)]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeCategory]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div onMouseMove={handleMouseMove} style={{ background: 'var(--background)', minHeight: '100vh' }}>

      {/* CURSOR GLOW */}
      <div style={{
        position: 'fixed',
        left: mousePos.x - 200, top: mousePos.y - 200,
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,149,108,0.08) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 9999,
        transition: 'left 0.1s, top 0.1s',
      }} />

      <style>{`
        @keyframes pulse { 0%,100%{opacity:.6;transform:scale(1);} 50%{opacity:1;transform:scale(1.1);} }
        @keyframes float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-16px);} }
        @keyframes marquee { from{transform:translateX(0);} to{transform:translateX(-50%);} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(40px);} to{opacity:1;transform:translateY(0);} }
        @keyframes shimmer { 0%,100%{opacity:.5;} 50%{opacity:1;} }
        @keyframes spin-slow { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
        @keyframes cardIn { from{opacity:0;transform:translateY(60px) scale(.95);} to{opacity:1;transform:translateY(0) scale(1);} }
        .hero-title { animation: fadeUp .8s ease both; }
        .hero-sub { animation: fadeUp .8s ease .2s both; }
        .hero-cta { animation: fadeUp .8s ease .4s both; }
        .hero-stats { animation: fadeUp .8s ease .6s both; }
        .float-badge { animation: float 3s ease-in-out infinite; }
        .float-badge2 { animation: float 4s ease-in-out infinite .5s; }
        .float-badge3 { animation: float 3.5s ease-in-out infinite 1s; }
        .shimmer-text { animation: shimmer 2s ease-in-out infinite; }
        @keyframes skeleton { 0%{opacity:.4;} 50%{opacity:.8;} 100%{opacity:.4;} }
        .skeleton { animation: skeleton 1.5s ease-in-out infinite; }
      `}</style>

      {/* HERO */}
      <section ref={heroRef} style={{
        minHeight: '100vh',
        background: 'var(--background-gradient)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '6rem 2rem 4rem',
        position: 'relative', overflow: 'hidden',
      }}>

        {/* BG GRID */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(201,149,108,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,149,108,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          transform: `translateY(${scrollY * 0.3}px)`,
        }} />

        {/* GLOW ORBS */}
        <div style={{
          position: 'absolute', top: '20%', left: '10%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,149,108,0.15) 0%, transparent 70%)',
          animation: 'pulse 4s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '10%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(180,100,100,0.1) 0%, transparent 70%)',
          animation: 'pulse 5s ease-in-out infinite 1s',
        }} />

        {/* FLOATING BADGES */}
        {!isMobile && (
          <div className="float-badge" style={{
            position: 'absolute', top: '18%', left: '8%',
            background: 'rgba(201,149,108,0.1)',
            border: '1px solid rgba(201,149,108,0.3)',
            borderRadius: '100px', padding: '8px 16px',
            fontFamily: 'DM Sans, sans-serif', fontSize: '12px',
            color: 'var(--accent-light)', backdropFilter: 'blur(8px)',
          }}>✦ Islami</div>
        )}

        {!isMobile && (
          <div className="float-badge2" style={{
            position: 'absolute', top: '30%', right: '6%',
            background: 'rgba(167,139,250,0.1)',
            border: '1px solid rgba(167,139,250,0.3)',
            borderRadius: '100px', padding: '8px 16px',
            fontFamily: 'DM Sans, sans-serif', fontSize: '12px',
            color: '#a78bfa', backdropFilter: 'blur(8px)',
          }}>◈ Modern</div>
        )}

        {!isMobile && (
          <div className="float-badge3" style={{
            position: 'absolute', bottom: '30%', left: '5%',
            background: 'rgba(244,114,182,0.1)',
            border: '1px solid rgba(244,114,182,0.3)',
            borderRadius: '100px', padding: '8px 16px',
            fontFamily: 'DM Sans, sans-serif', fontSize: '12px',
            color: '#f472b6', backdropFilter: 'blur(8px)',
          }}>❋ Floral</div>
        )}

        {/* SPINNING RING */}
        {!isMobile && (
          <div style={{
            position: 'absolute', top: '60%', right: '8%',
            width: 80, height: 80,
            border: '1px solid rgba(201,149,108,0.2)',
            borderTop: '1px solid rgba(201,149,108,0.8)',
            borderRadius: '50%',
            animation: 'spin-slow 8s linear infinite',
          }} />
        )}

        {/* HERO CONTENT */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '700px' }}>
          <div className="shimmer-text" style={{
            display: 'inline-block',
            background: 'var(--rose-gradient-text)',
            backgroundSize: '200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '11px', letterSpacing: '6px',
            textTransform: 'uppercase', marginBottom: '1.5rem',
          }}>✦ Katalog Undangan Digital No.1</div>

          <h1 className="hero-title" style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: isMobile ? '42px' : isTablet ? '56px' : 'clamp(42px, 8vw, 72px)',
            color: 'var(--foreground)', lineHeight: 1.1,
            fontWeight: 300, marginBottom: '1rem', letterSpacing: '-1px',
          }}>
            Undanganmu,<br />
            <span style={{
              background: 'var(--rose-gradient-text)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontStyle: 'italic',
            }}>Ceritamu.</span>
          </h1>

          <p className="hero-sub" style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '16px', color: 'var(--text-muted-light)',
            lineHeight: 1.8, fontWeight: 300,
            maxWidth: '480px', margin: '0 auto 2.5rem',
          }}>
            Pilih dari ratusan desain premium eksklusif.
            Preview langsung. Pesan dengan mudah. Kirim ke semua tamu.
          </p>

          <div className="hero-cta" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/katalog" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'var(--rose-gradient-button)',
                color: 'white', border: 'none',
                padding: '15px 36px', borderRadius: '100px',
                fontSize: '14px', fontFamily: 'DM Sans, sans-serif',
                fontWeight: 500, cursor: 'pointer',
                boxShadow: '0 0 40px var(--rose-glow)',
                transition: 'all 0.3s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 0 60px var(--rose-glow)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 0 40px var(--rose-glow)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >Jelajahi Sekarang ✦</button>
            </Link>
            <Link href="/kategori" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'transparent',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-medium)',
                padding: '15px 36px', borderRadius: '100px',
                fontSize: '14px', fontFamily: 'DM Sans, sans-serif',
                fontWeight: 300, cursor: 'pointer',
                backdropFilter: 'blur(8px)', transition: 'all 0.3s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(201,149,108,0.5)';
                  e.currentTarget.style.color = 'var(--accent-light)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >Lihat Kategori →</button>
            </Link>
          </div>

          {/* STATS */}
          <div className="hero-stats" style={{
            display: 'flex', justifyContent: 'center',
            marginTop: '4rem',
            border: '1px solid var(--border-color)',
            borderRadius: '20px', overflow: 'hidden',
            background: 'var(--bg-overlay-light)',
            backdropFilter: 'blur(8px)',
            maxWidth: isMobile ? '100%' : '400px',
            margin: '4rem auto 0',
          }}>
            {[
              { val: String(totalDesigns) + '+', label: 'Desain' },
              { val: String(categories.length - 1), label: 'Kategori' },
              { val: '∞', label: 'Inspirasi' },
            ].map((s, i) => (
              <div key={i} style={{
                flex: 1, padding: '1.2rem 1rem', textAlign: 'center',
                borderRight: i < 2 ? '1px solid var(--border-color)' : 'none',
              }}>
                <div style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '30px', color: 'var(--accent-light)', fontWeight: 400,
                }}>{s.val}</div>
                <div style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '10px', color: 'var(--text-muted-lighter)',
                  letterSpacing: '2px', textTransform: 'uppercase', marginTop: '2px',
                }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SCROLL INDICATOR */}
        <div style={{
          position: 'absolute', bottom: '2rem',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '6px',
          animation: 'float 2s ease-in-out infinite',
        }}>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'var(--text-muted-lighter)', letterSpacing: '2px' }}>SCROLL</div>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, rgba(201,149,108,0.5), transparent)' }} />
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{
        background: 'var(--accent-light)', padding: '14px 0',
        overflow: 'hidden', whiteSpace: 'nowrap',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{ display: 'inline-block', animation: 'marquee 20s linear infinite' }}>
          {[...categories.filter(c => c !== 'Semua'), ...categories.filter(c => c !== 'Semua')].map((item, i) => (
            <span key={i} style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '16px', color: '#2A1810',
              marginRight: '48px', fontStyle: 'italic',
            }}>{item} ✦</span>
          ))}
        </div>
      </div>

      {/* FEATURED DESIGNS */}
      <section style={{ padding: '5rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: '11px',
              letterSpacing: '4px', color: 'var(--accent-light)',
              textTransform: 'uppercase', marginBottom: '8px',
            }}>✦ Pilihan Terbaik</div>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '40px', color: 'var(--foreground)', fontWeight: 300,
            }}>Desain <em style={{ color: 'var(--accent-light)' }}>Terpopuler</em></h2>
          </div>
          <Link href="/katalog" style={{ textDecoration: 'none' }}>
            <span style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: '13px',
              color: 'var(--accent-light)', border: '1px solid var(--border-color)',
              padding: '8px 20px', borderRadius: '100px', cursor: 'pointer',
            }}>Lihat semua →</span>
          </Link>
        </div>

        {/* CATEGORY PILLS dari API */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              background: activeCategory === cat ? 'var(--accent-light)' : 'var(--bg-overlay-medium)',
              color: activeCategory === cat ? 'white' : 'var(--text-muted)',
              border: activeCategory === cat ? '1px solid var(--accent-light)' : '1px solid var(--border-medium)',
              padding: '8px 20px', borderRadius: '100px',
              fontSize: '12px', fontFamily: 'DM Sans, sans-serif',
              cursor: 'pointer', transition: 'all 0.25s',
              fontWeight: activeCategory === cat ? 500 : 300,
            }}>{cat}</button>
          ))}
        </div>

        {/* SKELETON LOADING */}
        {loading && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '20px',
          }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton" style={{
                background: 'var(--bg-overlay-medium)',
                borderRadius: '20px', overflow: 'hidden',
                border: '1px solid var(--border-light)',
              }}>
                <div style={{ height: '200px', background: 'var(--bg-overlay-medium)' }} />
                <div style={{ padding: '1.2rem' }}>
                  <div style={{ height: '18px', background: 'var(--border-light)', borderRadius: '8px', marginBottom: '8px', width: '70%' }} />
                  <div style={{ height: '12px', background: 'var(--bg-overlay-medium)', borderRadius: '8px', width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CARDS dari API */}
        {!loading && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: isMobile ? '16px' : '20px',
          }}>
            {featuredDesigns.length === 0 ? (
              <div style={{
                gridColumn: '1/-1', textAlign: 'center', padding: '3rem',
                fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
                color: 'var(--text-muted-lighter)',
              }}>
                Belum ada desain featured. Tandai desain sebagai featured di admin panel.
              </div>
            ) : featuredDesigns.map((design, i) => (
              <div key={design.id}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  background: 'var(--bg-overlay-light)',
                  borderRadius: '20px', overflow: 'hidden',
                  border: hoveredCard === i
                    ? '1px solid rgba(201,149,108,0.6)'
                    : i === 0 ? '1px solid rgba(201,149,108,0.3)' : '1px solid var(--border-light)',
                  transition: 'all 0.3s',
                  transform: hoveredCard === i ? 'translateY(-8px)' : 'translateY(0)',
                  cursor: 'pointer',
                  boxShadow: hoveredCard === i ? '0 20px 60px rgba(201,149,108,0.15)' : 'none',
                  animation: `cardIn 0.6s ease ${i * 0.1}s both`,
                }}>

                {/* Thumbnail */}
                <div style={{
                  height: '200px', position: 'relative',
                  overflow: 'hidden', background: '#1a0f08',
                }}>
                  {design.thumbnail_url && !design.thumbnail_url.includes('placeholder') ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${design.thumbnail_url}`}
                      alt={design.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%',
                      background: `radial-gradient(circle, rgba(201,149,108,0.15), transparent)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{ textAlign: 'center', fontFamily: 'Cormorant Garamond, serif' }}>
                        <div style={{ fontSize: '11px', letterSpacing: '4px', color: '#C9956C', marginBottom: '8px' }}>THE WEDDING OF</div>
                        <div style={{ fontSize: '20px', color: 'var(--foreground)', fontStyle: 'italic' }}>{design.title}</div>
                        <div style={{ width: '36px', height: '1px', background: '#C9956C', margin: '10px auto' }} />
                      </div>
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
                    fontSize: '14px', color: '#C9956C',
                    backdropFilter: 'blur(8px)',
                  }}>♡</div>
                </div>

                {/* Info */}
                <div style={{ padding: '1.2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{ flex: 1, minWidth: 0, marginRight: '8px' }}>
                      <div style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '18px', color: 'var(--foreground)', fontWeight: 500,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
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
                      borderRadius: '100px', fontFamily: 'DM Sans, sans-serif',
                      fontWeight: 500, flexShrink: 0,
                    }}>
                      {design.price_type === 'free' ? 'Gratis' : 'Premium'}
                    </div>
                  </div>

                  {design.tags?.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '14px', flexWrap: 'wrap' }}>
                      {design.tags.map(tag => (
                        <span key={tag.id} style={{
                          background: 'var(--bg-overlay-medium)',
                          border: '1px solid var(--border-medium)',
                          color: 'var(--text-muted)',
                          borderRadius: '4px',
                          padding: '2px 8px',
                          fontSize: '11px',
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
                    <button
                      onClick={() => router.push('/katalog')}
                      style={{
                        flex: 1,
                        background: 'transparent', color: 'var(--text-muted)',
                        border: '1px solid var(--border-medium)',
                        padding: '11px', borderRadius: '12px',
                        fontSize: '12px', cursor: 'pointer',
                        fontFamily: 'DM Sans, sans-serif',
                      }}>Lihat Semua</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/katalog" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'transparent', color: 'var(--accent-light)',
              border: '1px solid var(--accent-light)',
              padding: '14px 40px', borderRadius: '100px',
              fontSize: '14px', fontFamily: 'DM Sans, sans-serif',
              fontWeight: 500, cursor: 'pointer', transition: 'all 0.3s',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--rose-glow)';
                e.currentTarget.style.boxShadow = '0 0 30px var(--rose-glow)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >Lihat Semua Desain →</button>
          </Link>
        </div>
      </section>

      {/* WHY US */}
      <section style={{
        padding: '5rem 2rem',
        borderTop: '1px solid var(--border-light)',
        background: 'var(--bg-overlay-light)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            fontFamily: 'DM Sans, sans-serif', fontSize: '11px',
            letterSpacing: '4px', color: 'var(--accent-light)',
            textTransform: 'uppercase', marginBottom: '8px',
          }}>Kenapa UndanganId?</div>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '40px', color: 'var(--foreground)',
            fontWeight: 300, marginBottom: '3.5rem',
          }}>Yang bikin kita <em style={{ color: 'var(--accent-light)' }}>beda.</em></h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
          }}>
            {whyUsFeatures.map((item, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '20px', padding: '2rem', textAlign: 'left',
                transition: 'all 0.3s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.borderColor = `${item.color}40`;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  width: '44px', height: '44px',
                  background: `${item.color}15`,
                  border: `1px solid ${item.color}30`,
                  borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', color: item.color,
                  marginBottom: '1.2rem',
                  fontFamily: 'Cormorant Garamond, serif',
                }}>{item.icon}</div>
                <div style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '20px', color: 'var(--foreground)',
                  fontWeight: 500, marginBottom: '8px',
                }}>{item.title}</div>
                <p style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '13px', color: 'var(--text-muted)',
                  lineHeight: 1.7, fontWeight: 300,
                }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{
        padding: '5rem 2rem', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(201,149,108,0.08) 0%, transparent 70%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(32px, 6vw, 56px)',
            color: 'var(--foreground)', fontWeight: 300,
            lineHeight: 1.2, marginBottom: '1.5rem',
          }}>
            Siap buat undangan<br />
            <em style={{ color: 'var(--accent-light)' }}>yang nggak biasa?</em>
          </h2>
          <p style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '15px', color: 'var(--text-muted)',
            marginBottom: '2.5rem', fontWeight: 300,
          }}>Gratis. Tanpa daftar. Langsung pilih.</p>
          <Link href="/katalog" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'linear-gradient(135deg, #C9956C, #B87355)',
              color: 'white', border: 'none',
              padding: '16px 48px', borderRadius: '100px',
              fontSize: '15px', fontFamily: 'DM Sans, sans-serif',
              fontWeight: 500, cursor: 'pointer',
              boxShadow: '0 0 60px rgba(201,149,108,0.3)',
              transition: 'all 0.3s',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 0 80px rgba(201,149,108,0.5)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 0 60px rgba(201,149,108,0.3)';
              }}
            >Mulai Eksplorasi ✦</button>
          </Link>
        </div>
      </section>

    </div>
  );
}