/* Suche in Personen-Auswahlfeldern (select.person-select).
   Das native <select> bleibt als Datenquelle erhalten (id, value, change-Ereignis), wird aber ausgeblendet.
   Davor steht ein Auswahlfeld mit Suchzeile. Neue Auswahlfelder werden automatisch erweitert. */
(function () {
  'use strict';
  let offen = null;   // aktuell geöffnetes Auswahlfeld { close }

  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

  function anzeigeText(sel) {
    const o = sel.options[sel.selectedIndex];
    if (o && o.value !== '') return { text: o.textContent, leer: false };
    const ph = [...sel.options].find(x => x.value === '');
    return { text: ph ? ph.textContent : '– Person auswählen –', leer: true };
  }

  function erweitere(sel) {
    if (sel.dataset.ps) return;
    sel.dataset.ps = '1';
    const cs = getComputedStyle(sel);
    const wrap = document.createElement('div');
    wrap.className = 'ps-wrap';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ps-btn';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    // Aussehen vom ursprünglichen Feld übernehmen, damit es in jedem Kontext passt
    ['fontSize', 'fontFamily', 'color', 'borderRadius', 'paddingTop', 'paddingBottom', 'paddingLeft', 'lineHeight', 'backgroundColor']
      .forEach(k => { btn.style[k] = cs[k]; });
    btn.style.minHeight = cs.height;
    sel.parentNode.insertBefore(wrap, sel);
    wrap.appendChild(btn);
    wrap.appendChild(sel);
    sel.classList.add('ps-native');
    sel.tabIndex = -1;
    sel.setAttribute('aria-hidden', 'true');

    const sync = () => {
      const a = anzeigeText(sel);
      btn.textContent = a.text;
      btn.classList.toggle('is-leer', a.leer);
      btn.disabled = sel.disabled;
    };
    sync();
    sel.addEventListener('change', sync);
    sel.addEventListener('input', sync);

    let pop = null, input = null, liste = null, items = [], aktiv = -1;

    const ausserhalb = e => { if (pop && !pop.contains(e.target) && !btn.contains(e.target)) schliesse(); };
    const beiScroll = e => { if (pop && !pop.contains(e.target)) schliesse(); };

    function schliesse() {
      if (!pop) return;
      pop.remove(); pop = null; offen = null;
      btn.setAttribute('aria-expanded', 'false');
      document.removeEventListener('mousedown', ausserhalb, true);
      window.removeEventListener('resize', schliesse);
      window.removeEventListener('scroll', beiScroll, true);
    }

    function waehle(value) {
      schliesse();
      sel.value = value;
      sel.dispatchEvent(new Event('input', { bubbles: true }));
      sel.dispatchEvent(new Event('change', { bubbles: true }));   // «Neue Person erfassen» setzt den Wert im Handler selbst zurück
      sync();
      btn.focus();
    }

    const istTreffer = it => it.typ === 'option' && !it.el.hidden && !it.fix;

    function filtere() {
      const q = norm(input.value.trim());
      let gruppe = null;
      items.forEach(it => {
        if (it.typ === 'gruppe') { gruppe = it; it.n = 0; it.el.hidden = true; return; }
        if (it.typ === 'trenner') { it.el.hidden = !!q; return; }
        const treffer = !q || it.fix || norm(it.text).includes(q);
        it.el.hidden = !treffer;
        if (treffer && gruppe) gruppe.n++;
      });
      items.forEach(it => { if (it.typ === 'gruppe') it.el.hidden = it.n === 0; });
      liste.querySelector('.ps-leer').hidden = !q || items.some(istTreffer);
      const erster = items.findIndex(istTreffer);
      setzeAktiv(q && erster >= 0 ? erster : -1);
    }

    function setzeAktiv(i) {
      items.forEach(it => it.el.classList.remove('is-aktiv'));
      aktiv = i;
      if (i >= 0 && items[i]) { items[i].el.classList.add('is-aktiv'); items[i].el.scrollIntoView({ block: 'nearest' }); }
    }
    function bewege(d) {
      const ok = items.map((it, i) => (it.typ === 'option' && !it.el.hidden) ? i : -1).filter(i => i >= 0);
      if (!ok.length) return;
      const pos = ok.indexOf(aktiv);
      setzeAktiv(ok[pos < 0 ? (d > 0 ? 0 : ok.length - 1) : (pos + d + ok.length) % ok.length]);
    }

    function oeffne() {
      if (pop || sel.disabled) return;
      if (offen) offen.close();
      pop = document.createElement('div');
      pop.className = 'ps-pop';
      pop.innerHTML = '<input type="search" class="ps-suche" placeholder="Person suchen …" aria-label="Person suchen" autocomplete="off"><div class="ps-liste" role="listbox"></div>';
      input = pop.querySelector('input');
      liste = pop.querySelector('.ps-liste');
      items = [];
      const aktuell = sel.value;
      const baue = o => {
        const el = document.createElement('div');
        if (o.disabled && /^─+$/.test(o.textContent.trim())) { el.className = 'ps-trenner'; liste.appendChild(el); items.push({ typ: 'trenner', el }); return; }
        if (o.hidden && o.disabled) return;
        el.className = 'ps-opt' + (o.className ? ' ' + o.className : '') + (o.value === aktuell && aktuell !== '' ? ' is-gewaehlt' : '') + (o.value === '' ? ' ps-opt-leer' : '');
        el.setAttribute('role', 'option');
        el.textContent = o.textContent;
        el.dataset.value = o.value;
        liste.appendChild(el);
        items.push({ typ: 'option', el, text: o.textContent, value: o.value, fix: o.value === '' || /person-neu|person-keine/.test(o.className) });
      };
      [...sel.children].forEach(c => {
        if (c.tagName === 'OPTGROUP') {
          const g = document.createElement('div'); g.className = 'ps-gruppe'; g.textContent = c.label; liste.appendChild(g);
          items.push({ typ: 'gruppe', el: g });
          [...c.children].forEach(baue);
        } else baue(c);
      });
      const leer = document.createElement('div'); leer.className = 'ps-leer'; leer.textContent = 'Keine Person gefunden.'; leer.hidden = true;
      liste.appendChild(leer);
      document.body.appendChild(pop);
      // Position unter dem Feld, bei wenig Platz darüber
      const r = btn.getBoundingClientRect(), h = Math.min(320, window.innerHeight * 0.5);
      const unten = window.innerHeight - r.bottom, oben = r.top;
      pop.style.width = r.width + 'px';
      pop.style.left = Math.max(8, Math.min(r.left, window.innerWidth - r.width - 8)) + 'px';
      if (unten < h + 12 && oben > unten) { pop.style.bottom = (window.innerHeight - r.top + 4) + 'px'; pop.style.maxHeight = Math.max(160, oben - 16) + 'px'; }
      else { pop.style.top = (r.bottom + 4) + 'px'; pop.style.maxHeight = Math.max(160, unten - 16) + 'px'; }
      btn.setAttribute('aria-expanded', 'true');
      offen = { close: schliesse };
      document.addEventListener('mousedown', ausserhalb, true);
      window.addEventListener('resize', schliesse);
      window.addEventListener('scroll', beiScroll, true);
      liste.addEventListener('mousedown', e => {
        const el = e.target.closest('.ps-opt'); if (!el) return;
        e.preventDefault(); waehle(el.dataset.value);
      });
      liste.addEventListener('mousemove', e => {
        const el = e.target.closest('.ps-opt'); if (!el) return;
        const i = items.findIndex(it => it.el === el); if (i !== aktiv) setzeAktiv(i);
      });
      input.addEventListener('input', filtere);
      input.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown') { e.preventDefault(); bewege(1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); bewege(-1); }
        else if (e.key === 'Enter') { e.preventDefault(); if (aktiv >= 0 && items[aktiv] && items[aktiv].typ === 'option') waehle(items[aktiv].value); }
        else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); schliesse(); btn.focus(); }
        else if (e.key === 'Tab') schliesse();
      });
      filtere();
      const gi = items.findIndex(it => it.typ === 'option' && it.value === aktuell && aktuell !== '');
      if (gi >= 0) setzeAktiv(gi);
      input.focus();
    }

    btn.addEventListener('click', () => (pop ? schliesse() : oeffne()));
    btn.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); oeffne(); }
    });
  }

  function alleErweitern(root) {
    if (!root || !root.querySelectorAll) return;
    if (root.matches && root.matches('select.person-select:not([data-ps])')) erweitere(root);
    root.querySelectorAll('select.person-select:not([data-ps])').forEach(erweitere);
  }

  new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) alleErweitern(n); })))
    .observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', () => alleErweitern(document.body));
})();
