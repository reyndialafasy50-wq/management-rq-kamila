/**
 * ==================================================
 * BAGIAN 9: INPUT HARIAN MOBILE-FIRST (SINGLE TABLE V2)
 * File: js/input_harian.js
 * ==================================================
 */
import { api } from './api.js';

const currentUserRole = 'guru'; 

const namaSurat = ["", "Al-Fatihah", "Al-Baqarah", "Ali 'Imran", "An-Nisa'", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Taubah", "Yunus", "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra'", "Al-Kahf", "Maryam", "Taha", "Al-Anbiya'", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Asy-Syu'ara'", "An-Naml", "Al-Qasas", "Al-'Ankabut", "Ar-Rum", "Luqman", "As-Sajdah", "Al-Ahzab", "Saba'", "Fatir", "Yasin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir", "Fussilat", "Asy-Syura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jasiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf", "Az-Zariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadilah", "Al-Hasyr", "Al-Mumtahanah", "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Tagabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij", "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddassir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba'", "An-Nazi'at", "'Abasa", "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Insyiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Gasyiyah", "Al-Fajr", "Al-Balad", "Asy-Syams", "Al-Lail", "Ad-Duha", "Asy-Syarh", "At-Tin", "Al-'Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-'Adiyat", "Al-Qari'ah", "At-Takasur", "Al-'Asr", "Al-Humazah", "Al-Fil", "Quraisy", "Al-Ma'un", "Al-Kausar", "Al-Kafirun", "An-Nasr", "Al-Lahab", "Al-Ikhlas", "Al-Falaq", "An-Nas"];
const petaJuz = { 1: [1,2], 2: [2], 3: [2,3], 4: [3,4], 5: [4], 6: [4,5], 7: [5,6], 8: [6,7], 9: [7,8], 10: [8,9], 11: [9,10,11], 12: [11,12], 13: [12,13,14], 14: [15,16], 15: [17,18], 16: [18,19,20], 17: [21,22], 18: [23,24,25], 19: [25,26,27], 20: [27,28,29], 21: [29,30,31,32,33], 22: [33,34,35,36], 23: [36,37,38,39], 24: [39,40,41], 25: [41,42,43,44,45], 26: [46,47,48,49,50,51], 27: [51,52,53,54,55,56,57], 28: [58,59,60,61,62,63,64,65,66], 29: [67,68,69,70,71,72,73,74,75,76,77], 30: Array.from({length: 37}, (_, i) => i + 78) };

export function renderInputHarian() {
    return `
        <style>
            /* FIX POINT 1: Header Nempel (Flush) ke atas */
            .input-header-wrapper { 
                background: var(--surface); 
                padding: 20px; 
                margin: -20px -20px 20px -20px; 
                border-radius: 0 0 16px 16px; 
                border-bottom: 1px solid var(--border); 
                position: sticky; 
                top: 0; 
                z-index: 50; 
                box-shadow: 0 4px 15px rgba(0,0,0,0.05); 
                transition: 0.3s;
            }
            .input-header-title { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; }
            .input-header-title h4 { margin: 0; font-size: 1rem; color: var(--text-main); font-weight: 700; }
            .input-header-title p { margin: 0; font-size: 0.75rem; color: var(--text-muted); }
            
            .input-header-controls { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
            .input-header-controls select, .input-header-controls input { border: 1px solid var(--border); border-radius: 8px; padding: 10px 15px; font-size: 0.9rem; background: var(--bg-main); outline: none; flex: 1; min-width: 140px; color: var(--text-main);}
            
            .santri-card { background: var(--surface); border-radius: 12px; border: 1px solid var(--border); padding: 15px; margin-bottom: 12px; display: flex; flex-direction: column; transition: all 0.3s ease;}
            .santri-card.active-card { border: 2px solid var(--primary); box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); transform: scale(1.02); z-index: 5; position: relative; background: var(--surface); }

            .card-header-flex { display: flex; justify-content: space-between; align-items: center; }
            .info-santri { flex: 1; }
            .nama-santri { font-weight: 600; font-size: 1rem; color: var(--text-main); margin-bottom: 2px;}
            .nis-santri { font-size: 0.75rem; color: var(--text-muted); }
            
            .absen-group { display: flex; gap: 4px; }
            .absen-radio { display: none; }
            .absen-label { width: 30px; height: 30px; line-height: 30px; text-align: center; border-radius: 50%; font-weight: 700; cursor: pointer; transition: 0.2s; background: #E5E7EB; color: #9CA3AF; font-size: 0.85rem;}
            .absen-radio[value="H"]:checked + .absen-label { background: #10B981; color: white; }
            .absen-radio[value="I"]:checked + .absen-label { background: #3B82F6; color: white; }
            .absen-radio[value="S"]:checked + .absen-label { background: #F59E0B; color: white; }
            .absen-radio[value="A"]:checked + .absen-label { background: #EF4444; color: white; }
            
            .expand-btn { background: none; border: none; color: var(--text-muted); font-size: 1.2rem; cursor: pointer; padding: 5px 15px; width: 100%; text-align: center; margin-top: 10px; transition: 0.3s; outline: none; -webkit-tap-highlight-color: transparent; }
            .expand-btn.active { transform: rotate(180deg); color: #10B981; }
            
            .accordion-body { display: none; padding-top: 15px; border-top: 1px dashed var(--border); margin-top: 10px; }
            .tabs-container { display: flex; gap: 10px; margin-bottom: 15px; }
            .tab-btn { flex: 1; padding: 8px; border: 1px solid var(--border); background: var(--bg-main); border-radius: 8px; font-weight: 600; font-size: 0.85rem; cursor: pointer; color: var(--text-muted); transition: 0.2s; outline: none; -webkit-tap-highlight-color: transparent;}
            .tab-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
            
            .form-grid { display: grid; gap: 10px; }
            .compact-input { padding: 10px 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 0.9rem; width: 100%; background: var(--bg-main); color: var(--text-main); outline: none;}
            .flex-row-gap { display: flex; gap: 10px; align-items: center;}
            
            .btn-action-group { display: flex; gap: 10px; margin-top: 5px; }
            .btn-status-save { flex: 1; padding: 10px; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 0.9rem; transition: 0.2s; display: flex; justify-content: center; align-items: center; gap: 5px; outline: none; -webkit-tap-highlight-color: transparent;}
            .btn-status-lulus { background: #D1FAE5; color: #065F46; border: 1px solid #34D399; }
            .btn-status-ulang { background: #FEE2E2; color: #991B1B; border: 1px solid #F87171; }
            .btn-status-save:active { transform: scale(0.95); }

            .toast-save { font-size: 0.7rem; color: #10B981; font-weight: 600; opacity: 0; transition: 0.3s; margin-left: 5px; display: inline-flex; align-items: center; gap: 3px;}
            .toast-save.show { opacity: 1; }

            /* FIX POINT 2: Tombol Batch Save Mengikuti Scroll */
            .batch-save-container {
                padding: 10px 0 30px 0; 
                display: none;
            }
            .btn-batch-save {
                width: 100%; padding: 16px; border-radius: 12px; border: none; 
                background: var(--primary); color: white; font-weight: 700; font-size: 1.1rem; 
                cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 10px;
                box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4); transition: 0.3s;
            }
            .btn-batch-save:active { transform: scale(0.98); }
        </style>

        <div class="input-header-wrapper" id="inputHeader">
            <div class="input-header-title">
                <i class="fas fa-clipboard-check text-primary" style="font-size: 1.2rem;"></i>
                <div>
                    <h4>Input Harian Cerdas</h4>
                    <p>Pilih kelas & tanggal untuk memulai input data.</p>
                </div>
            </div>
            <div class="input-header-controls">
                <input type="date" id="tglInputHarian">
                <select id="kelasInputHarian">
                    <option value="">Memuat Kelas...</option>
                </select>
                <div id="loadingIndicator" style="display:none; color: var(--primary); font-size: 1.2rem; margin-left: 10px;"><i class="fas fa-circle-notch fa-spin"></i></div>
            </div>
        </div>

        <div id="listSantriContainer" style="padding-bottom: 10px;">
            <div style="text-align:center; padding: 40px; color: var(--text-muted);">
                <i class="fas fa-users" style="font-size:3rem; margin-bottom:15px; opacity:0.5;"></i>
                <p>Memuat daftar santri...</p>
            </div>
        </div>

        <!-- WADAH TOMBOL SIMPAN SEKELAS -->
        <div class="batch-save-container" id="batchSaveContainer">
            <button class="btn-batch-save" id="btnBatchSaveAbsen" onclick="simpanAbsenSekelas(this)">
                <i class="fas fa-save"></i> Simpan Kehadiran Kelas Ini
            </button>
        </div>
    `;
}

export async function initInputHarian() {
    const elTgl = document.getElementById('tglInputHarian');
    const elKelas = document.getElementById('kelasInputHarian');
    const container = document.getElementById('listSantriContainer');
    const loader = document.getElementById('loadingIndicator');
    const batchContainer = document.getElementById('batchSaveContainer');
    
    let currentSantriData = []; 
    elTgl.valueAsDate = new Date();

    try {
        const kelasData = await api.get('kelas', 'select=*');
        if(kelasData.length > 0) {
            elKelas.innerHTML = kelasData.map(k => `<option value="${k.nama_kelas}">${k.nama_kelas}</option>`).join('');
            fetchDanRenderSantri();
        } else {
            elKelas.innerHTML = '<option value="">Belum ada kelas dibuat</option>';
            container.innerHTML = '<p style="text-align:center;">Silakan buat kelas terlebih dahulu.</p>';
        }
    } catch(err) { console.error(err); }

    elKelas.addEventListener('change', fetchDanRenderSantri);
    elTgl.addEventListener('change', fetchDanRenderSantri);

    async function fetchDanRenderSantri() {
        if(!elKelas.value || !elTgl.value) return;
        loader.style.display = 'block';
        container.style.opacity = '0.5';
        batchContainer.style.display = 'none';

        try {
            const santriList = await api.get('dapodik_santri', `select=*&nama_kelas=eq.${encodeURIComponent(elKelas.value)}&order=nama_santri.asc`);
            currentSantriData = santriList; 
            
            if(santriList.length === 0) {
                container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted);">Tidak ada santri di kelas ini.</div>`;
            } else {
                renderKartuSantri(santriList);
                batchContainer.style.display = 'block'; // Tampilkan tombol simpan sekelas
            }
        } catch (error) {
            container.innerHTML = `<div style="text-align:center; color:red; padding:20px;">Gagal menarik data.</div>`;
        } finally {
            loader.style.display = 'none';
            container.style.opacity = '1';
        }
    }

    function renderKartuSantri(santriList) {
        let html = '';
        santriList.forEach(s => {
            html += `
            <div class="santri-card" id="card_${s.id}">
                <div class="card-header-flex">
                    <div class="info-santri">
                        <div class="nama-santri">${s.nama_santri} <span class="toast-save" id="toast_${s.id}"><i class="fas fa-check-circle"></i> Tersimpan</span></div>
                        <div class="nis-santri">${s.nis || 'Tanpa NIS'}</div>
                    </div>
                    
                    <div class="absen-group">
                        <input type="radio" name="abs_${s.id}" id="h_${s.id}" value="H" class="absen-radio trigger-absen" data-id="${s.id}" checked>
                        <label for="h_${s.id}" class="absen-label">H</label>
                        
                        <input type="radio" name="abs_${s.id}" id="i_${s.id}" value="I" class="absen-radio trigger-absen" data-id="${s.id}">
                        <label for="i_${s.id}" class="absen-label">I</label>
                        
                        <input type="radio" name="abs_${s.id}" id="s_${s.id}" value="S" class="absen-radio trigger-absen" data-id="${s.id}">
                        <label for="s_${s.id}" class="absen-label">S</label>
                        
                        <input type="radio" name="abs_${s.id}" id="a_${s.id}" value="A" class="absen-radio trigger-absen" data-id="${s.id}">
                        <label for="a_${s.id}" class="absen-label">A</label>
                    </div>
                </div>

                <button class="expand-btn" id="expandBtn_${s.id}" onclick="toggleAccordion('${s.id}')">
                    <i class="fas fa-chevron-down"></i>
                </button>

                <div class="accordion-body" id="acc_${s.id}">
                    <div class="tabs-container">
                        <button class="tab-btn active" id="tab_tahsin_${s.id}" onclick="switchMode('${s.id}', 'tahsin')">Tahsin</button>
                        <button class="tab-btn" id="tab_tahfidz_${s.id}" onclick="switchMode('${s.id}', 'tahfidz')">Tahfidz</button>
                    </div>

                    <!-- FORM TAHSIN -->
                    <div id="form_tahsin_${s.id}" class="form-grid">
                        <select class="compact-input trigger-mapel" id="t_mapel_${s.id}" data-id="${s.id}">
                            <option value="Iqro">Iqro</option>
                            <option value="Ummi">Ummi</option>
                            <option value="Al Qur'an">Al Qur'an</option>
                        </select>
                        <div id="t_buku_area_${s.id}" class="flex-row-gap">
                            <input type="number" id="t_jilid_${s.id}" class="compact-input" placeholder="Jilid">
                            <input type="number" id="t_hal_${s.id}" class="compact-input" placeholder="Hal">
                        </div>
                        <div id="t_quran_area_${s.id}" class="form-grid" style="display: none;">
                            <div class="flex-row-gap">
                                <select id="t_q_juz_${s.id}" class="compact-input trigger-juz" data-target="t_q_surat_${s.id}" style="width:100px;">${generateJuzOptions(1)}</select>
                                <select id="t_q_surat_${s.id}" class="compact-input"></select>
                            </div>
                            <div class="flex-row-gap">
                                <input type="number" id="t_q_a_awal_${s.id}" class="compact-input" placeholder="Ayat Awal"><span>-</span>
                                <input type="number" id="t_q_a_akhir_${s.id}" class="compact-input" placeholder="Ayat Akhir">
                            </div>
                        </div>
                        <input type="text" id="t_catatan_${s.id}" class="compact-input" placeholder="Catatan Ustadz (Opsional)...">
                        <div class="btn-action-group">
                            <button class="btn-status-save btn-status-lulus" onclick="saveDataRealtime('${s.id}', 'tahsin', 'Lulus', this)"><i class="fas fa-check"></i> Lanjut</button>
                            <button class="btn-status-save btn-status-ulang" onclick="saveDataRealtime('${s.id}', 'tahsin', 'Ulang', this)"><i class="fas fa-undo"></i> Ulang</button>
                        </div>
                    </div>

                    <!-- FORM TAHFIDZ -->
                    <div id="form_tahfidz_${s.id}" class="form-grid" style="display:none;">
                        <div class="flex-row-gap">
                            <select id="h_juz_${s.id}" class="compact-input trigger-juz" data-target="h_surat_${s.id}" style="width:100px;">${generateJuzOptions(30)}</select>
                            <select id="h_surat_${s.id}" class="compact-input"></select>
                        </div>
                        <div class="flex-row-gap">
                            <input type="number" id="h_a_awal_${s.id}" class="compact-input" placeholder="Ayat Awal"><span>-</span>
                            <input type="number" id="h_a_akhir_${s.id}" class="compact-input" placeholder="Ayat Akhir">
                        </div>
                        <input type="text" id="h_catatan_${s.id}" class="compact-input" placeholder="Catatan Ustadz (Opsional)...">
                        <div class="btn-action-group">
                            <button class="btn-status-save btn-status-lulus" onclick="saveDataRealtime('${s.id}', 'tahfidz', 'Lulus', this)"><i class="fas fa-check"></i> Lanjut</button>
                            <button class="btn-status-save btn-status-ulang" onclick="saveDataRealtime('${s.id}', 'tahfidz', 'Ulang', this)"><i class="fas fa-undo"></i> Ulang</button>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });
        container.innerHTML = html;
        initLogikaInteraktif();
    }
    
    window.toggleAccordion = (id) => {
        const acc = document.getElementById(`acc_${id}`);
        const btn = document.getElementById(`expandBtn_${id}`);
        const card = document.getElementById(`card_${id}`);
        const header = document.getElementById('inputHeader');

        if(acc.style.display === 'block') {
            acc.style.display = 'none';
            btn.classList.remove('active');
            card.classList.remove('active-card');
        } else {
            acc.style.display = 'block';
            btn.classList.add('active');
            card.classList.add('active-card');
            setTimeout(() => {
                const headerHeight = header.offsetHeight + 15;
                const offsetPosition = card.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }, 150);
        }
    };

    window.switchMode = (id, mode) => {
        const tTahsin = document.getElementById(`tab_tahsin_${id}`);
        const tTahfidz = document.getElementById(`tab_tahfidz_${id}`);
        const fTahsin = document.getElementById(`form_tahsin_${id}`);
        const fTahfidz = document.getElementById(`form_tahfidz_${id}`);

        if(mode === 'tahsin') {
            tTahsin.classList.add('active'); tTahfidz.classList.remove('active');
            fTahsin.style.display = 'grid'; fTahfidz.style.display = 'none';
        } else {
            tTahfidz.classList.add('active'); tTahsin.classList.remove('active');
            fTahfidz.style.display = 'grid'; fTahsin.style.display = 'none';
        }
    };

    function generateJuzOptions(selected) {
        let opt = '';
        for(let i=1; i<=30; i++) opt += `<option value="${i}" ${i === selected ? 'selected' : ''}>Juz ${i}</option>`;
        return opt;
    }

    function initLogikaInteraktif() {
        document.querySelectorAll('.trigger-absen').forEach(rad => {
            rad.addEventListener('change', (e) => {
                const id = e.target.getAttribute('data-id');
                const val = e.target.value;
                const expandBtn = document.getElementById(`expandBtn_${id}`);
                const acc = document.getElementById(`acc_${id}`);
                const card = document.getElementById(`card_${id}`);
                
                // CATATAN: Di sini auto-save dihapus! Absen baru disimpan saat tombol besar ditekan.
                if (val !== 'H') {
                    expandBtn.style.display = 'none';
                    acc.style.display = 'none';
                    expandBtn.classList.remove('active');
                    if(card) card.classList.remove('active-card'); 
                } else {
                    expandBtn.style.display = 'block';
                }
            });
        });

        document.querySelectorAll('.trigger-mapel').forEach(sel => {
            sel.addEventListener('change', (e) => {
                const id = e.target.getAttribute('data-id');
                const val = e.target.value;
                document.getElementById(`t_buku_area_${id}`).style.display = (val !== "Al Qur'an") ? 'flex' : 'none';
                document.getElementById(`t_quran_area_${id}`).style.display = (val === "Al Qur'an") ? 'grid' : 'none';
                if(val === "Al Qur'an") document.getElementById(`t_q_juz_${id}`).dispatchEvent(new Event('change'));
            });
        });

        document.querySelectorAll('.trigger-juz').forEach(selJuz => {
            selJuz.addEventListener('change', (e) => {
                const juzAngka = parseInt(e.target.value);
                const tgt = document.getElementById(e.target.getAttribute('data-target'));
                const daftarSuratId = petaJuz[juzAngka] || [];
                tgt.innerHTML = daftarSuratId.map(idS => `<option value="${namaSurat[idS]}">${idS}. ${namaSurat[idS]}</option>`).join('');
            });
            selJuz.dispatchEvent(new Event('change'));
        });
    }

    const showToast = (id) => {
        const t = document.getElementById(`toast_${id}`);
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 2000);
    };

    async function upsertKeHarian(idSantri, payloadPartial) {
        const tglUI = elTgl.value;
        const queryMatch = `santri_id=eq.${idSantri}&tanggal=eq.${tglUI}`;
        payloadPartial.tanggal = tglUI;
        payloadPartial.santri_id = idSantri;

        try {
            const existing = await api.get('input_harian', queryMatch);
            if (existing && existing.length > 0) {
                await api.update('input_harian', existing[0].id, payloadPartial);
            } else {
                await api.post('input_harian', payloadPartial);
            }
        } catch(e) { console.error("AutoSave Error:", e); }
    }

    // ==========================================
    // FUNGSI BARU: SIMPAN ABSEN BATCH (SEKELAS)
    // DENGAN ALERT SYOK TERAPI ALPA KE-10
    // ==========================================
    window.simpanAbsenSekelas = async (btnElement) => {
        const originalText = btnElement.innerHTML;
        btnElement.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Menyimpan Kehadiran...`;
        btnElement.style.background = '#4F567D';
        btnElement.disabled = true;

        try {
            // Kita proses satu per satu santri yang ada di kelas ini
            const promises = currentSantriData.map(async (s) => {
                const checkedRadio = document.querySelector(`input[name="abs_${s.id}"]:checked`);
                const val = checkedRadio ? checkedRadio.value : 'H';
                
                let statusBaku = 'Hadir';
                if (val === 'I') statusBaku = 'Izin';
                if (val === 'S') statusBaku = 'Sakit';
                if (val === 'A') statusBaku = 'Alpa'; 

                const payload = {
                    nama_santri: s.nama_santri,
                    nama_kelas: s.nama_kelas,
                    nis: s.nis,
                    status_hadir: statusBaku
                };
                
                // Gunakan tambal sulam cerdas
                await upsertKeHarian(s.id, payload);

                // --- FITUR BARU: SYOK TERAPI ALPA KE-10 ---
                // Jika Ustadz menginput "Alpa", cek total alpanya bulan ini
                if (statusBaku === 'Alpa') {
                    const tglBulanIni = new Date().toISOString().substring(0, 7); // Hasil: YYYY-MM
                    const res = await api.get('input_harian', `select=id&santri_id=eq.${s.id}&status_hadir=eq.Alpa&tanggal=gte.${tglBulanIni}-01`);
                    
                    if (res && res.length >= 10) {
                        setTimeout(() => {
                            alert(`🚨 Gawat Ustadz!\n\nAnanda ${s.nama_santri} baru saja mencapai batas ALPA ${res.length}X bulan ini!\nMohon segera agendakan evaluasi khusus.`);
                        }, 1000);
                    }
                }
                // ------------------------------------------
            });

            // Tunggu semua proses selesai bersamaan
            await Promise.all(promises);

            btnElement.innerHTML = `<i class="fas fa-check-circle"></i> Berhasil Disimpan!`;
            btnElement.style.background = '#10B981'; // Hijau Sukses
            
            setTimeout(() => {
                btnElement.innerHTML = originalText;
                btnElement.style.background = 'var(--primary)';
                btnElement.disabled = false;
            }, 2500);

        } catch (error) {
            alert("Gagal menyimpan absen masal. Cek koneksi Anda.");
            btnElement.innerHTML = originalText;
            btnElement.disabled = false;
        }
    };

    window.saveDataRealtime = async (id, jenisForm, targetStatus, btnElement) => {
        const originalText = btnElement.innerHTML;
        btnElement.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Menyimpan...`;

        const s = currentSantriData.find(x => x.id === id);
        let payload = {
            nama_santri: s ? s.nama_santri : null,
            nama_kelas: s ? s.nama_kelas : null,
            nis: s ? s.nis : null
        };

        if (jenisForm === 'tahsin') {
            const mapel = document.getElementById(`t_mapel_${id}`).value;
            payload.tahsin_program = mapel;
            payload.tahsin_status = targetStatus;
            
            const cat = document.getElementById(`t_catatan_${id}`).value;
            if(cat) payload.catatan = cat;

            if (mapel === "Al Qur'an") {
                payload.tahsin_juz = document.getElementById(`t_q_juz_${id}`).value;
                payload.tahsin_surat = document.getElementById(`t_q_surat_${id}`).value;
                payload.tahsin_ayat_dari = document.getElementById(`t_q_a_awal_${id}`).value;
                payload.tahsin_ayat_sampai = document.getElementById(`t_q_a_akhir_${id}`).value;
            } else {
                payload.tahsin_jilid = document.getElementById(`t_jilid_${id}`).value;
                payload.tahsin_halaman = document.getElementById(`t_hal_${id}`).value;
            }
        
        } else if (jenisForm === 'tahfidz') {
            payload.tahfidz_status = targetStatus;
            payload.tahfidz_juz = document.getElementById(`h_juz_${id}`).value;
            payload.tahfidz_surat = document.getElementById(`h_surat_${id}`).value;
            payload.tahfidz_ayat_dari = document.getElementById(`h_a_awal_${id}`).value;
            payload.tahfidz_ayat_sampai = document.getElementById(`h_a_akhir_${id}`).value;

            const cat = document.getElementById(`h_catatan_${id}`).value;
            if(cat) payload.catatan = cat;
        }

        await upsertKeHarian(id, payload);

        setTimeout(() => {
            btnElement.innerHTML = `<i class="fas fa-check"></i> Disimpan`;
            showToast(id);
            setTimeout(() => { btnElement.innerHTML = originalText; }, 1000);
        }, 500); 
    };
}
