const dataVila = [
    { id: 1, nama: "Vila Edelweiss", tipe: "3 Kamar Tidur", harga: 750000, lokasi: "Puncak Pass", fasilitas: "Kolam renang privat, Wi-Fi, BBQ", status: "Tersedia" },
    { id: 2, nama: "Vila Dahlia", tipe: "2 Kamar Tidur", harga: 500000, lokasi: "Cisarua", fasilitas: "Halaman luas, dapur lengkap, TV", status: "Tersedia" },
    { id: 3, nama: "Vila Melati", tipe: "4 Kamar Tidur", harga: 1200000, lokasi: "Megamendung", fasilitas: "Karaoke, kolam air hangat, pemandangan gunung", status: "Tersedia" }
];

const containerVila = document.getElementById('containerVila');
const pilihVilaSelect = document.getElementById('pilihVila');
const formPemesanan = document.getElementById('formPemesanan');
const inputPencarian = document.getElementById('inputPencarian');
const ringkasanKonten = document.getElementById('ringkasanKonten');

function renderVila(daftar) {
    containerVila.innerHTML = '';
    
    try {
        if (daftar.length === 0) {
            containerVila.innerHTML = '<p>Vila yang dicari tidak ditemukan.</p>';
            return;
        }

        daftar.forEach(vila => {
            const card = document.createElement('div');
            card.className = 'villa-card';

            const title = document.createElement('h3');
            title.className = 'villa-card__title';
            title.textContent = vila.nama;

            const infoTipe = document.createElement('p');
            infoTipe.className = 'villa-card__info';
            infoTipe.textContent = `Tipe: ${vila.tipe} | Lokasi: ${vila.lokasi}`;

            const infoFasilitas = document.createElement('p');
            infoFasilitas.className = 'villa-card__info';
            infoFasilitas.textContent = `Fasilitas: ${vila.fasilitas}`;

            const price = document.createElement('p');
            price.className = 'villa-card__price';
            price.textContent = `Rp ${vila.harga.toLocaleString('id-ID')} / malam`;

            const status = document.createElement('span');
            status.className = 'villa-card__status';
            status.textContent = vila.status;
            card.appendChild(title);
            card.appendChild(infoTipe);
            card.appendChild(infoFasilitas);
            card.appendChild(price);
            card.appendChild(status);

            containerVila.appendChild(card);
        });
    } catch (error) {
        console.error("Terjadi kesalahan saat merender vila:", error);
    }
}

function isiDropdownVila() {
    dataVila.forEach(vila => {
        const option = document.createElement('option');
        option.value = vila.id;
        option.textContent = `${vila.nama} - Rp ${vila.harga.toLocaleString('id-ID')}/malam`;
        pilihVilaSelect.appendChild(option);
    });
}

function hitungTotalHarga( hargaPerMalam, tglCheckIn, tglCheckOut, jumlahTamu ) {
    const masuk = new Date(tglCheckIn);
    const keluar = new Date(tglCheckOut);
    const selisihHari = (keluar - masuk) / (1000 * 60 * 60 * 24);

    if (selisihHari <= 0) return 0;
    
    return selisihHari * hargaPerMalam;
}

function validasiForm(nama, checkIn, checkOut, tamu) {
    if (!nama.trim()) {
        alert("Nama tamu wajib diisi dengan benar.");
        return false;
    }
    if (!checkIn || !checkOut) {
        alert("Tanggal check-in dan check-out harus diisi.");
        return false;
    }
    const dMasuk = new Date(checkIn);
    const dKeluar = new Date(checkOut);
    if (dKeluar <= dMasuk) {
        alert("Tanggal check-out harus setelah tanggal check-in.");
        return false;
    }
    if (tamu < 1 || tamu > 10) {
        alert("Jumlah tamu minimal 1 dan maksimal 10 orang.");
        return false;
    }
    return true;
}
formPemesanan.addEventListener('submit', function(e) {
    e.preventDefault();

    try {
        const namaTamu = document.getElementById('namaTamu').value;
        const selectedId = parseInt(pilihVilaSelect.value);
        const checkIn = document.getElementById('checkIn').value;
        const checkOut = document.getElementById('checkOut').value;
        const jumlahTamu = parseInt(document.getElementById('jumlahTamu').value);

        if (!validasiForm(namaTamu, checkIn, checkOut, jumlahTamu)) {
            return;
        }

        const vilaPilihan = dataVila.find(v => v.id === selectedId);
        
        const masuk = new Date(checkIn);
        const keluar = new Date(checkOut);
        const jumlahMalam = (keluar - masuk) / (1000 * 60 * 60 * 24);
        const totalBiaya = hitungTotalHarga(vilaPilihan.harga, checkIn, checkOut, jumlahTamu);

        localStorage.setItem('namaTamuTerakhir', namaTamu);

        ringkasanKonten.innerHTML = `
            <p><strong>Terima Kasih, ${namaTamu}!</strong> Pesanan Anda berhasil dicatat:</p>
            <ul style="margin-left: 20px; margin-top: 10px;">
                <li>Unit Vila: <strong>${vilaPilihan.nama}</strong></li>
                <li>Durasi Menginap: <strong>${jumlahMalam} malam</strong> (${checkIn} s.d ${checkOut})</li>
                <li>Jumlah Tamu: <strong>${jumlahTamu} orang</strong></li>
                <li>Total Estimasi Biaya: <strong style="color: #d9534f; font-size: 1.1rem;">Rp ${totalBiaya.toLocaleString('id-ID')}</strong></li>
            </ul>
            <p style="margin-top: 10px; font-size: 0.9rem; color: #555;">Silakan hubungi pemilik (Pak Hendra) untuk konfirmasi pembayaran via WhatsApp.</p>
        `;

        alert("Pemesanan berhasil diproses! Silakan cek ringkasan di bagian bawah halaman.");

    } catch (err) {
        console.error("Terjadi error saat pemesanan:", err);
        alert("Maaf, terjadi kesalahan teknis pada sistem pemesanan.");
    }
});

inputPencarian.addEventListener('input', function(e) {
    const keyword = e.target.value.toLowerCase();
    const hasilFilter = dataVila.filter(vila => 
        vila.nama.toLowerCase().includes(keyword) || 
        vila.fasilitas.toLowerCase().includes(keyword) ||
        vila.lokasi.toLowerCase().includes(keyword)
    );
    renderVila(hasilFilter);
});

window.addEventListener('DOMContentLoaded', () => {
    renderVila(dataVila);
    isiDropdownVila();

    const tamuTerakhir = localStorage.getItem('namaTamuTerakhir');
    if (tamuTerakhir) {
        document.getElementById('namaTamu').value = tamuTerakhir;
    }
});