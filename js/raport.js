/**
 * ==================================================
 * MODUL RAPORT - INPUT & CETAK (FINAL FULL FITUR)
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
        .raport-table { width: 100%; text-align: left; border-collapse: collapse; min-width: 800px; }
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
        .catatan-textarea { width: 100%; min-height: 120px; padding: 16px; border: 1px solid #c4c6d1; border-radius: 8px; background: #f8f9fb; resize: vertical; font-size: 0.9rem; line-height: 1.5; outline: none; }
        .catatan-textarea:focus { border-color: #002452; }
        
        .action-bar { display: flex; justify-content: flex-end; gap: 12px; padding-top: 24px; border-top: 1px solid #e1e2e4; margin-bottom: 40px; }
        .btn-action { padding: 12px 24px; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; border: 1px solid transparent; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-outline { border-color: #747781; color: #191c1e; background: transparent; }
        .btn-outline:hover { background: #e1e2e4; }
        .btn-reset { border-color: #ba1a1a; color: #ba1a1a; background: transparent; }
        .btn-reset:hover { background: #ffdad6; }
        .btn-preview { border-color: #735c00; color: #735c00; background: transparent; }
        .btn-preview:hover { background: #fed65b; color: #241a00; }
        .btn-primary { background: #002452; color: white; }
        .btn-primary:hover { background: #003a77; }

        @media (max-width: 768px) {
            .action-bar { display: grid; grid-template-columns: 1fr 1fr; width: 100%; }
            .btn-preview, .btn-primary { grid-column: 1 / -1; }
        }
    </style>

    <div class="raport-wrapper">
        <div class="raport-header">
            <h2 class="raport-title">Input Penilaian Diniyah</h2>
            <p class="raport-subtitle">Masukkan data evaluasi akademik untuk rapor santri.</p>
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

        <section class="glass-card" style="overflow: visible;">
            <div class="table-header">
                <h3>Nilai Akademik</h3>
                <button class="btn-add" id="btnTambahBaris">
                    <i class="fas fa-plus"></i> Tambah Baris
                </button>
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

        <section class="glass-card">
            <div class="catatan-box">
                <h3><i class="fas fa-edit" style="color: #735c00;"></i> Catatan Pengampu (Wali Kelas)</h3>
                <textarea id="inputCatatan" class="catatan-textarea" placeholder="Masukkan catatan atau nasehat untuk santri (otomatis terisi dari template)..."></textarea>
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
    const teksRataRata = document.getElementById('teksRataRata');
    const teksPredikatAkhir = document.getElementById('teksPredikatAkhir');
    const inputCatatan = document.getElementById('inputCatatan');
    const btnTambahBaris = document.getElementById('btnTambahBaris');
    
    let loggedInGuruId = localStorage.getItem('guru_id');
    let dataGuruCache = null;

    // FUNGSI PREDIKAT & KALKULASI
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

    // MANAJEMEN BARIS TABEL
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

    // LOAD DATA GURU
    const loadGuru = async () => {
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
            } catch (e) { console.error("Gagal load guru:", e); }
        }
    };
    loadGuru();

    // FILTER KELAS & SANTRI
    const filterKelas = document.getElementById('filterKelas');
    const filterSantri = document.getElementById('filterSantri');
    let dataSantriCache = []; // Simpan data santri yg diload

    try {
        const ds = await api.get('dapodik_santri', 'select=*');
        if (ds && ds.length > 0) {
            dataSantriCache = ds;
            const kelasUnik = [...new Set(ds.map(item => item.nama_kelas))].filter(Boolean).sort();
            kelasUnik.forEach(k => {
                const opt = document.createElement('option');
                opt.value = k; opt.textContent = k;
                filterKelas.appendChild(opt);
            });
        }
    } catch (e) { console.error("Gagal load kelas:", e); }

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

    // MENGAMBIL DATA FORM UNTUK DISIMPAN / DICETAK
    const kumpulkanDataForm = () => {
        const sId = filterSantri.value;
        if (!sId) return null;

        const detail_nilai = [];
        document.querySelectorAll('.baris-nilai').forEach(tr => {
            const materi = tr.querySelector('.input-materi').value;
            const kategori = tr.querySelector('.input-kategori').value;
            const nilai = tr.querySelector('.input-nilai').value;
            const predikat = tr.querySelector('.predikat-badge').textContent;
            const ket = tr.querySelector('.input-ket').value;
            if(materi || nilai) {
                detail_nilai.push({ materi, kategori, nilai, predikat, ket });
            }
        });

        return {
            santri_id: sId,
            guru_id: loggedInGuruId,
            tahun_ajaran: document.getElementById('filterTahun').value,
            semester: document.getElementById('filterSemester').value,
            rata_rata: parseFloat(teksRataRata.textContent),
            predikat: teksPredikatAkhir.textContent,
            catatan: inputCatatan.value,
            detail_nilai: detail_nilai
        };
    };

    // AKSI 1: SIMPAN PERMANEN
    document.getElementById('btnSimpanRaport').addEventListener('click', async () => {
        const data = kumpulkanDataForm();
        if (!data) return alert("Pilih Nama Santri terlebih dahulu!");
        if (data.detail_nilai.length === 0) return alert("Tabel nilai tidak boleh kosong!");

        const btn = document.getElementById('btnSimpanRaport');
        const ori = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
        btn.disabled = true;

        try {
            await api.post('raport_data', data);
            alert("Alhamdulillah, Data Raport berhasil disimpan permanen ke database!");
        } catch (e) {
            console.error(e);
            alert("Gagal menyimpan data raport. Pastikan tabel raport_data sudah dibuat di Supabase.");
        }
        
        btn.innerHTML = ori;
        btn.disabled = false;
    });

    // AKSI 2: PREVIEW RAPORT (Buka Jendela Cetak)
    document.getElementById('btnPreviewRaport').addEventListener('click', () => {
        const data = kumpulkanDataForm();
        if (!data) return alert("Pilih Nama Santri terlebih dahulu untuk melihat Raport!");
        
        const santri = dataSantriCache.find(s => s.id === data.santri_id);
        const guru = dataGuruCache || { nama: 'Wali Kelas', ttd_digital: '' };
        
        // Merakit baris tabel HTML
        let htmlBarisNilai = '';
        data.detail_nilai.forEach((n, idx) => {
            htmlBarisNilai += `
                <tr>
                    <td style="text-align:center; padding:8px; border:1px solid #333;">${idx + 1}</td>
                    <td style="padding:8px; border:1px solid #333;"><b>${n.materi}</b><br><small style="color:#555;">${n.kategori}</small></td>
                    <td style="text-align:center; padding:8px; border:1px solid #333;">${n.nilai}</td>
                    <td style="text-align:center; padding:8px; border:1px solid #333; font-weight:bold;">${n.predikat}</td>
                    <td style="padding:8px; border:1px solid #333;">${n.ket}</td>
                </tr>
            `;
        });

        // Template HTML untuk Kertas Print A4/F4
        const htmlCetak = `
            <html>
            <head>
                <title>Raport Diniyah - ${santri.nama_santri}</title>
                <style>
                    body { font-family: 'Times New Roman', serif; color: #000; line-height: 1.4; padding: 20px 40px; }
                    .kop-surat { text-align: center; border-bottom: 3px solid #000; padding-bottom: 15px; margin-bottom: 25px; }
                    .kop-surat h1 { margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 1px; }
                    .kop-surat h2 { margin: 5px 0 0 0; font-size: 18px; font-weight: normal; }
                    .info-grid { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 14px; }
                    .info-grid table td { padding: 3px 10px 3px 0; }
                    .tabel-utama { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; }
                    .tabel-utama th { background: #f0f0f0; padding: 10px; border: 1px solid #000; text-transform: uppercase; }
                    .tabel-utama td { border: 1px solid #000; }
                    .catatan-box { border: 1px solid #000; padding: 15px; min-height: 80px; margin-bottom: 30px; font-style: italic; }
                    .ttd-area { display: flex; justify-content: space-between; margin-top: 40px; text-align: center; }
                    .ttd-box { width: 250px; }
                    .img-ttd { height: 80px; object-fit: contain; margin: 10px 0; }
                    @media print {
                        @page { margin: 1.5cm; }
                        body { padding: 0; }
                    }
                </style>
            </head>
            <body>
                <div class="kop-surat">
                    <h1>RUMAH QUR'AN KAMILA</h1>
                    <h2>Laporan Hasil Perkembangan Belajar Santri (Diniyah)</h2>
                </div>

                <div class="info-grid">
                    <table style="border:none;">
                        <tr><td><b>Nama Santri</b></td><td>:</td><td>${santri.nama_santri.toUpperCase()}</td></tr>
                        <tr><td><b>Kelas</b></td><td>:</td><td>${santri.nama_kelas}</td></tr>
                    </table>
                    <table style="border:none;">
                        <tr><td><b>Tahun Ajaran</b></td><td>:</td><td>${data.tahun_ajaran}</td></tr>
                        <tr><td><b>Semester</b></td><td>:</td><td>${data.semester}</td></tr>
                    </table>
                </div>

                <table class="tabel-utama">
                    <thead>
                        <tr>
                            <th style="width: 5%;">No</th>
                            <th style="width: 30%;">Materi / Kategori</th>
                            <th style="width: 10%;">Nilai</th>
                            <th style="width: 10%;">Predikat</th>
                            <th style="width: 45%;">Keterangan & Catatan</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${htmlBarisNilai}
                        <tr>
                            <td colspan="2" style="text-align:right; padding:10px; border:1px solid #000;"><b>RATA-RATA:</b></td>
                            <td style="text-align:center; font-weight:bold; font-size:16px; border:1px solid #000;">${data.rata_rata}</td>
                            <td style="text-align:center; font-weight:bold; font-size:16px; border:1px solid #000;">${data.predikat}</td>
                            <td style="background:#f9f9f9; border:1px solid #000;"></td>
                        </tr>
                    </tbody>
                </table>

                <p style="font-weight:bold; margin-bottom:5px;">Catatan Pengampu / Wali Kelas:</p>
                <div class="catatan-box">
                    "${data.catatan}"
                </div>

                <div class="ttd-area">
                    <div class="ttd-box">
                        Mengetahui,<br>Orang Tua / Wali<br><br><br><br><br>
                        <b>( ......................................... )</b>
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

        // Membuka Jendela Baru untuk Print PDF
        const printWindow = window.open('', '_blank');
        printWindow.document.write(htmlCetak);
        printWindow.document.close();
        printWindow.focus();
        
        // Kasih jeda sedikit agar gambar TTD selesai dimuat sebelum window.print terpanggil
        setTimeout(() => {
            printWindow.print();
        }, 500);
    });

    document.getElementById('btnResetNilai').addEventListener('click', () => {
        if(confirm('Yakin ingin menghapus semua baris nilai ini?')) { tabelBody.innerHTML = ''; kalkulasiTotal(); }
    });
};
