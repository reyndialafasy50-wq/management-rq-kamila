/**
 * ==================================================
 * ENGINE UTAMA & ROUTER SPA
 * File: js/main.js
 * ==================================================
 */

import { renderDashboard, initDashboard } from './dashboard.js';
import { renderSantri, initSantri } from './santri.js';

const mainContent = document.getElementById('main-content');
const pageTitle = document.getElementById('page-title');

// --- SISTEM ROUTING SPA ---
function handleRoute() {
    // Ambil hash URL saat ini, default ke #dashboard jika kosong
    const hash = window.location.hash || '#dashboard';

    // 1. Ubah status menu navigasi agar menyala sesuai rute aktif
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === hash) {
            link.classList.add('active');
        }
    });

    // 2. Judul Header Dinamis (Otomatis mengubah nama sesuai menu)
    const cleanName = hash.replace('#', '');
    pageTitle.textContent = cleanName === 'dashboard' ? 'Dashboard' : 
                            cleanName === 'santri' ? 'Data Santri' : 
                            cleanName === 'harian' ? 'Input Harian' : 
                            cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

    // 3. Suntikkan konten ke layar berdasarkan Hash (Rute)
    if (hash === '#dashboard') {
        mainContent.innerHTML = renderDashboard();
        initDashboard();
    } else if (hash === '#santri') {
        mainContent.innerHTML = renderSantri();
        initSantri();
    } else {
        // Halaman yang belum dibuat
        mainContent.innerHTML = `
            <div style="text-align: center; padding: 50px; color: var(--text-muted);">
                <i class="fas fa-tools fa-3x"></i>
                <h3 style="margin-top:15px;">Modul dalam pengembangan</h3>
                <p style="font-size: 0.85rem; margin-top: 10px;">Fitur ini akan tersedia di pembaruan selanjutnya.</p>
            </div>
        `;
    }

    // 4. Tutup sidebar di HP secara otomatis setelah menu diklik
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if(sidebar && overlay) {
        sidebar.classList.remove('active');
        overlay.style.display = 'none';
    }
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
    
    // Cek preferensi tema sebelumnya di penyimpanan lokal browser
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        if(themeIcon) themeIcon.className = 'fas fa-sun';
    }

    btnTheme.addEventListener('click', () => {
        const isDark = document.body.hasAttribute('data-theme');
        if (isDark) {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            if(themeIcon) themeIcon.className = 'fas fa-moon';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            if(themeIcon) themeIcon.className = 'fas fa-sun';
        }
        // Render ulang halaman agar UI / Chart ikut menyesuaikan tema
        handleRoute();
    });
}

// --- INISIALISASI ENGINE ---
window.addEventListener('hashchange', handleRoute);
window.addEventListener('DOMContentLoaded', () => {
    setupGlobalUI();
    handleRoute(); // Jalankan rute awal saat aplikasi pertama kali dimuat
});
