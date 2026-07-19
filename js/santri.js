/**
 * ==================================================
 * BAGIAN 8: MODUL DATA SANTRI (SUPER canggih)
 * File: js/santri.js
 * ==================================================
 */
import { api } from './api.js';

let santriData = [];
let kelasData = [];

// 1. Ekspor Struktur HTML UI
export function renderSantri() {
    return `
        <!-- Area Manajemen Kelas & Import -->
        <div style="background: var(--surface); padding: 20px; border-radius: 16px; margin-bottom: 20px; border: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
            <div>
                <h4 style="margin: 0; font-size: 1rem; color: var(--text-main);"><i class="fas fa-chalkboard-teacher text-info"></i> Pengaturan Kelas</h4>
                <p style="margin: 3px 0 0; font-size: 0.75rem; color: var(--text-muted);">Buat kelas sebelum menambahkan santri.</p>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="btn-secondary" id="btnTambahKelas"><i class="fas fa-plus"></i> Kelas Baru</button>
                <input type="file" id="fileExcel" accept=".xlsx, .xls" style="display: none;">
                <button class="btn-primary" id="btnImportExcel" style="background: var(--clr-dongker);"><i class="fas fa-file-excel"></i> Upload Dapodik</button>
            </div>
        </div>

        <!-- Toolbar Utama Tabel -->
        <div class="toolbar-actions">
            <div class="search-filter-group">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="searchSantri" placeholder="Cari nama santri...">
                </div>
                <select class="filter-select" id="filterKelas">
                    <option value="">Semua Kelas</option>
                    <!-- Options dimuat dinamis -->
                </select>
            </div>
            <div class="action-buttons">
                <button class="btn-secondary" id="btnExportExcel"><i class="fas fa-download"></i> Export</button>
                <button class="btn-primary" id="btnTambahSantri"><i class="fas fa-user-plus"></i> Tambah Santri</button>
            </div>
        </div>

        <!-- Tabel Data -->
        <div class="custom-table-container">
            <table class="custom-table">
                <thead>
                    <tr>
                        <th style="width: 50px;"><input type="checkbox" id="checkAll"></th>
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

        <!-- Modal Tambah/Edit Santri -->
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
                        <label class="form-label">Pilih Kelas</label>
                        <select id="kelasId" class="form-select" required>
                            <!-- Diisi dinamis -->
                        </select>
                    </div>
                    <button type="submit" class="btn-primary" style="width: 100%; justify-content: center;" id="btnSimpanSantri">Simpan Data</button>
                </form>
            </div>
        </div>

        <!-- Modal Pindah Kelas (Mutasi) -->
        <div class="modal-overlay" id="modalMutasi">
            <div class="modal-card" style="max-width: 400px;">
                <div class="modal-header">
                    <h3 class="modal-title">Mutasi Kelas</h3>
                    <button class="btn-close" onclick="document.getElementById('modalMutasi').classList.remove('active')"><i class="fas fa-times"></i></button>
                </div>
                <div style="margin-bottom: 15px; text-align: center;">
                    <p style="font-size: 0.9rem; color: var(--text-muted);">Pindahkan <strong id="mutasiNama" style="color:var(--text-main);">Santri</strong> ke kelas baru:</p>
                </div>
                <input type="hidden" id="mutasiId">
                <select id="mutasiKelasId" class="form-select" style="margin-bottom: 20px;"></select>
                <button class="btn-primary" style="width: 100%; justify-content: center;" id="btnSimpanMutasi"><i class="fas fa-exchange-alt"></i> Pindahkan Sekarang</button>
            </div>
        </div>

        <!-- Kartu Profil Santri (Estetik) -->
        <div class="modal-overlay" id="modalProfil">
            <div class="profile-card">
                <button class="profile-close" onclick="document.getElementById('modalProfil').classList.remove('active')"><i class="fas fa-times"></i></button>
                <div class="profile-cover"></div>
                <div class="profile-avatar-wrapper">
                    <!-- Menggunakan UI-Avatars beresolusi tinggi sebagai placeholder rapi -->
                    <img src="" class="profile-avatar" id="profAvatar">
                </div>
                <div class="profile-info">
                    <h2 id="profName">Nama Santri</h2>
                    <p id="profBio">NIS: 000 • Kelas -</p>
                </div>
                <div class="profile-stats">
                    <div class="stat-item">
                        <h3 id="profHafalan">Juz 30</h3>
                        <p>Hafalan</p>
                    </div>
                    <div class="stat-item">
                        <h3 id="profHadir">95%</h3>
                        <p>Hadir</p>
                    </div>
                    <div class="stat-item">
                        <h3 id="profNilai">A</h3>
                        <p>Nilai</p>
                    </div>
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

// 2. Logika Utama
export async function initSantri() {
    // Referensi Elemen
    const tbody = document.getElementById('tableBodySantri');
    const filterKelas = document.getElementById('filterKelas');
    const selectKelasForm = document.getElementById('kelasId');
    const selectMutasiKelas = document.getElementById('mutasiKelasId');

    // MENGAMBIL DATA KELAS & SANTRI
    const loadData = async () => {
        try {
            // Ambil daftar kelas
            kelasData = await api.get('tabel_kelas', 'select=*');
            
            // Render Opsi Dropdown Kelas
            let opsiKelas = '';
            kelasData.forEach(k => opsiKelas += `<option value="${k.nama_kelas}">${k.nama_kelas} (${k.nama_ustadz})</option>`);
            
            filterKelas.innerHTML = '<option value="">Semua Kelas</option>' + opsiKelas;
            selectKelasForm.innerHTML = opsiKelas;
            selectMutasiKelas.innerHTML = opsiKelas;

            // Ambil data santri
            santriData = await api.get('dapodik_santri', 'select=*&order=nama_santri.asc');
            renderTable(santriData);
        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">Gagal memuat data.</td></tr>`;
        }
    };

    // RENDER TABEL
    const renderTable = (data) => {
        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Tidak ada data santri ditemukan.</td></tr>`;
            return;
        }
        tbody.innerHTML = data.map(s => `
            <tr>
                <td><input type="checkbox" class="check-item" value="${s.id}"></td>
                <td style="font-weight: 600; font-size: 0.85rem;">${s.nis}</td>
                <td>
                    <span class="clickable-name" onclick="bukaProfil('${s.id}')">${s.nama_santri}</span>
                    <br><small style="color:var(--text-muted);">${s.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</small>
                </td>
                <td><span style="background:var(--hover-bg); padding:4px 8px; border-radius:6px; font-size:0.75rem;"><i class="fas fa-tag text-info"></i> ${s.nama_kelas || 'Belum ada kelas'}</span></td>
                <td style="text-align: center; white-space: nowrap;">
                    <button class="btn-action-sm text-info btn-edit" data-id="${s.id}" title="Edit Data"><i class="fas fa-edit"></i></button>
                    <button class="btn-action-sm text-success btn-mutasi" data-id="${s.id}" title="Pindah Kelas"><i class="fas fa-exchange-alt"></i></button>
                    <button class="btn-action-sm text-danger btn-delete" data-id="${s.id}" title="Hapus"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');

        // Pasang Event Listener Baris
        document.querySelectorAll('.btn-edit').forEach(b => b.addEventListener('click', handleEdit));
        document.querySelectorAll('.btn-mutasi').forEach(b => b.addEventListener('click', handleMutasi));
        document.querySelectorAll('.btn-delete').forEach(b => b.addEventListener('click', handleDelete));
    };

    // FUNGSI BUKA KARTU PROFIL (Di-expose ke window agar bisa dipanggil HTML)
    window.bukaProfil = (id) => {
        const s = santriData.find(x => x.id === id);
        if(!s) return;
        
        // Atur Gambar Placeholder menggunakan UI-Avatars (Warna menyesuaikan tema kita)
        document.getElementById('profAvatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(s.nama_santri)}&background=F0DCD7&color=4F567D&size=200&font-size=0.33&bold=true`;
        
        document.getElementById('profName').textContent = s.nama_santri;
        document.getElementById('profBio').textContent = `NIS: ${s.nis} • ${s.nama_kelas || 'Tanpa Kelas'}`;
        
        // Tombol Edit di Profil
        document.getElementById('btnEditDariProfil').onclick = () => {
            document.getElementById('modalProfil').classList.remove('active');
            bukaFormEdit(s);
        };
        
        document.getElementById('modalProfil').classList.add('active');
    };

    // FILTER & PENCARIAN
    filterKelas.addEventListener('change', () => filterData());
    document.getElementById('searchSantri').addEventListener('input', () => filterData());
    
    function filterData() {
        const keyword = document.getElementById('searchSantri').value.toLowerCase();
        const kelas = filterKelas.value;
        const filtered = santriData.filter(s => 
            (s.nama_santri.toLowerCase().includes(keyword) || s.nis.toLowerCase().includes(keyword)) &&
            (kelas === "" || s.nama_kelas === kelas)
        );
        renderTable(filtered);
    }

    // MANAJEMEN KELAS SEDERHANA
    document.getElementById('btnTambahKelas').addEventListener('click', async () => {
        const namaK = prompt("Masukkan Nama Kelas (Contoh: Tahfidz A):");
        if(!namaK) return;
        const namaU = prompt("Masukkan Nama Ustadz Pengampu (Contoh: Ustadz Fulan):");
        if(namaK && namaU) {
            await api.post('tabel_kelas', { nama_kelas: namaK, nama_ustadz: namaU });
            alert("Kelas berhasil ditambahkan!");
            await loadData();
        }
    });

    // CRUD SANTRI: Form Modal
    document.getElementById('btnTambahSantri').addEventListener('click', () => {
        if(kelasData.length === 0) return alert("Buat Kelas terlebih dahulu sebelum menambah Santri!");
        document.getElementById('formSantri').reset();
        document.getElementById('santriId').value = '';
        document.getElementById('modalTitle').textContent = 'Tambah Santri Baru';
        document.getElementById('modalSantri').classList.add('active');
    });

    const bukaFormEdit = (santri) => {
        document.getElementById('santriId').value = santri.id;
        document.getElementById('nis').value = santri.nis;
        document.getElementById('nama').value = santri.nama_santri;
        document.getElementById('jk').value = santri.jenis_kelamin;
        document.getElementById('kelasId').value = santri.nama_kelas;
        document.getElementById('modalTitle').textContent = 'Edit Data Santri';
        document.getElementById('modalSantri').classList.add('active');
    };
    
    const handleEdit = (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const s = santriData.find(x => x.id === id);
        if(s) bukaFormEdit(s);
    };

    // FORM SUBMIT (Simpan Data)
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
        } catch (error) { alert("Gagal menyimpan data."); } 
        finally { btn.innerHTML = 'Simpan Data'; }
    });

    // FITUR PINDAH KELAS (MUTASI)
    const handleMutasi = (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const s = santriData.find(x => x.id === id);
        if(s) {
            document.getElementById('mutasiId').value = s.id;
            document.getElementById('mutasiNama').textContent = s.nama_santri;
            document.getElementById('mutasiKelasId').value = s.nama_kelas;
            document.getElementById('modalMutasi').classList.add('active');
        }
    };
    
    document.getElementById('btnSimpanMutasi').addEventListener('click', async (e) => {
        const id = document.getElementById('mutasiId').value;
        const kelasBaru = document.getElementById('mutasiKelasId').value;
        const btn = e.currentTarget;
        
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Memproses...`;
        try {
            await api.update('dapodik_santri', id, { nama_kelas: kelasBaru });
            document.getElementById('modalMutasi').classList.remove('active');
            await loadData();
        } catch(error) { alert("Gagal pindah kelas."); }
        finally { btn.innerHTML = `<i class="fas fa-exchange-alt"></i> Pindahkan Sekarang`; }
    });

    // FITUR DELETE
    const handleDelete = async (e) => {
        if(confirm("Yakin hapus santri ini?")) {
            const id = e.currentTarget.getAttribute('data-id');
            e.currentTarget.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
            await api.delete('dapodik_santri', id);
            await loadData();
        }
    };

    // FITUR IMPORT EXCEL (SHEETJS)
    const fileInput = document.getElementById('fileExcel');
    document.getElementById('btnImportExcel').addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if(!file) return;
        
        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);
            
            if(json.length === 0) return alert("File kosong atau format salah.");
            if(!confirm(`Ditemukan ${json.length} data. Yakin ingin import ke database?`)) return;
            
            document.getElementById('btnImportExcel').innerHTML = `<i class="fas fa-spinner fa-spin"></i> Loading...`;
            
            // Loop Insert Data
            for(let row of json) {
                // Asumsi kolom excel: NIS, NAMA, JK, KELAS
                let payload = {
                    nis: String(row.NIS || row.nis || ''),
                    nama_santri: row.NAMA || row.Nama || row.nama_santri || '',
                    jenis_kelamin: row.JK || row.jk || 'L',
                    nama_kelas: row.KELAS || row.Kelas || row.nama_kelas || ''
                };
                if(payload.nis && payload.nama_santri) {
                    await api.post('dapodik_santri', payload);
                }
            }
            alert("Import Selesai!");
            document.getElementById('btnImportExcel').innerHTML = `<i class="fas fa-file-excel"></i> Upload Dapodik`;
            fileInput.value = "";
            await loadData();
        };
        reader.readAsArrayBuffer(file);
    });

    // FITUR EXPORT EXCEL
    document.getElementById('btnExportExcel').addEventListener('click', () => {
        // Ambil data yang sedang tampil di layar saat ini (hasil filter)
        const visibleRows = document.querySelectorAll('#tableBodySantri tr:not(:has(td[colspan]))');
        const exportData = [];
        
        visibleRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            exportData.push({
                "NIS": cells[1].innerText,
                "Nama Santri": cells[2].querySelector('.clickable-name').innerText,
                "Kelas": cells[3].innerText.trim()
            });
        });

        if(exportData.length === 0) return alert("Tidak ada data untuk di-export.");
        
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data_Santri");
        XLSX.writeFile(workbook, "Data_Santri_RQ_Kamila.xlsx");
    });

    // Start
    loadData();
}
