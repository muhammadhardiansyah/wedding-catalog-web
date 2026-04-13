'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function AdminLoginPage() {
    const router = useRouter();
    const { setAuth } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/admin/login', { email, password });
            setAuth(res.data.token, res.data.admin);
            router.push('/admin/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login gagal. Periksa email dan password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', background: '#0a0604',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem', position: 'relative', overflow: 'hidden',
        }}>
            <style>{`
        @keyframes pulse { 0%,100%{opacity:.4;} 50%{opacity:.8;} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px);} to{opacity:1;transform:translateY(0);} }
      `}</style>

            {/* BG Glow */}
            <div style={{
                position: 'absolute', top: '30%', left: '50%',
                transform: 'translate(-50%,-50%)',
                width: 500, height: 500, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(201,149,108,0.08) 0%, transparent 70%)',
                animation: 'pulse 4s ease-in-out infinite',
                pointerEvents: 'none',
            }} />

            {/* Card */}
            <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(201,149,108,0.2)',
                borderRadius: '24px', padding: '3rem',
                width: '100%', maxWidth: '420px',
                animation: 'fadeUp 0.6s ease both',
                backdropFilter: 'blur(8px)',
            }}>

                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        width: '52px', height: '52px',
                        background: 'linear-gradient(135deg, #C9956C, #B87355)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1rem',
                        boxShadow: '0 0 30px rgba(201,149,108,0.3)',
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '20px', color: 'white',
                    }}>✦</div>
                    <div style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '26px', color: '#FDFAF7', fontWeight: 300,
                    }}>Admin <em style={{ color: '#C9956C' }}>Panel</em></div>
                    <div style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '13px', color: 'rgba(253,250,247,0.35)',
                        marginTop: '6px',
                    }}>UndanganId Dashboard</div>
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '12px', padding: '12px 16px',
                        fontFamily: 'DM Sans, sans-serif', fontSize: '13px',
                        color: '#f87171', marginBottom: '1.5rem',
                    }}>{error}</div>
                )}

                {/* Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{
                            fontFamily: 'DM Sans, sans-serif', fontSize: '12px',
                            color: 'rgba(253,250,247,0.5)', letterSpacing: '1px',
                            textTransform: 'uppercase', display: 'block', marginBottom: '8px',
                        }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="admin@weddingcatalog.com"
                            onKeyDown={e => e.key === 'Enter' && handleLogin()}
                            style={{
                                width: '100%', padding: '13px 16px',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.08)',
                                background: 'rgba(255,255,255,0.04)',
                                color: '#FDFAF7', fontSize: '14px',
                                fontFamily: 'DM Sans, sans-serif', outline: 'none',
                            }}
                        />
                    </div>

                    <div>
                        <label style={{
                            fontFamily: 'DM Sans, sans-serif', fontSize: '12px',
                            color: 'rgba(253,250,247,0.5)', letterSpacing: '1px',
                            textTransform: 'uppercase', display: 'block', marginBottom: '8px',
                        }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            onKeyDown={e => e.key === 'Enter' && handleLogin()}
                            style={{
                                width: '100%', padding: '13px 16px',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.08)',
                                background: 'rgba(255,255,255,0.04)',
                                color: '#FDFAF7', fontSize: '14px',
                                fontFamily: 'DM Sans, sans-serif', outline: 'none',
                            }}
                        />
                    </div>

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        style={{
                            background: loading ? 'rgba(201,149,108,0.5)' : 'linear-gradient(135deg, #C9956C, #B87355)',
                            color: 'white', border: 'none',
                            padding: '14px', borderRadius: '12px',
                            fontSize: '14px', fontFamily: 'DM Sans, sans-serif',
                            fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '8px', transition: 'all 0.2s',
                            boxShadow: loading ? 'none' : '0 0 30px rgba(201,149,108,0.2)',
                        }}
                    >
                        {loading ? 'Masuk...' : 'Masuk ke Dashboard ✦'}
                    </button>
                </div>
            </div>
        </div>
    );
}