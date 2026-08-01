/**
 * ==================================================
 * MODUL RAPORT - FINAL (RELASI GURU_ID MURNI)
 * File: js/raport.js
 * ==================================================
 */

import { api } from './api.js';

export const renderRaport = () => {
    return `
    <style>
        .raport-wrapper { font-family: 'Inter', sans-serif; color: var(--text-main); animation: fadeIn 0.4s ease-out; }
        .raport-header { margin-bottom: 24px; }
        .raport-title { font-size: 1.5rem; font-weight: 700; color: #002452; margin-bottom: 4px; font-family: 'Libre Caslon Text', serif; }
        .raport-subtitle { font-size: 0.9rem; color: var(--text-muted); }
        
        .glass-card { background: #ffffff; border-radius: 12px; border: 1px solid #e1e2e4; box-shadow: 0 2px 10px rgba(0,0,0,0.02); overflow: hidden; margin-bottom: 24px; position: relative; }
        .glass-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: #735c00; }
        
        .filter-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 24px; }
        .form-label { display: block; font-size: 0.85rem; font-weight: 600; color: #191c1e; margin-bottom: 8px; }
        .form-select, .form-input { width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid #c4c6d1; background: #f8f9fb; font-size: 0.9rem; outline: none; transition: 0.2s; }
        .form-select:focus, .form-input:focus { border-color: #002452; box-shadow: 0 0 0 2px rgba(0,36,82,0.1); }
        
        .table-header { background: #f3f4f6; padding: 16px 24px; border-bottom: 1px solid #e1e2e4; display: flex; justify-content: space-between; align-items: center; }
        .table-header h3 { font-size: 0.9rem; font-weight: 700; color: #002452; text-transform: uppercase; margin: 0; }
        .btn-add { background: #002452; color: white; padding: 8px 16px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; border: none; display: flex; align-items: center; gap: 6px; transition: 0.2s; }
        .btn-add:hover { background: #003a77; }
        
        .table-container { width: 100%; overflow-x: auto; }
        .raport-table { width: 100%; text-align: left; border-collapse: collapse; min-width: 600px; }
        .raport-table th { background: #002452; color: white; padding: 12px 16px; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; }
        .raport-table td { padding: 12px 16px; border-bottom: 1px solid #e1e2e4; }
        .raport-table tr:hover { background: #f8f9fb; }
        
        .input-nilai { width: 70px; text-align: center; font-weight: 600; }
        .predikat-badge { font-weight: 800; font-size: 1rem; color: #002452; }
        .btn-delete { color: #ba1a1a; background: transparent; border: none; cursor: pointer; padding: 6px; border-radius: 6px; transition: 0.2s; display: flex; align-items: center; justify-content: center; width: 100%; }
        .btn-delete:hover { background: #ffdad6; }
        
        .summary-footer { background: #f8f9fb; padding: 24px; display: flex; justify-content: flex-end; gap: 48px; border-top: 1px solid #e1e2e4; }
        .summary-box { text-align: right; }
        .summary-label { font-size: 0.85rem; font-weight: 600; color: #434750; text-transform: uppercase; margin-bottom: 4px; display: block; }
        .summary-value { font-size: 2rem; font-weight: 800; color: #002452; margin: 0; font-family: 'Libre Caslon Text', serif; }
        .summary-value.pred { color: #735c00; }
        
        .catatan-box { padding: 24px; }
        .catatan-box h3 { font-size: 0.9rem; font-weight: 700; color: #002452; text-transform: uppercase; margin-top: 0; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
        .catatan-textarea { width: 100%; min-height: 100px; padding: 16px; border: 1px solid #c4c6d1; border-radius: 8px; background: #f8f9fb; resize: vertical; font-size: 0.9rem; line-height: 1.5; outline: none; }
        
        .action-bar { display: flex; justify-content: flex-end; gap: 12px; padding-top: 24px; border-top: 1px solid #e1e2e4; margin-bottom: 40px; }
        .btn-action { padding: 12px 24px; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; border: 1px solid transparent; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-outline { border-color: #747781; color: #191c1e; background: transparent; }
        .btn-reset { border-color: #ba1a1a; color: #ba1a1a; background: transparent; }
        .btn-preview { border-color: #735c00; color: #735c00; background: transparent; }
        .btn-preview:hover { background: #fed65b; color: #241a00; }
        .btn-primary { background: #002452; color: white; }

        @media (max-width: 768px) {
            .action-bar { display: grid; grid-template-columns: 1fr 1fr; width: 100%; }
            .btn-preview, .btn-primary { grid-column: 1 / -1; }
        }
    </style>

    <div class="raport-wrapper">
        <div class="raport-header">
            <h2 class="raport-title">Input Penilaian Diniyah</h2>
            <p class="raport-subtitle">Masukkan data evaluasi akademik, hafalan, dan absensi santri.</p>
        </div>

        <section class="glass-card">
            <div class="filter-grid">
                <div>
                    <label class="form-label">Tahun Ajaran</label>
                    <select id="filterTahun" class="form-select">
                        <option value="2025/2026">2025/2026</option>
                        <option value="2026/2027" selected>2026/2027</option>
                    </select>
                </div>
                <div>
                    <label class="form-label">Semester</label>
                    <select id="filterSemester" class="form-select">
                        <option value="Ganjil (Odd)">Ganjil (Odd)</option>
                        <option value="Genap (Even)">Genap (Even)</option>
                    </select>
                </div>
                <div>
                    <label class="form-label">Kelas</label>
                    <select id="filterKelas" class="form-select">
                        <option value="">Pilih Kelas...</option>
                    </select>
                </div>
                <div>
                    <label class="form-label">Nama Santri</label>
                    <select id="filterSantri" class="form-select" disabled>
                        <option value="">Pilih Kelas Dahulu...</option>
                    </select>
                </div>
            </div>
        </section>

        <!-- TABLE AKADEMIK -->
        <section class="glass-card" style="overflow: visible;">
            <div class="table-header">
                <h3>1. Nilai Akademik</h3>
                <button class="btn-add" id="btnTambahBaris"><i class="fas fa-plus"></i> Tambah Baris</button>
            </div>
            <div class="table-container">
                <table class="raport-table">
                    <thead>
                        <tr>
                            <th style="width: 25%;">Materi</th>
                            <th style="width: 20%;">Kategori</th>
                            <th style="width: 12%; text-align: center;">Nilai</th>
                            <th style="width: 10%; text-align: center;">Predikat</th>
                            <th>Keterangan</th>
                            <th style="width: 8%; text-align: center;">Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="tabelNilaiBody"></tbody>
                </table>
            </div>
            <div class="summary-footer">
                <div class="summary-box">
                    <span class="summary-label">Rata-rata Nilai</span>
                    <p class="summary-value" id="teksRataRata">0.0</p>
                </div>
                <div class="summary-box">
                    <span class="summary-label">Predikat Akhir</span>
                    <p class="summary-value pred" id="teksPredikatAkhir">-</p>
                </div>
            </div>
        </section>

        <!-- TAHFIDZ & TAHSIN -->
        <section class="glass-card">
            <div class="catatan-box">
                <h3><i class="fas fa-book-open" style="color: #735c00;"></i> 2. Capaian Tahsin & Tahfidz</h3>
                <div class="filter-grid" style="padding: 0; gap: 15px;">
                    <div>
                        <label class="form-label">Capaian Tahsin (Qiro'ah)</label>
                        <input type="text" id="inputTahsin" class="form-input" placeholder="Menunggu pilihan santri...">
                    </div>
                    <div>
                        <label class="form-label">Capaian Tahfidz Qur'an</label>
                        <input type="text" id="inputTahfidz" class="form-input" placeholder="Menunggu pilihan santri...">
                    </div>
                </div>
            </div>
        </section>

        <!-- REKAP KEHADIRAN (SUPER OTOMATIS) -->
        <section class="glass-card">
            <div class="table-header">
                <h3><i class="fas fa-calendar-check" style="color: #002452; margin-right: 8px;"></i> 3. Rekap Kehadiran (Hitung Alpha & JP Otomatis)</h3>
            </div>
            <div class="table-container">
                <table class="raport-table">
                    <thead>
                        <tr>
                            <th style="width: 25%;">Bulan</th>
                            <th style="width: 15%; text-align: center;">Hadir</th>
                            <th style="width: 15%; text-align: center;">Izin</th>
                            <th style="width: 15%; text-align: center;">Sakit</th>
                            <th style="width: 15%; text-align: center;">Alpha</th>
                            <th style="width: 15%; text-align: center;">JP Total</th>
                        </tr>
                    </thead>
                    <tbody id="tabelKehadiranBody">
                        <!-- Akan diisi otomatis oleh JS -->
                    </tbody>
                </table>
            </div>
        </section>

        <section class="glass-card">
            <div class="catatan-box">
                <h3><i class="fas fa-edit" style="color: #735c00;"></i> 4. Catatan Pengampu (Wali Kelas)</h3>
                <textarea id="inputCatatan" class="catatan-textarea" placeholder="Masukkan catatan atau nasehat untuk santri..."></textarea>
            </div>
        </section>

        <div class="action-bar">
            <button class="btn-action btn-outline" onclick="window.history.back()">Kembali</button>
            <button class="btn-action btn-reset" id="btnResetNilai">Reset</button>
            <button class="btn-action btn-preview" id="btnPreviewRaport"><i class="fas fa-file-pdf"></i> Preview Raport</button>
            <button class="btn-action btn-primary" id="btnSimpanRaport"><i class="fas fa-save"></i> Simpan Permanen</button>
        </div>
    </div>
    `;
};

export const initRaport = async () => {
    const tabelBody = document.getElementById('tabelNilaiBody');
    const tabelKehadiranBody = document.getElementById('tabelKehadiranBody');
    const teksRataRata = document.getElementById('teksRataRata');
    const teksPredikatAkhir = document.getElementById('teksPredikatAkhir');
    
    const inputCatatan = document.getElementById('inputCatatan');
    const inputTahsin = document.getElementById('inputTahsin');
    const inputTahfidz = document.getElementById('inputTahfidz');
    
    const filterTahun = document.getElementById('filterTahun');
    const filterSemester = document.getElementById('filterSemester');
    const filterKelas = document.getElementById('filterKelas');
    const filterSantri = document.getElementById('filterSantri');
    const btnTambahBaris = document.getElementById('btnTambahBaris');
    
    let loggedInGuruId = localStorage.getItem('guru_id');
    const userRole = localStorage.getItem('user_role');
    
    let dataGuruCache = null;
    let dataSantriCache = [];

    // 1. RATA-RATA & PREDIKAT AKADEMIK
    const hitungPredikat = (nilai) => {
        if (nilai === '' || isNaN(nilai)) return '-';
        const n = parseFloat(nilai);
        if (n >= 90) return 'A';
        if (n >= 85) return 'B+';
        if (n >= 75) return 'B';
        if (n >= 70) return 'C';
        return 'D';
    };

    const kalkulasiTotal = () => {
        const inputs = document.querySelectorAll('.input-nilai');
        let total = 0, count = 0;
        inputs.forEach(input => {
            const val = parseFloat(input.value);
            if (!isNaN(val)) {
                total += val; count++;
                input.closest('tr').querySelector('.predikat-badge').textContent = hitungPredikat(val);
            } else {
                input.closest('tr').querySelector('.predikat-badge').textContent = '-';
            }
        });
        if (count > 0) {
            const rataRata = (total / count).toFixed(1);
            teksRataRata.textContent = rataRata;
            teksPredikatAkhir.textContent = hitungPredikat(rataRata);
        } else {
            teksRataRata.textContent = '0.0';
            teksPredikatAkhir.textContent = '-';
        }
    };

    const tambahBarisHTML = (materi = '', kategori = 'Al-Qur\'an', nilai = '', ket = '') => {
        const tr = document.createElement('tr');
        tr.className = 'baris-nilai';
        tr.innerHTML = `
            <td><input type="text" class="form-input input-materi" placeholder="Nama Materi..." value="${materi}"></td>
            <td>
                <select class="form-select input-kategori">
                    <option value="Al-Qur'an" ${kategori==="Al-Qur'an"?'selected':''}>Al-Qur'an</option>
                    <option value="Aqidah" ${kategori==="Aqidah"?'selected':''}>Aqidah</option>
                    <option value="Akhlak" ${kategori==="Akhlak"?'selected':''}>Akhlak</option>
                    <option value="Fiqih" ${kategori==="Fiqih"?'selected':''}>Fiqih</option>
                    <option value="Hafalan" ${kategori==="Hafalan"?'selected':''}>Hafalan Hadits/Doa</option>
                </select>
            </td>
            <td style="text-align:center;"><input type="number" class="form-input input-nilai" min="0" max="100" placeholder="0-100" value="${nilai}"></td>
            <td style="text-align:center;"><span class="predikat-badge">${hitungPredikat(nilai)}</span></td>
            <td><input type="text" class="form-input input-ket" placeholder="Capaian/Saran..." value="${ket}"></td>
            <td><button class="btn-delete" title="Hapus Baris"><i class="fas fa-trash-alt"></i></button></td>
        `;
        tabelBody.appendChild(tr);
        tr.querySelector('.input-nilai').addEventListener('input', kalkulasiTotal);
        tr.querySelector('.btn-delete').addEventListener('click', () => { tr.remove(); kalkulasiTotal(); });
    };

    btnTambahBaris.addEventListener('click', () => tambahBarisHTML());
    tambahBarisHTML('Hafalan Juz 30', 'Al-Qur\'an', '92', 'Makhroj sangat baik');
    tambahBarisHTML('Rukun Iman & Islam', 'Aqidah', '88', 'Perlu pengulangan');
    kalkulasiTotal();

    // 2. RENDER KERANGKA TABEL KEHADIRAN
    const renderTabelKehadiran = () => {
        const isGanjil = filterSemester.value.includes('Ganjil');
        const bulanList = isGanjil 
            ? ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
            : ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];
        
        let html = '';
        bulanList.forEach(bulan => {
            html += `
                <tr class="baris-kehadiran">
                    <td style="font-weight: 600;">
                        <input type="hidden" class="input-bulan" value="${bulan}">
                        ${bulan}
                    </td>
                    <td><input type="number" class="form-input input-hadir" style="text-align:center;" placeholder="0"></td>
                    <td><input type="number" class="form-input input-izin" style="text-align:center;" placeholder="0"></td>
                    <td><input type="number" class="form-input input-sakit" style="text-align:center;" placeholder="0"></td>
                    <td><input type="number" class="form-input input-alpa" style="text-align:center; background:#fee2e2; font-weight:bold;" placeholder="0" readonly></td>
                    <td><input type="number" class="form-input input-jp" style="text-align:center; background:#e1e2e4; font-weight:bold;" placeholder="0" readonly></td>
                </tr>
            `;
        });
        tabelKehadiranBody.innerHTML = html;
        if(filterSantri.value) triggerTarikDataOtomatis();
    };
    
    filterSemester.addEventListener('change', renderTabelKehadiran);
    filterTahun.addEventListener('change', () => { if(filterSantri.value) triggerTarikDataOtomatis(); });
    renderTabelKehadiran();

    // 3. LOAD DATA MASTER & HAK AKSES (RELASIONAL GURU_ID)
    const loadMasterData = async () => {
        // Ambil Data Guru
        if (!loggedInGuruId) {
            const dataG = await api.get('guru', 'select=*&limit=1');
            if (dataG && dataG.length > 0) {
                loggedInGuruId = dataG[0].id;
                localStorage.setItem('guru_id', loggedInGuruId);
            }
        }
        if (loggedInGuruId) {
            try {
                const req = await api.get('guru', `select=*&id=eq.${loggedInGuruId}`);
                if (req && req.length > 0) {
                    dataGuruCache = req[0];
                    if (dataGuruCache.template_rapor) inputCatatan.value = dataGuruCache.template_rapor;
                }
            } catch (e) {}
        }

        // Ambil Data Kelas & Santri bersamaan
        try {
            const [kData, ds] = await Promise.all([
                api.get('kelas', 'select=*'),
                api.get('dapodik_santri', 'select=*')
            ]);

            if (ds && ds.length > 0) {
                dataSantriCache = ds;
                let kelasUnik = [];
                
                // --- FILTER AJAIB (HAK AKSES KELAS BERDASARKAN GURU_ID) ---
                if (userRole !== 'Admin' && loggedInGuruId) {
                    // Saring kelas dari tabel 'kelas' berdasarkan guru_id
                    const kelasMilikGuru = (kData || []).filter(k => String(k.guru_id) === String(loggedInGuruId));
                    kelasUnik = kelasMilikGuru.map(k => k.nama_kelas).sort();
                } else {
                    // Jika Admin, ambil semua nama kelas dari tabel kelas
                    kelasUnik = (kData || []).map(k => k.nama_kelas).sort();
                    
                    // Backup jika tabel kelas kosong tapi tabel santri ada datanya
                    if (kelasUnik.length === 0) {
                        kelasUnik = [...new Set(ds.map(item => item.nama_kelas))].filter(Boolean).sort();
                    }
                }

                kelasUnik.forEach(k => {
                    const opt = document.createElement('option');
                    opt.value = k; opt.textContent = k;
                    filterKelas.appendChild(opt);
                });
                
                // Auto-pilih jika hanya 1 kelas
                if (kelasUnik.length === 1) {
                    filterKelas.value = kelasUnik[0];
                    filterKelas.dispatchEvent(new Event('change'));
                }
            }
        } catch (e) {
            console.error("Gagal load data master raport", e);
        }
    };
    
    loadMasterData();

    filterKelas.addEventListener('change', (e) => {
        const kelas = e.target.value;
        filterSantri.innerHTML = '<option value="">Pilih Santri...</option>';
        if (!kelas) { filterSantri.disabled = true; return; }
        filterSantri.disabled = false;
        
        const santriDiKelas = dataSantriCache.filter(s => s.nama_kelas === kelas).sort((a,b) => a.nama_santri.localeCompare(b.nama_santri));
        santriDiKelas.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id; opt.textContent = s.nama_santri;
            filterSantri.appendChild(opt);
        });
    });

    // 4. MESIN PENARIK DATA SUPER OTOMATIS
    const triggerTarikDataOtomatis = async () => {
        const santriId = filterSantri.value;
        const kelasPilih = filterKelas.value;
        if (!santriId) return;

        inputTahsin.value = 'Memuat dari database...';
        inputTahfidz.value = 'Memuat dari database...';

        const tahunAjaran = filterTahun.value; 
        const semester = filterSemester.value; 
        const [tahun1, tahun2] = tahunAjaran.split('/');
        
        let startDate, endDate, bulanMapping;
        if (semester.includes('Ganjil')) {
            startDate = `${tahun1}-07-01`; endDate = `${tahun1}-12-31`;
            bulanMapping = { '07': 'Juli', '08': 'Agustus', '09': 'September', '10': 'Oktober', '11': 'November', '12': 'Desember' };
        } else {
            startDate = `${tahun2}-01-01`; endDate = `${tahun2}-06-30`;
            bulanMapping = { '01': 'Januari', '02': 'Februari', '03': 'Maret', '04': 'April', '05': 'Mei', '06': 'Juni' };
        }

        try {
            const reqJP = await api.get('setting_jp', `select=*&tahun_ajaran=eq.${tahunAjaran}&semester=eq.${semester}`);
            let jpAdmin = {};
            if (reqJP) reqJP.forEach(item => { jpAdmin[item.bulan] = item.jp_default; });

            const reqLibur = await api.get('libur_kelas', `select=*&tanggal=gte.${startDate}&tanggal=lte.${endDate}`);
            let potongLibur = {};
            if (reqLibur) {
                reqLibur.forEach(lbr => {
                    const isSemua = lbr.cakupan === 'Semua Kelas';
                    const isKelasIni = lbr.kelas_terpilih && lbr.kelas_terpilih.includes(kelasPilih);
                    if (isSemua || isKelasIni) {
                        const bln = lbr.tanggal.substring(5, 7);
                        const namaBln = bulanMapping[bln];
                        if (namaBln) potongLibur[namaBln] = (potongLibur[namaBln] || 0) + 1;
                    }
                });
            }

            const rekapan = await api.get('input_harian', `select=*&santri_id=eq.${santriId}&tanggal=gte.${startDate}&tanggal=lte.${endDate}&order=tanggal.asc`);
            
            let rekapAbsen = {};
            let lastTahsin = '', lastTahfidz = '';

            if (rekapan && rekapan.length > 0) {
                rekapan.forEach(rekord => {
                    const tgl = rekord.tanggal; 
                    if (tgl) {
                        const bln = tgl.substring(5, 7); 
                        const namaBln = bulanMapping[bln];
                        if (namaBln) {
                            if (!rekapAbsen[namaBln]) rekapAbsen[namaBln] = { h: 0, s: 0, i: 0 };
                            if (rekord.status_hadir === 'Hadir') rekapAbsen[namaBln].h += 1;
                            else if (rekord.status_hadir === 'Sakit') rekapAbsen[namaBln].s += 1;
                            else if (rekord.status_hadir === 'Izin') rekapAbsen[namaBln].i += 1;
                        }
                    }
                    const jenis = (rekord.jenis_setoran || rekord.kategori || rekord.materi || '').toLowerCase();
                    const capaian = rekord.jilid_surah || rekord.halaman_ayat || rekord.keterangan || '';
                    if (jenis.includes('tahsin') || jenis.includes('jilid') || jenis.includes('qiroah')) lastTahsin = capaian;
                    if (jenis.includes('tahfidz') || jenis.includes('surat') || jenis.includes('hafalan')) lastTahfidz = capaian;
                });
            }

            document.querySelectorAll('.baris-kehadiran').forEach(tr => {
                const blnUI = tr.querySelector('.input-bulan').value;
                const targetAdmin = jpAdmin[blnUI] || 0;
                const libur = potongLibur[blnUI] || 0;
                let jpRiil = targetAdmin - libur;
                if(jpRiil < 0) jpRiil = 0;

                const h = rekapAbsen[blnUI] ? rekapAbsen[blnUI].h : 0;
                const s = rekapAbsen[blnUI] ? rekapAbsen[blnUI].s : 0;
                const i = rekapAbsen[blnUI] ? rekapAbsen[blnUI].i : 0;

                let a = jpRiil - (h + s + i);
                
                if(targetAdmin === 0 && (h+s+i) > 0) {
                    jpRiil = h + s + i;
                    a = 0;
                } else if (a < 0) {
                    a = 0; 
                }

                tr.querySelector('.input-hadir').value = h;
                tr.querySelector('.input-izin').value = i;
                tr.querySelector('.input-sakit').value = s;
                tr.querySelector('.input-alpa').value = a;
                tr.querySelector('.input-jp').value = jpRiil;
            });

            inputTahsin.value = lastTahsin || 'Belum ada setoran';
            inputTahfidz.value = lastTahfidz || 'Belum ada setoran';

        } catch (err) {
            inputTahsin.value = ''; inputTahfidz.value = '';
        }
    };
    filterSantri.addEventListener('change', triggerTarikDataOtomatis);

    // 5. KUMPULKAN DATA UNTUK DISIMPAN / DICETAK
    const kumpulkanDataForm = () => {
        const sId = filterSantri.value;
        if (!sId) return null;

        const dataAkademik = [];
        document.querySelectorAll('.baris-nilai').forEach(tr => {
            const materi = tr.querySelector('.input-materi').value;
            const nilai = tr.querySelector('.input-nilai').value;
            if(materi || nilai) {
                dataAkademik.push({
                    materi: materi,
                    kategori: tr.querySelector('.input-kategori').value,
                    nilai: nilai,
                    predikat: tr.querySelector('.predikat-badge').textContent,
                    ket: tr.querySelector('.input-ket').value
                });
            }
        });

        const dataKehadiran = [];
        document.querySelectorAll('.baris-kehadiran').forEach(tr => {
            const h = tr.querySelector('.input-hadir').value || '0';
            const i = tr.querySelector('.input-izin').value || '0';
            const s = tr.querySelector('.input-sakit').value || '0';
            const a = tr.querySelector('.input-alpa').value || '0';
            const jp = tr.querySelector('.input-jp').value || '0';
            
            if(h !== '0' || s !== '0' || i !== '0' || a !== '0' || jp !== '0') {
                dataKehadiran.push({
                    bulan: tr.querySelector('.input-bulan').value,
                    h: h, i: i, s: s, a: a, jp: jp
                });
            }
        });

        const detail_nilai = {
            akademik: dataAkademik,
            kehadiran: dataKehadiran,
            tahsin: inputTahsin.value || '-',
            tahfidz: inputTahfidz.value || '-'
        };

        return {
            santri_id: sId,
            guru_id: loggedInGuruId,
            tahun_ajaran: filterTahun.value,
            semester: filterSemester.value,
            rata_rata: parseFloat(teksRataRata.textContent),
            predikat: teksPredikatAkhir.textContent,
            catatan: inputCatatan.value,
            detail_nilai: detail_nilai
        };
    };

    // 6. TOMBOL SIMPAN PERMANEN
    document.getElementById('btnSimpanRaport').addEventListener('click', async () => {
        const data = kumpulkanDataForm();
        if (!data) return alert("Pilih Nama Santri terlebih dahulu!");
        
        const btn = document.getElementById('btnSimpanRaport');
        const ori = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
        btn.disabled = true;

        try {
            await api.post('raport_data', data);
            alert("Alhamdulillah, Data Raport berhasil disimpan permanen!");
        } catch (e) {
            alert("Gagal menyimpan data raport. Cek koneksi Anda.");
        }
        btn.innerHTML = ori;
        btn.disabled = false;
    });

    // 7. TOMBOL PREVIEW (CETAK PDF)
    document.getElementById('btnPreviewRaport').addEventListener('click', () => {
        const data = kumpulkanDataForm();
        if (!data) return alert("Pilih Nama Santri terlebih dahulu untuk melihat Raport!");
        
        const santri = dataSantriCache.find(s => s.id === data.santri_id);
        const guru = dataGuruCache || { nama: 'Wali Kelas', ttd_digital: '' };
        
        let htmlBarisNilai = '';
        data.detail_nilai.akademik.forEach((n, idx) => {
            htmlBarisNilai += `
                <tr>
                    <td style="text-align:center; padding:8px; border:1px solid #000;">${idx + 1}</td>
                    <td style="padding:8px; border:1px solid #000;"><b>${n.materi}</b><br><small style="color:#555;">${n.kategori}</small></td>
                    <td style="text-align:center; padding:8px; border:1px solid #000;">${n.nilai}</td>
                    <td style="text-align:center; padding:8px; border:1px solid #000; font-weight:bold;">${n.predikat}</td>
                    <td style="padding:8px; border:1px solid #000;">${n.ket}</td>
                </tr>
            `;
        });

        let htmlKehadiran = '';
        let totH = 0, totS = 0, totI = 0, totA = 0, totJP = 0;
        
        if(data.detail_nilai.kehadiran.length === 0) {
            htmlKehadiran = `<tr><td colspan="7" style="padding:8px; text-align:center; border:1px solid #000;">Belum ada data kehadiran</td></tr>`;
        } else {
            data.detail_nilai.kehadiran.forEach((k, idx) => {
                htmlKehadiran += `
                    <tr>
                        <td style="text-align:center; padding:6px; border:1px solid #000;">${idx + 1}</td>
                        <td style="padding:6px; border:1px solid #000;">${k.bulan}</td>
                        <td style="text-align:center; padding:6px; border:1px solid #000;">${k.h}</td>
                        <td style="text-align:center; padding:6px; border:1px solid #000;">${k.i}</td>
                        <td style="text-align:center; padding:6px; border:1px solid #000;">${k.s}</td>
                        <td style="text-align:center; padding:6px; border:1px solid #000;">${k.a}</td>
                        <td style="text-align:center; padding:6px; border:1px solid #000;">${k.jp}</td>
                    </tr>
                `;
                totH += parseInt(k.h) || 0; totI += parseInt(k.i) || 0;
                totS += parseInt(k.s) || 0; totA += parseInt(k.a) || 0;
                totJP += parseInt(k.jp) || 0;
            });
        }

        let persentaseHadir = totJP > 0 ? Math.round((totH / totJP) * 100) : 0;
        let predikatHadir = '';
        if (persentaseHadir >= 90) predikatHadir = 'A (Sangat Baik)';
        else if (persentaseHadir >= 80) predikatHadir = 'B (Baik)';
        else if (persentaseHadir >= 70) predikatHadir = 'C (Cukup)';
        else predikatHadir = 'D (Kurang)';

        const htmlCetak = `
            <html>
            <head>
                <title>Raport Diniyah - ${santri.nama_santri}</title>
                <style>
                    body { font-family: 'Times New Roman', serif; color: #000; line-height: 1.4; padding: 20px 40px; font-size: 14px; }
                    .kop-surat { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
                    .kop-surat h1 { margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 1px; }
                    .kop-surat h2 { margin: 5px 0 0 0; font-size: 14px; font-weight: normal; }
                    
                    .info-grid { display: flex; justify-content: space-between; margin-bottom: 15px; }
                    .info-grid table { font-size: 13px; font-weight: bold; }
                    .info-grid table td { padding: 2px 10px 2px 0; }
                    
                    .tabel-utama { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
                    .tabel-utama th { background: #f9f9f9; padding: 10px; border: 1px solid #000; text-transform: uppercase; }
                    .tabel-utama td { border: 1px solid #000; }
                    
                    .section-title { font-weight: bold; font-size: 14px; margin-bottom: 8px; margin-top: 15px; }
                    .catatan-box { border: 1px solid #000; padding: 15px; min-height: 70px; margin-bottom: 30px; font-style: italic; font-size: 13px; }
                    
                    .ttd-area { display: flex; justify-content: space-between; padding: 0 20px; text-align: center; font-size: 13px; }
                    .ttd-box { width: 220px; }
                    .img-ttd { height: 70px; object-fit: contain; margin: 5px 0; }
                    
                    @media print { @page { margin: 1cm; size: A4 portrait; } body { padding: 0; } }
                </style>
            </head>
            <body>
                <div class="kop-surat">
                    <h1>RUMAH QUR'AN KAMILA</h1>
                    <h2>Laporan Hasil Perkembangan Belajar Santri (Diniyah)</h2>
                </div>

                <div class="info-grid">
                    <table style="border:none;">
                        <tr><td>Nama Santri</td><td>:</td><td>${santri.nama_santri.toUpperCase()}</td></tr>
                        <tr><td>Kelas</td><td>:</td><td>${santri.nama_kelas}</td></tr>
                    </table>
                    <table style="border:none;">
                        <tr><td>Tahun Ajaran</td><td>:</td><td>${data.tahun_ajaran}</td></tr>
                        <tr><td>Semester</td><td>:</td><td>${data.semester}</td></tr>
                    </table>
                </div>

                <table class="tabel-utama">
                    <thead>
                        <tr>
                            <th style="width: 5%;">No</th>
                            <th style="width: 35%;">Materi / Kategori</th>
                            <th style="width: 10%;">Nilai</th>
                            <th style="width: 10%;">Predikat</th>
                            <th style="width: 40%;">Keterangan & Catatan</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${htmlBarisNilai}
                        <tr>
                            <td colspan="2" style="text-align:right; padding:10px; border:1px solid #000;"><b>RATA-RATA:</b></td>
                            <td style="text-align:center; font-weight:bold; font-size:15px; border:1px solid #000;">${data.rata_rata}</td>
                            <td style="text-align:center; font-weight:bold; font-size:15px; border:1px solid #000;">${data.predikat}</td>
                            <td style="background:#f9f9f9; border:1px solid #000;"></td>
                        </tr>
                    </tbody>
                </table>

                <div class="section-title">Capaian Tahsin & Tahfidz:</div>
                <table class="tabel-utama" style="margin-bottom: 20px;">
                    <tr>
                        <td style="padding:10px; width:30%; background:#f9f9f9;"><b>Tahsin (Qiro'ah)</b></td>
                        <td style="padding:10px;">${data.detail_nilai.tahsin}</td>
                    </tr>
                    <tr>
                        <td style="padding:10px; background:#f9f9f9;"><b>Tahfidz Qur'an</b></td>
                        <td style="padding:10px;">${data.detail_nilai.tahfidz}</td>
                    </tr>
                </table>

                <div class="section-title">Rekapitulasi Kehadiran:</div>
                <table class="tabel-utama" style="margin-bottom: 10px; width: 100%;">
                    <thead>
                        <tr>
                            <th rowspan="2" style="width: 5%;">No</th>
                            <th rowspan="2" style="width: 25%;">Bulan</th>
                            <th colspan="4" style="width: 50%;">Absensi</th>
                            <th rowspan="2" style="width: 20%;">JP</th>
                        </tr>
                        <tr>
                            <th style="width: 12.5%;">Hadir</th>
                            <th style="width: 12.5%;">Izin</th>
                            <th style="width: 12.5%;">Sakit</th>
                            <th style="width: 12.5%;">Alpha</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${htmlKehadiran}
                        <tr>
                            <td colspan="2" style="text-align:right; padding:6px; border:1px solid #000;"><b>TOTAL 1 SEMESTER:</b></td>
                            <td style="text-align:center; padding:6px; border:1px solid #000; font-weight:bold;">${totH}</td>
                            <td style="text-align:center; padding:6px; border:1px solid #000; font-weight:bold;">${totI}</td>
                            <td style="text-align:center; padding:6px; border:1px solid #000; font-weight:bold;">${totS}</td>
                            <td style="text-align:center; padding:6px; border:1px solid #000; font-weight:bold;">${totA}</td>
                            <td style="text-align:center; padding:6px; border:1px solid #000; font-weight:bold;">${totJP}</td>
                        </tr>
                    </tbody>
                </table>
                <p style="font-size: 13px; margin-top: -5px; margin-bottom: 25px;">
                    <b>Tingkat Kehadiran:</b> ${persentaseHadir}% &nbsp;&nbsp;|&nbsp;&nbsp; <b>Predikat:</b> ${predikatHadir}
                </p>

                <div class="section-title">Catatan Pengampu / Wali Kelas:</div>
                <div class="catatan-box">
                    "${data.catatan}"
                </div>

                <div class="ttd-area">
                    <div class="ttd-box">
                        Mengetahui,<br>Orang Tua / Wali<br><br><br><br><br>
                        <b>( ........................................ )</b>
                    </div>
                    <div class="ttd-box">
                        Wali Kelas Diniyah,<br>
                        ${guru.ttd_digital ? `<img src="${guru.ttd_digital}" class="img-ttd"><br>` : `<br><br><br><br>`}
                        <b><u>Ust. ${guru.nama}</u></b>
                    </div>
                </div>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(htmlCetak);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); }, 500);
    });
};
