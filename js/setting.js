/**
 * ==================================================
 * MODUL PENGATURAN USTADZ - VERSI 1 (RUANG PRIBADI GURU)
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
        #canvasTtd { width: 100%; height: 200px; cursor: crosshair; touch-action: none; /* Mencegah layar ikut scroll saat ttd di HP */ }
        .btn-clear { position: absolute; top: 10px; right: 10px; background: #FEE2E2; color: #DC2626; border: none; padding: 6px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 700; cursor: pointer; }
    </style>

    <div class="setting-wrapper">
        <div>
            <div class="header-title"><i class="fas fa-user-cog"></i> Ruang Pribadi Ustadz</div>
            <div class="header-subtitle">Kelola profil, keamanan, dan alat bantu laporan Anda.</div>
        </div>

        <!-- MENU NAVIGASI (BISA DI-GESER KIRI-KANAN DI HP) -->
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

        <!-- 4. PANEL ATUR LIBUR / CUTI KBM -->
        <div id="panelLibur" class="panel-setting" style="display: none;">
            <div class="setting-card">
                <h3 class="card-title" style="color: #D97706; border-bottom-color: #FEF3C7;"><i class="fas fa-umbrella-beach"></i> Penyesuaian Target KBM (Libur)</h3>
                <p style="font-size: 0.85rem; color: #64748B; margin-bottom: 15px;">Jika Anda berhalangan hadir atau ada libur nasional, atur di sini agar persentase absensi santri tidak dirugikan.</p>
                
                <div class="form-group">
                    <label>Bulan Laporan</label>
                    <input type="month" class="form-control" value="${new Date().toISOString().slice(0,7)}">
                </div>
                <div class="form-group">
                    <label>Jumlah Hari Libur / Tidak Ada KBM</label>
                    <input type="number" class="form-control" placeholder="Contoh: 2" min="0">
                </div>
                <div class="form-group">
                    <label>Keterangan / Alasan</label>
                    <input type="text" class="form-control" placeholder="Contoh: Ustadz Sakit, Libur Idul Adha, dll">
                </div>
                <button class="btn-simpan" style="background: linear-gradient(135deg, #F59E0B, #D97706); box-shadow: 0 4px 12px rgba(245,158,11,0.2);"><i class="fas fa-calendar-check"></i> Ajukan Penyesuaian</button>
            </div>
        </div>

    </div>
    `;
};

export const initSetting = async () => {
    // 1. LOGIKA NAVIGASI TAB
    const tabBtns = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.panel-setting');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Hilangkan status aktif dari semua tombol
            tabBtns.forEach(b => b.classList.remove('active'));
            // Sembunyikan semua panel
            panels.forEach(p => p.style.display = 'none');
            
            // Aktifkan tombol yang diklik
            btn.classList.add('active');
            // Tampilkan panel yang sesuai
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).style.display = 'block';

            // Jika tab tanda tangan dibuka, pastikan ukuran canvasnya pas
            if (targetId === 'panelTtd') {
                resizeCanvas();
            }
        });
    });

    // 2. LOGIKA KANVAS TANDA TANGAN (BISA DI HP & LAPTOP)
    const canvas = document.getElementById('canvasTtd');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    // Menyesuaikan resolusi canvas agar tidak buram dan pas di kontainer
    const resizeCanvas = () => {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = 200; // Tinggi tetap 200px
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
    };

    // Event Mouse (Laptop/PC)
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    });
    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    });
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);

    // Event Touch (HP/Tablet)
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Mencegah layar scroll
        isDrawing = true;
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
    });
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
        ctx.stroke();
    });
    canvas.addEventListener('touchend', () => isDrawing = false);

    // Tombol Hapus Kanvas
    document.getElementById('btnClearTtd').addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Siapkan ukuran kanvas saat awal diload
    window.addEventListener('resize', () => {
        if (document.getElementById('panelTtd').style.display === 'block') {
            // Simpan gambar lama sebelum resize
            const dataUrl = canvas.toDataURL(); 
            resizeCanvas();
            // Kembalikan gambar setelah resize
            const img = new Image();
            img.src = dataUrl;
            img.onload = () => ctx.drawImage(img, 0, 0);
        }
    });
};
