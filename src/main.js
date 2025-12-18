/**
 * Nexa-Dapt.org — Full Interactive Script 2025
 * Библиотеки: GSAP, ScrollTrigger, Lenis, SplitType, Lucide
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 0. ПРЕДВАРИТЕЛЬНАЯ НАСТРОЙКА (Fixes) ---
    // Скрываем сообщение формы сразу, чтобы избежать мигания при загрузке
    const successMsg = document.getElementById('form-success');
    if (successMsg) {
        successMsg.style.display = 'none';
        successMsg.classList.remove('is-visible');
    }

    // Инициализация иконок Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- 1. ПЛАВНЫЙ СКРОЛЛ (Lenis) ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // --- 2. GSAP АНИМАЦИИ ---
    gsap.registerPlugin(ScrollTrigger);

    // Анимация текста в Hero (SplitType + GSAP)
    const heroTitle = new SplitType('.hero__title', { types: 'words, chars' });
    if (heroTitle.chars) {
        gsap.from(heroTitle.chars, {
            opacity: 0,
            y: 50,
            rotateX: -90,
            stagger: 0.03,
            duration: 1,
            ease: "back.out(1.7)",
            delay: 0.5
        });
    }

    // Анимация появления секций (Исправляет проблему с about__grid)
    const revealElements = document.querySelectorAll('.about__card, .case-card, .blog-card, .section-title, .innovation-item, .bento-card');
    revealElements.forEach((el) => {
        gsap.fromTo(el, 
            { opacity: 0, y: 60 },
            {
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            }
        );
    });

    // --- 3. ИНТЕРАКТИВ И КОМПОНЕНТЫ ---

    // Хедер при скролле
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    });

    // Мобильное меню
    const burger = document.getElementById('burger-menu');
    const mobileOverlay = document.getElementById('mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-menu__link');

    const toggleMenu = () => {
        mobileOverlay.classList.toggle('is-active');
        document.body.style.overflow = mobileOverlay.classList.contains('is-active') ? 'hidden' : '';
    };

    burger?.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));

    // Bento Grid - Эффект следящего света (Mouse Tracking)
    const bentoGrid = document.querySelector('.innovations__bento');
    const bentoCards = document.querySelectorAll('.bento-card');

    if (bentoGrid) {
        bentoGrid.addEventListener('mousemove', (e) => {
            bentoCards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    // Аккордеон FAQ
    const faqQuestions = document.querySelectorAll('.faq__question');
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const answer = btn.nextElementSibling;
            const isActive = btn.classList.contains('active');

            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.style.maxHeight = null;
            });

            if (!isActive) {
                btn.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // --- 4. ФОРМА И КАПЧА (Fix Success Message) ---
    const form = document.getElementById('main-form');
    const captchaLabel = document.getElementById('captcha-label');
    const captchaInput = document.getElementById('captcha-input');
    const phoneInput = document.getElementById('phone-input');

    // Математическая капча
    const n1 = Math.floor(Math.random() * 8) + 1;
    const n2 = Math.floor(Math.random() * 6) + 1;
    const correctSum = n1 + n2;
    if (captchaLabel) captchaLabel.innerText = `Подтвердите: ${n1} + ${n2} = ?`;

    // Валидация телефона (только цифры)
    phoneInput?.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });

    // Сабмит формы
    form?.addEventListener('submit', (e) => {
        e.preventDefault();

        if (parseInt(captchaInput.value) !== correctSum) {
            alert('Неверный ответ капчи!');
            return;
        }

        const btn = form.querySelector('button');
        const oldText = btn.innerText;
        btn.innerText = 'Отправка...';
        btn.disabled = true;

        // Имитация AJAX
        setTimeout(() => {
            form.reset();
            
            // Показ сообщения об успехе
            if (successMsg) {
                successMsg.style.display = 'block';
                setTimeout(() => successMsg.classList.add('is-visible'), 10);
                
                // Скрываем через 5 секунд
                setTimeout(() => {
                    successMsg.classList.remove('is-visible');
                    setTimeout(() => successMsg.style.display = 'none', 500);
                }, 5000);
            }

            btn.innerText = oldText;
            btn.disabled = false;
        }, 1500);
    });

    // --- 5. COOKIE POPUP ---
    const cookiePopup = document.getElementById('cookie-popup');
    const cookieAccept = document.getElementById('cookie-accept');

    if (!localStorage.getItem('nexa_cookies_done')) {
        setTimeout(() => {
            cookiePopup?.classList.add('cookie-popup--active');
        }, 3000);
    }

    cookieAccept?.addEventListener('click', () => {
        localStorage.setItem('nexa_cookies_done', 'true');
        cookiePopup?.classList.remove('cookie-popup--active');
    });

});