/**
 * ==================================================
 * BAGIAN 7: MODUL DASHBOARD (UI PUTIH EPIK & JADWAL VERTIKAL)
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
            
            <!-- KARTU 1: TANGGAL & JADWAL (GRADASI EPIK TERANG) -->
            <div class="info-card" style="display:flex; flex-direction:column; background: linear-gradient(135deg, var(--surface) 40%, rgba(117, 181, 176, 0.15) 100%); border: 1px solid rgba(117, 181, 176, 0.3); box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
                <!-- Label Diperkecil -->
                <p style="font-size: 0.65rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;"><i class="far fa-calendar-alt"></i> Tanggal & Waktu</p>
                
                <!-- Tanggal & Jam (Ukuran Disamakan & Diperkecil) -->
                <p id="currentDateDisplay" style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 2px;">Memuat...</p>
                <p id="realtimeClock" style="font-size: 1.05rem; font-weight: 800; color: var(--text-main); margin-bottom: 15px; letter-spacing: 0.5px;">00:00:00</p>
                
                <!-- JADWAL SELANJUTNYA (FORMAT VERTIKAL 3 BARIS) -->
                <div style="border-top: 1px dashed var(--border); padding-top: 12px; margin-top: auto;" id="jadwalArea">
                    <!-- Label Diperkecil -->
                    <p style="font-size: 0.65rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;"><i class="fas fa-calendar-check text-primary"></i> Jadwal Selanjutnya</p>
                    
                    <div id="jadwalContent">
                        <span style="font-size:0.8rem; color:var(--text-muted);"><i class="fas fa-spinner fa-spin"></i> Memindai jadwal...</span>
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
    // 1. MESIN WAKTU (JAM & TANGGAL)
    const elDate = document.getElementById('currentDateDisplay');
    const elClock = document.getElementById('realtimeClock');
    
    function updateClock() {
        const now = new Date();
        elDate.textContent = now.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' });
        // Format jam HH:MM:SS
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

    // 3. TARIK DATA DARI SUPABASE
    async function hydrateDashboard() {
        try {
            // Fix Zona Waktu (Gunakan Tgl Lokal)
            const d = new Date();
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const todayStr = `${year}-${month}-${day}`;
            
            const [santriList, kehadiranList, tahsinList, hafalanList, kelasList] = await Promise.all([
                api.get('dapodik_santri', 'select=id,nama_kelas,nama_santri'),
                api.get('kehadiran', `select=santri_id,status_hadir&tgl=eq.${todayStr}`),
                api.get('tahsin', `select=santri_id,program,status&tgl=eq.${todayStr}`),
                api.get('hafalan', `select=santri_id,ayat_baru&tgl=eq.${todayStr}`),
                api.get('kelas', 'select=*')
            ]);

            // --- A. LOGIKA JADWAL PINTAR (Format Vertikal 3 Baris) ---
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

                // Cetak UI Format Vertikal Anti-Terpotong
                if (kelasAktif) {
                    jadwalContent.innerHTML = `
                        <div style="display: flex; flex-direction: column; gap: 6px;">
                            <div style="align-self: flex-start;">
                                <span style="background: #FEE2E2; color: #991B1B; padding: 4px 8px; border-radius: 6px; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
                                    <i class="fas fa-circle" style="font-size:0.4rem; animation: pulse 2s infinite;"></i> SEDANG BERJALAN
                                </span>
                            </div>
                            <div style="font-size: 1.05rem; font-weight: 800; color: var(--text-main); line-height: 1.3; word-wrap: break-word; white-space: normal;">
                                ${kelasAktif.nama_kelas}
                            </div>
                            <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted);">
                                <i class="far fa-clock" style="color: var(--primary);"></i> ${kelasAktif.jam_kelas}
                            </div>
                        </div>
                    `;
                } else if (kelasMendatang) {
                    jadwalContent.innerHTML = `
                        <div style="display: flex; flex-direction: column; gap: 6px;">
                            <div style="align-self: flex-start;">
                                <span style="background: #D1FAE5; color: #065F46; padding: 4px 8px; border-radius: 6px; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
                                    <i class="far fa-hourglass"></i> MENUNGGU
                                </span>
                            </div>
                            <div style="font-size: 1.05rem; font-weight: 800; color: var(--text-main); line-height: 1.3; word-wrap: break-word; white-space: normal;">
                                ${kelasMendatang.nama_kelas}
                            </div>
                            <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted);">
                                <i class="far fa-clock" style="color: var(--primary);"></i> ${kelasMendatang.jam_kelas}
                            </div>
                        </div>
                    `;
                } else {
                    jadwalContent.innerHTML = `<span style="font-size:0.85rem; color:var(--text-muted); font-weight:600;"><i class="fas fa-check-circle" style="color:var(--clr-toska);"></i> Semua kelas selesai.</span>`;
                }
            }

            // --- B. LOGIKA GRAFIK REAL-TIME ---
            const totalSantri = santriList.length;
            document.getElementById('chartTotalText').textContent = totalSantri || 0;

            let hadir = 0, izinSakit = 0, alfa = 0, ulang = 0;
            
            // Hitung Kehadiran (Aman dari null)
            if(kehadiranList && kehadiranList.length > 0) {
                kehadiranList.forEach(k => {
                    if(k.status_hadir === 'Hadir') hadir++;
                    else if(k.status_hadir === 'Izin' || k.status_hadir === 'Sakit') izinSakit++;
                    else if(k.status_hadir === 'Alpa') alfa++;
                });
            }

            // Hitung Santri Ulang (Aman dari null)
            if(tahsinList) tahsinList.forEach(t => { if(t.status === 'Ulang') ulang++; });
            if(hafalanList) hafalanList.forEach(h => { if(h.ayat_baru && h.ayat_baru.includes('Ulang')) ulang++; });

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

            // --- C. LOGIKA TABEL RIWAYAT TERKINI ---
            let logHTML = '';
            const allLogs = [...(tahsinList || []), ...(hafalanList || [])].reverse().slice(0, 5); 
            
            if(allLogs.length === 0) {
                logHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding:30px;">Belum ada aktivitas hari ini.</td></tr>';
            } else {
                allLogs.forEach(log => {
                    const s = santriList.find(x => x.id === log.santri_id);
                    const nama = s ? s.nama_santri : 'Tanpa Nama';
                    const kelas = s ? s.nama_kelas : '-';
                    
                    let progStr = log.program ? log.program : 'Hafalan';
                    let statStr = log.program ? log.status : (log.ayat_baru && log.ayat_baru.includes('Lanjut') ? 'Lanjut' : 'Ulang');
                    
                    let bgProg = log.program ? 'rgba(243, 155, 150, 0.15)' : 'rgba(117, 181, 176, 0.15)';
                    let colProg = log.program ? 'var(--clr-koral)' : 'var(--primary)';
                    let colStat = statStr === 'Ulang' ? 'var(--clr-koral)' : 'var(--text-muted)';
                    if(statStr === 'Lanjut') colStat = 'var(--primary)';

                    logHTML += `
                        <tr style="border-bottom: 1px solid var(--border);">
                            <td style="font-weight: 600;">${nama}</td>
                            <td><i class="fas fa-tag" style="color:var(--text-muted); font-size:0.7rem;"></i> ${kelas}</td>
                            <td><span style="background:${bgProg}; color:${colProg}; padding:4px 8px; border-radius:6px; font-size:0.7rem; font-weight:700;">${progStr}</span></td>
                            <td style="text-align:center;"><span style="color:${colStat}; font-weight:700;">${statStr}</span></td>
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
