
/* THE MIND — Cinematic Gallery */
(() => {
  const festivals = document.getElementById('festivals');
  if (!festivals || document.getElementById('gallery')) return;

  const style = document.createElement('style');
  style.textContent = `
    .gallery-section {
      border-top: 1px solid rgba(255,255,255,.13);
    }
    .gallery-heading {
      font: 800 clamp(44px,7vw,100px)/1.01 Manrope,sans-serif;
      letter-spacing: -.07em;
      margin: 25px 0;
    }
    .gallery-heading em {
      font-style: normal;
      font-weight: 300;
      color: #a5a09b;
    }
    .gallery-description {
      max-width: 600px;
      color: #aaa5a0;
      line-height: 1.8;
      margin-bottom: 45px;
    }
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(12,minmax(0,1fr));
      gap: 16px;
    }
    .gallery-item {
      grid-column: span 4;
      min-width: 0;
      display: block;
      padding: 0;
      margin: 0;
      background: transparent;
      border: 0;
      color: inherit;
      text-align: left;
      cursor: zoom-in;
    }
    .gallery-item:nth-child(7n + 1),
    .gallery-item:nth-child(7n + 5) {
      grid-column: span 8;
    }
    .gallery-image-wrap {
      display: block;
      aspect-ratio: 4/3;
      overflow: hidden;
      background: #191919;
    }
    .gallery-item:nth-child(7n + 1) .gallery-image-wrap,
    .gallery-item:nth-child(7n + 5) .gallery-image-wrap {
      aspect-ratio: 16/9;
    }
    .gallery-image-wrap img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      filter: saturate(.8) contrast(1.07);
      transition: transform .6s ease, filter .6s ease;
    }
    .gallery-item:hover img {
      transform: scale(1.035);
      filter: saturate(1) contrast(1.03);
    }
    .gallery-label {
      display: flex;
      justify-content: space-between;
      gap: 14px;
      padding: 15px 0 25px;
      border-bottom: 1px solid var(--line,#343332);
    }
    .gallery-caption {
      font: 700 11px/1.5 'DM Sans',sans-serif;
      letter-spacing: .075em;
    }
    .gallery-film {
      font: 400 10px/1.5 'DM Sans',sans-serif;
      color: #aaa5a0;
      letter-spacing: .08em;
      text-align: right;
    }
    .gallery-empty {
      font-size: 13px;
      color: #a5a09b;
      border-top: 1px solid var(--line,#343332);
      padding: 26px 0;
    }

    .gallery-lightbox[hidden] {
      display: none !important;
    }
    .gallery-lightbox {
      position: fixed;
      inset: 0;
      z-index: 120;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(4,4,4,.97);
      padding: 64px 80px 75px;
    }
    .gallery-lightbox-inner {
      max-width: min(100%,1500px);
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }
    .gallery-lightbox img {
      display: block;
      max-height: calc(100% - 55px);
      max-width: 100%;
      object-fit: contain;
    }
    .gallery-lightbox p {
      margin: 0;
      text-align: center;
      color: #e8e3dd;
      font-size: 12px;
      letter-spacing: .08em;
    }
    .gallery-lightbox button {
      position: absolute;
      border: 1px solid #777;
      background: #171717;
      color: #f6f2ec;
      cursor: pointer;
      display: grid;
      place-items: center;
    }
    .gallery-close {
      right: 24px;
      top: 22px;
      width: 43px;
      height: 43px;
      font-size: 25px;
    }
    .gallery-prev,
    .gallery-next {
      top: 50%;
      transform: translateY(-50%);
      width: 45px;
      height: 55px;
      font-size: 29px;
    }
    .gallery-prev { left: 18px; }
    .gallery-next { right: 18px; }
    .gallery-count {
      position: absolute;
      top: 35px;
      left: 25px;
      color: #b8b0a6;
      font-size: 11px;
      letter-spacing: .1em;
    }

    @media (max-width: 900px) {
      .gallery-item,
      .gallery-item:nth-child(7n + 1),
      .gallery-item:nth-child(7n + 5) {
        grid-column: span 6;
      }
      .gallery-image-wrap,
      .gallery-item:nth-child(7n + 1) .gallery-image-wrap,
      .gallery-item:nth-child(7n + 5) .gallery-image-wrap {
        aspect-ratio: 4/3;
      }
    }
    @media (max-width: 620px) {
      .gallery-grid { gap: 12px; }
      .gallery-item,
      .gallery-item:nth-child(7n + 1),
      .gallery-item:nth-child(7n + 5) {
        grid-column: span 12;
      }
      .gallery-lightbox { padding: 65px 18px 80px; }
      .gallery-prev,
      .gallery-next {
        top: auto;
        bottom: 12px;
        transform: none;
      }
      .gallery-prev { left: 18px; }
      .gallery-next { right: 18px; }
    }
    @media (prefers-reduced-motion: reduce) {
      .gallery-image-wrap img { transition: none; }
    }
  `;
  document.head.appendChild(style);

  const section = document.createElement('section');
  section.id = 'gallery';
  section.className = 'gallery-section section-pad';
  section.setAttribute('aria-labelledby', 'gallery-title');

  section.innerHTML = `
    <div class="section-index">03 — GALLERY</div>
    <h2 class="gallery-heading" id="gallery-title">
      BEYOND THE<br><em>FRAME.</em>
    </h2>
    <p class="gallery-description">
      Frames, atmospheres and fragments from my visual universe.
    </p>
    <div class="gallery-grid" id="gallery-grid"></div>
  `;

  festivals.insertAdjacentElement('afterend', section);

  const grid = section.querySelector('#gallery-grid');

  const overlay = document.createElement('div');
  overlay.className = 'gallery-lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Image gallery');
  overlay.hidden = true;

  overlay.innerHTML = `
    <span class="gallery-count"></span>
    <button type="button" class="gallery-close"
      aria-label="Close image">×</button>
    <button type="button" class="gallery-prev"
      aria-label="Previous image">‹</button>
    <div class="gallery-lightbox-inner">
      <img alt="">
      <p></p>
    </div>
    <button type="button" class="gallery-next"
      aria-label="Next image">›</button>
  `;
  document.body.appendChild(overlay);

  const photo = overlay.querySelector('img');
  const description = overlay.querySelector('p');
  const counter = overlay.querySelector('.gallery-count');

  let items = [];
  let active = 0;
  let previousFocus = null;

  function validImage(value) {
    if (typeof value !== 'string' || !value.trim()) return null;
    const url = value.trim();

    if (/^(?:\/?images\/)[^?#]+$/i.test(url)) return url;

    if (/^https?:\/\//i.test(url)) {
      try {
        return new URL(url).href;
      } catch (_) {
        return null;
      }
    }
    return null;
  }

  function showPhoto(index) {
    if (!items.length) return;

    active = (index + items.length) % items.length;
    const item = items[active];

    photo.src = item.image;
    photo.alt = item.title || item.caption ||
      item.film || 'Gallery image';

    description.textContent = [
      item.title || item.caption,
      item.film
    ].filter(Boolean).join(' · ');

    counter.textContent = `${active + 1} / ${items.length}`;
  }

  function openPhoto(index) {
    previousFocus = document.activeElement;
    showPhoto(index);
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    overlay.querySelector('.gallery-close').focus();
  }

  function closePhoto() {
    if (overlay.hidden) return;
    overlay.hidden = true;
    document.body.style.removeProperty('overflow');
    photo.removeAttribute('src');

    if (previousFocus &&
        typeof previousFocus.focus === 'function') {
      previousFocus.focus();
    }
  }

  overlay.querySelector('.gallery-close')
    .addEventListener('click', closePhoto);

  overlay.querySelector('.gallery-prev')
    .addEventListener('click', () => showPhoto(active - 1));

  overlay.querySelector('.gallery-next')
    .addEventListener('click', () => showPhoto(active + 1));

  overlay.addEventListener('click', event => {
    if (event.target === overlay) closePhoto();
  });

  document.addEventListener('keydown', event => {
    if (overlay.hidden) return;

    if (event.key === 'Escape') closePhoto();
    if (event.key === 'ArrowLeft') showPhoto(active - 1);
    if (event.key === 'ArrowRight') showPhoto(active + 1);

    if (event.key === 'Tab') {
      const buttons = [
        ...overlay.querySelectorAll('button')
      ];
      const i = buttons.indexOf(document.activeElement);

      if (event.shiftKey && i <= 0) {
        event.preventDefault();
        buttons[buttons.length - 1].focus();
      } else if (
        !event.shiftKey &&
        i === buttons.length - 1
      ) {
        event.preventDefault();
        buttons[0].focus();
      }
    }
  });

  async function load() {
    try {
      const response = await fetch(
        'data/gallery.json',
        { cache: 'no-cache' }
      );

      if (!response.ok) {
        throw new Error('Gallery unavailable');
      }

      const data = await response.json();

      items = (Array.isArray(data) ? data : [])
        .filter(item => item && item.visible !== false)
        .map(item => ({
          ...item,
          image: validImage(item.image)
        }))
        .filter(item => item.image);

      const fragment = document.createDocumentFragment();

      items.forEach((item, i) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'gallery-item';

        button.setAttribute(
          'aria-label',
          'Open image: ' +
          (item.title || item.caption || item.film || i + 1)
        );

        const wrap = document.createElement('span');
        wrap.className = 'gallery-image-wrap';

        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.title || item.caption ||
          item.film || 'Cinematic still';
        img.loading = 'lazy';

        wrap.appendChild(img);

        const label = document.createElement('span');
        label.className = 'gallery-label';

        const title = document.createElement('span');
        title.className = 'gallery-caption';
        title.textContent = item.title || item.caption || '';

        const film = document.createElement('span');
        film.className = 'gallery-film';
        film.textContent = item.film || '';

        label.append(title, film);
        button.append(wrap, label);
        button.addEventListener('click', () => openPhoto(i));
        fragment.appendChild(button);
      });

      grid.replaceChildren(fragment);

      if (!items.length) {
        const p = document.createElement('p');
        p.className = 'gallery-empty';
        p.textContent = 'The gallery is being curated.';
        grid.replaceWith(p);
      }
    } catch (_) {
      const p = document.createElement('p');
      p.className = 'gallery-empty';
      p.textContent = 'The gallery is being curated.';
      grid.replaceWith(p);
    }
  }

  load();
})();
