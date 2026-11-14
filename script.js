
/* THE MIND — Main site interactions */

const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');

// Menu mobile
if (menu && navigation) {
  menu.addEventListener('click', () => {
    const opened = navigation.classList.toggle('open');

    menu.setAttribute('aria-expanded', String(opened));
    menu.setAttribute(
      'aria-label',
      opened ? 'Close navigation' : 'Open navigation'
    );
  });

  // Funziona anche con le nuove voci create dal CMS
  navigation.addEventListener('click', (event) => {
    if (!event.target.closest('a')) return;

    navigation.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
  });
}

// Animazioni delle sezioni
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach(
    el => observer.observe(el)
  );
} else {
  document.querySelectorAll('.reveal').forEach(
    el => el.classList.add('visible')
  );
}

// Anno automatico nel footer
const year = document.getElementById('year');

if (year) {
  year.textContent = new Date().getFullYear();
}
