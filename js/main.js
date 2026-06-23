/* ============================================================
   CAYETANA ENCINAS — JavaScript Principal
   ============================================================ */

// ── Barra de progreso de scroll ────────────────────────────────
(function () {
  const bar = document.createElement('div');
  bar.id = 'scrollProgress';
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  });
})();

// ── Navbar scroll ──────────────────────────────────────────────
(function () {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
})();

// ── Botón volver arriba ────────────────────────────────────────
(function () {
  const btn = document.getElementById('toTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// ── Animaciones fade-in al hacer scroll ────────────────────────
(function () {
  const els = document.querySelectorAll('.fade-in-up');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 60);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
})();

// ── Lightbox Premium ───────────────────────────────────────────
(function () {
  let images = [];
  let currentIdx = 0;
  let overlayBuilt = false;

  function buildLightbox () {
    if (overlayBuilt) return;
    overlayBuilt = true;

    /*
      Estructura del lightbox:
      #lb-overlay  (fondo negro, position:fixed, inset:0)
        #lb-close  (botón X — position:absolute top-right, z-index muy alto)
        #lb-counter (posición absoluta arriba centro)
        #lb-prev   (botón izquierda — position:absolute, mitad izquierda)
        #lb-next   (botón derecha  — position:absolute, mitad derecha)
        #lb-wrap   (contenedor imagen, centrado)
          #lb-img
          #lb-caption
    */

    const overlay = document.createElement('div');
    overlay.id = 'lb-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    // ── Botón cerrar (fuera del área de navegación) ──
    const btnClose = document.createElement('button');
    btnClose.id = 'lb-close';
    btnClose.setAttribute('aria-label', 'Cerrar');
    btnClose.innerHTML = '&#x2715;';
    btnClose.addEventListener('click', closeLB);

    // ── Contador ──
    const counter = document.createElement('div');
    counter.id = 'lb-counter';

    // ── Botón anterior ──
    const btnPrev = document.createElement('button');
    btnPrev.id = 'lb-prev';
    btnPrev.setAttribute('aria-label', 'Foto anterior');
    btnPrev.innerHTML = '&#8249;';
    btnPrev.addEventListener('click', () => navigate(-1));

    // ── Botón siguiente ──
    const btnNext = document.createElement('button');
    btnNext.id = 'lb-next';
    btnNext.setAttribute('aria-label', 'Foto siguiente');
    btnNext.innerHTML = '&#8250;';
    btnNext.addEventListener('click', () => navigate(1));

    // ── Imagen ──
    const img = document.createElement('img');
    img.id = 'lb-img';
    img.alt = '';

    // ── Pie de foto ──
    const caption = document.createElement('div');
    caption.id = 'lb-caption';

    // ── Contenedor central ──
    const wrap = document.createElement('div');
    wrap.id = 'lb-wrap';
    wrap.appendChild(img);
    wrap.appendChild(caption);

    overlay.appendChild(btnClose);
    overlay.appendChild(counter);
    overlay.appendChild(btnPrev);
    overlay.appendChild(wrap);
    overlay.appendChild(btnNext);
    document.body.appendChild(overlay);

    // Cerrar al hacer clic en el fondo oscuro (no en la imagen)
    overlay.addEventListener('click', e => {
      if (e.target === overlay || e.target === wrap) closeLB();
    });

    // Teclado
    document.addEventListener('keydown', e => {
      if (!overlay.classList.contains('lb-active')) return;
      if (e.key === 'Escape')     closeLB();
      if (e.key === 'ArrowLeft')  navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });

    // Swipe táctil
    let touchStartX = 0;
    overlay.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    overlay.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
    });
  }

  function showImage (idx) {
    const img     = document.getElementById('lb-img');
    const caption = document.getElementById('lb-caption');
    const counter = document.getElementById('lb-counter');
    const btnPrev = document.getElementById('lb-prev');
    const btnNext = document.getElementById('lb-next');

    img.style.opacity = '0';
    img.onload = () => { img.style.opacity = '1'; };
    img.src = images[idx].src;
    img.alt = images[idx].alt || '';

    caption.textContent = images[idx].caption || '';
    counter.textContent = images.length > 1 ? `${idx + 1} / ${images.length}` : '';

    // Ocultar flechas si solo hay una imagen
    const showNav = images.length > 1;
    btnPrev.style.visibility = showNav ? 'visible' : 'hidden';
    btnNext.style.visibility = showNav ? 'visible' : 'hidden';
  }

  function openLB (idx) {
    currentIdx = idx;
    const overlay = document.getElementById('lb-overlay');
    showImage(idx);
    overlay.classList.add('lb-active');
    document.body.style.overflow = 'hidden';
  }

  function closeLB () {
    const overlay = document.getElementById('lb-overlay');
    if (overlay) overlay.classList.remove('lb-active');
    document.body.style.overflow = '';
  }

  function navigate (dir) {
    currentIdx = (currentIdx + dir + images.length) % images.length;
    showImage(currentIdx);
  }

  /*
    initLightbox(selector)
    ──────────────────────
    selector puede apuntar a:
      - la <img> directamente  → '.diario-card-img img'
      - el contenedor padre    → '.galeria-item'

    Si el selector apunta al contenedor, se busca la <img> dentro
    para obtener el src, pero el listener de click se pone en el
    contenedor (así el overlay no bloquea el click).
  */
  window.initLightbox = function (selector) {
    buildLightbox();
    images = [];

    const nodes = Array.from(document.querySelectorAll(selector));
    if (!nodes.length) return;

    nodes.forEach((node, i) => {
      // Determinar si el nodo es una img o un contenedor
      const isImg = node.tagName === 'IMG';
      const imgEl = isImg ? node : node.querySelector('img');
      if (!imgEl) return;

      const src     = imgEl.getAttribute('data-full') || imgEl.src;
      const alt     = imgEl.alt || '';
      const caption = node.getAttribute('data-caption')
                   || imgEl.getAttribute('data-caption')
                   || imgEl.closest('[data-caption]')?.getAttribute('data-caption')
                   || node.querySelector('.galeria-item-caption')?.textContent
                   || alt;

      images.push({ src, alt, caption });

      // Cursor
      node.style.cursor = 'zoom-in';

      // Click en el contenedor (no en la img) para evitar que el overlay lo bloquee
      node.addEventListener('click', (e) => {
        e.stopPropagation();
        openLB(i);
      });
    });
  };
})();

// ── Contador animado ───────────────────────────────────────────
(function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  function animateCounter (el) {
    const target = parseInt(el.dataset.count, 10);
    if (target === 0) { el.textContent = '0'; return; }
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current);
    }, 16);
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  counters.forEach(c => obs.observe(c));
})();
