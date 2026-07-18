/**
 * ==================================================
 * BAGIAN 7: MODUL DASHBOARD
 * File: js/dashboard.js
 * ==================================================
 */

let myChart;

// 1. Ekspor HTML Dashboard (Struktur UI Tengah)
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
            </div>
            <div class="info-card target-card">
                <p class="info-label">Target KBM</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <p class="info-value highlight">24 Hari</p>
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
            <div id="namesTooltip">
                <div class="tooltip-header">
                    <span class="tooltip-title"><div class="legend-dot" id="ttDot"></div> <span id="ttLabel">Hadir</span></span>
                    <button class="tooltip-close" id="btnCloseTooltip"><i class="fas fa-times"></i></button>
                </div>
                <div class="tooltip-list" id="ttNames">Memuat data...</div>
            </div>

            <!-- Canvas Chart -->
            <div class="chart-container-box">
                <canvas id="concentricChart"></canvas>
                <div class="chart-center-text">
                    <p style="margin: 0; font-size: 0.65rem; font-weight: 700; color: var(--text-muted); letter-spacing: 2px;">TOTAL</p>
                    <h3 style="margin: 0; font-size: 2.2rem; color: var(--text-main); font-weight: 700; line-height: 1.1;">110</h3>
                </div>
            </div>

            <!-- Legenda -->
            <div class="legend-grid">
                <div class="legend-item" data-type="Hadir" data-color="var(--clr-toska)">
                    <div class="legend-dot" style="background: var(--clr-toska);"></div>
                    <span class="legend-title">Hadir</span>
                    <span class="legend-val">85</span>
                </div>
                <div class="legend-item" data-type="Izin/Skt" data-color="var(--clr-biru)">
                    <div class="legend-dot" style="background: var(--clr-biru);"></div>
                    <span class="legend-title">Izin/Skt</span>
                    <span class="legend-val">15</span>
                </div>
                <div class="legend-item" data-type="Alfa" data-color="var(--clr-koral)">
                    <div class="legend-dot" style="background: var(--clr-koral);"></div>
                    <span class="legend-title">Alfa</span>
                    <span class="legend-val">2</span>
                </div>
                <div class="legend-item" data-type="Ulang" data-color="var(--clr-dongker)">
                    <div class="legend-dot" style="background: var(--clr-dongker);"></div>
                    <span class="legend-title">Ulang</span>
                    <span class="legend-val">8</span>
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
                    <tbody>
                        <tr>
                            <td>Ahmad Fulan</td>
                            <td><i class="fas fa-tag" style="color:var(--text-muted); font-size:0.7rem;"></i> Tahfidz A</td>
                            <td><span style="background:rgba(117, 181, 176, 0.15); color:var(--primary); padding:4px 8px; border-radius:6px; font-size:0.7rem; font-weight:700;">Hafalan</span></td>
                            <td style="text-align:center;"><span style="color:var(--primary); font-weight:700;">Hadir</span></td>
                        </tr>
                        <tr>
                            <td>Siti Aminah</td>
                            <td><i class="fas fa-tag" style="color:var(--text-muted); font-size:0.7rem;"></i> Tahsin B</td>
                            <td><span style="background:rgba(243, 155, 150, 0.15); color:var(--clr-koral); padding:4px 8px; border-radius:6px; font-size:0.7rem; font-weight:700;">Murajaah</span></td>
                            <td style="text-align:center;"><span style="color:var(--text-muted); font-weight:700;">Sakit</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// 2. Logika Chart & Interaksi
export function initDashboard() {
    const ctx = document.getElementById('concentricChart');
    if(!ctx) return;

    const isDark = document.body.hasAttribute('data-theme');
    const trackColor = isDark ? 'rgba(255,255,255,0.05)' : '#E8E6F0';
    // TRIK JARAK (GAP) ANTAR CINCIN: Gunakan borderColor persis dengan warna background Card!
    const gapColor = isDark ? '#1E2130' : '#FFFFFF'; 

    const chartConfig = {
        type: 'doughnut',
        data: {
            labels: ['Hadir', 'Izin', 'Alfa', 'Ulang'],
            datasets: [
                { data: [85, 25], backgroundColor: ['#75B5B0', trackColor], borderWidth: 4, borderColor: gapColor, borderRadius: 20 },
                { data: [15, 95], backgroundColor: ['#8999B8', trackColor], borderWidth: 4, borderColor: gapColor, borderRadius: 20 },
                { data: [2, 108], backgroundColor: ['#F39B96', trackColor], borderWidth: 4, borderColor: gapColor, borderRadius: 20 },
                { data: [8, 102], backgroundColor: ['#4F567D', trackColor], borderWidth: 4, borderColor: gapColor, borderRadius: 20 } 
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

    // --- Logika Tooltip ---
    const tooltip = document.getElementById('namesTooltip');
    document.getElementById('btnCloseTooltip').addEventListener('click', () => tooltip.style.display = 'none');

    document.querySelectorAll('.legend-item').forEach(item => {
        item.addEventListener('click', () => {
            const type = item.getAttribute('data-type');
            const color = item.getAttribute('data-color');
            
            document.getElementById('ttLabel').textContent = `Daftar ${type}`;
            document.getElementById('ttDot').style.background = color;
            
            // Dummy Data Sementara (Nanti dihubungkan ke Supabase di Bagian 8/9)
            document.getElementById('ttNames').innerHTML = `
                • Ahmad Fulan <br>
                • Siti Aminah <br>
                <span style="opacity:0.7; font-style:italic;">Ketuk sembarang tempat untuk menutup.</span>
            `;
            tooltip.style.display = 'flex';
        });
    });

    // --- Logika Filter Waktu ---
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            // Logika ganti data diagram akan ditaruh di sini nanti
        });
    });
}
