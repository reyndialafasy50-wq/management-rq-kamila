/**
 * ==================================================
 * BAGIAN 8: MODUL DATA SANTRI
 * File: js/santri.js
 * ==================================================
 */
import { api } from './api.js';

let santriData = [];

// 1. Ekspor HTML Tabel Santri & Modal Form
export function renderSantri() {
    return `
        <div class="toolbar-actions">
            <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" id="searchSantri" placeholder="Cari nama atau NIS...">
            </div>
            <button class="btn-primary" id="btnTambahSantri">
                <i class="fas fa-plus"></i> Tambah Data
            </button>
        </div>

        <div class="custom-table-container">
            <table class="custom-table">
                <thead>
                    <tr>
                        <th>NIS</th>
                        <th>Nama Santri</th>
                        <th>L/P</th>
                        <th>Status</th>
                        <th style="text-align: center;">Aksi</th>
                    </tr>
                </thead>
                <tbody id="tableBodySantri">
                    <tr><td colspan="5" style="text-align:center;">Memuat data dari database...</td></tr>
                </tbody>
            </table>
        </div>

        <!-- Modal Tambah/Edit -->
        <div class="modal-overlay" id="modalSantri">
            <div class="modal-card">
                <div class="modal-header">
                    <h3 class="modal-title" id="modalTitle">Tambah Santri</h3>
                    <button class="btn-close" id="btnCloseModal"><i class="fas fa-times"></i></button>
                </div>
                <form id="formSantri">
                    <input type="hidden" id="santriId">
                    <div class="form-group">
                        <label class="form-label">NIS (Nomor Induk Santri)</label>
                        <input type="text" id="nis" class="form-input" required placeholder="Contoh: 2026001">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Nama Lengkap</label>
                        <input type="text" id="nama" class="form-input" required placeholder="Masukkan nama santri">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Jenis Kelamin</label>
                        <select id="jk" class="form-select" required>
                            <option value="">-- Pilih --</option>
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Status</label>
                        <select id="status" class="form-select" required>
                            <option value="Aktif">Aktif</option>
                            <option value="Tidak Aktif">Tidak Aktif</option>
                            <option value="Lulus">Lulus</option>
                        </select>
                    </div>
                    <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; margin-top: 10px;" id="btnSimpan">
                        <i class="fas fa-save"></i> Simpan Data
                    </button>
                </form>
            </div>
        </div>
    `;
}

// 2. Logika CRUD API
export async function initSantri() {
    const tbody = document.getElementById('tableBodySantri');
    const modal = document.getElementById('modalSantri');
    const form = document.getElementById('formSantri');

    // Mengambil data dari Supabase
    const loadData = async () => {
        try {
            // Panggil API get tabel 'santri', urutkan berdasarkan data terbaru
            santriData = await api.get('santri', 'select=*&order=created_at.desc');
            renderTable(santriData);
        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--clr-koral);">Gagal mengambil data. Periksa koneksi internet.</td></tr>`;
        }
    };

    // Merender baris tabel HTML
    const renderTable = (data) => {
        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Belum ada data santri.</td></tr>`;
            return;
        }
        tbody.innerHTML = data.map(s => `
            <tr>
                <td style="font-weight: 600;">${s.nis}</td>
                <td>${s.nama}</td>
                <td>${s.jk === 'Laki-laki' ? 'L' : 'P'}</td>
                <td>
                    <span style="background: ${s.status==='Aktif' ? 'rgba(117,181,176,0.15)' : 'rgba(243,155,150,0.15)'}; 
                                 color: ${s.status==='Aktif' ? 'var(--primary)' : 'var(--clr-koral)'}; 
                                 padding:4px 8px; border-radius:6px; font-size:0.75rem; font-weight:700;">
                        ${s.status}
                    </span>
                </td>
                <td style="text-align: center; display:flex; gap:8px; justify-content:center;">
                    <button class="btn-action-sm text-info btn-edit" data-id="${s.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn-action-sm text-danger btn-delete" data-id="${s.id}"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');

        // Event Listener Edit & Hapus (Perlu dipasang setelah tabel dirender)
        document.querySelectorAll('.btn-edit').forEach(btn => btn.addEventListener('click', handleEdit));
        document.querySelectorAll('.btn-delete').forEach(btn => btn.addEventListener('click', handleDelete));
    };

    // Buka Modal Tambah
    document.getElementById('btnTambahSantri').addEventListener('click', () => {
        form.reset();
        document.getElementById('santriId').value = '';
        document.getElementById('modalTitle').textContent = 'Tambah Santri Baru';
        modal.classList.add('active');
    });

    // Tutup Modal
    document.getElementById('btnCloseModal').addEventListener('click', () => modal.classList.remove('active'));

    // Form Submit (Create & Update)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btnSimpan = document.getElementById('btnSimpan');
        btnSimpan.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Menyimpan...`;
        btnSimpan.disabled = true;

        const id = document.getElementById('santriId').value;
        const payload = {
            nis: document.getElementById('nis').value,
            nama: document.getElementById('nama').value,
            jk: document.getElementById('jk').value,
            status: document.getElementById('status').value
        };

        try {
            if (id) {
                await api.update('santri', id, payload); // Update
            } else {
                await api.post('santri', payload); // Insert
            }
            modal.classList.remove('active');
            await loadData(); // Refresh tabel
        } catch (error) {
            alert("Gagal menyimpan. Pastikan NIS tidak duplikat.");
        } finally {
            btnSimpan.innerHTML = `<i class="fas fa-save"></i> Simpan Data`;
            btnSimpan.disabled = false;
        }
    });

    // Handle Edit
    const handleEdit = (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const santri = santriData.find(s => s.id === id);
        if(santri) {
            document.getElementById('santriId').value = santri.id;
            document.getElementById('nis').value = santri.nis;
            document.getElementById('nama').value = santri.nama;
            document.getElementById('jk').value = santri.jk;
            document.getElementById('status').value = santri.status;
            document.getElementById('modalTitle').textContent = 'Edit Data Santri';
            modal.classList.add('active');
        }
    };

    // Handle Delete
    const handleDelete = async (e) => {
        if(confirm("Yakin ingin menghapus santri ini? Data hafalan & kehadiran juga akan terhapus!")) {
            const id = e.currentTarget.getAttribute('data-id');
            e.currentTarget.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
            try {
                await api.delete('santri', id);
                await loadData(); // Refresh tabel
            } catch (error) {
                alert("Gagal menghapus data.");
                await loadData();
            }
        }
    };

    // Fitur Pencarian Real-time
    document.getElementById('searchSantri').addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();
        const filtered = santriData.filter(s => 
            s.nama.toLowerCase().includes(keyword) || s.nis.toLowerCase().includes(keyword)
        );
        renderTable(filtered);
    });

    // Panggil data saat modul dimuat
    loadData();
}
