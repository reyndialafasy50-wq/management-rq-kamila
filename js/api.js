/**
 * ==================================================
 * SUPABASE REST API WRAPPER
 * File: js/api.js
 * ==================================================
 * Menangani semua komunikasi (CRUD) ke database Supabase
 * menggunakan Fetch API bawaan browser (tanpa SDK/Library).
 */

import { CONFIG } from './config.js';

// Fungsi bantuan untuk menyiapkan HTTP Headers standar Supabase
const getHeaders = () => {
    return {
        'apikey': CONFIG.SUPABASE_KEY,
        'Authorization': `Bearer ${CONFIG.SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation' // Supabase akan mengembalikan data yang baru di-insert/update
    };
};

export const api = {
    /**
     * READ: Mengambil data dari tabel
     * @param {string} table - Nama tabel
     * @param {string} query - Parameter query (contoh: select=*&order=id.desc)
     */
    async get(table, query = 'select=*') {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/${table}?${query}`, {
                method: 'GET',
                headers: getHeaders()
            });
            if (!response.ok) throw new Error(`GET Gagal (${response.status})`);
            return await response.json();
        } catch (error) {
            console.error(`API GET Error pada tabel [${table}]:`, error);
            throw error;
        }
    },

    /**
     * CREATE: Menambah data baru ke tabel
     * @param {string} table - Nama tabel
     * @param {object} data - Object data yang akan dimasukkan
     */
    async post(table, data) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/${table}`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`POST Gagal (${response.status})`);
            return await response.json();
        } catch (error) {
            console.error(`API POST Error pada tabel [${table}]:`, error);
            throw error;
        }
    },

    /**
     * UPDATE: Mengubah data berdasarkan ID (menggunakan metode PATCH)
     * @param {string} table - Nama tabel
     * @param {string} id - UUID baris data
     * @param {object} data - Object data yang diperbarui
     */
    async update(table, id, data) {
        try {
            // Sintaks Supabase PostgREST: ?id=eq.NILAI_ID
            const response = await fetch(`${CONFIG.API_BASE_URL}/${table}?id=eq.${id}`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`UPDATE Gagal (${response.status})`);
            return await response.json();
        } catch (error) {
            console.error(`API UPDATE Error pada tabel [${table}]:`, error);
            throw error;
        }
    },

    /**
     * DELETE: Menghapus data berdasarkan ID
     * @param {string} table - Nama tabel
     * @param {string} id - UUID baris data
     */
    async delete(table, id) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/${table}?id=eq.${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            if (!response.ok) throw new Error(`DELETE Gagal (${response.status})`);
            return true; // Berhasil dihapus
        } catch (error) {
            console.error(`API DELETE Error pada tabel [${table}]:`, error);
            throw error;
        }
    }
};
