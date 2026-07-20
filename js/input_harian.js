/**
 * ==================================================
 * BAGIAN 9: INPUT HARIAN MOBILE-FIRST 
 * (Auto-Save Real-Time, Adaptive Dark Mode & Smart Scroll)
 * File: js/input_harian.js
 * ==================================================
 */
import { api } from './api.js';

const currentUserRole = 'guru'; 

// ==========================================
// KAMUS DATA AL-QUR'AN
// ==========================================
const namaSurat = [
    "", "Al-Fatihah", "Al-Baqarah", "Ali 'Imran", "An-Nisa'", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Taubah", "Yunus", "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra'", "Al-Kahf", "Maryam", "Taha", "Al-Anbiya'", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Asy-Syu'ara'", "An-Naml", "Al-Qasas", "Al-'Ankabut", "Ar-Rum", "Luqman", "As-Sajdah", "Al-Ahzab", "Saba'", "Fatir", "Yasin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir", "Fussilat", "Asy-Syura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jasiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf", "Az-Zariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadilah", "Al-Hasyr", "Al-Mumtahanah", "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Tagabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij", "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddassir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba'", "An-Nazi'at", "'Abasa", "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Insyiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Gasyiyah", "Al-Fajr", "Al-Balad", "Asy-Syams", "Al-Lail", "Ad-Duha", "Asy-Syarh", "At-Tin", "Al-'Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-'Adiyat", "Al-Qari'ah", "At-Takasur", "Al-'Asr", "Al-Humazah", "Al-Fil", "Quraisy", "Al-Ma'un", "Al-Kausar", "Al-Kafirun", "An-Nasr", "Al-Lahab", "Al-Ikhlas", "Al-Falaq", "An-Nas"
];

const petaJuz = {
    1: [1,2], 2: [2], 3: [2,3], 4: [3,4], 5: [4], 6: [4,5], 7: [5,6], 8: [6,7], 9: [7,8], 10: [8,9],
    11: [9,10,11], 12: [11,12], 13: [12,13,14], 14: [15,16], 15: [17,18], 16: [18,19,20], 17: [21,22], 18: [23,24,25], 19: [25,26,27], 20: [27,28,29],
    21: [29,30,31,32,33], 22: [33,34,35,36], 23: [36,37,38,39], 24: [39,40,41], 25: [41,42,43,44,45],
    26: [46,47,48,49,50,51], 27: [51,52,53,54,55,56,57], 28: [58,59,60,61,62,63,64,65,66], 29: [67,68,69,70,71,72,73,74,75,76,77],
    30: Array.from({length: 37}, (_, i) => i + 78)
};

export function renderInputHarian() {
    return `
        <style>
            /* HEADER STICKY (Z-Index tinggi agar tidak tertembus) */
            .input-header-wrapper { background: var(--surface); padding: 20px; border-radius: 16px; margin-bottom: 20px; border: 1px solid var(--border); position: sticky; top: 10px; z-index: 50; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: 0.3s;}
            .input-header-title { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; }
            .input-header-title h4 { margin: 0; font-size: 1rem; color: var(--text-main); font-weight: 700; }
            .input-header-title p { margin: 0; font-size: 0.75rem; color: var(--text-muted); }
            
            .input-header-controls { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
            .input-header-controls select, .input-header-controls input { border: 1px solid var(--border); border-radius: 8px; padding: 10px 15px; font-size: 0.9rem; background: var(--bg-main); outline: none; flex: 1; min-width: 140px; color: var(--text-main);}
            
            /* KARTU SANTRI & MODE FOKUS ADAPTIF */
            .santri-card { background: var(--surface); border-radius: 12px; border: 1px solid var(--border); padding: 15px; margin-bottom: 12px; display: flex; flex-direction: column; transition: all 0.3s ease;}
            
            /* Background menggunakan var(--surface) agar elegan di Mode Terang maupun Gelap */
            .santri-card.active-card { 
                border: 2px solid var(--primary); 
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); 
                transform: scale(1.02); 
                z-index: 5; 
                position: relative;
                background: var(--surface); 
            }

            .card-header-flex { display: flex; justify-content: space-between; align-items: center; }
            .info-santri { flex: 1; }
            .nama-santri { font-weight: 600; font-size: 1rem; color: var(--text-main); margin-bottom: 2px;}
            .nis-santri { font-size: 0.75rem; color: var(--text-muted); }
            
            /* Radio Button Custom Absen */
            .absen-group { display: flex; gap: 4px; }
            .absen-radio { display: none; }
            .absen-label { width: 30px; height: 30px; line-height: 30px; text-align: center; border-radius: 50%; font-weight: 700; cursor: pointer; transition: 0.2s; background: #E5E7EB; color: #9CA3AF; font-size: 0.85rem;}
            .absen-radio[value="H"]:checked + .absen-label { background: #10B981; color: white; }
            .absen-radio[value="I"]:checked + .absen-label { background: #3B82F6; color: white; }
            .absen-radio[value="S"]:checked + .absen-label { background: #F59E0B; color: white; }
            .absen-radio[value="A"]:checked + .absen-label { background: #EF4444; color: white; }
            
            /* Expand Button (Tanda V) */
            .expand-btn { background: none; border: none; color: var(--text-muted); font-size: 1.2rem; cursor: pointer; padding: 5px 15px; width: 100%; text-align: center; margin-top: 10px; transition: 0.3s; outline: none; -webkit-tap-highlight-color: transparent; }
            .expand-btn.active { transform: rotate(180deg); color: #10B981; }
            
            .accordion-body { display: none; padding-top: 15px; border-top: 1px dashed var(--border); margin-top: 10px; }
            .tabs-container { display: flex; gap: 10px; margin-bottom: 15px; }
            .tab-btn { flex: 1; padding: 8px; border: 1px solid var(--border); background: var(--bg-main); border-radius: 8px; font-weight: 600; font-size: 0.85rem; cursor: pointer; color: var(--text-muted); transition: 0.2s; outline: none; -webkit-tap-highlight-color: transparent;}
            .tab-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
            
            .form-grid { display: grid; gap: 10px; }
            .compact-input { padding: 10px 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 0.9rem; width: 100%; background: var(--bg-main); color: var(--text-main); outline: none;}
            .flex-row-gap { display: flex; gap: 10px; align-items: center;}
            
            /* Dua Tombol Aksi Kiri Kanan */
            .btn-action-group { display: flex; gap: 10px; margin-top: 5px; }
            .btn-status-save { flex: 1; padding: 10px; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 0.9rem; transition: 0.2s; display: flex; justify-content: center; align-items: center; gap: 5px; outline: none; -webkit-tap-highlight-color: transparent;}
            .btn-status-lulus { background: #D1FAE5; color: #065F46; border: 1px solid #34D399; }
            .btn-status-ulang { background: #FEE2E2; color: #991B1B; border: 1px solid #F87171; }
            .btn-status-save:active { transform: scale(0.95); }

            .toast-save { font-size: 0.7rem; color: #10B981; font-weight: 600; opacity: 0; transition: 0.3s; margin-left: 5px; display: inline-flex; align-items: center; gap: 3px;}
            .toast-save.show { opacity: 1; }
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

        <div id="listSantriContainer" style="padding-bottom: 80px;">
            <div style="text-align:center; padding: 40px; color: var(--text-muted);">
                <i class="fas fa-users" style="font-size:3rem; margin-bottom:15px; opacity:0.5;"></i>
                <p>Memuat daftar santri...</p>
            </div>
        </div>
    `;
}

export async function initInputHarian() {
    const elTgl = document.getElementById('tglInputHarian');
    const elKelas = document.getElementById('kelasInputHarian');
    const container = document.getElementById('listSantriContainer');
    const loader = document.getElementById('loadingIndicator');

    elTgl.valueAsDate = new Date();

    try {
        const kelasData = await api.get('kelas', 'select=*');
        if(kelasData.length > 0) {
            elKelas.innerHTML = kelasData.map(k => `<option value="${k.nama_kelas}">${k.nama_kelas}</option>`).join('');
            fetchDanRenderSantri();
        } else {
            elKelas.innerHTML = '<option value="">Belum ada kelas dibuat</option>';
            container.innerHTML = '<p style="text-align:center;">Silakan buat kelas terlebih dahulu di menu Data Santri.</p>';
        }
    } catch(err) { console.error(err); }

    elKelas.addEventListener('change', fetchDanRenderSantri);
    elTgl.addEventListener('change', fetchDanRenderSantri);

    async function fetchDanRenderSantri() {
        if(!elKelas.value || !elTgl.value) return;
        loader.style.display = 'block';
        container.style.opacity = '0.5';

        try {
            const santriList = await api.get('dapodik_santri', `select=*&nama_kelas=eq.${encodeURIComponent(elKelas.value)}&order=nama_santri.asc`);
            
            if(santriList.length === 0) {
                container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted);">Tidak ada santri di kelas ini.</div>`;
            } else {
                renderKartuSantri(santriList);
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
            const mem = {
                mapel: "Iqro", jilid: 3, hal: 15,
                juz: 30, surat: 78, ayatA: 1, ayatB: 10
            };

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
                            <option value="Iqro" ${mem.mapel==='Iqro'?'selected':''}>Iqro</option>
                            <option value="Ummi" ${mem.mapel==='Ummi'?'selected':''}>Ummi</option>
                            <option value="Al Qur'an" ${mem.mapel==="Al Qur'an"?'selected':''}>Al Qur'an</option>
                        </select>
                        
                        <div id="t_buku_area_${s.id}" class="flex-row-gap" style="display: ${mem.mapel !== "Al Qur'an" ? 'flex' : 'none'};">
                            <input type="number" id="t_jilid_${s.id}" class="compact-input" placeholder="Jilid" value="${mem.jilid}">
                            <input type="number" id="t_hal_${s.id}" class="compact-input" placeholder="Hal" value="${mem.hal}">
                        </div>

                        <div id="t_quran_area_${s.id}" class="form-grid" style="display: ${mem.mapel === "Al Qur'an" ? 'grid' : 'none'};">
                            <div class="flex-row-gap">
                                <select id="t_q_juz_${s.id}" class="compact-input trigger-juz" data-target="t_q_surat_${s.id}" style="width:100px;">
                                    ${generateJuzOptions(1)}
                                </select>
                                <select id="t_q_surat_${s.id}" class="compact-input"></select>
                            </div>
                            <div class="flex-row-gap">
                                <input type="number" id="t_q_a_awal_${s.id}" class="compact-input" placeholder="Ayat Awal">
                                <span>-</span>
                                <input type="number" id="t_q_a_akhir_${s.id}" class="compact-input" placeholder="Ayat Akhir">
                            </div>
                        </div>

                        <input type="text" id="t_catatan_${s.id}" class="compact-input" placeholder="Catatan tahsin (Opsional)...">

                        <div class="btn-action-group">
                            <button class="btn-status-save btn-status-lulus" onclick="saveDataRealtime('${s.id}', 'tahsin', 'Lulus', this)">
                                <i class="fas fa-check"></i> Lanjut
                            </button>
                            <button class="btn-status-save btn-status-ulang" onclick="saveDataRealtime('${s.id}', 'tahsin', 'Ulang', this)">
                                <i class="fas fa-undo"></i> Ulang
                            </button>
                        </div>
                    </div>

                    <!-- FORM TAHFIDZ -->
                    <div id="form_tahfidz_${s.id}" class="form-grid" style="display:none;">
                        <div class="flex-row-gap">
                            <select id="h_juz_${s.id}" class="compact-input trigger-juz" data-target="h_surat_${s.id}" style="width:100px;">
                                ${generateJuzOptions(mem.juz)}
                            </select>
                            <select id="h_surat_${s.id}" class="compact-input"></select>
                        </div>
                        <div class="flex-row-gap">
                            <input type="number" id="h_a_awal_${s.id}" class="compact-input" placeholder="Ayat Awal" value="${mem.ayatA}">
                            <span>-</span>
                            <input type="number" id="h_a_akhir_${s.id}" class="compact-input" placeholder="Ayat Akhir" value="${mem.ayatB}">
                        </div>
                        <input type="text" id="h_catatan_${s.id}" class="compact-input" placeholder="Catatan tahfidz (Opsional)...">
                        
                        <div class="btn-action-group">
                            <button class="btn-status-save btn-status-lulus" onclick="saveDataRealtime('${s.id}', 'tahfidz', 'Lanjut', this)">
                                <i class="fas fa-check"></i> Lanjut
                            </button>
                            <button class="btn-status-save btn-status-ulang" onclick="saveDataRealtime('${s.id}', 'tahfidz', 'Ulang', this)">
                                <i class="fas fa-undo"></i> Ulang
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });

        container.innerHTML = html;
        initLogikaInteraktif();
    }
    
    // ==========================================
    // LOGIKA AUTO-SCROLL PINTAR & BUKA TUTUP
    // ==========================================
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
            
            // Jeda 150ms agar animasi buka CSS selesai sebelum menghitung posisi
            setTimeout(() => {
                const headerHeight = header.offsetHeight + 15; // Menghitung tinggi header statis + jarak aman
                const cardPosition = card.getBoundingClientRect().top; // Posisi kartu relatif terhadap layar
                const offsetPosition = cardPosition + window.pageYOffset - headerHeight; // Titik scroll persis di bawah header

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth' // Gulir mulus
                });
            }, 150);
        }
    };

    window.switchMode = (id, mode) => {
        const tabTahsin = document.getElementById(`tab_tahsin_${id}`);
        const tabTahfidz = document.getElementById(`tab_tahfidz_${id}`);
        const formTahsin = document.getElementById(`form_tahsin_${id}`);
        const formTahfidz = document.getElementById(`form_tahfidz_${id}`);

        if(mode === 'tahsin') {
            tabTahsin.classList.add('active'); tabTahfidz.classList.remove('active');
            formTahsin.style.display = 'grid'; formTahfidz.style.display = 'none';
        } else {
            tabTahfidz.classList.add('active'); tabTahsin.classList.remove('active');
            formTahfidz.style.display = 'grid'; formTahsin.style.display = 'none';
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
                
                saveAbsenRealtime(id, val);

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

    async function upsertData(table, queryMatch, payload) {
        try {
            const existing = await api.get(table, queryMatch);
            if(existing && existing.length > 0) {
                await api.update(table, existing[0].id, payload);
            } else {
                await api.post(table, payload);
            }
        } catch(e) { console.error("AutoSave Error:", e); }
    }

    async function saveAbsenRealtime(id, status) {
        const tgl = elTgl.value;
        await upsertData('kehadiran', `id_santri=eq.${id}&tanggal=eq.${tgl}`, {
            id_santri: id, tanggal: tgl, status_kehadiran: status
        });
        showToast(id);
    }

    window.saveDataRealtime = async (id, jenisForm, targetStatus, btnElement) => {
        const originalText = btnElement.innerHTML;
        btnElement.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Menyimpan...`;

        const tgl = elTgl.value;
        let payload = { id_santri: id, tanggal: tgl, status: targetStatus };

        if (jenisForm === 'tahsin') {
            const mapel = document.getElementById(`t_mapel_${id}`).value;
            payload.program = mapel;
            payload.catatan = document.getElementById(`t_catatan_${id}`).value; 
            
            if(mapel === "Al Qur'an") {
                payload.juz = document.getElementById(`t_q_juz_${id}`).value;
                payload.surat = document.getElementById(`t_q_surat_${id}`).value;
                payload.ayat_awal = document.getElementById(`t_q_a_awal_${id}`).value;
                payload.ayat_akhir = document.getElementById(`t_q_a_akhir_${id}`).value;
            } else {
                payload.jilid = document.getElementById(`t_jilid_${id}`).value;
                payload.halaman = document.getElementById(`t_hal_${id}`).value;
            }
            await upsertData('tahsin', `id_santri=eq.${id}&tanggal=eq.${tgl}`, payload);
        
        } else if (jenisForm === 'tahfidz') {
            payload.juz = document.getElementById(`h_juz_${id}`).value;
            payload.surat = document.getElementById(`h_surat_${id}`).value;
            payload.ayat_awal = document.getElementById(`h_a_awal_${id}`).value;
            payload.ayat_akhir = document.getElementById(`h_a_akhir_${id}`).value;
            payload.catatan = document.getElementById(`h_catatan_${id}`).value;
            await upsertData('hafalan', `id_santri=eq.${id}&tanggal=eq.${tgl}`, payload);
        }

        setTimeout(() => {
            btnElement.innerHTML = `<i class="fas fa-check"></i> Disimpan`;
            showToast(id);
            setTimeout(() => { btnElement.innerHTML = originalText; }, 1000);
        }, 500); 
    };
                                                                     }
