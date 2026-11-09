/** THE MIND / film still manager
 * Place your own 1920x1080 (or higher) JPG/WebP images inside images/ with these filenames.
 * If the file is missing, the current YouTube thumbnail remains visible.
 * No third-party libraries or server required.
 */
(() => {
  const files = {
    'eva-hero': 'eva-hero.webp',
    'reel': 'reel.webp',
    'eva-01': 'eva-01.webp',
    'ordinary-psychos': 'ordinary-psychos.webp',
    'white-fly': 'white-fly.webp',
    'il-manutentore': 'il-manutentore.webp',
    'coliandro': 'coliandro.webp'
  };
  function setIfExists(key, element, cssVariable) {
    const filename = files[key];
    if (!filename || !element) return;
    const path = `images/${filename}`;
    const probe = new Image();
    probe.onload = () => {
      // Only replace a working fallback with a successfully loaded original still.
      element.style.setProperty(cssVariable, `url("${path}")`);
      if (key === 'eva-hero') element.style.backgroundImage = `url("${path}")`;
    };
    probe.src = path;
  }
  function applyHomepage() {
    document.querySelectorAll('[data-frame]').forEach(el => {
      const key = el.dataset.frame;
      setIfExists(key, el, '--project-image');
    });
  }
  window.TheMindImages = { applyProject: (key, el) => setIfExists(key, el, '--project-image') };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyHomepage);
  else applyHomepage();
})();
