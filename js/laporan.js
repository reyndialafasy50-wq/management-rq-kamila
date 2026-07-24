/**
 * ==================================================
 * MODUL LAPORAN (REKAP KELAS & RAPOR INDIVIDU)
 * File: js/laporan.js
 * ==================================================
 */

export const renderLaporan = () => {
    return `
    <style>
        .laporan-wrapper {
            display: flex;
            flex-direction: column;
            gap: 20px;
            padding-bottom: 80px;
            animation: fadeIn 0.3s ease;
        }

        /* Tombol Cetak & Unduh Lebih Ramping & Estetik */
        .action-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }
        .btn-action {
            padding: 10px 16px;
            border-radius: 10px;
            font-weight: 700;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            color: white;
            font-size: 0.88rem;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            transition: transform 0.2s, opacity 0.2s;
        }
        .btn-action:active { transform: scale(0.97); }
        .btn-action:hover { opacity: 0.9; }
        .btn-cetak { background: #334155; } 
        .btn-unduh { background: #10B981; } 

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
            padding: 12px 14px;
            border: 1.5px solid #CBD5E1;
            border-radius: 10px;
            background: var(--bg-main);
            color: var(--text-main);
            font-size: 0.95rem;
            font-weight: 600;
            appearance: none;
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
        
        select#jenisLaporan {
            color: #3B82F6;
            background-color: rgba(59, 130, 246, 0.05);
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
            padding: 10px;
            border-radius: 8px;
            border: none;
            font-weight: 700;
            color: white;
            cursor: pointer;
            font-size: 0.85rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
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

        /* MEJA VIRTUAL & KERTAS */
        .meja-virtual {
            width: 100%;
            overflow-x: auto;
            background: #E2E8F0;
            padding: 15px;
            border-radius: 12px;
            box-shadow: inset 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .kertas-laporan {
            background: white !important;
            color: black !important;
            min-width: 850px;
            padding: 40px;
            border-radius: 5px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            margin: 0 auto;
            position: relative;
            transition: all 0.3s ease;
        }
        
        .kertas-laporan.portrait {
            min-width: unset;
            width: 600px;
            max-width: 100%;
        }

        .kop-surat {
            display: flex;
            align-items: center;
            border-bottom: 3px solid black;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .kop-ikon {
            font-size: 3rem;
            color: #1E3A8A;
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
            border: 1px solid #94A3B8;
            padding: 12px 8px;
        }
        .tabel-rapi th {
            background: #F8FAFC !important;
            color: black !important;
            font-weight: 800;
            text-align: center;
            vertical-align: middle;
        }
        .tabel-rapi td.center { text-align: center; font-weight: 600; }
        .tabel-rapi td.left { text-align: left; }
        
        .box-rekap-individu {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 20px;
        }
        .box-nilai {
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #E2E8F0;
        }
        .box-nilai.hadir { background: #ECFDF5; border-color: #10B981; }
        .box-nilai.izin { background: #FEF3C7; border-color: #F59E0B; }
        .box-nilai.alpa { background: #FEF2F2; border-color: #EF4444; }
        .box-nilai h4 { margin: 0; font-size: 0.85rem; color: #475569; text-transform: uppercase; }
        .box-nilai span { display: block; font-size: 1.5rem; font-weight: 800; margin-top: 5px; }

        /* CSS KHUSUS CETAK (Print Mode) */
        @media print {
            body * { visibility: hidden; }
            #areaKertas, #areaKertas * { visibility: visible; }
            #areaKertas {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                box-shadow: none;
                margin: 0;
                padding: 20px;
            }
            .meja-virtual { background: white; padding: 0; box-shadow: none; }
        }
    </style>

    <div class="laporan-wrapper">
        
        <!-- 1. TOMBOL CETAK & UNDUH (Dibuat Lebih Ramping) -->
        <div class="action-grid">
            <button class="btn-action btn-cetak" id="btnCetakDokumen"><i class="fas fa-print"></i> Cetak Dokumen</button>
            <button class="btn-action btn-unduh" id="btnKirimWa"><i class="fab fa-whatsapp"></i> Kirim WhatsApp</button>
        </div>

        <!-- 2. KARTU FILTER -->
        <div class="filter-card">
            <div class="form-group">
                <label>Jenis Laporan</label>
                <select class="form-control-laporan" id="jenisLaporan">
                    <option value="landscape">Rekap Absensi Kelas (Landscape)</option>
                    <option value="portrait">Rapor Individu (Portrait)</option>
                </select>
            </div>
            <div class="form-group">
                <label>Pilih Kelas</label>
                <select class="form-control-laporan" id="laporanPilihKelas">
                    <option value="">-- Pilih Kelas --</option>
                </select>
            </div>
            
            <div class="form-group" id="groupPilihSantri" style="display: none;">
                <label>Pilih Santri</label>
                <select class="form-control-laporan" id="laporanPilihSantri">
                    <option value="">-- Pilih Santri --</option>
                </select>
            </div>
            
            <div class="form-group" style="margin-bottom: 0;">
                <label>Bulan Laporan</label>
                <input type="month" class="form-control-laporan" id="laporanBulan" value="${new Date().toISOString().slice(0,7)}">
            </div>
        </div>

        <!-- 3. AREA PREVIEW -->
        <div>
            <div class="preview-header">
                <i class="fas fa-file-invoice"></i> Kertas Laporan (Live)
            </div>
            
            <div class="mini-btn-grid">
                <button class="btn-mini" id="btnPutarKertas" style="background: #F59E0B;"><i class="fas fa-sync-alt"></i> Putar Kertas</button>
                <button class="btn-mini" id="btnSimpanCatatan" style="background: #5AA99A;"><i class="fas fa-save"></i> Simpan Catatan</button>
            </div>

            <div class="petunjuk-geser" id="petunjukGeser">
                <i class="fas fa-hand-point-up"></i> Geser kertas ke kiri/kanan untuk meninjau tabel
            </div>

            <!-- MEJA VIRTUAL -->
            <div class="meja-virtual">
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
                    <div class="info-kertas" id="infoKertasLandscape">
                        <div>Kelas: <span id="lblKertasKelas">Belum dipilih</span></div>
                        <div>Bulan: <span id="lblKertasBulan">...</span></div>
                    </div>
                    
                    <!-- INFO SANTRI -->
                    <div class="info-kertas" id="infoKertasPortrait" style="display: none; flex-direction: column; gap: 5px;">
                        <div>Nama: <span id="lblRaporNama" style="font-weight: 800; font-size: 1.1rem; border-bottom: 1px dotted black;">Belum dipilih</span></div>
                        <div style="display: flex; justify-content: space-between;">
                            <div>Kelas: <span id="lblRaporKelas">...</span></div>
                            <div>Bulan: <span id="lblRaporBulan">...</span></div>
                        </div>
                    </div>

                    <!-- KONTEN LANDSCAPE -->
                    <div id="kontenLandscape">
                        <table class="tabel-rapi">
                            <thead>
                                <tr>
                                    <th rowspan="2" style="width: 5%;">No</th>
                                    <th rowspan="2" style="width: 30%;">Nama Santri</th>
                                    <th colspan="3">Kehadiran</th>
                                    <th colspan="2">Capaian Terakhir</th>
                                    <th rowspan="2" style="width: 15%;">Keterangan</th>
                                </tr>
                                <tr>
                                    <th style="width: 7%;" title="Hadir">H</th>
                                    <th style="width: 8%;" title="Sakit / Izin">S/I</th>
                                    <th style="width: 7%;" title="Alpa">A</th>
                                    <th>Tahfidz</th>
                                    <th>Tahsin</th>
                                </tr>
                            </thead>
                            <tbody id="tbodyKertas">
                                <tr>
                                    <td colspan="8" class="center" style="padding: 30px; color: #64748B;">
                                        <i>Silakan pilih kelas terlebih dahulu untuk memuat data.</i>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- KONTEN PORTRAIT -->
                    <div id="kontenPortrait" style="display: none;">
                        <h3 style="text-align: center; border-bottom: 2px solid #E2E8F0; padding-bottom: 10px; margin-bottom: 15px;">A. REKAPITULASI KEHADIRAN</h3>
                        <div class="box-rekap-individu">
                            <div class="box-nilai hadir">
                                <h4>Hadir</h4>
                                <span id="raporHadir" style="color: #10B981;">0</span>
                            </div>
                            <div class="box-nilai izin">
                                <h4>Sakit/Izin</h4>
                                <span id="raporSakitIzin" style="color: #F59E0B;">0</span>
                            </div>
                            <div class="box-nilai alpa">
                                <h4>Alpa</h4>
                                <span id="raporAlpa" style="color: #EF4444;">0</span>
                            </div>
                        </div>
                        
                        <h3 style="text-align: center; border-bottom: 2px solid #E2E8F0; padding-bottom: 10px; margin-bottom: 15px;">B. CAPAIAN MATERI (MUTAKHIR)</h3>
                        <table class="tabel-rapi">
                            <thead>
                                <tr>
                                    <th style="width: 30%;">Materi</th>
                                    <th>Jilid/Juz & Halaman/Surat (Terakhir)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style="font-weight: bold;">Tahfidz</td>
                                    <td id="raporTahfidz" class="center">-</td>
                                </tr>
                                <tr>
                                    <td style="font-weight: bold;">Tahsin</td>
                                    <td id="raporTahsin" class="center">-</td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <h3 style="text-align: center; border-bottom: 2px solid #E2E8F0; padding-bottom: 10px; margin-bottom: 15px; margin-top: 25px;">C. CATATAN EVALUASI</h3>
                        <div id="catatanEvaluasiBox" style="border: 1px solid #94A3B8; min-height: 80px; padding: 10px; border-radius: 5px; font-style: italic; color: #475569;" contenteditable="true">
                            (Ketik catatan evaluasi khusus untuk ananda di sini...)
                        </div>
                    </div>
                    
                    <!-- TANDA TANGAN -->
                    <div style="margin-top: 40px; display: flex; justify-content: space-between; font-size: 0.9rem;">
                        <div style="text-align: center; width: 220px; color: black; display: none;" id="ttdOrtu">
                            <p style="margin-bottom: 70px;">Mengetahui,<br><b>Orang Tua / Wali</b></p>
                            <p style="font-weight: bold; text-decoration: underline; margin: 0;">_______________________</p>
                        </div>
                        
                        <div style="text-align: center; width: 220px; color: black; margin-left: auto;">
                            <p style="margin-bottom: 70px;">Mengetahui,<br><b id="labelTtd">Kepala Madrasah</b></p>
                            <p style="font-weight: bold; text-decoration: underline; margin: 0;">_______________________</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
    `;
};

export const initLaporan = async () => {
    const jenisLaporan = document.getElementById('jenisLaporan');
    const selectKelas = document.getElementById('laporanPilihKelas');
    const groupSantri = document.getElementById('groupPilihSantri');
    const selectSantri = document.getElementById('laporanPilihSantri');
    const inputBulan = document.getElementById('laporanBulan');
    
    const kertas = document.getElementById('areaKertas');
    const petunjukGeser = document.getElementById('petunjukGeser');
    
    const kontenLandscape = document.getElementById('kontenLandscape');
    const kontenPortrait = document.getElementById('kontenPortrait');
    const infoLandscape = document.getElementById('infoKertasLandscape');
    const infoPortrait = document.getElementById('infoKertasPortrait');
    const ttdOrtu = document.getElementById('ttdOrtu');
    const labelTtd = document.getElementById('labelTtd');

    // Load Daftar Kelas Dari Database
    try {
        if(window.api && window.api.get) {
            const dataSantri = await window.api.get('dapodik_santri', 'select=kelas');
            if(dataSantri && dataSantri.length > 0) {
                const kelasUnik = [...new Set(dataSantri.map(item => item.kelas))].sort();
                selectKelas.innerHTML = '<option value="">-- Pilih Kelas --</option>';
                kelasUnik.forEach(k => {
                    if(k) {
                        const opt = document.createElement('option');
                        opt.value = k;
                        opt.textContent = k;
                        selectKelas.appendChild(opt);
                    }
                });
            }
        }
    } catch(e) {
        console.error("Gagal memuat kelas:", e);
    }

    const updateJenisKertas = () => {
        if (jenisLaporan.value === 'portrait') {
            kertas.classList.add('portrait');
            groupSantri.style.display = 'block';
            kontenLandscape.style.display = 'none';
            infoLandscape.style.display = 'none';
            kontenPortrait.style.display = 'block';
            infoPortrait.style.display = 'flex';
            ttdOrtu.style.display = 'block';
            labelTtd.textContent = 'Wali Kelas / Guru';
            petunjukGeser.style.display = 'none';
        } else {
            kertas.classList.remove('portrait');
            groupSantri.style.display = 'none';
            kontenLandscape.style.display = 'block';
            infoLandscape.style.display = 'flex';
            kontenPortrait.style.display = 'none';
            infoPortrait.style.display = 'none';
            ttdOrtu.style.display = 'none';
            labelTtd.textContent = 'Kepala Madrasah / Owner';
            petunjukGeser.style.display = 'flex';
        }
        muatDataLaporan();
    };

    const muatDataLaporan = async () => {
        const kelasVal = selectKelas.value;
        const bulanVal = inputBulan.value;
        
        const lblKertasKelas = document.getElementById('lblKertasKelas');
        const lblKertasBulan = document.getElementById('lblKertasBulan');
        const lblRaporKelas = document.getElementById('lblRaporKelas');
        const lblRaporBulan = document.getElementById('lblRaporBulan');
        const lblRaporNama = document.getElementById('lblRaporNama');

        lblKertasKelas.textContent = kelasVal || 'Belum dipilih';
        lblRaporKelas.textContent = kelasVal || 'Belum dipilih';

        if (bulanVal) {
            const date = new Date(bulanVal + '-01');
            const namaBulan = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
            lblKertasBulan.textContent = namaBulan;
            lblRaporBulan.textContent = namaBulan;
        }

        if (!window.api || !window.api.get) return;

        // JIKA LANDSCAPE: REKAP KELAS
        if (jenisLaporan.value === 'landscape') {
            const tbody = document.getElementById('tbodyKertas');
            if (!kelasVal) {
                tbody.innerHTML = `<tr><td colspan="8" class="center" style="padding: 30px; color: #64748B;"><i>Silakan pilih kelas terlebih dahulu.</i></td></tr>`;
                return;
            }

            try {
                tbody.innerHTML = `<tr><td colspan="8" class="center" style="padding: 20px;">Memuat data dari database...</td></tr>`;
                
                // Ambil santri berdasarkan kelas
                const santriList = await window.api.get('dapodik_santri', `select=id,nama_santri&kelas=eq.${kelasVal}&order=nama_santri.asc`);
                
                if (!santriList || santriList.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="8" class="center" style="padding: 20px; color: #64748B;">Tidak ada santri di kelas ini.</td></tr>`;
                    return;
                }

                // Ambil rekap absensi & mutabaah bulan terkait jika ada
                // (Mengambil absensi berdasarkan rentang bulan)
                const tglMulai = bulanVal + '-01';
                const tglSelesai = bulanVal + '-31';
                
                let absensiList = [];
                try {
                    absensiList = await window.api.get('absensi_harian', `select=santri_id,status&tanggal=gte.${tglMulai}&tanggal=lte.${tglSelesai}`);
                } catch(err) { absensiList = []; }

                let mutabaahList = [];
                try {
                    mutabaahList = await window.api.get('mutabaah', `select=santri_id,materi,jilid_juz,halaman_surat&tanggal=gte.${tglMulai}&tanggal=lte.${tglSelesai}&order=tanggal.desc`);
                } catch(err) { mutabaahList = []; }

                let html = '';
                santriList.forEach((s, idx) => {
                    // Hitung H, S/I, A dari absensiList
                    const absSantri = absensiList.filter(a => a.santri_id == s.id);
                    const hadirCount = absSantri.filter(a => a.status === 'Hadir' || a.status === 'H').length;
                    const siCount = absSantri.filter(a => a.status === 'Sakit' || a.status === 'Izin' || a.status === 'S/I').length;
                    const alpaCount = absSantri.filter(a => a.status === 'Alpa' || a.status === 'A').length;

                    // Capaian Terakhir
                    const mutTahfidz = mutabaahList.find(m => m.santri_id == s.id && m.materi === 'Tahfidz');
                    const mutTahsin = mutabaahList.find(m => m.santri_id == s.id && m.materi === 'Tahsin');

                    const strTahfidz = mutTahfidz ? `${mutTahfidz.jilid_juz || ''} - ${mutTahfidz.halaman_surat || ''}` : '-';
                    const strTahsin = mutTahsin ? `${mutTahsin.jilid_juz || ''} - ${mutTahsin.halaman_surat || ''}` : '-';

                    html += `
                        <tr>
                            <td class="center">${idx + 1}</td>
                            <td class="left">${s.nama_santri}</td>
                            <td class="center" style="color: #10B981; font-weight: bold;">${hadirCount}</td>
                            <td class="center" style="color: #F59E0B; font-weight: bold;">${siCount}</td>
                            <td class="center" style="color: #EF4444; font-weight: bold;">${alpaCount}</td>
                            <td class="center">${strTahfidz}</td>
                            <td class="center">${strTahsin}</td>
                            <td class="center">-</td>
                        </tr>
                    `;
                });
                tbody.innerHTML = html;

            } catch (err) {
                console.error("Gagal memuat rekap kelas:", err);
                tbody.innerHTML = `<tr><td colspan="8" class="center" style="color: red;">Gagal memuat data dari server.</td></tr>`;
            }
        } 
        
        // JIKA PORTRAIT: RAPOR INDIVIDU
        else if (jenisLaporan.value === 'portrait') {
            if (kelasVal) {
                try {
                    const santriKelas = await window.api.get('dapodik_santri', `select=id,nama_santri&kelas=eq.${kelasVal}&order=nama_santri.asc`);
                    const currentSelectedId = selectSantri.value;
                    selectSantri.innerHTML = '<option value="">-- Pilih Santri --</option>';
                    if (santriKelas) {
                        santriKelas.forEach(s => {
                            const opt = document.createElement('option');
                            opt.value = s.id;
                            opt.textContent = s.nama_santri;
                            if (s.id == currentSelectedId) opt.selected = true;
                            selectSantri.appendChild(opt);
                        });
                    }
                } catch(e) { console.error(e); }
            }

            const santriId = selectSantri.value;
            if (!santriId) {
                lblRaporNama.textContent = 'Belum dipilih';
                document.getElementById('raporHadir').textContent = '0';
                document.getElementById('raporSakitIzin').textContent = '0';
                document.getElementById('raporAlpa').textContent = '0';
                document.getElementById('raporTahfidz').textContent = '-';
                document.getElementById('raporTahsin').textContent = '-';
                return;
            }

            lblRaporNama.textContent = selectSantri.options[selectSantri.selectedIndex].text;

            try {
                const tglMulai = bulanVal + '-01';
                const tglSelesai = bulanVal + '-31';

                // Ambil absensi individu
                const absensi = await window.api.get('absensi_harian', `select=status&santri_id=eq.${santriId}&tanggal=gte.${tglMulai}&tanggal=lte.${tglSelesai}`);
                const h = absensi.filter(a => a.status === 'Hadir' || a.status === 'H').length;
                const si = absensi.filter(a => a.status === 'Sakit' || a.status === 'Izin' || a.status === 'S/I').length;
                const a = absensi.filter(a => a.status === 'Alpa' || a.status === 'A').length;

                document.getElementById('raporHadir').textContent = h;
                document.getElementById('raporSakitIzin').textContent = si;
                document.getElementById('raporAlpa').textContent = a;

                // Ambil mutabaah individu
                const mutabaah = await window.api.get('mutabaah', `select=materi,jilid_juz,halaman_surat&santri_id=eq.${santriId}&tanggal=gte.${tglMulai}&tanggal=lte.${tglSelesai}&order=tanggal.desc`);
                
                const mTahfidz = mutabaah.find(m => m.materi === 'Tahfidz');
                const mTahsin = mutabaah.find(m => m.materi === 'Tahsin');

                document.getElementById('raporTahfidz').textContent = mTahfidz ? `${mTahfidz.jilid_juz || ''} - ${mTahfidz.halaman_surat || ''}` : 'Belum ada catatan';
                document.getElementById('raporTahsin').textContent = mTahsin ? `${mTahsin.jilid_juz || ''} - ${mTahsin.halaman_surat || ''}` : 'Belum ada catatan';

            } catch (err) {
                console.error("Gagal memuat rapor individu:", err);
            }
        }
    };

    // Event Listeners
    if (jenisLaporan) jenisLaporan.addEventListener('change', updateJenisKertas);
    if (selectKelas) selectKelas.addEventListener('change', muatDataLaporan);
    if (selectSantri) selectSantri.addEventListener('change', muatDataLaporan);
    if (inputBulan) inputBulan.addEventListener('change', muatDataLaporan);

    // Tombol Putar Kertas (Simulasi Toggle Landscape/Portrait)
    const btnPutar = document.getElementById('btnPutarKertas');
    if (btnPutar) {
        btnPutar.addEventListener('click', () => {
            jenisLaporan.value = jenisLaporan.value === 'landscape' ? 'portrait' : 'landscape';
            updateJenisKertas();
        });
    }

    // Tombol Simpan Catatan
    const btnSimpanCatatan = document.getElementById('btnSimpanCatatan');
    if (btnSimpanCatatan) {
        btnSimpanCatatan.addEventListener('click', () => {
            alert('Catatan evaluasi berhasil disimpan secara lokal pada dokumen.');
        });
    }

    // Tombol Cetak (Hidup)
    const btnCetak = document.getElementById('btnCetakDokumen');
    if (btnCetak) {
        btnCetak.addEventListener('click', () => {
            window.print();
        });
    }

    // Tombol Kirim WhatsApp (Hidup)
    const btnWa = document.getElementById('btnKirimWa');
    if (btnWa) {
        btnWa.addEventListener('click', () => {
            const jenis = jenisLaporan.value;
            const kelas = selectKelas.value || 'Semua Kelas';
            const bulan = inputBulan.value;
            
            let pesan = `Assalamu'alaikum, berikut laporan perkembangan Rumah Qur'an Kamila:\n\n* Jenis: ${jenis === 'landscape' ? 'Rekap Absensi Kelas' : 'Rapor Individu'}\n* Kelas: ${kelas}\n* Bulan: ${bulan}\n\nSilakan cek dokumen fisik/digital resmi yang telah diterbitkan. Terima kasih.`;
            
            const encoded = encodeURIComponent(pesan);
            window.open(`https://wa.me/?text=${encoded}`, '_blank');
        });
    }

    // Inisialisasi awal
    updateJenisKertas();
};
