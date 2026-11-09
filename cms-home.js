/* THE MIND content adapter — text and film data edited through Pages CMS.
   Default static markup is retained if JSON cannot be loaded. */
(() => {
const safeText = (el, val) => { if (el && typeof val === 'string') el.textContent = val; };
const text = (sel,val) => safeText(document.querySelector(sel),val);
const isImage = value => typeof value === 'string' && /^(\/images\/|images\/|https?:\/\/)/i.test(value);
const setImage = (el, value) => {if(el && isImage(value)) {el.style.setProperty('--project-image', `url("${value.replace(/"/g,'%22')}")`); if(el.classList.contains('hero-image')) el.style.backgroundImage=`url("${value.replace(/"/g,'%22')}")`;}};
const videoId = url => {try {let u=new URL(url);if(u.hostname==='youtu.be')return u.pathname.slice(1);if(u.hostname.includes('youtube.com'))return u.searchParams.get('v')||u.pathname.split('/').pop();}catch(e){} return '';};
const setFallbackImg = (el,film) => {if(isImage(film.image)) {setImage(el,film.image);return;} const id=videoId(film.video_url);if(id)setImage(el,`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`);};
function filmCard(film,index,template) {
 const card=template.cloneNode(true);
 card.dataset.frame=film.slug;
 card.href=`project.html?film=${encodeURIComponent(film.slug)}`;
 const header=card.querySelector('.project-top');
 if(header){safeText(header.children[0],`${String(index+1).padStart(2,'0')} / ${film.homepage_label||film.category||'FILM'}`);safeText(header.children[1],film.year||'');}
 safeText(card.querySelector('.project-kicker'),film.homepage_kicker||'');
 const h=card.querySelector('h3');if(h){h.textContent=film.title||'';let dot=document.createElement('span');dot.className='project-dot';dot.textContent='.';h.appendChild(dot);}
 safeText(card.querySelector('.project-info p'), film.homepage_subtitle||film.format||'');
 setFallbackImg(card,film);
 return card;
}
async function go() {
 const [siteRes,filmsRes]=await Promise.all([fetch('data/site.json',{cache:'no-cache'}),fetch('data/films.json',{cache:'no-cache'})]);
 if(siteRes.ok){let s=await siteRes.json();text('.hero-kicker',s.hero_kicker);text('.hero-bottom p span',s.hero_subtitle);text('.intro-copy',s.intro_text);
 const ps=document.querySelectorAll('.about-body > p');[s.about_paragraph_1,s.about_paragraph_2,s.about_paragraph_3].forEach((p,i)=>safeText(ps[i],p));
 if(s.contact_email){document.querySelectorAll('a[href^="mailto:"]').forEach(a=>a.href=`mailto:${s.contact_email}`);text('.contact-bottom a',s.contact_email.toUpperCase());}
 if(s.youtube_url){let yt=document.querySelector('.contact-bottom a[target="_blank"]');if(yt)yt.href=s.youtube_url;}
 if(isImage(s.hero_image))setImage(document.querySelector('.hero-image'),s.hero_image);
 }
 if(filmsRes.ok){const films=(await filmsRes.json()).filter(f=>f && f.visible!==false);let feature=document.querySelector('.projects > .feature');let grid=document.querySelector('.project-grid');let television=document.querySelector('.projects > .television');if(!grid||!feature)return;
 const tile=grid.querySelector('.tile');if(!tile)return;
 const visible=films;
 // Preserve original distinctive reel and television layout; update them with CMS data.
 const reel=visible.find(f=>f.slug==='reel');if(reel){feature.href=`project.html?film=${encodeURIComponent(reel.slug)}`;safeText(feature.querySelector('.project-kicker'),reel.homepage_kicker);safeText(feature.querySelector('.project-info p'),reel.homepage_subtitle);setFallbackImg(feature,reel);}else feature.style.display='none';
 grid.replaceChildren();let i=1;visible.filter(f=>f.slug!=='reel'&&f.slug!=='coliandro').forEach(f=>grid.appendChild(filmCard(f,i++,tile)));
 const tv=visible.find(f=>f.slug==='coliandro');if(television){if(tv){television.href=`project.html?film=${encodeURIComponent(tv.slug)}`;safeText(television.querySelector('.project-kicker'),tv.homepage_kicker);safeText(television.querySelector('.project-info p'),tv.homepage_subtitle);setFallbackImg(television,tv);}else television.style.display='none';}
 }
}
go().catch(err=>console.warn('THE MIND: static content fallback',err));
})();
