/**
 * ==================================================
 * BAGIAN 7: MODUL DASHBOARD (ADMIN COMMAND CENTER & GURU)
 * File: js/dashboard.js
 * ==================================================
 */
import { api } from './api.js';

// Variabel Global Khusus Dashboard Guru
let myChart;
let rawHarianList = []; 
let rawSantriList = [];
let namaKelasAktif = null;

// ==========================================
// 1. ROUTER DASHBOARD (PENENTU TAMPILAN)
// ==========================================
export function renderDashboard() {
    const role = localStorage.getItem('user_role') || 'Guru';
    if (role === 'Admin') {
        return renderDashboardAdmin();
    } else {
        return renderDashboardGuru();
    }
}

export async function initDashboard() {
    const role = localStorage.getItem('user_role') || 'Guru';
    if (role === 'Admin') {
        await initDashboardAdmin();
    } else {
        await initDashboardGuru();
    }
}

// ==========================================
// 2. RENDER & LOGIKA DASHBOARD ADMIN (MATA ELANG)
// ==========================================
function renderDashboardAdmin() {
    return `
    <!-- SUNTIKAN CSS PEMBERONTAK (BYPASS LEBAR LAYAR KHUSUS ADMIN) -->
    <style id="cssAdminFullWidth">
        #main-content {
            max-width: 100% !important;
            width: 100% !important;
            padding: 20px 30px !important;
            margin: 0 !important;
            box-sizing: border-box !important;
        }
        .admin-grid-wrapper {
            display: flex;
            flex-direction: column;
            gap: 24px;
            font-family: 'Inter', sans-serif;
            animation: fadeIn 0.4s ease-out;
            color: var(--text-main);
        }
        .bento-row { display: grid; gap: 20px; width: 100%; }
        .row-stats { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
        .row-main { grid-template-columns: 2fr 1fr; }
        @media (max-width: 1024px) { .row-main { grid-template-columns: 1fr; } }
        
        .admin-card {
            background: var(--surface); border-radius: 18px; padding: 22px;
            border: 1px solid var(--border); box-shadow: 0 4px 20px rgba(0,0,0,0.03);
            display: flex; flex-direction: column; position: relative; overflow: hidden;
        }
        .stat-card { flex-direction: row; align-items: center; justify-content: space-between; transition: transform 0.2s, box-shadow 0.2s; }
        .stat-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0,0,0,0.06); }
        .stat-icon { width: 54px; height: 54px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }

        .admin-header-banner {
            background: linear-gradient(135deg, #002452, #003a77); color: white;
            padding: 24px 30px; border-radius: 20px; display: flex;
            justify-content: space-between; align-items: center; box-shadow: 0 10px 30px rgba(0,36,82,0.15);
        }
        .live-clock { font-family: monospace; font-size: 1.1rem; background: rgba(255,255,255,0.15); padding: 8px 16px; border-radius: 10px; backdrop-filter: blur(5px); }

        .radar-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .radar-table th { text-align: left; padding: 12px; font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; border-bottom: 2px solid var(--border); }
        .radar-table td { padding: 14px 12px; border-bottom: 1px dashed var(--border); font-size: 0.9rem; }
        .badge-status { padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 800; display: inline-flex; align-items: center; gap: 6px; }
        .badge-sukses { background: rgba(16, 185, 129, 0.15); color: #10B981; }
        .badge-pending { background: rgba(239, 68, 68, 0.15); color: #EF4444; animation: pulse 1.5s infinite; }

        .live-log-container { max-height: 320px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding-right: 5px; }
        .log-item-admin { padding: 12px; border-radius: 12px; background: var(--bg-main); border: 1px solid var(--border); font-size: 0.85rem; display: flex; gap: 12px; align-items: flex-start; }
    </style>

    <div class="admin-grid-wrapper">
        <div class="admin-header-banner">
            <div>
                <h2 style="margin: 0; font-size: 1.5rem; font-weight: 800; font-family: 'Libre Caslon Text', serif;">Control Room - Rumah Qur'an Kamila</h2>
                <p style="margin: 5px 0 0 0; opacity: 0.8; font-size: 0.9rem;">Pengawasan Kepatuhan Akademik & Operasional Sekolah Real-time</p>
            </div>
            <div style="display: flex; gap: 15px; align-items: center;">
                <div class="live-clock" id="liveJamDigital">00:00:00 WIB</div>
                <button id="btnTegurSemuaWa" class="btn-secondary" style="background: #25D366; color: white; border: none; font-weight: 700; cursor: pointer; padding: 10px 18px; border-radius: 10px; display: flex; align-items: center; gap: 8px;">
                    <i class="fab fa-whatsapp"></i> Broadcast Teguran WA
                </button>
            </div>
        </div>

        <div class="bento-row row-stats">
            <div class="admin-card stat-card">
                <div>
                    <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Total Santri Aktif</span>
                    <h2 style="margin: 5px 0 0 0; font-size: 1.8rem; font-weight: 800; color: #002452;" id="statSantriTotal">0</h2>
                </div>
                <div class="stat-icon" style="background: rgba(59, 130, 246, 0.1); color: #3B82F6;"><i class="fas fa-user-graduate"></i></div>
            </div>
            <div class="admin-card stat-card">
                <div>
                    <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Total Kelas / Rombel</span>
                    <h2 style="margin: 5px 0 0 0; font-size: 1.8rem; font-weight: 800; color: #002452;" id="statKelasTotal">0</h2>
                </div>
                <div class="stat-icon" style="background: rgba(139, 92, 246, 0.1); color: #8B5CF6;"><i class="fas fa-chalkboard-teacher"></i></div>
            </div>
            <div class="admin-card stat-card">
                <div>
                    <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Ustadz Pengampu</span>
                    <h2 style="margin: 5px 0 0 0; font-size: 1.8rem; font-weight: 800; color: #002452;" id="statUstdzTotal">0</h2>
                </div>
                <div class="stat-icon" style="background: rgba(245, 158, 11, 0.1); color: #F59E0B;"><i class="fas fa-user-shield"></i></div>
            </div>
            <div class="admin-card stat-card">
                <div>
                    <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Kehadiran Hari Ini</span>
                    <h2 style="margin: 5px 0 0 0; font-size: 1.8rem; font-weight: 800; color: #10B981;" id="statHadirPersen">0%</h2>
                </div>
                <div class="stat-icon" style="background: rgba(16, 185, 129, 0.1); color: #10B981;"><i class="fas fa-chart-line"></i></div>
            </div>
        </div>

        <div class="bento-row row-main">
            <div class="admin-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3 style="margin: 0; font-size: 1.05rem; font-weight: 800; color: var(--text-main);"><i class="fas fa-eye text-info"></i> Radar Kepatuhan Absensi Ustadz Hari Ini</h3>
                    <small style="color: var(--text-muted);" id="teksTanggalHariIni">-</small>
                </div>
                <div style="overflow-x: auto;">
                    <table class="radar-table">
                        <thead>
                            <tr>
                                <th>Kelas</th>
                                <th>Ustadz Pengampu</th>
                                <th>Jam KBM</th>
                                <th>Status Absensi</th>
                                <th style="text-align: center;">Tindakan</th>
                            </tr>
                        </thead>
                        <tbody id="tabelRadarBody">
                            <tr><td colspan="5" style="text-align:center;"><i class="fas fa-spinner fa-spin"></i> Memindai data kelas...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="admin-card">
                <h3 style="margin: 0 0 15px 0; font-size: 1.05rem; font-weight: 800; color: var(--text-main);"><i class="fas fa-trophy" style="color: #F59E0B;"></i> Papan Performa Kelas</h3>
                <div style="margin-bottom: 20px;">
                    <span style="font-size: 0.75rem; font-weight: 800; color: #10B981; text-transform: uppercase; display: block; margin-bottom: 8px;">🏆 Top 3 Kelas Ter-Rajin Bulan Ini</span>
                    <div id="listTopRajin" style="display: flex; flex-direction: column; gap: 8px;">-</div>
                </div>
                <div style="border-top: 1px dashed var(--border); padding-top: 15px;">
                    <span style="font-size: 0.75rem; font-weight: 800; color: #EF4444; text-transform: uppercase; display: block; margin-bottom: 8px;">⚠️ Kelas Perhatian Khusus (Tinggi Alpa)</span>
                    <div id="listTopKritis" style="display: flex; flex-direction: column; gap: 8px;">-</div>
                </div>
            </div>
        </div>

        <div class="admin-card">
            <h3 style="margin: 0 0 15px 0; font-size: 1.05rem; font-weight: 800; color: var(--text-main);"><i class="fas fa-stream" style="color: #3B82F6;"></i> Log Aktivitas Penginputan Live</h3>
            <div class="live-log-container" id="containerLiveLog">
                <div style="text-align:center; color: var(--text-muted); padding: 10px;"><i class="fas fa-spinner fa-spin"></i> Mengambil data rekam aktivitas...</div>
            </div>
        </div>
    </div>
    `;
}

async function initDashboardAdmin() {
    const updateJam = () => {
        const d = new Date();
        const jam = String(d.getHours()).padStart(2, '0');
        const menit = String(d.getMinutes()).padStart(2, '0');
        const detik = String(d.getSeconds()).padStart(2, '0');
        const clockEl = document.getElementById('liveJamDigital');
        if (clockEl) clockEl.textContent = `${jam}:${menit}:${detik} WIB`;
    };
    setInterval(updateJam, 1000);
    updateJam();

    const now = new Date();
    const tglHariIni = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const blnIni = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    const optionsTgl = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const teksTglEl = document.getElementById('teksTanggalHariIni');
    if (teksTglEl) teksTglEl.textContent = now.toLocaleDateString('id-ID', optionsTgl);

    try {
        const [santriList, kelasList, guruList, inputHariIni, inputBulanIni] = await Promise.all([
            api.get('dapodik_santri', 'select=id,nama_kelas'),
            api.get('kelas', 'select=*'),
            api.get('guru', 'select=*'),
            api.get('input_harian', `select=*&tanggal=eq.${tglHariIni}`),
            api.get('input_harian', `select=*&tanggal=gte.${blnIni}-01`)
        ]);

        const santriAktif = (santriList || []).filter(s => s.nama_kelas !== 'ALUMNI' && s.nama_kelas !== 'KELUAR');
        document.getElementById('statSantriTotal').textContent = santriAktif.length;
        document.getElementById('statKelasTotal').textContent = (kelasList || []).length;
        document.getElementById('statUstdzTotal').textContent = (guruList || []).length;

        const hadirHariIni = (inputHariIni || []).filter(x => x.status_hadir === 'Hadir').length;
        const totalInputHariIni = (inputHariIni || []).length;
        const persenHadir = totalInputHariIni > 0 ? Math.round((hadirHariIni / totalInputHariIni) * 100) : 0;
        document.getElementById('statHadirPersen').textContent = `${persenHadir}%`;

        const tabelBody = document.getElementById('tabelRadarBody');
        let htmlRadar = '';
        let listUstadzBelumAbsen = [];

        (kelasList || []).forEach(k => {
            const pengampu = (guruList || []).find(g => String(g.id) === String(k.guru_id)) || { nama: 'Belum Ditentukan', no_hp: '' };
            const sudahAbsen = (inputHariIni || []).some(x => x.nama_kelas && x.nama_kelas.toLowerCase() === k.nama_kelas.toLowerCase());

            let hp = (pengampu.no_hp || '').replace(/[^0-9]/g, '');
            if (hp.startsWith('0')) hp = '62' + hp.slice(1);

            const drafPesan = `Assalamu'alaikum Ust. *${pengampu.nama}*.\n\nMohon maaf mengganggu, sekadar mengingatkan dari pengurus RQ Kamila untuk melakukan pengisian absensi harian kelas *${k.nama_kelas}* hari ini (${tglHariIni}). Terima kasih.`;
            const waLink = hp ? `https://wa.me/${hp}?text=${encodeURIComponent(drafPesan)}` : '#';

            if (!sudahAbsen) listUstadzBelumAbsen.push({ nama: pengampu.nama, kelas: k.nama_kelas, waLink });

            htmlRadar += `
                <tr>
                    <td style="font-weight: 700; color: #002452;">${k.nama_kelas}</td>
                    <td><b>Ust. ${pengampu.nama}</b></td>
                    <td><small style="color:var(--text-muted);"><i class="far fa-clock"></i> ${k.jam_kelas || 'Sesuai Jadwal'}</small></td>
                    <td>${sudahAbsen ? `<span class="badge-status badge-sukses"><i class="fas fa-check-circle"></i> Selesai Absen</span>` : `<span class="badge-status badge-pending"><i class="fas fa-exclamation-circle"></i> Belum Absen</span>`}</td>
                    <td style="text-align: center;">${!sudahAbsen && hp ? `<a href="${waLink}" target="_blank" style="background: rgba(37, 211, 102, 0.1); color: #25D366; padding: 6px 12px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 5px;"><i class="fab fa-whatsapp"></i> Tegur WA</a>` : `<button disabled style="border:none; background:transparent; color:var(--text-muted); font-size:0.8rem;">-</button>`}</td>
                </tr>
            `;
        });
        tabelBody.innerHTML = htmlRadar || `<tr><td colspan="5" style="text-align:center;">Belum ada data kelas.</td></tr>`;

        document.getElementById('btnTegurSemuaWa').onclick = () => {
            if (listUstadzBelumAbsen.length === 0) alert("Masya Allah! Seluruh Ustadz pengampu sudah menyelesaikan absensi hari ini.");
            else { alert(`Terdapat ${listUstadzBelumAbsen.length} kelas yang belum diisi absensinya hari ini. Membuka jendela teguran pertama...`); window.open(listUstadzBelumAbsen[0].waLink, '_blank'); }
        };

        let rekapKelasBulan = {};
        (inputBulanIni || []).forEach(x => {
            if (!x.nama_kelas) return;
            const kName = x.nama_kelas;
            if (!rekapKelasBulan[kName]) rekapKelasBulan[kName] = { hadir: 0, alpa: 0, total: 0 };
            if (x.status_hadir === 'Hadir') rekapKelasBulan[kName].hadir++;
            if (x.status_hadir === 'Alpa') rekapKelasBulan[kName].alpa++;
            rekapKelasBulan[kName].total++;
        });

        let arrKlasemen = [];
        for (const key in rekapKelasBulan) {
            const data = rekapKelasBulan[key];
            const persen = data.total > 0 ? Math.round((data.hadir / data.total) * 100) : 0;
            arrKlasemen.push({ kelas: key, persen, alpa: data.alpa });
        }

        arrKlasemen.sort((a,b) => b.persen - a.persen);
        const topRajin = arrKlasemen.slice(0, 3);
        let htmlRajin = '';
        topRajin.forEach((item, idx) => { htmlRajin += `<div style="display:flex; justify-content:space-between; align-items:center; background:rgba(16, 185, 129, 0.08); padding:8px 12px; border-radius:10px; font-size:0.85rem;"><div><b>#${idx+1} ${item.kelas}</b></div><div style="color:#10B981; font-weight:800;">${item.persen}% Hadir</div></div>`; });
        document.getElementById('listTopRajin').innerHTML = htmlRajin || '<small style="color:var(--text-muted);">Belum ada rekap bulan ini.</small>';

        arrKlasemen.sort((a,b) => b.alpa - a.alpa);
        const topKritis = arrKlasemen.filter(x => x.alpa > 0).slice(0, 3);
        let htmlKritis = '';
        topKritis.forEach((item) => { htmlKritis += `<div style="display:flex; justify-content:space-between; align-items:center; background:rgba(239, 68, 68, 0.08); padding:8px 12px; border-radius:10px; font-size:0.85rem;"><div><b>${item.kelas}</b></div><div style="color:#EF4444; font-weight:800;">${item.alpa}x Total Alpa</div></div>`; });
        document.getElementById('listTopKritis').innerHTML = htmlKritis || '<small style="color:var(--text-muted);">Alhamdulillah, tidak ada kelas kritis.</small>';

        const logContainer = document.getElementById('containerLiveLog');
        const lastInput = (inputBulanIni || []).slice(-10).reverse();
        let htmlLog = '';
        lastInput.forEach(log => {
            let ikon = log.status_hadir === 'Hadir' ? 'fa-check-circle text-success' : 'fa-book-open text-info';
            htmlLog += `<div class="log-item-admin"><i class="fas ${ikon}" style="font-size: 1.1rem; margin-top:2px;"></i><div style="flex:1;"><div style="font-weight:700;">${log.nama_santri} (${log.nama_kelas || 'Kelas'})</div><div style="color:var(--text-muted); font-size:0.78rem; margin-top:2px;">${log.status_hadir ? `Status: <b>${log.status_hadir}</b>` : ''} ${log.materi ? `• Setoran: ${log.materi} (${log.jilid_surah || ''})` : ''}</div></div><small style="color:var(--text-muted); font-size:0.75rem;">${log.tanggal}</small></div>`;
        });
        logContainer.innerHTML = htmlLog || '<div style="text-align:center; color:var(--text-muted);">Belum ada rekam aktivitas baru.</div>';
    } catch (e) { console.error("Gagal memuat Dashboard Admin:", e); }
}

// ==========================================
// 3. RENDER & LOGIKA DASHBOARD GURU (ASLI)
// ==========================================
function renderDashboardGuru() {
    return `
        <style>
            .timeline-container { position: relative; padding-left: 20px; margin-top: 15px; }
            .timeline-container::before { content: ''; position: absolute; top: 10px; bottom: 10px; left: 6px; width: 2px; background: var(--border); }
            .timeline-item { position: relative; margin-bottom: 20px; padding-left: 15px; }
            .timeline-dot { position: absolute; left: -20px; top: 4px; width: 12px; height: 12px; border-radius: 50%; background: var(--primary); border: 2px solid var(--surface); box-shadow: 0 0 0 2px var(--border); }
            .timeline-time { font-size: 0.7rem; font-weight: 700; color: var(--text-muted); background: var(--bg-main); padding: 2px 8px; border-radius: 10px; display: inline-block; margin-bottom: 4px; }
            .timeline-title { font-size: 0.95rem; font-weight: 700; color: var(--text-main); text-transform: uppercase; margin: 0 0 2px 0; }
            .timeline-desc { font-size: 0.85rem; color: var(--text-muted); margin: 0 0 4px 0; }
            .badge-status { font-size: 0.7rem; font-weight: 800; padding: 2px 8px; border-radius: 6px; display: inline-block; }
            .badge-lulus { background: #D1FAE5; color: #065F46; }
            .badge-ulang { background: #FEE2E2; color: #991B1B; }
            .badge-absen { background: #E0E7FF; color: #3730A3; }
            
            #namesTooltip { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border: 1px solid var(--border); border-radius: 16px; padding: 15px; z-index: 100; width: 85%; box-shadow: 0 10px 40px rgba(0,0,0,0.2); display: none; flex-direction: column; }
            [data-theme="dark"] #namesTooltip { background: rgba(30,33,48,0.95); }
            .tooltip-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 10px; margin-bottom: 10px;}
            .tooltip-title { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 1rem;}
            .tooltip-list { max-height: 200px; overflow-y: auto; font-size: 0.85rem; color: var(--text-main); }
            .tooltip-list div { padding: 8px 0; border-bottom: 1px dashed var(--border); display: flex; justify-content: space-between;}
            .tooltip-close { background: #FEE2E2; color: #991B1B; border: none; width: 28px; height: 28px; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; transition: 0.2s;}
            .tooltip-close:active { transform: scale(0.9); }
            .legend-item { cursor: pointer; transition: 0.2s; padding: 5px; border-radius: 8px; }
            .legend-item:active { background: var(--bg-main); transform: scale(0.95); }
        </style>

        <div class="greeting-area">
            <h3 id="welcomeGreeting">Ahlan wa Sahlan, Ustadz!</h3>
            <p>"Setiap huruf Al-Qur'an yang diajarkan adalah pahala jariyah yang mengalir tanpa henti."</p>
        </div>

        <div class="info-grid">
            <div class="info-card" style="display:flex; flex-direction:column; background: linear-gradient(135deg, #75B5B0 0%, #4F567D 100%); color: #ffffff; border: none; box-shadow: 0 6px 15px rgba(79, 86, 125, 0.2);">
                <p style="font-size: 0.65rem; font-weight: 800; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;"><i class="far fa-calendar-alt"></i> Tanggal & Waktu</p>
                <p id="currentDateDisplay" style="font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.95); margin-bottom: 2px;">Memuat...</p>
                <p id="realtimeClock" style="font-size: 1.35rem; font-weight: 800; color: #ffffff; margin-bottom: 15px; letter-spacing: 1px; font-variant-numeric: tabular-nums;">00.00.00</p>
                
                <div style="border-top: 1px dashed rgba(255,255,255,0.3); padding-top: 12px; margin-top: auto;" id="jadwalArea">
                    <p style="font-size: 0.65rem; font-weight: 800; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;"><i class="fas fa-calendar-check" style="color: #A7F3D0;"></i> Jadwal Selanjutnya</p>
                    <div id="jadwalContent">
                        <span style="font-size:0.8rem; color:rgba(255,255,255,0.8);"><i class="fas fa-spinner fa-spin"></i> Memindai jadwal...</span>
                    </div>
                </div>
            </div>

            <div class="info-card target-card" style="display:flex; flex-direction:column;">
                <p class="info-label">Target KBM</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <p class="info-value highlight" id="academicTargetDisplay">24 Hari</p>
                    <i class="fas fa-bullseye" style="font-size: 1.2rem; opacity: 0.5;"></i>
                </div>
                <div style="border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 12px; margin-top: auto;">
                     <p style="font-size: 0.75rem; margin:0; opacity:0.9;"><i class="fas fa-info-circle"></i> Target Bulanan</p>
                </div>
            </div>
        </div>

        <div class="time-filters">
            <button class="filter-btn active" id="btn-hari" data-filter="hari">Hari Ini</button>
            <button class="filter-btn" id="btn-pekan" data-filter="pekan">Pekan Ini</button>
            <button class="filter-btn" id="btn-bulan" data-filter="bulan">Bulan Ini</button>
        </div>

        <div class="dashboard-chart-card" style="position: relative;">
            <div id="namesTooltip">
                <div class="tooltip-header">
                    <span class="tooltip-title"><div class="legend-dot" id="ttDot"></div> <span id="ttLabel">Daftar</span></span>
                    <button class="tooltip-close" id="btnCloseTooltip"><i class="fas fa-times"></i></button>
                </div>
                <div class="tooltip-list" id="ttNames">Memuat data...</div>
            </div>

            <div class="chart-container-box">
                <canvas id="concentricChart"></canvas>
                <div class="chart-center-text">
                    <p id="chartClassNameText" style="margin: 0; font-size: 0.65rem; font-weight: 800; color: var(--text-muted); letter-spacing: 1px; text-transform: uppercase;">MENGHITUNG...</p>
                    <h3 id="chartTotalText" style="margin: 0; font-size: 2.2rem; color: var(--text-main); font-weight: 700; line-height: 1.1;">0</h3>
                </div>
            </div>

            <div class="legend-grid">
                <div class="legend-item" data-type="Hadir" data-color="#75B5B0"><div class="legend-dot" style="background: var(--clr-toska);"></div><span class="legend-title">Hadir</span><span class="legend-val" id="valHadir">0</span></div>
                <div class="legend-item" data-type="Izin/Skt" data-color="#8999B8"><div class="legend-dot" style="background: var(--clr-biru);"></div><span class="legend-title">Izin/Skt</span><span class="legend-val" id="valIzinSkt">0</span></div>
                <div class="legend-item" data-type="Alfa" data-color="#F39B96"><div class="legend-dot" style="background: var(--clr-koral);"></div><span class="legend-title">Alfa</span><span class="legend-val" id="valAlfa">0</span></div>
                <div class="legend-item" data-type="Ulang" data-color="#4F567D"><div class="legend-dot" style="background: var(--clr-dongker);"></div><span class="legend-title">Ulang</span><span class="legend-val" id="valUlang">0</span></div>
            </div>
        </div>

        <div style="margin-bottom: 30px; background: var(--surface); padding: 20px; border-radius: 16px; border: 1px solid var(--border);">
            <h4 id="titleRiwayat" style="font-size: 1rem; font-weight: 700; margin-bottom: 15px;"><i class="fas fa-history" style="color: var(--primary); margin-right: 8px;"></i> Riwayat Aktivitas</h4>
            <div id="timelineWrapper">
                <p style="text-align:center; color:var(--text-muted); padding:20px;"><i class="fas fa-circle-notch fa-spin"></i> Memuat data...</p>
            </div>
        </div>
    `;
}

async function initDashboardGuru() {
    const elDate = document.getElementById('currentDateDisplay');
    const elClock = document.getElementById('realtimeClock');
    const welcomeGreeting = document.getElementById('welcomeGreeting');
    
    const userRole = localStorage.getItem('user_role') || 'Guru';
    const userName = localStorage.getItem('user_name') || '';
    const guruId = localStorage.getItem('guru_id'); 

    if (userRole === 'Admin') {
        welcomeGreeting.innerHTML = `Ahlan wa Sahlan, Administrator!`;
    } else {
        welcomeGreeting.innerHTML = `Ahlan wa Sahlan, Ust. ${userName || 'Guru'}!`;
    }
    
    function updateClock() {
        const now = new Date();
        elDate.textContent = now.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' });
        elClock.textContent = now.toLocaleTimeString('id-ID', { hour12: false }).replace(/:/g, '.'); 
    }
    setInterval(updateClock, 1000);
    updateClock();

    const ctx = document.getElementById('concentricChart');
    if(!ctx) return;

    const trackColor = document.body.hasAttribute('data-theme') ? 'rgba(255,255,255,0.05)' : '#E8E6F0';
    const gapColor = document.body.hasAttribute('data-theme') ? '#1E2130' : '#FFFFFF'; 

    const chartConfig = {
        type: 'doughnut',
        data: { labels: ['Hadir', 'Izin', 'Alfa', 'Ulang'], datasets: [
            { data: [0, 1], backgroundColor: ['#75B5B0', trackColor], borderWidth: 4, borderColor: gapColor, borderRadius: 20 },
            { data: [0, 1], backgroundColor: ['#8999B8', trackColor], borderWidth: 4, borderColor: gapColor, borderRadius: 20 },
            { data: [0, 1], backgroundColor: ['#F39B96', trackColor], borderWidth: 4, borderColor: gapColor, borderRadius: 20 },
            { data: [0, 1], backgroundColor: ['#4F567D', trackColor], borderWidth: 4, borderColor: gapColor, borderRadius: 20 } 
        ]},
        options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { display: false }, tooltip: { enabled: false } }, animation: { animateScale: true, animateRotate: true } }
    };
    if (myChart) myChart.destroy();
    myChart = new Chart(ctx.getContext('2d'), chartConfig);

    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const today = new Date();
    const todayStr = formatDate(today);
    
    const dayOfWeek = today.getDay();
    const startOfWeekDate = new Date(today);
    startOfWeekDate.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    const startOfWeekStr = formatDate(startOfWeekDate);

    const startOfMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfMonthStr = formatDate(startOfMonthDate);

    let tooltipDataObj = { 'Hadir': {}, 'Izin/Skt': {}, 'Alfa': {}, 'Ulang': {} };

    function renderFilteredData(filterType) {
        let startDateFilter = todayStr;
        let titleSuffix = "Hari Ini";

        if (filterType === 'pekan') { startDateFilter = startOfWeekStr; titleSuffix = "Pekan Ini"; }
        else if (filterType === 'bulan') { startDateFilter = startOfMonthStr; titleSuffix = "Bulan Ini"; }

        document.getElementById('titleRiwayat').innerHTML = `<i class="fas fa-history" style="color: var(--primary); margin-right: 8px;"></i> Riwayat Aktivitas ${titleSuffix}`;

        const filteredLog = rawHarianList.filter(log => log.tanggal >= startDateFilter && log.tanggal <= todayStr);
        tooltipDataObj = { 'Hadir': {}, 'Izin/Skt': {}, 'Alfa': {}, 'Ulang': {} };
        let hadir = 0, izinSakit = 0, alfa = 0, ulang = 0;
        
        let chartSantriList = rawSantriList;
        if (namaKelasAktif && userRole !== 'Admin') {
            chartSantriList = rawSantriList.filter(s => s.nama_kelas === namaKelasAktif);
            document.getElementById('chartClassNameText').textContent = `KELAS ${namaKelasAktif.toUpperCase()}`;
        } else {
            document.getElementById('chartClassNameText').textContent = 'SEMUA KELAS';
        }
        
        const totalSantriKelas = chartSantriList.length;

        filteredLog.forEach(log => {
            if (namaKelasAktif && userRole !== 'Admin' && log.nama_kelas !== namaKelasAktif) return; 
            const nama = log.nama_santri || 'Tanpa Nama';
            if(log.status_hadir === 'Hadir') { hadir++; tooltipDataObj['Hadir'][nama] = (tooltipDataObj['Hadir'][nama] || 0) + 1; }
            else if(log.status_hadir === 'Izin' || log.status_hadir === 'Sakit') { izinSakit++; tooltipDataObj['Izin/Skt'][nama] = (tooltipDataObj['Izin/Skt'][nama] || 0) + 1; }
            else if(log.status_hadir === 'Alpa') { alfa++; tooltipDataObj['Alfa'][nama] = (tooltipDataObj['Alfa'][nama] || 0) + 1; }
            if(log.tahsin_status === 'Ulang' || log.tahfidz_status === 'Ulang') { ulang++; tooltipDataObj['Ulang'][nama] = (tooltipDataObj['Ulang'][nama] || 0) + 1; }
        });

        document.getElementById('chartTotalText').textContent = totalSantriKelas || 0;
        document.getElementById('valHadir').textContent = hadir;
        document.getElementById('valIzinSkt').textContent = izinSakit;
        document.getElementById('valAlfa').textContent = alfa;
        document.getElementById('valUlang').textContent = ulang;

        const multiplier = filterType === 'pekan' ? 5 : (filterType === 'bulan' ? 20 : 1);
        const targetTotal = (totalSantriKelas === 0 ? 1 : totalSantriKelas) * multiplier;
        
        myChart.data.datasets[0].data = [hadir, Math.max(0, targetTotal - hadir)];
        myChart.data.datasets[1].data = [izinSakit, Math.max(0, targetTotal - izinSakit)];
        myChart.data.datasets[2].data = [alfa, Math.max(0, targetTotal - alfa)];
        myChart.data.datasets[3].data = [ulang, Math.max(0, targetTotal - ulang)];
        myChart.update();

        const timelineWrapper = document.getElementById('timelineWrapper');
        let timelineHTML = '';
        let listEvents = [];
        let kelasAbsenSet = new Set();

        filteredLog.forEach(row => {
            let timeStr = '12.00';
            if (row.created_at) {
                const dt = new Date(row.created_at);
                timeStr = `${String(dt.getHours()).padStart(2,'0')}.${String(dt.getMinutes()).padStart(2,'0')}`;
            }
            const uniqKey = `${row.tanggal}_${row.nama_kelas}`; 

            if (row.status_hadir && row.nama_kelas && !kelasAbsenSet.has(uniqKey)) {
                kelasAbsenSet.add(uniqKey);
                let titleAbs = `KELAS ${row.nama_kelas.toUpperCase()}`;
                if(filterType !== 'hari') titleAbs += ` <span style="font-size:0.6rem; color:#999;">(${row.tanggal.split('-').reverse().join('/')})</span>`;
                listEvents.push({ time: timeStr, title: titleAbs, desc: 'Terabsensi', statusText: 'SELESAI', badgeClass: 'badge-absen', dotColor: '#8999B8' });
            }

            if (row.tahsin_status) {
                let descTahsin = row.tahsin_program === "Al Qur'an" ? `Al Qur'an Juz ${row.tahsin_juz || 1} (${row.tahsin_surat || ''} ${row.tahsin_ayat_dari || 1}-${row.tahsin_ayat_sampai || 10})` : `${row.tahsin_program || 'Iqro'} ${row.tahsin_jilid || 1} hal. ${row.tahsin_halaman || 1}`;
                listEvents.push({ time: timeStr, title: row.nama_santri || 'Tanpa Nama', desc: descTahsin, statusText: row.tahsin_status, badgeClass: row.tahsin_status === 'Ulang' ? 'badge-ulang' : 'badge-lulus', dotColor: row.tahsin_status === 'Ulang' ? '#F39B96' : '#75B5B0' });
            }

            if (row.tahfidz_status) {
                const descTahfidz = `Al Qur'an Juz ${row.tahfidz_juz || 30} ${row.tahfidz_surat || ''} ${row.tahfidz_ayat_dari || 1}-${row.tahfidz_ayat_sampai || 10}`;
                listEvents.push({ time: timeStr, title: row.nama_santri || 'Tanpa Nama', desc: descTahfidz, statusText: row.tahfidz_status, badgeClass: row.tahfidz_status === 'Ulang' ? 'badge-ulang' : 'badge-lulus', dotColor: row.tahfidz_status === 'Ulang' ? '#F39B96' : '#10B981' });
            }
        });

        const eventsReversed = listEvents.reverse().slice(0, 15); 
        if (eventsReversed.length === 0) {
            timelineWrapper.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:20px;">Belum ada aktivitas.</div>`;
        } else {
            timelineHTML = '<div class="timeline-container">';
            eventsReversed.forEach(ev => {
                timelineHTML += `<div class="timeline-item"><div class="timeline-dot" style="background: ${ev.dotColor};"></div><span class="timeline-time">${ev.time} WIB</span><h5 class="timeline-title">${ev.title}</h5><p class="timeline-desc">${ev.desc}</p><span class="badge-status ${ev.badgeClass}">${ev.statusText}</span></div>`;
            });
            timelineHTML += '</div>';
            timelineWrapper.innerHTML = timelineHTML;
        }
    }

    async function hydrateDashboard() {
        try {
            const [santriList, harianList, kelasList] = await Promise.all([
                api.get('dapodik_santri', 'select=id,nama_kelas,nama_santri'),
                api.get('input_harian', `select=*&tanggal=gte.${startOfMonthStr}&order=created_at.asc`),
                api.get('kelas', 'select=*')
            ]);
            
            let activeKelasList = kelasList || [];

            if (userRole !== 'Admin' && guruId) {
                activeKelasList = activeKelasList.filter(k => String(k.guru_id) === String(guruId));
                const arrKelas = activeKelasList.map(k => k.nama_kelas.toLowerCase());
                
                rawSantriList = (santriList || []).filter(s => s.nama_kelas && arrKelas.includes(s.nama_kelas.toLowerCase()));
                rawHarianList = (harianList || []).filter(h => h.nama_kelas && arrKelas.includes(h.nama_kelas.toLowerCase()));
            } else {
                rawHarianList = harianList || []; 
                rawSantriList = santriList || [];
            }

            if(activeKelasList.length > 0) {
                const currentMins = today.getHours() * 60 + today.getMinutes();
                let kelasAktifArr = []; 
                let kelasMendatang = null;
                
                activeKelasList.forEach(k => {
                    if (k.jam_kelas && k.jam_kelas.includes('-')) {
                        const [sStr, eStr] = k.jam_kelas.split('-');
                        const startMins = (parseInt(sStr.split(':')[0]) * 60) + (parseInt(sStr.split(':')[1]) || 0);
                        const endMins = (parseInt(eStr.split(':')[0]) * 60) + (parseInt(eStr.split(':')[1]) || 0);
                        
                        if (currentMins >= startMins && currentMins <= endMins) {
                            kelasAktifArr.push(k);
                        } else if (currentMins < startMins) { 
                            if (!kelasMendatang || startMins < kelasMendatang.startMins) {
                                kelasMendatang = { ...k, startMins }; 
                            }
                        }
                    }
                });

                const jadwalContent = document.getElementById('jadwalContent');
                
                if (kelasAktifArr.length > 0) { 
                    if(userRole === 'Admin') {
                        namaKelasAktif = null;
                        let teksTampil = kelasAktifArr.length > 1 ? `${kelasAktifArr.length} Kelas Bersamaan` : kelasAktifArr[0].nama_kelas;
                        jadwalContent.innerHTML = `<div style="display: flex; flex-direction: column; gap: 6px;"><div style="align-self: flex-start;"><span style="background: rgba(254, 226, 226, 0.9); color: #991B1B; padding: 4px 8px; border-radius: 6px; font-size: 0.65rem; font-weight: 800;">BERJALAN</span></div><div style="font-size: 1.05rem; font-weight: 800; color: #ffffff;">${teksTampil}</div></div>`; 
                    } else {
                        namaKelasAktif = kelasAktifArr[0].nama_kelas; 
                        jadwalContent.innerHTML = `<div style="display: flex; flex-direction: column; gap: 6px;"><div style="align-self: flex-start;"><span style="background: rgba(254, 226, 226, 0.9); color: #991B1B; padding: 4px 8px; border-radius: 6px; font-size: 0.65rem; font-weight: 800;">BERJALAN</span></div><div style="font-size: 1.05rem; font-weight: 800; color: #ffffff;">${kelasAktifArr[0].nama_kelas}</div></div>`; 
                    }
                }
                else if (kelasMendatang) { 
                    namaKelasAktif = userRole === 'Admin' ? null : kelasMendatang.nama_kelas; 
                    jadwalContent.innerHTML = `<div style="display: flex; flex-direction: column; gap: 6px;"><div style="align-self: flex-start;"><span style="background: rgba(209, 250, 229, 0.9); color: #065F46; padding: 4px 8px; border-radius: 6px; font-size: 0.65rem; font-weight: 800;">MENUNGGU</span></div><div style="font-size: 1.05rem; font-weight: 800; color: #ffffff;">${kelasMendatang.nama_kelas}</div></div>`; 
                }
                else { 
                    namaKelasAktif = null; 
                    const teksSelesai = userRole !== 'Admin' ? 'Semua kelas Anda selesai.' : 'Semua kelas selesai hari ini.';
                    jadwalContent.innerHTML = `<span style="font-size:0.85rem; color:rgba(255,255,255,0.8); font-weight:600;">${teksSelesai}</span>`; 
                }
            } else {
                 document.getElementById('jadwalContent').innerHTML = `<span style="font-size:0.85rem; color:rgba(255,255,255,0.8); font-weight:600;">Belum ada jadwal kelas.</span>`;
            }

            renderFilteredData('hari');
        } catch(e) { console.error("Dashboard Error:", e); }
    }
    
    hydrateDashboard();

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderFilteredData(e.target.getAttribute('data-filter'));
        });
    });

    const tooltip = document.getElementById('namesTooltip');
    const ttLabel = document.getElementById('ttLabel');
    const ttNames = document.getElementById('ttNames');
    const ttDot = document.getElementById('ttDot');

    document.querySelectorAll('.legend-item').forEach(el => {
        el.addEventListener('click', () => {
            const type = el.getAttribute('data-type');
            ttLabel.textContent = `Daftar ${type}`;
            ttDot.style.background = el.getAttribute('data-color');
            let htmlList = '';
            const dataPilihan = tooltipDataObj[type] || {};
            for (const [namaSantri, jumlah] of Object.entries(dataPilihan)) htmlList += `<div><span>${namaSantri}</span> <span style="font-weight:700; color:${el.getAttribute('data-color')};">${jumlah > 1 ? `${jumlah}x` : ''}</span></div>`;
            if (htmlList === '') htmlList = `<div style="justify-content:center; color:var(--text-muted); border:none;">Kosong</div>`;
            ttNames.innerHTML = htmlList;
            tooltip.style.display = 'flex';
        });
    });

    document.getElementById('btnCloseTooltip').addEventListener('click', () => tooltip.style.display = 'none');
}
