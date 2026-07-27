/**
 * ==================================================
 * MODUL LAPORAN & RAPOR - VERSI 2 (PREMIUM UI + DB FIX)
 * File: js/laporan.js
 * ==================================================
 */
import { api } from './api.js'; // <-- INI KUNCI UTAMANYA YANG KETINGGALAN

export const renderLaporan = () => {
    return `
    <style>
        /* 1. LAYOUT UTAMA (Bisa discroll mulus) */
        .laporan-wrapper {
            display: flex;
            flex-direction: column;
            gap: 20px;
            padding-bottom: 90px;
            animation: fadeIn 0.4s ease-out;
        }

        /* 2. TOMBOL AKSI (Lebih Ramping & Elegan) */
        .action-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        .btn-action {
            padding: 12px 15px;
            border-radius: 12px;
            font-weight: 700;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            color: white;
            font-size: 0.9rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            transition: all 0.2s ease;
        }
        .btn-action:active { transform: scale(0.96); }
        .btn-cetak { background: linear-gradient(135deg, #334155, #1E293B); } 
        .btn-unduh { background: linear-gradient(135deg, #10B981, #059669); } 

        /* 3. KARTU FILTER (Modern Minimalis) */
        .filter-card {
            background: var(--surface);
            padding: 22px;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.04);
            border: 1px solid var(--border);
        }
        .form-group { margin-bottom: 16px; }
        .form-group:last-child { margin-bottom: 0; }
        .form-group label {
            display: block;
            font-size: 0.8rem;
            font-weight: 800;
            color: var(--text-muted);
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .form-control-laporan {
            width: 100%;
            padding: 12px 16px;
            border: 1.5px solid var(--border);
            border-radius: 10px;
            background: var(--bg-main);
            color: var(--text-main);
            font-size: 0.95rem;
            font-weight: 600;
            appearance: none;
            background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%22%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
            background-repeat: no-repeat;
            background-position: right 15px top 50%;
            background-size: 10px auto;
            transition: border-color 0.2s;
        }
        .form-control-laporan:focus {
            border-color: #3B82F6;
            outline: none;
        }

        /* 4. MEJA VIRTUAL & KERTAS F4 PRESISI */
        .preview-header {
            font-size: 1.1rem;
            font-weight: 800;
            color: var(--text-main);
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .petunjuk-geser {
            font-size: 0.75rem;
            font-weight: 700;
            color: #D97706;
            background: #FEF3C7;
            padding: 10px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 15px;
        }
        .meja-virtual {
            width: 100%;
            overflow-x: auto;
            background: #CBD5E1; 
            padding: 20px;
            border-radius: 12px;
            box-shadow: inset 0 3px 6px rgba(0,0,0,0.1);
        }
        
        .kertas-laporan {
            background: #FFFFFF !important;
            color: #000000 !important;
            margin: 0 auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            position: relative;
            box-sizing: border-box;
            width: 794px; 
            min-height: 1218px; 
            padding: 50px;
            display: flex;
            flex-direction: column;
            transition: all 0.3s ease;
        }
        .kertas-laporan.landscape {
            width: 1218px;
            min-height: 794px;
        }

        /* 5. ELEMEN DALAM KERTAS */
        .kop-surat {
            display: flex;
            align-items: center;
            border-bottom: 4px solid #1E3A8A;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }
        .kop-logo {
            width: 85px;
            height: 85px;
            object-fit: contain;
            margin-right: 20px;
        }
        .kop-teks h2 { margin: 0; font-size: 1.8rem; font-weight: 900; color: #1E3A8A; letter-spacing: 1px; }
        .kop-teks p { margin: 4px 0 0; font-size: 1rem; font-weight: 700; color: #333; }
        .kop-teks small { font-style: italic; color: #64748B; font-size: 0.85rem; }

        .info-kertas {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            font-weight: 700;
            font-size: 1.05rem;
        }

        .tabel-rapi {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.95rem;
            margin-bottom: auto; 
        }
        .tabel-rapi th, .tabel-rapi td {
            border: 1px solid #94A3B8;
            padding: 12px 10px;
        }
        .tabel-rapi th {
            background: #F1F5F9 !important;
            color: #0F172A !important;
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
            margin-bottom: 25px;
        }
        .box-nilai {
            padding: 20px 10px;
            border-radius: 10px;
            text-align: center;
            border: 2px solid transparent;
        }
        .box-nilai.hadir { background: #ECFDF5; border-color: #A7F3D0; }
        .box-nilai.izin { background: #FEF3C7; border-color: #FDE68A; }
        .box-nilai.alpa { background: #FEF2F2; border-color: #FECACA; }
        .box-nilai h4 { margin: 0; font-size: 0.9rem; color: #475569; text-transform: uppercase; font-weight: 800; }
        .box-nilai span { display: block; font-size: 2rem; font-weight: 900; margin-top: 8px; }

        .ttd-area {
            margin-top: 50px; 
            display: flex; 
            justify-content: space-between; 
            font-size: 0.95rem;
        }
        .ttd-box { text-align: center; width: 220px; color: black; }
        .ttd-box.hide { display: none; }
    </style>

    <div class="laporan-wrapper">
        <div class="action-grid">
            <button class="btn-action btn-cetak" id="btnCetakDokumen"><i class="fas fa-file-pdf"></i> Cetak / PDF</button>
            <button class="btn-action btn-unduh" id="btnKirimWa"><i class="fab fa-whatsapp"></i> Unduh & WA</button>
        </div>

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
            <div class="form-group">
                <label>Bulan Laporan</label>
                <input type="month" class="form-control-laporan" id="laporanBulan" value="${new Date().toISOString().slice(0,7)}">
            </div>
        </div>

        <div>
            <div class="preview-header"><i class="fas fa-file-signature"></i> Lembar Pratinjau Kertas F4</div>
            <div class="petunjuk-geser" id="petunjukGeser"><i class="fas fa-arrows-alt-h"></i> Geser kertas ke kiri/kanan untuk melihat tabel utuh</div>

            <div class="meja-virtual">
                <div class="kertas-laporan landscape" id="areaKertas">
                    <div class="kop-surat">
                        <img src="Logo Rq Kamila.jpg" alt="Logo RQ Kamila" class="kop-logo" onerror="this.style.display='none'">
                        <div class="kop-teks">
                            <h2>RUMAH QUR'AN KAMILA</h2>
                            <p>Pusat Pendidikan & Tahfidz Al-Qur'an Anak dan Remaja</p>
                            <small>Mencetak Generasi Qur'ani yang Beradab dan Berprestasi</small>
                        </div>
                    </div>
                    
                    <div class="info-kertas" id="infoKertasLandscape">
                        <div>Kelas: <span id="lblKertasKelas">Belum dipilih</span></div>
                        <div>Bulan: <span id="lblKertasBulan">...</span></div>
                    </div>
                    
                    <div class="info-kertas" id="infoKertasPortrait" style="display: none; flex-direction: column; gap: 8px;">
                        <div>Nama: <span id="lblRaporNama" style="font-weight: 800; font-size: 1.2rem; text-decoration: underline;">Belum dipilih</span></div>
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
                                    <th rowspan="2" style="width: 25%;">Nama Lengkap Santri</th>
                                    <th colspan="3">Data Kehadiran</th>
                                    <th colspan="2">Capaian Materi Terakhir</th>
                                    <th rowspan="2" style="width: 15%;">Catatan</th>
                                </tr>
                                <tr>
                                    <th style="width: 7%;">H</th>
                                    <th style="width: 7%;">S/I</th>
                                    <th style="width: 7%;">A</th>
                                    <th>Tahfidz (Hafalan)</th>
                                    <th>Tahsin (Membaca)</th>
                                </tr>
                            </thead>
                            <tbody id="tbodyKertas">
                                <tr><td colspan="8" class="center" style="padding: 40px; color: #94A3B8;">Pilih kelas untuk memuat data rekapitulasi.</td></tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- KONTEN PORTRAIT -->
                    <div id="kontenPortrait" style="display: none; flex-grow: 1;">
                        <h3 style="text-align: center; border-bottom: 2px solid #E2E8F0; padding-bottom: 10px; margin-bottom: 20px;">A. REKAPITULASI KEHADIRAN</h3>
                        <div class="box-rekap-individu">
                            <div class="box-nilai hadir">
                                <h4>Hadir</h4>
                                <span id="raporHadir" style="color: #059669;">0</span>
                            </div>
                            <div class="box-nilai izin">
                                <h4>Sakit/Izin</h4>
                                <span id="raporSakitIzin" style="color: #D97706;">0</span>
                            </div>
                            <div class="box-nilai alpa">
                                <h4>Alpa</h4>
                                <span id="raporAlpa" style="color: #DC2626;">0</span>
                            </div>
                        </div>
                        
                        <h3 style="text-align: center; border-bottom: 2px solid #E2E8F0; padding-bottom: 10px; margin-bottom: 20px;">B. PENCAPAIAN MATERI (MUTAKHIR)</h3>
                        <table class="tabel-rapi" style="margin-bottom: 30px;">
                            <thead>
                                <tr>
                                    <th style="width: 30%;">Program Pembelajaran</th>
                                    <th>Target Capaian Terakhir Bulan Ini</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style="font-weight: 800; text-align: center;">Tahfidz Al-Qur'an</td>
                                    <td id="raporTahfidz" class="center">-</td>
                                </tr>
                                <tr>
                                    <td style="font-weight: 800; text-align: center;">Tahsin / Qira'ah</td>
                                    <td id="raporTahsin" class="center">-</td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <h3 style="text-align: center; border-bottom: 2px solid #E2E8F0; padding-bottom: 10px; margin-bottom: 20px;">C. EVALUASI WALI KELAS</h3>
                        <div style="border: 2px dashed #CBD5E1; min-height: 100px; padding: 15px; border-radius: 8px; font-style: italic; color: #475569; font-size: 0.95rem; line-height: 1.5;" contenteditable="true" title="Klik untuk mengetik catatan">
                            "Ananda telah mengikuti kegiatan belajar dengan baik." (Klik untuk mengedit teks ini)
                        </div>
                    </div>
                    
                    <div class="ttd-area">
                        <div class="ttd-box hide" id="ttdOrtu">
                            <p style="margin-bottom: 80px;">Mengetahui,<br><b>Wali Santri</b></p>
                            <p style="font-weight: 800; text-decoration: underline; margin: 0;">_______________________</p>
                        </div>
                        <div class="ttd-box" style="margin-left: auto;">
                            <p style="margin-bottom: 80px;">Mengetahui,<br><b id="labelTtd">Kepala Madrasah</b></p>
                            <p style="font-weight: 800; text-decoration: underline; margin: 0;">_______________________</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
    `;
};

export const initLaporan = async () => {
    // 1. Injeksi Library PDF
    if (!window.html2pdf) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        document.head.appendChild(script);
    }

    const el = {
        jenis: document.getElementById('jenisLaporan'),
        kelas: document.getElementById('laporanPilihKelas'),
        santriGroup: document.getElementById('groupPilihSantri'),
        santri: document.getElementById('laporanPilihSantri'),
        bulan: document.getElementById('laporanBulan'),
        kertas: document.getElementById('areaKertas'),
        petunjuk: document.getElementById('petunjukGeser'),
        
        landscape: document.getElementById('kontenLandscape'),
        portrait: document.getElementById('kontenPortrait'),
        infoLand: document.getElementById('infoKertasLandscape'),
        infoPort: document.getElementById('infoKertasPortrait'),
        
        ttdOrtu: document.getElementById('ttdOrtu'),
        labelTtd: document.getElementById('labelTtd'),
        tbody: document.getElementById('tbodyKertas')
    };

    // 2. Load Daftar Kelas (Berdasarkan tabel kelas dari database Supabase Anda)
    try {
        const dataKelas = await api.get('kelas', 'select=nama_kelas');
        if(dataKelas && dataKelas.length > 0) {
            el.kelas.innerHTML = '<option value="">-- Pilih Kelas --</option>';
            dataKelas.forEach(k => el.kelas.add(new Option(k.nama_kelas, k.nama_kelas)));
        }
    } catch(e) { console.error("Gagal load kelas:", e); }

    // 3. Fungsi Ubah Orientasi & Visibilitas
    const switchMode = () => {
        const isPortrait = el.jenis.value === 'portrait';
        
        el.kertas.classList.toggle('landscape', !isPortrait);
        
        el.santriGroup.style.display = isPortrait ? 'block' : 'none';
        el.portrait.style.display = isPortrait ? 'block' : 'none';
        el.infoPort.style.display = isPortrait ? 'flex' : 'none';
        el.ttdOrtu.classList.toggle('hide', !isPortrait);
        
        el.landscape.style.display = isPortrait ? 'none' : 'block';
        el.infoLand.style.display = isPortrait ? 'none' : 'flex';
        el.petunjuk.style.display = isPortrait ? 'none' : 'block';
        
        el.labelTtd.textContent = isPortrait ? 'Wali Kelas / Ustadz' : 'Kepala Madrasah / Owner';
        
        loadDataLaporan();
    };

    // 4. Fungsi Utama Tarik Data DB
    const loadDataLaporan = async () => {
        const kelasVal = el.kelas.value;
        const bulanVal = el.bulan.value;
        
        document.getElementById('lblKertasKelas').textContent = kelasVal || 'Belum dipilih';
        document.getElementById('lblRaporKelas').textContent = kelasVal || 'Belum dipilih';

        if (bulanVal) {
            const namaBulan = new Date(bulanVal + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
            document.getElementById('lblKertasBulan').textContent = namaBulan;
            document.getElementById('lblRaporBulan').textContent = namaBulan;
        }

        const tglMulai = bulanVal + '-01';
        const tglSelesai = bulanVal + '-31';

        // === JIKA MODE LANDSCAPE ===
        if (el.jenis.value === 'landscape') {
            if (!kelasVal) {
                el.tbody.innerHTML = `<tr><td colspan="8" class="center" style="padding: 40px; color: #94A3B8;">Pilih kelas untuk memuat data.</td></tr>`;
                return;
            }

            el.tbody.innerHTML = `<tr><td colspan="8" class="center" style="padding: 40px;"><i class="fas fa-circle-notch fa-spin"></i> Sinkronisasi database...</td></tr>`;
            
            try {
                // Gunakan dapodik_santri & input_harian persis seperti di dashboard.js!
                const santriList = await api.get('dapodik_santri', `select=id,nama_santri,nama_kelas&nama_kelas=eq.${kelasVal}&order=nama_santri.asc`);
                if (!santriList || santriList.length === 0) {
                    el.tbody.innerHTML = `<tr><td colspan="8" class="center">Data santri kosong di kelas ini.</td></tr>`;
                    return;
                }

                const harianList = await api.get('input_harian', `select=*&nama_kelas=eq.${kelasVal}&tanggal=gte.${tglMulai}&tanggal=lte.${tglSelesai}`) || [];

                let html = '';
                santriList.forEach((s, idx) => {
                    const logs = harianList.filter(log => log.santri_id === s.id || log.nama_santri === s.nama_santri);
                    
                    const h = logs.filter(a => a.status_hadir === 'Hadir').length;
                    const si = logs.filter(a => a.status_hadir === 'Izin' || a.status_hadir === 'Sakit').length;
                    const a = logs.filter(a => a.status_hadir === 'Alpa').length;

                    // Mengambil riwayat mutakhir (terbaru)
                    logs.sort((x, y) => new Date(y.tanggal) - new Date(x.tanggal));
                    
                    let teksTahfidz = '-';
                    const lastTahfidz = logs.find(l => l.tahfidz_juz || l.tahfidz_surat);
                    if (lastTahfidz) teksTahfidz = `Juz ${lastTahfidz.tahfidz_juz || '-'} (${lastTahfidz.tahfidz_surat || '-'})`;

                    let teksTahsin = '-';
                    const lastTahsin = logs.find(l => l.tahsin_program || l.tahsin_jilid);
                    if (lastTahsin) {
                        if (lastTahsin.tahsin_program === "Al Qur'an") {
                            teksTahsin = `Juz ${lastTahsin.tahsin_juz || '-'} (${lastTahsin.tahsin_surat || '-'})`;
                        } else {
                            teksTahsin = `${lastTahsin.tahsin_program || 'Iqro'} ${lastTahsin.tahsin_jilid || '-'} Hal. ${lastTahsin.tahsin_halaman || '-'}`;
                        }
                    }

                    html += `
                        <tr>
                            <td class="center">${idx + 1}</td>
                            <td class="left" style="font-weight: 700;">${s.nama_santri}</td>
                            <td class="center" style="color: #059669; font-weight: 800;">${h}</td>
                            <td class="center" style="color: #D97706; font-weight: 800;">${si}</td>
                            <td class="center" style="color: #DC2626; font-weight: 800;">${a}</td>
                            <td class="center">${teksTahfidz}</td>
                            <td class="center">${teksTahsin}</td>
                            <td class="center"></td>
                        </tr>
                    `;
                });
                el.tbody.innerHTML = html;
            } catch (err) { 
                console.error(err);
                el.tbody.innerHTML = `<tr><td colspan="8" class="center" style="color: red;">Gagal terhubung ke database.</td></tr>`;
            }
        } 
        
        // === JIKA MODE PORTRAIT ===
        else if (el.jenis.value === 'portrait') {
            if (kelasVal) {
                try {
                    const santriKelas = await api.get('dapodik_santri', `select=id,nama_santri&nama_kelas=eq.${kelasVal}&order=nama_santri.asc`);
                    const curr = el.santri.value;
                    el.santri.innerHTML = '<option value="">-- Pilih Santri --</option>';
                    (santriKelas || []).forEach(s => {
                        const opt = new Option(s.nama_santri, s.id);
                        if (s.id == curr) opt.selected = true;
                        el.santri.add(opt);
                    });
                } catch(e) { console.error(e); }
            }

            const sId = el.santri.value;
            if (!sId) {
                document.getElementById('lblRaporNama').textContent = 'Pilih Santri Dulu';
                return;
            }
            const namaSantriAktif = el.santri.options[el.santri.selectedIndex].text;
            document.getElementById('lblRaporNama').textContent = namaSantriAktif;

            try {
                const logs = await api.get('input_harian', `select=*&nama_santri=eq.${namaSantriAktif}&tanggal=gte.${tglMulai}&tanggal=lte.${tglSelesai}`) || [];
                
                document.getElementById('raporHadir').textContent = logs.filter(a => a.status_hadir === 'Hadir').length;
                document.getElementById('raporSakitIzin').textContent = logs.filter(a => a.status_hadir === 'Izin' || a.status_hadir === 'Sakit').length;
                document.getElementById('raporAlpa').textContent = logs.filter(a => a.status_hadir === 'Alpa').length;

                // Mengambil riwayat mutakhir
                logs.sort((x, y) => new Date(y.tanggal) - new Date(x.tanggal));
                
                let teksTahfidz = '-';
                const lastTahfidz = logs.find(l => l.tahfidz_juz || l.tahfidz_surat);
                if (lastTahfidz) teksTahfidz = `Juz ${lastTahfidz.tahfidz_juz || '-'} (Surat ${lastTahfidz.tahfidz_surat || '-'})`;

                let teksTahsin = '-';
                const lastTahsin = logs.find(l => l.tahsin_program || l.tahsin_jilid);
                if (lastTahsin) {
                    if (lastTahsin.tahsin_program === "Al Qur'an") {
                        teksTahsin = `Juz ${lastTahsin.tahsin_juz || '-'} (Surat ${lastTahsin.tahsin_surat || '-'})`;
                    } else {
                        teksTahsin = `${lastTahsin.tahsin_program || 'Iqro'} Jilid ${lastTahsin.tahsin_jilid || '-'} Hal. ${lastTahsin.tahsin_halaman || '-'}`;
                    }
                }

                document.getElementById('raporTahfidz').textContent = teksTahfidz;
                document.getElementById('raporTahsin').textContent = teksTahsin;
            } catch(e) { console.error(e); }
        }
    };

    // 5. Event Listeners
    el.jenis.addEventListener('change', switchMode);
    el.kelas.addEventListener('change', loadDataLaporan);
    el.santri.addEventListener('change', loadDataLaporan);
    el.bulan.addEventListener('change', loadDataLaporan);

    // 6. FUNGSI GENERATE PDF
    const triggerPDF = (isWA = false) => {
        const isLandscape = el.jenis.value === 'landscape';
        const namaFile = isLandscape ? `Rekap_Kelas_${el.kelas.value || 'Kosong'}` : `Rapor_${document.getElementById('lblRaporNama').textContent.replace(/ /g, '_')}`;
        
        const opt = {
            margin:       [5, 5, 5, 5],
            filename:     `${namaFile}_${el.bulan.value}.pdf`,
            image:        { type: 'jpeg', quality: 1 },
            html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
            jsPDF:        { unit: 'mm', format: 'f4', orientation: isLandscape ? 'landscape' : 'portrait' }
        };

        if(window.html2pdf) {
            window.html2pdf().from(el.kertas).set(opt).save().then(() => {
                if(isWA) {
                    const msg = `Assalamu'alaikum,\n\nBerikut terlampir file PDF Laporan Perkembangan Rumah Qur'an Kamila.\n* Jenis: ${isLandscape ? 'Rekap Absensi Kelas' : 'Rapor Individu'}\n* Bulan: ${el.bulan.value}\n\n*(Catatan: File PDF telah otomatis diunduh ke HP Anda. Silakan lampirkan/kirimkan file tersebut ke ruang obrolan ini).*`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                }
            });
        } else {
            window.print();
        }
    };

    document.getElementById('btnCetakDokumen')?.addEventListener('click', () => triggerPDF(false));
    document.getElementById('btnKirimWa')?.addEventListener('click', () => triggerPDF(true));

    // Eksekusi awal
    switchMode();
};
