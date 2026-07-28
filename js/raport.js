/**
 * ==================================================
 * MODUL RAPORT - INPUT PENILAIAN DINIYAH
 * File: js/raport.js
 * ==================================================
 */

import { api } from './api.js';

export const renderRaport = () => {
    return `
    <style>
        /* Menggunakan variabel warna agar selaras dengan desain sistem kita */
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
        
        .action-bar { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 12px; padding-top: 24px; border-top: 1px solid #e1e2e4; margin-bottom: 40px; }
        .btn-action { padding: 12px 24px; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; border: 1px solid transparent; transition: 0.2s; }
        .btn-outline { border-color: #747781; color: #191c1e; background: transparent; }
        .btn-outline:hover { background: #e1e2e4; }
        .btn-reset { border-color: #ba1a1a; color: #ba1a1a; background: transparent; }
        .btn-reset:hover { background: #ffdad6; }
        .btn-preview { border-color: #735c00; color: #735c00; background: transparent; }
        .btn-preview:hover { background: #fed65b; color: #241a00; }
        .btn-primary { background: #002452; color: white; }
        .btn-primary:hover { background: #003a77; }
    </style>

    <div class="raport-wrapper">
        <div class="raport-header">
            <h2 class="raport-title">Input Penilaian Diniyah</h2>
            <p class="raport-subtitle">Masukkan data evaluasi akademik untuk rapor santri.</p>
        </div>

        <!-- FILTER SECTION -->
        <section class="glass-card">
            <div class="filter-grid">
                <div>
                    <label class="form-label">Tahun Ajaran</label>
                    <select id="filterTahun" class="form-select">
                        <option value="2025/2026">2025/2026</option>
                        <option value="2026/2027">2026/2027</option>
                    </select>
                </div>
                <div>
                    <label class="form-label">Semester</label>
                    <select id="filterSemester" class="form-select">
                        <option value="Ganjil">Ganjil (Odd)</option>
                        <option value="Genap">Genap (Even)</option>
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
                    <select id="filterSantri" class="form-select">
                        <option value="">Pilih Santri...</option>
                    </select>
                </div>
            </div>
        </section>

        <!-- TABLE SECTION -->
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
                    <tbody id="tabelNilaiBody">
                        <!-- Baris akan ditambahkan oleh JavaScript -->
                    </tbody>
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

        <!-- CATATAN PENGAMPU -->
        <section class="glass-card">
            <div class="catatan-box">
                <h3><i class="fas fa-edit" style="color: #735c00;"></i> Catatan Pengampu (Wali Kelas)</h3>
                <textarea id="inputCatatan" class="catatan-textarea" placeholder="Masukkan catatan atau nasehat untuk santri (otomatis terisi dari template)..."></textarea>
            </div>
        </section>

        <!-- ACTIONS -->
        <div class="action-bar">
            <button class="btn-action btn-outline" onclick="window.history.back()">Kembali</button>
            <button class="btn-action btn-reset" id="btnResetNilai">Reset</button>
            <button class="btn-action btn-preview"><i class="fas fa-file-pdf"></i> Preview Raport</button>
            <button class="btn-action btn-primary"><i class="fas fa-save"></i> Simpan Permanen</button>
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
    
    // 1. LOGIKA MENGHITUNG PREDIKAT (Misal: >90 A, >80 B, >70 C)
    const hitungPredikat = (nilai) => {
        if (nilai === '' || isNaN(nilai)) return '-';
        const n = parseFloat(nilai);
        if (n >= 90) return 'A';
        if (n >= 85) return 'B+';
        if (n >= 75) return 'B';
        if (n >= 70) return 'C';
        return 'D';
    };

    // 2. LOGIKA MENGHITUNG RATA-RATA TOTAL KESELURUHAN BARIS
    const kalkulasiTotal = () => {
        const inputs = document.querySelectorAll('.input-nilai');
        let total = 0;
        let count = 0;

        inputs.forEach(input => {
            const val = parseFloat(input.value);
            if (!isNaN(val)) {
                total += val;
                count++;
                // Update predikat per baris otomatis
                const tdPredikat = input.closest('tr').querySelector('.predikat-badge');
                tdPredikat.textContent = hitungPredikat(val);
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

    // 3. FUNGSI MENAMBAH BARIS BARU KE TABEL
    const tambahBarisHTML = (materi = '', kategori = 'Al-Qur\'an', nilai = '', ket = '') => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="text" class="form-input" placeholder="Nama Materi..." value="${materi}"></td>
            <td>
                <select class="form-select">
                    <option value="Al-Qur'an" ${kategori==="Al-Qur'an"?'selected':''}>Al-Qur'an</option>
                    <option value="Aqidah" ${kategori==="Aqidah"?'selected':''}>Aqidah</option>
                    <option value="Akhlak" ${kategori==="Akhlak"?'selected':''}>Akhlak</option>
                    <option value="Fiqih" ${kategori==="Fiqih"?'selected':''}>Fiqih</option>
                    <option value="Hafalan" ${kategori==="Hafalan"?'selected':''}>Hafalan Hadits/Doa</option>
                </select>
            </td>
            <td style="text-align:center;">
                <input type="number" class="form-input input-nilai" min="0" max="100" placeholder="0-100" value="${nilai}">
            </td>
            <td style="text-align:center;"><span class="predikat-badge">${hitungPredikat(nilai)}</span></td>
            <td><input type="text" class="form-input" placeholder="Capaian/Saran..." value="${ket}"></td>
            <td>
                <button class="btn-delete" title="Hapus Baris"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        tabelBody.appendChild(tr);

        // Event listener saat nilai diketik
        const inputAngka = tr.querySelector('.input-nilai');
        inputAngka.addEventListener('input', kalkulasiTotal);

        // Event listener hapus baris
        const btnHapus = tr.querySelector('.btn-delete');
        btnHapus.addEventListener('click', () => {
            tr.remove();
            kalkulasiTotal();
        });
    };

    // Tambah Baris Manual via Tombol
    btnTambahBaris.addEventListener('click', () => tambahBarisHTML());

    // Berikan 2 baris default saat pertama kali buka
    tambahBarisHTML('Hafalan Juz 30', 'Al-Qur\'an', '92', 'Makhroj sangat baik');
    tambahBarisHTML('Rukun Iman & Islam', 'Aqidah', '88', 'Perlu pengulangan rukun ke-4');
    kalkulasiTotal(); // Hitung awal

    // 4. AMBIL TEMPLATE CATATAN DARI DATABASE GURU
    const loadTemplateCatatan = async () => {
        const loggedInGuruId = localStorage.getItem('guru_id');
        if (loggedInGuruId) {
            try {
                const dataGuru = await api.get('guru', `select=template_rapor&id=eq.${loggedInGuruId}`);
                if (dataGuru && dataGuru.length > 0 && dataGuru[0].template_rapor) {
                    inputCatatan.value = dataGuru[0].template_rapor;
                }
            } catch (e) {
                console.error("Gagal load template catatan:", e);
            }
        }
    };
    loadTemplateCatatan();

    // 5. ISI FILTER KELAS DARI DATABASE (Tiru logika input harian)
    const filterKelas = document.getElementById('filterKelas');
    try {
        const dataSantri = await api.get('dapodik_santri', 'select=nama_kelas');
        if (dataSantri && dataSantri.length > 0) {
            const kelasUnik = [...new Set(dataSantri.map(item => item.nama_kelas))].filter(Boolean).sort();
            kelasUnik.forEach(k => {
                const opt = document.createElement('option');
                opt.value = k; opt.textContent = k;
                filterKelas.appendChild(opt);
            });
        }
    } catch (e) { console.error("Gagal load kelas:", e); }

    // Tombol Reset
    document.getElementById('btnResetNilai').addEventListener('click', () => {
        if(confirm('Yakin ingin menghapus semua baris nilai ini?')) {
            tabelBody.innerHTML = '';
            kalkulasiTotal();
        }
    });
};
