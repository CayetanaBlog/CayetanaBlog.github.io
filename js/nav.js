/* ============================================================
   Navegación compartida para páginas interiores
   ============================================================ */
(function () {
  // Detectar página activa
  const path = window.location.pathname.split('/').pop();

  const links = [
    { href: '../index.html',           label: 'Inicio',        file: 'index.html' },
    { href: 'galeria.html',            label: 'Galería',       file: 'galeria.html' },
    { href: 'eventos.html',            label: 'Eventos',       file: 'eventos.html' },
    { href: 'diario.html',             label: 'Diario',        file: 'diario.html' },
    { href: 'logros.html',             label: 'Logros',        file: 'logros.html' },
    { href: 'videos.html',             label: 'Vídeos',        file: 'videos.html' },
    { href: 'estadisticas.html',       label: 'Estadísticas',  file: 'estadisticas.html' },
    { href: 'historia.html',           label: 'Historia',      file: 'historia.html' },
    { href: 'sobre.html',              label: 'Sobre mí',      file: 'sobre.html' },
    { href: 'contacto.html',           label: 'Contacto',      file: 'contacto.html' },
  ];

  function buildNav () {
    const linksHtml = links.map(l =>
      `<a href="${l.href}" class="${path === l.file ? 'active' : ''}">${l.label}</a>`
    ).join('');

    const mobileLinksHtml = links.map(l =>
      `<a href="${l.href}" class="${path === l.file ? 'active' : ''}">${l.label}</a>`
    ).join('') + `<a href="https://instagram.com/caye.15" target="_blank" rel="noopener">Instagram @caye.15</a>`;

    const nav = document.createElement('nav');
    nav.className = 'navbar';
    nav.id = 'navbar';
    nav.innerHTML = `
      <a href="../index.html" class="navbar-brand">
        <img src="../images/foto_caye.jpg" alt="Cayetana" />
        <span>Cayetana <em>Encinas</em></span>
      </a>
      <div class="navbar-links">${linksHtml}</div>
      <div class="navbar-social">
        <a href="https://instagram.com/caye.15" target="_blank" rel="noopener" aria-label="Instagram">
          <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg" alt="Instagram" />
          <span>@caye.15</span>
        </a>
      </div>
      <button class="hamburger" id="hamburger" aria-label="Abrir menú">
        <span></span><span></span><span></span>
      </button>
    `;

    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.id = 'mobileMenu';
    mobileMenu.innerHTML = mobileLinksHtml;

    document.body.prepend(mobileMenu);
    document.body.prepend(nav);

    // Hamburguesa
    const hamburger = document.getElementById('hamburger');
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildNav);
  } else {
    buildNav();
  }
})();
