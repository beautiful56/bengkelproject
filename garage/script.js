// =====================================
// script.js - Fungsionalitas JavaScript
// =====================================

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Dark Mode Toggle ---
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const body = document.body;

    // Fungsi untuk menerapkan tema
    const applyTheme = (theme) => {
        body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        // Ganti ikon bulan/matahari
        if (darkModeToggle) {
            const icon = darkModeToggle.querySelector('i');
            if (theme === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
    };

    // Cek preferensi tema sebelumnya dari localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Deteksi preferensi sistem jika tidak ada di localStorage
        applyTheme('dark');
    } else {
        applyTheme('light'); // Default ke light jika tidak ada preferensi
    }

    // Event listener untuk tombol toggle
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    // --- 2. Carousel / Slider untuk Testimonial ---
    const carouselWrapper = document.querySelector('.carousel-wrapper'); // Ambil wrapper baru
    const carouselContainer = document.querySelector('.carousel-container');
    const carouselPrevBtn = document.querySelector('.carousel-prev');
    const carouselNextBtn = document.querySelector('.carousel-next');
    let slides = [];
    let currentIndex = 0;
    let carouselInterval; // Untuk auto-play

    if (carouselWrapper && carouselContainer) { // Cek carouselWrapper juga
        slides = Array.from(carouselContainer.querySelectorAll('.carousel-slide'));
        const totalSlides = slides.length;

        // Fungsi untuk menampilkan slide tertentu
        const showSlide = (index) => {
            // Hapus kelas 'active' dari semua slide
            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                slide.style.display = 'none'; // Sembunyikan semua slide
                slide.style.opacity = '0';
                slide.style.position = 'absolute'; // Pastikan kembali ke absolute
                slide.style.zIndex = '1'; // Pastikan z-index default
                slide.style.pointerEvents = 'none'; // Nonaktifkan interaksi mouse
            });

            // Tambahkan kelas 'active' ke slide yang dipilih
            // Ini akan memicu transisi CSS dan membuatnya terlihat
            slides[index].classList.add('active');
            slides[index].style.display = 'flex'; // Tampilkan slide aktif
            slides[index].style.opacity = '1';
            slides[index].style.position = 'relative'; // Buat slide aktif mengambil ruang
            slides[index].style.zIndex = '2'; // Pastikan di atas slide lain
            slides[index].style.pointerEvents = 'all'; // Aktifkan interaksi mouse

            currentIndex = index;

            // Sesuaikan tinggi carousel-container dengan tinggi slide aktif
            // Ini penting agar konten di bawah carousel tidak melompat
            carouselContainer.style.height = slides[index].offsetHeight + 'px';
        };

        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            showSlide(currentIndex);
        };

        const prevSlide = () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            showSlide(currentIndex);
        };

        // Tombol navigasi
        if (carouselNextBtn) {
            carouselNextBtn.addEventListener('click', () => {
                clearInterval(carouselInterval); // Hentikan auto-play saat manual nav
                nextSlide();
                startCarouselAutoPlay(); // Mulai lagi auto-play
            });
        }
        if (carouselPrevBtn) {
            carouselPrevBtn.addEventListener('click', () => {
                clearInterval(carouselInterval); // Hentikan auto-play saat manual nav
                prevSlide();
                startCarouselAutoPlay(); // Mulai lagi auto-play
            });
        }

        // Auto-play carousel
        const startCarouselAutoPlay = () => {
            carouselInterval = setInterval(nextSlide, 5000); // Ganti slide setiap 5 detik
        };

        // Inisialisasi: Tampilkan slide pertama dan mulai auto-play
        showSlide(currentIndex);
        startCarouselAutoPlay();

        // Tambahkan event listener untuk resize jika tinggi slide berubah secara dinamis
        window.addEventListener('resize', () => {
            showSlide(currentIndex); // Panggil ulang untuk menyesuaikan tinggi container
        });
    }

    // --- 3. Form Validation (Booking Form) ---
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Mencegah submit default

            // Ambil nilai input
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const service = document.getElementById('service').value;
            const bookingDate = document.getElementById('booking-date').value;
            const bookingTime = document.getElementById('booking-time').value;
            const vehicleType = document.getElementById('vehicle-type').value;
            const vehicleModel = document.getElementById('vehicle-model').value.trim();

            let isValid = true;
            let messages = [];

            // Validasi Nama
            if (name.length < 3) {
                isValid = false;
                messages.push('Nama lengkap minimal 3 karakter.');
            }
            // Validasi Email
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                isValid = false;
                messages.push('Format email tidak valid.');
            }
            // Validasi Nomor Telepon (contoh sederhana)
            if (!/^\d{10,15}$/.test(phone)) {
                isValid = false;
                messages.push('Nomor telepon harus antara 10-15 digit angka.');
            }
            // Validasi Jenis Kendaraan
            if (vehicleType === '') {
                isValid = false;
                messages.push('Pilih jenis kendaraan.');
            }
            // Validasi Model Kendaraan
            if (vehicleModel === '') {
                isValid = false;
                messages.push('Merek & Model Motor tidak boleh kosong.');
            }
            // Validasi Layanan
            if (service === '') {
                isValid = false;
                messages.push('Pilih layanan yang diinginkan.');
            }
            // Validasi Tanggal Booking
            if (bookingDate === '') {
                isValid = false;
                messages.push('Pilih tanggal booking.');
            } else {
                const selectedDate = new Date(bookingDate);
                const today = new Date();
                today.setHours(0,0,0,0); // Reset time for comparison
                if (selectedDate < today) {
                    isValid = false;
                    messages.push('Tanggal booking tidak boleh di masa lalu.');
                }
            }
            // Validasi Waktu Booking
            if (bookingTime === '') {
                isValid = false;
                messages.push('Pilih waktu booking.');
            }

            if (isValid) {
                alert('Booking berhasil dikirim! Kami akan segera menghubungi Anda untuk konfirmasi.\n\nDetail Booking:\nNama: ' + name + '\nEmail: ' + email + '\nTelepon: ' + phone + '\nMotor: ' + vehicleModel + ' (' + vehicleType + ')' + '\nLayanan: ' + service + '\nTanggal: ' + bookingDate + '\nWaktu: ' + bookingTime);
                bookingForm.reset(); // Reset form setelah berhasil
                // Di sini, Anda akan mengirim data ke backend (menggunakan fetch API misalnya)
                // Contoh:
                /*
                fetch('/api/submit-booking', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, phone, vehicleType, vehicleModel, service, bookingDate, bookingTime, notes: document.getElementById('notes').value.trim() }),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Booking berhasil dikirim!');
                        bookingForm.reset();
                    } else {
                        alert('Gagal booking: ' + (data.message || 'Terjadi kesalahan.'));
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Terjadi kesalahan jaringan atau server.');
                });
                */
            } else {
                alert('Silakan perbaiki kesalahan berikut:\n' + messages.join('\n'));
            }
        });

        // Pre-fill service from URL parameter (if any)
        const urlParams = new URLSearchParams(window.location.search);
        const serviceParam = urlParams.get('service');
        if (serviceParam) {
            document.getElementById('service').value = serviceParam;
        }
    }

    // --- 4. Date Picker (Flatpickr) Integration ---
    // Pastikan Flatpickr CSS dan JS sudah di-load di HTML
    const bookingDateInput = document.getElementById('booking-date');
    if (bookingDateInput && typeof flatpickr !== 'undefined') {
        flatpickr(bookingDateInput, {
            dateFormat: "Y-m-d", // Format tanggal
            minDate: "today",     // Tanggal minimal adalah hari ini
            locale: "id"          // Menggunakan lokal bahasa Indonesia
        });
    }

    const bookingTimeInput = document.getElementById('booking-time');
    if (bookingTimeInput && typeof flatpickr !== 'undefined') {
        flatpickr(bookingTimeInput, {
            enableTime: true,     // Aktifkan pemilihan waktu
            noCalendar: true,     // Sembunyikan kalender, hanya waktu
            dateFormat: "H:i",    // Format waktu (misal: 14:30)
            time_24hr: true,      // Gunakan format 24 jam
            minTime: "08:00",     // Jam buka bengkel
            maxTime: "17:00",     // Jam tutup bengkel
            locale: "id"
        });
    }

    // --- 5. Password Toggle (untuk halaman Login, Register, Reset Password) ---
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');

    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target; // Ambil ID input dari data-target
            const passwordField = document.getElementById(targetId);
            const icon = button.querySelector('i');

            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordField.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // --- 6. Form Validation (Login, Register, Forgot Password, Reset Password) ---

    // Login Form Validation
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value.trim();
            let messages = [];

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                messages.push('Email tidak valid.');
            }
            if (password.length < 6) { // Contoh minimal 6 karakter
                messages.push('Password minimal 6 karakter.');
            }

            if (messages.length === 0) {
                alert('Login berhasil! (Ini adalah simulasi, tidak ada otentikasi backend)');
                // Redirect ke halaman dashboard pengguna atau my_bookings
                window.location.href = 'my_bookings.html';
                loginForm.reset();
            } else {
                alert('Gagal Login:\n' + messages.join('\n'));
            }
        });
    }

    // Register Form Validation
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('register-name').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value.trim();
            const confirmPassword = document.getElementById('confirm-password').value.trim();
            let messages = [];

            if (name.length < 3) {
                messages.push('Nama lengkap minimal 3 karakter.');
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                messages.push('Format email tidak valid.');
            }
            if (password.length < 6) {
                messages.push('Password minimal 6 karakter.');
            }
            if (password !== confirmPassword) {
                messages.push('Konfirmasi password tidak cocok.');
            }

            if (messages.length === 0) {
                alert('Registrasi berhasil! Silakan login. (Ini adalah simulasi, tidak ada penyimpanan data)');
                window.location.href = 'login.html';
                registerForm.reset();
            } else {
                alert('Gagal Registrasi:\n' + messages.join('\n'));
            }
        });
    }

    // Forgot Password Form (simulasi)
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('forgot-email').value.trim();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Masukkan email yang valid.');
            } else {
                alert('Link reset password telah dikirim ke ' + email + '. (Ini adalah simulasi)');
                forgotPasswordForm.reset();
                // Biasanya redirect ke halaman konfirmasi
            }
        });
    }

    // Reset Password Form (simulasi)
    const resetPasswordForm = document.getElementById('reset-password-form');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newPassword = document.getElementById('new-password').value.trim();
            const confirmNewPassword = document.getElementById('confirm-new-password').value.trim();
            let messages = [];

            if (newPassword.length < 6) {
                messages.push('Password baru minimal 6 karakter.');
            }
            if (newPassword !== confirmNewPassword) {
                messages.push('Konfirmasi password baru tidak cocok.');
            }

            if (messages.length === 0) {
                alert('Password Anda berhasil direset! Silakan login dengan password baru Anda. (Ini adalah simulasi)');
                window.location.href = 'login.html';
                resetPasswordForm.reset();
            } else {
                alert('Gagal Reset Password:\n' + messages.join('\n'));
            }
        });
    }

    // --- 7. Copy Promo Code Functionality (untuk promo.html) ---
    const copyPromoButtons = document.querySelectorAll('.copy-promo-code');
    copyPromoButtons.forEach(button => {
        button.addEventListener('click', () => {
            const promoCode = button.dataset.code;
            navigator.clipboard.writeText(promoCode).then(() => {
                const originalText = button.textContent;
                button.textContent = 'Disalin!';
                button.classList.add('btn-success'); // Opsional: tambahkan kelas untuk styling
                setTimeout(() => {
                    button.textContent = originalText;
                    button.classList.remove('btn-success');
                }, 2000);
            }).catch(err => {
                console.error('Gagal menyalin kode: ', err);
                alert('Gagal menyalin kode promo. Silakan salin manual: ' + promoCode);
            });
        });
    });

    // --- 8. Logout Link (simulasi) ---
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Anda telah logout. (Ini adalah simulasi)');
            // Dalam aplikasi nyata, Anda akan menghapus token sesi/cookie di sini
            window.location.href = 'login.html';
        });
    }

    // --- 9. Smooth Scrolling (Opsional) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

});