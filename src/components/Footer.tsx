export default function Footer() {
    return (
        <footer style={{
            background: 'var(--background-secondary)',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            borderTop: '1px solid var(--border-color)',
            marginTop: 'auto',
        }}>
            <div style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '22px',
                color: 'var(--foreground)',
                marginBottom: '8px',
                fontWeight: 400,
            }}>
                <span style={{ color: 'var(--accent-light)' }}>✦</span> UndanganId
            </div>
            <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '12px',
                color: 'var(--text-muted)',
                letterSpacing: '1px',
            }}>
                Dibuat dengan cinta · untuk hari paling istimewa dalam hidupmu
            </p>
        </footer>
    );
}