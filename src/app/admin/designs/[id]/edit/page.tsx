'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import { Category, Tag } from '@/types';

export default function EditDesignPage() {
    const router = useRouter();
    const { id } = useParams();
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [form, setForm] = useState({
        title: '',
        description: '',
        thumbnail_url: '',
        canva_embed_url: '',
        canva_public_url: '',
        category_id: '',
        is_featured: false,
        is_active: true,
        price_type: 'free',
        price: '',
        tags: [] as number[],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [designRes, catRes, tagRes] = await Promise.all([
                    api.get(`/admin/designs/${id}`),
                    api.get('/categories'),
                    api.get('/tags'),
                ]);

                const d = designRes.data;
                setForm({
                    title: d.title || '',
                    description: d.description || '',
                    thumbnail_url: d.thumbnail_url || '',
                    canva_embed_url: d.canva_embed_url || '',
                    canva_public_url: d.canva_public_url || '',
                    category_id: String(d.category?.id || ''),
                    is_featured: d.is_featured || false,
                    is_active: d.is_active ?? true,
                    price_type: d.price_type || 'free',
                    price: d.price ? String(d.price) : '',
                    tags: d.tags?.map((t: Tag) => t.id) || [],
                });

                setCategories(catRes.data);
                setTags(tagRes.data);
            } catch {
                setError('Gagal memuat data desain.');
            } finally {
                setFetching(false);
            }
        };
        fetchData();
    }, [id]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('thumbnail', file);
            const res = await api.post('/admin/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setForm(f => ({ ...f, thumbnail_url: res.data.thumbnail_url }));
        } catch {
            setError('Gagal upload thumbnail.');
        } finally {
            setUploading(false);
        }
    };

    const handleTagToggle = (tagId: number) => {
        setForm(f => ({
            ...f,
            tags: f.tags.includes(tagId)
                ? f.tags.filter(t => t !== tagId)
                : [...f.tags, tagId],
        }));
    };

    const handleSubmit = async () => {
        setError('');
        if (!form.title || !form.canva_embed_url || !form.canva_public_url || !form.category_id) {
            setError('Judul, URL Canva, dan Kategori wajib diisi.');
            return;
        }
        setLoading(true);
        try {
            await api.put(`/admin/designs/${id}`, {
                ...form,
                category_id: Number(form.category_id),
                price: form.price ? Number(form.price) : null,
            });
            setSuccess('Desain berhasil diperbarui!');
            setTimeout(() => router.push('/admin/designs'), 1000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal memperbarui desain.');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%', padding: '12px 16px',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.04)',
        color: '#FDFAF7', fontSize: '14px',
        fontFamily: 'DM Sans, sans-serif', outline: 'none',
    };

    const labelStyle = {
        fontFamily: 'DM Sans, sans-serif', fontSize: '12px',
        color: 'rgba(253,250,247,0.5)', letterSpacing: '1px',
        textTransform: 'uppercase' as const,
        display: 'block', marginBottom: '8px',
    };

    if (fetching) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
            <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                border: '2px solid rgba(201,149,108,0.2)',
                borderTop: '2px solid #C9956C',
                animation: 'spin 1s linear infinite',
            }} />
            <style>{`@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}`}</style>
        </div>
    );

    return (
        <div style={{ animation: 'fadeUp 0.5s ease both', maxWidth: '720px' }}>
            <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}`}</style>

            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <button onClick={() => router.back()} style={{
                    background: 'none', border: 'none',
                    color: 'rgba(253,250,247,0.4)',
                    fontFamily: 'DM Sans, sans-serif', fontSize: '13px',
                    cursor: 'pointer', marginBottom: '1rem', padding: 0,
                }}>← Kembali</button>
                <div style={{
                    fontFamily: 'DM Sans, sans-serif', fontSize: '11px',
                    letterSpacing: '3px', color: '#C9956C',
                    textTransform: 'uppercase', marginBottom: '6px',
                }}>Edit</div>
                <h1 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '36px', color: '#FDFAF7', fontWeight: 300,
                }}>Edit <em style={{ color: '#C9956C' }}>Desain</em></h1>
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

            {/* Form */}
            <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '20px', padding: '2rem',
                display: 'flex', flexDirection: 'column', gap: '1.5rem',
            }}>

                {/* Title */}
                <div>
                    <label style={labelStyle}>Judul Desain *</label>
                    <input
                        value={form.title}
                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                        placeholder="contoh: Midnight Luxe"
                        style={inputStyle}
                    />
                </div>

                {/* Description */}
                <div>
                    <label style={labelStyle}>Deskripsi</label>
                    <textarea
                        value={form.description}
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        placeholder="Deskripsi singkat tentang desain ini..."
                        rows={3}
                        style={{ ...inputStyle, resize: 'vertical' }}
                    />
                </div>

                {/* Thumbnail */}
                <div>
                    <label style={labelStyle}>Thumbnail</label>
                    {form.thumbnail_url && (
                        <div style={{
                            marginBottom: '10px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '12px', padding: '10px 14px',
                            fontFamily: 'DM Sans, sans-serif', fontSize: '12px',
                            color: 'rgba(253,250,247,0.4)',
                        }}>
                            Thumbnail saat ini: {form.thumbnail_url}
                        </div>
                    )}
                    <div style={{
                        border: '1px dashed rgba(201,149,108,0.3)',
                        borderRadius: '12px', padding: '1.5rem',
                        textAlign: 'center',
                    }}>
                        <div style={{
                            fontFamily: 'DM Sans, sans-serif', fontSize: '13px',
                            color: 'rgba(253,250,247,0.4)',
                        }}>
                            {uploading ? 'Mengupload...' : 'Upload thumbnail baru'}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            id="thumbnail-upload"
                            style={{ display: 'none' }}
                        />
                    </div>
                    <label htmlFor="thumbnail-upload" style={{
                        display: 'block', textAlign: 'center', marginTop: '8px',
                        fontFamily: 'DM Sans, sans-serif', fontSize: '12px',
                        color: '#C9956C', cursor: 'pointer',
                    }}>Pilih File</label>
                </div>

                {/* Canva URL */}
                <div>
                    <label style={labelStyle}>URL Canva *</label>
                    <input
                        value={form.canva_public_url}
                        onChange={e => setForm(f => ({
                            ...f,
                            canva_public_url: e.target.value,
                            canva_embed_url: e.target.value
                                ? e.target.value.replace(/\?.*$/, '') + '?embed'
                                : '',
                        }))}
                        placeholder="https://www.canva.com/design/xxx/xxx/view"
                        style={inputStyle}
                    />
                    <div style={{
                        fontFamily: 'DM Sans, sans-serif', fontSize: '11px',
                        color: 'rgba(253,250,247,0.25)', marginTop: '6px',
                    }}>
                        Paste URL Canva biasa — embed URL akan digenerate otomatis
                    </div>
                    {form.canva_embed_url && (
                        <div style={{
                            marginTop: '8px',
                            background: 'rgba(52,211,153,0.05)',
                            border: '1px solid rgba(52,211,153,0.15)',
                            borderRadius: '10px', padding: '10px 14px',
                            fontFamily: 'DM Sans, sans-serif', fontSize: '11px',
                            color: 'rgba(52,211,153,0.7)',
                        }}>
                            ✓ Embed URL: {form.canva_embed_url}
                        </div>
                    )}
                </div>

                {/* Category */}
                <div>
                    <label style={labelStyle}>Kategori *</label>
                    <select
                        value={form.category_id}
                        onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                        style={{
                            ...inputStyle,
                            cursor: 'pointer',
                            colorScheme: 'dark',
                        }}
                    >
                        <option value="" style={{ background: '#1a0f08', color: '#FDFAF7' }}>
                            Pilih Kategori
                        </option>
                        {categories.map(cat => (
                            <option
                                key={cat.id}
                                value={cat.id}
                                style={{ background: '#1a0f08', color: '#FDFAF7' }}
                            >
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Price Type */}
                <div>
                    <label style={labelStyle}>Tipe Harga</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {['free', 'premium'].map(type => (
                            <button key={type} onClick={() => setForm(f => ({ ...f, price_type: type }))} style={{
                                flex: 1, padding: '10px', borderRadius: '12px',
                                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '13px',
                                border: form.price_type === type ? '1px solid #C9956C' : '1px solid rgba(255,255,255,0.08)',
                                background: form.price_type === type ? 'rgba(201,149,108,0.1)' : 'rgba(255,255,255,0.03)',
                                color: form.price_type === type ? '#C9956C' : 'rgba(253,250,247,0.4)',
                                transition: 'all 0.2s',
                            }}>
                                {type === 'free' ? 'Gratis' : 'Premium'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Price */}
                {form.price_type === 'premium' && (
                    <div>
                        <label style={labelStyle}>Harga (Rp)</label>
                        <input
                            type="number"
                            value={form.price}
                            onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                            placeholder="contoh: 50000"
                            style={inputStyle}
                        />
                    </div>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                    <div>
                        <label style={labelStyle}>Tags</label>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {tags.map(tag => (
                                <button key={tag.id} onClick={() => handleTagToggle(tag.id)} style={{
                                    padding: '6px 16px', borderRadius: '100px',
                                    cursor: 'pointer', fontSize: '12px',
                                    fontFamily: 'DM Sans, sans-serif',
                                    border: form.tags.includes(tag.id) ? '1px solid #C9956C' : '1px solid rgba(255,255,255,0.08)',
                                    background: form.tags.includes(tag.id) ? 'rgba(201,149,108,0.15)' : 'rgba(255,255,255,0.03)',
                                    color: form.tags.includes(tag.id) ? '#C9956C' : 'rgba(253,250,247,0.4)',
                                    transition: 'all 0.2s',
                                }}>{tag.name}</button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Toggles */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {[
                        { key: 'is_featured', label: 'Featured' },
                        { key: 'is_active', label: 'Aktif' },
                    ].map(toggle => (
                        <button key={toggle.key}
                            onClick={() => setForm(f => ({ ...f, [toggle.key]: !f[toggle.key as keyof typeof f] }))}
                            style={{
                                padding: '8px 20px', borderRadius: '100px',
                                cursor: 'pointer', fontSize: '13px',
                                fontFamily: 'DM Sans, sans-serif',
                                border: form[toggle.key as keyof typeof form] ? '1px solid #C9956C' : '1px solid rgba(255,255,255,0.08)',
                                background: form[toggle.key as keyof typeof form] ? 'rgba(201,149,108,0.1)' : 'rgba(255,255,255,0.03)',
                                color: form[toggle.key as keyof typeof form] ? '#C9956C' : 'rgba(253,250,247,0.4)',
                                transition: 'all 0.2s',
                            }}>
                            {form[toggle.key as keyof typeof form] ? '✓' : '○'} {toggle.label}
                        </button>
                    ))}
                </div>

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                        background: loading ? 'rgba(201,149,108,0.4)' : 'linear-gradient(135deg, #C9956C, #B87355)',
                        color: 'white', border: 'none',
                        padding: '14px', borderRadius: '12px',
                        fontSize: '14px', fontFamily: 'DM Sans, sans-serif',
                        fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer',
                        boxShadow: loading ? 'none' : '0 0 30px rgba(201,149,108,0.2)',
                        transition: 'all 0.2s', marginTop: '0.5rem',
                    }}
                >
                    {loading ? 'Menyimpan...' : 'Perbarui Desain ✦'}
                </button>
            </div>
        </div>
    );
}