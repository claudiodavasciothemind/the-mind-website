
/* THE MIND — Pages CMS content adapter */

(() => {
  const safeText = (el, val) => {
    if (el && typeof val === 'string') {
      el.textContent = val;
    }
  };

  const text = (sel, val) =>
    safeText(document.querySelector(sel), val);

  const isImage = value =>
    typeof value === 'string' &&
    /^(\/images\/|images\/|https?:\/\/)/i.test(value);

  const setImage = (el, value) => {
    if (el && isImage(value)) {
      const url = value.replace(/"/g, '%22');

      el.style.setProperty(
        '--project-image',
        `url("${url}")`
      );

      if (el.classList.contains('hero-image')) {
        el.style.backgroundImage = `url("${url}")`;
      }
    }
  };

  const videoId = url => {
    try {
      const u = new URL(url);

      if (u.hostname === 'youtu.be') {
        return u.pathname.slice(1);
      }

      if (u.hostname.includes('youtube.com')) {
        return u.searchParams.get('v') ||
          u.pathname.split('/').pop();
      }
    } catch (e) {}

    return '';
  };

  const setFallbackImg = (el, film) => {
    if (isImage(film.image)) {
      setImage(el, film.image);
      return;
    }

    const id = videoId(film.video_url);

    if (id) {
      setImage(
        el,
        `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
      );
    }
  };

  // TITOLO SELECTED WORK

  function updateIntroTitle(site) {
    const el = document.querySelector(
      '.intro-layout .big-heading'
    );

    if (!el) return;

    const line1 = site.intro_title_line_1;
    const line2 = site.intro_title_line_2;

    if (
      typeof line1 !== 'string' ||
      typeof line2 !== 'string'
    ) {
      return;
    }

    const br = document.createElement('br');
    const em = document.createElement('em');

    em.textContent = line2;

    el.replaceChildren(
      document.createTextNode(line1),
      br,
      em
    );
  }

  // MANIFESTO

  function updateManifesto(site) {
    const el = document.querySelector('.manifesto-text');
    if (!el) return;

    const line1 = site.manifesto_line_1;
    const line2 = site.manifesto_line_2;
    const italic = site.manifesto_emphasis !== false;

    if (
      typeof line1 === 'string' &&
      typeof line2 === 'string'
    ) {
      el.replaceChildren();

      function addLine(value) {
        const words = value.trim().split(/\s+/);
        const last = words.pop();

        if (words.length) {
          el.appendChild(
            document.createTextNode(
              words.join(' ') + ' '
            )
          );
        }

        if (last) {
          if (italic) {
            const em = document.createElement('em');
            em.textContent = last;
            el.appendChild(em);
          } else {
            el.appendChild(
              document.createTextNode(last)
            );
          }
        }
      }

      addLine(line1);
      el.appendChild(document.createElement('br'));
      addLine(line2);
    }

    const fonts = {
      Manrope: '"Manrope", sans-serif',
      'DM Sans': '"DM Sans", sans-serif',
      Georgia: 'Georgia, serif'
    };

    if (fonts[site.manifesto_font]) {
      el.style.fontFamily = fonts[site.manifesto_font];
    }

    const size = Number(site.manifesto_size);

    if (
      site.manifesto_size !== '' &&
      site.manifesto_size != null &&
      Number.isFinite(size)
    ) {
      const safeSize = Math.min(
        120,
        Math.max(30, size)
      );

      el.style.fontSize =
        `clamp(28px, 7vw, ${safeSize}px)`;
    }

    const spacing = Number(site.manifesto_spacing);

    if (
      site.manifesto_spacing !== '' &&
      site.manifesto_spacing != null &&
      Number.isFinite(spacing)
    ) {
      const safeSpacing = Math.min(
        0.15,
        Math.max(-0.15, spacing)
      );

      el.style.letterSpacing =
        `${safeSpacing}em`;
    }
  }

  // CONTACT — TESTI E DIMENSIONI

  function updateContact(site) {
    const kicker =
      document.querySelector('.contact-kicker');

    const heading =
      document.querySelector('.contact-heading');

    if (
      kicker &&
      typeof site.contact_kicker === 'string'
    ) {
      kicker.textContent = site.contact_kicker;
    }

    if (kicker) {
      const size = Number(site.contact_kicker_size);

      if (
        site.contact_kicker_size != null &&
        site.contact_kicker_size !== '' &&
        Number.isFinite(size) &&
        size > 0
      ) {
        kicker.style.fontSize =
          `${Math.min(100, Math.max(8, size))}px`;
      } else {
        kicker.style.removeProperty('font-size');
      }
    }

    if (!heading) return;

    const line1 =
      typeof site.contact_line_1 === 'string'
        ? site.contact_line_1
        : 'IF YOU CAN IMAGINE IT.';

    const line2 =
      typeof site.contact_line_2 === 'string'
        ? site.contact_line_2
        : 'WE CAN CREATE IT.';

    function buildLine(value, className) {
      const line = document.createElement('span');
      line.className = className;

      const words = value.trim()
        .split(/\s+/)
        .filter(Boolean);

      const normal = words.slice(0, -2).join(' ');
      const emphasized = words.slice(-2).join(' ');

      if (normal) {
        line.appendChild(
          document.createTextNode(normal + ' ')
        );
      }

      if (emphasized) {
        const em = document.createElement('em');
        em.textContent = emphasized;
        line.appendChild(em);
      }

      return line;
    }

    const first = buildLine(
      line1,
      'cms-contact-first'
    );

    const second = buildLine(
      line2,
      'cms-contact-second'
    );

    const arrow = document.createElement('span');
    arrow.className = 'cms-contact-arrow';
    arrow.textContent = '↗';

    heading.replaceChildren(
      first,
      second,
      arrow
    );

    const styleId = 'cms-contact-styles';
    let style = document.getElementById(styleId);

    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }

    style.textContent = `
      .contact-heading > .cms-contact-first,
      .contact-heading > .cms-contact-second {
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
        font-style: normal;
        line-height: inherit;
        letter-spacing: inherit;
        color: inherit;
        margin-left: 0;
        padding: 0;
        transform: none;
        position: static;
        width: auto;
        height: auto;
      }

      .contact-heading > .cms-contact-first {
        display: block;
      }

      .contact-heading > .cms-contact-second {
        display: inline;
      }

      .contact-heading > .cms-contact-first em,
      .contact-heading > .cms-contact-second em {
        font-weight: 300;
        font-style: normal;
        color: #8d8b86;
      }

      .contact-heading:hover .cms-contact-first em,
      .contact-heading:hover .cms-contact-second em {
        color: var(--accent);
      }

      .contact-heading > .cms-contact-arrow {
        font: 300 .56em Manrope, sans-serif;
        color: var(--accent);
        margin-left: 22px;
      }

      @media (max-width: 620px) {
        .contact-heading > .cms-contact-arrow {
          margin-left: 6px;
        }
      }
    `;

    function applyLineSize(el, rawValue) {
      const size = Number(rawValue);

      if (
        rawValue != null &&
        rawValue !== '' &&
        Number.isFinite(size) &&
        size > 0
      ) {
        const safeSize = Math.min(
          200,
          Math.max(16, size)
        );

        el.style.setProperty(
          'font-size',
          `clamp(36px, 10vw, ${safeSize}px)`,
          'important'
        );
      } else {
        el.style.removeProperty('font-size');
      }
    }

    applyLineSize(
      first,
      site.contact_line_1_size
    );

    applyLineSize(
      second,
      site.contact_line_2_size
    );
  }

  // SCHEDE DEI FILM

  function filmCard(film, index, template) {
    const card = template.cloneNode(true);

    card.dataset.frame = film.slug;
    card.href =
      `project.html?film=${encodeURIComponent(film.slug)}`;

    const header = card.querySelector('.project-top');

    if (header) {
      safeText(
        header.children[0],
        `${String(index + 1).padStart(2, '0')} / ${film.homepage_label || film.category || 'FILM'}`
      );

      safeText(
        header.children[1],
        film.year || ''
      );
    }

    safeText(
      card.querySelector('.project-kicker'),
      film.homepage_kicker || ''
    );

    const h = card.querySelector('h3');

    if (h) {
      h.textContent = film.title || '';

      const dot = document.createElement('span');
      dot.className = 'project-dot';
      dot.textContent = '.';

      h.appendChild(dot);
    }

    safeText(
      card.querySelector('.project-info p'),
      film.homepage_subtitle ||
      film.format || ''
    );

    setFallbackImg(card, film);

    return card;
  }

  // CARICAMENTO DATI DAL CMS

  async function go() {
    const [siteRes, filmsRes] = await Promise.all([
      fetch('data/site.json', { cache: 'no-cache' }),
      fetch('data/films.json', { cache: 'no-cache' })
    ]);

    if (siteRes.ok) {
      const s = await siteRes.json();

      text(
        '.eyebrow-year',
        s.professional_label
      );

      text('.hero-kicker', s.hero_kicker);

      text(
        '.hero-bottom p span',
        s.hero_subtitle
      );

      text('.intro-copy', s.intro_text);

      // Nuovo titolo SELECTED WORK
      updateIntroTitle(s);

      // Manifesto
      updateManifesto(s);

      // Contatti
      updateContact(s);

      const ps = document.querySelectorAll(
        '.about-body > p'
      );

      [
        s.about_paragraph_1,
        s.about_paragraph_2,
        s.about_paragraph_3
      ].forEach((p, i) => safeText(ps[i], p));

      if (s.contact_email) {
        document.querySelectorAll(
          'a[href^="mailto:"]'
        ).forEach(a => {
          a.href = `mailto:${s.contact_email}`;
        });

        text(
          '.contact-bottom a',
          s.contact_email.toUpperCase()
        );
      }

      if (s.youtube_url) {
        const yt = document.querySelector(
          '.contact-bottom a[target="_blank"]'
        );

        if (yt) {
          yt.href = s.youtube_url;
        }
      }

      if (isImage(s.hero_image)) {
        setImage(
          document.querySelector('.hero-image'),
          s.hero_image
        );
      }
    }

    if (filmsRes.ok) {
      const films = (await filmsRes.json())
        .filter(f =>
          f && f.visible !== false
        );

      const feature = document.querySelector(
        '.projects > .feature'
      );

      const grid = document.querySelector(
        '.project-grid'
      );

      const television = document.querySelector(
        '.projects > .television'
      );

      if (!grid || !feature) return;

      const tile = grid.querySelector('.tile');
      if (!tile) return;

      const reel = films.find(
        f => f.slug === 'reel'
      );

      if (reel) {
        feature.href =
          `project.html?film=${encodeURIComponent(reel.slug)}`;

        safeText(
          feature.querySelector('.project-kicker'),
          reel.homepage_kicker
        );

        safeText(
          feature.querySelector('.project-info p'),
          reel.homepage_subtitle
        );

        setFallbackImg(feature, reel);
      } else {
        feature.style.display = 'none';
      }

      grid.replaceChildren();

      let i = 1;

      films
        .filter(f =>
          f.slug !== 'reel' &&
          f.slug !== 'coliandro'
        )
        .forEach(f =>
          grid.appendChild(
            filmCard(f, i++, tile)
          )
        );

      const tv = films.find(
        f => f.slug === 'coliandro'
      );

      if (television) {
        if (tv) {
          television.href =
            `project.html?film=${encodeURIComponent(tv.slug)}`;

          safeText(
            television.querySelector('.project-kicker'),
            tv.homepage_kicker
          );

          safeText(
            television.querySelector('.project-info p'),
            tv.homepage_subtitle
          );

          setFallbackImg(television, tv);
        } else {
          television.style.display = 'none';
        }
      }
    }
  }

  go().catch(err =>
    console.warn(
      'THE MIND: static content fallback',
      err
    )
  );
})();
