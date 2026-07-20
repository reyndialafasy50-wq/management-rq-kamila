/**
 * ==================================================
 * BAGIAN 9: MODUL INPUT HARIAN SUPER (One-Stop Input)
 * File: js/input_harian.js
 * ==================================================
 */
import { api } from './api.js';

// ==========================================
// SIMULASI ROLE (Ganti untuk testing: 'admin' / 'guru')
const currentUserRole = 'guru'; 
// ==========================================

// DATABASE MAPPING JUZ KE SURAT (Presisi 100%)
const namaSurat = [
    "", "Al-Fatihah", "Al-Baqarah", "Ali 'Imran", "An-Nisa'", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Taubah", "Yunus", "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra'", "Al-Kahf", "Maryam", "Taha", "Al-Anbiya'", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Asy-Syu'ara'", "An-Naml", "Al-Qasas", "Al-'Ankabut", "Ar-Rum", "Luqman", "As-Sajdah", "Al-Ahzab", "Saba'", "Fatir", "Yasin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir", "Fussilat", "Asy-Syura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jasiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf", "Az-Zariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadilah", "Al-Hasyr", "Al-Mumtahanah", "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Tagabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij", "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddassir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba'", "An-Nazi'at", "'Abasa", "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Insyiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Gasyiyah", "Al-Fajr", "Al-Balad", "Asy-Syams", "Al-Lail", "Ad-Duha", "Asy-Syarh", "At-Tin", "Al-'Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-'Adiyat", "Al-Qari'ah", "At-Takasur", "Al-'Asr", "Al-Humazah", "Al-Fil", "Quraisy", "Al-Ma'un", "Al-Kausar", "Al-Kafirun", "An-Nasr", "Al-Lahab", "Al-Ikhlas", "Al-Falaq", "An-Nas"
];

const petaJuz = {
    1: [1,2], 2: [2], 3: [2,3], 4: [3,4], 5: [4], 6: [4,5], 7: [5,6], 8: [6,7], 9: [7,8], 10: [8,9],
    11: [9,10,11], 12: [11,12], 13: [12,13,14], 14: [15,16], 15: [17,18], 16: [18,19,20], 17: [21,22], 18: [23,24,25], 19: [25,26,27], 20: [27,28,29],
    21: [29,30,31,32,33], 22: [33,34,35,36], 23: [36,37,38,39], 24: [39,40,41], 25: [41,42,43,44,45],
    26: [46,47,48,49,50,51], 27: [51,52,53,54,55,56,57], 28: [58,59,60,61,62,63,64,65,66], 29: [67,68,69,70,71,72,73,74,75,76,77],
    30: Array.from({length: 37}, (_, i) => i + 78) // 78 sampai 114
};

export function renderInputHarian() {
    return `
        <style>
            .input-table-container { overflow-x: auto; background: var(--surface); border-radius: 12px; border: 1px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 20px;}
            .table-input { width: 100%; min-width: 1200px; border-collapse: collapse; font-size: 0.85rem; }
            .table-input th { background: var(--hover-bg); padding: 12px; text-align: left; font-weight: 600; color: var(--text-main); border-bottom: 2px solid var(--border); }
            .table-input td { padding: 12px; border-bottom: 1px solid var(--border); vertical-align: top; }
            .table-input tr:hover { background: #fdfdfd; }
            
            /* Radio Button Custom untuk Absen */
            .absen-radio { display: none; }
            .absen-label { display: inline-block; width: 32px; height: 32px; line-height: 32px; text-align: center; border-radius: 50%; font-weight: bold; cursor: pointer; transition: 0.2s; background: #eee; color: #999; margin-right: 5px; }
            .absen-radio[value="H"]:checked + .absen-label { background: #10B981; color: white; box-shadow: 0 2px 6px rgba(16, 185, 129, 0.4); } /* Hadir = Hijau */
            .absen-radio[value="I"]:checked + .absen-label { background: #3B82F6; color: white; box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4); } /* Izin = Biru */
            .absen-radio[value="S"]:checked + .absen-label { background: #F59E0B; color: white; box-shadow: 0 2px 6px rgba(245, 158, 11, 0.4); } /* Sakit = Kuning */
            .absen-radio[value="A"]:checked + .absen-label { background: #EF4444; color: white; box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4); } /* Alfa = Merah */
            
            /* Input Compact */
            .compact-input { padding: 6px 8px; border: 1px solid var(--border); border-radius: 6px; font-size: 0.8rem; width: 100%; outline: none; transition: 0.2s; }
            .compact-input:focus { border-color: var(--primary); }
            .input-group { display: flex; gap: 5px; margin-top: 5px; }
            .w-50 { width: 50px; } .w-70 { width: 70px; } .w-100 { width: 100px; }
            
            .row-disabled { opacity: 0.4; pointer-events: none; background: #f9f9f9 !important; }
            
            /* Toggle Lulus/Lanjut */
            .toggle-status { padding: 6px 12px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.75rem; width: 100%; margin-top: 5px;}
            .btn-lulus { background: #D1FAE5; color: #065F46; }
            .btn-ulang { background: #FEE2E2; color: #991B1B; }
        </style>

        <div style="background: var(--surface); padding: 20px; border-radius: 16px; margin-bottom: 20px; border: 1px solid var(--border);">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
                <div>
                    <h4 style="margin: 0; font-size: 1.1rem; color: var(--text-main);"><i class="fas fa-clipboard-check text-primary"></i> Input Harian Cerdas</h4>
                    <p style="margin: 3px 0 0; font-size: 0.8rem; color: var(--text-muted);">Satu form untuk absen, tahsin, dan tahfidz secara otomatis.</p>
                </div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <input type="date" id="inputTanggal" class="modern-input" style="padding: 8px 12px; border-radius: 8px;">
                    <select id="selectKelasInput" class="modern-input" style="padding: 8px 12px; border-radius: 8px; min-width: 150px;">
                        <option value="">Pilih Kelas...</option>
                    </select>
                    <button class="btn-primary" id="btnMulaiMengajar"><i class="fas fa-play"></i> Mulai</button>
                </div>
            </div>
        </div>

        <div id="areaInput" style="display: none;">
            <div class="input-table-container">
                <table class="table-input">
                    <thead>
                        <tr>
                            <th style="width: 200px;">Data Santri</th>
                            <th style="width: 160px; text-align: center;">Kehadiran</th>
                            <th style="width: 300px;">Tahsin / Qiroati</th>
                            <th style="width: 300px;">Hafalan / Tahfidz</th>
                            <th>Catatan Khusus</th>
                        </tr>
                    </thead>
                    <tbody id="tbodyInputHarian">
                        <!-- Data akan di-render di sini oleh JavaScript -->
                    </tbody>
                </table>
            </div>

            <button id="btnSimpanJurnal" class="btn-primary" style="width: 100%; justify-content: center; padding: 15px; font-size: 1rem; border-radius: 12px; margin-bottom: 30px;">
                <i class="fas fa-save" style="font-size: 1.2rem;"></i> SIMPAN JURNAL HARI INI
            </button>
        </div>
    `;
}

export async function initInputHarian() {
    // 1. SET TANGGAL HARI INI OTOMATIS
    document.getElementById('inputTanggal').valueAsDate = new Date();

    // 2. LOAD DAFTAR KELAS
    const selectKelas = document.getElementById('selectKelasInput');
    try {
        const kelasData = await api.get('kelas', 'select=*');
        selectKelas.innerHTML = '<option value="">Pilih Kelas...</option>';
        kelasData.forEach(k => {
            selectKelas.innerHTML += `<option value="${k.nama_kelas}">${k.nama_kelas}</option>`;
        });
        
        // Auto-select kelas pertama jika role Guru (Simulasi)
        if(currentUserRole === 'guru' && kelasData.length > 0) {
            selectKelas.value = kelasData[0].nama_kelas; 
        }
    } catch(err) { console.error("Gagal load kelas"); }

    // 3. MULAI MENGAJAR (LOAD SANTRI)
    document.getElementById('btnMulaiMengajar').addEventListener('click', async () => {
        const namaKelas = selectKelas.value;
        const tanggal = document.getElementById('inputTanggal').value;
        if(!namaKelas || !tanggal) return alert("Pilih kelas dan tanggal terlebih dahulu!");

        const btn = document.getElementById('btnMulaiMengajar');
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Loading...`;

        try {
            // Ambil santri di kelas tersebut
            const santriData = await api.get('dapodik_santri', `select=*&nama_kelas=eq.${encodeURIComponent(namaKelas)}&order=nama_santri.asc`);
            
            if(santriData.length === 0) {
                alert("Tidak ada santri di kelas ini.");
                document.getElementById('areaInput').style.display = 'none';
                return;
            }

            renderTabelInput(santriData);
            document.getElementById('areaInput').style.display = 'block';

        } catch(error) {
            alert("Gagal memuat data santri.");
        } finally {
            btn.innerHTML = `<i class="fas fa-play"></i> Mulai`;
        }
    });

    // 4. RENDER TABEL (Dinamis & Pintar)
    function renderTabelInput(santriList) {
        const tbody = document.getElementById('tbodyInputHarian');
        let html = '';

        santriList.forEach(s => {
            // ==========================================
            // SIMULASI AUTO-PREDICT (INGATAN SISTEM)
            // Di sistem asli, ini nge-fetch data dari Supabase hari sebelumnya.
            // Kita simulasikan data kemarin untuk menunjukkan logicnya berjalan.
            // ==========================================
            const memory = {
                tahsinMapel: "Iqro", // Atau 'Ummi', 'Al Qur\'an'
                tahsinJilid: 3,
                tahsinHal: 15 + 1, // Auto-lanjut 1 halaman dari kemarin
                tahfidzJuz: 30,
                tahfidzSurat: 78, // An-Naba
                tahfidzAyatAwal: 1,
                tahfidzAyatAkhir: 10
            };

            const fotoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(s.nama_santri)}&background=F0DCD7&color=4F567D`;

            html += `
            <tr id="row_${s.id}">
                <!-- INFO SANTRI -->
                <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <img src="${fotoUrl}" style="width:36px; height:36px; border-radius:50%;">
                        <div>
                            <div style="font-weight:bold; font-size:0.9rem;">${s.nama_santri}</div>
                            <div style="font-size:0.75rem; color:var(--text-muted);">NIS: ${s.nis || '-'}</div>
                        </div>
                    </div>
                </td>

                <!-- KEHADIRAN (Default Hadir) -->
                <td style="text-align:center;">
                    <div style="display:inline-flex;">
                        <input type="radio" name="absen_${s.id}" id="h_${s.id}" value="H" class="absen-radio absen-trigger" data-id="${s.id}" checked>
                        <label for="h_${s.id}" class="absen-label" title="Hadir">H</label>
                        
                        <input type="radio" name="absen_${s.id}" id="i_${s.id}" value="I" class="absen-radio absen-trigger" data-id="${s.id}">
                        <label for="i_${s.id}" class="absen-label" title="Izin">I</label>
                        
                        <input type="radio" name="absen_${s.id}" id="s_${s.id}" value="S" class="absen-radio absen-trigger" data-id="${s.id}">
                        <label for="s_${s.id}" class="absen-label" title="Sakit">S</label>
                        
                        <input type="radio" name="absen_${s.id}" id="a_${s.id}" value="A" class="absen-radio absen-trigger" data-id="${s.id}">
                        <label for="a_${s.id}" class="absen-label" title="Alfa">A</label>
                    </div>
                </td>

                <!-- TAHSIN (Dinamis) -->
                <td id="tahsin_col_${s.id}">
                    <select class="compact-input tahsin-mapel-trigger" id="tahsin_mapel_${s.id}" data-id="${s.id}">
                        <option value="Iqro" ${memory.tahsinMapel==='Iqro'?'selected':''}>Iqro</option>
                        <option value="Ummi" ${memory.tahsinMapel==='Ummi'?'selected':''}>Ummi</option>
                        <option value="Al Qur'an" ${memory.tahsinMapel==='Al Qur\'an'?'selected':''}>Al Qur'an</option>
                    </select>
                    
                    <!-- Area Iqro/Ummi -->
                    <div id="tahsin_buku_area_${s.id}" class="input-group" style="display: ${memory.tahsinMapel !== 'Al Qur\'an' ? 'flex' : 'none'};">
                        <input type="number" id="t_jilid_${s.id}" class="compact-input w-50" placeholder="Jilid" value="${memory.tahsinJilid}" title="Jilid">
                        <input type="number" id="t_hal_${s.id}" class="compact-input w-50" placeholder="Hal" value="${memory.tahsinHal}" title="Halaman">
                        <button class="toggle-status btn-lulus" id="btn_tahsin_stat_${s.id}" onclick="toggleStatus(this)" data-status="Lulus" style="margin-top:0;">Lulus</button>
                    </div>

                    <!-- Area Al Qur'an -->
                    <div id="tahsin_quran_area_${s.id}" style="display: ${memory.tahsinMapel === 'Al Qur\'an' ? 'block' : 'none'};">
                        <div class="input-group">
                            <select id="t_q_juz_${s.id}" class="compact-input w-70 trigger-juz" data-target="t_q_surat_${s.id}">
                                ${generateJuzOptions(1)}
                            </select>
                            <select id="t_q_surat_${s.id}" class="compact-input">
                                <!-- Diisi JS -->
                            </select>
                        </div>
                        <div class="input-group">
                            <input type="number" id="t_q_ayatawal_${s.id}" class="compact-input w-50" placeholder="Ayat"> s/d
                            <input type="number" id="t_q_ayatakhir_${s.id}" class="compact-input w-50" placeholder="Ayat">
                            <button class="toggle-status btn-lulus" id="btn_t_q_stat_${s.id}" onclick="toggleStatus(this)" data-status="Lanjut" style="margin-top:0;">Lanjut</button>
                        </div>
                    </div>
                </td>

                <!-- TAHFIDZ -->
                <td id="tahfidz_col_${s.id}">
                    <div class="input-group">
                        <select id="h_juz_${s.id}" class="compact-input w-70 trigger-juz" data-target="h_surat_${s.id}">
                            ${generateJuzOptions(memory.tahfidzJuz)}
                        </select>
                        <select id="h_surat_${s.id}" class="compact-input">
                             <!-- Diisi JS -->
                        </select>
                    </div>
                    <div class="input-group">
                        <input type="number" id="h_ayatawal_${s.id}" class="compact-input w-50" placeholder="Awal" value="${memory.tahfidzAyatAwal}"> s/d
                        <input type="number" id="h_ayatakhir_${s.id}" class="compact-input w-50" placeholder="Akhir" value="${memory.tahfidzAyatAkhir}">
                        <button class="toggle-status btn-lulus" id="btn_h_stat_${s.id}" onclick="toggleStatus(this)" data-status="Lanjut" style="margin-top:0;">Lanjut</button>
                    </div>
                </td>

                <!-- CATATAN -->
                <td>
                    <textarea id="catatan_${s.id}" class="compact-input" style="height:60px; resize:none;" placeholder="Tulis catatan opsional..."></textarea>
                </td>
            </tr>
            `;
        });

        tbody.innerHTML = html;

        // Inisialisasi logika dinamis setelah HTML tertanam
        initLogikaDinamis();
    }

    // Fungsi Pembantu Toggle Status (Lulus/Ulang)
    window.toggleStatus = (btn) => {
        if(btn.getAttribute('data-status') === 'Lulus' || btn.getAttribute('data-status') === 'Lanjut') {
            btn.setAttribute('data-status', 'Ulang');
            btn.textContent = 'Ulang';
            btn.className = 'toggle-status btn-ulang';
        } else {
            // Kembali ke Lulus/Lanjut tergantung ID tombolnya (jika id ada kata 'tahsin_stat' berarti iqro, dsb)
            const isQuran = btn.id.includes('t_q') || btn.id.includes('h_stat');
            const targetText = isQuran ? 'Lanjut' : 'Lulus';
            btn.setAttribute('data-status', targetText);
            btn.textContent = targetText;
            btn.className = 'toggle-status btn-lulus';
        }
    };

    function generateJuzOptions(selectedJuz) {
        let opt = '';
        for(let i=1; i<=30; i++) {
            opt += `<option value="${i}" ${i === selectedJuz ? 'selected' : ''}>Juz ${i}</option>`;
        }
        return opt;
    }

    // KEKUATAN UTAMA: LOGIKA DINAMIS & CASCADING DROPDOWN
    function initLogikaDinamis() {
        // 1. Anti-Klik Absensi
        document.querySelectorAll('.absen-trigger').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const id = e.target.getAttribute('data-id');
                const val = e.target.value;
                const colTahsin = document.getElementById(`tahsin_col_${id}`);
                const colTahfidz = document.getElementById(`tahfidz_col_${id}`);
                const colCatatan = document.getElementById(`catatan_${id}`);

                if (val !== 'H') {
                    // Jika Tidak Hadir, disable/redupkan kolom
                    colTahsin.classList.add('row-disabled');
                    colTahfidz.classList.add('row-disabled');
                    colCatatan.placeholder = `Catatan (${val === 'S' ? 'Sakit' : val === 'I' ? 'Izin' : 'Alfa'})`;
                } else {
                    // Jika Hadir, aktifkan kembali
                    colTahsin.classList.remove('row-disabled');
                    colTahfidz.classList.remove('row-disabled');
                    colCatatan.placeholder = "Tulis catatan opsional...";
                }
            });
        });

        // 2. Mapel Tahsin Berubah Tampilan (Iqro vs Al-Quran)
        document.querySelectorAll('.tahsin-mapel-trigger').forEach(select => {
            select.addEventListener('change', (e) => {
                const id = e.target.getAttribute('data-id');
                const val = e.target.value;
                const areaBuku = document.getElementById(`tahsin_buku_area_${id}`);
                const areaQuran = document.getElementById(`tahsin_quran_area_${id}`);
                
                if (val === "Al Qur'an") {
                    areaBuku.style.display = 'none';
                    areaQuran.style.display = 'block';
                    // Trigger dropdown surat pertama kali
                    document.getElementById(`t_q_juz_${id}`).dispatchEvent(new Event('change'));
                } else {
                    areaBuku.style.display = 'flex';
                    areaQuran.style.display = 'none';
                }
            });
        });

        // 3. CASCADING DROPDOWN (Juz -> Surat)
        document.querySelectorAll('.trigger-juz').forEach(selectJuz => {
            selectJuz.addEventListener('change', (e) => {
                const juzAngka = parseInt(e.target.value);
                const idDropdownSuratTarget = e.target.getAttribute('data-target');
                const selectSurat = document.getElementById(idDropdownSuratTarget);
                
                // Ambil daftar surat dari pemetaan
                const daftarSuratId = petaJuz[juzAngka] || [];
                
                selectSurat.innerHTML = '';
                daftarSuratId.forEach(idSurat => {
                    selectSurat.innerHTML += `<option value="${namaSurat[idSurat]}">${idSurat}. ${namaSurat[idSurat]}</option>`;
                });
            });
            // Eksekusi untuk isi dropdown awal saat di-render
            selectJuz.dispatchEvent(new Event('change')); 
        });
    }

    // ============================================
    // MESIN PENYIMPAN (Pecah Data Otomatis)
    // ============================================
    document.getElementById('btnSimpanJurnal').addEventListener('click', async () => {
        if(!confirm("Simpan jurnal harian untuk kelas ini?")) return;
        
        const btn = document.getElementById('btnSimpanJurnal');
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> MENYIMPAN KE DATABASE...`;
        btn.disabled = true;

        const tgl = document.getElementById('inputTanggal').value;
        const barisData = document.querySelectorAll('#tbodyInputHarian tr');
        let success = 0;

        try {
            // Kita proses tiap baris secara massal
            const promises = Array.from(barisData).map(async (row) => {
                const idSantri = row.id.replace('row_', '');
                
                // Ambil Nilai Absensi
                let absenVal = 'H';
                if(row.querySelector(`input[name="absen_${idSantri}"][value="I"]`).checked) absenVal = 'I';
                if(row.querySelector(`input[name="absen_${idSantri}"][value="S"]`).checked) absenVal = 'S';
                if(row.querySelector(`input[name="absen_${idSantri}"][value="A"]`).checked) absenVal = 'A';

                const catatan = document.getElementById(`catatan_${idSantri}`).value;

                // 1. Simpan ke tabel KEHADIRAN (Sesuai janji: Pecah data)
                await api.post('kehadiran', {
                    id_santri: idSantri,
                    tanggal: tgl,
                    status_kehadiran: absenVal,
                    keterangan: catatan
                }).catch(e => console.log("Skip/Error Kehadiran")); // Hindari stop total jika error 1 anak

                // Jika Hadir, baru simpan Tahsin & Tahfidz
                if (absenVal === 'H') {
                    // --- TAHSIN ---
                    const mapelTahsin = document.getElementById(`tahsin_mapel_${idSantri}`).value;
                    let payloadTahsin = { id_santri: idSantri, tanggal: tgl, program: mapelTahsin };
                    
                    if (mapelTahsin === "Al Qur'an") {
                        payloadTahsin.juz = document.getElementById(`t_q_juz_${idSantri}`).value;
                        payloadTahsin.surat = document.getElementById(`t_q_surat_${idSantri}`).value;
                        payloadTahsin.ayat_awal = document.getElementById(`t_q_ayatawal_${idSantri}`).value;
                        payloadTahsin.ayat_akhir = document.getElementById(`t_q_ayatakhir_${idSantri}`).value;
                        payloadTahsin.status = document.getElementById(`btn_t_q_stat_${idSantri}`).getAttribute('data-status');
                    } else {
                        payloadTahsin.jilid = document.getElementById(`t_jilid_${idSantri}`).value;
                        payloadTahsin.halaman = document.getElementById(`t_hal_${idSantri}`).value;
                        payloadTahsin.status = document.getElementById(`btn_tahsin_stat_${idSantri}`).getAttribute('data-status');
                    }
                    await api.post('tahsin', payloadTahsin).catch(e => {});

                    // --- TAHFIDZ ---
                    const payloadTahfidz = {
                        id_santri: idSantri,
                        tanggal: tgl,
                        juz: document.getElementById(`h_juz_${idSantri}`).value,
                        surat: document.getElementById(`h_surat_${idSantri}`).value,
                        ayat_awal: document.getElementById(`h_ayatawal_${idSantri}`).value,
                        ayat_akhir: document.getElementById(`h_ayatakhir_${idSantri}`).value,
                        status: document.getElementById(`btn_h_stat_${idSantri}`).getAttribute('data-status'),
                        catatan: catatan
                    };
                    await api.post('hafalan', payloadTahfidz).catch(e => {});
                }
                
                success++;
            });

            // Eksekusi semua secara paralel agar super cepat (Tidak menunggu satu-satu)
            await Promise.all(promises);

            alert(`Alhamdulillah! Jurnal Harian berhasil disimpan (${success} Santri diproses).`);
            document.getElementById('areaInput').style.display = 'none'; // Tutup layar setelah sukses
            
        } catch(error) {
            alert("Terjadi kesalahan saat menyimpan data.");
            console.error(error);
        } finally {
            btn.innerHTML = `<i class="fas fa-save"></i> SIMPAN JURNAL HARI INI`;
            btn.disabled = false;
        }
    });
}
