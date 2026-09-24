gsap.registerPlugin(ScrollTrigger);

// ── INTRO ────────────────────────────────────────────────────────────────────
const introEl          = document.getElementById('intro');
const introLogo        = document.getElementById('introLogo');
const introCurtainTop  = document.getElementById('introCurtainTop');
const introCurtainBot  = document.getElementById('introCurtainBottom');

document.body.style.overflow = 'hidden';

gsap.timeline({
  onComplete() {
    introEl.remove();
    document.body.style.overflow = '';
  },
})
  // logo aparece: escala desde 0.7 con fade
  .to(introLogo, { opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out',
                   startAt: { scale: 0.7 } })
  // pausa breve
  .to({}, { duration: 0.55 })
  // cortinas se abren (arriba ↑ / abajo ↓) y logo "va" al fondo escalando
  .to(introCurtainTop, { yPercent: -100, duration: 0.75, ease: 'power3.inOut' }, '>')
  .to(introCurtainBot, { yPercent:  100, duration: 0.75, ease: 'power3.inOut' }, '<')
  .to(introLogo,       { opacity: 0, scale: 1.35, duration: 0.55,
                         ease: 'power2.in' }, '<0.1');
// ─────────────────────────────────────────────────────────────────────────────

// ── HERO VIDEO PLAYLIST ───────────────────────────────────────────────────────
(function() {
  const videos = [
    'assets/video_home/MVI_7099.mov',
    'assets/video_home/MVI_7144.MOV',
    'assets/video_home/MVI_7181.MOV',
  ];
  const vid = document.getElementById('heroVideo');
  if (!vid) return;
  let idx = 0;
  vid.addEventListener('ended', () => {
    idx = (idx + 1) % videos.length;
    vid.src = videos[idx];
    vid.play();
  });
})();
// ─────────────────────────────────────────────────────────────────────────────

// custom cursor
const cursor = document.getElementById('cursor');
window.addEventListener('mousemove', (e) => {
  gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.15, ease: 'power2.out' });
});
// delegado (en vez de listeners por elemento) para que también funcione en slides clonados del carrusel
document.addEventListener('mouseover', (e) => {
  if (e.target.closest('[data-hover]')) cursor.classList.add('hover');
});
document.addEventListener('mouseout', (e) => {
  if (e.target.closest('[data-hover]') && !e.relatedTarget?.closest('[data-hover]')) {
    cursor.classList.remove('hover');
  }
});

// mobile menu toggle
const navToggle = document.getElementById('navToggle');
const menuOverlay = document.getElementById('menuOverlay');
navToggle.addEventListener('click', () => {
  menuOverlay.classList.toggle('open');
});
menuOverlay.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => menuOverlay.classList.remove('open'));
});

// scribble-word: aparece con un pequeño "garabateo" rotando, como un trazo de marcador
gsap.set('.hero-scribble-word', { opacity: 0, scale: 0.6, rotate: -25 });
gsap.to('.hero-scribble-word', {
  opacity: 1,
  scale: 1,
  rotate: -9,
  duration: 0.6,
  delay: 0.9,
  ease: 'back.out(2.5)',
});

// logo doodle: entrada + flotación continua
const heroLogo = document.getElementById('heroLogo');
gsap.set(heroLogo, { opacity: 0, scale: 0.5, rotate: 30 });
gsap.to(heroLogo, { opacity: 1, scale: 1, rotate: 8, duration: 0.8, delay: 0.6, ease: 'back.out(1.7)' });
gsap.to(heroLogo, { rotate: 14, y: '+=6', duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.4 });

// bio: entrada con fade
gsap.set('.hero-bio-text', { opacity: 0, y: 20 });
gsap.to('.hero-bio-text', { opacity: 1, y: 0, duration: 0.9, delay: 1, ease: 'power3.out' });

// cápsula de video: entrada + parallax con el mouse
const heroVideoFrame = document.getElementById('heroVideoFrame');
gsap.set(heroVideoFrame, { opacity: 0, y: 40 });
gsap.to(heroVideoFrame, { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power3.out' });

window.addEventListener('mousemove', (e) => {
  const xRatio = (e.clientX / window.innerWidth - 0.5) * 16;
  const yRatio = (e.clientY / window.innerHeight - 0.5) * 16;
  gsap.to(heroVideoFrame, { x: xRatio, y: yRatio, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
});

// hero entrance animation
gsap.to('.reveal-line span', {
  y: '0%',
  duration: 1,
  stagger: 0.12,
  ease: 'power4.out',
  delay: 0.2,
});

// scroll-triggered reveals
gsap.utils.toArray('.reveal-fade').forEach((el) => {
  gsap.set(el, { opacity: 0, y: 30 });
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }),
  });
});

gsap.utils.toArray('.section-label, .section-title').forEach((el) => {
  gsap.set(el, { opacity: 0, y: 24 });
  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }),
  });
});

gsap.utils.toArray('.project-row').forEach((row, i) => {
  ScrollTrigger.create({
    trigger: row,
    start: 'top 92%',
    onEnter: () => gsap.to(row, {
      clipPath: 'inset(0 0% 0 0)',
      duration: 0.75,
      delay: i * 0.07,
      ease: 'power3.out',
    }),
  });
});

// carrusel de proyecto (acordeón con marquee continuo, estilo referente)
document.querySelectorAll('[data-carousel-toggle]').forEach((toggleBtn) => {
  const carousel = document.getElementById(toggleBtn.dataset.carouselToggle);
  if (!carousel) return;

  const track = carousel.querySelector('.carousel-track');
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');

  const originalSlides = Array.from(track.children);

  const SPEED_NORMAL = parseInt(toggleBtn.dataset.speed || '110');
  const SPEED_SLOW = Math.round(SPEED_NORMAL * 0.25);
  let loopWidth = 0;
  let marqueeTween = null;

  // clonar suficientes veces para que el loop no sea obvio (mínimo 4 sets)
  const setsNeeded = Math.max(1, Math.ceil(4 / originalSlides.length));
  for (let s = 0; s < setsNeeded; s++) {
    originalSlides.forEach(slide => track.appendChild(slide.cloneNode(true)));
  }

  function buildMarquee() {
    if (marqueeTween) marqueeTween.kill();
    gsap.set(track, { x: 0 });
    const gap = parseFloat(getComputedStyle(track).gap || 0);
    loopWidth = originalSlides.reduce((sum, s) => sum + s.getBoundingClientRect().width + gap, 0);
    marqueeTween = gsap.to(track, {
      x: -loopWidth,
      duration: loopWidth / SPEED_NORMAL,
      ease: 'none',
      repeat: -1,
    });
  }

  function setSpeed(pxPerSecond) {
    if (!marqueeTween) return;
    // timeScale conserva la posición actual del recorrido (no reinicia el loop)
    marqueeTween.timeScale(pxPerSecond / SPEED_NORMAL);
  }

  // flechas: nudge manual sin frenar el movimiento continuo
  function nudge(direction) {
    if (!marqueeTween) return;
    const slideStep = loopWidth / originalSlides.length;
    marqueeTween.totalTime(marqueeTween.totalTime() + direction * (slideStep / SPEED_NORMAL));
  }
  prevBtn.addEventListener('click', () => nudge(-1));
  nextBtn.addEventListener('click', () => nudge(1));

  // se alentiza solo al posarse sobre una foto del carrusel, no en toda la sección
  track.addEventListener('mouseover', (e) => {
    if (e.target.closest('.carousel-slide')) setSpeed(SPEED_SLOW);
  });
  track.addEventListener('mouseout', (e) => {
    if (e.target.closest('.carousel-slide') && !e.relatedTarget?.closest('.carousel-slide')) {
      setSpeed(SPEED_NORMAL);
    }
  });

  toggleBtn.addEventListener('click', () => {
    const isOpen = carousel.classList.toggle('is-open');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));

    // si este carrusel está anidado, expande/contrae el panel padre
    const parentId = toggleBtn.dataset.parentCarousel;
    if (parentId) {
      const parentCarousel = document.getElementById(parentId);
      if (parentCarousel) {
        parentCarousel.classList.toggle('is-expanded', isOpen);
      }
    }

    if (isOpen) {
      buildMarquee();
    } else if (marqueeTween) {
      marqueeTween.pause();
    }
  });

  window.addEventListener('resize', () => {
    if (carousel.classList.contains('is-open')) buildMarquee();
  });
});

// carpetas de ilustración: abre panel a pantalla completa con grid de imágenes
const folderOverlay  = document.getElementById('folderOverlay');
const folderBack     = document.getElementById('folderBack');
const folderTitle    = document.getElementById('folderOverlayTitle');
const folderCountEl  = document.getElementById('folderOverlayCount');
const folderGrid     = document.getElementById('folderOverlayGrid');

const FOLDERS = {
  panico: {
    title: 'Pánico',
    images: [
      { src: 'assets/proyectos/editorial/PÁNICO/374bc113-83e8-40fa-9847-220cbcec2854.jpg', alt: 'Pánico 1' },
      { src: 'assets/proyectos/editorial/PÁNICO/6856d795-5597-4d62-a92f-60f3f54679c6.jpg', alt: 'Pánico 2' },
      { src: 'assets/proyectos/editorial/PÁNICO/7299f14f-fa2f-4126-864b-c38b89ed288a.jpg', alt: 'Pánico 3' },
      { src: 'assets/proyectos/editorial/PÁNICO/81e1c716-12da-4e09-8758-0a039bac2b6c.jpg', alt: 'Pánico 4' },
      { src: 'assets/proyectos/editorial/PÁNICO/d7bd9b24-6abc-4751-80c4-51715c719dc4.jpg', alt: 'Pánico 5' },
    ],
  },
  gatos: {
    title: 'Gatos',
    images: [
      { src: 'assets/proyectos/Ilustración/Gatos/gato1.jpg', alt: 'Gato 1' },
      { src: 'assets/proyectos/Ilustración/Gatos/gato2.jpg', alt: 'Gato 2' },
      { src: 'assets/proyectos/Ilustración/Gatos/gato3.jpg', alt: 'Gato 3' },
      { src: 'assets/proyectos/Ilustración/Gatos/gato4.jpg', alt: 'Gato 4' },
      { src: 'assets/proyectos/Ilustración/Gatos/gato5.jpg', alt: 'Gato 5' },
    ],
  },
  paseoahumada: {
    title: 'Paseo Ahumada',
    layout: 'paseoahumada',
  },
  norte: {
    title: 'Aves del Norte',
    images: Array.from({length: 23}, (_, i) => ({
      src: `assets/proyectos/editorial/Aves de Chile/Aves del norte/pages/page_${String(i+1).padStart(2,'0')}.jpg`,
      alt: `Aves del Norte — página ${i+1}`,
    })),
  },
  centro: {
    title: 'Aves del Centro',
    images: Array.from({length: 27}, (_, i) => ({
      src: `assets/proyectos/editorial/Aves de Chile/Aves del centro/pages/page_${String(i+1).padStart(2,'0')}.jpg`,
      alt: `Aves del Centro — página ${i+1}`,
    })),
  },
  sur: {
    title: 'Aves del Sur',
    images: Array.from({length: 31}, (_, i) => ({
      src: `assets/proyectos/editorial/Aves de Chile/Aves del sur/pages/page_${String(i+1).padStart(2,'0')}.jpg`,
      alt: `Aves del Sur — página ${i+1}`,
    })),
  },
  aves: {
    title: 'Aves de Chile',
    images: [
      { src: 'assets/proyectos/Ilustración/Aves/Agachona_De_La_Puna.jpg',    alt: 'Agachona de la Puna' },
      { src: 'assets/proyectos/Ilustración/Aves/Albatros_De_Ceja_Negra.jpg', alt: 'Albatros de Ceja Negra' },
      { src: 'assets/proyectos/Ilustración/Aves/Águila_Mora.jpg',            alt: 'Águila Mora' },
      { src: 'assets/proyectos/Ilustración/Aves/Canastero_Del_Tamarugal.jpg',alt: 'Canastero del Tamarugal' },
      { src: 'assets/proyectos/Ilustración/Aves/Carpintero_Negro.jpg',       alt: 'Carpintero Negro' },
      { src: 'assets/proyectos/Ilustración/Aves/Cernícalo.jpg',              alt: 'Cernícalo' },
      { src: 'assets/proyectos/Ilustración/Aves/Chercán.jpg',                alt: 'Chercán' },
      { src: 'assets/proyectos/Ilustración/Aves/Chincol_.jpg',               alt: 'Chincol' },
      { src: 'assets/proyectos/Ilustración/Aves/Chorlito_De_La_Puna.jpg',    alt: 'Chorlito de la Puna' },
      { src: 'assets/proyectos/Ilustración/Aves/Chucao_.jpg',                alt: 'Chucao' },
      { src: 'assets/proyectos/Ilustración/Aves/Churrete_Costero.jpg',       alt: 'Churrete Costero' },
      { src: 'assets/proyectos/Ilustración/Aves/Cisne_Coscoroba.jpg',        alt: 'Cisne Coscoroba' },
      { src: 'assets/proyectos/Ilustración/Aves/Cisne_De_Cuello_Negro.jpg',  alt: 'Cisne de Cuello Negro' },
      { src: 'assets/proyectos/Ilustración/Aves/Codorniz.jpg',               alt: 'Codorniz' },
      { src: 'assets/proyectos/Ilustración/Aves/Concón_o_Lechuza.jpg',       alt: 'Concón o Lechuza' },
      { src: 'assets/proyectos/Ilustración/Aves/Cormorán_Imperial.jpg',      alt: 'Cormorán Imperial' },
      { src: 'assets/proyectos/Ilustración/Aves/Cóndor_.jpg',                alt: 'Cóndor' },
      { src: 'assets/proyectos/Ilustración/Aves/Diucón.jpg',                 alt: 'Diucón' },
      { src: 'assets/proyectos/Ilustración/Aves/Fío-fío.jpg',                alt: 'Fío-fío' },
      { src: 'assets/proyectos/Ilustración/Aves/Flamenco_Andino.jpg',        alt: 'Flamenco Andino' },
      { src: 'assets/proyectos/Ilustración/Aves/Flamenco_Chileno.jpg',       alt: 'Flamenco Chileno' },
      { src: 'assets/proyectos/Ilustración/Aves/Garza_Cuca.jpg',             alt: 'Garza Cuca' },
      { src: 'assets/proyectos/Ilustración/Aves/Gaviota_Austral.jpg',        alt: 'Gaviota Austral' },
      { src: 'assets/proyectos/Ilustración/Aves/Gaviota_Dominicana.jpg',     alt: 'Gaviota Dominicana' },
      { src: 'assets/proyectos/Ilustración/Aves/Gaviota_Garuma_.jpg',        alt: 'Gaviota Garuma' },
      { src: 'assets/proyectos/Ilustración/Aves/Gaviotín_Chico.jpg',         alt: 'Gaviotín Chico' },
      { src: 'assets/proyectos/Ilustración/Aves/Golondrina_Chilena.jpg',     alt: 'Golondrina Chilena' },
      { src: 'assets/proyectos/Ilustración/Aves/Golondrina_Negra.jpg',       alt: 'Golondrina Negra' },
      { src: 'assets/proyectos/Ilustración/Aves/Huala_.jpg',                 alt: 'Huala' },
      { src: 'assets/proyectos/Ilustración/Aves/Hued-hued.jpg',              alt: 'Hued-hued' },
      { src: 'assets/proyectos/Ilustración/Aves/Huet-huet_.jpg',             alt: 'Huet-huet' },
      { src: 'assets/proyectos/Ilustración/Aves/Loro_Choroy_.jpg',           alt: 'Loro Choroy' },
      { src: 'assets/proyectos/Ilustración/Aves/Ñandu.jpg',                  alt: 'Ñandú' },
      { src: 'assets/proyectos/Ilustración/Aves/Pajonero_Cordillerano.jpg',  alt: 'Pajonero Cordillerano' },
      { src: 'assets/proyectos/Ilustración/Aves/Pato_Colorado.jpg',          alt: 'Pato Colorado' },
      { src: 'assets/proyectos/Ilustración/Aves/Pato_De_Collar.jpg',         alt: 'Pato de Collar' },
      { src: 'assets/proyectos/Ilustración/Aves/Pato_Jergón.jpg',            alt: 'Pato Jergón' },
      { src: 'assets/proyectos/Ilustración/Aves/Pato_Puna.jpg',              alt: 'Pato Puna' },
      { src: 'assets/proyectos/Ilustración/Aves/Pájaro_Carpintero_.jpg',     alt: 'Pájaro Carpintero' },
      { src: 'assets/proyectos/Ilustración/Aves/Perdiz_Chilena.jpg',         alt: 'Perdiz Chilena' },
      { src: 'assets/proyectos/Ilustración/Aves/Perdiz_De_La_Puna.jpg',      alt: 'Perdiz de la Puna' },
      { src: 'assets/proyectos/Ilustración/Aves/Peuco_.jpg',                 alt: 'Peuco' },
      { src: 'assets/proyectos/Ilustración/Aves/Picaflor.jpg',               alt: 'Picaflor' },
      { src: 'assets/proyectos/Ilustración/Aves/Pimpollo.jpg',               alt: 'Pimpollo' },
      { src: 'assets/proyectos/Ilustración/Aves/Pingüino_De_Magallanes.jpg', alt: 'Pingüino de Magallanes' },
      { src: 'assets/proyectos/Ilustración/Aves/Pingüino_Rey.jpg',           alt: 'Pingüino Rey' },
      { src: 'assets/proyectos/Ilustración/Aves/Pitío.jpg',                  alt: 'Pitío' },
      { src: 'assets/proyectos/Ilustración/Aves/Piuquén_Andino.jpg',         alt: 'Piuquén Andino' },
      { src: 'assets/proyectos/Ilustración/Aves/Queltehue.jpg',              alt: 'Queltehue' },
      { src: 'assets/proyectos/Ilustración/Aves/Rayadito.jpg',               alt: 'Rayadito' },
      { src: 'assets/proyectos/Ilustración/Aves/Tagua_Gigante.jpg',          alt: 'Tagua Gigante' },
      { src: 'assets/proyectos/Ilustración/Aves/Tenca_.jpg',                 alt: 'Tenca' },
      { src: 'assets/proyectos/Ilustración/Aves/Tenca_Nortina_.jpg',         alt: 'Tenca Nortina' },
      { src: 'assets/proyectos/Ilustración/Aves/Tiuque.jpg',                 alt: 'Tiuque' },
      { src: 'assets/proyectos/Ilustración/Aves/Tórtola.jpg',                alt: 'Tórtola' },
      { src: 'assets/proyectos/Ilustración/Aves/Yeco_.jpg',                  alt: 'Yeco' },
      { src: 'assets/proyectos/Ilustración/Aves/Zorzal.jpg',                 alt: 'Zorzal' },
    ],
  },
};

const CATALOG_KEYS = new Set(['norte', 'centro', 'sur']);

const CUSTOM_LAYOUTS = {
  paseoahumada: `
    <div class="layout-pa">
      <div class="layout-pa-left">
        <img src="assets/proyectos/editorial/Paseo Ahumada/pages/page_01.jpg" alt="Tela — Paseo Ahumada" class="layout-pa-tela">
      </div>
      <div class="layout-pa-right">
        <div class="layout-pa-photo">
          <img src="assets/proyectos/editorial/Paseo Ahumada/IMG_5727.JPG" alt="Paseo Ahumada">
        </div>
        <div class="layout-pa-videos">
          <video src="assets/proyectos/editorial/Paseo Ahumada/IMG_5709.MOV" autoplay muted loop playsinline></video>
          <video src="assets/proyectos/editorial/Paseo Ahumada/IMG_5732.MOV" autoplay muted loop playsinline></video>
        </div>
      </div>
    </div>
  `,
};

function openFolder(key) {
  const data = FOLDERS[key];
  if (!data) return;
  folderTitle.textContent = data.title;

  if (data.layout && CUSTOM_LAYOUTS[data.layout]) {
    folderCountEl.textContent = '';
    folderGrid.className = 'folder-overlay-grid folder-overlay-grid--custom';
    folderGrid.innerHTML = CUSTOM_LAYOUTS[data.layout];
  } else {
    const isCatalog = CATALOG_KEYS.has(key);
    folderCountEl.textContent = data.images.length + (isCatalog ? ' páginas' : ' ilustraciones');
    folderGrid.className = 'folder-overlay-grid' + (isCatalog ? ' folder-overlay-grid--catalog' : '');
    folderGrid.innerHTML = data.images.map(item =>
      item.type === 'video'
        ? `<video src="${item.src}" class="folder-grid-video" data-hover data-video="${item.src}" autoplay muted loop playsinline></video>`
        : `<img loading="lazy" src="${item.src}" alt="${item.alt}" data-hover data-lightbox>`
    ).join('');
  }

  folderOverlay.classList.add('is-open');
  folderOverlay.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function closeFolder() {
  folderOverlay.classList.remove('is-open');
  document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
  const folderLightbox = e.target.closest('[data-folder-lightbox]');
  if (folderLightbox) { openLightbox(folderLightbox.dataset.folderLightbox, folderLightbox.querySelector('.folder-name')?.textContent || ''); return; }
  const folder = e.target.closest('[data-folder]');
  if (folder) openFolder(folder.dataset.folder);
});

folderBack.addEventListener('click', closeFolder);
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeFolder();
});

// lightbox: agranda en pantalla casi completa al clickear una imagen del carrusel
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxVideo = document.getElementById('lightboxVideo');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt || '';
  lightboxImg.style.display = '';
  lightboxVideo.style.display = 'none';
  lightboxVideo.pause();
  lightboxVideo.src = '';
  lightbox.classList.add('is-open');
}

function openVideoLightbox(src) {
  lightboxVideo.src = src;
  lightboxVideo.style.display = '';
  lightboxImg.style.display = 'none';
  lightboxImg.src = '';
  lightbox.classList.add('is-open');
  lightboxVideo.play();
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  lightboxImg.src = '';
  lightboxVideo.pause();
  lightboxVideo.src = '';
}

document.addEventListener('click', (e) => {
  const pdfSlide = e.target.closest('[data-pdf]');
  if (pdfSlide) { window.open(pdfSlide.dataset.pdf, '_blank', 'noopener'); return; }
  const videoSlide = e.target.closest('[data-video]');
  if (videoSlide) { openVideoLightbox(videoSlide.dataset.video); return; }
  const gifImg = e.target.closest('[data-lightbox]');
  if (gifImg) { openLightbox(gifImg.dataset.gif || gifImg.src, gifImg.alt); return; }
  // cualquier imagen dentro de un slide de carrusel abre el lightbox
  const slideImg = e.target.closest('.carousel-slide:not(.carousel-folder):not(.carousel-pdf):not(.carousel-slide--video) img');
  if (slideImg) { openLightbox(slideImg.src, slideImg.alt); return; }
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// formulario de contacto
const contactForm  = document.getElementById('contactForm');
const sendSuccess  = document.getElementById('sendSuccess');
const sendSuccessText = sendSuccess?.querySelector('.send-success-text');

function showSendSuccess() {
  sendSuccess.classList.add('is-visible');
  // fondo aparece
  gsap.to(sendSuccess, { opacity: 1, duration: 0.4, ease: 'power2.out' });
  // texto sube y aparece con letras stagger
  gsap.to(sendSuccessText, { opacity: 1, y: 0, duration: 0.7, delay: 0.15, ease: 'power3.out' });
  // escala leve para dar vida
  gsap.fromTo(sendSuccessText, { scale: 0.92 }, { scale: 1, duration: 0.7, delay: 0.15, ease: 'back.out(1.4)' });
  // desaparece automáticamente a los 3 segundos
  setTimeout(() => {
    gsap.to(sendSuccessText, { opacity: 0, y: -20, duration: 0.45, ease: 'power2.in' });
    gsap.to(sendSuccess, {
      opacity: 0, duration: 0.5, delay: 0.35, ease: 'power2.in',
      onComplete: () => {
        sendSuccess.classList.remove('is-visible');
        gsap.set(sendSuccessText, { y: 40 });
      },
    });
  }, 3000);
}

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    btn.style.opacity = '0.5';
    btn.style.pointerEvents = 'none';
    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        contactForm.reset();
        showSendSuccess();
      }
    } finally {
      btn.style.opacity = '';
      btn.style.pointerEvents = '';
    }
  });
}
