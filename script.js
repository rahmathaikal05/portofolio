document.addEventListener('DOMContentLoaded', () => {
    // Ambil elemen-elemen DOM yang dibutuhkan
    const themeToggle = document.getElementById('theme-toggle'); // Tombol dark mode utama
    const body = document.body;
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger'); // Elemen hamburger
    const navMenu = document.querySelector('.nav-menu'); // Menu navigasi mobile

    // --- Dark Mode Toggle ---
    const applyTheme = (theme) => {
        body.className = theme;
        if (theme === 'dark-mode') {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        localStorage.setItem('theme', theme);
    };

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        applyTheme(currentTheme);
    } else {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            applyTheme('dark-mode');
        } else {
            applyTheme('light-mode');
        }
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            applyTheme('dark-mode');
        } else {
            applyTheme('light-mode');
        }
    });

    // --- Navbar fixed and scroll effect & Active Nav Link ---
    const updateNavbarAndActiveLink = () => {
        // Navbar scroll effect
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link on scroll
        let current = '';
        const navbarHeight = navbar.offsetHeight; // Dapatkan tinggi navbar dinamis

        sections.forEach(section => {
            // Sesuaikan offset untuk mempertimbangkan tinggi navbar dan sedikit padding
            const sectionTop = section.offsetTop - navbarHeight - 50;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateNavbarAndActiveLink);
    window.addEventListener('resize', updateNavbarAndActiveLink); // Hitung ulang saat ukuran diubah
    updateNavbarAndActiveLink(); // Panggil saat pemuatan awal

    // --- Navbar Hamburger (Mobile Menu) yang diperbaiki ---
    // Pastikan hamburger ada sebelum menambahkan event listener
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close nav menu when a link is clicked (for mobile)
    navLinks.forEach(n => n.addEventListener('click', () => {
        // Hanya hapus kelas active jika menu hamburger aktif
        if (hamburger.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }));


    // --- Smooth scroll for navigation links ---
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            const navbarHeight = navbar.offsetHeight; // Dapatkan tinggi navbar dinamis

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - navbarHeight;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Close mobile menu after clicking a link (sudah ditangani di atas, tapi ini juga bekerja)
                if (navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }

                // Update active class immediately for smooth scroll
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // --- Scroll Animations (Intersection Observer) ---
    const faders = document.querySelectorAll(
        '.section-title, .about-content p, .timeline-item, .education-item, .contact-intro, .contact-info, .signature, .gallery-item'
    );

    const appearOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function (entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('fade-in');
                if (entry.target.classList.contains('animate-slide-in-right')) {
                    entry.target.classList.add('slide-in-right');
                } else if (entry.target.classList.contains('animate-slide-in-left')) {
                    entry.target.classList.add('slide-in-left');
                } else if (entry.target.classList.contains('animate-fade-in-up')) {
                    entry.target.style.opacity = 1;
                }
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // --- Modal Image Gallery ---
    const modal = document.getElementById("myModal");
    const modalImg = document.getElementById("img01");
    const captionText = document.getElementById("caption");
    const galleryItems = document.querySelectorAll(".gallery-item");
    const closeBtn = document.getElementsByClassName("close")[0];

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            modal.style.display = "flex";
            modalImg.src = this.getAttribute('data-src');
            captionText.innerHTML = this.getAttribute('data-caption');
        });
    });

    if (closeBtn) { // Pastikan tombol tutup ada
        closeBtn.onclick = function() {
            modal.style.display = "none";
        }
    }

    modal.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape") {
            modal.style.display = "none";
        }
    });
});