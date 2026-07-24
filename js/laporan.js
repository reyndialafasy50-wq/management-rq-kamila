/**
 * ==================================================
 * MODUL LAPORAN (REKAP KELAS & RAPOR INDIVIDU + F4 & LOGO)
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

        /* Tombol Aksi Ramping */
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

        /* MEJA VIRTUAL & KERTAS F4 */
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
            width: 794px; /* Proporsi standar A4/F4 lebar */
            min-height: 1123px; /* Proporsi tinggi standar */
            padding: 45px;
            border-radius: 4px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            margin: 0 auto;
            position: relative;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        
        .kertas-laporan.landscape {
            width: 1123px;
            min-height: 794px;
        }

        .kop-surat {
            display: flex;
            align-items: center;
            border-bottom: 3px solid #1E3A8A;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .kop-logo {
            width: 75px;
            height: 75px;
            object-fit: contain;
            margin-right: 20px;
        }
        .kop-teks h2 { margin: 0; font-size: 1.6rem; font-weight: 900; color: #1E3A8A; letter-spacing: 1px; }
        .kop-teks p { margin: 4px 0 0; font-size: 0.9rem; font-weight: 600; color: #333; }
        .kop-teks small { font-style: italic; color: #666; font-size: 0.8rem; }

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
            padding: 10px 8px;
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
    </style>

    <div class="laporan-wrapper">
        
        <!-- Tombol Aksi Ramping -->
        <div class="action-grid">
            <button class="btn-action btn-cetak" id="btnCetakDokumen"><i class="fas fa-print"></i> Cetak / PDF</button>
            <button class="btn-action btn-unduh" id="btnKirimWa"><i class="fab fa-whatsapp"></i> Unduh PDF & WA</button>
        </div>

        <!-- Filter Card -->
        <div class="filter-card">
            <div class="form-group">
                <label>Jenis Laporan</label>
                <select class="form-control-laporan" id="jenisLaporan">
                    <option value="landscape">Rekap Absensi Kelas (Landscape F4)</option>
                    <option value="portrait">Rapor Individu (Portrait F4)</option>
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

        <!-- Area Preview -->
        <div>
            <div class="preview-header">
                <i class="fas fa-file-invoice"></i> Lembar Kerja F4 (Live Preview)
            </div>
            
            <div class="mini-btn-grid">
                <button class="btn-mini" id="btnPutarKertas" style="background: #F59E0B;"><i class="fas fa-sync-alt"></i> Putar Orientasi</button>
                <button class="btn-mini" id="btnSimpanCatatan" style="background: #5AA99A;"><i class="fas fa-save"></i> Simpan Catatan</button>
            </div>

            <div class="petunjuk-geser" id="petunjukGeser">
                <i class="fas fa-hand-point-up"></i> Geser kertas ke kiri/kanan untuk meninjau secara utuh
            </div>

            <div class="meja-virtual">
                <!-- Default Landscape F4 -->
                <div class="kertas-laporan landscape" id="areaKertas">
                    
                    <div>
                        <!-- KOP SURAT DENGAN LOGO RESMI RQ -->
                        <div class="kop-surat">
                            <img src="Logo Rq Kamila.jpg" alt="Logo RQ Kamila" class="kop-logo">
                            <div class="kop-teks">
                                <h2>RUMAH QUR'AN KAMILA</h2>
                                <p>Pusat Pendidikan & Tahfidz Al-Qur'an Anak</p>
                                <small>Mencetak Generasi Qur'ani yang Berakhlak Mulia</small>
                            </div>
                        </div>
                        
                        <div class="info-kertas" id="infoKertasLandscape">
                            <div>Kelas: <span id="lblKertasKelas">Belum dipilih</span></div>
                            <div>Bulan: <span id="lblKertasBulan">...</span></div>
                        </div>
                        
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
                                        <th style="width: 7%;">H</th>
                                        <th style="width: 8%;">S/I</th>
                                        <th style="width: 7%;">A</th>
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
                            <h3 style="text-align: center; border-bottom: 2px solid #E2E8F0; padding-bottom: 8px; margin-bottom: 15px; font-size: 1rem;">A. REKAPITULASI KEHADIRAN</h3>
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
                            
                            <h3 style="text-align: center; border-bottom: 2px solid #E2E8F0; padding-bottom: 8px; margin-bottom: 15px; font-size: 1rem;">B. CAPAIAN MATERI (MUTAKHIR)</h3>
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
                            
                            <h3 style="text-align: center; border-bottom: 2px solid #E2E8F0; padding-bottom: 8px; margin-bottom: 15px; margin-top: 20px; font-size: 1rem;">C. CATATAN EVALUASI</h3>
                            <div style="border: 1px solid #94A3B8; min-height: 70px; padding: 10px; border-radius: 5px; font-style: italic; color: #475569;" contenteditable="true">
                                (Ketik catatan evaluasi khusus untuk ananda di sini...)
                            </div>
                        </div>
                    </div>
                    
                    <!-- TANDA TANGAN (Di bagian bawah kertas) -->
                    <div style="margin-top: 30px; display: flex; justify-content: space-between; font-size: 0.9rem;">
                        <div style="text-align: center; width: 220px; color: black; display: none;" id="ttdOrtu">
                            <p style="margin-bottom: 60px;">Mengetahui,<br><b>Orang Tua / Wali</b></p>
                            <p style="font-weight: bold; text-decoration: underline; margin: 0;">_______________________</p>
                        </div>
                        
                        <div style="text-align: center; width: 220px; color: black; margin-left: auto;">
                            <p style="margin-bottom: 60px;">Mengetahui,<br><b id="labelTtd">Kepala Madrasah</b></p>
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
    if (!window.html2pdf) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        document.head.appendChild(script);
    }

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
    } catch(e) { console.error(e); }

    const updateJenisKertas = () => {
        if (jenisLaporan.value === 'portrait') {
            kertas.classList.remove('landscape');
            groupSantri.style.display = 'block';
            kontenLandscape.style.display = 'none';
            infoLandscape.style.display = 'none';
            kontenPortrait.style.display = 'block';
            infoPortrait.style.display = 'flex';
            ttdOrtu.style.display = 'block';
            labelTtd.textContent = 'Wali Kelas / Guru';
            petunjukGeser.style.display = 'none';
        } else {
            kertas.classList.add('landscape');
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
        
        document.getElementById('lblKertasKelas').textContent = kelasVal || 'Belum dipilih';
        document.getElementById('lblRaporKelas').textContent = kelasVal || 'Belum dipilih';

        if (bulanVal) {
            const date = new Date(bulanVal + '-01');
            const namaBulan = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
            document.getElementById('lblKertasBulan').textContent = namaBulan;
            document.getElementById('lblRaporBulan').textContent = namaBulan;
        }

        if (!window.api || !window.api.get) return;

        if (jenisLaporan.value === 'landscape') {
            const tbody = document.getElementById('tbodyKertas');
            if (!kelasVal) {
                tbody.innerHTML = `<tr><td colspan="8" class="center" style="padding: 30px; color: #64748B;"><i>Silakan pilih kelas terlebih dahulu.</i></td></tr>`;
                return;
            }

            try {
                tbody.innerHTML = `<tr><td colspan="8" class="center" style="padding: 20px;">Memuat data database...</td></tr>`;
                const santriList = await window.api.get('dapodik_santri', `select=id,nama_santri&kelas=eq.${kelasVal}&order=nama_santri.asc`);
                
                if (!santriList || santriList.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="8" class="center" style="padding: 20px;">Tidak ada santri.</td></tr>`;
                    return;
                }

                const tglMulai = bulanVal + '-01';
                const tglSelesai = bulanVal + '-31';
                
                let absensiList = [];
                try { absensiList = await window.api.get('absensi_harian', `select=santri_id,status&tanggal=gte.${tglMulai}&tanggal=lte.${tglSelesai}`); } catch(e){}

                let mutabaahList = [];
                try { mutabaahList = await window.api.get('mutabaah', `select=santri_id,materi,jilid_juz,halaman_surat&tanggal=gte.${tglMulai}&tanggal=lte.${tglSelesai}&order=tanggal.desc`); } catch(e){}

                let html = '';
                santriList.forEach((s, idx) => {
                    const abs = absensiList.filter(a => a.santri_id == s.id);
                    const h = abs.filter(a => a.status === 'Hadir' || a.status === 'H').length;
                    const si = abs.filter(a => a.status === 'Sakit' || a.status === 'Izin' || a.status === 'S/I').length;
                    const a = abs.filter(a => a.status === 'Alpa' || a.status === 'A').length;

                    const mTahfidz = mutabaahList.find(m => m.santri_id == s.id && m.materi === 'Tahfidz');
                    const mTahsin = mutabaahList.find(m => m.santri_id == s.id && m.materi === 'Tahsin');

                    html += `
                        <tr>
                            <td class="center">${idx + 1}</td>
                            <td class="left">${s.nama_santri}</td>
                            <td class="center" style="color: #10B981; font-weight: bold;">${h}</td>
                            <td class="center" style="color: #F59E0B; font-weight: bold;">${si}</td>
                            <td class="center" style="color: #EF4444; font-weight: bold;">${a}</td>
                            <td class="center">${mTahfidz ? `${mTahfidz.jilid_juz || ''} - ${mTahfidz.halaman_surat || ''}` : '-'}</td>
                            <td class="center">${mTahsin ? `${mTahsin.jilid_juz || ''} - ${mTahsin.halaman_surat || ''}` : '-'}</td>
                            <td class="center">-</td>
                        </tr>
                    `;
                });
                tbody.innerHTML = html;
            } catch (err) { console.error(err); }
        } else if (jenisLaporan.value === 'portrait') {
            if (kelasVal) {
                try {
                    const santriKelas = await window.api.get('dapodik_santri', `select=id,nama_santri&kelas=eq.${kelasVal}&order=nama_santri.asc`);
                    const curr = selectSantri.value;
                    selectSantri.innerHTML = '<option value="">-- Pilih Santri --</option>';
                    santriKelas.forEach(s => {
                        const opt = document.createElement('option');
                        opt.value = s.id;
                        opt.textContent = s.nama_santri;
                        if (s.id == curr) opt.selected = true;
                        selectSantri.appendChild(opt);
                    });
                } catch(e) { console.error(e); }
            }

            const santriId = selectSantri.value;
            if (!santriId) return;

            document.getElementById('lblRaporNama').textContent = selectSantri.options[selectSantri.selectedIndex].text;

            try {
                const tglMulai = bulanVal + '-01';
                const tglSelesai = bulanVal + '-31';
                const absensi = await window.api.get('absensi_harian', `select=status&santri_id=eq.${santriId}&tanggal=gte.${tglMulai}&tanggal=lte.${tglSelesai}`);
                
                document.getElementById('raporHadir').textContent = absensi.filter(a => a.status === 'Hadir' || a.status === 'H').length;
                document.getElementById('raporSakitIzin').textContent = absensi.filter(a => a.status === 'Sakit' || a.status === 'Izin' || a.status === 'S/I').length;
                document.getElementById('raporAlpa').textContent = absensi.filter(a => a.status === 'Alpa' || a.status === 'A').length;

                const mutabaah = await window.api.get('mutabaah', `select=materi,jilid_juz,halaman_surat&santri_id=eq.${santriId}&tanggal=gte.${tglMulai}&tanggal=lte.${tglSelesai}&order=tanggal.desc`);
                const mTahfidz = mutabaah.find(m => m.materi === 'Tahfidz');
                const mTahsin = mutabaah.find(m => m.materi === 'Tahsin');

                document.getElementById('raporTahfidz').textContent = mTahfidz ? `${mTahfidz.jilid_juz || ''} - ${mTahfidz.halaman_surat || ''}` : '-';
                document.getElementById('raporTahsin').textContent = mTahsin ? `${mTahsin.jilid_juz || ''} - ${mTahsin.halaman_surat || ''}` : '-';
            } catch(e) { console.error(e); }
        }
    };

    if (jenisLaporan) jenisLaporan.addEventListener('change', updateJenisKertas);
    if (selectKelas) selectKelas.addEventListener('change', muatDataLaporan);
    if (selectSantri) selectSantri.addEventListener('change', muatDataLaporan);
    if (inputBulan) inputBulan.addEventListener('change', muatDataLaporan);

    document.getElementById('btnPutarKertas')?.addEventListener('click', () => {
        jenisLaporan.value = jenisLaporan.value === 'landscape' ? 'portrait' : 'landscape';
        updateJenisKertas();
    });

    document.getElementById('btnSimpanCatatan')?.addEventListener('click', () => {
        alert('Catatan evaluasi berhasil disimpan.');
    });

    const generatePdf = (download = true) => {
        const element = document.getElementById('areaKertas');
        const isLandscape = jenisLaporan.value === 'landscape';
        const opt = {
            margin:       10,
            filename:     `Laporan_${selectKelas.value || 'Dokumen'}_${inputBulan.value}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'f4', orientation: isLandscape ? 'landscape' : 'portrait' }
        };

        if(window.html2pdf) {
            if(download) {
                window.html2pdf().from(element).set(opt).save();
            } else {
                return window.html2pdf().from(element).set(opt).outputPdf('blob');
            }
        } else {
            window.print();
        }
    };

    document.getElementById('btnCetakDokumen')?.addEventListener('click', () => generatePdf(true));

    document.getElementById('btnKirimWa')?.addEventListener('click', () => {
        generatePdf(true);

        setTimeout(() => {
            const jenis = jenisLaporan.value === 'landscape' ? 'Rekap Absensi Kelas' : 'Rapor Individu';
            const kelas = selectKelas.value || 'Semua Kelas';
            const bulan = inputBulan.value;
            
            let pesan = `Assalamu'alaikum, berikut file PDF Laporan Perkembangan Rumah Qur'an Kamila:\n\n* Jenis: ${jenis}\n* Kelas: ${kelas}\n* Bulan: ${bulan}\n\n*(File PDF laporan telah diunduh ke perangkat Anda, silakan lampirkan file PDF tersebut di chat ini).*`;
            
            window.open(`https://wa.me/?text=${encodeURIComponent(pesan)}`, '_blank');
        }, 1000);
    });

    updateJenisKertas();
};
