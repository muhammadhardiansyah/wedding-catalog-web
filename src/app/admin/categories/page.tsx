'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Category } from '@/types';
import { useWindowSize } from '@/hooks/useWindowSize';

export default function AdminCategoriesPage() {
    const { isMobile } = useWindowSize();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [newName, setNewName] = useState('');
    const [editName, setEditName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch { }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchCategories(); }, []);

    const showSuccess = (msg: string) => {
        setSuccess(msg);
        setTimeout(() => setSuccess(''), 3000);
    };

    const handleCreate = async () => {
        if (!newName.trim()) return;
        setSubmitting(true);
        setError('');
        try {
            await api.post('/admin/categories', { name: newName.trim() });
            setNewName('');
            showSuccess('Kategori berhasil ditambahkan!');
            fetchCategories();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal menambahkan kategori.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = async (id: number) => {
        if (!editName.trim()) return;
        setSubmitting(true);
        setError('');
        try {
            await api.put(`/admin/categories/${id}`, { name: editName.trim() });
            setEditingId(null);
            setEditName('');
            showSuccess('Kategori berhasil diperbarui!');
            fetchCategories();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal memperbarui kategori.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin ingin menghapus kategori ini? Desain yang terkait mungkin terpengaruh.')) return;
        setDeletingId(id);
        try {
            await api.delete(`/admin/categories/${id}`);
            showSuccess('Kategori berhasil dihapus!');
            fetchCategories();
        } catch {
            setError('Gagal menghapus kategori.');
        } finally {
            setDeletingId(null);
        }
    };

    const inputStyle = {
        flex: 1, padding: '11px 16px',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.04)',
        color: '#FDFAF7', fontSize: '14px',
        fontFamily: 'DM Sans, sans-serif', outline: 'none',
    };

    return (
        <div style={{ animation: 'fadeUp 0.5s ease both', maxWidth: '640px' }}>
            <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
      `}</style>

            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{
                    fontFamily: 'DM Sans, sans-serif', fontSize: '11px',
                    letterSpacing: '3px', color: '#C9956C',
                    textTransform: 'uppercase', marginBottom: '6px',
                }}>Kelola</div>
                <h1 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '36px', color: '#FDFAF7', fontWeight: 300,
                }}>Kategori <em style={{ color: '#C9956C' }}>Desain</em></h1>
            </div>

            {/* Alerts */}
            {error && (
                <div style={{
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: '12px', padding: '12px 16px',
                    fontFamily: 'DM Sans, sans-serif', fontSize: '13px',
                    color: '#f87171', marginBottom: '1.5rem',
                }}>{error}</div>
            )}
            {success && (
                <div style={{
                    background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)',
                    borderRadius: '12px', padding: '12px 16px',
                    fontFamily: 'DM Sans, sans-serif', fontSize: '13px',
                    color: '#34d399', marginBottom: '1.5rem',
                }}>{success}</div>
            )}

            {/* Add Form */}
            <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px', padding: '1.5rem',
                marginBottom: '1.5rem',
            }}>
                <div style={{
                    fontFamily: 'DM Sans, sans-serif', fontSize: '11px',
                    letterSpacing: '2px', color: 'rgba(253,250,247,0.3)',
                    textTransform: 'uppercase', marginBottom: '1rem',
                }}>Tambah Kategori Baru</div>
                <div style={{
                    display: 'flex', gap: '10px',
                    flexDirection: isMobile ? 'column' : 'row',
                }}>
                    <input
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleCreate()}
                        placeholder="Nama kategori baru..."
                        style={inputStyle}
                    />
                    <button
                        onClick={handleCreate}
                        disabled={submitting || !newName.trim()}
                        style={{
                            background: 'linear-gradient(135deg, #C9956C, #B87355)',
                            color: 'white', border: 'none',
                            padding: '11px 20px', borderRadius: '12px',
                            fontSize: '13px', fontFamily: 'DM Sans, sans-serif',
                            fontWeight: 500, cursor: submitting ? 'not-allowed' : 'pointer',
                            whiteSpace: 'nowrap', opacity: !newName.trim() ? 0.5 : 1,
                            width: isMobile ? '100%' : 'auto',
                        }}
                    >
                        {submitting ? '...' : '+ Tambah'}
                    </button>
                </div>
            </div>

            {/* List */}
            <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '16px', overflow: 'hidden',
            }}>
                {/* Header - sembunyikan di mobile */}
                {!isMobile && (
                    <div style={{
                        padding: '12px 1.5rem',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        background: 'rgba(255,255,255,0.02)',
                        display: 'flex', justifyContent: 'space-between',
                    }}>
                        <div style={{
                            fontFamily: 'DM Sans, sans-serif', fontSize: '11px',
                            color: 'rgba(253,250,247,0.3)', letterSpacing: '1px',
                            textTransform: 'uppercase',
                        }}>Nama Kategori</div>
                        <div style={{
                            fontFamily: 'DM Sans, sans-serif', fontSize: '11px',
                            color: 'rgba(253,250,247,0.3)', letterSpacing: '1px',
                            textTransform: 'uppercase',
                        }}>Jumlah Desain</div>
                    </div>
                )}

                {/* Loading */}
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

                {/* Rows */}
                {!loading && categories.map((cat, i) => (
                    <div key={cat.id} style={{
                        padding: isMobile ? '1rem' : '1rem 1.5rem',
                        borderBottom: i < categories.length - 1
                            ? '1px solid rgba(255,255,255,0.04)' : 'none',
                        transition: 'background 0.2s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        {editingId === cat.id ? (
                            /* Edit Mode */
                            <div style={{
                                display: 'flex', gap: '10px', alignItems: 'center',
                                flexDirection: isMobile ? 'column' : 'row',
                            }}>
                                <input
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') handleUpdate(cat.id);
                                        if (e.key === 'Escape') setEditingId(null);
                                    }}
                                    autoFocus
                                    style={inputStyle}
                                />
                                <div style={{ display: 'flex', gap: '8px', width: isMobile ? '100%' : 'auto' }}>
                                    <button
                                        onClick={() => handleUpdate(cat.id)}
                                        disabled={submitting}
                                        style={{
                                            flex: isMobile ? 1 : 'none',
                                            background: 'linear-gradient(135deg, #C9956C, #B87355)',
                                            color: 'white', border: 'none',
                                            padding: '10px 16px', borderRadius: '10px',
                                            fontSize: '12px', fontFamily: 'DM Sans, sans-serif',
                                            cursor: 'pointer', whiteSpace: 'nowrap',
                                        }}>Simpan</button>
                                    <button
                                        onClick={() => setEditingId(null)}
                                        style={{
                                            flex: isMobile ? 1 : 'none',
                                            background: 'rgba(255,255,255,0.04)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            color: 'rgba(253,250,247,0.5)',
                                            padding: '10px 16px', borderRadius: '10px',
                                            fontSize: '12px', fontFamily: 'DM Sans, sans-serif',
                                            cursor: 'pointer',
                                        }}>Batal</button>
                                </div>
                            </div>
                        ) : (
                            /* View Mode */
                            <div style={{
                                display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center', gap: '8px',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        width: '36px', height: '36px', flexShrink: 0,
                                        background: 'rgba(201,149,108,0.1)',
                                        border: '1px solid rgba(201,149,108,0.2)',
                                        borderRadius: '10px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontFamily: 'Cormorant Garamond, serif',
                                        fontSize: '14px', color: '#C9956C',
                                    }}>❋</div>
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{
                                            fontFamily: 'DM Sans, sans-serif',
                                            fontSize: '14px', color: '#FDFAF7', fontWeight: 500,
                                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                        }}>{cat.name}</div>
                                        <div style={{
                                            fontFamily: 'DM Sans, sans-serif',
                                            fontSize: '11px', color: 'rgba(253,250,247,0.3)', marginTop: '1px',
                                        }}>/{cat.slug} · {cat.designs_count || 0} desain</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                                    <button
                                        onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}
                                        style={{
                                            background: 'rgba(255,255,255,0.04)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            color: 'rgba(253,250,247,0.5)',
                                            padding: '6px 14px', borderRadius: '8px',
                                            fontSize: '12px', fontFamily: 'DM Sans, sans-serif',
                                            cursor: 'pointer',
                                        }}>Edit</button>
                                    <button
                                        onClick={() => handleDelete(cat.id)}
                                        disabled={deletingId === cat.id}
                                        style={{
                                            background: 'rgba(239,68,68,0.08)',
                                            border: '1px solid rgba(239,68,68,0.2)',
                                            color: '#f87171',
                                            padding: '6px 14px', borderRadius: '8px',
                                            fontSize: '12px', fontFamily: 'DM Sans, sans-serif',
                                            cursor: 'pointer',
                                        }}>
                                        {deletingId === cat.id ? '...' : 'Hapus'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}