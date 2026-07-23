/**
 * ==================================================
 * MODUL GLOBAL: NOTIFIKASI & SYOK TERAPI ALPA
 * File: js/notifikasi.js
 * ==================================================
 */
import { api } from './api.js';

export async function periksaNotifikasiGlobal() {
    // 1. Cari ikon lonceng dan tombol pembungkusnya
    const bellIcon = document.getElementById('bellNotif') || document.querySelector('.notif-btn .fa-bell');
    const bellBtnWrapper = bellIcon ? bellIcon.closest('.notif-btn') : null;
    
    if (!bellIcon || !bellBtnWrapper) return;

    // 2. Suntik Animasi CSS (Hanya sekali)
    if (!document.getElementById('cssLoncengPintar')) {
        const styleLonceng = document.createElement('style');
        styleLonceng.id = 'cssLoncengPintar';
        styleLonceng.innerHTML = `
            @keyframes shakeKritis { 
                0%, 100% { transform: rotate(0deg); } 
                25% { transform: rotate(15deg); } 
                50% { transform: rotate(-15deg); } 
                75% { transform: rotate(10deg); } 
            }
            .bell-warn-8 { color: #F59E0B !important; animation: shakeKritis 0.5s infinite; }
            .bell-warn-9 { color: #EA580C !important; animation: shakeKritis 0.3s infinite; }
            .bell-warn-10 { color: #DC2626 !important; animation: shakeKritis 0.15s infinite; filter: drop-shadow(0 0 8px rgba(220, 38, 38, 0.6)); }
        `;
        document.head.appendChild(styleLonceng);
    }

    try {
        const d = new Date();
        const bulanIni = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

        // 3. Tarik Data dari Supabase
        const [harianList, santriList] = await Promise.all([
            api.get('input_harian', `select=*&tanggal=gte.${bulanIni}-01&status_hadir=eq.Alpa`),
            api.get('dapodik_santri', 'select=id,nama_santri,hp_ortu,no_hp')
        ]);

        if (!harianList || harianList.length === 0) {
            resetLonceng(bellIcon, bellBtnWrapper);
            return;
        }

        // 4. Hitung Total Alpa
        let rekapAlpa = {};
        harianList.forEach(log => {
            const idKey = log.santri_id || log.nama_santri;
            if (!rekapAlpa[idKey]) rekapAlpa[idKey] = { id: log.santri_id, nama: log.nama_santri, count: 0 };
            rekapAlpa[idKey].count++;
        });

        let maxAlpa = 0;
        let daftarKritis = [];

        for (const key in rekapAlpa) {
            const data = rekapAlpa[key];
            const sudahDisenyapkan = localStorage.getItem(`bisu_alpa_${bulanIni}_${data.id}`);
            
            if (data.count >= 8 && !sudahDisenyapkan) {
                const s = santriList.find(x => x.id === data.id || x.nama_santri === data.nama);
                data.hp = s ? (s.hp_ortu || s.no_hp || '') : '';
                daftarKritis.push(data);
                if (data.count > maxAlpa) maxAlpa = data.count;
            }
        }

        // 5. Terapkan Animasi Lonceng
        bellIcon.className = 'fas fa-bell'; // Bersihkan class lama
        if (maxAlpa >= 10) bellIcon.classList.add('bell-warn-10');
        else if (maxAlpa === 9) bellIcon.classList.add('bell-warn-9');
        else if (maxAlpa === 8) bellIcon.classList.add('bell-warn-8');

        // 6. Aktifkan Tombol Klik Lonceng
        if (daftarKritis.length > 0) {
            bellBtnWrapper.style.cursor = 'pointer';
            bellBtnWrapper.onclick = (e) => {
                e.preventDefault();
                tampilkanModalEvaluasi(daftarKritis, bulanIni);
            };
        } else {
            resetLonceng(bellIcon, bellBtnWrapper);
        }

    } catch(e) { 
        console.error('Gagal memuat notifikasi:', e); 
    }
}

function resetLonceng(icon, wrapper) {
    icon.className = 'fas fa-bell';
    wrapper.style.cursor = 'default';
    wrapper.onclick = null;
}

// ==========================================
// FUNGSI RENDER MODAL 3 TOMBOL
// ==========================================
function tampilkanModalEvaluasi(daftar, bulanIni) {
    let modal = document.getElementById('modalLoncengGlobal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modalLoncengGlobal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); display: none; justify-content: center; align-items: center; z-index: 99999;`;
        document.body.appendChild(modal);
    }

    daftar.sort((a,b) => b.count - a.count);
    let htmlList = '';
    
    daftar.forEach(s => {
        let color = s.count >= 10 ? '#DC2626' : '#EA580C';
        let hp = s.hp.replace(/[^0-9]/g, '');
        if (hp.startsWith('0')) hp = '62' + hp.slice(1);

        const msg = encodeURIComponent(`Assalamu'alaikum Bapak/Ibu Wali dari ananda *${s.nama}*.\n\nKami menginformasikan bahwa ananda telah mencapai batas *${s.count}x Alpa (Tanpa Keterangan)* di bulan ini.\nMohon perhatian dan kerjasamanya. Terima kasih.`);
        const link = hp ? `https://wa.me/${hp}?text=${msg}` : '#';

        htmlList += `
            <div style="padding: 12px 0; border-bottom: 1px dashed var(--border); display: flex; justify-content: space-between; align-items: center;">
                <div style="text-align: left; flex: 1; padding-right: 10px;">
                    <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-main);">${s.nama}</div>
                    <div style="font-size: 0.75rem; font-weight: 800; color: ${color}; margin-top: 2px;">${s.count}x Alpa</div>
                </div>
                <div style="display: flex; gap: 6px;">
                    <button onclick="window.bukaProfilSantriLonceng()" title="Profil" style="background: rgba(59, 130, 246, 0.1); border: none; color: #3B82F6; width:32px; height:32px; border-radius: 8px; cursor: pointer; display:flex; align-items:center; justify-content:center;"><i class="fas fa-eye"></i></button>
                    ${hp ? `<a href="${link}" target="_blank" title="WhatsApp" style="background: rgba(16, 185, 129, 0.1); color: #10B981; width:32px; height:32px; border-radius: 8px; text-decoration: none; display: flex; align-items: center; justify-content:center;"><i class="fab fa-whatsapp"></i></a>` : `<button onclick="alert('No HP belum diisi!')" style="background: #E5E7EB; color: #9CA3AF; border: none; width:32px; height:32px; border-radius: 8px; cursor: not-allowed; display:flex; align-items:center; justify-content:center;"><i class="fab fa-whatsapp"></i></button>`}
                    <button onclick="window.senyapkanLonceng('${s.id}', '${bulanIni}', '${s.nama}')" title="Tandai Selesai" style="background: rgba(239, 68, 68, 0.1); border: none; color: #EF4444; width:32px; height:32px; border-radius: 8px; cursor: pointer; display:flex; align-items:center; justify-content:center;"><i class="fas fa-check-double"></i></button>
                </div>
            </div>
        `;
    });

    modal.innerHTML = `
        <div style="background: var(--surface); width: 88%; max-width: 380px; border-radius: 20px; padding: 20px; text-align: center; box-shadow: 0 15px 50px rgba(0,0,0,0.3);">
            <div style="width:50px; height:50px; background:#FEE2E2; border-radius:50%; display:flex; align-items:center; justify-content:center; margin: 0 auto 10px auto;"><i class="fas fa-exclamation-triangle" style="font-size: 1.5rem; color: #EF4444;"></i></div>
            <h3 style="margin: 0 0 5px 0; color: var(--text-main); font-size: 1.1rem;">Evaluasi Kehadiran!</h3>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin: 0 0 15px 0;">Tekan centang (✅) jika sudah dievaluasi agar lonceng berhenti bergetar.</p>
            <div style="max-height: 250px; overflow-y: auto; margin-bottom: 15px;">${htmlList}</div>
            <button onclick="document.getElementById('modalLoncengGlobal').style.display='none'" style="background: var(--bg-main); border: 1px solid var(--border); padding: 12px; border-radius: 10px; font-weight: 700; color: var(--text-main); width: 100%; cursor: pointer; outline: none;">Tutup Peringatan</button>
        </div>
    `;
    modal.style.display = 'flex';
}

// Fungsi Pindah Halaman
window.bukaProfilSantriLonceng = () => {
    document.getElementById('modalLoncengGlobal').style.display = 'none';
    window.location.hash = '#santri'; 
};

// Fungsi Mute (Bisu)
window.senyapkanLonceng = (id, bulan, nama) => {
    if(confirm(`Tandai evaluasi ananda ${nama} SELESAI?\n\nLonceng peringatan untuk ananda ini akan dimatikan sampai bulan depan.`)) {
        localStorage.setItem(`bisu_alpa_${bulan}_${id}`, 'true');
        document.getElementById('modalLoncengGlobal').style.display = 'none';
        periksaNotifikasiGlobal(); // Cek ulang loncengnya
    }
};
