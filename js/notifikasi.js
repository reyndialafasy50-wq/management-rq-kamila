/**
 * ==================================================
 * MODUL GLOBAL: NOTIFIKASI & SYOK TERAPI ALPA
 * File: js/notifikasi.js
 * ==================================================
 */
import { api } from './api.js';

export async function initNotifikasiGlobal() {
    // 1. SUNTIKKAN GAYA CSS UNTUK LONCENG GOYANG & POP-UP
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes shakeKritis {
            0%, 100% { transform: rotate(0deg); }
            20% { transform: rotate(15deg); }
            40% { transform: rotate(-15deg); }
            60% { transform: rotate(10deg); }
            80% { transform: rotate(-10deg); }
        }
        .bell-bahaya {
            color: #EF4444 !important;
            animation: shakeKritis 0.8s infinite;
            position: relative;
        }
        .bell-bahaya::after {
            content: ''; position: absolute; top: -2px; right: -2px;
            width: 8px; height: 8px; background-color: #EF4444;
            border-radius: 50%; border: 1.5px solid var(--surface, #fff);
        }
        .notif-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.6); z-index: 99999;
            display: flex; align-items: center; justify-content: center;
            opacity: 0; pointer-events: none; transition: all 0.3s ease;
            backdrop-filter: blur(3px);
        }
        .notif-overlay.show { opacity: 1; pointer-events: auto; }
        .notif-box {
            background: var(--surface, #ffffff); width: 90%; max-width: 380px; 
            border-radius: 16px; padding: 20px; box-shadow: 0 15px 30px rgba(0,0,0,0.2);
            max-height: 85vh; display: flex; flex-direction: column;
            transform: translateY(20px); transition: 0.3s;
        }
        .notif-overlay.show .notif-box { transform: translateY(0); }
        .notif-btn-aksi {
            border: none; width: 34px; height: 34px; border-radius: 8px; 
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            transition: 0.2s; font-size: 1rem; outline: none; -webkit-tap-highlight-color: transparent;
        }
        .notif-btn-aksi:active { transform: scale(0.9); }
    `;
    document.head.appendChild(style);

    // 2. BUAT KOTAK MODAL (POP-UP) UTAMA DI LATAR BELAKANG
    const modal = document.createElement('div');
    modal.className = 'notif-overlay';
    modal.id = 'modalGlobalSyokTerapi';
    modal.innerHTML = `
        <div class="notif-box">
            <div style="text-align: center; margin-bottom: 15px;">
                <div style="width:50px; height:50px; background:#FEE2E2; border-radius:50%; display:flex; align-items:center; justify-content:center; margin: 0 auto 10px auto;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 1.5rem; color: #EF4444;"></i>
                </div>
                <h3 style="margin: 0; color: var(--text-main); font-weight: 800;">Evaluasi Kehadiran!</h3>
                <p style="margin: 5px 0 0 0; font-size: 0.8rem; color: var(--text-muted); line-height:1.4;">Santri berikut telah menembus batas kritis Alpa bulan ini. Mohon segera ditindaklanjuti.</p>
            </div>
            <div id="listSantriKritis" style="overflow-y: auto; flex: 1; margin-bottom: 15px; padding-right: 5px;">
                <!-- Daftar santri akan disuntikkan ke sini -->
            </div>
            <button id="btnTutupNotifGlobal" style="width: 100%; padding: 12px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg-main); font-weight: 700; color: var(--text-main); cursor: pointer; outline:none;">Tutup & Paham</button>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('btnTutupNotifGlobal').addEventListener('click', () => {
        modal.classList.remove('show');
    });

    // 3. LOGIKA PEMANTAUAN DATA (MATA-MATA)
    async function pantauAlpaKritis() {
        try {
            const date = new Date();
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const bulanIni = `${yyyy}-${mm}`;

            // Tarik semua data Alpa bulan ini
            const res = await api.get('input_harian', `select=santri_id,nama_santri,status_hadir&status_hadir=eq.Alpa&tanggal=gte.${bulanIni}-01`);

            // Hitung akumulasi per santri
            const hitungAlpa = {};
            res.forEach(r => {
                if(!hitungAlpa[r.santri_id]) hitungAlpa[r.santri_id] = { id: r.santri_id, nama: r.nama_santri, count: 0 };
                hitungAlpa[r.santri_id].count++;
            });

            // Saring: Hanya yang >= 10x DAN belum ditandai "Selesai" (Mute) oleh Ustadz di bulan ini
            const daftarKritis = Object.values(hitungAlpa).filter(s => s.count >= 10);
            const daftarAktifKritis = daftarKritis.filter(s => !localStorage.getItem(`bisu_alpa_${bulanIni}_${s.id}`));

            // Cari tombol lonceng di Navbar/Header (Berdasarkan class fa-bell)
            const semuaLonceng = document.querySelectorAll('.fa-bell');

            if (daftarAktifKritis.length > 0) {
                // Ada yang kritis -> Goyangkan Lonceng!
                semuaLonceng.forEach(lonceng => {
                    lonceng.classList.add('bell-bahaya');
                    
                    // Supaya area kliknya lebih luas, kita cari tag <a> atau <button> pembungkus loncengnya
                    const tombolPembungkus = lonceng.closest('a, button, div') || lonceng;
                    tombolPembungkus.onclick = (e) => {
                        e.preventDefault();
                        renderDaftarKritis(daftarAktifKritis, bulanIni);
                        modal.classList.add('show');
                    };
                });
            } else {
                // Aman / Sudah diselesaikan semua -> Matikan Goyangan
                semuaLonceng.forEach(lonceng => {
                    lonceng.classList.remove('bell-bahaya');
                    const tombolPembungkus = lonceng.closest('a, button, div') || lonceng;
                    tombolPembungkus.onclick = null; // Matikan fungsi pop-up
                });
                modal.classList.remove('show');
            }
        } catch(e) {
            console.error('Gagal memantau notifikasi:', e);
        }
    }

    // 4. LOGIKA CETAK 3 TOMBOL AJAIB DI POP-UP
    function renderDaftarKritis(list, bulanIni) {
        const container = document.getElementById('listSantriKritis');
        let html = '';
        list.forEach(s => {
            // Teks Pesan WA Otomatis
            const pesanWA = `Assalamu'alaikum Bapak/Ibu wali santri dari ananda *${s.nama}*. \n\nKami dari pengurus RQ mengabarkan bahwa ananda telah mencapai batas ketidakhadiran (Alpa) sebanyak *${s.count}x* di bulan ini. \n\nMohon perhatian dan konfirmasinya agar KBM ananda bisa maksimal. Jazakumullah khairan.`;
            const linkWA = `https://wa.me/?text=${encodeURIComponent(pesanWA)}`;

            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--border); padding: 12px 0;">
                    <div style="flex: 1; padding-right: 10px;">
                        <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-main); line-height: 1.2;">${s.nama}</div>
                        <div style="color: #EF4444; font-size: 0.75rem; font-weight: 800; margin-top: 4px;">${s.count}x Alpa</div>
                    </div>
                    <div style="display: flex; gap: 6px;">
                        <!-- TOMBOL 1: PROFIL -->
                        <button onclick="window.location.hash='#data-santri'; document.getElementById('modalGlobalSyokTerapi').classList.remove('show');" title="Buka Profil" class="notif-btn-aksi" style="background: rgba(59, 130, 246, 0.1); color: #3B82F6;">
                            <i class="fas fa-eye"></i>
                        </button>
                        
                        <!-- TOMBOL 2: HUBUNGI WA -->
                        <button onclick="window.open('${linkWA}', '_blank')" title="Kirim Pesan WA" class="notif-btn-aksi" style="background: rgba(16, 185, 129, 0.1); color: #10B981;">
                            <i class="fab fa-whatsapp" style="font-size:1.1rem;"></i>
                        </button>
                        
                        <!-- TOMBOL 3: TANDAI SELESAI (MATIKAN LONCENG) -->
                        <button onclick="window.senyapkanLonceng('${s.id}', '${bulanIni}', '${s.nama}')" title="Tandai Selesai" class="notif-btn-aksi" style="background: rgba(239, 68, 68, 0.1); color: #EF4444;">
                            <i class="fas fa-check-double"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    // Fungsi global untuk mematikan lonceng per individu
    window.senyapkanLonceng = (idSantri, bulanIni, namaSantri) => {
        if(confirm(`Tandai evaluasi ananda ${namaSantri} SELESAI?\n\nLonceng peringatan untuk ananda ini akan dimatikan sampai ganti bulan depan.`)) {
            // Tanda tangan digital bahwa Ustadz sudah menyelesaikan kasus anak ini
            localStorage.setItem(`bisu_alpa_${bulanIni}_${idSantri}`, 'true');
            // Cek ulang aplikasinya!
            pantauAlpaKritis(); 
        }
    };

    // Jalankan pemantauan saat aplikasi pertama kali dibuka!
    pantauAlpaKritis();
        }
