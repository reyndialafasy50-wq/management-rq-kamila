/**
 * ==================================================
 * LOGIKA GLOBAL LONCENG NOTIFIKASI & WA AUTO-DRAFT
 * File: js/main.js (Tambahkan/Update Bagian Ini)
 * ==================================================
 */
import { api } from './api.js';

// Fungsi Global untuk Memeriksa Notifikasi Alpa di Semua Halaman
export async function periksaNotifikasiGlobal() {
    const bellIcon = document.getElementById('bellNotif');
    if (!bellIcon) return;

    try {
        // Ambil data bulan berjalan (YYYY-MM)
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const startOfMonthStr = `${year}-${month}-01`;

        // Ambil data harian dan data santri sekaligus
        const [harianList, santriList] = await Promise.all([
            api.get('input_harian', `select=*&tanggal=gte.${startOfMonthStr}&status_hadir=eq.Alpa`),
            api.get('dapodik_santri', 'select=id,nama_santri,hp_ortu,no_hp')
        ]);

        if (!harianList || harianList.length === 0) {
            bellIcon.classList.remove('bell-warn-8', 'bell-warn-9', 'bell-warn-10');
            bellIcon.onclick = null;
            return;
        }

        // Rekap Jumlah Alpa per Santri
        let rekapAlpa = {};
        harianList.forEach(log => {
            const idKey = log.santri_id || log.nama_santri;
            if (!rekapAlpa[idKey]) {
                rekapAlpa[idKey] = {
                    id: log.santri_id,
                    nama: log.nama_santri || 'Tanpa Nama',
                    totalAlpa: 0
                };
            }
            rekapAlpa[idKey].totalAlpa += 1;
        });

        let maxAlpa = 0;
        let daftarBermasalah = [];

        for (const key in rekapAlpa) {
            const data = rekapAlpa[key];
            if (data.totalAlpa >= 8) {
                // Cari nomor HP Ortu dari dapodik
                const s = santriList.find(x => x.id === data.id || x.nama_santri === data.nama);
                data.hp = s ? (s.hp_ortu || s.no_hp || '') : '';
                
                daftarBermasalah.push(data);
                if (data.totalAlpa > maxAlpa) maxAlpa = data.totalAlpa;
            }
        }

        // Reset & Set Animasi Lonceng di Header
        bellIcon.classList.remove('bell-warn-8', 'bell-warn-9', 'bell-warn-10');
        
        if (maxAlpa >= 10) bellIcon.classList.add('bell-warn-10');
        else if (maxAlpa === 9) bellIcon.classList.add('bell-warn-9');
        else if (maxAlpa === 8) bellIcon.classList.add('bell-warn-8');

        // Handler Klik Lonceng di Manapun Halamannya
        if (daftarBermasalah.length > 0) {
            bellIcon.style.cursor = 'pointer';
            bellIcon.onclick = () => {
                tampilkanModalEvaluasi(daftarBermasalah);
            };
        }

    } catch (err) {
        console.error("Gagal memeriksa notifikasi global:", err);
    }
}

// Fungsi Render Modal Evaluasi + Tombol Profil & WA
function tampilkanModalEvaluasi(daftarSantri) {
    let modal = document.getElementById('modalLoncengGlobal');
    
    // Jika wadah modal belum ada di HTML, buatkan secara otomatis
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modalLoncengGlobal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.6); backdrop-filter: blur(5px);
            display: none; justify-content: center; align-items: center; z-index: 9999;
        `;
        document.body.appendChild(modal);
    }

    // Urutkan dari Alpa terbanyak
    daftarSantri.sort((a,b) => b.totalAlpa - a.totalAlpa);

    let htmlList = '';
    daftarSantri.forEach(s => {
        let warnaText = s.totalAlpa >= 10 ? '#DC2626' : '#EA580C';
        
        // Format No HP untuk WhatsApp (Ubah 08xx jadi 628xx)
        let formattedHP = s.hp.replace(/[^0-9]/g, '');
        if (formattedHP.startsWith('0')) formattedHP = '62' + formattedHP.slice(1);

        const pesanWA = encodeURIComponent(
            `Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nYth. Orang Tua/Wali dari ananda *${s.nama}*.\n\nKami dari pengurus Rumah Qur'an menginformasikan bahwa catatan kehadiran ananda pada bulan ini telah mencapai *${s.totalAlpa}x Alpa (Tanpa Keterangan)*.\n\nMohon konfirmasi dan kerjasamanya terkait hal tersebut. Terima kasih.\nWassalamu'alaikum Warahmatullahi Wabarakatuh.`
        );

        const linkWA = formattedHP ? `https://wa.me/${formattedHP}?text=${pesanWA}` : '#';

        htmlList += `
            <div style="padding: 10px 0; border-bottom: 1px dashed var(--border); display: flex; justify-content: space-between; align-items: center;">
                <div style="text-align: left; flex: 1; padding-right: 10px;">
                    <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-main);">${s.nama}</div>
                    <div style="font-size: 0.75rem; font-weight: 800; color: ${warnaText};">${s.totalAlpa}x Alpa Bulan Ini</div>
                </div>
                <div style="display: flex; gap: 6px;">
                    <button onclick="bukaProfilSantri('${s.id}')" title="Lihat Profil" style="background: var(--bg-main); border: 1px solid var(--border); color: var(--text-main); padding: 6px 10px; border-radius: 8px; cursor: pointer; font-size: 0.8rem;">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${formattedHP ? `
                        <a href="${linkWA}" target="_blank" title="Hubungi via WA" style="background: #25D366; color: white; padding: 6px 10px; border-radius: 8px; text-decoration: none; font-size: 0.8rem; display: inline-flex; align-items: center;">
                            <i class="fab fa-whatsapp"></i>
                        </a>
                    ` : `
                        <button onclick="alert('Nomor HP Ortu belum diisi di Data Santri!')" title="HP Tidak Ada" style="background: #E5E7EB; color: #9CA3AF; border: none; padding: 6px 10px; border-radius: 8px; cursor: not-allowed; font-size: 0.8rem;">
                            <i class="fab fa-whatsapp"></i>
                        </button>
                    `}
                </div>
            </div>
        `;
    });

    modal.innerHTML = `
        <div style="background: var(--surface); width: 88%; max-width: 360px; border-radius: 20px; padding: 20px; text-align: center; box-shadow: 0 15px 50px rgba(0,0,0,0.3);">
            <i class="fas fa-exclamation-triangle" style="font-size: 2.5rem; color: #DC2626; margin-bottom: 10px;"></i>
            <h3 style="margin: 0 0 5px 0; color: var(--text-main); font-size: 1.1rem;">Evaluasi Kehadiran!</h3>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin: 0 0 15px 0;">Klik tombol mata untuk cek profil atau tombol WA untuk menghubungi wali santri.</p>
            
            <div style="max-height: 220px; overflow-y: auto; margin-bottom: 15px;">
                ${htmlList}
            </div>

            <button onclick="document.getElementById('modalLoncengGlobal').style.display='none'" style="background: var(--bg-main); border: 1px solid var(--border); padding: 10px; border-radius: 10px; font-weight: 700; color: var(--text-main); width: 100%; cursor: pointer;">
                Tutup & Paham
            </button>
        </div>
    `;

    modal.style.display = 'flex';
}

// Fungsi Pindah ke Profil Santri
window.bukaProfilSantri = (santriId) => {
    document.getElementById('modalLoncengGlobal').style.display = 'none';
    // Mengarahkan ke menu santri (sesuaikan dengan nama router/navigasi modul Ustadz)
    if (window.navigateTo) {
        window.navigateTo('santri', { id: santriId });
    } else {
        alert(`Membuka profil santri ID: ${santriId}`);
    }
};

// Jalankan Pengecekan Notifikasi saat aplikasi pertama kali dimuat
document.addEventListener('DOMContentLoaded', () => {
    periksaNotifikasiGlobal();
});
