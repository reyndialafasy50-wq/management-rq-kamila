/**
 * ==================================================
 * BAGIAN 8: MODUL DATA SANTRI (RBAC - Admin vs Guru)
 * File: js/santri.js
 * ==================================================
 */
import { api } from './api.js';

// ==========================================
// SIMULASI LOGIN (GANTI DI SINI UNTUK TESTING)
// Ketik 'admin' atau 'guru'
// ==========================================
const currentUserRole = 'admin'; 
// ==========================================

let santriDataUtama = [];
let kelasData = [];

async function loadExcelLibrary() {
    return new Promise((resolve, reject) => {
        if (typeof window.XLSX !== 'undefined') return resolve();
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

export function renderSantri() {
    return `
        <div style="background: var(--surface); padding: 20px; border-radius: 16px; margin-bottom: 20px; border: 1px solid var(--border);">
            <div>
                <h4 style="margin: 0; font-size: 1rem; color: var(--text-main);"><i class="fas fa-chalkboard-teacher text-info"></i> Manajemen Santri & Kelas</h4>
                <p style="margin: 3px 0 0; font-size: 0.75rem; color: var(--text-muted); padding-bottom: 15px;">
                    Role saat ini: <strong style="color:var(--primary); text-transform:uppercase;">${currentUserRole}</strong>
                </p>
            </div>
            
            <!-- MENU KHUSUS ADMIN -->
            <div class="action-grid-3" id="menuAdmin" style="display: none;">
                <button class="btn-secondary" id="btnTambahSantri"><i class="fas fa-user-plus"></i> Tambah Santri</button>
                <input type="file" id="fileExcel" accept=".xlsx, .xls" style="display: none;">
                <button class="btn-secondary" id="btnImportExcel"><i class="fas fa-file-excel"></i> Upload Dapodik</button>
            </div>

            <!-- MENU KHUSUS GURU -->
            <div class="action-grid-3" id="menuGuru" style="display: none;">
                <button class="btn-secondary" id="btnTambahKelas"><i class="fas fa-plus"></i> Buat Kelas</button>
                <button class="btn-secondary" id="btnTarikSantri" style="background-color: var(--primary); color: white; border: none;"><i class="fas fa-users-cog"></i> Tarik Santri</button>
            </div>
        </div>

        <div class="toolbar-flex">
            <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" id="searchSantri" placeholder="Cari nama santri...">
            </div>
            <select class="filter-select" id="filterKelas">
                <option value="">-- Tampilkan Semua Kelas --</option>
            </select>
            <button class="btn-secondary btn-export" id="btnExportExcel" style="display: none;"><i class="fas fa-download"></i> Export</button>
        </div>

        <div class="custom-table-container">
            <table class="custom-table">
                <thead>
                    <tr>
                        <th style="width: 50px;">#</th>
                        <th>NIS</th>
                        <th>Nama Lengkap</th>
                        <th>Kelas</th>
                        <th style="text-align: center;">Aksi</th>
                    </tr>
                </thead>
                <tbody id="tableBodySantri">
                    <tr><td colspan="5" style="text-align:center;"><i class="fas fa-spinner fa-spin"></i> Memuat data...</td></tr>
                </tbody>
            </table>
        </div>

        <!-- ================= MODALS ================= -->

        <!-- MODAL TARIK SANTRI (KHUSUS GURU) -->
        <div class="modal-overlay" id="modalTarik">
            <div class="modal-card" style="max-width: 550px; padding: 25px;">
                <div class="modern-modal-header">
                    <h3>Tarik Santri ke Kelas</h3>
                    <button type="button" class="btn-close" onclick="document.getElementById('modalTarik').classList.remove('active')"><i class="fas fa-times"></i></button>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label class="modern-label">Pilih Kelas Tujuan (Kelas Anda):</label>
                    <select id="tarikKelasTujuan" class="modern-input" required></select>
                </div>

                <div style="margin-bottom: 10px;">
                    <label class="modern-label">Daftar Santri yang belum memiliki kelas:</label>
                    <div style="max-height: 250px; overflow-y: auto; border: 1px solid var(--border); border-radius: 8px;">
                        <table class="custom-table" style="margin: 0;">
                            <thead style="position: sticky; top: 0; background: var(--surface); z-index: 1;">
                                <tr>
                                    <th style="width: 40px; text-align:center;"><input type="checkbox" id="checkAllTarik"></th>
                                    <th>Nama Santri & NIS</th>
                                </tr>
                            </thead>
                            <tbody id="listTarikSantri"></tbody>
                        </table>
                    </div>
                </div>

                <button type="button" class="btn-modern-submit" id="btnProsesTarik">
                    <i class="fas fa-download"></i> Masukkan ke Kelas
                </button>
            </div>
        </div>

        <!-- Modal Tambah Kelas -->
        <div class="modal-overlay" id="modalKelas">
            <div class="modal-card" style="max-width: 420px; padding: 25px;">
                <div class="modern-modal-header">
                    <h3>Buat Kelas Baru</h3>
                    <button type="button" class="btn-close" onclick="document.getElementById('modalKelas').classList.remove('active')"><i class="fas fa-times"></i></button>
                </div>
                <form id="formKelas">
                    <div style="margin-bottom: 20px;">
                        <label class="modern-label">Nama Kelas</label>
                        <input type="text" id="inputNamaKelas" class="modern-input" required placeholder="Contoh: Abu Bakar">
                    </div>
                    <div class="time-grid">
                        <div class="time-col">
                            <label class="modern-label">Jam Mulai</label>
                            <input type="time" id="inputJamMulai" class="modern-input" required>
                        </div>
                        <div class="time-col">
                            <label class="modern-label">Jam Selesai</label>
                            <input type="time" id="inputJamSelesai" class="modern-input" required>
                        </div>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label class="modern-label">Hari Belajar</label>
                        <div class="day-chips-container" id="dayChipsContainer">
                            <div class="day-chip" data-hari="SEN">SEN</div>
                            <div class="day-chip" data-hari="SEL">SEL</div>
                            <div class="day-chip" data-hari="RAB">RAB</div>
                            <div class="day-chip" data-hari="KAM">KAM</div>
                            <div class="day-chip" data-hari="JUM">JUM</div>
                            <div class="day-chip" data-hari="SAB">SAB</div>
                        </div>
                    </div>
                    <button type="submit" class="btn-modern-submit" id="btnSimpanKelas"><i class="fas fa-save"></i> Simpan Kelas</button>
                </form>
            </div>
        </div>

        <!-- Modal Tambah/Edit Santri Manual -->
        <div class="modal-overlay" id="modalSantri">
            <div class="modal-card">
                <div class="modal-header">
                    <h3 class="modal-title" id="modalTitle">Form Santri</h3>
                    <button class="btn-close" onclick="document.getElementById('modalSantri').classList.remove('active')"><i class="fas fa-times"></i></button>
                </div>
                <form id="formSantri">
                    <input type="hidden" id="santriId">
                    <div class="form-group">
                        <label class="form-label">Nomor Induk (NIS)</label>
                        <input type="text" id="nis" class="form-input" required placeholder="Contoh: 2026001">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Nama Lengkap</label>
                        <input type="text" id="nama" class="form-input" required placeholder="Masukkan nama santri">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Jenis Kelamin</label>
                        <select id="jk" class="form-select" required>
                            <option value="L">Laki-laki</option>
                            <option value="P">Perempuan</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Pilih Kelas (Bisa Kosong)</label>
                        <select id="kelasId" class="form-select">
                            <option value="">Belum ada kelas</option>
                        </select>
                    </div>
                    <button type="submit" class="btn-primary" style="width: 100%; justify-content: center;" id="btnSimpanSantri">Simpan Data</button>
                </form>
            </div>
        </div>

        <!-- Modal Profil Santri (Bisa melihat detail & Kontak WA) -->
        <div class="modal-overlay" id="modalProfil">
            <div class="profile-card">
                <button class="profile-close" onclick="document.getElementById('modalProfil').classList.remove('active')"><i class="fas fa-times"></i></button>
                <div class="profile-cover"></div>
                <div class="profile-avatar-wrapper">
                    <img src="" class="profile-avatar" id="profAvatar">
                </div>
                <div class="profile-info">
                    <h2 id="profName">Nama Santri</h2>
                    <p id="profBio">NIS: 000 • Kelas -</p>
                </div>
                <div class="profile-actions">
                    <button class="btn-icon-circle" title="Hubungi WA"><i class="fab fa-whatsapp"></i></button>
                    <button class="btn-icon-circle" title="Buka Riwayat"><i class="fas fa-chart-line"></i></button>
                    <button class="btn-icon-circle" title="Edit Data" id="btnEditDariProfil"><i class="fas fa-edit"></i></button>
                </div>
            </div>
        </div>
    `;
}

export async function initSantri() {
    loadExcelLibrary(); 

    // --- MENGATUR TAMPILAN BERDASARKAN ROLE ---
    if (currentUserRole === 'admin') {
        document.getElementById('menuAdmin').style.display = 'grid';
        document.getElementById('btnExportExcel').style.display = 'inline-flex';
    } else if (currentUserRole === 'guru') {
        document.getElementById('menuGuru').style.display = 'grid';
        // Guru disuruh memilih kelasnya di filter tabel agar hanya melihat muridnya
        document.getElementById('filterKelas').innerHTML = '<option value="">-- Tampilkan Kelas Anda --</option>'; 
    }
    // ------------------------------------------

    const tbody = document.getElementById('tableBodySantri');
    const filterKelas = document.getElementById('filterKelas');
    const selectKelasForm = document.getElementById('kelasId');
    const selectTarikKelas = document.getElementById('tarikKelasTujuan');

    const loadData = async () => {
        try {
            // Memuat Daftar Kelas
            kelasData = await api.get('kelas', 'select=*');
            let opsiKelas = '';
            kelasData.forEach(k => { opsiKelas += `<option value="${k.nama_kelas}">${k.nama_kelas}</option>`; });
            
            if(currentUserRole === 'admin') filterKelas.innerHTML = '<option value="">-- Semua Kelas --</option>' + opsiKelas;
            else filterKelas.innerHTML = '<option value="">-- Tampilkan Kelas Anda --</option>' + opsiKelas;
            
            if(selectKelasForm) selectKelasForm.innerHTML = '<option value="">Belum ada kelas</option>' + opsiKelas;
            if(selectTarikKelas) selectTarikKelas.innerHTML = '<option value="">-- Pilih Kelas --</option>' + opsiKelas;

            // Memuat Daftar Santri
            santriDataUtama = await api.get('dapodik_santri', 'select=*&order=nama_santri.asc');
            
            // Render Awal Tabel
            if (currentUserRole === 'admin') {
                renderTable(santriDataUtama); // Admin langsung lihat semua
            } else {
                renderTable([]); // Guru melihat tabel kosong sampai dia memfilter kelasnya
            }
        } catch (error) {
            if(tbody) tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">Gagal memuat database.</td></tr>`;
        }
    };

    const renderTable = (data) => {
        if(!tbody) return;
        if (data.length === 0) {
            if(currentUserRole === 'guru') {
                tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 30px;"><i class="fas fa-hand-pointer text-muted" style="font-size:2rem; margin-bottom:10px;"></i><br>Silakan pilih kelas Anda di atas<br>untuk melihat daftar santri.</td></tr>`;
            } else {
                tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Tidak ada data santri ditemukan.</td></tr>`;
            }
            return;
        }
        
        tbody.innerHTML = data.map(s => `
            <tr>
                <td data-label="Pilih"><input type="checkbox" class="check-item" value="${s.id}"></td>
                <td data-label="NIS" style="font-weight: 600; font-size: 0.85rem;">${s.nis || '-'}</td>
                <td data-label="Nama Lengkap">
                    <span class="clickable-name" onclick="bukaProfil('${s.id}')">${s.nama_santri}</span>
                    <small style="color:var(--text-muted);">${s.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</small>
                </td>
                <td data-label="Kelas">
                    <span style="background:var(--hover-bg); padding:4px 8px; border-radius:6px; font-size:0.75rem;"><i class="fas fa-tag text-info"></i> ${s.nama_kelas || 'Belum ada'}</span>
                </td>
                <td data-label="Aksi" style="white-space: nowrap;">
                    ${currentUserRole === 'admin' ? `<button class="btn-action-sm text-info btn-edit" data-id="${s.id}" title="Edit Manual"><i class="fas fa-edit"></i></button>` : ''}
                    ${currentUserRole === 'guru' ? `<button class="btn-action-sm text-danger btn-keluarkan" data-id="${s.id}" title="Keluarkan dari Kelas"><i class="fas fa-sign-out-alt"></i></button>` : ''}
                </td>
            </tr>
        `).join('');

        document.querySelectorAll('.btn-edit').forEach(b => b.addEventListener('click', handleEdit));
        document.querySelectorAll('.btn-keluarkan').forEach(b => b.addEventListener('click', handleKeluarkan));
    };

    // ============================================
    // LOGIKA TARIK SANTRI (KHUSUS GURU)
    // ============================================
    if(document.getElementById('btnTarikSantri')) {
        document.getElementById('btnTarikSantri').addEventListener('click', () => {
            // Saring santri yang belum punya kelas
            const belumAdaKelas = santriDataUtama.filter(s => !s.nama_kelas || s.nama_kelas.trim() === '');
            
            const listTbody = document.getElementById('listTarikSantri');
            if (belumAdaKelas.length === 0) {
                listTbody.innerHTML = `<tr><td colspan="2" style="text-align:center;">Semua santri di database sudah memiliki kelas.</td></tr>`;
            } else {
                listTbody.innerHTML = belumAdaKelas.map(s => `
                    <tr>
                        <td style="text-align:center;"><input type="checkbox" class="chk-tarik" value="${s.id}"></td>
                        <td>
                            <div style="font-weight:600; font-size:0.9rem;">${s.nama_santri}</div>
                            <div style="font-size:0.75rem; color:var(--text-muted);">NIS: ${s.nis || '-'} • JK: ${s.jenis_kelamin}</div>
                        </td>
                    </tr>
                `).join('');
            }
            
            document.getElementById('checkAllTarik').checked = false;
            document.getElementById('tarikKelasTujuan').value = '';
            document.getElementById('modalTarik').classList.add('active');
        });
    }

    if(document.getElementById('checkAllTarik')) {
        document.getElementById('checkAllTarik').addEventListener('change', (e) => {
            document.querySelectorAll('.chk-tarik').forEach(chk => chk.checked = e.target.checked);
        });
    }

    if(document.getElementById('btnProsesTarik')) {
        document.getElementById('btnProsesTarik').addEventListener('click', async (e) => {
            const kelasTujuan = document.getElementById('tarikKelasTujuan').value;
            if(!kelasTujuan) return alert("Silakan pilih Kelas Tujuan terlebih dahulu!");
            
            const checked = document.querySelectorAll('.chk-tarik:checked');
            if(checked.length === 0) return alert("Pilih minimal 1 santri untuk ditarik!");

            const btn = e.currentTarget;
            btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sedang Menarik Data...`;

            try {
                // Proses penyimpanan massal (Multiple Update)
                const promises = Array.from(checked).map(chk => 
                    api.update('dapodik_santri', chk.value, { nama_kelas: kelasTujuan })
                );
                await Promise.all(promises);
                
                document.getElementById('modalTarik').classList.remove('active');
                alert(`Sukses! ${checked.length} santri berhasil ditarik masuk ke kelas ${kelasTujuan}.`);
                
                // Ubah filter langsung ke kelas yang baru saja diisi agar guru bisa melihat hasilnya
                filterKelas.value = kelasTujuan;
                await loadData();
                filterData(); 
            } catch(error) {
                alert("Gagal memproses data. Coba lagi.");
            } finally {
                btn.innerHTML = `<i class="fas fa-download"></i> Masukkan ke Kelas`;
            }
        });
    }

    // ============================================
    // LOGIKA KELUARKAN SANTRI DARI KELAS (GURU)
    // ============================================
    const handleKeluarkan = async (e) => {
        if(confirm("Yakin ingin mengeluarkan santri ini dari kelas Anda? (Data santri tidak akan dihapus dari sistem, hanya status kelasnya saja yang hilang).")) {
            e.currentTarget.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
            try {
                await api.update('dapodik_santri', e.currentTarget.getAttribute('data-id'), { nama_kelas: null });
                await loadData();
                filterData(); // Pertahankan tampilan kelas saat ini
            } catch (err) {
                alert("Gagal mengeluarkan santri.");
            }
        }
    };


    // ============================================
    // PENCARIAN & FILTER
    // ============================================
    if(filterKelas) filterKelas.addEventListener('change', filterData);
    if(document.getElementById('searchSantri')) document.getElementById('searchSantri').addEventListener('input', filterData);
    
    function filterData() {
        const keyword = document.getElementById('searchSantri').value.toLowerCase();
        const kelas = filterKelas.value;
        
        let filtered = [];
        
        if (currentUserRole === 'guru') {
            // Guru wajib memilih kelas untuk melihat data
            if(kelas === "") {
                renderTable([]); // Kosongkan tabel jika tidak ada kelas yang dipilih
                return;
            }
            filtered = santriDataUtama.filter(s => s.nama_kelas === kelas);
        } else {
            // Admin bisa melihat semua atau difilter
            filtered = santriDataUtama.filter(s => (kelas === "" || s.nama_kelas === kelas));
        }

        // Terapkan pencarian kata kunci
        if (keyword) {
            filtered = filtered.filter(s => s.nama_santri.toLowerCase().includes(keyword) || (s.nis && s.nis.toLowerCase().includes(keyword)));
        }

        renderTable(filtered);
    }

    // ============================================
    // FITUR STANDAR (BUAT KELAS, EDIT PROFIL, DAPODIK)
    // ============================================
    window.bukaProfil = (id) => {
        const s = santriDataUtama.find(x => x.id === id);
        if(!s) return;
        document.getElementById('profAvatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(s.nama_santri)}&background=F0DCD7&color=4F567D&size=200&font-size=0.33&bold=true`;
        document.getElementById('profName').textContent = s.nama_santri;
        document.getElementById('profBio').textContent = `NIS: ${s.nis || '-'} • ${s.nama_kelas || 'Tanpa Kelas'}`;
        
        const btnWa = document.querySelector('.profile-actions .fab.fa-whatsapp');
        if(btnWa) {
            btnWa.parentElement.onclick = () => {
                if(s.no_wa) window.open(`https://wa.me/${s.no_wa.replace(/[^0-9]/g, '')}`, '_blank');
                else alert("Nomor WhatsApp tidak tersedia untuk santri ini.");
            };
        }

        const btnEditProf = document.getElementById('btnEditDariProfil');
        if(currentUserRole === 'admin') {
            btnEditProf.style.display = 'inline-block';
            btnEditProf.onclick = () => {
                document.getElementById('modalProfil').classList.remove('active');
                bukaFormEdit(s);
            };
        } else {
            btnEditProf.style.display = 'none'; // Guru tidak boleh edit profil utama
        }

        document.getElementById('modalProfil').classList.add('active');
    };

    // Logika Buat Kelas
    if(document.getElementById('btnTambahKelas')) {
        document.getElementById('btnTambahKelas').addEventListener('click', () => {
            document.getElementById('formKelas').reset();
            document.querySelectorAll('.day-chip').forEach(c => c.classList.remove('active'));
            document.getElementById('modalKelas').classList.add('active');
        });
    }

    document.querySelectorAll('.day-chip').forEach(chip => {
        chip.addEventListener('click', function() { this.classList.toggle('active'); });
    });

    if(document.getElementById('formKelas')) {
        document.getElementById('formKelas').addEventListener('submit', async (e) => {
            e.preventDefault();
            const selectedDays = Array.from(document.querySelectorAll('.day-chip.active')).map(chip => chip.getAttribute('data-hari'));
            if(selectedDays.length === 0) return alert("Silakan pilih minimal 1 hari belajar!");
            const btn = document.getElementById('btnSimpanKelas');
            btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Menyimpan...`;

            try {
                await api.post('kelas', { 
                    nama_kelas: document.getElementById('inputNamaKelas').value, 
                    jam_kelas: `${document.getElementById('inputJamMulai').value} - ${document.getElementById('inputJamSelesai').value}`, 
                    hari_kelas: selectedDays.join(', ')
                });
                document.getElementById('modalKelas').classList.remove('active');
                await loadData();
                alert("Kelas berhasil dibuat! Silakan klik 'Tarik Santri' untuk memasukkan murid.");
            } catch(error) { alert("Gagal menyimpan kelas."); } 
            finally { btn.innerHTML = `<i class="fas fa-save"></i> Simpan Kelas`; }
        });
    }

    // Logika Tambah/Edit Santri Manual (Khusus Admin)
    if(document.getElementById('btnTambahSantri')) {
        document.getElementById('btnTambahSantri').addEventListener('click', () => {
            document.getElementById('formSantri').reset();
            document.getElementById('santriId').value = '';
            document.getElementById('modalTitle').textContent = 'Tambah Santri Manual';
            document.getElementById('modalSantri').classList.add('active');
        });
    }

    const bukaFormEdit = (santri) => {
        document.getElementById('santriId').value = santri.id;
        document.getElementById('nis').value = santri.nis || '';
        document.getElementById('nama').value = santri.nama_santri;
        document.getElementById('jk').value = santri.jenis_kelamin;
        document.getElementById('kelasId').value = santri.nama_kelas || '';
        document.getElementById('modalTitle').textContent = 'Edit Data Santri';
        document.getElementById('modalSantri').classList.add('active');
    };
    
    const handleEdit = (e) => {
        const s = santriDataUtama.find(x => x.id === e.currentTarget.getAttribute('data-id'));
        if(s) bukaFormEdit(s);
    };

    if(document.getElementById('formSantri')) {
        document.getElementById('formSantri').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('btnSimpanSantri');
            btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Menyimpan...`;
            const id = document.getElementById('santriId').value;
            const payload = {
                nis: document.getElementById('nis').value,
                nama_santri: document.getElementById('nama').value,
                jenis_kelamin: document.getElementById('jk').value,
                nama_kelas: document.getElementById('kelasId').value
            };
            try {
                if(id) await api.update('dapodik_santri', id, payload);
                else await api.post('dapodik_santri', payload);
                document.getElementById('modalSantri').classList.remove('active');
                await loadData();
                filterData();
            } catch (error) { alert("Gagal menyimpan data."); } 
            finally { btn.innerHTML = 'Simpan Data'; }
        });
    }

    // ============================================
    // DAPODIK UPLOAD & EXPORT (KHUSUS ADMIN)
    // ============================================
    const btnImport = document.getElementById('btnImportExcel');
    const fileInput = document.getElementById('fileExcel');

    if(btnImport && fileInput) {
        btnImport.addEventListener('click', () => fileInput.click()); 
        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if(!file) return;
            if (typeof window.XLSX === 'undefined') return alert("Tunggu sebentar, sistem sedang memuat komponen pembaca Excel.");
            btnImport.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Mengunggah...`;

            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const data = new Uint8Array(event.target.result);
                    const workbook = XLSX.read(data, {type: 'array'});
                    const firstSheetName = workbook.SheetNames[0];
                    const jsonArray = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName], { header: 1, defval: "" }); 
                    let successCount = 0;
                    
                    for (let i = 1; i < jsonArray.length; i++) {
                        const row = jsonArray[i];
                        if (row.length === 0 || !row.some(cell => cell !== "")) continue;
                        
                        // Menyesuaikan dengan format kolom di Excel Dapodik yang sebelumnya disepakati
                        const nama = row[1] || ''; 
                        const nis = row[2] || ''; 
                        const jkRaw = row[3] || ''; 
                        const tempatLahir = row[4] || ''; 
                        const tanggalLahir = row[5] || ''; 
                        const nik = row[6] || ''; 
                        const alamat = row[7] || ''; 
                        const asalSekolah = row[8] || ''; 
                        const namaAyah = row[9] || ''; 
                        const statusAyah = row[10] || ''; 
                        const namaIbu = row[11] || ''; 
                        const statusIbu = row[12] || ''; 
                        const noWa = row[13] || ''; 
                        const wali = row[14] || ''; 

                        if(String(nama).trim() !== "") {
                            let jkFix = 'L'; 
                            if (jkRaw.toString().toUpperCase().includes('P')) { jkFix = 'P'; }
                            try {
                                await api.post('dapodik_santri', {
                                    nis: String(nis).trim(), nama_santri: String(nama).trim(), jenis_kelamin: jkFix,
                                    tempat_lahir: String(tempatLahir).trim(), tanggal_lahir: String(tanggalLahir).trim(), nik: String(nik).trim(),
                                    alamat: String(alamat).trim(), asal_sekolah: String(asalSekolah).trim(), nama_ayah: String(namaAyah).trim(),
                                    status_ayah: String(statusAyah).trim(), nama_ibu: String(namaIbu).trim(), status_ibu: String(statusIbu).trim(),
                                    no_wa: String(noWa).trim(), wali: String(wali).trim(), nama_kelas: null // Default belum ada kelas
                                });
                                successCount++;
                            } catch (dbError) { console.error("Lewati baris:", dbError); }
                        }
                    }
                    alert(successCount > 0 ? `Upload Sukses! Berhasil mengimpor ${successCount} data santri secara lengkap.` : `Gagal: Tidak ada data valid yang tersimpan.`);
                    await loadData(); 
                } catch (error) { alert("Gagal mengunggah: " + error.message); } 
                finally { btnImport.innerHTML = `<i class="fas fa-file-excel"></i> Dapodik`; fileInput.value = ''; }
            };
            reader.readAsArrayBuffer(file);
        });
    }

    if(document.getElementById('btnExportExcel')) {
        document.getElementById('btnExportExcel').addEventListener('click', () => {
            if (typeof window.XLSX === 'undefined') return alert("Tunggu sistem memuat Excel.");
            if (santriDataUtama.length === 0) return alert("Belum ada data.");
            const btn = document.getElementById('btnExportExcel');
            btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i>...`;
            
            // Format Export Standar
            const ws = XLSX.utils.json_to_sheet(santriDataUtama.map((s, index) => ({
                "NO": index + 1, "NAMA SANTRI": s.nama_santri || "", "NIS": s.nis || "", "L/P": s.jenis_kelamin || "",
                "KELAS TERDAFTAR": s.nama_kelas || "Belum ada", "NOMOR WA": s.no_wa || ""
            })));
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Data");
            XLSX.writeFile(wb, "Data_Santri.xlsx");
            btn.innerHTML = `<i class="fas fa-download"></i> Export`;
        });
    }

    loadData();
}
