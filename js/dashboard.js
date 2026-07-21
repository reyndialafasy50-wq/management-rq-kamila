/**
 * ==================================================
 * BAGIAN 7: MODUL DASHBOARD (Real-time & Smart UI V2)
 * File: js/dashboard.js
 * ==================================================
 */
import { api } from './api.js';

let myChart;

// 1. Ekspor HTML Dashboard (UI Disempurnakan)
export function renderDashboard() {
    return `
        <!-- Sapaan -->
        <div class="greeting-area">
            <h3 id="welcomeGreeting">Ahlan wa Sahlan, Ustadz!</h3>
            <p>"Setiap huruf Al-Qur'an yang diajarkan adalah pahala jariyah yang mengalir tanpa henti."</p>
        </div>

        <!-- Info Card Grid -->
        <div class="info-grid">
            
            <!-- KARTU WAKTU & JADWAL (Desain Baru: Gradasi Mewah) -->
            <div class="info-card" style="background: linear-gradient(135deg, #4F567D 0%, #2A2F4C 100%); color: #ffffff; border: none; box-shadow: 0 8px 15px rgba(42, 47, 76, 0.2);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <p style="font-size: 0.7rem; font-weight: 700; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px;">Tanggal Hari Ini</p>
                        <p id="currentDateDisplay" style="font-size: 0.9rem; font-weight: 600; color: #E8E6F0;">Memuat...</p>
                    </div>
                    <i class="far fa-calendar-alt" style="font-size: 1.5rem; opacity: 0.3;"></i>
                </div>
                
                <p id="realtimeClock" style="font-size: 2.2rem; font-weight: 800; color: #ffffff; margin: 10px 0 15px 0; letter-spacing: 2px;">00:00:00</p>
                
                <!-- Area Jadwal Terdekat -->
                <div style="border-top: 1px solid rgba(255,255,255,0.15); padding-top: 12px;" id="jadwalArea">
                    <p style="font-size: 0.65rem; font-weight: 700; color: rgba(255,255,255,0.5); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Jadwal Terdekat</p>
                    <div id="jadwalContent">
                        <span style="font-size:0.85rem; color: rgba(255,255,255,0.8);"><i class="fas fa-spinner fa-spin"></i> Memindai jadwal...</span>
                    </div>
                </div>
            </div>
            
            <!-- KARTU TARGET KBM -->
            <div class="info-card target-card">
                <p class="info-label">Target KBM</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <p class="info-value highlight" id="academicTargetDisplay">24 Hari</p>
                    <i class="fas fa-bullseye" style="font-size: 1.2rem; opacity: 0.5;"></i>
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
            <div id="namesTooltip" style="display:none; position:absolute; z-index:10; background:var(--surface); border:1px solid var(--border); padding:10px; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                <div class="tooltip-header" style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid var(--border); padding-bottom:5px;">
                    <span class="tooltip-title" style="font-weight:bold; font-size:0.85rem;"><div class="legend-dot" id="ttDot" style="display:inline-block; width:10px; height:10px; border-radius:50%; margin-right:5px;"></div> <span id="ttLabel">Hadir</span></span>
                    <button class="tooltip-close" id="btnCloseTooltip" style="background:none; border:none; cursor:pointer; color:var(--text-main);"><i class="fas fa-times"></i></button>
                </div>
                <div class="tooltip-list" id="ttNames" style="font-size:0.8rem; line-height:1.4;">Memuat data...</div>
            </div>

            <!-- Canvas Chart -->
            <div class="chart-container-box" style="width: 220px; height: 220px; position: relative; margin: 0 auto 25px;">
                <canvas id="concentricChart"></canvas>
                <div class="chart-center-text" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                    <p style="margin: 0; font-size: 0.65rem; font-weight: 700; color: var(--text-muted); letter-spacing: 2px;">TOTAL</p>
                    <h3 id="valTotalSantri" style="margin: 0; font-size: 2.2rem; color: var(--text-main); font-weight: 700; line-height: 1.1;">0</h3>
                </div>
            </div>

            <!-- Legenda Statistik -->
            <div style="width: 100%; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; text-align: center;">
                <div class="legend-item" data-type="Hadir" data-color="var(--clr-toska)" style="cursor:pointer;">
                    <div style="width:12px; height:12px; border-radius:50%; background:var(--clr-toska); margin:0 auto 5px;"></div>
                    <span style="font-size:0.7rem; font-weight:600; color:var(--text-muted);">Hadir</span>
                    <div id="valHadir" style="font-size:1.1rem; font-weight:700; color:var(--text-main);">0</div>
                </div>
                <div class="legend-item" data-type="Izin/Skt" data-color="var(--clr-biru)" style="cursor:pointer;">
                    <div style="width:12px; height:12px; border-radius:50%; background:var(--clr-biru); margin:0 auto 5px;"></div>
                    <span style="font-size:0.7rem; font-weight:600; color:var(--text-muted);">Izin/Skt</span>
                    <div id="valIzin" style="font-size:1.1rem; font-weight:700; color:var(--text-main);">0</div>
                </div>
                <div class="legend-item" data-type="Alfa" data-color="var(--clr-koral)" style="cursor:pointer;">
                    <div style="width:12px; height:12px; border-radius:50%; background:var(--clr-koral); margin:0 auto 5px;"></div>
                    <span style="font-size:0.7rem; font-weight:600; color:var(--text-muted);">Alfa</span>
                    <div id="valAlfa" style="font-size:1.1rem; font-weight:700; color:var(--text-main);">0</div>
                </div>
                <div class="legend-item" data-type="Ulang" data-color="var(--clr-dongker)" style="cursor:pointer;">
                    <div style="width:12px; height:12px; border-radius:50%; background:var(--clr-dongker); margin:0 auto 5px;"></div>
                    <span style="font-size:0.7rem; font-weight:600; color:var(--text-muted);">Ulang</span>
                    <div id="valUlang" style="font-size:1.1rem; font-weight:700; color:var(--text-main);">0</div>
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
                            <th>Program / Kelas</th>
                            <th style="text-align: center;">Status</th>
                        </tr>
                    </thead>
                    <tbody id="tbodyLogHariIni">
                        <tr><td colspan="3" style="text-align:center; color:var(--text-muted);"><i class="fas fa-spinner fa-spin"></i> Menarik log aktivitas...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// 2. Logika Utama, Mesin Database & Interaksi
export async function initDashboard() {
    
    // --- 2.1 MESIN JAM & TANGGAL REALTIME ---
    const elDate = document.getElementById('currentDateDisplay');
    const elTime = document.getElementById('realtimeClock');
    
    function tickClock() {
        const now = new Date();
        const optionsDate = { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' };
        if(elDate) elDate.textContent = now.toLocaleDateString('id-ID', optionsDate);
        if(elTime) elTime.textContent = now.toLocaleTimeString('id-ID', { hour12: false });
        return now;
    }
    setInterval(tickClock, 1000);
    const timeNow = tickClock();

    // FUNGSI RAHASIA: Mendapatkan Tanggal Lokal (YYYY-MM-DD) yang Akurat untuk Database
    function getLocalDateString() {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // --- 2.2 LOGIKA JADWAL PINTAR (Di dalam kotak waktu baru) ---
    async function loadJadwalTerdekat(currentTime) {
        const jadwalContent = document.getElementById('jadwalContent');
        if(!jadwalContent) return;

        try {
            const kelasList = await api.get('kelas', 'select=*');
            if(kelasList.length === 0) {
                jadwalContent.innerHTML = `<span style="font-size:0.8rem; color:rgba(255,255,255,0.6);">Belum ada jadwal.</span>`;
                return;
            }

            const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
            let kelasAktif = null;
            let kelasMendatang = null;

            kelasList.forEach(k => {
                if (k.jam_kelas && k.jam_kelas.includes('-')) {
                    const [startStr, endStr] = k.jam_kelas.split('-');
                    const [hS, mS] = startStr.trim().split(':').map(Number);
                    const [hE, mE] = endStr.trim().split(':').map(Number);
                    
                    const startMins = (hS * 60) + (mS || 0);
                    const endMins = (hE * 60) + (mE || 0);

                    if (currentMinutes >= startMins && currentMinutes <= endMins) {
                        kelasAktif = k;
                    } else if (currentMinutes < startMins) {
                        if (!kelasMendatang || startMins < kelasMendatang.startMins) {
                            kelasMendatang = { ...k, startMins };
                        }
                    }
                }
            });

            // Teks disesuaikan untuk latar gelap
            if (kelasAktif) {
                jadwalContent.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <div style="font-size:1rem; font-weight:700; color:#ffffff;">${kelasAktif.nama_kelas}</div>
                            <div style="font-size:0.75rem; color:#F39B96; font-weight:600; margin-top:2px;"><i class="fas fa-circle" style="font-size:0.5rem; animation: pulse 2s infinite;"></i> SEDANG BERJALAN</div>
                        </div>
                        <div style="font-size:1.3rem; font-weight:800; color:#ffffff;">${kelasAktif.jam_kelas.split('-')[0].trim()}</div>
                    </div>
                `;
            } else if (kelasMendatang) {
                jadwalContent.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <div style="font-size:1rem; font-weight:700; color:#ffffff;">${kelasMendatang.nama_kelas}</div>
                            <div style="font-size:0.75rem; color:#75B5B0; font-weight:600; margin-top:2px;"><i class="far fa-clock"></i> Menunggu...</div>
                        </div>
                        <div style="font-size:1.3rem; font-weight:800; color:#ffffff;">${kelasMendatang.jam_kelas.split('-')[0].trim()}</div>
                    </div>
                `;
            } else {
                jadwalContent.innerHTML = `<span style="font-size:0.85rem; color:rgba(255,255,255,0.8); font-weight:600;"><i class="fas fa-check-circle" style="color:#75B5B0;"></i> Semua jadwal selesai.</span>`;
            }
        } catch(e) {
            jadwalContent.innerHTML = `<span style="font-size:0.8rem; color:#F39B96;">Gagal memuat jadwal</span>`;
        }
    }

    // --- 2.3 TARIK DATA DATABASE REALTIME (Fix Zona Waktu) ---
    async function loadStatistikDanLog() {
        const todayStr = getLocalDateString(); // Gunakan format lokal YYYY-MM-DD

        try {
            // 1. Ambil Total Santri
            const santriList = await api.get('dapodik_santri', 'select=id,nama_santri,nama_kelas');
            const totalSantri = santriList.length || 0;
            document.getElementById('valTotalSantri').textContent = totalSantri;

            // 2. Hitung Absensi
            const absenHariIni = await api.get('kehadiran', `select=status_kehadiran&tanggal=eq.${todayStr}`);
            let hadir = 0, izin = 0, alfa = 0;
            if(absenHariIni && absenHariIni.length > 0) {
                absenHariIni.forEach(a => {
                    if(a.status_kehadiran === 'H') hadir++;
                    else if(a.status_kehadiran === 'I' || a.status_kehadiran === 'S') izin++;
                    else if(a.status_kehadiran === 'A') alfa++;
                });
            }

            // 3. Hitung Santri Ulang (Tahsin & Tahfidz)
            const [logTahsin, logTahfidz] = await Promise.all([
                api.get('tahsin', `select=id_santri,status,program&tanggal=eq.${todayStr}`),
                api.get('hafalan', `select=id_santri,status&tanggal=eq.${todayStr}`)
            ]);
            
            let ulang = 0;
            if (logTahsin) ulang += logTahsin.filter(t => t.status === 'Ulang').length;
            if (logTahfidz) ulang += logTahfidz.filter(t => t.status === 'Ulang').length;

            // 4. Update Teks di Legenda Bawah Chart
            document.getElementById('valHadir').textContent = hadir;
            document.getElementById('valIzin').textContent = izin;
            document.getElementById('valAlfa').textContent = alfa;
            document.getElementById('valUlang').textContent = ulang;

            // 5. UPDATE CHART.JS (Otomatis Bergerak)
            updateDoughnutChart(totalSantri, hadir, izin, alfa, ulang);

            // 6. RENDER LOG AKTIVITAS 
            renderLogTable(santriList, logTahsin || [], logTahfidz || []);

        } catch(e) {
            console.error("Dashboard error:", e);
        }
    }

    // --- 2.4 FUNGSI UPDATE DIAGRAM CINCIN (CHART.JS) ---
    function updateDoughnutChart(total, valH, valI, valA, valU) {
        const canvas = document.getElementById('concentricChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const isDark = document.body.hasAttribute('data-theme');
        const trackColor = isDark ? 'rgba(255,255,255,0.05)' : '#E8E6F0';
        const gapColor = isDark ? '#1E2130' : '#FFFFFF'; 

        const style = getComputedStyle(document.body);
        const cToska = style.getPropertyValue('--clr-toska').trim() || '#75B5B0';
        const cBiru = style.getPropertyValue('--clr-biru').trim() || '#8999B8';
        const cKoral = style.getPropertyValue('--clr-koral').trim() || '#F39B96';
        const cDongker = style.getPropertyValue('--clr-dongker').trim() || '#4F567D';

        // Pastikan total minimal 1 agar grafik tidak rusak jika data nol
        const maxTotal = total === 0 ? 1 : total; 

        const dataH = [valH, maxTotal - valH < 0 ? 0 : maxTotal - valH];
        const dataI = [valI, maxTotal - valI < 0 ? 0 : maxTotal - valI];
        const dataA = [valA, maxTotal - valA < 0 ? 0 : maxTotal - valA];
        const dataU = [valU, maxTotal - valU < 0 ? 0 : maxTotal - valU];

        if (myChart) myChart.destroy();
        myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Hadir', 'Izin', 'Alfa', 'Ulang'],
                datasets: [
                    { data: dataH.every(v=>v===0) ? [0,1] : dataH, backgroundColor: [cToska, trackColor], borderWidth: 4, borderColor: gapColor, borderRadius: 20 },
                    { data: dataI.every(v=>v===0) ? [0,1] : dataI, backgroundColor: [cBiru, trackColor], borderWidth: 4, borderColor: gapColor, borderRadius: 20 },
                    { data: dataA.every(v=>v===0) ? [0,1] : dataA, backgroundColor: [cKoral, trackColor], borderWidth: 4, borderColor: gapColor, borderRadius: 20 },
                    { data: dataU.every(v=>v===0) ? [0,1] : dataU, backgroundColor: [cDongker, trackColor], borderWidth: 4, borderColor: gapColor, borderRadius: 20 }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false, cutout: '65%',
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                animation: { animateScale: true, animateRotate: true }
            }
        });
    }

    // --- 2.5 RENDER TABEL LOG ---
    function renderLogTable(dataSantri, logTahsin, logTahfidz) {
        let logs = [];
        
        logTahsin.forEach(t => {
            const s = dataSantri.find(x => x.id === t.id_santri);
            logs.push({
                nama: s ? s.nama_santri : 'Santri tidak diketahui',
                kelas: s ? s.nama_kelas : '-',
                program: t.program || 'Tahsin',
                status: t.status,
                warnaBg: 'rgba(243, 155, 150, 0.15)', warnaTxt: 'var(--clr-koral)'
            });
        });

        logTahfidz.forEach(t => {
            const s = dataSantri.find(x => x.id === t.id_santri);
            logs.push({
                nama: s ? s.nama_santri : 'Santri tidak diketahui',
                kelas: s ? s.nama_kelas : '-',
                program: 'Hafalan',
                status: t.status,
                warnaBg: 'rgba(117, 181, 176, 0.15)', warnaTxt: 'var(--primary)'
            });
        });

        const tbody = document.getElementById('tbodyLogHariIni');
        if(logs.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:var(--text-muted); font-size:0.85rem; padding: 30px;">Belum ada aktivitas input data hari ini.</td></tr>`;
            return;
        }

        // Urutkan dan Tampilkan 15 aktivitas terbaru
        tbody.innerHTML = logs.reverse().slice(0, 15).map(log => `
            <tr>
                <td style="font-weight:600; font-size:0.95rem;">${log.nama}</td>
                <td>
                    <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:4px;"><i class="fas fa-tag"></i> ${log.kelas}</div>
                    <span style="background:${log.warnaBg}; color:${log.warnaTxt}; padding:4px 8px; border-radius:6px; font-size:0.75rem; font-weight:700;">${log.program}</span>
                </td>
                <td style="text-align:center; vertical-align: middle;">
                    <span style="color:${log.status === 'Ulang' ? 'var(--clr-koral)' : 'var(--primary)'}; font-weight:700; font-size:0.85rem;">
                        ${log.status === 'Ulang' ? '<i class="fas fa-undo"></i> Ulang' : '<i class="fas fa-check"></i> ' + log.status}
                    </span>
                </td>
            </tr>
        `).join('');
    }

    // --- 2.6 LOGIKA TOOLTIP & FILTER (UI Interaktif) ---
    const tooltip = document.getElementById('namesTooltip');
    const btnClose = document.getElementById('btnCloseTooltip');
    if(btnClose) btnClose.addEventListener('click', () => tooltip.style.display = 'none');

    document.querySelectorAll('.legend-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const type = item.getAttribute('data-type');
            const color = item.getAttribute('data-color');
            
            document.getElementById('ttLabel').textContent = `Daftar ${type}`;
            document.getElementById('ttDot').style.background = color;
            document.getElementById('ttNames').innerHTML = `
                <div style="padding:10px 0; color:var(--text-muted);">
                    Data <b>${type}</b> telah disinkronkan dari database Supabase hari ini.
                </div>
            `;
            
            tooltip.style.left = (e.pageX - 70) + 'px';
            tooltip.style.top = (e.pageY + 15) + 'px';
            tooltip.style.display = 'block';
        });
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    // Mulai penarikan data!
    loadJadwalTerdekat(timeNow);
    loadStatistikDanLog();
}
