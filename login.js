/**
 * ==================================================
 * LOGIKA AUTENTIKASI LOGIN - RQ KAMILA
 * File: login.js
 * ==================================================
 */

// 1. Panggil konfigurasi dari config.js
import { CONFIG } from './js/config.js';

// 2. Hubungkan ke Supabase menggunakan data dari Config
const supabaseUrl = CONFIG.SUPABASE_URL; 
const supabaseKey = CONFIG.SUPABASE_KEY; 
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// 3. Tangkap elemen dari HTML
const form = document.getElementById('loginForm');
const btnLogin = document.getElementById('btnLogin');
const pesanError = document.getElementById('pesanError');
const inputUsername = document.getElementById('username');
const inputPassword = document.getElementById('password');

// 4. Logika saat tombol Masuk ditekan
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Mencegah halaman refresh
    
    // Sembunyikan pesan error & ubah tombol jadi loading
    pesanError.style.display = 'none';
    const oriText = btnLogin.innerHTML;
    btnLogin.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memeriksa Data...';
    btnLogin.disabled = true;

    const usernameVal = inputUsername.value.trim();
    const passwordVal = inputPassword.value.trim();

    try {
        // Cari data di tabel 'guru' yang username dan password-nya cocok
        const { data, error } = await supabase
            .from('guru')
            .select('*')
            .eq('username', usernameVal)
            .eq('password', passwordVal);

        if (error) throw error;

        // Jika data ditemukan (Login Berhasil)
        if (data && data.length > 0) {
            const user = data[0];
            
            // Simpan tiket masuk ke memori HP/Browser
            localStorage.setItem('guru_id', user.id);
            localStorage.setItem('user_name', user.nama);
            localStorage.setItem('user_role', user.role || 'Guru'); // Default Guru jika kosong
            
            btnLogin.innerHTML = '<i class="fas fa-check-circle"></i> Berhasil Masuk!';
            btnLogin.style.background = '#10B981'; // Ubah warna tombol jadi hijau
            
            // Pindahkan ke halaman Dashboard setelah 1 detik
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
            
        } else {
            // Jika data tidak ditemukan (Salah Sandi/Username)
            pesanError.innerHTML = '<i class="fas fa-exclamation-circle"></i> Username atau kata sandi salah.';
            pesanError.style.display = 'block';
            btnLogin.innerHTML = oriText;
            btnLogin.disabled = false;
        }

    } catch (err) {
        console.error('Error Login:', err);
        pesanError.innerHTML = '<i class="fas fa-wifi"></i> Gagal terhubung ke server. Cek koneksi Anda.';
        pesanError.style.display = 'block';
        btnLogin.innerHTML = oriText;
        btnLogin.disabled = false;
    }
});

// Cek jika user sudah login sebelumnya, langsung lempar ke index.html
window.addEventListener('load', () => {
    if (localStorage.getItem('guru_id')) {
        window.location.href = 'index.html';
    }
});
