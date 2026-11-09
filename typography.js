/* THE MIND — Typography controls from Pages CMS
   Values 0/empty/Originale leave the original site styling unchanged.
   No text, links, images, or layout markup is altered. */
(() => {
  'use strict';
  const groups = [["brand", ".brand, .footer-brand", "fixed"], ["navigation", ".navigation a", "fixed"], ["header_note", ".header-note", "fixed"], ["hero_eyebrow", ".hero-eyebrow", "fixed"], ["hero_title", ".hero h1", "hero"], ["hero_kicker", ".hero-kicker", "fixed"], ["hero_subtitle", ".hero-bottom p", "fixed"], ["hero_caption", ".hero-bottom p span", "fixed"], ["section_index", ".section-index", "fixed"], ["intro_title", ".intro .big-heading", "intro"], ["intro_body", ".intro-copy", "fixed"], ["project_labels", ".project-top, .project-kicker", "fixed"], ["reel_title", ".feature .project-info h3", "reel"], ["film_titles", ".tile .project-info h3, .television .project-info h3", "film"], ["project_captions", ".project-info p", "fixed"], ["awards_titles", ".recognition-list strong", "fixed"], ["awards_details", ".recognition-list div > span", "fixed"], ["manifesto", ".manifesto-text", "manifesto"], ["about_title", ".about-grid .big-heading", "about"], ["about_lead", ".about-body p:first-child", "fixed"], ["about_body", ".about-body p:not(:first-child)", "fixed"], ["contact_title", ".contact-heading", "contact"], ["contact_details", ".contact-bottom", "fixed"], ["film_page_title", "#film-title", "film_page"], ["film_page_body", "#film-description", "fixed"], ["footer", "footer > span, footer > a:last-child", "fixed"]];
  const fonts = {
    'Manrope': 'Manrope, sans-serif',
    'DM Sans': '"DM Sans", sans-serif',
    'Georgia': 'Georgia, serif'
  };
  function usableNumber(x, min, max) {
    if (x === '' || x === null || x === undefined) return null;
    const n = Number(x);
    return Number.isFinite(n) && n >= min && n <= max ? n : null;
  }
  function sizeRule(mode, value) {
    // Use the existing visual scale, but limit it to the user's chosen maximum.
    const px = `${value}px`;
    const mobile = `${Math.min(value, Math.max(22, Math.round(value * .42)))}px`;
    switch (mode) {
      case 'hero': return [`clamp(48px, 11.5vw, ${px})`, `clamp(42px, 12.4vw, ${px})`];
      case 'intro': return [`clamp(34px, 7.2vw, ${px})`, `clamp(30px, 11vw, ${px})`];
      case 'reel': return [`clamp(34px, 7vw, ${px})`, `clamp(30px, 10vw, ${px})`];
      case 'film': return [`clamp(26px, 3.7vw, ${px})`, `clamp(28px, 9vw, ${px})`];
      case 'manifesto': return [`clamp(28px, 5.7vw, ${px})`, `clamp(26px, 8vw, ${px})`];
      case 'about': return [`clamp(36px, 8vw, ${px})`, `clamp(32px, 11vw, ${px})`];
      case 'contact': return [`clamp(38px, 10vw, ${px})`, `clamp(34px, 10vw, ${px})`];
      case 'film_page': return [`clamp(38px, 7vw, ${px})`, `clamp(30px, 10vw, ${px})`];
      default: return [px, mobile];
    }
  }
  async function load() {
    const response = await fetch('/data/typography.json', {cache:'no-cache'});
    if (!response.ok) return;
    const data = await response.json();
    const desktop = [], mobile = [];
    for (const [key, selector, mode] of groups) {
      const props=[];
      if (fonts[data[key+'_font']]) props.push('font-family:'+fonts[data[key+'_font']]+' !important');
      const size=usableNumber(data[key+'_size'],1,260);
      if (size !== null) {
        const [wide,small]=sizeRule(mode,size);
        props.push('font-size:'+wide+' !important');
        mobile.push(selector+'{font-size:'+small+' !important}');
      }
      const spacing=usableNumber(data[key+'_spacing'],-.3,.3);
      if (spacing !== null) props.push('letter-spacing:'+spacing+'em !important');
      if (props.length) desktop.push(selector+'{'+props.join(';')+'}');
    }
    if (!desktop.length) return;
    const style=document.createElement('style');
    style.id='the-mind-typography-overrides';
    style.textContent=desktop.join('\n')+'\n@media(max-width:620px){'+mobile.join('\n')+'}';
    document.head.appendChild(style);
  }
  load().catch(error => console.warn('Typography CMS fallback:',error));
})();
