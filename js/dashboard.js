/**
 * ==================================================
 * BAGIAN 7: MODUL DASHBOARD (REAL-TIME & JADWAL PINTAR)
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
            <div class="info-card" style="display:flex; flex-direction:column;">
                <p class="info-label">Tanggal & Waktu</p>
                <p class="info-value" id="currentDateDisplay">Memuat...</p>
                <p class="info-sub" id="realtimeClock" style="margin-bottom: 15px;">00:00:00</p>
                
                <!-- FITUR BARU: JADWAL PINTAR (GABUNG OPSI A) -->
                <div style="border-top: 1px dashed var(--border); padding-top: 12px; margin-top: auto;">
                    <p style="font-size: 0.65rem; font-weight: 800; color: var(--text-muted); margin-bottom: 8px; letter-spacing: 1px;"><i class="fas fa-calendar-check text-primary"></i> JADWAL SELANJUTNYA</p>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-size: 0.9rem; font-weight: 800; color: var(--text-main); line-height: 1.2; text-transform: uppercase;" id="schClassName">Memuat...</div>
                            <div style="font-size: 0.75rem; font-weight: 700; color: var(--primary);" id="schTime">--:--</div>
                        </div>
                        <div id="schBadge" style="font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 8px; background: #E5E7EB; color: #4B5563;">-</div>
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

        <!-- Filter Waktu -->
        <div class="time-filters">
            <button class="filter-btn active" id="btn-hari">Hari Ini</button>
            <button class="filter-btn" id="btn-pekan">Pekan Ini</button>
            <button class="filter-btn" id="btn-bulan">Bulan Ini</button>
        </div>

        <!-- Chart Container Presisi Tengah -->
        <div class="dashboard-chart-card">
            
            <!-- Tooltip Tersembunyi -->
            <div id="namesTooltip" style="display:none;">
                <div class="tooltip-header">
                    <span class="tooltip-title"><div class="legend-dot" id="ttDot"></div> <span id="ttLabel">Daftar</span></span>
                    <button class="tooltip-close" id="btnCloseTooltip"><i class="fas fa-times"></i></button>
                </div>
                <div class="tooltip-list" id="ttNames">Memuat data...</div>
            </div>

            <!-- Canvas Chart -->
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
        elClock.textContent = now.toLocaleTimeString('id-ID', { hour12: false });
    }
    setInterval(updateClock, 1000);
    updateClock();

    // 2. SETUP CHART.JS MURNI (Desain Cincin Asli)
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

    // Inisialisasi awal dengan angka 0
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

    // Filter Interaktif (Hanya UI)
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

    // 3. TARIK DATA DARI SUPABASE & MENGHIDUPKAN DASHBOARD
    async function hydrateDashboard() {
        try {
            const today = new Date().toISOString().split('T')[0];
            
            // Lakukan 5 kueri secara bersamaan agar cepat!
            const [santriList, kehadiranList, tahsinList, hafalanList, kelasList] = await Promise.all([
                api.get('dapodik_santri', 'select=id,nama_kelas,nama_santri'),
                api.get('kehadiran', `select=santri_id,status_hadir&tgl=eq.${today}`),
                api.get('tahsin', `select=santri_id,program,status&tgl=eq.${today}`),
                api.get('hafalan', `select=santri_id,ayat_baru&tgl=eq.${today}`),
                api.get('kelas', 'select=*')
            ]);

            // --- A. LOGIKA JADWAL PINTAR ---
            if(kelasList.length > 0) {
                const currentMins = new Date().getHours() * 60 + new Date().getMinutes();
                let upClass = null, statText = 'Selesai', bgC = '#F3F4F6', textC = '#9CA3AF';

                for(let k of kelasList) {
                    if(k.jam_kelas && k.jam_kelas.includes('-')) {
                        const [sStr, eStr] = k.jam_kelas.split('-');
                        const [hS, mS] = sStr.trim().split(':').map(Number);
                        const [hE, mE] = eStr.trim().split(':').map(Number);
                        
                        const startM = (hS * 60) + (mS || 0);
                        const endM = (hE * 60) + (mE || 0);

                        if (currentMins < startM) {
                            upClass = k; statText = 'MENUNGGU'; bgC = '#D1FAE5'; textC = '#065F46'; break; 
                        } else if (currentMins >= startM && currentMins <= endM) {
                            upClass = k; statText = 'BERJALAN'; bgC = '#FEE2E2'; textC = '#991B1B'; break;
                        }
                    }
                }

                if(upClass) {
                    document.getElementById('schClassName').textContent = upClass.nama_kelas;
                    document.getElementById('schTime').textContent = upClass.jam_kelas;
                    const badge = document.getElementById('schBadge');
                    badge.textContent = statText; badge.style.background = bgC; badge.style.color = textC;
                } else {
                    document.getElementById('schClassName').textContent = "Bebas Tugas";
                }
            }

            // --- B. LOGIKA GRAFIK REAL-TIME ---
            const totalSantri = santriList.length;
            document.getElementById('chartTotalText').textContent = totalSantri || 0;

            let hadir = 0, izinSakit = 0, alfa = 0, ulang = 0;
            
            // Hitung Kehadiran
            kehadiranList.forEach(k => {
                if(k.status_hadir === 'Hadir') hadir++;
                else if(k.status_hadir === 'Izin' || k.status_hadir === 'Sakit') izinSakit++;
                else if(k.status_hadir === 'Alpa') alfa++;
            });

            // Hitung Santri Ulang (Tahsin & Tahfidz)
            tahsinList.forEach(t => { if(t.status === 'Ulang') ulang++; });
            hafalanList.forEach(h => { if(h.ayat_baru && h.ayat_baru.includes('Ulang')) ulang++; });

            // Suntik angka ke label text HTML
            document.getElementById('valHadir').textContent = hadir;
            document.getElementById('valIzinSkt').textContent = izinSakit;
            document.getElementById('valAlfa').textContent = alfa;
            document.getElementById('valUlang').textContent = ulang;

            // Suntik data ke Cincin Chart (Rasio 100%)
            const total = totalSantri === 0 ? 1 : totalSantri; // Cegah error dibagi 0
            myChart.data.datasets[0].data = [hadir, Math.max(0, total - hadir)];
            myChart.data.datasets[1].data = [izinSakit, Math.max(0, total - izinSakit)];
            myChart.data.datasets[2].data = [alfa, Math.max(0, total - alfa)];
            myChart.data.datasets[3].data = [ulang, Math.max(0, total - ulang)];
            myChart.update();

            // --- C. LOGIKA TABEL RIWAYAT TERKINI ---
            let logHTML = '';
            const allLogs = [...tahsinList, ...hafalanList].reverse().slice(0, 5); 
            
            if(allLogs.length === 0) {
                logHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding:20px;">Belum ada santri yang disetor hari ini.</td></tr>';
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
