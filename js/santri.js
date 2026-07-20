/**
 * ==================================================
 * BAGIAN 8: MODUL DATA SANTRI (Dapodik Brute-Force + Error Log)
 * File: js/santri.js
 * ==================================================
 */
import { api } from './api.js';

let santriData = [];
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
                <p style="margin: 3px 0 0; font-size: 0.75rem; color: var(--text-muted);">Atur kelas, tambah santri, atau unggah data dari Dapodik.</p>
            </div>
            
            <div class="action-grid-3">
                <button class="btn-secondary" id="btnTambahKelas"><i class="fas fa-plus"></i> Kelas</button>
                <button class="btn-secondary" id="btnTambahSantri"><i class="fas fa-user-plus"></i> Santri</button>
                <input type="file" id="fileExcel" accept=".xlsx, .xls" style="display: none;">
                <button class="btn-secondary" id="btnImportExcel"><i class="fas fa-file-excel"></i> Dapodik</button>
            </div>
        </div>

        <div class="toolbar-flex">
            <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" id="searchSantri" placeholder="Cari santri...">
            </div>
            <select class="filter-select" id="filterKelas">
                <option value="">Semua Kelas</option>
            </select>
            <button class="btn-secondary btn-export" id="btnExportExcel"><i class="fas fa-download"></i> Export</button>
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
                    
                    <button type="submit" class="btn-modern-submit" id="btnSimpanKelas">
                        <i class="fas fa-save"></i> Simpan Kelas
                    </button>
                </form>
            </div>
        </div>

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
                        <select id="kelasId" class="form-select" required></select>
                    </div>
                    <button type="submit" class="btn-primary" style="width: 100%; justify-content: center;" id="btnSimpanSantri">Simpan Data</button>
                </form>
            </div>
        </div>

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
                <div class="profile-stats">
                    <div class="stat-item"><h3 id="profHafalan">Juz 30</h3><p>Hafalan</p></div>
                    <div class="stat-item"><h3 id="profHadir">95%</h3><p>Hadir</p></div>
                    <div class="stat-item"><h3 id="profNilai">A</h3><p>Nilai</p></div>
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

    const tbody = document.getElementById('tableBodySantri');
    const filterKelas = document.getElementById('filterKelas');
    const selectKelasForm = document.getElementById('kelasId');
    const selectMutasiKelas = document.getElementById('mutasiKelasId');

    const loadData = async () => {
        try {
            kelasData = await api.get('kelas', 'select=*');
            let opsiKelas = '';
            kelasData.forEach(k => {
                const infoHari = k.hari_kelas ? `${k.hari_kelas} | ` : '';
                opsiKelas += `<option value="${k.nama_kelas}">${k.nama_kelas} (${infoHari}${k.jam_kelas})</option>`;
            });
            
            filterKelas.innerHTML = '<option value="">Semua Kelas</option>' + opsiKelas;
            selectKelasForm.innerHTML = opsiKelas;
            selectMutasiKelas.innerHTML = opsiKelas;

            santriData = await api.get('dapodik_santri', 'select=*&order=nama_santri.asc');
            renderTable(santriData);
        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">Gagal memuat data.</td></tr>`;
        }
    };

    const renderTable = (data) => {
        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Tidak ada data santri ditemukan.</td></tr>`;
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
                    <span style="background:var(--hover-bg); padding:4px 8px; border-radius:6px; font-size:0.75rem;"><i class="fas fa-tag text-info"></i> ${s.nama_kelas || 'Belum ada kelas'}</span>
                </td>
                <td data-label="Aksi" style="white-space: nowrap;">
                    <button class="btn-action-sm text-info btn-edit" data-id="${s.id}" title="Edit Data"><i class="fas fa-edit"></i></button>
                    <button class="btn-action-sm text-success btn-mutasi" data-id="${s.id}" title="Pindah Kelas"><i class="fas fa-exchange-alt"></i></button>
                    <button class="btn-action-sm text-danger btn-delete" data-id="${s.id}" title="Hapus"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');

        document.querySelectorAll('.btn-edit').forEach(b => b.addEventListener('click', handleEdit));
        document.querySelectorAll('.btn-mutasi').forEach(b => b.addEventListener('click', handleMutasi));
        document.querySelectorAll('.btn-delete').forEach(b => b.addEventListener('click', handleDelete));
    };

    window.bukaProfil = (id) => {
        const s = santriData.find(x => x.id === id);
        if(!s) return;
        document.getElementById('profAvatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(s.nama_santri)}&background=F0DCD7&color=4F567D&size=200&font-size=0.33&bold=true`;
        document.getElementById('profName').textContent = s.nama_santri;
        document.getElementById('profBio').textContent = `NIS: ${s.nis || '-'} • ${s.nama_kelas || 'Tanpa Kelas'}`;
        
        const btnWa = document.querySelector('.profile-actions .fab.fa-whatsapp').parentElement;
        btnWa.onclick = () => {
            if(s.no_wa) window.open(`https://wa.me/${s.no_wa.replace(/[^0-9]/g, '')}`, '_blank');
            else alert("Nomor WhatsApp tidak tersedia untuk santri ini.");
        };

        document.getElementById('btnEditDariProfil').onclick = () => {
            document.getElementById('modalProfil').classList.remove('active');
            bukaFormEdit(s);
        };
        document.getElementById('modalProfil').classList.add('active');
    };

    filterKelas.addEventListener('change', filterData);
    document.getElementById('searchSantri').addEventListener('input', filterData);
    
    function filterData() {
        const keyword = document.getElementById('searchSantri').value.toLowerCase();
        const kelas = filterKelas.value;
        const filtered = santriData.filter(s => 
            (s.nama_santri.toLowerCase().includes(keyword) || (s.nis && s.nis.toLowerCase().includes(keyword))) &&
            (kelas === "" || s.nama_kelas === kelas)
        );
        renderTable(filtered);
    }

    document.getElementById('btnTambahKelas').addEventListener('click', () => {
        document.getElementById('formKelas').reset();
        document.querySelectorAll('.day-chip').forEach(c => c.classList.remove('active'));
        document.getElementById('modalKelas').classList.add('active');
    });

    document.querySelectorAll('.day-chip').forEach(chip => {
        chip.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });

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
        } catch(error) { alert("Gagal menyimpan kelas."); } 
        finally { btn.innerHTML = `<i class="fas fa-save"></i> Simpan Kelas`; }
    });

    document.getElementById('btnTambahSantri').addEventListener('click', () => {
        if(kelasData.length === 0) return alert("Buat Kelas terlebih dahulu sebelum menambah Santri!");
        document.getElementById('formSantri').reset();
        document.getElementById('santriId').value = '';
        document.getElementById('modalTitle').textContent = 'Tambah Santri Baru';
        document.getElementById('modalSantri').classList.add('active');
    });

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
        const s = santriData.find(x => x.id === e.currentTarget.getAttribute('data-id'));
        if(s) bukaFormEdit(s);
    };

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

    const handleMutasi = (e) => {
        const s = santriData.find(x => x.id === e.currentTarget.getAttribute('data-id'));
        if(s) {
            document.getElementById('mutasiId').value = s.id;
            document.getElementById('mutasiNama').textContent = s.nama_santri;
            document.getElementById('mutasiKelasId').value = s.nama_kelas || '';
            document.getElementById('modalMutasi').classList.add('active');
        }
    };
    
    document.getElementById('btnSimpanMutasi').addEventListener('click', async (e) => {
        const btn = e.currentTarget;
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Memproses...`;
        try {
            await api.update('dapodik_santri', document.getElementById('mutasiId').value, { nama_kelas: document.getElementById('mutasiKelasId').value });
            document.getElementById('modalMutasi').classList.remove('active');
            await loadData();
        } catch(error) { alert("Gagal pindah kelas."); }
        finally { btn.innerHTML = `<i class="fas fa-exchange-alt"></i> Pindahkan Sekarang`; }
    });

    const handleDelete = async (e) => {
        if(confirm("Yakin hapus santri ini?")) {
            e.currentTarget.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
            await api.delete('dapodik_santri', e.currentTarget.getAttribute('data-id'));
            await loadData();
        }
    };

    // ============================================
    // LOGIKA EXPORT & IMPORT EXCEL DAPODIK (BRUTE-FORCE INDEX)
    // ============================================
    
    document.getElementById('btnExportExcel').addEventListener('click', () => {
        if (typeof window.XLSX === 'undefined') return alert("Sistem masih memuat komponen Excel. Coba lagi dalam 3 detik.");
        if (santriData.length === 0) return alert("Belum ada data santri untuk diexport!");

        const btn = document.getElementById('btnExportExcel');
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Proses...`;

        const dataToExport = santriData.map((s, index) => ({
            "NO": index + 1,
            "NAMA SANTRI": s.nama_santri || "",
            "NIS": s.nis || "",
            "L/P": s.jenis_kelamin || "",
            "TEMPAT LAHIR": s.tempat_lahir || "",
            "TANGGAL LAHIR": s.tanggal_lahir || "",
            "NIK": s.nik || "",
            "ALAMAT DETAIL": s.alamat || "",
            "ASAL SEKOLAH": s.asal_sekolah || "",
            "NAMA AYAH KANDUNG": s.nama_ayah || "",
            "STATUS AYAH": s.status_ayah || "",
            "NAMA IBU KANDUNG": s.nama_ibu || "",
            "STATUS IBU": s.status_ibu || "",
            "NOMOR WHATSAPP": s.no_wa || "",
            "YANG BERTANGGUNG JAWAB": s.wali || "",
            "STATUS AKTIF": "TRUE" // Dari foto Excel Anda ada kolom TRUE di ujung
        }));

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Data Santri");
        XLSX.writeFile(wb, "Dapodik_Santri_Kamila.xlsx");
        
        btn.innerHTML = `<i class="fas fa-download"></i> Export`;
    });

    const btnImport = document.getElementById('btnImportExcel');
    const fileInput = document.getElementById('fileExcel');

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
                const worksheet = workbook.Sheets[firstSheetName];
                
                // MENGUBAH EXCEL MENJADI ARRAY 2 DIMENSI (Bukan Objek)
                // header: 1 memastikan baris dibaca sebagai array [kolomA, kolomB, dst]
                const jsonArray = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" }); 

                let successCount = 0;
                
                // Mulai dari i = 1 untuk melewati baris pertama (Judul Kolom)
                for (let i = 1; i < jsonArray.length; i++) {
                    const row = jsonArray[i];

                    // Abaikan baris jika kosong melompong
                    if (row.length === 0 || !row.some(cell => cell !== "")) continue;

                    // MENGAMBIL DATA BERDASARKAN URUTAN KOLOM (Sesuai foto Anda)
                    const nama = row[1] || ''; // Kolom B
                    const nis = row[2] || ''; // Kolom C
                    const jkRaw = row[3] || ''; // Kolom D
                    const tempatLahir = row[4] || ''; // Kolom E
                    const tanggalLahir = row[5] || ''; // Kolom F
                    const nik = row[6] || ''; // Kolom G
                    const alamat = row[7] || ''; // Kolom H
                    const asalSekolah = row[8] || ''; // Kolom I
                    const namaAyah = row[9] || ''; // Kolom J
                    const statusAyah = row[10] || ''; // Kolom K
                    const namaIbu = row[11] || ''; // Kolom L
                    const statusIbu = row[12] || ''; // Kolom M
                    const noWa = row[13] || ''; // Kolom N
                    const wali = row[14] || ''; // Kolom O
                    
                    // Kolom kelas tidak terlihat di foto, kita biarkan kosong
                    const kelas = null; 

                    // Jika nama tidak kosong, simpan ke database
                    if(String(nama).trim() !== "") {
                        let jkFix = 'L'; 
                        if (jkRaw.toString().toUpperCase().includes('P')) {
                            jkFix = 'P'; 
                        }

                        // Menggunakan api.post biasa
                        try {
                            await api.post('dapodik_santri', {
                                nis: String(nis).trim(),
                                nama_santri: String(nama).trim(),
                                jenis_kelamin: jkFix,
                                nama_kelas: kelas,
                                tempat_lahir: String(tempatLahir).trim(),
                                tanggal_lahir: String(tanggalLahir).trim(),
                                nik: String(nik).trim(),
                                alamat: String(alamat).trim(),
                                asal_sekolah: String(asalSekolah).trim(),
                                nama_ayah: String(namaAyah).trim(),
                                status_ayah: String(statusAyah).trim(),
                                nama_ibu: String(namaIbu).trim(),
                                status_ibu: String(statusIbu).trim(),
                                no_wa: String(noWa).trim(),
                                wali: String(wali).trim()
                            });
                            successCount++;
                        } catch (dbError) {
                            // Menangkap error dari database secara spesifik
                            console.error("Gagal simpan baris ke-" + (i+1), dbError);
                            throw new Error("Terdapat data yang ditolak oleh database pada baris ke-" + (i+1) + ". Cek console log untuk detailnya.");
                        }
                    }
                }
                
                if(successCount > 0) {
                    alert(`Upload Sukses! Berhasil mengimpor ${successCount} data santri secara lengkap.`);
                } else {
                    alert(`Proses selesai, namun tidak ada data valid yang ditemukan pada baris ke-2 dan seterusnya.`);
                }
                await loadData(); 

            } catch (error) {
                console.error(error);
                alert("Gagal mengunggah: " + error.message);
            } finally {
                btnImport.innerHTML = `<i class="fas fa-file-excel"></i> Dapodik`;
                fileInput.value = ''; 
            }
        };
        reader.readAsArrayBuffer(file);
    });

    loadData();
}
