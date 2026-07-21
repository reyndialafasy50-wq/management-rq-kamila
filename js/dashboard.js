/**
 * ==================================================
 * BAGIAN 10: DASHBOARD & STATISTIK REAL-TIME
 * File: js/dashboard.js
 * ==================================================
 */
import { api } from './api.js';

export function renderDashboard() {
    return `
        <style>
            /* TYPOGRAPHY & HEADER */
            .dash-title { color: var(--text-main); font-weight: 800; font-size: 1.5rem; margin-bottom: 5px; }
            .dash-quote { color: var(--text-muted); font-size: 0.85rem; font-style: italic; margin-bottom: 20px; line-height: 1.4;}
            
            /* WIDGET GRID (Tanggal & Target) */
            .widget-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; }
            .widget-card { background: var(--surface); border: 1px solid var(--border); padding: 15px; border-radius: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: center;}
            .widget-card.grad-bg { background: linear-gradient(135deg, #4F567D, #5E9495); color: white; border: none;}
            .w-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; opacity: 0.8;}
            .w-value { font-size: 1.1rem; font-weight: 700; }
            .w-value-sub { font-size: 0.8rem; font-weight: 600; color: #10B981; margin-top: 2px;}
            
            /* JADWAL HARI INI (HORIZONTAL SCROLL) */
            .section-title { font-size: 1rem; font-weight: 700; color: var(--text-main); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;}
            .schedule-wrapper { display: flex; gap: 15px; overflow-x: auto; padding-bottom: 10px; margin-bottom: 25px; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
            .schedule-wrapper::-webkit-scrollbar { display: none; }
            
            .schedule-card { min-width: 200px; background: var(--surface); border: 2px solid #A7F3D0; border-radius: 16px; padding: 15px; display: flex; flex-direction: column; gap: 10px; flex-shrink: 0;}
            .badge-status { align-self: flex-start; padding: 4px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.5px; }
            .status-menunggu { background: #D1FAE5; color: #065F46; }
            .status-jalan { background: #FEE2E2; color: #991B1B; }
            .status-selesai { background: #F3F4F6; color: #4B5563; border-color: #E5E7EB !important; }
            .sch-time { font-size: 1.6rem; font-weight: 800; color: #6EE7B7; }
            .sch-class { font-size: 0.9rem; font-weight: 800; color: var(--text-main); text-transform: uppercase; line-height: 1.2;}
            .badge-santri { background: #BFDBFE; color: #1E3A8A; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; align-self: flex-start; display: flex; align-items: center; gap: 5px;}

            /* STATISTIK KEHADIRAN (RING MOCKUP) */
            .stats-container { background: var(--surface); border-radius: 16px; border: 1px solid var(--border); padding: 25px 20px; text-align: center; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);}
            .ring-mockup { width: 160px; height: 160px; border-radius: 50%; border: 12px solid #A7F3D0; margin: 0 auto 20px; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative;}
            .ring-mockup::before { content: ''; position: absolute; top: -12px; left: -12px; right: -12px; bottom: -12px; border-radius: 50%; border: 4px solid #E5E7EB; border-top-color: #4F567D; z-index: 0; opacity: 0.5;}
            .ring-total-label { font-size: 0.7rem; font-weight: 700; color: var(--text-muted); letter-spacing: 1px; z-index: 1;}
            .ring-total-value { font-size: 2.2rem; font-weight: 800; color: var(--text-main); z-index: 1; line-height: 1;}
            
            .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .stat-item { display: flex; flex-direction: column; align-items: center; }
            .stat-dot { width: 10px; height: 10px; border-radius: 50%; margin-bottom: 5px; }
            .stat-label { font-size: 0.7rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;}
            .stat-val { font-size: 1.2rem; font-weight: 800; color: var(--text-main); }

            /* LOG HARI INI */
            .log-list { display: flex; flex-direction: column; gap: 10px; }
            .log-item { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 12px 15px; display: flex; justify-content: space-between; align-items: center; }
            .log-info h5 { margin: 0; font-size: 0.9rem; color: var(--text-main); }
            .log-info p { margin: 0; font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; gap: 5px; }
            .log-badge { font-size: 0.7rem; font-weight: 700; padding: 3px 8px; border-radius: 6px; }
        </style>

        <div style="padding-bottom: 50px;">
            <h2 class="dash-title">Ahlan wa Sahlan, Ustadz!</h2>
            <p class="dash-quote">"Setiap huruf Al-Qur'an yang diajarkan adalah pahala jariyah yang mengalir tanpa henti."</p>

            <div class="widget-grid">
                <div class="widget-card">
                    <div class="w-label">TANGGAL & WAKTU</div>
                    <div class="w-value" id="dashTanggal">Memuat...</div>
                    <div class="w-value-sub" id="dashJam">00:00:00</div>
                </div>
                <div class="widget-card grad-bg">
                    <div class="w-label" style="color: #A7F3D0;">TARGET KBM</div>
                    <div class="w-value">24 Hari</div>
                    <div style="font-size: 0.7rem; margin-top: 5px; opacity: 0.8;"><i class="fas fa-bullseye"></i> Target Bulanan</div>
                </div>
            </div>

            <!-- JADWAL HARI INI -->
            <div class="section-title"><i class="fas fa-calendar-day text-primary"></i> Jadwal Hari Ini</div>
            <div class="schedule-wrapper" id="wadahJadwal">
                <div class="schedule-card" style="border-color: #E5E7EB; justify-content: center; align-items: center; color: var(--text-muted);">
                    <i class="fas fa-spinner fa-spin" style="font-size: 1.5rem; margin-bottom: 10px;"></i>
                    <span style="font-size: 0.8rem;">Menarik Jadwal...</span>
                </div>
            </div>

            <!-- STATISTIK -->
            <div class="section-title"><i class="fas fa-chart-pie text-primary"></i> Rekap Hari Ini</div>
            <div class="stats-container">
                <div class="ring-mockup">
                    <div class="ring-total-label">TOTAL SANTRI</div>
                    <div class="ring-total-value" id="statTotal">0</div>
                </div>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-dot" style="background: #10B981;"></div>
                        <div class="stat-label">Hadir</div>
                        <div class="stat-val" id="statHadir">0</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-dot" style="background: #3B82F6;"></div>
                        <div class="stat-label">Izin/Sakit</div>
                        <div class="stat-val" id="statIzinSakit">0</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-dot" style="background: #EF4444;"></div>
                        <div class="stat-label">Alfa</div>
                        <div class="stat-val" id="statAlfa">0</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-dot" style="background: #4F567D;"></div>
                        <div class="stat-label">Ulang</div>
                        <div class="stat-val" id="statUlang">0</div>
                    </div>
                </div>
            </div>

            <!-- LOG HARI INI -->
            <div class="section-title"><i class="fas fa-list-ul text-primary"></i> Log Terkini</div>
            <div class="log-list" id="wadahLog">
                <div style="text-align:center; padding: 20px; color: var(--text-muted); font-size: 0.85rem;">
                    Belum ada aktivitas terekam hari ini.
                </div>
            </div>
        </div>
    `;
}

export async function initDashboard() {
    // 1. JAM LIVE
    const elTanggal = document.getElementById('dashTanggal');
    const elJam = document.getElementById('dashJam');
    
    function updateClock() {
        const now = new Date();
        const optionsDate = { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' };
        elTanggal.textContent = now.toLocaleDateString('id-ID', optionsDate);
        elJam.textContent = now.toLocaleTimeString('id-ID', { hour12: false });
    }
    setInterval(updateClock, 1000);
    updateClock();

    // 2. LOGIKA JADWAL KELAS PINTAR
    async function loadJadwal() {
        const wadahJadwal = document.getElementById('wadahJadwal');
        try {
            // Ambil data kelas
            const kelasList = await api.get('kelas', 'select=*');
            // Ambil data santri untuk menghitung jumlah anak per kelas
            const santriList = await api.get('dapodik_santri', 'select=id,nama_kelas');
            
            if (kelasList.length === 0) {
                wadahJadwal.innerHTML = `<div style="padding: 20px; color: var(--text-muted); font-size: 0.85rem; border: 1px dashed var(--border); border-radius: 12px; width: 100%; text-align: center;">Belum ada jadwal kelas.</div>`;
                return;
            }

            let htmlJadwal = '';
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes(); // Konversi jam sekarang ke total menit

            kelasList.forEach(k => {
                // Hitung jumlah santri untuk kelas ini
                const jumlahSantri = santriList.filter(s => s.nama_kelas === k.nama_kelas).length;
                
                // Ekstrak Jam Mulai dan Jam Selesai dari format "13:30 - 14:30"
                let status = 'MENUNGGU';
                let statusClass = 'status-menunggu';
                let cardStyle = '';
                let timeColor = '#6EE7B7';

                if (k.jam_kelas && k.jam_kelas.includes('-')) {
                    const [startStr, endStr] = k.jam_kelas.split('-');
                    const [hS, mS] = startStr.trim().split(':').map(Number);
                    const [hE, mE] = endStr.trim().split(':').map(Number);
                    
                    const startMins = (hS * 60) + (mS || 0);
                    const endMins = (hE * 60) + (mE || 0);

                    // Logika penentuan status
                    if (currentMinutes < startMins) {
                        status = 'MENUNGGU';
                        statusClass = 'status-menunggu';
                    } else if (currentMinutes >= startMins && currentMinutes <= endMins) {
                        status = 'SEDANG BERJALAN';
                        statusClass = 'status-jalan';
                        cardStyle = 'border-color: #FCA5A5;';
                        timeColor = '#EF4444';
                    } else {
                        status = 'SELESAI';
                        statusClass = 'status-selesai';
                        cardStyle = 'border-color: #E5E7EB; opacity: 0.7;';
                        timeColor = '#9CA3AF';
                    }
                }

                htmlJadwal += `
                    <div class="schedule-card" style="${cardStyle}">
                        <div class="badge-status ${statusClass}">${status}</div>
                        <div class="sch-time" style="color: ${timeColor};">${k.jam_kelas || 'Waktu -'}</div>
                        <div class="sch-class">${k.nama_kelas}</div>
                        <div class="badge-santri">
                            <i class="fas fa-user-graduate"></i> ${jumlahSantri} Santri
                        </div>
                    </div>
                `;
            });

            wadahJadwal.innerHTML = htmlJadwal;
        } catch (error) {
            console.error(error);
            wadahJadwal.innerHTML = `<div style="color: red; padding: 15px;">Gagal memuat jadwal.</div>`;
        }
    }

    // 3. STATISTIK REALTIME & LOG AKTIVITAS
    async function loadStatistik() {
        const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
        
        try {
            // Ambil Total Santri
            const santriList = await api.get('dapodik_santri', 'select=id');
            document.getElementById('statTotal').textContent = santriList.length;

            // Ambil Kehadiran Hari ini
            const absenHariIni = await api.get('kehadiran', `select=status_kehadiran&tanggal=eq.${today}`);
            let hadir = 0, izinsakit = 0, alfa = 0;
            absenHariIni.forEach(a => {
                if(a.status_kehadiran === 'H') hadir++;
                else if(a.status_kehadiran === 'I' || a.status_kehadiran === 'S') izinsakit++;
                else if(a.status_kehadiran === 'A') alfa++;
            });
            
            document.getElementById('statHadir').textContent = hadir;
            document.getElementById('statIzinSakit').textContent = izinsakit;
            document.getElementById('statAlfa').textContent = alfa;

            // Ambil Log Tahsin/Tahfidz Hari ini (Digabung)
            const [logTahsin, logTahfidz, dataSantri] = await Promise.all([
                api.get('tahsin', `select=id_santri,status,program&tanggal=eq.${today}`),
                api.get('hafalan', `select=id_santri,status&tanggal=eq.${today}`),
                api.get('dapodik_santri', 'select=id,nama_santri') // Untuk mencocokkan ID dengan Nama
            ]);

            // Hitung status "Ulang" gabungan
            const totalUlang = logTahsin.filter(t => t.status === 'Ulang').length + logTahfidz.filter(t => t.status === 'Ulang').length;
            document.getElementById('statUlang').textContent = totalUlang;

            // Build Log Tampilan
            let logsCombined = [];
            
            logTahsin.forEach(t => {
                const sntr = dataSantri.find(s => s.id === t.id_santri);
                logsCombined.push({
                    nama: sntr ? sntr.nama_santri : 'Santri',
                    program: t.program || 'Tahsin',
                    status: t.status,
                    jenis: 'Tahsin'
                });
            });

            logTahfidz.forEach(t => {
                const sntr = dataSantri.find(s => s.id === t.id_santri);
                logsCombined.push({
                    nama: sntr ? sntr.nama_santri : 'Santri',
                    program: 'Hafalan Al-Qur\'an',
                    status: t.status,
                    jenis: 'Tahfidz'
                });
            });

            const wadahLog = document.getElementById('wadahLog');
            if(logsCombined.length === 0) {
                wadahLog.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--text-muted); font-size: 0.85rem;">Belum ada aktivitas terekam hari ini.</div>`;
            } else {
                // Tampilkan 5 log terakhir (dibalik agar yang terbaru di atas)
                wadahLog.innerHTML = logsCombined.reverse().slice(0, 5).map(log => `
                    <div class="log-item">
                        <div class="log-info">
                            <h5>${log.nama}</h5>
                            <p><i class="fas fa-tag text-primary"></i> ${log.program}</p>
                        </div>
                        <div class="log-badge" style="background: ${log.status === 'Ulang' ? '#FEE2E2' : '#D1FAE5'}; color: ${log.status === 'Ulang' ? '#991B1B' : '#065F46'};">
                            ${log.status}
                        </div>
                    </div>
                `).join('');
            }

        } catch(e) {
            console.error("Gagal menarik statistik:", e);
        }
    }

    // Eksekusi tarikan data
    loadJadwal();
    loadStatistik();
}
