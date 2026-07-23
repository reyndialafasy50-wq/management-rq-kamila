/**
 * ==================================================
 * BAGIAN 2: ROUTER & LAYOUT CONTROLLER (MAIN.JS)
 * File: js/main.js
 * ==================================================
 */

import { renderDashboard, initDashboard } from './dashboard.js';
import { renderSantri, initSantri } from './santri.js';
import { renderInputHarian, initInputHarian } from './input_harian.js'; 
import { periksaNotifikasiGlobal } from './notifikasi.js'; // <-- IMPORT MODUL LONCENG

document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------
    // 1. SISTEM ROUTER HALAMAN (NAVIGASI)
    // -----------------------------------------
    const mainContent = document.getElementById('main-content');
    const pageTitle = document.getElementById('page-title');
    const navLinks = document.querySelectorAll('.nav-link');

    const loadPage = () => {
        const hash = window.location.hash || '#dashboard';

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === hash) {
                link.classList.add('active');
            }
        });

        mainContent.innerHTML = '<div style="text-align:center; padding: 50px;"><i class="fas fa-spinner fa-spin fa-2x"></i></div>';

        if (hash === '#dashboard') {
            pageTitle.textContent = 'Dashboard';
            mainContent.innerHTML = renderDashboard();
            initDashboard();
        } else if (hash === '#santri') {
            pageTitle.textContent = 'Data Santri & Kelas';
            mainContent.innerHTML = renderSantri();
            initSantri();
        } else if (hash === '#harian') { 
            pageTitle.textContent = 'Input Harian (Absen & Hafalan)';
            mainContent.innerHTML = renderInputHarian();
            initInputHarian();
        } else if (hash === '#laporan') {
            pageTitle.textContent = 'Laporan & Rapor';
            mainContent.innerHTML = `<div class="card" style="padding:40px; text-align:center;"><h2>Fitur Laporan segera hadir!</h2></div>`;
        } else if (hash === '#setting') {
            pageTitle.textContent = 'Pengaturan Sistem';
            mainContent.innerHTML = `<div class="card" style="padding:40px; text-align:center;"><h2>Fitur Pengaturan segera hadir!</h2></div>`;
        } else {
            pageTitle.textContent = 'Halaman Tidak Ditemukan';
            mainContent.innerHTML = `<div class="card" style="padding:40px; text-align:center; color: red;"><h2>404 Not Found</h2></div>`;
        }

        // PANGGIL LONCENG SETIAP PINDAH HALAMAN
        periksaNotifikasiGlobal();
    };

    window.addEventListener('hashchange', loadPage);
    loadPage();

    // -----------------------------------------
    // 2. SISTEM DARK MODE / LIGHT MODE
    // -----------------------------------------
    const btnThemeToggle = document.getElementById('btnThemeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        if(themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    if(btnThemeToggle) {
        btnThemeToggle.addEventListener('click', () => {
            if (document.body.getAttribute('data-theme') === 'dark') {
                document.body.removeAttribute('data-theme');
                if(themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'light');
            } else {
                document.body.setAttribute('data-theme', 'dark');
                if(themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // -----------------------------------------
    // 3. RESPONSIVE SIDEBAR MOBILE (TOGGLE)
    // -----------------------------------------
    const sidebar = document.getElementById('sidebar');
    const btnToggleSidebar = document.getElementById('btnToggleSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    const toggleMenu = () => {
        if(sidebar) sidebar.classList.toggle('active');
        if(sidebarOverlay) sidebarOverlay.style.display = sidebar.classList.contains('active') ? 'block' : 'none';
    };

    if(btnToggleSidebar) btnToggleSidebar.addEventListener('click', toggleMenu);
    if(sidebarOverlay) sidebarOverlay.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 900 && sidebar && sidebar.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
});
