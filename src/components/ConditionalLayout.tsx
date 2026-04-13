'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Hanya sembunyikan di halaman demo dan admin
    const hideLayout = pathname.startsWith('/demo') || pathname.startsWith('/admin');

    console.log('pathname:', pathname, 'hideLayout:', hideLayout); // debug

    return (
        <>
            {!hideLayout && <Navbar />}
            <main style={{ flex: 1 }}>
                {children}
            </main>
            {!hideLayout && <Footer />}
        </>
    );
}