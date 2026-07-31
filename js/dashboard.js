/**
 * ==================================================
 * MODUL DASHBOARD (ROLE-AWARE & CHART.JS)
 * File: js/dashboard.js
 * ==================================================
 */

import { api } from './api.js';

export const renderDashboard = () => {
    return `
    <style>
        .dash-wrapper { font-family: 'Inter', 'Poppins', sans-serif; animation: fadeIn 0.5s ease-out; color: var(--text-main); }
        
        /* Welcome Banner */
        .welcome-banner { 
            background: linear-gradient(135deg, #4F567D 0%, #313651 100%); 
            border-radius: 16px; 
            padding: 30px; 
            color: white; 
            margin-bottom: 24px; 
            display: flex; 
            justify-content: space-between; 
            align-items: center;
            box-shadow: 0 10px 20px rgba(79, 86, 125, 0.2);
            position: relative;
            overflow: hidden;
        }
        .welcome-banner::after {
            content: '\\f5db'; /* Quran Icon FontAwesome */
            font-family: 'Font Awesome 5 Free';
            font-weight: 900;
            position: absolute;
            right: -20px;
            bottom: -30px;
            font-size: 10rem;
            opacity: 0.1;
            transform: rotate(-15deg);
        }
        .welcome-text h2 { margin: 0 0 8px 0; font-size: 1.8rem; font-weight: 700; }
        .welcome-text p { margin: 0; opacity: 0.9; font-size: 0.95rem; }
        .welcome-role-badge { background: #F39B96; color: #222; padding: 5px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; margin-top: 10px; display: inline-block; }

        /* Stats Cards */
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 24px; }
        .stat-card { 
            background: var(--surface); 
            border: 1px solid var(--border); 
            border-radius: 16px; 
            padding: 20px; 
            display: flex; 
            align-items: center; 
            gap: 15px; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.02);
            transition: 0.3s;
        }
        .stat-card:hover { transform: translateY(-5px); box-shadow: 0 8px 15px rgba(0,0,0,0.05); }
        .stat-icon { width: 50px; height: 50px; border-radius: 12px; display: flex; justify-content: center; align-items: center; font-size: 1.5rem; }
        .stat-info h4 { margin: 0; font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;}
        .stat-info h3 { margin: 5px 0 0 0; font-size: 1.8rem; font-weight: 700; color: #4F567D; }
        
        .icon-blue { background: #e0f2fe; color: #0284c7; }
        .icon-green { background: #dcfce7; color: #16a34a; }
        .icon-red { background: #fee2e2; color: #dc2626; }
        .icon-yellow { background: #fef9c3; color: #ca8a04; }

        /* Bottom Grid for Chart & List */
        .bottom-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }
        .dash-panel { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
        .panel-title { margin: 0 0 20px 0; font-size: 1.1rem; color: #4F567D; font-weight: 700; display: flex; align-items: center; gap: 8px; }
        
        .list-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px dashed var(--border); }
        .list-item:last-child { border-bottom: none; }
        .item-name { font-weight: 600; font-size: 0.9rem; color: var(--text-main); }
        .item-desc { font-size: 0.75rem; color: var(--text-muted); }
        .item-badge { padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; }
        .badge-alpa { background: #fee2e2; color: #dc2626; }

        /* Chart Container */
        .chart-container { position: relative; height: 250px; width: 100%; display: flex; justify-content: center; }

        @media (max-width: 900px) {
            .bottom-grid { grid-template-columns: 1fr; }
        }
    </style>

    <div class="dash-wrapper">
        <!-- Banner -->
        <div class="welcome-banner">
            <div class="welcome-text">
                <h2 id="welName">Memuat...</h2>
                <p id="welDesc">Selamat datang di Sistem Informasi Akademik Diniyah RQ Kamila.</p>
                <div class="welcome-role-badge" id="welRole">Role</div>
            </div>
        </div>

        <!-- Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon icon-blue"><i class="fas fa-users"></i></div>
                <div class="stat-info">
                    <h4 id="lblTotalSantri">Total Santri</h4>
                    <h3 id="valTotalSantri">0</h3>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon icon-green"><i class="fas fa-check-circle"></i></div>
                <div class="stat-info">
                    <h4>Hadir Hari Ini</h4>
                    <h3 id="valHadir">0</h3>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon icon-red"><i class="fas fa-times-circle"></i></div>
                <div class="stat-info">
                    <h4>Alpa Hari Ini</h4>
                    <h3 id="valAlpa">0</h3>
                </div>
            </div>
            <div class="stat-card" id="cardKeempat">
                <div class="stat-icon icon-yellow"><i class="fas fa-door-open"></i></div>
                <div class="stat-info">
                    <h4>Total Kelas</h4>
                    <h3 id="valKelas">0</h3>
                </div>
            </div>
        </div>

        <!-- Bottom Section -->
        <div class="bottom-grid">
            <!-- Chart Panel -->
            <div class="dash-panel">
                <h3 class="panel-title"><i class="fas fa-chart-pie"></i> Statistik Kehadiran (Bulan Ini)</h3>
                <div class="chart-container">
                    <canvas id="kehadiranChart"></canvas>
                </div>
            </div>

            <!-- List Panel -->
            <div class="dash-panel">
                <h3 class="panel-title"><i class="fas fa-exclamation-triangle" style="color: #dc2626;"></i> Evaluasi Alpa (Hari Ini)</h3>
                <div id="listAlpaHariIni">
                    <div style="text-align:center; padding: 20px; color: var(--text-muted);">
                        <i class="fas fa-spinner fa-spin"></i> Memuat data...
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
};

export const initDashboard = async () => {
    // 1. AMBIL IDENTITAS DARI STORAGE
    const userRole = localStorage.getItem('user_role') || 'Guru';
    const userName = localStorage.getItem('user_name') || 'Ustadz/Ustadzah';
    const kelasPegangan = localStorage.getItem('kelas_pegangan');

    // 2. SET BANNER SESUAI ROLE
    document.getElementById('welName').textContent = `Ahlan wa Sahlan, ${userName}!`;
    document.getElementById('welRole').textContent = userRole === 'Admin' ? 'Administrator Pusat' : `Wali Kelas: ${kelasPegangan || 'Belum Ada Kelas'}`;
    
    if (userRole === 'Admin') {
        document.getElementById('welDesc').textContent = 'Pantau seluruh aktivitas akademik dan kehadiran santri RQ Kamila secara real-time.';
    } else {
        document.getElementById('welDesc').textContent = `Fokus pantau dan kelola evaluasi harian santri kelas ${kelasPegangan || ''} dengan mudah.`;
        // Jika guru, ganti Card ke-4 menjadi info "Izin/Sakit"
        document.getElementById('cardKeempat').innerHTML = `
            <div class="stat-icon icon-yellow"><i class="fas fa-procedures"></i></div>
            <div class="stat-info">
                <h4>Izin/Sakit Hari Ini</h4>
                <h3 id="valIzinSakit">0</h3>
            </div>
        `;
    }

    // 3. TARIK DATA DARI SUPABASE
    try {
        const tglHariIni = new Date().toISOString().split('T')[0];
        const d = new Date();
        const blnIni = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; // Format YYYY-MM

        // Siapkan Query Dinamis
        let querySantri = 'select=id,nama_kelas';
        let queryAbsenBulanIni = `select=status_hadir&tanggal=gte.${blnIni}-01&tanggal=lte.${blnIni}-31`;
        let queryAbsenHariIni = `select=nama_santri,nama_kelas,status_hadir&tanggal=eq.${tglHariIni}`;

        if (userRole !== 'Admin' && kelasPegangan) {
            querySantri += `&nama_kelas=eq.${encodeURIComponent(kelasPegangan)}`;
            queryAbsenBulanIni += `&nama_kelas=eq.${encodeURIComponent(kelasPegangan)}`;
            queryAbsenHariIni += `&nama_kelas=eq.${encodeURIComponent(kelasPegangan)}`;
            document.getElementById('lblTotalSantri').textContent = "Santri Kelas Anda";
        }

        // Jalankan Query secara paralel (bersamaan) agar loading lebih cepat
        const [dataSantri, dataAbsenBulan, dataAbsenHari, dataKelas] = await Promise.all([
            api.get('dapodik_santri', querySantri),
            api.get('input_harian', queryAbsenBulanIni),
            api.get('input_harian', queryAbsenHariIni),
            userRole === 'Admin' ? api.get('kelas', 'select=id') : Promise.resolve([])
        ]);

        // 4. HITUNG STATISTIK KARTU
        document.getElementById('valTotalSantri').textContent = dataSantri ? dataSantri.length : 0;
        if (userRole === 'Admin') document.getElementById('valKelas').textContent = dataKelas ? dataKelas.length : 0;

        let hHariIni = 0, aHariIni = 0, isHariIni = 0;
        let listAlpaHTML = '';

        if (dataAbsenHari && dataAbsenHari.length > 0) {
            dataAbsenHari.forEach(rekord => {
                if (rekord.status_hadir === 'Hadir') hHariIni++;
                else if (rekord.status_hadir === 'Alpa') {
                    aHariIni++;
                    // Masukkan ke daftar list anak yang alpa hari ini
                    listAlpaHTML += `
                        <div class="list-item">
                            <div>
                                <div class="item-name">${rekord.nama_santri}</div>
                                <div class="item-desc">${userRole === 'Admin' ? 'Kelas: ' + rekord.nama_kelas : 'Tanpa Keterangan'}</div>
                            </div>
                            <div class="item-badge badge-alpa">Alpa</div>
                        </div>
                    `;
                }
                else isHariIni++; // Izin atau Sakit
            });
        }

        document.getElementById('valHadir').textContent = hHariIni;
        document.getElementById('valAlpa').textContent = aHariIni;
        if (userRole !== 'Admin') {
            document.getElementById('valIzinSakit').textContent = isHariIni;
        }

        // Tampilkan List Alpa
        if (listAlpaHTML === '') {
            document.getElementById('listAlpaHariIni').innerHTML = `
                <div style="text-align:center; padding: 20px;">
                    <div style="width: 50px; height: 50px; background: #dcfce7; border-radius: 50%; display: flex; align-items:center; justify-content:center; margin: 0 auto 10px auto;">
                        <i class="fas fa-check text-success" style="font-size: 1.5rem;"></i>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin:0;">Alhamdulillah, tidak ada santri Alpa hari ini.</p>
                </div>
            `;
        } else {
            document.getElementById('listAlpaHariIni').innerHTML = listAlpaHTML;
        }

        // 5. RENDER CHART.JS (Grafik Donut)
        let totalH = 0, totalI = 0, totalS = 0, totalA = 0;
        if (dataAbsenBulan) {
            dataAbsenBulan.forEach(r => {
                if(r.status_hadir === 'Hadir') totalH++;
                else if(r.status_hadir === 'Izin') totalI++;
                else if(r.status_hadir === 'Sakit') totalS++;
                else if(r.status_hadir === 'Alpa') totalA++;
            });
        }

        const ctx = document.getElementById('kehadiranChart');
        if (ctx) {
            // Hapus chart lama jika ada (mencegah bug tumpuk saat pindah menu)
            if (window.myDonutChart) window.myDonutChart.destroy();
            
            // Jika belum ada data sama sekali bulan ini
            if (totalH === 0 && totalI === 0 && totalS === 0 && totalA === 0) {
                ctx.parentElement.innerHTML = `<div style="display:flex; height:100%; align-items:center; justify-content:center; color:var(--text-muted); font-size:0.9rem;">Belum ada data absen bulan ini.</div>`;
            } else {
                window.myDonutChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Hadir', 'Izin', 'Sakit', 'Alpa'],
                        datasets: [{
                            data: [totalH, totalI, totalS, totalA],
                            backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'],
                            borderWidth: 0,
                            hoverOffset: 4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '70%',
                        plugins: {
                            legend: { position: 'right', labels: { usePointStyle: true, boxWidth: 8, font: { family: 'Poppins' } } }
                        }
                    }
                });
            }
        }

    } catch (err) {
        console.error("Gagal load dashboard:", err);
    }
};
