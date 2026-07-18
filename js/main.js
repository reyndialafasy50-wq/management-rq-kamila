/**
 * ==================================================
 * ENGINE UTAMA & ROUTER
 * File: js/main.js
 * ==================================================
 */

import { renderDashboard, initDashboard } from './dashboard.js';

const mainContent = document.getElementById('main-content');
const pageTitle = document.getElementById('page-title');

// --- SISTEM ROUTING SPA ---
function handleRoute() {
    // Ambil hash URL saat ini, default ke #dashboard
    const hash = window.location.hash || '#dashboard';

    // 1. Ubah status menu navigasi agar menyala sesuai rute aktif
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === hash) {
            link.classList.add('active');
        }
    });

    // 2. Suntikkan konten ke layar berdasarkan Hash (Rute)
    if (hash === '#dashboard') {
        pageTitle.textContent = "Beranda Global";
        mainContent.innerHTML = renderDashboard();
        initDashboard();
    } else {
        // Placeholder untuk rute yang belum kita buat kodenya
        pageTitle.textContent = "Sedang Dibangun";
        mainContent.innerHTML = `
            <div style="padding: 50px 20px; text-align: center; color: var(--text-muted); background: var(--surface); border-radius: 20px; border: 1px solid var(--border);">
                <i class="fas fa-hammer fa-3x" style="margin-bottom:15px; color:var(--clr-koral);"></i>
                <h3>Modul dalam tahap pengembangan</h3>
                <p style="font-size: 0.85rem; margin-top: 10px;">Fitur ini akan tersedia di pembaruan selanjutnya.</p>
            </div>
        `;
    }

    // Tutup sidebar di HP secara otomatis setelah menu diklik
    document.getElementById('sidebar').classList.remove('active');
    document.getElementById('sidebarOverlay').style.display = 'none';
}

// --- PENGATURAN UI GLOBAL ---
function setupGlobalUI() {
    // 1. Sidebar Toggle (Mobile)
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    document.getElementById('btnToggleSidebar').addEventListener('click', () => {
        sidebar.classList.add('active');
        overlay.style.display = 'block';
    });
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.style.display = 'none';
    });

    // 2. Saklar Tema (Dark/Light Mode)
    const btnTheme = document.getElementById('btnThemeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    // Cek preferensi tema sebelumnya di penyimpanan lokal
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
    }

    btnTheme.addEventListener('click', () => {
        const isDark = document.body.hasAttribute('data-theme');
        if (isDark) {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeIcon.className = 'fas fa-moon';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.className = 'fas fa-sun';
        }
        // Render ulang halaman agar warna chart ikut berubah
        handleRoute();
    });

    // 3. Jam Real-time Global
    setInterval(() => {
        const dateEl = document.getElementById('currentDateDisplay');
        const timeEl = document.getElementById('realtimeClock');
        if(dateEl && timeEl) {
            const now = new Date();
            dateEl.textContent = now.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
            timeEl.textContent = now.toLocaleTimeString('id-ID') + " WIB";
        }
    }, 1000);
}

// --- INISIALISASI ENGINE ---
window.addEventListener('hashchange', handleRoute);
window.addEventListener('DOMContentLoaded', () => {
    setupGlobalUI();
    handleRoute();
});
