/**
 * ==================================================
 * BAGIAN 7: MODUL DASHBOARD (Real-time & Smart UI)
 * File: js/dashboard.js
 * ==================================================
 */
import { api } from './api.js';

let myChart;

// 1. Ekspor HTML Dashboard (Struktur UI Asli Ustadz + Injeksi Jadwal)
export function renderDashboard() {
    return `
        <!-- Sapaan -->
        <div class="greeting-area">
            <h3 id="welcomeGreeting">Ahlan wa Sahlan, Ustadz!</h3>
            <p>"Setiap huruf Al-Qur'an yang diajarkan adalah pahala jariyah yang mengalir tanpa henti."</p>
        </div>

        <!-- Info Card -->
        <div class="info-grid">
            <div class="info-card">
                <p class="info-label">Tanggal & Waktu</p>
                <p class="info-value" id="currentDateDisplay">Memuat...</p>
                <p class="info-sub" id="realtimeClock">00:00:00</p>
                
                <!-- INJEKSI JADWAL TERDEKAT (Opsi A) -->
                <div style="border-top: 1px dashed var(--border); margin-top: 12px; padding-top: 12px;" id="jadwalArea">
                    <p style="font-size: 0.7rem; font-weight: 700; color: var(--text-muted); margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px;">Jadwal Terdekat</p>
                    <div id="jadwalContent">
                        <span style="font-size:0.8rem; color:var(--text-muted);"><i class="fas fa-spinner fa-spin"></i> Memindai jadwal...</span>
                    </div>
                </div>
            </div>
            
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
                    <button class="tooltip-close" id="btnCloseTooltip" style="background:none; border:none; cursor:pointer;"><i class="fas fa-times"></i></button>
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

    // --- 2.2 LOGIKA JADWAL PINTAR (Di dalam kotak waktu) ---
    async function loadJadwalTerdekat(currentTime) {
        const jadwalContent = document.getElementById('jadwalContent');
        if(!jadwalContent) return;

        try {
            const kelasList = await api.get('kelas', 'select=*');
            if(kelasList.length === 0) {
                jadwalContent.innerHTML = `<span style="font-size:0.8rem; color:var(--text-muted);">Belum ada kelas.</span>`;
                return;
            }

            const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
            let kelasAktif = null;
            let kelasMendatang = null;

            // Cari kelas yang sedang berjalan atau yang terdekat
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

            // Render ke Layar
            if (kelasAktif) {
                jadwalContent.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <div style="font-size:0.9rem; font-weight:700; color:var(--text-main);">${kelasAktif.nama_kelas}</div>
                            <div style="font-size:0.75rem; color:var(--clr-koral); font-weight:600;"><i class="fas fa-circle" style="font-size:0.5rem; animation: pulse 2s infinite;"></i> SEDANG BERJALAN</div>
                        </div>
                        <div style="font-size:1.1rem; font-weight:800; color:var(--text-main);">${kelasAktif.jam_kelas.split('-')[0].trim()}</div>
                    </div>
                `;
            } else if (kelasMendatang) {
                jadwalContent.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <div style="font-size:0.9rem; font-weight:700; color:var(--text-main);">${kelasMendatang.nama_kelas}</div>
                            <div style="font-size:0.75rem; color:var(--clr-toska); font-weight:600;"><i class="far fa-clock"></i> Menunggu</div>
                        </div>
                        <div style="font-size:1.1rem; font-weight:800; color:var(--text-main);">${kelasMendatang.jam_kelas.split('-')[0].trim()}</div>
                    </div>
                `;
            } else {
                jadwalContent.innerHTML = `<span style="font-size:0.85rem; color:var(--text-muted); font-weight:600;"><i class="fas fa-check-circle" style="color:var(--clr-toska);"></i> Semua jadwal hari ini selesai.</span>`;
            }
        } catch(e) {
            jadwalContent.innerHTML = `<span style="font-size:0.8rem; color:red;">Gagal memuat jadwal</span>`;
        }
    }

    // --- 2.3 TARIK DATA DATABASE REALTIME ---
    async function loadStatistikDanLog() {
        const today = new Date().toISOString().split('T')[0];

        try {
            // 1. Ambil Total Santri
            const santriList = await api.get('dapodik_santri', 'select=id,nama_santri,nama_kelas');
            const totalSantri = santriList.length;
            document.getElementById('valTotalSantri').textContent = totalSantri;

            // 2. Hitung Absensi
            const absenHariIni = await api.get('kehadiran', `select=status_kehadiran&tanggal=eq.${today}`);
            let hadir = 0, izin = 0, alfa = 0;
            absenHariIni.forEach(a => {
                if(a.status_kehadiran === 'H') hadir++;
                else if(a.status_kehadiran === 'I' || a.status_kehadiran === 'S') izin++;
                else if(a.status_kehadiran === 'A') alfa++;
            });

            // 3. Hitung Santri Ulang (Tahsin & Tahfidz)
            const [logTahsin, logTahfidz] = await Promise.all([
                api.get('tahsin', `select=id_santri,status,program&tanggal=eq.${today}`),
                api.get('hafalan', `select=id_santri,status&tanggal=eq.${today}`)
            ]);
            
            let ulang = logTahsin.filter(t => t.status === 'Ulang').length + logTahfidz.filter(t => t.status === 'Ulang').length;

            // 4. Update Teks di Legenda Bawah Chart
            document.getElementById('valHadir').textContent = hadir;
            document.getElementById('valIzin').textContent = izin;
            document.getElementById('valAlfa').textContent = alfa;
            document.getElementById('valUlang').textContent = ulang;

            // 5. UPDATE CHART.JS DENGAN DATA ASLI (Cincin Proporsional)
            updateDoughnutChart(totalSantri, hadir, izin, alfa, ulang);

            // 6. RENDER LOG AKTIVITAS (Tabel Bawah)
            renderLogTable(santriList, logTahsin, logTahfidz);

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

        // Logika array [NilaiAktual, SisaRuangKosong] agar cincin berputar proporsional
        const dataH = [valH, total - valH < 0 ? 0 : total - valH];
        const dataI = [valI, total - valI < 0 ? 0 : total - valI];
        const dataA = [valA, total - valA < 0 ? 0 : total - valA];
        const dataU = [valU, total - valU < 0 ? 0 : total - valU];

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
                nama: s ? s.nama_santri : 'Tanpa Nama',
                kelas: s ? s.nama_kelas : '-',
                program: t.program || 'Tahsin',
                status: t.status,
                warnaBg: 'rgba(243, 155, 150, 0.15)', warnaTxt: 'var(--clr-koral)'
            });
        });

        logTahfidz.forEach(t => {
            const s = dataSantri.find(x => x.id === t.id_santri);
            logs.push({
                nama: s ? s.nama_santri : 'Tanpa Nama',
                kelas: s ? s.nama_kelas : '-',
                program: 'Hafalan',
                status: t.status,
                warnaBg: 'rgba(117, 181, 176, 0.15)', warnaTxt: 'var(--primary)'
            });
        });

        const tbody = document.getElementById('tbodyLogHariIni');
        if(logs.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:var(--text-muted); font-size:0.85rem; padding: 20px;">Belum ada aktivitas terekam.</td></tr>`;
            return;
        }

        // Tampilkan 10 log terakhir (terbaru)
        tbody.innerHTML = logs.reverse().slice(0, 10).map(log => `
            <tr>
                <td style="font-weight:600; font-size:0.9rem;">${log.nama}</td>
                <td>
                    <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:3px;"><i class="fas fa-tag"></i> ${log.kelas}</div>
                    <span style="background:${log.warnaBg}; color:${log.warnaTxt}; padding:4px 8px; border-radius:6px; font-size:0.7rem; font-weight:700;">${log.program}</span>
                </td>
                <td style="text-align:center;">
                    <span style="color:${log.status === 'Ulang' ? 'var(--clr-koral)' : 'var(--primary)'}; font-weight:700; font-size:0.85rem;">
                        ${log.status === 'Ulang' ? '<i class="fas fa-undo"></i> Ulang' : '<i class="fas fa-check"></i> ' + log.status}
                    </span>
                </td>
            </tr>
        `).join('');
    }

    // --- 2.6 LOGIKA TOOLTIP (Interaksi Legenda) ---
    const tooltip = document.getElementById('namesTooltip');
    const btnClose = document.getElementById('btnCloseTooltip');
    if(btnClose) btnClose.addEventListener('click', () => tooltip.style.display = 'none');

    document.querySelectorAll('.legend-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const type = item.getAttribute('data-type');
            const color = item.getAttribute('data-color');
            
            document.getElementById('ttLabel').textContent = `Daftar ${type}`;
            document.getElementById('ttDot').style.background = color;
            
            // Catatan: Ini sementara memunculkan informasi umum. Fitur breakdown per nama bisa ditambahkan di pembaruan selanjutnya.
            document.getElementById('ttNames').innerHTML = `
                <div style="padding:10px 0; color:var(--text-muted);">
                    Total data <b>${type}</b> hari ini telah disinkronisasi dengan grafik.
                </div>
                <span style="opacity:0.7; font-style:italic; font-size:0.7rem;">Ketuk silang (x) untuk menutup.</span>
            `;
            
            // Posisikan tooltip dekat kursor mouse/jari
            tooltip.style.left = (e.pageX - 50) + 'px';
            tooltip.style.top = (e.pageY + 10) + 'px';
            tooltip.style.display = 'block';
        });
    });

    // --- 2.7 LOGIKA TAB FILTER WAKTU (UI) ---
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            // Catatan: Logika memfilter database untuk pekan/bulan bisa disambungkan ke query Supabase di sini.
        });
    });

    // Eksekusi Panggilan Awal
    loadJadwalTerdekat(timeNow);
    loadStatistikDanLog();
            }
