import { renderDashboard, initDashboard } from './dashboard.js';

const mainContent = document.getElementById('main-content');
const pageTitle = document.getElementById('page-title');

function handleRoute() {
    const hash = window.location.hash || '#dashboard';

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === hash) link.classList.add('active');
    });

    // Judul Header Dinamis (Otomatis mengubah nama sesuai menu)
    const cleanName = hash.replace('#', '');
    pageTitle.textContent = cleanName === 'dashboard' ? 'Dashboard' : 
                            cleanName === 'santri' ? 'Data Santri' : 
                            cleanName === 'harian' ? 'Input Harian' : 
                            cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

    if (hash === '#dashboard') {
        mainContent.innerHTML = renderDashboard();
        initDashboard();
    } else {
        mainContent.innerHTML = `<div style="text-align: center; padding: 50px; color: var(--text-muted);"><i class="fas fa-tools fa-3x"></i><h3 style="margin-top:15px;">Modul dalam pengembangan</h3></div>`;
    }

    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if(sidebar && overlay) { sidebar.classList.remove('active'); overlay.style.display = 'none'; }
}

function setupGlobalUI() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    document.getElementById('btnToggleSidebar').addEventListener('click', () => { sidebar.classList.add('active'); overlay.style.display = 'block'; });
    overlay.addEventListener('click', () => { sidebar.classList.remove('active'); overlay.style.display = 'none'; });

    const btnTheme = document.getElementById('btnThemeToggle');
    const themeIcon = document.getElementById('themeIcon');
    if (localStorage.getItem('theme') === 'dark') { document.body.setAttribute('data-theme', 'dark'); if(themeIcon) themeIcon.className = 'fas fa-sun'; }

    btnTheme.addEventListener('click', () => {
        if (document.body.hasAttribute('data-theme')) {
            document.body.removeAttribute('data-theme'); localStorage.setItem('theme', 'light'); if(themeIcon) themeIcon.className = 'fas fa-moon';
        } else {
            document.body.setAttribute('data-theme', 'dark'); localStorage.setItem('theme', 'dark'); if(themeIcon) themeIcon.className = 'fas fa-sun';
        }
        handleRoute(); // Refresh UI agar diagram Chart.js ganti warna
    });
}

window.addEventListener('hashchange', handleRoute);
window.addEventListener('DOMContentLoaded', () => { setupGlobalUI(); handleRoute(); });
