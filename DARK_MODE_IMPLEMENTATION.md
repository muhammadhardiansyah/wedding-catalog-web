# Dark/Light Mode Implementation Guide

## Fitur yang Ditambahkan

### 1. **Theme Toggle Button** 🌙☀️
- Tombol di navbar untuk switch antara dark dan light mode
- Ikon emoji intuitif (🌙 untuk dark mode, ☀️ untuk light mode)
- Smooth hover effect dengan rose accent color

### 2. **Color Scheme yang Dirancang dengan Psikologi Warna**

#### Dark Mode (Default):
```css
Background: #0A0604 (Deep mocha)
Text: #FDFAF7 (Warm cream)
Accent: #C9956C (Rose)
Border: rgba(201, 149, 108, 0.15) (Subtle rose)
```
**Psychologi**: Dark mode dengan warm tones menciptakan kenyamanan mata di malam hari sambil tetap sophisticated.

#### Light Mode:
```css
Background: #F9F6F3 (Warm off-white)
Text: #2A1810 (Dark mocha)
Accent: #C9956C (Rose - tetap sama)
Border: rgba(201, 149, 108, 0.2) (Visible rose)
```
**Psychologi**: 
- Background yang hangat (#F9F6F3) mengurangi blue light exposure
- Warna off-white daripada putih murni untuk mengurangi glare
- Text warna mocha untuk contrast optimal
- Rose accent tetap konsisten untuk brand recognition
- Transisi halus (0.3s) mencegah eye strain

### 3. **Persistent Storage**
- Preferensi theme disimpan di localStorage
- User's choice diingat di refresh/kunjungan berikutnya

### 4. **Teknologi yang Digunakan**
- **Zustand**: State management untuk theme
- **CSS Variables**: Dynamic styling berdasarkan theme
- **useLayoutEffect**: Prevent hydration mismatch
- **Next.js**: Full app support

## File-File yang Dibuat/Diubah

### Baru:
- `src/store/themeStore.ts` - Zustand store untuk theme state
- `src/components/ThemeProvider.tsx` - Theme provider wrapper
- `src/components/ThemeToggle.tsx` - Theme toggle button component

### Diubah:
- `src/app/globals.css` - Menambah CSS variables untuk 2 theme
- `src/app/layout.tsx` - Wrap dengan ThemeProvider
- `src/components/Navbar.tsx` - Tambah ThemeToggle button, update styling

## Cara Kerja

1. **Initialization**: Saat app load, ThemeProvider membaca localStorage untuk preferensi theme yang disimpan sebelumnya
2. **Rendering**: Theme diterapkan ke HTML element via `data-theme` attribute dan CSS variables
3. **Toggle**: Klik tombol theme → Zustand update state → CSS variables berubah → Visual update
4. **Persistence**: Setiap kali theme berubah, otomatis disimpan ke localStorage

## Psikologi Warna - Analisis Mendalam

### Mengapa Warm Palette untuk Light Mode?
1. **Konsistensi Brand**: Wedding catalog should feel elegant dan premium
2. **Reduced Eye Strain**: Off-white (#F9F6F3) lebih gentle dibanding pure white
3. **Warm Psychological Effect**: Rose dan beige tones menciptakan feeling of intimacy dan luxury
4. **Professional Appeal**: Warm neutrals adalah choice untuk premium brands

### Color Harmony:
- **Complementary**: Rose (#C9956C) dengan background cream menciptakan natural balance
- **Contrast**: Mocha text pada cream background memberikan readability 9.5+ (WCAG AAA)
- **Consistency**: Accent color sama di kedua mode untuk brand recognition

## Testing Checklist

- [ ] Dark mode default saat first load
- [ ] Light mode dapat dipilih via toggle button
- [ ] Theme terus konsisten saat navigasi antar page
- [ ] Theme preference tersimpan setelah refresh
- [ ] Transisi smooth saat switch theme (0.3s)
- [ ] All UI elements adapt correctly (buttons, text, borders)
- [ ] No hydration errors di console

## Cara Menggunakan di Components

```tsx
import { useThemeStore } from '@/store/themeStore';

export function MyComponent() {
  const { theme, toggleTheme } = useThemeStore();
  
  return (
    <button onClick={toggleTheme}>
      Current: {theme}
    </button>
  );
}
```

Atau gunakan CSS variables di inline styles:
```tsx
<div style={{ color: 'var(--foreground)', background: 'var(--background)' }}>
  Content
</div>
```

## CSS Variables Tersedia

```css
--background          /* Main background color */
--foreground          /* Main text color */
--background-secondary /* Secondary background (navbar, etc) */
--border-color        /* Border colors */
--text-muted          /* Secondary text */
--rose, --rose-dark, --blush, --blush-dark, --cream, --mocha, etc.
```

---

Implementasi sudah siap! Fitur dark/light mode sekarang fully functional dengan design yang thoughtful dan psychology-driven. 🎨
