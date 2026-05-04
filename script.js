/* ============================================
   LA BASTIDE DES JONQUETS — JAVASCRIPT
   Vanilla JS · Aucune dépendance
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── HEADER SCROLL ─── */
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ─── MOBILE MENU ─── */
  const burger = document.getElementById('burger');
  const navMobile = document.getElementById('navMobile');
  const navOverlay = document.getElementById('navOverlay');

  function toggleMenu() {
    burger?.classList.toggle('active');
    navMobile?.classList.toggle('active');
    navOverlay?.classList.toggle('active');
    document.body.style.overflow = navMobile?.classList.contains('active') ? 'hidden' : '';
  }

  burger?.addEventListener('click', toggleMenu);
  navOverlay?.addEventListener('click', toggleMenu);
  navMobile?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    if (navMobile.classList.contains('active')) toggleMenu();
  }));

  /* ─── SMOOTH SCROLL ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = (header?.offsetHeight || 70) + 20;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── SCROLL REVEAL ─── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ─── LIGHTBOX ─── */
  const galleryItems = document.querySelectorAll('[data-lightbox]');
  let lightbox = null;

  function openLightbox(src, alt) {
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML = `
        <img src="" alt="" loading="lazy">
        <button class="lightbox-close" aria-label="Fermer">&times;</button>
      `;
      lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
      document.body.appendChild(lightbox);
    }
    const img = lightbox.querySelector('img');
    img.src = src; img.alt = alt || '';
    requestAnimationFrame(() => lightbox.classList.add('active'));
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox?.classList.remove('active');
    document.body.style.overflow = '';
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ─── CONTACT FORM ─── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]')?.value.trim();
      const email = form.querySelector('[name="email"]')?.value.trim();
      const msg = form.querySelector('[name="message"]')?.value.trim();

      if (!name || !email || !msg) {
        showToast('Veuillez remplir tous les champs obligatoires.', 'error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Veuillez entrer une adresse email valide.', 'error');
        return;
      }

      showToast('Votre message a bien été envoyé ! Nous vous répondrons très vite.', 'success');
      form.reset();
    });
  }

  function showToast(message, type) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 5000);
  }

  /* ─── ACTIVE NAV LINK ─── */
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-desktop a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.endsWith(href.replace(/^\./, ''))) {
      link.classList.add('active');
    }
  });

  /* ─── PARALLAX HERO (subtle) ─── */
  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg && !window.matchMedia('(pointer: coarse)').matches) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.15}px) scale(${1 + scrolled * 0.0001})`;
      }
    }, { passive: true });
  }

});
