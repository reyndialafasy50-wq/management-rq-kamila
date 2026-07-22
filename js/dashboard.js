/**
 * ==================================================
 * BAGIAN 7: MODUL DASHBOARD (SMART FILTER KELAS & LOG DETAIL)
 * File: js/dashboard.js
 * ==================================================
 */
import { api } from './api.js';

let myChart;

export function renderDashboard() {
    return `
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
                    <!-- Keterangan Kelas Dinamis -->
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

        <div style="margin-bottom: 30px;">
            <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 15px;"><i class="fas fa-list-ul" style="color: var(--primary); margin-right: 8px;"></i> Log Riwayat Hari Ini</h4>
            <div class="custom-table-container">
                <table class="custom-table">
                    <thead>
                        <tr>
                            <th>Nama Santri</th>
                            <th>Kelas</th>
                            <th>Kategori</th>
                            <th style="text-align: center;">Status</th>
                        </tr>
                    </thead>
                    <tbody id="logTableBody">
                        <tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding:20px;">Memuat riwayat...</td></tr>
                    </tbody>
                </table>
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

    const style = getComputedStyle(document.body);
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
                api.get('input_harian', `select=*&tanggal=eq.${todayStr}`),
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

            // --- B. GRAFIK (HANYA HITUNG KELAS YG AKTIF) ---
            let namaKelasChart = kelasAktif ? kelasAktif.nama_kelas : (kelasMendatang ? kelasMendatang.nama_kelas : null);
            
            // Total santri untuk kelas yang berjalan, jika tidak ada, total semua santri.
            let chartSantriList = santriList;
            if (namaKelasChart) chartSantriList = santriList.filter(s => s.nama_kelas === namaKelasChart);
            
            const totalSantriKelas = chartSantriList.length;
            document.getElementById('chartClassNameText').textContent = namaKelasChart ? `KELAS ${namaKelasChart.toUpperCase()}` : 'SEMUA KELAS';
            document.getElementById('chartTotalText').textContent = totalSantriKelas || 0;

            let hadir = 0, izinSakit = 0, alfa = 0, ulang = 0;
            
            if(harianList && harianList.length > 0) {
                harianList.forEach(log => {
                    // Hanya hitung grafik untuk kelas yang sedang tampil di donat
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

            // --- C. TABEL LOG DETAIL & RAPI ---
            let logHTML = '';
            let listAktivitas = [];

            if (harianList && harianList.length > 0) {
                harianList.forEach(row => {
                    // 1. Catat Jika Ada Kehadiran
                    if (row.status_hadir) {
                        listAktivitas.push({ nama: row.nama_santri, kelas: row.nama_kelas, program: 'Kehadiran', status: row.status_hadir });
                    }
                    // 2. Catat Jika Ada Setoran Tahsin
                    if (row.tahsin_status) {
                        listAktivitas.push({ nama: row.nama_santri, kelas: row.nama_kelas, program: row.tahsin_program || 'Tahsin', status: row.tahsin_status });
                    }
                    // 3. Catat Jika Ada Setoran Tahfidz
                    if (row.tahfidz_status) {
                        listAktivitas.push({ nama: row.nama_santri, kelas: row.nama_kelas, program: 'Tahfidz', status: row.tahfidz_status });
                    }
                });
            }

            // Ambil 8 aktivitas teratas agar riwayat lebih terlihat
            const logTerbaru = listAktivitas.reverse().slice(0, 8);
            
            if(logTerbaru.length === 0) {
                logHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding:30px;">Belum ada aktivitas hari ini.</td></tr>';
            } else {
                logTerbaru.forEach(log => {
                    let bgProg = '', colProg = '', colStat = '';

                    // Styling Label berdasarkan Kategori Program/Aktivitas
                    if (log.program === 'Kehadiran') {
                        bgProg = 'rgba(137, 153, 184, 0.15)'; // Biru pudar
                        colProg = 'var(--clr-biru)';
                        
                        // Warna status kehadiran
                        if (log.status === 'Hadir') colStat = 'var(--clr-toska)';
                        else if (log.status === 'Alpa') colStat = 'var(--clr-koral)';
                        else colStat = 'var(--clr-biru)'; // Izin/Sakit
                    } else if (log.program === 'Tahfidz') {
                        bgProg = 'rgba(117, 181, 176, 0.15)'; 
                        colProg = 'var(--primary)';
                        colStat = log.status === 'Ulang' ? 'var(--clr-koral)' : 'var(--primary)';
                    } else { // Iqro / Ummi / Al Quran
                        bgProg = 'rgba(243, 155, 150, 0.15)'; 
                        colProg = 'var(--clr-koral)';
                        colStat = log.status === 'Ulang' ? 'var(--clr-koral)' : 'var(--primary)';
                    }

                    logHTML += `
                        <tr style="border-bottom: 1px solid var(--border);">
                            <td style="font-weight: 600;">${log.nama || 'Tanpa Nama'}</td>
                            <td><i class="fas fa-tag" style="color:var(--text-muted); font-size:0.7rem;"></i> ${log.kelas || '-'}</td>
                            <td><span style="background:${bgProg}; color:${colProg}; padding:4px 8px; border-radius:6px; font-size:0.7rem; font-weight:700;">${log.program}</span></td>
                            <td style="text-align:center;"><span style="color:${colStat}; font-weight:700;">${log.status}</span></td>
                        </tr>
                    `;
                });
            }
            document.getElementById('logTableBody').innerHTML = logHTML;

        } catch(e) {
            console.error("Dashboard DB Error:", e);
        }
    }
    hydrateDashboard();
}
