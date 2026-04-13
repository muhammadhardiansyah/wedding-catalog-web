'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Design } from '@/types';
import { useWindowSize } from '@/hooks/useWindowSize';

export default function DemoPage() {
    const { slug } = useParams();
    const router = useRouter();
    const { isMobile } = useWindowSize();
    const [design, setDesign] = useState<Design | null>(null);
    const [loading, setLoading] = useState(true);
    const [showInfo, setShowInfo] = useState(true);

    useEffect(() => {
        const fetchDesign = async () => {
            try {
                const res = await api.get(`/designs/${slug}`);
                setDesign(res.data);
                await api.post(`/designs/${slug}/view`).catch(() => { });
            } catch {
                router.push('/katalog');
            } finally {
                setLoading(false);
            }
        };
        fetchDesign();
    }, [slug]);

    const handleWhatsApp = () => {
        const number = process.env.NEXT_PUBLIC_WA_NUMBER;
        const message = encodeURIComponent(
            `Halo, saya tertarik dengan desain undangan *${design?.title}* yang saya lihat di website. Boleh saya tanya lebih lanjut?`
        );
        window.open(`https://wa.me/${number}?text=${message}`, '_blank');
    };

    if (loading) return (
        <div style={{
            minHeight: '100vh', background: '#0a0604',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: '1rem',
        }}>
            <style>{`@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}`}</style>
            <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                border: '2px solid rgba(201,149,108,0.2)',
                borderTop: '2px solid #C9956C',
                animation: 'spin 1s linear infinite',
            }} />
            <div style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: '13px',
                color: 'rgba(253,250,247,0.3)',
            }}>Memuat demo...</div>
        </div>
    );

    if (!design) return null;

    return (
        <div style={{
            width: '100vw', height: '100vh',
            background: '#0a0604', overflow: 'hidden',
            position: 'relative', display: 'flex',
            flexDirection: 'column',
        }}>
            <style>{`
        @keyframes fadeDown { from{opacity:0;transform:translateY(-20px);} to{opacity:1;transform:translateY(0);} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
        @keyframes pulse { 0%,100%{opacity:.6;} 50%{opacity:1;} }
      `}</style>

            {/* TOP BAR */}
            {showInfo && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0,
                    zIndex: 100, padding: isMobile ? '12px 16px' : '14px 24px',
                    background: 'linear-gradient(to bottom, rgba(10,6,4,0.95), transparent)',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', gap: '12px',
                    animation: 'fadeDown 0.5s ease both',
                }}>
                    {/* Left - Back + Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                        <button
                            onClick={() => router.back()}
                            style={{
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                color: '#FDFAF7', width: '36px', height: '36px',
                                borderRadius: '10px', cursor: 'pointer',
                                fontSize: '14px', flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>←</button>

                        <div style={{ minWidth: 0 }}>
                            <div style={{
                                fontFamily: 'Cormorant Garamond, serif',
                                fontSize: isMobile ? '16px' : '20px',
                                color: '#FDFAF7', fontWeight: 400,
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>{design.title}</div>
                            {!isMobile && (
                                <div style={{
                                    fontFamily: 'DM Sans, sans-serif',
                                    fontSize: '11px', color: 'rgba(253,250,247,0.4)',
                                    marginTop: '1px',
                                }}>{design.category?.name} · {design.price_type === 'free' ? 'Gratis' : 'Premium'}</div>
                            )}
                        </div>
                    </div>

                    {/* Right - Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        {/* Tags - desktop only */}
                        {!isMobile && design.tags?.slice(0, 2).map(tag => (
                            <span key={tag.id} style={{
                                background: 'rgba(201,149,108,0.1)',
                                border: '1px solid rgba(201,149,108,0.2)',
                                color: '#C9956C', fontSize: '11px',
                                padding: '4px 12px', borderRadius: '100px',
                                fontFamily: 'DM Sans, sans-serif',
                            }}>{tag.name}</span>
                        ))}

                        {/* Hide/Show UI button */}
                        <button
                            onClick={() => setShowInfo(false)}
                            style={{
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'rgba(253,250,247,0.5)',
                                padding: '8px 14px', borderRadius: '10px',
                                fontSize: '12px', fontFamily: 'DM Sans, sans-serif',
                                cursor: 'pointer', whiteSpace: 'nowrap',
                            }}>Mode Imersif</button>

                        {/* WhatsApp CTA */}
                        <button
                            onClick={handleWhatsApp}
                            style={{
                                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                                color: 'white', border: 'none',
                                padding: isMobile ? '8px 14px' : '10px 20px',
                                borderRadius: '12px',
                                fontSize: isMobile ? '12px' : '13px',
                                fontFamily: 'DM Sans, sans-serif',
                                fontWeight: 500, cursor: 'pointer',
                                boxShadow: '0 0 20px rgba(37,211,102,0.2)',
                                whiteSpace: 'nowrap',
                                display: 'flex', alignItems: 'center', gap: '6px',
                            }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            {isMobile ? 'Pesan' : 'Pesan Sekarang'}
                        </button>
                    </div>
                </div>
            )}

            {/* IFRAME FULLSCREEN */}
            <div style={{ flex: 1, position: 'relative' }}>
                <iframe
                    src={design.canva_embed_url}
                    style={{
                        width: '100%', height: '100%',
                        border: 'none', display: 'block',
                    }}
                    allowFullScreen
                />
            </div>

            {/* BOTTOM BAR */}
            {showInfo && (
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    zIndex: 100,
                    background: 'linear-gradient(to top, rgba(10,6,4,0.95), transparent)',
                    padding: isMobile ? '20px 16px 16px' : '24px 24px 20px',
                    display: 'flex', alignItems: 'flex-end',
                    justifyContent: 'space-between', gap: '12px',
                    animation: 'fadeUp 0.5s ease both',
                }}>
                    {/* Left - Design info */}
                    <div>
                        {design.description && !isMobile && (
                            <p style={{
                                fontFamily: 'DM Sans, sans-serif',
                                fontSize: '13px', color: 'rgba(253,250,247,0.45)',
                                lineHeight: 1.6, fontWeight: 300,
                                maxWidth: '400px', marginBottom: '8px',
                            }}>{design.description}</p>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            <div style={{
                                background: design.price_type === 'free' ? 'rgba(52,211,153,0.1)' : 'rgba(251,191,36,0.1)',
                                color: design.price_type === 'free' ? '#34d399' : '#fbbf24',
                                border: `1px solid ${design.price_type === 'free' ? 'rgba(52,211,153,0.3)' : 'rgba(251,191,36,0.3)'}`,
                                fontSize: '11px', padding: '4px 12px',
                                borderRadius: '100px', fontFamily: 'DM Sans, sans-serif',
                            }}>
                                {design.price_type === 'free' ? 'Gratis' : 'Premium'}
                            </div>
                            <div style={{
                                fontFamily: 'DM Sans, sans-serif', fontSize: '12px',
                                color: 'rgba(253,250,247,0.3)',
                            }}>{design.view_count} kali dilihat</div>
                        </div>
                    </div>

                    {/* Right - CTA */}
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                        <button
                            onClick={() => router.back()}
                            style={{
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'rgba(253,250,247,0.6)',
                                padding: '11px 20px', borderRadius: '12px',
                                fontSize: '13px', fontFamily: 'DM Sans, sans-serif',
                                cursor: 'pointer',
                            }}>Kembali</button>
                        <button
                            onClick={handleWhatsApp}
                            style={{
                                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                                color: 'white', border: 'none',
                                padding: '11px 24px', borderRadius: '12px',
                                fontSize: '13px', fontFamily: 'DM Sans, sans-serif',
                                fontWeight: 500, cursor: 'pointer',
                                boxShadow: '0 0 30px rgba(37,211,102,0.2)',
                                display: 'flex', alignItems: 'center', gap: '8px',
                            }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Pesan Sekarang
                        </button>
                    </div>
                </div>
            )}

            {/* SHOW UI BUTTON - muncul saat mode imersif */}
            {!showInfo && (
                <button
                    onClick={() => setShowInfo(true)}
                    style={{
                        position: 'absolute', bottom: '1.5rem', right: '1.5rem',
                        zIndex: 100,
                        background: 'rgba(10,6,4,0.8)',
                        border: '1px solid rgba(201,149,108,0.3)',
                        color: '#C9956C', padding: '10px 18px',
                        borderRadius: '100px', cursor: 'pointer',
                        fontFamily: 'DM Sans, sans-serif', fontSize: '12px',
                        backdropFilter: 'blur(8px)',
                        animation: 'fadeUp 0.3s ease both',
                        display: 'flex', alignItems: 'center', gap: '6px',
                    }}>
                    ✦ Tampilkan Info
                </button>
            )}
        </div>
    );
}