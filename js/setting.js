/**
 * ==================================================
 * MODUL PENGATURAN USTADZ - VERSI 2 (INTEGRASI FITUR LIBUR)
 * File: js/setting.js
 * ==================================================
 */

import { api } from './api.js';

export const renderSetting = () => {
    return `
    <style>
        .setting-wrapper { display: flex; flex-direction: column; gap: 20px; padding-bottom: 90px; animation: fadeIn 0.4s ease-out; }
        
        .header-title { font-size: 1.2rem; font-weight: 800; color: var(--text-main); margin-bottom: 5px; display: flex; align-items: center; gap: 8px; }
        .header-subtitle { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px; }

        /* TAB NAVIGATION SCROLLABLE */
        .tab-container { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 10px; border-bottom: 2px solid var(--border); margin-bottom: 10px; scrollbar-width: none; }
        .tab-container::-webkit-scrollbar { display: none; }
        .tab-btn { background: var(--surface); border: 1px solid var(--border); padding: 10px 15px; border-radius: 10px; font-size: 0.85rem; font-weight: 700; color: var(--text-muted); cursor: pointer; transition: all 0.2s; white-space: nowrap; display: flex; align-items: center; gap: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.02); }
        .tab-btn.active { background: #3B82F6; color: white; border-color: #3B82F6; box-shadow: 0 4px 10px rgba(59,130,246,0.3); }
        
        /* CARD & FORM */
        .setting-card { background: var(--surface); border-radius: 16px; padding: 22px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid var(--border); margin-bottom: 20px; animation: fadeIn 0.3s ease-out; }
        .card-title { font-size: 1.05rem; font-weight: 800; color: var(--text-main); margin-top: 0; margin-bottom: 15px; border-bottom: 2px solid #F1F5F9; padding-bottom: 10px; display: flex; align-items: center; gap: 8px; }
        
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-size: 0.8rem; font-weight: 800; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        .form-control { width: 100%; padding: 12px 15px; border: 1.5px solid var(--border); border-radius: 10px; background: var(--bg-main); color: var(--text-main); font-size: 0.95rem; font-weight: 600; transition: 0.2s; }
        .form-control:focus { border-color: #3B82F6; outline: none; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        textarea.form-control { resize: vertical; min-height: 100px; line-height: 1.5; font-weight: 500; }
        
        .btn-simpan { width: 100%; padding: 14px; background: linear-gradient(135deg, #3B82F6, #2563EB); color: white; border: none; border-radius: 12px; font-weight: 800; font-size: 0.95rem; cursor: pointer; transition: 0.2s; display: flex; justify-content: center; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(37,99,235,0.2); }
        .btn-simpan:active { transform: scale(0.97); }

        /* KANVAS TANDA TANGAN */
        .canvas-container { border: 2px dashed #CBD5E1; border-radius: 12px; background: #F8FAFC; overflow: hidden; margin-bottom: 15px; position: relative; }
        #canvasTtd { width: 100%; height: 200px; cursor: crosshair; touch-action: none; }
        .btn-clear { position: absolute; top: 10px; right: 10px; background: #FEE2E2; color: #DC2626; border: none; padding: 6px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 700; cursor: pointer; }

        /* TABS PILL UNTUK FITUR LIBUR (DIADAPTASI DARI INPUT HARIAN) */
        .pill-tabs { display: flex; background: #f1f5f9; border-radius: 12px; padding: 4px; gap: 4px; width: 100%; margin-bottom: 8px;}
        .pill-tabs label { padding: 10px 15px; font-size: 0.85rem; font-weight: 700; color: #64748b; cursor: pointer; border-radius: 8px; transition: 0.2s; flex: 1; text-align: center; }
        .pill-tabs input { display: none; }
        .pill-tabs input[value="semua"]:checked + label { background-color: #3B82F6; color: white; box-shadow: 0 2px 5px rgba(0,0,0,0.1);}
        .pill-tabs input[value="pilih"]:checked + label { background-color: #F59E0B; color: white; box-shadow: 0 2px 5px rgba(0,0,0,0.1);}
        
        .checkbox-kelas { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; font-size: 0.9rem; font-weight: 600; color: #334155; cursor: pointer; background: white; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0; }
        .checkbox-kelas:last-child { margin-bottom: 0; }
        .checkbox-kelas input { width: 18px; height: 18px; cursor: pointer; accent-color: #F59E0B; }
    </style>

    <div class="setting-wrapper">
        <div>
            <div class="header-title"><i class="fas fa-user-cog"></i> Ruang Pribadi Ustadz</div>
            <div class="header-subtitle">Kelola profil, keamanan, dan alat bantu laporan Anda.</div>
        </div>

        <!-- MENU NAVIGASI -->
        <div class="tab-container">
            <button class="tab-btn active" data-target="panelProfil"><i class="fas fa-user-shield"></i> Profil & Akun</button>
            <button class="tab-btn" data-target="panelTtd"><i class="fas fa-signature"></i> Tanda Tangan</button>
            <button class="tab-btn" data-target="panelTemplate"><i class="fas fa-comment-dots"></i> Bank Catatan</button>
            <button class="tab-btn" data-target="panelLibur"><i class="fas fa-calendar-times"></i> Atur Libur</button>
        </div>

        <!-- 1. PANEL PROFIL & KEAMANAN -->
        <div id="panelProfil" class="panel-setting">
            <div class="setting-card">
                <h3 class="card-title"><i class="fas fa-id-card"></i> Data Diri</h3>
                <div class="form-group">
                    <label>Nama Lengkap (Sesuai Rapor)</label>
                    <input type="text" class="form-control" placeholder="Contoh: Ust. Fulan, S.Pd.I">
                </div>
                <div class="form-group">
                    <label>Nomor WhatsApp Aktif</label>
                    <input type="tel" class="form-control" placeholder="Mulai dengan 628...">
                </div>
                <button class="btn-simpan"><i class="fas fa-save"></i> Perbarui Profil</button>
            </div>

            <div class="setting-card">
                <h3 class="card-title" style="color: #DC2626; border-bottom-color: #FEE2E2;"><i class="fas fa-lock"></i> Keamanan Akun</h3>
                <div class="form-group">
                    <label>Password Baru</label>
                    <input type="password" class="form-control" placeholder="Masukkan password baru">
                </div>
                <div class="form-group">
                    <label>Konfirmasi Password Baru</label>
                    <input type="password" class="form-control" placeholder="Ketik ulang password">
                </div>
                <button class="btn-simpan" style="background: linear-gradient(135deg, #EF4444, #DC2626); box-shadow: 0 4px 12px rgba(220,38,38,0.2);"><i class="fas fa-key"></i> Ganti Password</button>
            </div>
        </div>

        <!-- 2. PANEL TANDA TANGAN DIGITAL -->
        <div id="panelTtd" class="panel-setting" style="display: none;">
            <div class="setting-card">
                <h3 class="card-title"><i class="fas fa-pen-nib"></i> Tanda Tangan Digital</h3>
                <p style="font-size: 0.85rem; color: #64748B; margin-bottom: 15px;">Tanda tangan di bawah ini akan otomatis ditempelkan pada file Rapor/Laporan PDF Anda.</p>
                
                <div class="canvas-container">
                    <button class="btn-clear" id="btnClearTtd"><i class="fas fa-eraser"></i> Hapus</button>
                    <canvas id="canvasTtd"></canvas>
                </div>
                
                <button class="btn-simpan" style="background: linear-gradient(135deg, #10B981, #059669); box-shadow: 0 4px 12px rgba(16,185,129,0.2);"><i class="fas fa-cloud-upload-alt"></i> Simpan Tanda Tangan</button>
            </div>
        </div>

        <!-- 3. PANEL BANK CATATAN & TEMPLATE -->
        <div id="panelTemplate" class="panel-setting" style="display: none;">
            <div class="setting-card">
                <h3 class="card-title"><i class="fas fa-book-open"></i> Template Catatan Rapor</h3>
                <p style="font-size: 0.85rem; color: #64748B; margin-bottom: 15px;">Simpan kalimat evaluasi standar untuk mempercepat pengisian Rapor Individu.</p>
                <div class="form-group">
                    <label>Kalimat Default Evaluasi</label>
                    <textarea class="form-control" placeholder="Ketik kalimat evaluasi standar di sini..."></textarea>
                </div>
                <button class="btn-simpan"><i class="fas fa-save"></i> Simpan Template Rapor</button>
            </div>

            <div class="setting-card">
                <h3 class="card-title" style="color: #059669; border-bottom-color: #D1FAE5;"><i class="fab fa-whatsapp"></i> Template Pesan Pengantar</h3>
                <p style="font-size: 0.85rem; color: #64748B; margin-bottom: 15px;">Pesan ini akan otomatis tersalin saat Anda membagikan Rapor via WhatsApp.</p>
                <div class="form-group">
                    <label>Pesan WhatsApp Default</label>
                    <textarea class="form-control">Assalamu'alaikum Warahmatullahi Wabarakatuh.&#10;&#10;Ayah/Bunda, berikut kami lampirkan file Laporan Perkembangan (Rapor) Ananda bulan ini. Mohon berkenan untuk ditinjau.&#10;&#10;Jazakumullah Khairan.</textarea>
                </div>
                <button class="btn-simpan" style="background: linear-gradient(135deg, #10B981, #059669); box-shadow: 0 4px 12px rgba(16,185,129,0.2);"><i class="fas fa-save"></i> Simpan Template WA</button>
            </div>
        </div>

        <!-- 4. PANEL ATUR LIBUR (DIADAPTASI DARI DESAIN USTADZ) -->
        <div id="panelLibur" class="panel-setting" style="display: none;">
            <div class="setting-card" style="border-top: 4px solid #F59E0B;">
                <h3 class="card-title" style="color: #D97706; border-bottom-color: #FEF3C7; padding-top:5px;"><i class="fas fa-calendar-times"></i> Atur Libur Kelas</h3>
                
                <div class="form-group">
                    <label>Tanggal Libur</label>
                    <input type="date" id="udzurTanggal" class="form-control" value="${new Date().toISOString().slice(0,10)}">
                </div>
                
                <div class="form-group">
                    <label>Alasan Utama</label>
                    <select id="udzurAlasan" class="form-control">
                        <option value="Ustadz Izin (Ada Keperluan)">Ustadz Izin (Ada Keperluan)</option>
                        <option value="Ustadz Sakit">Ustadz Sakit</option>
                        <option value="Libur Nasional">Libur Nasional / Cuti Bersama</option>
                        <option value="Lainnya">Lainnya (Ketik Manual)...</option>
                    </select>
                    <input type="text" id="udzurAlasanManual" placeholder="Ketik alasan spesifik..." class="form-control" style="display:none; margin-top:8px;">
                </div>
                
                <div class="form-group">
                    <label>Cakupan Libur</label>
                    <div class="pill-tabs">
                        <input type="radio" name="udzur_cakupan" id="udzur_semua" value="semua" checked>
                        <label for="udzur_semua">Semua Kelas</label>
                        <input type="radio" name="udzur_cakupan" id="udzur_pilih" value="pilih">
                        <label for="udzur_pilih">Pilih Kelas</label>
                    </div>
                </div>
                
                <!-- WADAH CHECKBOX KELAS (DARI DATABASE) -->
                <div id="udzurPilihanKelas" style="display:none; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; max-height: 200px; overflow-y: auto; margin-bottom: 20px;">
                    <div style="text-align:center; font-size:0.85rem; color:#94a3b8;"><i class="fas fa-spinner fa-spin"></i> Memuat daftar kelas...</div>
                </div>
                
                <button class="btn-simpan" id="btnSimpanLibur" style="background: linear-gradient(135deg, #EF4444, #DC2626); box-shadow: 0 4px 12px rgba(220,38,38,0.2);"><i class="fas fa-save"></i> Simpan Status Libur</button>
            </div>
        </div>

    </div>
    `;
};

export const initSetting = async () => {
    // ==========================================
    // 1. LOGIKA NAVIGASI TAB
    // ==========================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.panel-setting');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            panels.forEach(p => p.style.display = 'none');
            
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).style.display = 'block';

            if (targetId === 'panelTtd') resizeCanvas();
        });
    });

    // ==========================================
    // 2. LOGIKA KANVAS TANDA TANGAN
    // ==========================================
    const canvas = document.getElementById('canvasTtd');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    const resizeCanvas = () => {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = 200; 
        ctx.strokeStyle = "#1E293B"; // Warna tinta hitam kebiruan (elegan)
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
    };

    canvas.addEventListener('mousedown', (e) => { isDrawing = true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY); });
    canvas.addEventListener('mousemove', (e) => { if (isDrawing) { ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke(); } });
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);

    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault(); isDrawing = true;
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
    });
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault(); if (!isDrawing) return;
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
        ctx.stroke();
    });
    canvas.addEventListener('touchend', () => isDrawing = false);

    document.getElementById('btnClearTtd').addEventListener('click', () => { ctx.clearRect(0, 0, canvas.width, canvas.height); });
    window.addEventListener('resize', () => {
        if (document.getElementById('panelTtd').style.display === 'block') {
            const dataUrl = canvas.toDataURL(); resizeCanvas();
            const img = new Image(); img.src = dataUrl; img.onload = () => ctx.drawImage(img, 0, 0);
        }
    });

    // ==========================================
    // 3. LOGIKA FORM "ATUR LIBUR"
    // ==========================================
    const udzurAlasan = document.getElementById('udzurAlasan');
    const udzurAlasanManual = document.getElementById('udzurAlasanManual');
    const radioSemua = document.getElementById('udzur_semua');
    const radioPilih = document.getElementById('udzur_pilih');
    const wadahPilihanKelas = document.getElementById('udzurPilihanKelas');

    // Toggle Input Manual Alasan
    udzurAlasan.addEventListener('change', (e) => {
        udzurAlasanManual.style.display = e.target.value === 'Lainnya' ? 'block' : 'none';
    });

    // Toggle Tampilan Checkbox Kelas
    const togglePilihanKelas = () => {
        wadahPilihanKelas.style.display = radioPilih.checked ? 'block' : 'none';
    };
    radioSemua.addEventListener('change', togglePilihanKelas);
    radioPilih.addEventListener('change', togglePilihanKelas);

    // Ambil Data Kelas dari Supabase (Sama seperti halaman laporan)
    try {
        const dataSantri = await api.get('dapodik_santri', 'select=nama_kelas');
        if (dataSantri && dataSantri.length > 0) {
            const kelasUnik = [...new Set(dataSantri.map(item => item.nama_kelas))].filter(Boolean).sort();
            let htmlCheckbox = '';
            kelasUnik.forEach(k => {
                htmlCheckbox += `
                    <label class="checkbox-kelas">
                        <input type="checkbox" name="chk_kelas_libur" value="${k}"> ${k}
                    </label>
                `;
            });
            wadahPilihanKelas.innerHTML = htmlCheckbox;
        } else {
            wadahPilihanKelas.innerHTML = '<div style="text-align:center; font-size:0.85rem; color:#EF4444;">Data kelas kosong di database.</div>';
        }
    } catch (error) {
        console.error("Gagal load kelas untuk Atur Libur:", error);
        wadahPilihanKelas.innerHTML = '<div style="text-align:center; font-size:0.85rem; color:#EF4444;">Gagal memuat kelas. Cek koneksi.</div>';
    }

    // Simulasi Tombol Simpan Libur
    document.getElementById('btnSimpanLibur').addEventListener('click', () => {
        const tgl = document.getElementById('udzurTanggal').value;
        const alasan = udzurAlasan.value === 'Lainnya' ? udzurAlasanManual.value : udzurAlasan.value;
        const cakupan = radioSemua.checked ? 'Semua Kelas' : 'Kelas Tertentu';
        
        if (!tgl || !alasan) {
            alert('Mohon lengkapi tanggal dan alasan libur!');
            return;
        }

        let pesan = `STATUS LIBUR TERSIMPAN!\n\nTanggal: ${tgl}\nAlasan: ${alasan}\nCakupan: ${cakupan}`;
        alert(pesan);
        // (Nantinya di sini kita buat fungsi Insert ke database Supabase)
    });
};
