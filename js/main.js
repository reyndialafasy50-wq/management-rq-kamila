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

document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------
    // 1. SISTEM ROUTER HALAMAN (NAVIGASI)
    // -----------------------------------------
    const mainContent = document.getElementById('main-content');
    const pageTitle = document.getElementById('page-title');
    const navLinks = document.querySelectorAll('.nav-link');

    const loadPage = () => {
        const hash = window.location.hash || '#dashboard';

        // Update Navigasi Aktif
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === hash) {
                link.classList.add('active');
            }
        });

        mainContent.innerHTML = '<div style="text-align:center; padding: 50px;"><i class="fas fa-spinner fa-spin fa-2x"></i></div>';

        // Routing Halaman
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

        // PENTING: Panggil ulang lonceng setiap kali pindah halaman agar tetap hidup!
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

    // -----------------------------------------
    // 4. SISTEM NOTIFIKASI LONCENG ALPA
    // -----------------------------------------
    
    // Suntik Animasi CSS untuk Lonceng (Hanya 1x agar tidak dobel/terlalu cepat)
    if (!document.getElementById('cssLonceng')) {
        const styleLonceng = document.createElement('style');
        styleLonceng.id = 'cssLonceng';
        styleLonceng.innerHTML = `
            @keyframes shakeKritis { 
                0%, 100% { transform: rotate(0deg); } 
                25% { transform: rotate(15deg); } 
                50% { transform: rotate(-15deg); } 
                75% { transform: rotate(10deg); } 
            }
            .bell-warn-8 { color: #F59E0B !important; animation: shakeKritis 0.5s infinite; }
            .bell-warn-9 { color: #EA580C !important; animation: shakeKritis 0.3s infinite; }
            .bell-warn-10 { color: #DC2626 !important; animation: shakeKritis 0.15s infinite; filter: drop-shadow(0 0 8px rgba(220, 38, 38, 0.6)); }
        `;
        document.head.appendChild(styleLonceng);
    }

    // Fungsi Utama Pemantau Lonceng
    async function periksaNotifikasiGlobal() {
        const bellIcon = document.getElementById('bellNotif');
        if (!bellIcon) return;

        try {
            const d = new Date();
            const bulanIni = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

            const [harianList, santriList] = await Promise.all([
                api.get('input_harian', `select=*&tanggal=gte.${bulanIni}-01&status_hadir=eq.Alpa`),
                api.get('dapodik_santri', 'select=id,nama_santri,hp_ortu,no_hp')
            ]);

            if (!harianList || harianList.length === 0) {
                bellIcon.className = 'fas fa-bell';
                bellIcon.onclick = null;
                bellIcon.style.cursor = 'default';
                return;
            }

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

            // Terapkan Kelas CSS
            bellIcon.classList.remove('bell-warn-8', 'bell-warn-9', 'bell-warn-10');
            if (maxAlpa >= 10) bellIcon.classList.add('bell-warn-10');
            else if (maxAlpa === 9) bellIcon.classList.add('bell-warn-9');
            else if (maxAlpa === 8) bellIcon.classList.add('bell-warn-8');

            // Aktifkan Tombol Klik Lonceng
            if (daftarKritis.length > 0) {
                bellIcon.style.cursor = 'pointer';
                bellIcon.onclick = (e) => {
                    e.preventDefault();
                    tampilkanModalEvaluasi(daftarKritis, bulanIni);
                };
            } else {
                bellIcon.style.cursor = 'default';
                bellIcon.onclick = null;
            }
        } catch(e) { console.error('Gagal notifikasi:', e); }
    }

    // Fungsi Membuat Tampilan Pop-up
    function tampilkanModalEvaluasi(daftar, bulanIni) {
        let modal = document.getElementById('modalLoncengGlobal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modalLoncengGlobal';
            modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); display: none; justify-content: center; align-items: center; z-index: 9999;`;
            document.body.appendChild(modal);
        }

        daftar.sort((a,b) => b.count - a.count);
        let htmlList = '';
        
        daftar.forEach(s => {
            let color = s.count >= 10 ? '#DC2626' : '#EA580C';
            let hp = s.hp.replace(/[^0-9]/g, '');
            if (hp.startsWith('0')) hp = '62' + hp.slice(1);

            const msg = encodeURIComponent(`Assalamu'alaikum Bapak/Ibu Wali dari ananda *${s.nama}*.\n\nKami menginformasikan bahwa ananda telah mencapai batas *${s.count}x Alpa (Tanpa Keterangan)* di bulan ini.\nMohon perhatian dan kerjasamanya. Terima kasih.`);
            const link = hp ? `https://wa.me/${hp}?text=${msg}` : '#';

            htmlList += `
                <div style="padding: 12px 0; border-bottom: 1px dashed var(--border); display: flex; justify-content: space-between; align-items: center;">
                    <div style="text-align: left; flex: 1; padding-right: 10px;">
                        <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-main);">${s.nama}</div>
                        <div style="font-size: 0.75rem; font-weight: 800; color: ${color}; margin-top: 2px;">${s.count}x Alpa</div>
                    </div>
                    <div style="display: flex; gap: 6px;">
                        <button onclick="window.bukaProfilSantri()" title="Profil" style="background: rgba(59, 130, 246, 0.1); border: none; color: #3B82F6; padding: 8px 12px; border-radius: 8px; cursor: pointer;"><i class="fas fa-eye"></i></button>
                        ${hp ? `<a href="${link}" target="_blank" title="WhatsApp" style="background: rgba(16, 185, 129, 0.1); color: #10B981; padding: 8px 12px; border-radius: 8px; text-decoration: none; display: inline-flex; align-items: center;"><i class="fab fa-whatsapp"></i></a>` : `<button onclick="alert('No HP belum diisi!')" style="background: #E5E7EB; color: #9CA3AF; border: none; padding: 8px 12px; border-radius: 8px; cursor: not-allowed;"><i class="fab fa-whatsapp"></i></button>`}
                        <button onclick="window.senyapkanLonceng('${s.id}', '${bulanIni}', '${s.nama}')" title="Tandai Selesai" style="background: rgba(239, 68, 68, 0.1); border: none; color: #EF4444; padding: 8px 12px; border-radius: 8px; cursor: pointer;"><i class="fas fa-check-double"></i></button>
                    </div>
                </div>
            `;
        });

        modal.innerHTML = `
            <div style="background: var(--surface); width: 88%; max-width: 380px; border-radius: 20px; padding: 20px; text-align: center; box-shadow: 0 15px 50px rgba(0,0,0,0.3);">
                <div style="width:50px; height:50px; background:#FEE2E2; border-radius:50%; display:flex; align-items:center; justify-content:center; margin: 0 auto 10px auto;"><i class="fas fa-exclamation-triangle" style="font-size: 1.5rem; color: #EF4444;"></i></div>
                <h3 style="margin: 0 0 5px 0; color: var(--text-main); font-size: 1.1rem;">Evaluasi Kehadiran!</h3>
                <p style="font-size: 0.75rem; color: var(--text-muted); margin: 0 0 15px 0;">Tekan centang (✅) jika sudah dievaluasi agar lonceng berhenti bergetar.</p>
                <div style="max-height: 250px; overflow-y: auto; margin-bottom: 15px;">${htmlList}</div>
                <button onclick="document.getElementById('modalLoncengGlobal').style.display='none'" style="background: var(--bg-main); border: 1px solid var(--border); padding: 12px; border-radius: 10px; font-weight: 700; color: var(--text-main); width: 100%; cursor: pointer; outline: none;">Tutup Peringatan</button>
            </div>
        `;
        modal.style.display = 'flex';
    }

    // Fungsi Pindah ke Profil Santri (Global)
    window.bukaProfilSantri = () => {
        document.getElementById('modalLoncengGlobal').style.display = 'none';
        window.location.hash = '#santri'; 
    };

    // Fungsi Mematikan Lonceng (Mute Global)
    window.senyapkanLonceng = (id, bulan, nama) => {
        if(confirm(`Tandai evaluasi ananda ${nama} SELESAI?\n\nLonceng peringatan untuk ananda ini akan dimatikan sampai bulan depan.`)) {
            localStorage.setItem(`bisu_alpa_${bulan}_${id}`, 'true');
            document.getElementById('modalLoncengGlobal').style.display = 'none';
            periksaNotifikasiGlobal();
        }
    };
});
