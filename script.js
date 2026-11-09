const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');
menu.addEventListener('click', () => {
  const opened = navigation.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(opened));
  menu.setAttribute('aria-label', opened ? 'Close navigation' : 'Open navigation');
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}));
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});
}, {threshold: .12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.getElementById('year').textContent = new Date().getFullYear();
