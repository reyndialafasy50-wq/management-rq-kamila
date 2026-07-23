/**
 * ==================================================
 * BAGIAN 10: MODUL LAPORAN & RAPOR (TAHAP 1 - UI)
 * File: js/laporan.js
 * ==================================================
 */
import { api } from './api.js';

export function renderLaporan() {
    return `
        <style>
            /* 1. TOMBOL AKSI ATAS */
            .action-header { display: flex; gap: 10px; margin-bottom: 20px; }
            .btn-action { flex: 1; padding: 12px; border-radius: 10px; font-weight: 700; color: white; border: none; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 8px; font-size: 0.95rem; transition: 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
            .btn-action:active { transform: scale(0.96); }
            .btn-print { background: #334155; } /* Warna Navy Gelap */
            .btn-wa { background: #10B981; } /* Warna Hijau WA */

            /* 2. KARTU FILTER PENCARIAN */
            .filter-card { background: var(--surface); padding: 20px; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 5px 15px rgba(0,0,0,0.03); margin-bottom: 25px; }
            .form-group { margin-bottom: 15px; }
            .form-group:last-child { margin-bottom: 0; }
            .form-group label { display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px; }
            .form-group select { width: 100%; padding: 12px 15px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg-main); color: var(--text-main); font-size: 0.95rem; font-weight: 600; outline: none; appearance: none; }
            .form-group select:focus { border-color: var(--primary); }

            /* 3. KONTROL KERTAS */
            .preview-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
            .preview-title h4 { margin: 0; font-size: 1.1rem; color: var(--text-main); font-weight: 800; display: flex; align-items: center; gap: 8px; }
            .paper-controls { display: flex; gap: 10px; margin-bottom: 10px; }
            .btn-control { flex: 1; padding: 10px; border-radius: 8px; font-weight: 700; color: white; border: none; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 6px; font-size: 0.85rem; }
            .btn-rotate { background: #F59E0B; } /* Orange */
            .btn-edit { background: #75B5B0; } /* Tosca Muda */

            /* 4. AREA KERTAS A4 (SELALU TERANG MESKI DARK MODE) */
            .paper-scroll-wrapper { width: 100%; overflow-x: auto; background: #E2E8F0; padding: 20px 10px; border-radius: 12px; margin-bottom: 30px; box-shadow: inset 0 3px 6px rgba(0,0,0,0.05); }
            .paper-landscape { background: #FFFFFF; width: 1000px; min-height: 700px; margin: 0 auto; padding: 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.15); color: #1E293B; font-family: 'Arial', sans-serif; position: relative; }
            
            /* KOP SURAT */
            .kop-surat { display: flex; align-items: center; justify-content: center; gap: 15px; border-bottom: 3px solid #1E293B; padding-bottom: 15px; margin-bottom: 20px; }
            .kop-surat i { font-size: 3rem; color: #1E3A8A; }
            .kop-teks { text-align: center; }
            .kop-teks h2 { margin: 0; font-size: 1.6rem; color: #1E3A8A; font-weight: 900; letter-spacing: 1px; }
            .kop-teks p { margin: 3px 0 0 0; font-size: 0.85rem; color: #475569; font-weight: 600; }
            .kop-teks span { display: block; font-size: 0.75rem; color: #64748B; font-style: italic; }

            /* IDENTITAS KELAS */
            .laporan-title { text-align: center; font-size: 1.1rem; font-weight: 800; text-transform: uppercase; margin-bottom: 20px; letter-spacing: 1px; }
            .identitas-grid { display: grid; grid-template-columns: 120px 15px 1fr; gap: 4px; font-size: 0.85rem; font-weight: 700; margin-bottom: 20px; color: #334155; }
            
            /* TABEL RAPOR */
            .table-rapor { width: 100%; border-collapse: collapse; font-size: 0.75rem; margin-bottom: 40px; }
            .table-rapor th, .table-rapor td { border: 1px solid #94A3B8; padding: 8px 6px; text-align: center; vertical-align: middle; }
            .table-rapor th { background: #F8FAFC; font-weight: 800; color: #1E293B; }
            .table-rapor td.td-nama { text-align: left; font-weight: 700; }
            
            /* FOOTER TTD */
            .ttd-area { display: flex; justify-content: flex-end; text-align: center; font-size: 0.85rem; margin-top: 40px; padding-right: 20px;}
            .ttd-box { width: 200px; }
            .ttd-box p { margin: 0 0 5px 0; color: #334155;}
            .ttd-box .nama-ustadz { margin-top: 60px; font-weight: 800; text-decoration: underline; color: #1E293B;}
        </style>

        <!-- TOMBOL AKSI -->
        <div class="action-header">
            <button class="btn-action btn-print" onclick="alert('Fitur cetak PDF segera hadir di Tahap 3!')"><i class="fas fa-print"></i> Cetak Dokumen</button>
            <button class="btn-action btn-wa" onclick="alert('Fitur Unduh & WA (JPG) segera hadir di Tahap 3!')"><i class="fab fa-whatsapp"></i> Unduh & WA (JPG)</button>
        </div>

        <!-- FILTER LAPORAN -->
        <div class="filter-card">
            <div class="form-group">
                <label>Jenis Laporan</label>
                <select style="color: #3B82F6; background: rgba(59, 130, 246, 0.05); border-color: rgba(59,130,246,0.3);">
                    <option value="landscape">Rekap Absensi Kelas (Landscape)</option>
                    <option value="portrait" disabled>Rapor Individu (Portrait) - Segera</option>
                </select>
            </div>
            <div class="form-group">
                <label>Pilih Kelas</label>
                <select id="lapPilihKelas">
                    <option value="">-- Pilih Kelas --</option>
                </select>
            </div>
            <div class="form-group">
                <label>Bulan Laporan</label>
                <select id="lapPilihBulan">
                    <!-- Diisi otomatis via JS -->
                </select>
            </div>
        </div>

        <!-- KONTROL KERTAS -->
        <div class="preview-title">
            <h4><i class="fas fa-file-alt"></i> Kertas Laporan (Live)</h4>
        </div>
        <div class="paper-controls">
            <button class="btn-control btn-rotate"><i class="fas fa-sync-alt"></i> Putar Kertas</button>
            <button class="btn-control btn-edit"><i class="fas fa-edit"></i> Edit Catatan</button>
        </div>
        <p style="text-align:center; font-size:0.75rem; color:#EF4444; font-weight:700; background:#FEE2E2; padding:5px; border-radius:6px; margin-bottom:15px;">
            <i class="fas fa-hand-pointer"></i> Geser kertas ke kiri/kanan untuk meninjau tabel
        </p>

        <!-- AREA KERTAS PREVIEW -->
        <div class="paper-scroll-wrapper">
            <div class="paper-landscape" id="areaKertas">
                
                <!-- KOP SURAT -->
                <div class="kop-surat">
                    <i class="fas fa-book-reader"></i>
                    <div class="kop-teks">
                        <h2>RUMAH QUR'AN KAMILA</h2>
                        <p>Pusat Pendidikan & Tahfidz Al-Qur'an Anak dan Remaja</p>
                        <span>Mencetak Generasi Qur'ani yang Beradab dan Berprestasi</span>
                    </div>
                </div>

                <div class="laporan-title">REKAPITULASI KELAS BINAAN</div>

                <div class="identitas-grid">
                    <div>Nama Kelas</div><div>:</div><div id="lblNamaKelas">[PILIH KELAS]</div>
                    <div>Ustadz Pengampu</div><div>:</div><div id="lblUstadz">Abu Nusa</div>
                    <div>Bulan Laporan</div><div>:</div><div id="lblBulan">Juli 2026</div>
                </div>

                <!-- TABEL DATA -->
                <table class="table-rapor">
                    <thead>
                        <tr>
                            <th rowspan="2" style="width:30px;">No</th>
                            <th rowspan="2" style="width:160px;">Nama Lengkap Santri</th>
                            <th colspan="3">Data Kehadiran</th>
                            <th colspan="3">Capaian Tahfidz (Hafalan)</th>
                            <th colspan="3">Capaian Tahsin (Membaca)</th>
                            <th rowspan="2" style="width:80px;">Darsah (Terakhir)</th>
                            <th colspan="2">Grafik Nilai</th>
                            <th rowspan="2" style="width:100px;">Catatan Terakhir</th>
                        </tr>
                        <tr>
                            <th style="width:25px;">H</th><th style="width:25px;">I/S</th><th style="width:25px;">A</th>
                            <th style="width:40px;">Juz</th><th style="width:70px;">Surat</th><th style="width:40px;">Ayat</th>
                            <th style="width:50px;">Kategori</th><th style="width:50px;">Srt/Jilid</th><th style="width:40px;">Ayt/Hal</th>
                            <th style="width:35px;">Lulus</th><th style="width:35px;">Ulang</th>
                        </tr>
                    </thead>
                    <tbody id="tabelRekapBody">
                        <!-- Data Dummy Sementara -->
                        <tr>
                            <td>1</td>
                            <td class="td-nama">AISYAH HANUM HANANIA</td>
                            <td style="color:#10B981; font-weight:bold;">1</td>
                            <td>0</td>
                            <td>0</td>
                            <td>-</td><td>-</td><td>-</td>
                            <td>Iqro</td><td>Jilid 4</td><td>-</td>
                            <td>-</td>
                            <td style="color:#10B981; font-weight:bold;">-</td>
                            <td style="color:#EF4444; font-weight:bold;">1x</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td class="td-nama">ZILFANA ALULA MAFAZA</td>
                            <td style="color:#10B981; font-weight:bold;">1</td>
                            <td>0</td>
                            <td>0</td>
                            <td>30</td><td>An-Naba'</td><td>1-15</td>
                            <td>-</td><td>-</td><td>-</td>
                            <td>Tauhid</td>
                            <td style="color:#10B981; font-weight:bold;">1x</td>
                            <td style="color:#EF4444; font-weight:bold;">-</td>
                            <td>Makin lancar, Masyaallah</td>
                        </tr>
                    </tbody>
                </table>

                <!-- TANDA TANGAN -->
                <div class="ttd-area">
                    <div class="ttd-box">
                        <p id="lblTglTtd">Purbalingga, 23 Juli 2026</p>
                        <p>Pengampu Kelas</p>
                        <div class="nama-ustadz" id="lblTtdUstadz">Abu Nusa</div>
                    </div>
                </div>

            </div>
        </div>
    `;
}

export async function initLaporan() {
    // 1. Isi Dropdown Bulan Laporan (Otomatis generate bulan ini & bulan sebelumnya)
    const elBulan = document.getElementById('lapPilihBulan');
    const date = new Date();
    const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    
    let htmlBulan = '';
    for(let i = 0; i < 3; i++) {
        let d = new Date(date.getFullYear(), date.getMonth() - i, 1);
        let val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        let label = `${namaBulan[d.getMonth()]} ${d.getFullYear()}`;
        htmlBulan += `<option value="${val}">${label}</option>`;
    }
    elBulan.innerHTML = htmlBulan;

    // 2. Tarik Data Kelas dari Database
    const elKelas = document.getElementById('lapPilihKelas');
    try {
        const kelasList = await api.get('kelas', 'select=nama_kelas,nama_ustadz');
        if (kelasList && kelasList.length > 0) {
            let htmlKelas = '<option value="">-- Pilih Kelas --</option>';
            kelasList.forEach(k => {
                // Simpan nama ustadz di atribut data agar mudah ditarik nanti
                htmlKelas += `<option value="${k.nama_kelas}" data-ustadz="${k.nama_ustadz || 'Abu Nusa'}">${k.nama_kelas}</option>`;
            });
            elKelas.innerHTML = htmlKelas;
        }
    } catch(err) {
        console.error("Gagal memuat kelas", err);
    }

    // 3. Efek Live Update (Mengubah teks di kertas saat dropdown dipilih)
    elKelas.addEventListener('change', (e) => {
        const selectedOpt = e.target.options[e.target.selectedIndex];
        document.getElementById('lblNamaKelas').textContent = e.target.value || '[PILIH KELAS]';
        document.getElementById('lblUstadz').textContent = selectedOpt.getAttribute('data-ustadz') || '-';
        document.getElementById('lblTtdUstadz').textContent = selectedOpt.getAttribute('data-ustadz') || 'Abu Nusa';
        
        // Pemicu untuk memuat data database (Akan kita kerjakan di Tahap 2)
        // fetchLaporanDatabase(e.target.value, elBulan.value);
    });

    elBulan.addEventListener('change', (e) => {
        const txtBulan = e.target.options[e.target.selectedIndex].text;
        document.getElementById('lblBulan').textContent = txtBulan;
        // fetchLaporanDatabase(elKelas.value, e.target.value);
    });

    // Set default label bulan saat pertama dimuat
    document.getElementById('lblBulan').textContent = elBulan.options[elBulan.selectedIndex].text;
    }
