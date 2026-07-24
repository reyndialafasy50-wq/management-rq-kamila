/**
 * ==================================================
 * MODUL LAPORAN (KHUSUS REKAP KELAS UNTUK YAYASAN/OWNER)
 * File: js/laporan.js
 * ==================================================
 */

export const renderLaporan = () => {
    return `
    <style>
        /* Mengamankan agar scroll halaman natural */
        .laporan-wrapper {
            display: flex;
            flex-direction: column;
            gap: 20px;
            padding-bottom: 80px; /* Ruang lega di bagian bawah */
            animation: fadeIn 0.3s ease;
        }

        /* Tombol Cetak & Unduh (Mirip Screenshot) */
        .action-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        .btn-action {
            padding: 15px 10px;
            border-radius: 12px;
            font-weight: 800;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            color: white;
            font-size: 0.95rem;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
            transition: transform 0.2s;
        }
        .btn-action:active { transform: scale(0.95); }
        .btn-cetak { background: #334155; } /* Biru gelap/Abu tua */
        .btn-unduh { background: #10B981; } /* Hijau terang */

        /* Kartu Filter */
        .filter-card {
            background: var(--surface);
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            border: 1px solid var(--border);
        }
        .form-group { margin-bottom: 15px; }
        .form-group label {
            display: block;
            font-size: 0.85rem;
            font-weight: 700;
            color: var(--text-muted);
            margin-bottom: 8px;
        }
        .form-control-laporan {
            width: 100%;
            padding: 14px;
            border: 1.5px solid #CBD5E1;
            border-radius: 10px;
            background: var(--bg-main);
            color: var(--text-main);
            font-size: 1rem;
            font-weight: 600;
            appearance: none; /* Menghilangkan panah default bawaan HP */
            background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%22%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
            background-repeat: no-repeat;
            background-position: right 15px top 50%;
            background-size: 12px auto;
        }
        .form-control-laporan:focus {
            border-color: #3B82F6;
            outline: none;
            box-shadow: 0 0 0 3px rgba(59,130,246,0.2);
        }
        .form-control-laporan:disabled {
            background-color: transparent;
            color: #3B82F6; /* Warna biru sesuai screenshot */
            border-color: #93C5FD;
        }

        /* Area Preview Kertas */
        .preview-header {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 1.1rem;
            font-weight: 800;
            color: var(--text-main);
            margin: 10px 0;
        }
        
        .mini-btn-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 10px;
        }
        .btn-mini {
            padding: 12px;
            border-radius: 8px;
            border: none;
            font-weight: 700;
            color: white;
            cursor: pointer;
            font-size: 0.9rem;
        }

        .petunjuk-geser {
            text-align: center;
            font-size: 0.8rem;
            font-weight: 700;
            color: #DC2626;
            background: #FEE2E2;
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 15px;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
        }

        /* MEJA VIRTUAL & KERTAS (Kunci UI/UX) */
        .meja-virtual {
            width: 100%;
            overflow-x: auto; /* Memungkinkan geser kiri kanan */
            background: #E2E8F0; /* Warna abu-abu ala meja */
            padding: 15px;
            border-radius: 12px;
            box-shadow: inset 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .kertas-laporan {
            background: white !important; /* WAJIB PUTIH WALAU MODE GELAP */
            color: black !important;      /* TEKS WAJIB HITAM */
            min-width: 850px; /* Ukuran asli kertas landscape */
            padding: 40px;
            border-radius: 5px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            margin: 0 auto;
            position: relative;
        }

        /* Tipografi & Tabel di Dalam Kertas */
        .kop-surat {
            display: flex;
            align-items: center;
            border-bottom: 3px solid black;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .kop-ikon {
            font-size: 3rem;
            color: #1E3A8A; /* Biru tua logo */
            margin-right: 20px;
        }
        .kop-teks h2 { margin: 0; font-size: 1.6rem; font-weight: 900; color: #1E3A8A; letter-spacing: 1px; }
        .kop-teks p { margin: 5px 0 0; font-size: 0.9rem; font-weight: 600; color: #333; }
        .kop-teks small { font-style: italic; color: #666; }

        .info-kertas {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            font-weight: 700;
            font-size: 1rem;
        }

        .tabel-rapi {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9rem;
        }
        .tabel-rapi th, .tabel-rapi td {
            border: 1px solid #94A3B8; /* Garis tipis rapi */
            padding: 12px 8px;
        }
        .tabel-rapi th {
            background: #F8FAFC !important; /* Header abu-abu bersih */
            color: black !important;
            font-weight: 800;
            text-align: center;
            vertical-align: middle;
        }
        .tabel-rapi td.center { text-align: center; font-weight: 600; }
        .tabel-rapi td.left { text-align: left; }
    </style>

    <div class="laporan-wrapper">
        
        <!-- 1. TOMBOL CETAK & UNDUH -->
        <div class="action-grid">
            <button class="btn-action btn-cetak" onclick="alert('Fitur Cetak segera dihubungkan!')"><i class="fas fa-print"></i> Cetak Dokumen</button>
            <button class="btn-action btn-unduh" onclick="alert('Fitur JPG segera dihubungkan!')"><i class="fab fa-whatsapp"></i> Unduh & WA (JPG)</button>
        </div>

        <!-- 2. KARTU FILTER -->
        <div class="filter-card">
            <div class="form-group">
                <label>Jenis Laporan</label>
                <select class="form-control-laporan" disabled>
                    <option>Rekap Absensi Kelas (Landscape)</option>
                </select>
            </div>
            <div class="form-group">
                <label>Pilih Kelas</label>
                <select class="form-control-laporan" id="laporanPilihKelas">
                    <option value="">-- Pilih Kelas --</option>
                    <option value="Kelas A">Kelas A</option>
                    <option value="Kelas B">Kelas B</option>
                </select>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
                <label>Bulan Laporan</label>
                <!-- Menampilkan bulan saat ini otomatis -->
                <input type="month" class="form-control-laporan" id="laporanBulan" value="${new Date().toISOString().slice(0,7)}">
            </div>
        </div>

        <!-- 3. AREA PREVIEW -->
        <div>
            <div class="preview-header">
                <i class="fas fa-file-invoice"></i> Kertas Laporan (Live)
            </div>
            
            <div class="mini-btn-grid">
                <button class="btn-mini" style="background: #F59E0B;"><i class="fas fa-sync-alt"></i> Putar Kertas</button>
                <button class="btn-mini" style="background: #5AA99A;"><i class="fas fa-edit"></i> Edit Catatan</button>
            </div>

            <div class="petunjuk-geser">
                <i class="fas fa-hand-point-up"></i> Geser kertas ke kiri/kanan untuk meninjau tabel
            </div>

            <!-- MEJA VIRTUAL YANG BISA DI-SCROLL -->
            <div class="meja-virtual">
                
                <!-- KERTAS ASLI (Ukurannya Tetap Besar) -->
                <div class="kertas-laporan" id="areaKertas">
                    
                    <!-- KOP SURAT -->
                    <div class="kop-surat">
                        <div class="kop-ikon"><i class="fas fa-book-reader"></i></div>
                        <div class="kop-teks">
                            <h2>RUMAH QUR'AN KAMILA</h2>
                            <p>Pusat Pendidikan & Tahfidz Al-Qur'an Anak</p>
                            <small>Mencetak Generasi Qur'ani yang Berakhlak Mulia</small>
                        </div>
                    </div>
                    
                    <!-- INFO KELAS -->
                    <div class="info-kertas">
                        <div>Kelas: <span id="lblKertasKelas">Belum dipilih</span></div>
                        <div>Bulan: <span id="lblKertasBulan">...</span></div>
                    </div>

                    <!-- TABEL -->
                    <table class="tabel-rapi">
                        <thead>
                            <tr>
                                <th rowspan="2" style="width: 5%;">No</th>
                                <th rowspan="2" style="width: 25%;">Nama Santri</th>
                                <th colspan="4">Kehadiran</th>
                                <th colspan="2">Capaian Terakhir</th>
                                <th rowspan="2" style="width: 15%;">Keterangan</th>
                            </tr>
                            <tr>
                                <th style="width: 7%;">H</th>
                                <th style="width: 7%;">I</th>
                                <th style="width: 7%;">S</th>
                                <th style="width: 7%;">A</th>
                                <th>Tahfidz</th>
                                <th>Tahsin</th>
                            </tr>
                        </thead>
                        <tbody id="tbodyKertas">
                            <tr>
                                <td colspan="9" class="center" style="padding: 30px; color: #64748B;">
                                    <i>Silakan pilih kelas terlebih dahulu untuk memuat data.</i>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <!-- TANDA TANGAN -->
                    <div style="margin-top: 50px; display: flex; justify-content: flex-end;">
                        <div style="text-align: center; width: 220px; color: black;">
                            <p style="margin-bottom: 70px;">Mengetahui,<br><b>Kepala Madrasah / Owner</b></p>
                            <p style="font-weight: bold; text-decoration: underline; margin: 0;">_______________________</p>
                        </div>
                    </div>

                </div> <!-- Akhir Kertas -->
            </div> <!-- Akhir Meja Virtual -->

        </div>
    </div>
    `;
};

export const initLaporan = () => {
    // Fungsi untuk memperbarui label di dalam kertas saat filter diganti
    const selectKelas = document.getElementById('laporanPilihKelas');
    const inputBulan = document.getElementById('laporanBulan');
    const lblKelas = document.getElementById('lblKertasKelas');
    const lblBulan = document.getElementById('lblKertasBulan');

    const updateLabel = () => {
        lblKelas.textContent = selectKelas.value || 'Belum dipilih';
        
        if (inputBulan.value) {
            // Ubah format "2026-07" menjadi "Juli 2026"
            const date = new Date(inputBulan.value + '-01');
            const namaBulan = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
            lblBulan.textContent = namaBulan;
        }
    };

    if(selectKelas) selectKelas.addEventListener('change', updateLabel);
    if(inputBulan) inputBulan.addEventListener('change', updateLabel);
    
    // Panggil sekali saat pertama kali dimuat
    updateLabel();
};
