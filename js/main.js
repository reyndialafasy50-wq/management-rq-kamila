/**
 * ==================================================
 * BAGIAN 2: ROUTER & LAYOUT CONTROLLER (MAIN.JS)
 * File: js/main.js
 * ==================================================
 */
import { renderDashboard, initDashboard } from './dashboard.js';
import { renderSantri, initSantri } from './santri.js';
import { renderInputHarian, initInputHarian } from './input_harian.js';
import { api } from './api.js';

// ==========================================
// FUNGSI LONCENG GLOBAL (ANTI-MELESET)
// ==========================================
window.periksaNotifikasiGlobal = async () => {
    // 1. Cari Lonceng
    const bellIcon = document.getElementById('bellNotif') || document.querySelector('.fa-bell');
    if (!bellIcon) return;

    // 2. Suntik CSS Animasi Goyang (Ditambah Paksaan Inline-Block)
    if (!document.getElementById('cssLoncengBaru')) {
        const style = document.createElement('style');
        style.id = 'cssLoncengBaru';
        style.innerHTML = `
            @keyframes shakeSuper { 
                0%, 100% { transform: rotate(0deg); } 
                25% { transform: rotate(20deg); } 
                50% { transform: rotate(-20deg); } 
                75% { transform: rotate(15deg); } 
            }
            .bell-kritis-8, .bell-kritis-9, .bell-kritis-10 {
                display: inline-block !important; /* WAJIB AGAR BISA DIGOYANG */
                transform-origin: top center !important; /* TITIK TUMPU GOYANG DI ATAS */
            }
            .bell-kritis-8 { color: #F59E0B !important; animation: shakeSuper 0.5s infinite; }
            .bell-kritis-9 { color: #EA580C !important; animation: shakeSuper 0.3s infinite; }
            .bell-kritis-10 { color: #DC2626 !important; animation: shakeSuper 0.15s infinite; filter: drop-shadow(0 0 8px rgba(220, 38, 38, 0.6)); }
        `;
        document.head.appendChild(style);
    }

    try {
        const d = new Date();
        const bulanIni = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

        const [harianList, santriList] = await Promise.all([
            api.get('input_harian', `select=*&tanggal=gte.${bulanIni}-01&status_hadir=eq.Alpa`),
            api.get('dapodik_santri', 'select=id,nama_santri,hp_ortu,no_hp')
        ]);

        // 3. Amankan Area Klik (Cari kotak pembungkusnya agar klik tidak meleset)
        const areaKlik = bellIcon.closest('button, a, div[class*="nav"]') || bellIcon;

        // Reset Lonceng
        bellIcon.classList.remove('bell-kritis-8', 'bell-kritis-9', 'bell-kritis-10');
        areaKlik.onclick = null;
        areaKlik.style.cursor = 'default';

        if (!harianList || harianList.length === 0) return;

        let rekapAlpa = {};
        harianList.forEach(log => {
            const idKey = log.santri_id || log.nama_santri;
            if (!rekapAlpa[idKey]) rekapAlpa[idKey] = { id: log.santri_id, nama: log.nama_santri, count: 0 };
            rekapAlpa[idKey].count++;
        });

        let maxAlpa = 0;
        let daftarKritis = [];

        for (const key in rekapAlpa) {
            const data = rekapAlpa[key];
            const sudahDisenyapkan = localStorage.getItem(`bisu_alpa_${bulanIni}_${data.id}`);
            
            if (data.count >= 8 && !sudahDisenyapkan) {
                const s = santriList.find(x => x.id === data.id || x.nama_santri === data.nama);
                data.hp = s ? (s.hp_ortu || s.no_hp || '') : '';
                daftarKritis.push(data);
                if (data.count > maxAlpa) maxAlpa = data.count;
            }
        }

        // Terapkan goyangan lonceng
        if (maxAlpa >= 10) bellIcon.classList.add('bell-kritis-10');
        else if (maxAlpa === 9) bellIcon.classList.add('bell-kritis-9');
        else if (maxAlpa === 8) bellIcon.classList.add('bell-kritis-8');

        // Pasang sensor klik di area yang luas
        if (daftarKritis.length > 0) {
            areaKlik.style.cursor = 'pointer';
            areaKlik.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation(); // Cegah klik bocor ke elemen lain
                window.tampilkanModalEvaluasi(daftarKritis, bulanIni);
            };
        }
    } catch(e) { console.error('Gagal memuat notifikasi:', e); }
};

// ==========================================
// FUNGSI POP-UP & 3 TOMBOL (PROFIL, WA, MUTE)
// ==========================================
window.tampilkanModalEvaluasi = (daftar, bulanIni) => {
    let modal = document.getElementById('modalLoncengGlobal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modalLoncengGlobal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); display: none; justify-content: center; align-items: center; z-index: 999999;`;
        document.body.appendChild(modal);
    }

    daftar.sort((a,b) => b.count - a.count);
    let htmlList = '';
    
    daftar.forEach(s => {
        let color = s.count >= 10 ? '#DC2626' : '#EA580C';
        let hp = (s.hp || '').replace(/[^0-9]/g, '');
        if (hp.startsWith('0')) hp = '62' + hp.slice(1);

        const msg = encodeURIComponent(`Assalamu'alaikum Bapak/Ibu Wali dari ananda *${s.nama}*.\n\nKami menginformasikan bahwa ananda telah mencapai batas *${s.count}x Alpa (Tanpa Keterangan)* di bulan ini.\nMohon perhatian dan kerjasamanya. Terima kasih.`);
        const link = hp ? `https://wa.me/${hp}?text=${msg}` : '#';

        htmlList += `
            <div style="padding: 12px 0; border-bottom: 1px dashed var(--border); display: flex; justify-content: space-between; align-items: center;">
                <div style="text-align: left; flex: 1; padding-right: 10px;">
                    <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-main); line-height: 1.2;">${s.nama}</div>
                    <div style="font-size: 0.75rem; font-weight: 800; color: ${color}; margin-top: 4px;">${s.count}x Alpa</div>
                </div>
                <div style="display: flex; gap: 6px;">
                    <!-- Tombol Profil -->
                    <button onclick="window.bukaProfilSantriLonceng()" title="Profil" style="background: rgba(59, 130, 246, 0.1); border: none; color: #3B82F6; width:34px; height:34px; border-radius: 8px; cursor: pointer; display:flex; align-items:center; justify-content:center;"><i class="fas fa-eye"></i></button>
                    <!-- Tombol WhatsApp -->
                    ${hp ? `<a href="${link}" target="_blank" title="WhatsApp" style="background: rgba(16, 185, 129, 0.1); color: #10B981; width:34px; height:34px; border-radius: 8px; text-decoration: none; display: flex; align-items: center; justify-content:center;"><i class="fab fa-whatsapp"></i></a>` : `<button onclick="alert('No HP belum diisi!')" style="background: #E5E7EB; color: #9CA3AF; border: none; width:34px; height:34px; border-radius: 8px; cursor: not-allowed; display:flex; align-items:center; justify-content:center;"><i class="fab fa-whatsapp"></i></button>`}
                    <!-- Tombol Centang Mute -->
                    <button onclick="window.senyapkanLonceng('${s.id}', '${bulanIni}', '${s.nama}')" title="Tandai Selesai" style="background: rgba(239, 68, 68, 0.1); border: none; color: #EF4444; width:34px; height:34px; border-radius: 8px; cursor: pointer; display:flex; align-items:center; justify-content:center;"><i class="fas fa-check-double"></i></button>
                </div>
            </div>
        `;
    });

    modal.innerHTML = `
        <div style="background: var(--surface); width: 88%; max-width: 380px; border-radius: 20px; padding: 20px; text-align: center; box-shadow: 0 15px 50px rgba(0,0,0,0.3);">
            <div style="width:50px; height:50px; background:#FEE2E2; border-radius:50%; display:flex; align-items:center; justify-content:center; margin: 0 auto 10px auto;"><i class="fas fa-exclamation-triangle" style="font-size: 1.5rem; color: #EF4444;"></i></div>
            <h3 style="margin: 0 0 5px 0; color: var(--text-main); font-size: 1.1rem;">Evaluasi Kehadiran!</h3>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin: 0 0 15px 0;">Tekan centang (✅) jika sudah dievaluasi agar lonceng berhenti bergetar.</p>
            <div style="max-height: 250px; overflow-y: auto; margin-bottom: 15px; padding-right:5px; border-top: 1px dashed var(--border);">${htmlList}</div>
            <button onclick="document.getElementById('modalLoncengGlobal').style.display='none'" style="background: var(--bg-main); border: 1px solid var(--border); padding: 12px; border-radius: 10px; font-weight: 700; color: var(--text-main); width: 100%; cursor: pointer; outline: none;">Tutup Peringatan</button>
        </div>
    `;
    modal.style.display = 'flex';
};

window.bukaProfilSantriLonceng = () => {
    document.getElementById('modalLoncengGlobal').style.display = 'none';
    window.location.hash = '#santri'; 
};

window.senyapkanLonceng = (id, bulan, nama) => {
    if(confirm(`Tandai evaluasi ananda ${nama} SELESAI?\n\nLonceng peringatan untuk ananda ini akan dimatikan sampai bulan depan.`)) {
        localStorage.setItem(`bisu_alpa_${bulan}_${id}`, 'true');
        document.getElementById('modalLoncengGlobal').style.display = 'none';
        window.periksaNotifikasiGlobal(); // Lonceng akan langsung di-refresh & mati
    }
};

// ==========================================
// INISIALISASI ROUTER & APLIKASI
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const pageTitle = document.getElementById('page-title');
    const navLinks = document.querySelectorAll('.nav-link');

    const loadPage = () => {
        const hash = window.location.hash || '#dashboard';

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === hash) link.classList.add('active');
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
        if (window.periksaNotifikasiGlobal) window.periksaNotifikasiGlobal();
    };

    window.addEventListener('hashchange', loadPage);
    loadPage();

    const btnThemeToggle = document.getElementById('btnThemeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    if (localStorage.getItem('theme') === 'dark') {
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
            if (window.innerWidth <= 900 && sidebar && sidebar.classList.contains('active')) toggleMenu();
        });
    });
});
