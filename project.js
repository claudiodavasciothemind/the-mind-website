const films = {
  "reel": {
    "title": "THE DIRECTOR’S REEL",
    "category": "DIRECTOR’S REEL / 2026",
    "description": "A journey through different cinematic worlds, united by a single creative vision. A selection of images and stories directed by Claudio D’Avascio.",
    "year": "2026",
    "format": "Showreel",
    "url": "https://www.youtube.com/watch?v=iC3-OGKNtAc",
    "videoId": "iC3-OGKNtAc",
    "cta": "WATCH THE REEL"
  },
  "eva-01": {
    "title": "EVA 01",
    "category": "SCIENCE FICTION / SHORT FILM",
    "description": "A nearly wordless science-fiction story about artificial life, awakening and the possibility of consciousness. A contemporary reflection on creation, identity and the human gaze.",
    "year": "2026",
    "format": "6 min 13 sec",
    "url": "https://www.youtube.com/watch?v=UJkLkgeQr0c",
    "videoId": "UJkLkgeQr0c",
    "cta": "WATCH THE FILM"
  },
  "ordinary-psychos": {
    "title": "THE ORDINARY PSYCHOS",
    "category": "PSYCHOLOGICAL HORROR / ANTHOLOGY",
    "description": "Four unsettling portraits of ordinary moments, where the familiar becomes disturbing. An anthology that explores the everyday world of notorious killers without explicit violence.",
    "year": "2026",
    "format": "3 min 22 sec",
    "url": "https://www.youtube.com/watch?v=dPsmi55fd2c",
    "videoId": "dPsmi55fd2c",
    "cta": "WATCH THE FILM"
  },
  "white-fly": {
    "title": "THE WHITE FLY",
    "category": "SCIENCE FICTION / SHORT FILM",
    "description": "In an immaculate white room, a young person faces a choice framed by two buttons. A surreal, intimate film about identity, expectations and freedom.",
    "year": "2026",
    "format": "Short film",
    "url": "https://www.youtube.com/watch?v=kfrlzXpzdL4",
    "videoId": "kfrlzXpzdL4",
    "cta": "VIEW ON YOUTUBE"
  },
  "il-manutentore": {
    "title": "IL MANUTENTORE",
    "category": "THE HABIT / NOIR FEATURE",
    "description": "An Italian noir feature film from 2017. Recognized at the 71st Salerno International Film Festival, with screenings and festival appearances in Italy and abroad.",
    "year": "2017",
    "format": "Feature film",
    "url": "https://youtu.be/UzfWXocxFrQ",
    "videoId": "UzfWXocxFrQ",
    "cta": "WATCH THE ORIGINAL FILM"
  },
  "coliandro": {
    "title": "L’ISPETTORE COLIANDRO – IL RITORNO",
    "category": "TELEVISION / RAI",
    "description": "A television project directed in 2015, connected to the world of L’Ispettore Coliandro. Part of Claudio D’Avascio’s work across cinema and television.",
    "year": "2015",
    "format": "Television",
    "url": "https://www.youtube.com/watch?v=qXTFY7rba8M",
    "videoId": "qXTFY7rba8M",
    "cta": "WATCH VIDEO"
  }
};
const id=new URLSearchParams(location.search).get('film');
function render(f) {
 if(!f){location.replace('index.html#work');return;}
 document.title=f.title+' — THE MIND | Claudio D’Avascio';
 const show=(q,v)=>{let n=document.querySelector(q);if(n)n.textContent=v||'';};
 show('#film-title',f.title);show('#film-category',f.category);show('#film-description',f.description);show('#film-year',f.year);show('#film-format',f.format);
 show('#film-cta',f.cta||'WATCH THE VIDEO ↗');
 document.querySelector('#film-cta').href=f.video_url||f.url||'#';
 let hero=document.querySelector('#project-hero');
 if(f.image && /^(\/images\/|images\/|https?:\/\/)/.test(f.image))hero.style.setProperty('--project-image',`url("${f.image.replace(/"/g,'%22')}")`);
 else {const fallback = f.videoId || (()=>{try{let u=new URL(f.video_url||'');return u.hostname==='youtu.be'?u.pathname.slice(1):u.searchParams.get('v');}catch(e){return ''}})();if(fallback)hero.style.setProperty('--project-image',`url("https://i.ytimg.com/vi/${fallback}/maxresdefault.jpg")`);if(window.TheMindImages)window.TheMindImages.applyProject(id,hero);}
 document.querySelector('meta[name=description]').content=f.description||'';
}
render(films[id]);
fetch('data/films.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('CMS data unavailable');return r.json()}).then(list=>render(list.find(f=>f.slug===id && f.visible!==false))).catch(()=>{});
document.getElementById('year').textContent=new Date().getFullYear();
