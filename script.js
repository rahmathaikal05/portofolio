document.addEventListener('DOMContentLoaded', () => {
    // Ambil elemen-elemen DOM yang dibutuhkan untuk fungsi-fungsi yang sudah ada
    const themeToggle = document.getElementById('theme-toggle'); // Tombol yang sudah ada (misalnya di navbar)
    const body = document.body;
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // --- Fungsi Dark Mode Toggle untuk tombol 'theme-toggle' yang sudah ada ---
    // Logika ini tetap dipertahankan seperti aslinya
    const handleOldThemeToggle = () => {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme) {
            body.className = currentTheme;
            if (currentTheme === 'dark-mode') {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
        } else {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                body.classList.add('dark-mode');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                localStorage.setItem('theme', 'dark-mode');
            } else {
                body.classList.add('light-mode');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                localStorage.setItem('theme', 'light-mode');
            }
        }

        themeToggle.addEventListener('click', () => {
            if (body.classList.contains('light-mode')) {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                localStorage.setItem('theme', 'dark-mode');
            } else {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                localStorage.setItem('theme', 'light-mode');
            }
            // Pastikan tombol dark mode mengambang juga sinkron
            syncFloatingDarkModeToggle();
        });
    };

    // Panggil fungsi untuk inisialisasi tombol lama
    handleOldThemeToggle();

    // --- Fungsi Dark Mode Toggle yang BARU untuk tombol 'darkModeToggle' mengambang ---
    const floatingDarkModeToggle = document.getElementById('darkModeToggle'); // Mengambil tombol mengambang
    
    // Fungsi untuk memperbarui ikon tombol mengambang
    const syncFloatingDarkModeToggle = () => {
        if (floatingDarkModeToggle) { // Pastikan tombol ada
            if (body.classList.contains('dark-mode')) {
                floatingDarkModeToggle.innerHTML = '<i class="fas fa-sun"></i>'; // Atau '☀️'
            } else {
                floatingDarkModeToggle.innerHTML = '<i class="fas fa-moon"></i>'; // Atau '🌙'
            }
        }
    };

    // Inisialisasi status tombol mengambang saat dimuat
    syncFloatingDarkModeToggle();

    // Event listener untuk tombol dark mode mengambang
    if (floatingDarkModeToggle) { // Pastikan tombol ada sebelum menambahkan event listener
        floatingDarkModeToggle.addEventListener('click', () => {
            if (body.classList.contains('light-mode')) {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark-mode');
            } else {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
                localStorage.setItem('theme', 'light-mode');
            }
            // Sinkronkan ikon kedua tombol setelah perubahan
            themeToggle.innerHTML = body.classList.contains('dark-mode') ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            syncFloatingDarkModeToggle();
        });
    }

    // --- Navbar fixed and scroll effect ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // Adjust scroll threshold as needed
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link on scroll
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - navbar.clientHeight) { // Adjust for fixed navbar height
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Calculate offset considering fixed navbar
                const offsetTop = targetSection.offsetTop - navbar.clientHeight;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Close mobile menu after clicking a link
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

    // --- Navbar Hamburger (Mobile Menu) ---
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // --- Scroll Animations (Intersection Observer) ---
    const faders = document.querySelectorAll('.section-title, .about-content p, .timeline-item, .education-item, .contact-intro, .contact-info, .signature');

    const appearOptions = {
        threshold: 0.3, // Percentage of element visible to trigger
        rootMargin: "0px 0px -100px 0px" // Adjust to trigger earlier/later
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('fade-in');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });
});


document.addEventListener('DOMContentLoaded', function () {
    // Navbar Toggler
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close nav menu when a link is clicked (for mobile)
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // Adjust scroll threshold as needed
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth Scrolling & Active Nav Link
    document.querySelectorAll('.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const navbarHeight = document.querySelector('.navbar').offsetHeight; // Get dynamic navbar height

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - navbarHeight;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }

            // Update active link
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Set initial active link based on current section on load
    const sections = document.querySelectorAll('section[id]');
    function setActiveNavLink() {
        let currentActive = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbar.offsetHeight - 100; // Adjusted for padding
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                currentActive = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentActive}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveNavLink);
    window.addEventListener('resize', setActiveNavLink); // Recalculate on resize
    setActiveNavLink(); // Call on initial load


    // Theme Toggle (bagian ini sekarang tidak lagi dibutuhkan jika darkModeToggle adalah satu-satunya kontrol)
    // const themeToggle = document.getElementById('theme-toggle'); // Ini adalah duplikat dari atas
    // const body = document.body;

    // // Check for saved theme in localStorage
    // const savedTheme = localStorage.getItem('theme');
    // if (savedTheme) {
    //     body.classList.add(savedTheme);
    //     if (savedTheme === 'dark-mode') {
    //         themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    //     }
    // } else {
    //     // Default to light mode if no theme is saved
    //     body.classList.add('light-mode');
    // }

    // themeToggle.addEventListener('click', () => {
    //     if (body.classList.contains('light-mode')) {
    //         body.classList.replace('light-mode', 'dark-mode');
    //         themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    //         localStorage.setItem('theme', 'dark-mode');
    //     } else {
    //         body.classList.replace('dark-mode', 'light-mode');
    //         themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
    //         localStorage.setItem('theme', 'light-mode');
    //     }
    // });

    // Intersection Observer for scroll animations
    const faders = document.querySelectorAll(
        '.section-title, .about-content p, .timeline-item, .education-item, .contact-intro, .contact-info, .signature, .gallery-item' /* Tambahkan kelas galeri di sini */
    );

    const appearOptions = {
        threshold: 0.1, // Adjust as needed
        rootMargin: "0px 0px -50px 0px" // Start animation 50px before element is fully in view
    };

    const appearOnScroll = new IntersectionObserver(function (entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('fade-in');
                // For elements that need specific slide animations
                if (entry.target.classList.contains('animate-slide-in-right')) {
                    entry.target.classList.add('slide-in-right');
                } else if (entry.target.classList.contains('animate-slide-in-left')) {
                    entry.target.classList.add('slide-in-left');
                } else if (entry.target.classList.contains('animate-fade-in-up')) {
                    // The animate-fade-in-up class already has the animation, just ensure visibility
                    entry.target.style.opacity = 1;
                }
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // Modal Image Gallery
    var modal = document.getElementById("myModal");
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");
    var galleryItems = document.querySelectorAll(".gallery-item");

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            modal.style.display = "flex"; // Use flex to center
            modalImg.src = this.getAttribute('data-src');
            captionText.innerHTML = this.getAttribute('data-caption');
        });
    });

    var span = document.getElementsByClassName("close")[0];

    span.onclick = function() {
        modal.style.display = "none";
    }

    // Close modal when clicking outside the image
    modal.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape") {
            modal.style.display = "none";
        }
    });
});