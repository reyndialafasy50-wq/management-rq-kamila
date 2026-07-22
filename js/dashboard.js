/**
 * ==================================================
 * BAGIAN 7: MODUL DASHBOARD (TERINTEGRASI SINGLE-TABLE V3)
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

        <!-- Info Card -->
        <div class="info-grid">
            
            <!-- KARTU 1: TANGGAL & JADWAL (GRADASI REVERSE DARI KANAN) -->
            <div class="info-card" style="display:flex; flex-direction:column; background: linear-gradient(135deg, #75B5B0 0%, #4F567D 100%); color: #ffffff; border: none; box-shadow: 0 6px 15px rgba(79, 86, 125, 0.2);">
                <p style="font-size: 0.65rem; font-weight: 800; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;"><i class="far fa-calendar-alt"></i> Tanggal & Waktu</p>
                
                <p id="currentDateDisplay" style="font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.95); margin-bottom: 2px;">Memuat...</p>
                <p id="realtimeClock" style="font-size: 1.35rem; font-weight: 800; color: #ffffff; margin-bottom: 15px; letter-spacing: 1px; font-variant-numeric: tabular-nums;">00.00.00</p>
                
                <!-- JADWAL SELANJUTNYA -->
                <div style="border-top: 1px dashed rgba(255,255,255,0.3); padding-top: 12px; margin-top: auto;" id="jadwalArea">
                    <p style="font-size: 0.65rem; font-weight: 800; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;"><i class="fas fa-calendar-check" style="color: #A7F3D0;"></i> Jadwal Selanjutnya</p>
                    <div id="jadwalContent">
                        <span style="font-size:0.8rem; color:rgba(255,255,255,0.8);"><i class="fas fa-spinner fa-spin"></i> Memindai jadwal...</span>
                    </div>
                </div>
            </div>

            <!-- KARTU 2: TARGET KBM -->
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

        <!-- Filter Waktu -->
        <div class="time-filters">
            <button class="filter-btn active" id="btn-hari">Hari Ini</button>
            <button class="filter-btn" id="btn-pekan">Pekan Ini</button>
            <button class="filter-btn" id="btn-bulan">Bulan Ini</button>
        </div>

        <!-- Chart Container -->
        <div class="dashboard-chart-card">
            <div id="namesTooltip" style="display:none;">
                <div class="tooltip-header">
                    <span class="tooltip-title"><div class="legend-dot" id="ttDot"></div> <span id="ttLabel">Daftar</span></span>
                    <button class="tooltip-close" id="btnCloseTooltip"><i class="fas fa-times"></i></button>
                </div>
                <div class="tooltip-list" id="ttNames">Memuat data...</div>
            </div>

            <div class="chart-container-box">
                <canvas id="concentricChart"></canvas>
                <div class="chart-center-text">
                    <p style="margin: 0; font-size: 0.65rem; font-weight: 700; color: var(--text-muted); letter-spacing: 2px;">TOTAL</p>
                    <h3 id="chartTotalText" style="margin: 0; font-size: 2.2rem; color: var(--text-main); font-weight: 700; line-height: 1.1;">0</h3>
                </div>
            </div>

            <!-- Legenda -->
            <div class="legend-grid">
                <div class="legend-item" data-type="Hadir" data-color="var(--clr-toska)">
                    <div class="legend-dot" style="background: var(--clr-toska);"></div>
                    <span class="legend-title">Hadir</span>
                    <span class="legend-val" id="valHadir">0</span>
                </div>
                <div class="legend-item" data-type="Izin/Skt" data-color="var(--clr-biru)">
                    <div class="legend-dot" style="background: var(--clr-biru);"></div>
                    <span class="legend-title">Izin/Skt</span>
                    <span class="legend-val" id="valIzinSkt">0</span>
                </div>
                <div class="legend-item" data-type="Alfa" data-color="var(--clr-koral)">
                    <div class="legend-dot" style="background: var(--clr-koral);"></div>
                    <span class="legend-title">Alfa</span>
                    <span class="legend-val" id="valAlfa">0</span>
                </div>
                <div class="legend-item" data-type="Ulang" data-color="var(--clr-dongker)">
                    <div class="legend-dot" style="background: var(--clr-dongker);"></div>
                    <span class="legend-title">Ulang</span>
                    <span class="legend-val" id="valUlang">0</span>
                </div>
            </div>
        </div>

        <!-- Tabel Log Hari Ini -->
        <div style="margin-bottom: 30px;">
            <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 15px;"><i class="fas fa-list-ul" style="color: var(--primary); margin-right: 8px;"></i> Log Hari Ini</h4>
            <div class="custom-table-container">
                <table class="custom-table">
                    <thead>
                        <tr>
                            <th>Nama Santri</th>
                            <th>Kelas</th>
                            <th>Program</th>
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
    // 1. MESIN WAKTU 
    const elDate = document.getElementById('currentDateDisplay');
    const elClock = document.getElementById('realtimeClock');
    
    function updateClock() {
        const now = new Date();
        elDate.textContent = now.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' });
        elClock.textContent = now.toLocaleTimeString('id-ID', { hour12: false }).replace(/:/g, '.'); 
    }
    setInterval(updateClock, 1000);
    updateClock();

    // 2. SETUP CHART.JS MURNI
    const ctx = document.getElementById('concentricChart');
    if(!ctx) return;

    const isDark = document.body.hasAttribute('data-theme');
    const trackColor = isDark ? 'rgba(255,255,255,0.05)' : '#E8E6F0';
    const gapColor = isDark ? '#1E2130' : '#FFFFFF'; 

    const style = getComputedStyle(document.body);
    const cToska = style.getPropertyValue('--clr-toska').trim() || '#75B5B0';
    const cBiru = style.getPropertyValue('--clr-biru').trim() || '#8999B8';
    const cKoral = style.getPropertyValue('--clr-koral').trim() || '#F39B96';
    const cDongker = style.getPropertyValue('--clr-dongker').trim() || '#4F567D';

    const chartConfig = {
        type: 'doughnut',
        data: {
            labels: ['Hadir', 'Izin', 'Alfa', 'Ulang'],
            datasets: [
                { data: [0, 100], backgroundColor: [cToska, trackColor], borderWidth: 4, borderColor: gapColor, borderRadius: 20 },
                { data: [0, 100], backgroundColor: [cBiru, trackColor], borderWidth: 4, borderColor: gapColor, borderRadius: 20 },
                { data: [0, 100], backgroundColor: [cKoral, trackColor], borderWidth: 4, borderColor: gapColor, borderRadius: 20 },
                { data: [0, 100], backgroundColor: [cDongker, trackColor], borderWidth: 4, borderColor: gapColor, borderRadius: 20 } 
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false, cutout: '65%',
            plugins: { legend: { display: false }, tooltip: { enabled: false } }, 
            animation: { animateScale: true, animateRotate: true }
        }
    };
    
    if (myChart) myChart.destroy();
    myChart = new Chart(ctx.getContext('2d'), chartConfig);

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
        });
    });
    
    const tooltip = document.getElementById('namesTooltip');
    if(document.getElementById('btnCloseTooltip')){
        document.getElementById('btnCloseTooltip').addEventListener('click', () => tooltip.style.display = 'none');
    }

    // 3. TARIK DATA DARI DATABASE (VERSI SINGLE TABLE)
    async function hydrateDashboard() {
        try {
            // Tgl Lokal Indonesia
            const d = new Date();
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const todayStr = `${year}-${month}-${day}`;
            
            // HANYA BUTUH 3 PERMINTAAN SEKARANG! (Jauh lebih cepat)
            const [santriList, harianList, kelasList] = await Promise.all([
                api.get('dapodik_santri', 'select=id,nama_kelas,nama_santri'),
                api.get('input_harian', `select=*&tanggal=eq.${todayStr}`),
                api.get('kelas', 'select=*')
            ]);

            // --- A. LOGIKA JADWAL PINTAR ---
            const jadwalContent = document.getElementById('jadwalContent');
            if(kelasList.length > 0) {
                const currentMins = d.getHours() * 60 + d.getMinutes();
                let kelasAktif = null;
                let kelasMendatang = null;

                kelasList.forEach(k => {
                    if (k.jam_kelas && k.jam_kelas.includes('-')) {
                        const [sStr, eStr] = k.jam_kelas.split('-');
                        const [hS, mS] = sStr.trim().split(':').map(Number);
                        const [hE, mE] = eStr.trim().split(':').map(Number);
                        
                        const startMins = (hS * 60) + (mS || 0);
                        const endMins = (hE * 60) + (mE || 0);

                        if (currentMins >= startMins && currentMins <= endMins) {
                            kelasAktif = k;
                        } else if (currentMins < startMins) {
                            if (!kelasMendatang || startMins < kelasMendatang.startMins) {
                                kelasMendatang = { ...k, startMins };
                            }
                        }
                    }
                });

                if (kelasAktif) {
                    jadwalContent.innerHTML = `
                        <div style="display: flex; flex-direction: column; gap: 6px;">
                            <div style="align-self: flex-start;">
                                <span style="background: rgba(254, 226, 226, 0.9); color: #991B1B; padding: 4px 8px; border-radius: 6px; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
                                    <i class="fas fa-circle" style="font-size:0.4rem; animation: pulse 2s infinite;"></i> BERJALAN
                                </span>
                            </div>
                            <div style="font-size: 1.05rem; font-weight: 800; color: #ffffff; line-height: 1.3; word-wrap: break-word; white-space: normal;">
                                ${kelasAktif.nama_kelas}
                            </div>
                            <div style="font-size: 0.85rem; font-weight: 700; color: rgba(255,255,255,0.85);">
                                <i class="far fa-clock" style="color: #A7F3D0;"></i> ${kelasAktif.jam_kelas}
                            </div>
                        </div>
                    `;
                } else if (kelasMendatang) {
                    jadwalContent.innerHTML = `
                        <div style="display: flex; flex-direction: column; gap: 6px;">
                            <div style="align-self: flex-start;">
                                <span style="background: rgba(209, 250, 229, 0.9); color: #065F46; padding: 4px 8px; border-radius: 6px; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
                                    <i class="far fa-hourglass"></i> MENUNGGU
                                </span>
                            </div>
                            <div style="font-size: 1.05rem; font-weight: 800; color: #ffffff; line-height: 1.3; word-wrap: break-word; white-space: normal;">
                                ${kelasMendatang.nama_kelas}
                            </div>
                            <div style="font-size: 0.85rem; font-weight: 700; color: rgba(255,255,255,0.85);">
                                <i class="far fa-clock" style="color: #A7F3D0;"></i> ${kelasMendatang.jam_kelas}
                            </div>
                        </div>
                    `;
                } else {
                    jadwalContent.innerHTML = `<span style="font-size:0.85rem; color:rgba(255,255,255,0.8); font-weight:600;"><i class="fas fa-check-circle" style="color:#A7F3D0;"></i> Semua kelas selesai.</span>`;
                }
            }

            // --- B. LOGIKA GRAFIK REAL-TIME TERBARU ---
            const totalSantri = santriList.length;
            document.getElementById('chartTotalText').textContent = totalSantri || 0;

            let hadir = 0, izinSakit = 0, alfa = 0, ulang = 0;
            
            if(harianList && harianList.length > 0) {
                harianList.forEach(log => {
                    // Menghitung Absen
                    if(log.status_hadir === 'Hadir') hadir++;
                    else if(log.status_hadir === 'Izin' || log.status_hadir === 'Sakit') izinSakit++;
                    else if(log.status_hadir === 'Alpa') alfa++;

                    // Menghitung Ulang (Cukup cari yang statusnya Ulang dari kolom Tahsin atau Tahfidz)
                    if(log.tahsin_status === 'Ulang' || log.tahfidz_status === 'Ulang') ulang++;
                });
            }

            document.getElementById('valHadir').textContent = hadir;
            document.getElementById('valIzinSkt').textContent = izinSakit;
            document.getElementById('valAlfa').textContent = alfa;
            document.getElementById('valUlang').textContent = ulang;

            const total = totalSantri === 0 ? 1 : totalSantri; 
            myChart.data.datasets[0].data = [hadir, Math.max(0, total - hadir)];
            myChart.data.datasets[1].data = [izinSakit, Math.max(0, total - izinSakit)];
            myChart.data.datasets[2].data = [alfa, Math.max(0, total - alfa)];
            myChart.data.datasets[3].data = [ulang, Math.max(0, total - ulang)];
            myChart.update();

            // --- C. LOGIKA TABEL RIWAYAT TERKINI (MENYEDOT 1 TABEL) ---
            let logHTML = '';
            let listAktivitas = [];

            // Memecah row tunggal menjadi daftar aktivitas
            if (harianList && harianList.length > 0) {
                harianList.forEach(row => {
                    if (row.tahsin_status) {
                        listAktivitas.push({
                            nama: row.nama_santri || 'Tanpa Nama',
                            kelas: row.nama_kelas || '-',
                            program: row.tahsin_program || 'Tahsin',
                            status: row.tahsin_status
                        });
                    }
                    if (row.tahfidz_status) {
                        listAktivitas.push({
                            nama: row.nama_santri || 'Tanpa Nama',
                            kelas: row.nama_kelas || '-',
                            program: 'Tahfidz',
                            status: row.tahfidz_status
                        });
                    }
                });
            }

            // Balik urutan untuk menampilkan yang paling baru, ambil 5 teratas
            const logTerbaru = listAktivitas.reverse().slice(0, 5);
            
            if(logTerbaru.length === 0) {
                logHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding:30px;">Belum ada aktivitas setoran hari ini.</td></tr>';
            } else {
                logTerbaru.forEach(log => {
                    let isTahfidz = log.program === 'Tahfidz';
                    let bgProg = isTahfidz ? 'rgba(117, 181, 176, 0.15)' : 'rgba(243, 155, 150, 0.15)';
                    let colProg = isTahfidz ? 'var(--primary)' : 'var(--clr-koral)';
                    let colStat = log.status === 'Ulang' ? 'var(--clr-koral)' : 'var(--primary)';

                    logHTML += `
                        <tr style="border-bottom: 1px solid var(--border);">
                            <td style="font-weight: 600;">${log.nama}</td>
                            <td><i class="fas fa-tag" style="color:var(--text-muted); font-size:0.7rem;"></i> ${log.kelas}</td>
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
