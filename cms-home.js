
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
      el.style.setProperty('--project-image', `url("${url}")`);

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

  // Manifesto: l'ultima parola di ogni riga resta in corsivo.
  function updateManifesto(site) {
    const el = document.querySelector('.manifesto-text');

    if (!el) return;

    const line1 = site.manifesto_line_1;
    const line2 = site.manifesto_line_2;

    if (typeof line1 !== 'string' ||
        typeof line2 !== 'string') return;

    el.replaceChildren();

    function addLine(value) {
      const words = value.trim().split(/\s+/);
      const last = words.pop();

      if (words.length) {
        el.appendChild(
          document.createTextNode(words.join(' ') + ' ')
        );
      }

      if (last) {
        const em = document.createElement('em');
        em.textContent = last;
        el.appendChild(em);
      }
    }

    addLine(line1);
    el.appendChild(document.createElement('br'));
    addLine(line2);
  }

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

      safeText(header.children[1], film.year || '');
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
      film.homepage_subtitle || film.format || ''
    );

    setFallbackImg(card, film);

    return card;
  }

  async function go() {
    const [siteRes, filmsRes] = await Promise.all([
      fetch('data/site.json', { cache: 'no-cache' }),
      fetch('data/films.json', { cache: 'no-cache' })
    ]);

    if (siteRes.ok) {
      const s = await siteRes.json();

      text('.eyebrow-year', s.professional_label);
      text('.hero-kicker', s.hero_kicker);
      text('.hero-bottom p span', s.hero_subtitle);
      text('.intro-copy', s.intro_text);

      // Testo del manifesto gestito da Pages CMS
      updateManifesto(s);

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

        if (yt) yt.href = s.youtube_url;
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
        .filter(f => f && f.visible !== false);

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

      const reel = films.find(f => f.slug === 'reel');

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
          grid.appendChild(filmCard(f, i++, tile))
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
