/**
 * ==================================================
 * BAGIAN 7: MODUL DASHBOARD (TIMELINE RIWAYAT & SMART FILTER)
 * File: js/dashboard.js
 * ==================================================
 */
import { api } from './api.js';

let myChart;

export function renderDashboard() {
    return `
        <style>
            /* STYLING TIMELINE RIWAYAT AKTIVITAS */
            .timeline-container {
                position: relative;
                padding-left: 20px;
                margin-top: 15px;
            }
            .timeline-container::before {
                content: '';
                position: absolute;
                top: 10px;
                bottom: 10px;
                left: 6px;
                width: 2px;
                background: var(--border);
            }
            .timeline-item {
                position: relative;
                margin-bottom: 20px;
                padding-left: 15px;
            }
            .timeline-dot {
                position: absolute;
                left: -20px;
                top: 4px;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: var(--primary);
                border: 2px solid var(--surface);
                box-shadow: 0 0 0 2px var(--border);
            }
            .timeline-time {
                font-size: 0.7rem;
                font-weight: 700;
                color: var(--text-muted);
                background: var(--bg-main);
                padding: 2px 8px;
                border-radius: 10px;
                display: inline-block;
                margin-bottom: 4px;
            }
            .timeline-title {
                font-size: 0.95rem;
                font-weight: 700;
                color: var(--text-main);
                text-transform: uppercase;
                margin: 0 0 2px 0;
            }
            .timeline-desc {
                font-size: 0.85rem;
                color: var(--text-muted);
                margin: 0 0 4px 0;
            }
            .badge-status {
                font-size: 0.7rem;
                font-weight: 800;
                padding: 2px 8px;
                border-radius: 6px;
                display: inline-block;
            }
            .badge-lulus { background: #D1FAE5; color: #065F46; }
            .badge-ulang { background: #FEE2E2; color: #991B1B; }
            .badge-absen { background: #E0E7FF; color: #3730A3; }
        </style>

        <!-- Sapaan -->
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
            <button class="filter-btn active" id="btn-hari">Hari Ini</button>
            <button class="filter-btn" id="btn-pekan">Pekan Ini</button>
            <button class="filter-btn" id="btn-bulan">Bulan Ini</button>
        </div>

        <div class="dashboard-chart-card">
            <div class="chart-container-box">
                <canvas id="concentricChart"></canvas>
                <div class="chart-center-text">
                    <p id="chartClassNameText" style="margin: 0; font-size: 0.65rem; font-weight: 800; color: var(--text-muted); letter-spacing: 1px; text-transform: uppercase;">MENGHITUNG...</p>
                    <h3 id="chartTotalText" style="margin: 0; font-size: 2.2rem; color: var(--text-main); font-weight: 700; line-height: 1.1;">0</h3>
                </div>
            </div>

            <div class="legend-grid">
                <div class="legend-item"><div class="legend-dot" style="background: var(--clr-toska);"></div><span class="legend-title">Hadir</span><span class="legend-val" id="valHadir">0</span></div>
                <div class="legend-item"><div class="legend-dot" style="background: var(--clr-biru);"></div><span class="legend-title">Izin/Skt</span><span class="legend-val" id="valIzinSkt">0</span></div>
                <div class="legend-item"><div class="legend-dot" style="background: var(--clr-koral);"></div><span class="legend-title">Alfa</span><span class="legend-val" id="valAlfa">0</span></div>
                <div class="legend-item"><div class="legend-dot" style="background: var(--clr-dongker);"></div><span class="legend-title">Ulang</span><span class="legend-val" id="valUlang">0</span></div>
            </div>
        </div>

        <!-- RIWAYAT AKTIVITAS HARI INI (DESAIN TIMELINE) -->
        <div style="margin-bottom: 30px; background: var(--surface); padding: 20px; border-radius: 16px; border: 1px solid var(--border);">
            <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 15px;"><i class="fas fa-history" style="color: var(--primary); margin-right: 8px;"></i> Riwayat Aktivitas Hari Ini</h4>
            
            <div id="timelineWrapper">
                <p style="text-align:center; color:var(--text-muted); padding:20px;">Memuat riwayat...</p>
            </div>
        </div>
    `;
}

export async function initDashboard() {
    const elDate = document.getElementById('currentDateDisplay');
    const elClock = document.getElementById('realtimeClock');
    
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
        data: {
            labels: ['Hadir', 'Izin', 'Alfa', 'Ulang'],
            datasets: [
                { data: [0, 100], backgroundColor: ['#75B5B0', trackColor], borderWidth: 4, borderColor: gapColor, borderRadius: 20 },
                { data: [0, 100], backgroundColor: ['#8999B8', trackColor], borderWidth: 4, borderColor: gapColor, borderRadius: 20 },
                { data: [0, 100], backgroundColor: ['#F39B96', trackColor], borderWidth: 4, borderColor: gapColor, borderRadius: 20 },
                { data: [0, 100], backgroundColor: ['#4F567D', trackColor], borderWidth: 4, borderColor: gapColor, borderRadius: 20 } 
            ]
        },
        options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { display: false }, tooltip: { enabled: false } }, animation: { animateScale: true, animateRotate: true } }
    };
    
    if (myChart) myChart.destroy();
    myChart = new Chart(ctx.getContext('2d'), chartConfig);

    async function hydrateDashboard() {
        try {
            const d = new Date();
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const todayStr = `${year}-${month}-${day}`;
            
            const [santriList, harianList, kelasList] = await Promise.all([
                api.get('dapodik_santri', 'select=id,nama_kelas,nama_santri'),
                api.get('input_harian', `select=*&tanggal=eq.${todayStr}&order=created_at.asc`),
                api.get('kelas', 'select=*')
            ]);

            // --- A. DETEKSI KELAS AKTIF ---
            let kelasAktif = null;
            let kelasMendatang = null;

            if(kelasList.length > 0) {
                const currentMins = d.getHours() * 60 + d.getMinutes();
                kelasList.forEach(k => {
                    if (k.jam_kelas && k.jam_kelas.includes('-')) {
                        const [sStr, eStr] = k.jam_kelas.split('-');
                        const [hS, mS] = sStr.trim().split(':').map(Number);
                        const [hE, mE] = eStr.trim().split(':').map(Number);
                        const startMins = (hS * 60) + (mS || 0);
                        const endMins = (hE * 60) + (mE || 0);

                        if (currentMins >= startMins && currentMins <= endMins) kelasAktif = k;
                        else if (currentMins < startMins) {
                            if (!kelasMendatang || startMins < kelasMendatang.startMins) kelasMendatang = { ...k, startMins };
                        }
                    }
                });

                const jadwalContent = document.getElementById('jadwalContent');
                if (kelasAktif) {
                    jadwalContent.innerHTML = `<div style="display: flex; flex-direction: column; gap: 6px;"><div style="align-self: flex-start;"><span style="background: rgba(254, 226, 226, 0.9); color: #991B1B; padding: 4px 8px; border-radius: 6px; font-size: 0.65rem; font-weight: 800;">BERJALAN</span></div><div style="font-size: 1.05rem; font-weight: 800; color: #ffffff;">${kelasAktif.nama_kelas}</div></div>`;
                } else if (kelasMendatang) {
                    jadwalContent.innerHTML = `<div style="display: flex; flex-direction: column; gap: 6px;"><div style="align-self: flex-start;"><span style="background: rgba(209, 250, 229, 0.9); color: #065F46; padding: 4px 8px; border-radius: 6px; font-size: 0.65rem; font-weight: 800;">MENUNGGU</span></div><div style="font-size: 1.05rem; font-weight: 800; color: #ffffff;">${kelasMendatang.nama_kelas}</div></div>`;
                } else {
                    jadwalContent.innerHTML = `<span style="font-size:0.85rem; color:rgba(255,255,255,0.8); font-weight:600;">Semua kelas selesai.</span>`;
                }
            }

            // --- B. HITUNG GRAFIK DONAT ---
            let namaKelasChart = kelasAktif ? kelasAktif.nama_kelas : (kelasMendatang ? kelasMendatang.nama_kelas : null);
            let chartSantriList = santriList;
            if (namaKelasChart) chartSantriList = santriList.filter(s => s.nama_kelas === namaKelasChart);
            
            const totalSantriKelas = chartSantriList.length;
            document.getElementById('chartClassNameText').textContent = namaKelasChart ? `KELAS ${namaKelasChart.toUpperCase()}` : 'SEMUA KELAS';
            document.getElementById('chartTotalText').textContent = totalSantriKelas || 0;

            let hadir = 0, izinSakit = 0, alfa = 0, ulang = 0;
            
            if(harianList && harianList.length > 0) {
                harianList.forEach(log => {
                    if (namaKelasChart && log.nama_kelas !== namaKelasChart) return;

                    if(log.status_hadir === 'Hadir') hadir++;
                    else if(log.status_hadir === 'Izin' || log.status_hadir === 'Sakit') izinSakit++;
                    else if(log.status_hadir === 'Alpa') alfa++;

                    if(log.tahsin_status === 'Ulang' || log.tahfidz_status === 'Ulang') ulang++;
                });
            }

            document.getElementById('valHadir').textContent = hadir;
            document.getElementById('valIzinSkt').textContent = izinSakit;
            document.getElementById('valAlfa').textContent = alfa;
            document.getElementById('valUlang').textContent = ulang;

            const total = totalSantriKelas === 0 ? 1 : totalSantriKelas; 
            myChart.data.datasets[0].data = [hadir, Math.max(0, total - hadir)];
            myChart.data.datasets[1].data = [izinSakit, Math.max(0, total - izinSakit)];
            myChart.data.datasets[2].data = [alfa, Math.max(0, total - alfa)];
            myChart.data.datasets[3].data = [ulang, Math.max(0, total - ulang)];
            myChart.update();

            // --- C. LOGIKA TIMELINE RIWAYAT AKTIVITAS ---
            const timelineWrapper = document.getElementById('timelineWrapper');
            let timelineHTML = '';
            let listEvents = [];
            let kelasAbsenSet = new Set();

            if (harianList && harianList.length > 0) {
                harianList.forEach(row => {
                    // Ambil Waktu Jam.Menit WIB
                    let timeStr = '12.00';
                    if (row.created_at) {
                        const dt = new Date(row.created_at);
                        timeStr = `${String(dt.getHours()).padStart(2,'0')}.${String(dt.getMinutes()).padStart(2,'0')}`;
                    }

                    // 1. EVENT KEHADIRAN (DIKELOMPOKKAN PER KELAS)
                    if (row.status_hadir && row.nama_kelas && !kelasAbsenSet.has(row.nama_kelas)) {
                        kelasAbsenSet.add(row.nama_kelas);
                        listEvents.push({
                            time: timeStr,
                            title: `KELAS ${row.nama_kelas.toUpperCase()}`,
                            desc: 'Terabsensi',
                            type: 'absen',
                            statusText: 'SELESAI',
                            badgeClass: 'badge-absen',
                            dotColor: '#8999B8'
                        });
                    }

                    // 2. EVENT TAHSIN
                    if (row.tahsin_status) {
                        let descTahsin = '';
                        if (row.tahsin_program === "Al Qur'an") {
                            const surah = row.tahsin_surat || 'Al-Baqarah';
                            const aAwal = row.tahsin_ayat_dari || '1';
                            const aAkhir = row.tahsin_ayat_sampai || '10';
                            descTahsin = `Al Qur'an Juz ${row.tahsin_juz || 1} (${surah} ${aAwal}-${aAkhir})`;
                        } else {
                            descTahsin = `${row.tahsin_program || 'Iqro'} ${row.tahsin_jilid || 1} hal. ${row.tahsin_halaman || 1}`;
                        }

                        listEvents.push({
                            time: timeStr,
                            title: row.nama_santri || 'Tanpa Nama',
                            desc: descTahsin,
                            type: 'tahsin',
                            statusText: row.tahsin_status,
                            badgeClass: row.tahsin_status === 'Ulang' ? 'badge-ulang' : 'badge-lulus',
                            dotColor: row.tahsin_status === 'Ulang' ? '#F39B96' : '#75B5B0'
                        });
                    }

                    // 3. EVENT TAHFIDZ
                    if (row.tahfidz_status) {
                        const surah = row.tahfidz_surat || 'An-Naba\'';
                        const aAwal = row.tahfidz_ayat_dari || '1';
                        const aAkhir = row.tahfidz_ayat_sampai || '10';
                        const descTahfidz = `Al Qur'an Juz ${row.tahfidz_juz || 30} ${surah} ${aAwal}-${aAkhir}`;

                        listEvents.push({
                            time: timeStr,
                            title: row.nama_santri || 'Tanpa Nama',
                            desc: descTahfidz,
                            type: 'tahfidz',
                            statusText: row.tahfidz_status,
                            badgeClass: row.tahfidz_status === 'Ulang' ? 'badge-ulang' : 'badge-lulus',
                            dotColor: row.tahfidz_status === 'Ulang' ? '#F39B96' : '#10B981'
                        });
                    }
                });
            }

            // Balikkan urutan agar aktivitas paling baru muncul di paling atas
            const eventsReversed = listEvents.reverse();

            if (eventsReversed.length === 0) {
                timelineWrapper.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:20px;">Belum ada aktivitas hari ini.</div>`;
            } else {
                timelineHTML = '<div class="timeline-container">';
                eventsReversed.forEach(ev => {
                    timelineHTML += `
                        <div class="timeline-item">
                            <div class="timeline-dot" style="background: ${ev.dotColor};"></div>
                            <span class="timeline-time">${ev.time} WIB</span>
                            <h5 class="timeline-title">${ev.title}</h5>
                            <p class="timeline-desc">${ev.desc}</p>
                            <span class="badge-status ${ev.badgeClass}">${ev.statusText}</span>
                        </div>
                    `;
                });
                timelineHTML += '</div>';
                timelineWrapper.innerHTML = timelineHTML;
            }

        } catch(e) {
            console.error("Dashboard DB Error:", e);
        }
    }
    hydrateDashboard();
        }
