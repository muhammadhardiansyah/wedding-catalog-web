// Category color themes - can be enhanced by API in the future
export const categoryColors = [
    { bg: 'rgba(201,149,108,0.1)', border: 'rgba(201,149,108,0.3)', accent: '#C9956C' },
    { bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.3)', accent: '#a78bfa' },
    { bg: 'rgba(244,114,182,0.1)', border: 'rgba(244,114,182,0.3)', accent: '#f472b6' },
    { bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.3)', accent: '#34d399' },
    { bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)', accent: '#fbbf24' },
    { bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.3)', accent: '#60a5fa' },
];

// Category icons mapping - can be provided by API in the future
export const categoryIcons: Record<string, string> = {
    rustic: '🌿',
    modern: '◈',
    islami: '☪',
    floral: '❋',
    minimalist: '○',
    elegant: '✦',
};

// Why us features - can be moved to API endpoint in the future
export const whyUsFeatures = [
    { icon: '✦', title: 'Desain Eksklusif', desc: 'Template premium dari desainer top, khusus untuk momen pernikahanmu.', color: '#C9956C' },
    { icon: '♡', title: 'Mudah Edit', desc: 'Langsung edit di Canva. Ganti nama, tanggal, foto. Semudah itu.', color: '#f472b6' },
    { icon: '◈', title: 'Preview Dulu', desc: 'Lihat tampilan utuh sebelum pilih. No surprises.', color: '#a78bfa' },
    { icon: '❋', title: 'Update Terus', desc: 'Desain baru setiap minggu. Always fresh, always on trend.', color: '#52b788' },
];

// Admin dashboard stat card labels - can be moved to API in the future
export const statCardLabels = (stats: any) => [
    { label: 'Total Desain', icon: '✦', color: '#C9956C' },
    { label: 'Kategori', icon: '❋', color: '#a78bfa' },
    { label: 'Total Views', icon: '◈', color: '#34d399' },
    { label: 'Featured', icon: '♡', color: '#f472b6' },
];
