
/* THE MIND — Automatic section numbering */

(() => {
  const navigation = document.querySelector(
    '.site-header .navigation'
  );

  if (!navigation) return;

  function updateSectionNumbers() {
    const links = [
      ...navigation.querySelectorAll('a[href]')
    ];

    const sectionNumbers = new Map();

    links.forEach((link, index) => {
      const href = link.getAttribute('href') || '';

      if (/^#[A-Za-z][\w-]*$/.test(href)) {
        sectionNumbers.set(
          href.slice(1),
          String(index + 1).padStart(2, '0')
        );
      }
    });

    document.querySelectorAll(
      'main section[id]'
    ).forEach(section => {
      const heading = section.querySelector(
        '.section-index'
      );

      if (!heading) return;

      if (!heading.dataset.originalLabel) {
        heading.dataset.originalLabel =
          heading.textContent
            .trim()
            .replace(/^\d+\s*[—–-]\s*/, '');
      }

      const label = heading.dataset.originalLabel;
      const number = sectionNumbers.get(section.id);

      heading.textContent = number
        ? `${number} — ${label}`
        : label;
    });
  }

  // Aggiorna i numeri quando Pages CMS
  // modifica le voci del menu.
  const observer = new MutationObserver(
    updateSectionNumbers
  );

  observer.observe(navigation, {
    childList: true,
    subtree: true
  });

  updateSectionNumbers();
})();
