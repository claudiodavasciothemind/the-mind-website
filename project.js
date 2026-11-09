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
const f=films[id]; if(!f){location.replace('index.html#work')} else {
 document.title=f.title+' — THE MIND | Claudio D’Avascio';
 document.querySelector('#film-title').textContent=f.title;
 document.querySelector('#film-category').textContent=f.category;
 document.querySelector('#film-description').textContent=f.description;
 document.querySelector('#film-year').textContent=f.year;
 document.querySelector('#film-format').textContent=f.format;
 document.querySelector('#film-cta').textContent=f.cta+' ↗';
 document.querySelector('#film-cta').href=f.url;
 document.querySelector('#project-hero').style.setProperty('--project-image',`url("https://i.ytimg.com/vi/${f.videoId}/maxresdefault.jpg")`);
 document.querySelector('meta[name=description]').content=f.description;
 // When an original film still exists locally, prefer it to the YouTube thumbnail.
 if (window.TheMindImages) window.TheMindImages.applyProject(id, document.querySelector('#project-hero'));
}
document.getElementById('year').textContent=new Date().getFullYear();
