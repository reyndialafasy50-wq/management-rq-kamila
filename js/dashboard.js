/**
 * ==================================================
 * MODUL DASHBOARD
 * File: js/dashboard.js
 * ==================================================
 */

// 1. Fungsi untuk merender HTML ke dalam wilayah MAIN
export function renderDashboard() {
    return `
        <div class="greeting-area">
            <h3 id="welcomeGreeting">Ahlan wa Sahlan!</h3>
            <p>"Setiap huruf Al-Qur'an yang diajarkan adalah pahala jariyah yang mengalir tanpa henti."</p>
        </div>

        <div class="info-grid">
            <div class="info-card">
                <p class="info-label">Tanggal & Waktu</p>
                <p class="info-value" id="currentDateDisplay">Memuat...</p>
                <p class="info-sub" id="realtimeClock">00:00:00</p>
            </div>
            
            <div class="info-card target-card">
                <p class="info-label">Target KBM</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <p class="info-value highlight" id="academicTargetDisplay">24 Hari</p>
                    <i class="fas fa-bullseye" style="font-size: 1.2rem; opacity: 0.5;"></i>
                </div>
            </div>
        </div>

        <div class="chart-card">
            <h4 style="width: 100%; text-align: left; margin-bottom: 20px; font-size: 1rem; color: var(--text-main);">
                <i class="fas fa-chart-pie" style="color: var(--primary);"></i> Rekapitulasi Kehadiran
            </h4>
            
            <div style="width: 220px; height: 220px; position: relative; margin-bottom: 25px;">
                <canvas id="concentricChart"></canvas>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                    <p style="margin: 0; font-size: 0.65rem; font-weight: 700; color: var(--text-muted); letter-spacing: 2px;">TOTAL</p>
                    <h3 style="margin: 0; font-size: 2.2rem; color: var(--text-main); font-weight: 700;">110</h3>
                </div>
            </div>

            <!-- Legenda Statistik -->
            <div style="width: 100%; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; text-align: center;">
                <div>
                    <div style="width:12px; height:12px; border-radius:50%; background:var(--clr-toska); margin:0 auto 5px;"></div>
                    <span style="font-size:0.7rem; font-weight:600; color:var(--text-muted);">Hadir</span>
                    <div style="font-size:1.1rem; font-weight:700;">85</div>
                </div>
                <div>
                    <div style="width:12px; height:12px; border-radius:50%; background:var(--clr-biru); margin:0 auto 5px;"></div>
                    <span style="font-size:0.7rem; font-weight:600; color:var(--text-muted);">Izin/Skt</span>
                    <div style="font-size:1.1rem; font-weight:700;">15</div>
                </div>
                <div>
                    <div style="width:12px; height:12px; border-radius:50%; background:var(--clr-koral); margin:0 auto 5px;"></div>
                    <span style="font-size:0.7rem; font-weight:600; color:var(--text-muted);">Alfa</span>
                    <div style="font-size:1.1rem; font-weight:700;">2</div>
                </div>
                <div>
                    <div style="width:12px; height:12px; border-radius:50%; background:var(--clr-dongker); margin:0 auto 5px;"></div>
                    <span style="font-size:0.7rem; font-weight:600; color:var(--text-muted);">Ulang</span>
                    <div style="font-size:1.1rem; font-weight:700;">8</div>
                </div>
            </div>
        </div>
    `;
}

// 2. Fungsi untuk menginisialisasi Chart.js setelah HTML dimuat
export function initDashboard() {
    const canvas = document.getElementById('concentricChart');
    if (!canvas) return; // Mencegah error jika canvas belum ada
    
    const ctx = canvas.getContext('2d');
    
    // Deteksi tema aktif untuk warna jalur (track) cincin kosong
    const isDark = document.body.hasAttribute('data-theme');
    const trackColor = isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0';

    // Ambil nilai dari CSS variabel untuk Chart
    const style = getComputedStyle(document.body);
    const cToska = style.getPropertyValue('--clr-toska').trim() || '#75B5B0';
    const cBiru = style.getPropertyValue('--clr-biru').trim() || '#8999B8';
    const cKoral = style.getPropertyValue('--clr-koral').trim() || '#F39B96';
    const cDongker = style.getPropertyValue('--clr-dongker').trim() || '#4F567D';

    // Render 4 dataset konsentris dengan Dummy Data (Sementara)
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Hadir', 'Izin', 'Alfa', 'Ulang'],
            datasets: [
                { data: [85, 25], backgroundColor: [cToska, trackColor], borderWidth: 0, borderRadius: 20 },
                { data: [15, 95], backgroundColor: [cBiru, trackColor], borderWidth: 0, borderRadius: 20 },
                { data: [2, 108], backgroundColor: [cKoral, trackColor], borderWidth: 0, borderRadius: 20 },
                { data: [8, 102], backgroundColor: [cDongker, trackColor], borderWidth: 0, borderRadius: 20 }
            ]
        },
        options: {
            responsive: true, 
            maintainAspectRatio: false, 
            cutout: '65%',
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            animation: { animateScale: true, animateRotate: true }
        }
    });
                    }
