/* Niks Designer portfolio. Projects live in js/projects-data.js */
(function () {
  const SHOW_PLACEHOLDERS = true;  // set to false once every project has its details filled in
  const SLIDE_MS = 3000;           // time between social media slides
  const CATS = [
    { id: 'social-media', name: 'Social Media Posts', noun: 'social media post', layout: 'masonry', desc: 'Festival, event, business and awareness posts.' },
    { id: 'banners', name: 'Banner Designs', noun: 'banner', layout: 'banner', desc: 'Every banner shown as original artwork, uncropped and unstretched. Open one for the full-size view.' },
    { id: 'visiting-cards', name: 'Visiting Card Designs', noun: 'visiting card', layout: 'vcard', desc: 'Each card gets its own presentation style. The artwork is shown unchanged.' },
    { id: 'posters', name: 'Poster Designs', noun: 'poster', layout: 'masonry', desc: 'Event, product and promotional posters.' },
    { id: 'logos', name: 'Logo Designs', noun: 'logo and brand', layout: 'logo', desc: 'Logos and brand identity presentations.' },
    { id: 'packaging', name: 'Packaging Designs', noun: 'packaging', layout: 'grid', desc: 'Pouch and product packaging.' },
    { id: 'invitations', name: 'Invitation Card Designs', noun: 'invitation card', layout: 'masonry', desc: 'Invitation cards.' },
    { id: 'brochures', name: 'Brochure Designs', noun: 'brochure page', layout: 'grid', desc: 'Multi-page brochures.' },
    { id: 'other', name: 'Other Graphic Designs', noun: 'graphic', layout: 'masonry', desc: 'Passes, welcome boards, backdrops and other work.' }
  ];
  const THEMES = [['luxury', 'Dark Luxury', '#070707', '#f5f2ea', '#d6b36a'], ['glass', 'Glassmorphism', 'linear-gradient(135deg,#7b4dff,#00b4d8)', '#fff', '#ffe27a'], ['light', 'Minimal Light', '#f6f6f3', '#161616', '#161616'],
    ['gradient', 'Creative Gradient', 'linear-gradient(135deg,#1d2671,#c33764)', '#fff', '#ffd166'], ['midnight', 'Midnight Blue', '#0a1128', '#e8efff', '#5aa9ff'], ['neutral', 'Modern Neutral', '#d9d4cb', '#26231f', '#7a4a35']];
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const src = (id, k) => (window.IMG_INLINE && window.IMG_INLINE[id]) || `assets/img/${k}/${id}.webp`;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const img = (i, k, x = '') => `<img src="${src(i.id, k)}" width="${i.w}" height="${i.h}" alt="${esc(i.alt)}" ${x}>`;
  const projects = window.PROJECTS || [];
  const FLAT = ['banners', 'visiting-cards'];

  // entries: one per project, except banners and visiting cards where every design is its own entry
  const entriesOf = cid => FLAT.includes(cid)
    ? projects.filter(p => p.category === cid).flatMap(p => p.images.map((i, k) => ({ ...p, id: i.id, title: p.images.length > 1 ? `${p.title} (${k + 1})` : p.title, images: [i], size: i.size, projectId: p.id })))
    : projects.filter(p => p.category === cid);
  const lists = {}, all = {};
  CATS.forEach(c => { lists[c.id] = entriesOf(c.id); lists[c.id].forEach(e => { all[e.id] = e; }); });
  const activeCats = CATS.filter(c => lists[c.id].length);

  // themes: hover previews, click keeps
  let theme = 'luxury'; try { theme = localStorage.getItem('niks-theme2') || theme; } catch (e) { /* storage unavailable */ }
  const apply = t => { document.documentElement.dataset.theme = t; };
  apply(theme);
  $('#tGrid').innerHTML = THEMES.map(t => `<button class="tsw" data-t="${t[0]}" aria-pressed="${t[0] === theme}"><span class="pv" style="--b:${t[2]};--t:${t[3]};--a:${t[4]}"></span>${t[1]}</button>`).join('');
  const tGrid = $('#tGrid');
  tGrid.addEventListener('pointerover', e => { const b = e.target.closest('.tsw'); if (b && e.pointerType === 'mouse') apply(b.dataset.t); });
  tGrid.addEventListener('pointerleave', () => apply(theme));
  tGrid.addEventListener('click', e => { const b = e.target.closest('.tsw'); if (!b) return; theme = b.dataset.t; apply(theme); $$('.tsw').forEach(x => x.setAttribute('aria-pressed', x === b)); try { localStorage.setItem('niks-theme2', theme); } catch (er) { /* ignore */ } });
  const tp = $('#tPanel'), tb = $('#tBtn');
  tb.onclick = e => { e.stopPropagation(); const o = tp.classList.toggle('open'); tb.setAttribute('aria-expanded', o); };
  document.addEventListener('click', e => { if (!e.target.closest('#tPanel')) { tp.classList.remove('open'); tb.setAttribute('aria-expanded', 'false'); } });

  // social media slider
  const sItems = []; (lists['social-media'] || []).forEach(p => p.images.slice(0, 2).forEach(i => sItems.push({ p, i })));
  const sl = $('#slider'), track = $('#strack'), SN = sItems.length;
  let sIdx = 0, st = 'slide', playing = true, hover = false, vis = true;
  function sBuild() {
    const list = st === 'slide' ? [...sItems, ...sItems] : sItems;
    track.innerHTML = list.map(x => `<button class="sitem" data-open="${x.p.id}" aria-label="Open ${esc(x.p.title)}">${img(x.i, 'thumb')}<span class="scap">${esc(x.p.title)}</span></button>`).join('');
    sl.dataset.style = st; sPlace(false);
  }
  function sPlace(anim = true) {
    const items = $$('.sitem', track); if (!items.length) return;
    $$('#pag button').forEach((b, k) => b.setAttribute('aria-current', k === sIdx % SN));
    if (st === 'slide') { track.style.transition = anim ? '' : 'none'; track.style.transform = `translateX(${-items[sIdx].offsetLeft}px)`; return; }
    items.forEach((el, k) => {
      let d = (((k - sIdx) % SN) + SN) % SN; if (d > SN / 2) d -= SN; const w = el.offsetWidth;
      if (st === 'fade') { el.classList.toggle('on', d === 0); el.style.pointerEvents = d === 0 ? '' : 'none'; el.style.zIndex = d === 0 ? 2 : 1; return; }
      const a = Math.abs(d); el.style.transform = `translateX(${-w / 2 + d * w * .72}px) scale(${1 - a * .13})`; el.style.opacity = a > 2 ? 0 : 1 - a * .28; el.style.zIndex = 10 - a; el.style.pointerEvents = a > 2 ? 'none' : '';
    });
  }
  function sGo(n) {
    if (st !== 'slide') { sIdx = (n + SN) % SN; sPlace(); return; }
    if (n < 0) { sIdx = SN; sPlace(false); track.offsetWidth; n = SN - 1; }
    sIdx = n; sPlace(true);
    if (sIdx >= SN) setTimeout(() => { sIdx -= SN; sPlace(false); }, 900);
  }
  if (SN) {
    $('#pag').innerHTML = sItems.map((x, k) => `<button aria-label="Go to post ${k + 1}"></button>`).join('');
    sBuild();
    $('#sNext').onclick = () => sGo(sIdx + 1); $('#sPrev').onclick = () => sGo(sIdx - 1);
    $('#pag').onclick = e => { const k = $$('#pag button').indexOf(e.target.closest('button')); if (k > -1) sGo(k); };
    $$('.seg button').forEach(b => b.onclick = () => { st = b.dataset.st; sIdx %= SN; $$('.seg button').forEach(x => x.setAttribute('aria-pressed', x === b)); sBuild(); });
    $('#sPlay').onclick = e => { playing = !playing; e.target.innerHTML = playing ? '&#10074;&#10074;' : '&#9654;'; e.target.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow'); };
    sl.addEventListener('pointerenter', () => { hover = true; }); sl.addEventListener('pointerleave', () => { hover = false; });
    new IntersectionObserver(e => { vis = e[0].isIntersecting; }).observe(sl);
    setInterval(() => { if (playing && !hover && vis && !document.hidden) sGo(sIdx + 1); }, reduce ? SLIDE_MS * 2 : SLIDE_MS);
    track.addEventListener('load', () => sPlace(false), true); addEventListener('resize', () => sPlace(false));
    let x0 = null; $('#sview').addEventListener('pointerdown', e => { x0 = e.clientX; });
    $('#sview').addEventListener('pointerup', e => { if (x0 !== null && Math.abs(e.clientX - x0) > 50) sGo(sIdx + (e.clientX < x0 ? 1 : -1)); x0 = null; });
  } else sl.hidden = true;

  // category directory + one separate section per category
  $('#catMenu').innerHTML = activeCats.map(c => `<a href="#${c.id}">${esc(c.name)}<small>${lists[c.id].length}</small></a>`).join('');
  $('#catMenu').addEventListener('click', e => { if (e.target.closest('a')) $('details', $('#nav')).removeAttribute('open'); });
  $('#dir').innerHTML = activeCats.map(c => `<a class="tile glass" href="#${c.id}"><div class="tp">${img(lists[c.id][0].images[0], 'thumb', 'loading="lazy"')}</div><b>${esc(c.name)}</b><span>${lists[c.id].length} ${lists[c.id].length === 1 ? 'entry' : 'entries'}</span></a>`).join('');
  const card = {
    masonry: e => `<button class="pcard glass" data-open="${e.id}" aria-label="Open ${esc(e.title)}"><div class="im">${img(e.images[0], 'thumb', 'loading="lazy"')}${e.images.length > 1 ? `<span class="badge">${e.images.length} designs</span>` : ''}</div><span class="t">${esc(e.title)}</span><span class="c">${esc(e.brand || '')}</span></button>`,
    logo: e => `<button class="lcard glass" data-open="${e.id}" aria-label="Open ${esc(e.title)}"><div class="im">${img(e.images[0], 'thumb', 'loading="lazy"')}</div><span class="t">${esc(e.title)}</span><span class="c">${e.images.length} designs</span></button>`,
    banner: e => `<button class="lcard glass" data-open="${e.id}" aria-label="Open banner ${esc(e.title)}"><div class="im">${img(e.images[0], 'thumb', 'loading="lazy"')}</div><span class="t">${esc(e.title)}</span><span class="c">${esc(e.size ? 'Size in file name: ' + e.size : '')}</span></button>`,
    vcard: (e, n) => { const i = e.images[0], s = n % 10 + 1, c = [3, 8].includes(s) ? 3 : 1; return `<button class="vc glass" data-open="${e.id}" aria-label="Open ${esc(e.title)}"><div class="vs v${s}"><div class="cs">${Array.from({ length: c }, () => img(i, 'thumb', 'loading="lazy"')).join('')}</div></div><div class="bcap"><strong>${esc(e.title)}</strong><span>Card ${n + 1}</span></div></button>`; }
  };
  card.grid = card.logo;
  const wrapper = { masonry: 'masonry', logo: 'grid2', grid: 'grid3', banner: 'grid2 ban', vcard: 'grid2' };
  $('#cats').innerHTML = activeCats.map(c => `<section id="${c.id}" class="cat" aria-labelledby="h-${c.id}"><div class="wrap"><div class="sec-head"><h2 id="h-${c.id}">${esc(c.name)}</h2><p>${lists[c.id].length} ${lists[c.id].length === 1 ? 'entry' : 'entries'}. ${esc(c.desc)}</p></div><div class="${wrapper[c.layout]}">${lists[c.id].map((e, n) => card[c.layout](e, n)).join('')}</div></div></section>`).join('');
  $('#stats').innerHTML = [[projects.length, 'projects'], [projects.reduce((a, p) => a + p.images.length, 0), 'designs'], [activeCats.length, 'categories']].map(([n, l]) => `<div><b>${n}</b><span>${l}</span></div>`).join('');

  // detail view
  const modal = $('#modal'), mImg = $('#mImg'), mThumbs = $('#mThumbs'), mInfo = $('#mInfo');
  let cur = null, curList = [], idx = 0, opener = null;
  const ph = t => SHOW_PLACEHOLDERS ? `<p class="ph">Placeholder: ${t}</p>` : '';
  const field = (t, v, f) => `<section><h3>${t}</h3>${v ? `<p>${esc(v)}</p>` : ph(f)}</section>`;
  function show(n) {
    idx = (n + cur.images.length) % cur.images.length; const i = cur.images[idx];
    mImg.style.opacity = 0;
    setTimeout(() => { mImg.onload = () => { mImg.style.opacity = 1; }; mImg.src = src(i.id, 'full'); mImg.width = i.w; mImg.height = i.h; mImg.alt = i.alt; }, reduce ? 0 : 130);
    $$('button', mThumbs).forEach((b, k) => b.setAttribute('aria-current', k === idx));
  }
  function openEntry(id) {
    const e = all[id]; if (!e) return; cur = e; const cat = CATS.find(c => c.id === e.category); curList = lists[e.category];
    const k = curList.indexOf(e), pv = curList[(k - 1 + curList.length) % curList.length], nx = curList[(k + 1) % curList.length], many = e.images.length > 1, n = e.images.length;
    $$('.nav', modal).forEach(b => { b.style.display = many ? '' : 'none'; });
    mThumbs.innerHTML = many ? e.images.map((i, j) => `<button aria-label="Show design ${j + 1}"><img src="${src(i.id, 'thumb')}" alt="" height="70"></button>`).join('') : '';
    const pal = e.palette && e.palette.length ? `<div class="pal">${e.palette.map(c => `<span><i style="--c:${c}"></i>${c}</span>`).join('')}</div>` : ph('add the colour palette.');
    mInfo.innerHTML = `<h2 id="mTitle">${esc(e.title)}</h2>
      ${field('Brand / client', e.brand, 'add the client or brand name.')}${field('Project overview', e.summary, 'add a short overview of the project.')}
      ${field('Design objective', e.objective, 'add what this design needed to achieve.')}${field('Creative concept', e.concept, 'add the idea behind the design.')}${field('Design process', e.process, 'add how you worked from brief to final artwork.')}
      <section><h3>Colour palette (extracted from the artwork)</h3>${pal}</section>
      ${field('Typography used', e.typography, 'add the fonts used.')}
      <section><h3>Software used</h3>${e.software && e.software.length ? `<ul class="sw">${e.software.map(s => `<li>${esc(s)}</li>`).join('')}</ul>` : ph('add the software used (for example Photoshop, Illustrator, CorelDRAW, Canva).')}</section>
      <section><h3>Design category</h3><p>${esc(cat.name)}</p></section>
      <section><h3>Project deliverables</h3><p>${n} ${cat.noun} design${n > 1 ? 's' : ''}${e.size ? `. Size noted in the file name: ${esc(e.size)}.` : '.'}</p></section>
      <div class="pn"><button data-open="${pv.id}" aria-label="Previous project"><small>&larr; Previous</small><b>${esc(pv.title)}</b></button><button data-open="${nx.id}" aria-label="Next project"><small>Next &rarr;</small><b>${esc(nx.title)}</b></button></div>
      <a class="btn primary" style="margin-top:16px" href="mailto:nakiyanikunj053@gmail.com?subject=${encodeURIComponent('Project inquiry: ' + e.title)}">Ask about a similar design</a>`;
    show(0);
    if (!modal.classList.contains('open')) { opener = document.activeElement; modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('locked'); $('#mClose').focus({ preventScroll: true }); }
    modal.scrollTop = 0;
  }
  function closeModal() { if (!modal.classList.contains('open')) return; modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('locked'); if (opener && opener.focus) opener.focus({ preventScroll: true }); }
  const closeClear = () => { const c = cur ? cur.category : 'top'; closeModal(); try { history.replaceState(null, '', '#' + c); } catch (e) { /* ignore */ } };
  const go = id => { openEntry(id); try { history.pushState(null, '', '#' + id); } catch (e) { location.hash = id; } };
  document.addEventListener('click', e => {
    const o = e.target.closest('[data-open]'); if (o) return go(o.dataset.open);
    const t = e.target.closest('#mThumbs button'); if (t) show([...mThumbs.children].indexOf(t));
    if (e.target.closest('.prev')) show(idx - 1); if (e.target.closest('.next')) show(idx + 1); if (e.target.closest('#mClose')) closeClear();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { tp.classList.remove('open'); }
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeClear(); if (e.key === 'ArrowLeft') show(idx - 1); if (e.key === 'ArrowRight') show(idx + 1);
    if (e.key === 'Tab') { const f = $$('button,a[href]', modal).filter(x => x.offsetParent !== null), a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
  });
  function route() { const id = location.hash.slice(1); if (all[id]) { if (!cur || cur.id !== id || !modal.classList.contains('open')) openEntry(id); } else closeModal(); }
  addEventListener('hashchange', route); route();

  // menu, form, year
  const mb = $('#menuBtn'), nav = $('#nav');
  mb.onclick = () => { const o = nav.classList.toggle('open'); mb.setAttribute('aria-expanded', o); };
  nav.addEventListener('click', e => { if (e.target.closest('a')) { nav.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); } });
  $('#inquiry').addEventListener('submit', e => { e.preventDefault(); const f = new FormData(e.target); location.href = `mailto:nakiyanikunj053@gmail.com?subject=${encodeURIComponent('Design inquiry from ' + f.get('name'))}&body=${encodeURIComponent(`Name: ${f.get('name')}\nContact: ${f.get('contact')}\nNeed: ${f.get('type')}\n\n${f.get('msg')}`)}`; });
  $('#yr').textContent = new Date().getFullYear();
})();
