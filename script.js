document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle'); // Tombol dark mode di navbar utama
    const body = document.body;
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // --- Fungsi untuk memperbarui tema dan ikon pada KEDUA tombol ---
    const updateThemeAndIcon = (isDarkMode) => {
        if (isDarkMode) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light-mode');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }

        // Sinkronkan ikon pada tombol di hamburger jika ada
        const hamburgerThemeToggleButton = document.getElementById('hamburger-theme-toggle');
        if (hamburgerThemeToggleButton) {
            const hamburgerIcon = hamburgerThemeToggleButton.querySelector('i');
            if (hamburgerIcon) {
                hamburgerIcon.classList.replace(isDarkMode ? 'fa-moon' : 'fa-sun', isDarkMode ? 'fa-sun' : 'fa-moon');
            }
            // Update teks 'Dark Mode'/'Light Mode'
            if (hamburgerThemeToggleButton.lastChild.nodeType === Node.TEXT_NODE) { // Check if it's a text node
                hamburgerThemeToggleButton.lastChild.nodeValue = isDarkMode ? ' Light Mode' : ' Dark Mode';
            } else {
                // If it's not a text node (e.g., an HTML comment), create one
                hamburgerThemeToggleButton.appendChild(document.createTextNode(isDarkMode ? ' Light Mode' : ' Dark Mode'));
            }
        }
    };

    // Inisialisasi status tema dan ikon saat dimuat
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        updateThemeAndIcon(currentTheme === 'dark-mode');
    } else {
        // Set default theme based on system preference
        updateThemeAndIcon(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }

    // Event listener untuk tombol dark mode di navbar utama
    if (themeToggle) { // Pastikan tombol ada sebelum menambahkan event listener
        themeToggle.addEventListener('click', () => {
            updateThemeAndIcon(!body.classList.contains('dark-mode')); // Toggle current state
        });
    }

    // --- Tambahkan tombol dark mode ke dalam hamburger menu ---
    // Buat elemen <li> untuk tombol dark mode di dalam hamburger
    const hamburgerThemeToggleLi = document.createElement('li');
    hamburgerThemeToggleLi.classList.add('nav-item'); // Pastikan memiliki kelas yang sama dengan item nav lainnya

    // Buat tombol itu sendiri
    const hamburgerThemeButton = document.createElement('button');
    hamburgerThemeButton.id = 'hamburger-theme-toggle'; // ID unik untuk tombol di hamburger
    hamburgerThemeButton.classList.add('theme-toggle');
    hamburgerThemeButton.setAttribute('aria-label', 'Toggle dark mode');

    // Tambahkan ikon dan teks ke tombol hamburger
    const iconClass = body.classList.contains('dark-mode') ? 'fas fa-sun' : 'fas fa-moon';
    hamburgerThemeButton.innerHTML = `<i class="${iconClass}"></i> ${body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode'}`;

    hamburgerThemeToggleLi.appendChild(hamburgerThemeButton); // Masukkan tombol ke dalam <li>

    // Cek apakah navMenu sudah berisi item dark mode ini, agar tidak terduplikasi saat re-render
    // Ini penting jika DOMContentLoaded bisa dipanggil berkali-kali atau jika ada library lain.
    // Cara yang lebih aman adalah dengan mencari elemen dengan ID unik ini sebelum menambahkannya.
    if (!document.getElementById('hamburger-theme-toggle')) {
        navMenu.appendChild(hamburgerThemeToggleLi); // Tambahkan ke dalam nav-menu
    }


    // Event listener untuk tombol dark mode di hamburger menu
    if (hamburgerThemeButton) { // Pastikan tombol ada sebelum menambahkan event listener
        hamburgerThemeButton.addEventListener('click', () => {
            updateThemeAndIcon(!body.classList.contains('dark-mode')); // Toggle current state
            // Tutup menu mobile setelah mengklik tombol toggle
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    }


    // --- Navbar fixed and scroll effect ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - navbar.clientHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') && link.getAttribute('href').includes(current)) {
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
                const offsetTop = targetSection.offsetTop - navbar.clientHeight;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                history.pushState(null, '', `#${targetId}`);

                if (navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }

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

    // Close nav menu when a link is clicked (for mobile)
    document.querySelectorAll('.nav-link').forEach(n => {
        if (n.getAttribute('href') && n.getAttribute('href').startsWith('#')) {
            n.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        }
    });

    // Set initial active link based on current section on load (and scroll)
    function setActiveNavLink() {
        let currentActive = '';
        const scrollPosition = window.pageYOffset + navbar.offsetHeight + 1;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentActive = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') && link.getAttribute('href').includes(currentActive)) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveNavLink);
    setActiveNavLink(); // Call on initial load

    // --- Scroll Animations (Intersection Observer) ---
    const faders = document.querySelectorAll('.section-title, .about-content p, .timeline-item, .education-item, .contact-intro, .contact-info, .signature, .gallery-item');

    const appearOptions = {
        threshold: 0.3,
        rootMargin: "0px 0px -100px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
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

    // Modal Image Gallery
    var modal = document.getElementById("myModal");
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");
    var galleryItems = document.querySelectorAll(".gallery-item");

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            modal.style.display = "flex";
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