export default function Footer() {
    return (
        <footer style={{
            background: '#2A1810',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            borderTop: '1px solid rgba(201,149,108,0.15)',
            marginTop: 'auto',
        }}>
            <div style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '22px',
                color: '#F5E6DC',
                marginBottom: '8px',
                fontWeight: 300,
            }}>
                <span style={{ color: '#C9956C' }}>✦</span> UndanganId
            </div>
            <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '12px',
                color: 'rgba(253,248,245,0.35)',
                letterSpacing: '1px',
            }}>
                Dibuat dengan cinta · untuk hari paling istimewa dalam hidupmu
            </p>
        </footer>
    );
}