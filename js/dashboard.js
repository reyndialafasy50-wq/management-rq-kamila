/**
 * ==================================================
 * BAGIAN 7: MODUL DASHBOARD (MURNI TANPA LONCENG)
 * File: js/dashboard.js
 * ==================================================
 */
import { api } from './api.js';

let myChart;
let rawHarianList = []; 
let rawSantriList = [];
let namaKelasAktif = null;

export function renderDashboard() {
    return `
        <style>
            .timeline-container { position: relative; padding-left: 20px; margin-top: 15px; }
            .timeline-container::before { content: ''; position: absolute; top: 10px; bottom: 10px; left: 6px; width: 2px; background: var(--border); }
            .timeline-item { position: relative; margin-bottom: 20px; padding-left: 15px; }
            .timeline-dot { position: absolute; left: -20px; top: 4px; width: 12px; height: 12px; border-radius: 50%; background: var(--primary); border: 2px solid var(--surface); box-shadow: 0 0 0 2px var(--border); }
            .timeline-time { font-size: 0.7rem; font-weight: 700; color: var(--text-muted); background: var(--bg-main); padding: 2px 8px; border-radius: 10px; display: inline-block; margin-bottom: 4px; }
            .timeline-title { font-size: 0.95rem; font-weight: 700; color: var(--text-main); text-transform: uppercase; margin: 0 0 2px 0; }
            .timeline-desc { font-size: 0.85rem; color: var(--text-muted); margin: 0 0 4px 0; }
            .badge-status { font-size: 0.7rem; font-weight: 800; padding: 2px 8px; border-radius: 6px; display: inline-block; }
            .badge-lulus { background: #D1FAE5; color: #065F46; }
            .badge-ulang { background: #FEE2E2; color: #991B1B; }
            .badge-absen { background: #E0E7FF; color: #3730A3; }
            
            #namesTooltip { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border: 1px solid var(--border); border-radius: 16px; padding: 15px; z-index: 100; width: 85%; box-shadow: 0 10px 40px rgba(0,0,0,0.2); display: none; flex-direction: column; }
            [data-theme="dark"] #namesTooltip { background: rgba(30,33,48,0.95); }
            .tooltip-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 10px; margin-bottom: 10px;}
            .tooltip-title { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 1rem;}
            .tooltip-list { max-height: 200px; overflow-y: auto; font-size: 0.85rem; color: var(--text-main); }
            .tooltip-list div { padding: 8px 0; border-bottom: 1px dashed var(--border); display: flex; justify-content: space-between;}
            .tooltip-close { background: #FEE2E2; color: #991B1B; border: none; width: 28px; height: 28px; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; transition: 0.2s;}
            .tooltip-close:active { transform: scale(0.9); }
            .legend-item { cursor: pointer; transition: 0.2s; padding: 5px; border-radius: 8px; }
            .legend-item:active { background: var(--bg-main); transform: scale(0.95); }
        </style>

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
            <button class="filter-btn active" id="btn-hari" data-filter="hari">Hari Ini</button>
            <button class="filter-btn" id="btn-pekan" data-filter="pekan">Pekan Ini</button>
            <button class="filter-btn" id="btn-bulan" data-filter="bulan">Bulan Ini</button>
        </div>

        <div class="dashboard-chart-card" style="position: relative;">
            <div id="namesTooltip">
                <div class="tooltip-header">
                    <span class="tooltip-title"><div class="legend-dot" id="ttDot"></div> <span id="ttLabel">Daftar</span></span>
                    <button class="tooltip-close" id="btnCloseTooltip"><i class="fas fa-times"></i></button>
                </div>
                <div class="tooltip-list" id="ttNames">Memuat data...</div>
            </div>

            <div class="chart-container-box">
                <canvas id="concentricChart"></canvas>
                <div class="chart-center-text">
                    <p id="chartClassNameText" style="margin: 0; font-size: 0.65rem; font-weight: 800; color: var(--text-muted); letter-spacing: 1px; text-transform: uppercase;">MENGHITUNG...</p>
                    <h3 id="chartTotalText" style="margin: 0; font-size: 2.2rem; color: var(--text-main); font-weight: 700; line-height: 1.1;">0</h3>
                </div>
            </div>

            <div class="legend-grid">
                <div class="legend-item" data-type="Hadir" data-color="#75B5B0"><div class="legend-dot" style="background: var(--clr-toska);"></div><span class="legend-title">Hadir</span><span class="legend-val" id="valHadir">0</span></div>
                <div class="legend-item" data-type="Izin/Skt" data-color="#8999B8"><div class="legend-dot" style="background: var(--clr-biru);"></div><span class="legend-title">Izin/Skt</span><span class="legend-val" id="valIzinSkt">0</span></div>
                <div class="legend-item" data-type="Alfa" data-color="#F39B96"><div class="legend-dot" style="background: var(--clr-koral);"></div><span class="legend-title">Alfa</span><span class="legend-val" id="valAlfa">0</span></div>
                <div class="legend-item" data-type="Ulang" data-color="#4F567D"><div class="legend-dot" style="background: var(--clr-dongker);"></div><span class="legend-title">Ulang</span><span class="legend-val" id="valUlang">0</span></div>
            </div>
        </div>

        <div style="margin-bottom: 30px; background: var(--surface); padding: 20px; border-radius: 16px; border: 1px solid var(--border);">
            <h4 id="titleRiwayat" style="font-size: 1rem; font-weight: 700; margin-bottom: 15px;"><i class="fas fa-history" style="color: var(--primary); margin-right: 8px;"></i> Riwayat Aktivitas</h4>
            <div id="timelineWrapper">
                <p style="text-align:center; color:var(--text-muted); padding:20px;"><i class="fas fa-circle-notch fa-spin"></i> Memuat data...</p>
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

    const trackColor = document.body.hasAttribute('data-theme') ? 'rgba(255,255,255,0.05)' : '#E8E6F0';
    const gapColor = document.body.hasAttribute('data-theme') ? '#1E2130' : '#FFFFFF'; 

    const chartConfig = {
        type: 'doughnut',
        data: { labels: ['Hadir', 'Izin', 'Alfa', 'Ulang'], datasets: [
            { data: [0, 1], backgroundColor: ['#75B5B0', trackColor], borderWidth: 4, borderColor: gapColor, borderRadius: 20 },
            { data: [0, 1], backgroundColor: ['#8999B8', trackColor], borderWidth: 4, borderColor: gapColor, borderRadius: 20 },
            { data: [0, 1], backgroundColor: ['#F39B96', trackColor], borderWidth: 4, borderColor: gapColor, borderRadius: 20 },
            { data: [0, 1], backgroundColor: ['#4F567D', trackColor], borderWidth: 4, borderColor: gapColor, borderRadius: 20 } 
        ]},
        options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { display: false }, tooltip: { enabled: false } }, animation: { animateScale: true, animateRotate: true } }
    };
    if (myChart) myChart.destroy();
    myChart = new Chart(ctx.getContext('2d'), chartConfig);

    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const today = new Date();
    const todayStr = formatDate(today);
    
    const dayOfWeek = today.getDay();
    const startOfWeekDate = new Date(today);
    startOfWeekDate.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    const startOfWeekStr = formatDate(startOfWeekDate);

    const startOfMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfMonthStr = formatDate(startOfMonthDate);

    let tooltipDataObj = { 'Hadir': {}, 'Izin/Skt': {}, 'Alfa': {}, 'Ulang': {} };

    function renderFilteredData(filterType) {
        let startDateFilter = todayStr;
        let titleSuffix = "Hari Ini";

        if (filterType === 'pekan') { startDateFilter = startOfWeekStr; titleSuffix = "Pekan Ini"; }
        else if (filterType === 'bulan') { startDateFilter = startOfMonthStr; titleSuffix = "Bulan Ini"; }

        document.getElementById('titleRiwayat').innerHTML = `<i class="fas fa-history" style="color: var(--primary); margin-right: 8px;"></i> Riwayat Aktivitas ${titleSuffix}`;

        const filteredLog = rawHarianList.filter(log => log.tanggal >= startDateFilter && log.tanggal <= todayStr);
        tooltipDataObj = { 'Hadir': {}, 'Izin/Skt': {}, 'Alfa': {}, 'Ulang': {} };
        let hadir = 0, izinSakit = 0, alfa = 0, ulang = 0;
        
        let chartSantriList = rawSantriList;
        if (namaKelasAktif) chartSantriList = rawSantriList.filter(s => s.nama_kelas === namaKelasAktif);
        const totalSantriKelas = chartSantriList.length;

        filteredLog.forEach(log => {
            if (namaKelasAktif && log.nama_kelas !== namaKelasAktif) return; 
            const nama = log.nama_santri || 'Tanpa Nama';
            if(log.status_hadir === 'Hadir') { hadir++; tooltipDataObj['Hadir'][nama] = (tooltipDataObj['Hadir'][nama] || 0) + 1; }
            else if(log.status_hadir === 'Izin' || log.status_hadir === 'Sakit') { izinSakit++; tooltipDataObj['Izin/Skt'][nama] = (tooltipDataObj['Izin/Skt'][nama] || 0) + 1; }
            else if(log.status_hadir === 'Alpa') { alfa++; tooltipDataObj['Alfa'][nama] = (tooltipDataObj['Alfa'][nama] || 0) + 1; }
            if(log.tahsin_status === 'Ulang' || log.tahfidz_status === 'Ulang') { ulang++; tooltipDataObj['Ulang'][nama] = (tooltipDataObj['Ulang'][nama] || 0) + 1; }
        });

        document.getElementById('chartClassNameText').textContent = namaKelasAktif ? `KELAS ${namaKelasAktif.toUpperCase()}` : 'SEMUA KELAS';
        document.getElementById('chartTotalText').textContent = totalSantriKelas || 0;
        document.getElementById('valHadir').textContent = hadir;
        document.getElementById('valIzinSkt').textContent = izinSakit;
        document.getElementById('valAlfa').textContent = alfa;
        document.getElementById('valUlang').textContent = ulang;

        const multiplier = filterType === 'pekan' ? 5 : (filterType === 'bulan' ? 20 : 1);
        const targetTotal = (totalSantriKelas === 0 ? 1 : totalSantriKelas) * multiplier;
        
        myChart.data.datasets[0].data = [hadir, Math.max(0, targetTotal - hadir)];
        myChart.data.datasets[1].data = [izinSakit, Math.max(0, targetTotal - izinSakit)];
        myChart.data.datasets[2].data = [alfa, Math.max(0, targetTotal - alfa)];
        myChart.data.datasets[3].data = [ulang, Math.max(0, targetTotal - ulang)];
        myChart.update();

        const timelineWrapper = document.getElementById('timelineWrapper');
        let timelineHTML = '';
        let listEvents = [];
        let kelasAbsenSet = new Set();

        filteredLog.forEach(row => {
            let timeStr = '12.00';
            if (row.created_at) {
                const dt = new Date(row.created_at);
                timeStr = `${String(dt.getHours()).padStart(2,'0')}.${String(dt.getMinutes()).padStart(2,'0')}`;
            }
            const uniqKey = `${row.tanggal}_${row.nama_kelas}`; 

            if (row.status_hadir && row.nama_kelas && !kelasAbsenSet.has(uniqKey)) {
                kelasAbsenSet.add(uniqKey);
                let titleAbs = `KELAS ${row.nama_kelas.toUpperCase()}`;
                if(filterType !== 'hari') titleAbs += ` <span style="font-size:0.6rem; color:#999;">(${row.tanggal.split('-').reverse().join('/')})</span>`;
                listEvents.push({ time: timeStr, title: titleAbs, desc: 'Terabsensi', statusText: 'SELESAI', badgeClass: 'badge-absen', dotColor: '#8999B8' });
            }

            if (row.tahsin_status) {
                let descTahsin = row.tahsin_program === "Al Qur'an" ? `Al Qur'an Juz ${row.tahsin_juz || 1} (${row.tahsin_surat || ''} ${row.tahsin_ayat_dari || 1}-${row.tahsin_ayat_sampai || 10})` : `${row.tahsin_program || 'Iqro'} ${row.tahsin_jilid || 1} hal. ${row.tahsin_halaman || 1}`;
                listEvents.push({ time: timeStr, title: row.nama_santri || 'Tanpa Nama', desc: descTahsin, statusText: row.tahsin_status, badgeClass: row.tahsin_status === 'Ulang' ? 'badge-ulang' : 'badge-lulus', dotColor: row.tahsin_status === 'Ulang' ? '#F39B96' : '#75B5B0' });
            }

            if (row.tahfidz_status) {
                const descTahfidz = `Al Qur'an Juz ${row.tahfidz_juz || 30} ${row.tahfidz_surat || ''} ${row.tahfidz_ayat_dari || 1}-${row.tahfidz_ayat_sampai || 10}`;
                listEvents.push({ time: timeStr, title: row.nama_santri || 'Tanpa Nama', desc: descTahfidz, statusText: row.tahfidz_status, badgeClass: row.tahfidz_status === 'Ulang' ? 'badge-ulang' : 'badge-lulus', dotColor: row.tahfidz_status === 'Ulang' ? '#F39B96' : '#10B981' });
            }
        });

        const eventsReversed = listEvents.reverse().slice(0, 15); 
        if (eventsReversed.length === 0) {
            timelineWrapper.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:20px;">Belum ada aktivitas.</div>`;
        } else {
            timelineHTML = '<div class="timeline-container">';
            eventsReversed.forEach(ev => {
                timelineHTML += `<div class="timeline-item"><div class="timeline-dot" style="background: ${ev.dotColor};"></div><span class="timeline-time">${ev.time} WIB</span><h5 class="timeline-title">${ev.title}</h5><p class="timeline-desc">${ev.desc}</p><span class="badge-status ${ev.badgeClass}">${ev.statusText}</span></div>`;
            });
            timelineHTML += '</div>';
            timelineWrapper.innerHTML = timelineHTML;
        }
    }

    async function hydrateDashboard() {
        try {
            const [santriList, harianList, kelasList] = await Promise.all([
                api.get('dapodik_santri', 'select=id,nama_kelas,nama_santri'),
                api.get('input_harian', `select=*&tanggal=gte.${startOfMonthStr}&order=created_at.asc`),
                api.get('kelas', 'select=*')
            ]);
            rawHarianList = harianList || []; rawSantriList = santriList || [];

            if(kelasList.length > 0) {
                const currentMins = today.getHours() * 60 + today.getMinutes();
                let kelasAktif = null, kelasMendatang = null;
                kelasList.forEach(k => {
                    if (k.jam_kelas && k.jam_kelas.includes('-')) {
                        const [sStr, eStr] = k.jam_kelas.split('-');
                        const startMins = (parseInt(sStr.split(':')[0]) * 60) + (parseInt(sStr.split(':')[1]) || 0);
                        const endMins = (parseInt(eStr.split(':')[0]) * 60) + (parseInt(eStr.split(':')[1]) || 0);
                        if (currentMins >= startMins && currentMins <= endMins) kelasAktif = k;
                        else if (currentMins < startMins) { if (!kelasMendatang || startMins < kelasMendatang.startMins) kelasMendatang = { ...k, startMins }; }
                    }
                });
                const jadwalContent = document.getElementById('jadwalContent');
                if (kelasAktif) { namaKelasAktif = kelasAktif.nama_kelas; jadwalContent.innerHTML = `<div style="display: flex; flex-direction: column; gap: 6px;"><div style="align-self: flex-start;"><span style="background: rgba(254, 226, 226, 0.9); color: #991B1B; padding: 4px 8px; border-radius: 6px; font-size: 0.65rem; font-weight: 800;">BERJALAN</span></div><div style="font-size: 1.05rem; font-weight: 800; color: #ffffff;">${kelasAktif.nama_kelas}</div></div>`; }
                else if (kelasMendatang) { namaKelasAktif = kelasMendatang.nama_kelas; jadwalContent.innerHTML = `<div style="display: flex; flex-direction: column; gap: 6px;"><div style="align-self: flex-start;"><span style="background: rgba(209, 250, 229, 0.9); color: #065F46; padding: 4px 8px; border-radius: 6px; font-size: 0.65rem; font-weight: 800;">MENUNGGU</span></div><div style="font-size: 1.05rem; font-weight: 800; color: #ffffff;">${kelasMendatang.nama_kelas}</div></div>`; }
                else { jadwalContent.innerHTML = `<span style="font-size:0.85rem; color:rgba(255,255,255,0.8); font-weight:600;">Semua kelas selesai.</span>`; }
            }
            renderFilteredData('hari');
        } catch(e) { console.error("Dashboard Error:", e); }
    }
    
    hydrateDashboard();

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderFilteredData(e.target.getAttribute('data-filter'));
        });
    });

    const tooltip = document.getElementById('namesTooltip');
    const ttLabel = document.getElementById('ttLabel');
    const ttNames = document.getElementById('ttNames');
    const ttDot = document.getElementById('ttDot');

    document.querySelectorAll('.legend-item').forEach(el => {
        el.addEventListener('click', () => {
            const type = el.getAttribute('data-type');
            ttLabel.textContent = `Daftar ${type}`;
            ttDot.style.background = el.getAttribute('data-color');
            let htmlList = '';
            const dataPilihan = tooltipDataObj[type] || {};
            for (const [namaSantri, jumlah] of Object.entries(dataPilihan)) htmlList += `<div><span>${namaSantri}</span> <span style="font-weight:700; color:${el.getAttribute('data-color')};">${jumlah > 1 ? `${jumlah}x` : ''}</span></div>`;
            if (htmlList === '') htmlList = `<div style="justify-content:center; color:var(--text-muted); border:none;">Kosong</div>`;
            ttNames.innerHTML = htmlList;
            tooltip.style.display = 'flex';
        });
    });

    document.getElementById('btnCloseTooltip').addEventListener('click', () => tooltip.style.display = 'none');
                                                                                         }
