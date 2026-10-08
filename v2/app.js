/* =============================================================
   Energieplanung v2 — Benutzeroberfläche
   Prozessgeführt: Jede Ansicht beantwortet "Was ist als Nächstes zu tun – und von wem?"
   Datenmodell & Prozesslogik: siehe data.js
   ============================================================= */

/* ---------------------- KONSTANTEN ---------------------- */
const ROLLEN = {
  Berater: { label: 'Energieberater/in', kurz: 'SG' },
  Controller: { label: 'Controller/in (Kanton)', kurz: 'CO' },
};
const WER_LABEL = { Berater: 'Berater/in', Controller: 'Kanton (Controller)' };
const GEMEINDEN = GEMEINDEN_LUZERN_PLZ.map(g => g.name);

const ICON = {
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 20.6 7.4 19.2 6z"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>',
  back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  warn: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 1 21h22L12 2zm1 15h-2v-2h2v2zm0-4h-2V9h2v4z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>',
  edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>',
  lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8h-1V6A5 5 0 0 0 7 6v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zM9 6a3 3 0 0 1 6 0v2H9V6zm9 14H6V10h12v10zm-6-3a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>',
  info: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 7h2v2h-2V7zm0 4h2v6h-2v-6zm1-9a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.65 6.35A7.95 7.95 0 0 0 12 4a8 8 0 1 0 7.73 10h-2.08A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>',
};

/* ---------------------- STATE ---------------------- */
const state = {
  role: 'Berater',
  tab: 'start',               // start | planungen | kontakte | auswertungen
  planungId: null,            // gesetzt = Dossier einer Energieplanung offen
  detailTab: 'energieplanung',
  editing: null,              // 'stammdaten' | 'epa-<Stufe>' | 'controlling'
  list: { search: '', phase: '', aufgabe: '', nurMeine: true },
  mass: { filter: 'offen', search: '' },
  reviewId: null,             // aktuell geöffnete Massnahme im Nachführungs-Durchgang
  drawer: null,               // { type: 'massnahme' | 'neuePlanung' | 'kontakt', id, mode }
  reportView: null,
  contactSearch: '',
  layoutMode: 'data',
  processOpen: false,
};

const $panel = document.getElementById('panel-content');
const findPlanung = id => planungen.find(p => p.id === id);
const currentPlanung = () => findPlanung(state.planungId);

/* ---------------------- HELFER ---------------------- */
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function show(v, fallback = '–') { return (v === '' || v === null || v === undefined) ? `<span class="muted">${esc(fallback)}</span>` : esc(v); }
function plural(n, one, many) { return `${n} ${n === 1 ? one : many}`; }
function isClosedStatus(s) { return s === 'Erledigt' || s === 'Gestrichen'; }

let toastTimer = null;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}

function statusPill(s) { return s ? `<span class="status-pill status-${statusSlug(s)}">${esc(s)}</span>` : ''; }

function phaseBadge(p) {
  const ph = phaseOf(p);
  let sub = '', warn = false;
  if (ph === 'epa') sub = p.epa.status;
  if (ph === 'foerderung') sub = 'beim Kanton';
  if (ph === 'nachfuehrung') {
    const st = nachfuehrungStatus(p);
    if (p.laufendeNachfuehrung) { sub = 'läuft'; warn = true; }
    else if (st === 'faellig') { sub = 'fällig'; warn = true; }
    else if (st === 'bald') sub = 'bald fällig';
    else if (st === 'ende') sub = `bis ${NACHFUEHRUNG_ENDE_JAHR} erledigt`;
  }
  return `<span class="phase-badge phase-${ph}${warn ? ' is-warn' : ''}"><span class="phase-nr">${PHASEN[ph].nr}</span>${PHASEN[ph].label}${sub ? `<span class="phase-sub">· ${esc(sub)}</span>` : ''}</span>`;
}

function terminLabel(a) {
  if (!a.termin) return '';
  const d = fromIso(a.termin);
  if (a.key === 'controlling') return `Eingereicht ${fmtDate(a.termin)}`;
  if (d <= TODAY) {
    const tage = daysBetween(d, TODAY);
    return `Fällig seit ${tage > 60 ? fmtDate(a.termin) : plural(tage, 'Tag', 'Tagen')}`;
  }
  return `Fällig am ${fmtDate(a.termin)}`;
}

function datalistKontakte() {
  return `<datalist id="dl-kontakte">${contacts.map(c => `<option value="${esc(formatContactLabel(c))}"></option>`).join('')}</datalist>`;
}

/* ---------------------- FORMULAR-BAUSTEINE ---------------------- */
function field(o) {
  const { id, label, type = 'text', value = '', required, soft, help, options, list, placeholder = '', rows = 3, full } = o;
  let control;
  if (type === 'select') {
    control = `<select id="${id}">${options.map(opt => {
      const [v, l] = Array.isArray(opt) ? opt : [opt, opt];
      return `<option value="${esc(v)}"${String(v) === String(value) ? ' selected' : ''}>${esc(l)}</option>`;
    }).join('')}</select>`;
  } else if (type === 'yesno') {
    control = segmented(id, value);
  } else if (type === 'textarea') {
    control = `<textarea id="${id}" rows="${rows}" placeholder="${esc(placeholder)}">${esc(value)}</textarea>`;
  } else {
    control = `<input type="${type}" id="${id}" value="${esc(value)}" placeholder="${esc(placeholder)}"${list ? ` list="${list}"` : ''}>`;
  }
  return `<div class="form-field${full ? ' full' : ''}" data-field="${id}">
    <label${type === 'yesno' ? '' : ` for="${id}"`}>${esc(label)}${required ? '<span class="req" aria-hidden="true">*</span>' : ''}${soft ? `<span class="req-soft">${esc(soft)}</span>` : ''}</label>
    ${help ? `<div class="field-help">${help}</div>` : ''}
    ${control}
  </div>`;
}
function segmented(name, value, opts = ['Ja', 'Nein']) {
  return `<div class="seg" role="radiogroup">${opts.map(o =>
    `<label class="seg-opt"><input type="radio" name="${name}" value="${esc(o)}"${value === o ? ' checked' : ''}><span>${esc(o)}</span></label>`).join('')}</div>`;
}
function readField(id) {
  const radios = document.querySelectorAll(`input[type=radio][name="${id}"]`);
  if (radios.length) { const c = Array.from(radios).find(r => r.checked); return c ? c.value : ''; }
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}
function clearFormErrors(box) {
  box.querySelectorAll('.form-error-banner, .field-error-msg').forEach(el => el.remove());
  box.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
}
function showFormErrors(box, list) {
  clearFormErrors(box);
  if (!list.length) return;
  list.forEach(([id]) => {
    const f = box.querySelector(`[data-field="${id}"]`);
    if (!f) return;
    f.classList.add('has-error');
    f.insertAdjacentHTML('beforeend', `<div class="field-error-msg">${ICON.warn}<span>Bitte ausfüllen.</span></div>`);
  });
  const links = list.map(([id, label]) => id === 'massnahmen'
    ? `<a href="#" data-action="detail-tab" data-tab="massnahmen">${esc(label)}</a>`
    : `<a href="#" data-jump="${id}">${esc(label)}</a>`).join('');
  box.insertAdjacentHTML('afterbegin', `<div class="form-error-banner" role="alert">${ICON.warn}<div><strong>Es fehlen noch ${plural(list.length, 'Angabe', 'Angaben')}:</strong><div class="form-error-links">${links}</div></div></div>`);
  box.querySelector('.form-error-banner').scrollIntoView({ block: 'center', behavior: 'smooth' });
}
function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

function lockBox(title, text, actionHtml) {
  return `<div class="lock-box">
    <div class="lock-icon">${ICON.lock}</div>
    <div><h3>${esc(title)}</h3><p>${text}</p>${actionHtml || ''}</div>
  </div>`;
}

/* ---------------------- AUFGABEN (Startseite) ---------------------- */
const AUFGABEN_TYPEN = [ // Reihenfolge = Priorität
  { key: 'nachfuehrung-laufend', wer: 'Berater', ton: 'warn', titel: 'Begonnene Nachführung fertigstellen', text: 'Die Überprüfung wurde gestartet, aber noch nicht abgeschlossen.' },
  { key: 'nachfuehrung-faellig', wer: 'Berater', ton: 'warn', titel: 'Nachführung fällig', text: 'Alle 4 Jahre wird jede offene Massnahme überprüft: Stand, Weiterführung und Bemerkung.' },
  { key: 'controlling', wer: 'Controller', ton: 'action', titel: 'Fördergesuche prüfen', text: 'Gesuchseingang, Auszahlungsbetrag und Energiestadt-Status erfassen.' },
  { key: 'abschluss', wer: 'Controller', ton: 'action', titel: 'EPA-Beratungen abschliessen', text: 'Das Gesuch ist geprüft – mit dem Abschluss startet der Nachführungsrhythmus.' },
  { key: 'foerdergesuch', wer: 'Berater', ton: 'action', titel: 'Fördergesuch einreichen', text: 'Kontoangaben erfassen, unterschriebenes Formular und Beilagen hochladen und das Gesuch beim Kanton einreichen.' },
  { key: 'verabschiedung', wer: 'Berater', ton: 'action', titel: 'Verabschiedung erfassen', text: 'Datum des Gemeinderatsbeschlusses eintragen.' },
  { key: 'entwurf', wer: 'Berater', ton: 'action', titel: 'Entwurf der EPA-Beratung fertigstellen', text: 'Beratung durchführen, Bedarf klären und Massnahmen erfassen.' },
  { key: 'epa-start', wer: 'Berater', ton: 'action', titel: 'EPA-Beratung starten', text: 'Die Grunddaten sind vollständig – die Beratung kann beginnen.' },
  { key: 'stammdaten', wer: 'Berater', ton: 'action', titel: 'Energieplanung vervollständigen', text: 'Es fehlen noch Grunddaten, bevor die EPA-Beratung starten kann.' },
  { key: 'nachfuehrung-bald', wer: 'Berater', ton: 'info', titel: 'Demnächst fällig', text: `Nachführungen in den nächsten ${NACHFUEHRUNG_VORLAUF_MONATE} Monaten – Sie können bereits vorbereiten.` },
];
function istMeine(p) { return p.berater === ANGEMELDETER_BERATER; }
// Berater sehen nur ihre eigenen Gemeinden, der Kanton (Controller) alle.
function planungenFuerRolle(role) { return role === 'Berater' ? planungen.filter(istMeine) : planungen; }

function aufgabenGruppen(role) {
  const all = planungenFuerRolle(role).map(p => ({ p, a: naechsteAktion(p) }));
  return AUFGABEN_TYPEN
    .filter(t => t.wer === role)
    .map(t => ({
      typ: t,
      items: all.filter(x => x.a.key === t.key).sort((x, y) =>
        (x.a.termin || '9999').localeCompare(y.a.termin || '9999') || x.p.gemeinde.localeCompare(y.p.gemeinde))
    }))
    .filter(g => g.items.length);
}
function anzahlAufgaben(role) {
  return aufgabenGruppen(role).filter(g => g.typ.ton !== 'info').reduce((s, g) => s + g.items.length, 0);
}

const PROZESS = [
  { nr: 1, titel: 'Energieplanung erfassen', wer: 'Berater', wann: 'Zu Beginn', text: 'Gemeinde, Planungstyp, verantwortliche Personen und Ziele erfassen.' },
  { nr: 2, titel: 'EPA-Beratung durchführen', wer: 'Berater', wann: 'Ca. 6–12 Monate', text: 'Entwurf mit Massnahmen → Verabschiedung durch den Gemeinderat → Fördergesuch einreichen.' },
  { nr: 3, titel: 'Förderung prüfen & abschliessen', wer: 'Controller', wann: 'Nach Eingang des Gesuchs', text: 'Gesuchseingang, Auszahlungsbetrag, Kommentar und Energiestadt erfassen und die Beratung abschliessen.' },
  { nr: 4, titel: 'Nachführung alle 4 Jahre', wer: 'Berater', wann: `Bis ${NACHFUEHRUNG_ENDE_JAHR}`, text: 'Jede offene Massnahme überprüfen: Stand, Weiterführung, Bemerkung. Neue Massnahmen ergänzen.' },
];

/* ---------------------- RENDER ROOT ---------------------- */
function render() {
  document.querySelectorAll('.panel-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === state.tab));
  const badge = document.getElementById('tab-badge-start');
  const n = anzahlAufgaben(state.role);
  badge.hidden = n === 0;
  badge.textContent = n;
  if (state.tab === 'start') renderStart();
  else if (state.tab === 'planungen') (state.planungId ? renderDossier() : renderPlanungList());
  else if (state.tab === 'kontakte') renderKontakte();
  else if (state.tab === 'auswertungen') renderAuswertungen();
  renderDrawer();
}

/* =============================================================
   STARTSEITE: "Was steht an?"
   ============================================================= */
function renderStart() {
  if (state.role === 'Berater') renderStartBerater();
  else renderStartController();
}

// Berater: eine kurze, flache Liste – pro Gemeinde höchstens eine Zeile.
function renderStartBerater() {
  const prio = key => AUFGABEN_TYPEN.findIndex(t => t.key === key);
  const meine = planungenFuerRolle('Berater').map(p => ({ p, a: naechsteAktion(p) }));
  const todo = meine
    .filter(x => x.a.wer === 'Berater' && x.a.art !== 'ok')
    .sort((x, y) => prio(x.a.key) - prio(y.a.key) || (x.a.termin || '9999').localeCompare(y.a.termin || '9999'));
  const rest = meine.filter(x => !todo.includes(x)).sort((x, y) => x.p.gemeinde.localeCompare(y.p.gemeinde));
  const vorname = ANGEMELDETER_BERATER.split(' ')[0];
  const dringend = todo.filter(x => x.a.art === 'aufgabe').length;

  $panel.innerHTML = `<div class="page page-narrow">
    <header class="hero">
      <h1>Guten Tag, ${esc(vorname)}</h1>
      <p>Sie betreuen ${plural(meine.length, 'Energieplanung', 'Energieplanungen')}.
        ${dringend ? `<strong>${dringend === 1 ? 'Eine braucht' : `${dringend} brauchen`} jetzt Ihre Aufmerksamkeit.</strong>` : 'Aktuell ist nichts zu tun.'}</p>
    </header>

    ${todo.length ? `<section class="block">
      <h2 class="block-title">Zu erledigen</h2>
      <ul class="todo-list">${todo.map(({ p, a }) => {
        const tone = a.art === 'info' ? 'info' : a.key.startsWith('nachfuehrung') ? 'warn' : 'action';
        return `<li><button class="todo-card tone-${tone}" data-action="open-planung" data-id="${p.id}">
          <span class="todo-main">
            <span class="todo-gemeinde">${esc(p.gemeinde)}</span>
            <span class="todo-title">${esc(a.titel)}</span>
            <span class="todo-text">${esc(a.text)}</span>
          </span>
          <span class="todo-side">
            ${a.termin ? `<span class="todo-date">${terminLabel(a)}</span>` : ''}
            <span class="btn ${tone === 'info' ? 'btn-outline' : 'btn-primary'} btn-sm">${esc(a.cta)}${ICON.arrow}</span>
          </span>
        </button></li>`;
      }).join('')}</ul>
    </section>` : `<div class="empty-card">${ICON.check}<div><strong>Alles erledigt.</strong><div>Die App meldet sich hier, sobald wieder etwas ansteht – z.B. die nächste Nachführung.</div></div></div>`}

    ${rest.length ? `<section class="block">
      <h2 class="block-title">Ihre übrigen Energieplanungen</h2>
      <ul class="mine-list">${rest.map(({ p, a }) => `<li><button class="mine-row" data-action="open-planung" data-id="${p.id}">
        <span class="mine-gemeinde">${esc(p.gemeinde)}</span>
        ${phaseBadge(p)}
        <span class="mine-status">${a.art === 'ok'
          ? (a.termin ? `Nächste Nachführung am ${fmtDate(a.termin)}` : esc(a.titel))
          : `Beim Kanton: ${esc(a.titel)}`}</span>
        <span class="task-item-arrow">${ICON.chevron}</span>
      </button></li>`).join('')}</ul>
    </section>` : ''}

    ${renderProzess()}
  </div>`;
}

// Controller: kantonsweit, daher nach Aufgabentyp gruppiert.
function renderStartController() {
  const gruppen = aufgabenGruppen('Controller');
  const n = anzahlAufgaben('Controller');
  $panel.innerHTML = `<div class="page">
    <header class="hero">
      <h1>Guten Tag</h1>
      <p>${n ? `<strong>${n === 1 ? 'Ein Fördergesuch wartet' : `${n} Fördergesuche warten`} auf Ihre Prüfung.</strong>` : 'Aktuell warten keine Fördergesuche auf Ihre Prüfung.'}</p>
    </header>
    ${gruppen.length ? `<div class="task-groups">${gruppen.map(renderTaskGroup).join('')}</div>`
      : `<div class="empty-card">${ICON.check}<div><strong>Alles erledigt.</strong></div></div>`}
    ${renderProzess()}
  </div>`;
}

function renderTaskGroup(g) {
  const max = 5;
  return `<div class="task-group tone-${g.typ.ton}">
    <div class="task-group-head">
      <span class="task-count">${g.items.length}</span>
      <div>
        <div class="task-group-title">${esc(g.typ.titel)}</div>
        <div class="task-group-text">${esc(g.typ.text)}</div>
      </div>
    </div>
    <ul class="task-list">
      ${g.items.slice(0, max).map(({ p, a }) => `
        <li><button class="task-item" data-action="open-planung" data-id="${p.id}">
          <span class="task-item-main">
            <span class="task-item-title">${esc(p.gemeinde)}</span>
            <span class="task-item-sub">${esc(a.text)}</span>
          </span>
          ${a.termin ? `<span class="task-item-date">${terminLabel(a)}</span>` : ''}
          <span class="task-item-arrow">${ICON.chevron}</span>
        </button></li>`).join('')}
    </ul>
    ${g.items.length > max ? `<button class="link-btn task-more" data-action="list-aufgabe" data-key="${g.typ.key}">Alle ${g.items.length} anzeigen ${ICON.arrow}</button>` : ''}
  </div>`;
}

function renderProzess() {
  if (!state.processOpen) {
    return `<button class="link-btn process-toggle" data-action="toggle-process">${ICON.info}Wie funktioniert der Prozess?</button>`;
  }
  return `<section class="block">
    <div class="block-head">
      <h2 class="block-title">So funktioniert der Prozess</h2>
      <button class="link-btn" data-action="toggle-process">Ausblenden</button>
    </div>
    <ol class="process">
      ${PROZESS.map(s => `<li class="process-step${s.wer === state.role ? ' is-mine' : ''}">
        <div class="process-nr">${s.nr}</div>
        <div class="process-title">${esc(s.titel)}</div>
        <div class="process-meta"><span class="who-chip who-${s.wer.toLowerCase()}">${WER_LABEL[s.wer]}</span><span>${esc(s.wann)}</span></div>
        <p>${esc(s.text)}</p>
        ${s.wer === state.role ? '<div class="process-mine">Ihre Rolle</div>' : ''}
      </li>`).join('')}
    </ol>
  </section>`;
}

/* =============================================================
   LISTE DER ENERGIEPLANUNGEN
   ============================================================= */
const LIST_PHASEN = [['', 'Alle'], ['erfassung', '1 · Erfassung'], ['epa', '2 · EPA-Beratung'], ['foerderung', '3 · Förderung'], ['nachfuehrung', '4 · Nachführung'], ['faellig', 'Nachführung fällig']];

function matchesPhase(p, phase) {
  if (!phase) return true;
  if (phase === 'faellig') return !!p.laufendeNachfuehrung || nachfuehrungStatus(p) === 'faellig';
  return phaseOf(p) === phase;
}
function listBasis() {
  return state.role === 'Berater' && state.list.nurMeine ? planungen.filter(istMeine) : planungen;
}
function filteredPlanungen() {
  const q = state.list.search.trim().toLowerCase();
  return listBasis()
    .filter(p => !q || [p.gemeinde, p.id, p.berater, p.typ].some(v => String(v).toLowerCase().includes(q)))
    .filter(p => matchesPhase(p, state.list.phase))
    .filter(p => !state.list.aufgabe || naechsteAktion(p).key === state.list.aufgabe)
    .sort((a, b) => a.gemeinde.localeCompare(b.gemeinde));
}

function renderPlanungList() {
  const aufgabeTyp = AUFGABEN_TYPEN.find(t => t.key === state.list.aufgabe);
  $panel.innerHTML = `<div class="page">
    <div class="page-head">
      <div>
        <h1 class="page-title">Energieplanungen</h1>
        <p class="page-sub">Alle Energieplanungen mit ihrem aktuellen Prozessschritt und dem nächsten Schritt.</p>
      </div>
      <button class="btn btn-primary" data-action="new-planung">${ICON.plus}Neue Energieplanung</button>
    </div>
    <div class="toolbar">
      ${state.role === 'Berater' ? `<div class="seg seg-toggle" role="group" aria-label="Umfang">
        <button class="${state.list.nurMeine ? 'active' : ''}" data-action="list-scope" data-meine="1">Meine Gemeinden<span class="chip-count">${planungen.filter(istMeine).length}</span></button>
        <button class="${state.list.nurMeine ? '' : 'active'}" data-action="list-scope" data-meine="0">Alle<span class="chip-count">${planungen.length}</span></button>
      </div>` : ''}
      <div class="search-input-wrap">
        <input type="search" id="planung-search" placeholder="Gemeinde, ID oder Berater/in suchen …" value="${esc(state.list.search)}" aria-label="Energieplanungen durchsuchen">
        ${ICON.search}
      </div>
    </div>
    <div class="chip-row" role="group" aria-label="Nach Prozessschritt filtern">
      ${LIST_PHASEN.map(([k, l]) => `<button class="chip${state.list.phase === k && !state.list.aufgabe ? ' active' : ''}" data-action="list-phase" data-phase="${k}">${l}<span class="chip-count">${listBasis().filter(p => matchesPhase(p, k)).length}</span></button>`).join('')}
      ${aufgabeTyp ? `<button class="chip active chip-removable" data-action="list-aufgabe" data-key="">Aufgabe: ${esc(aufgabeTyp.titel)} ${ICON.close}</button>` : ''}
    </div>
    <div id="planung-results">${renderPlanungResults()}</div>
  </div>`;
}

function renderPlanungResults() {
  const list = filteredPlanungen();
  if (!list.length) return `<div class="empty-state">Keine Energieplanungen gefunden.</div>`;
  return `<div class="table-scroll"><table class="data-table planung-table">
    <thead><tr><th>Gemeinde</th><th>Prozessschritt</th><th>Nächster Schritt</th><th>Termin</th></tr></thead>
    <tbody>
      ${list.map(p => {
        const a = naechsteAktion(p);
        return `<tr data-action="open-planung" data-id="${p.id}" tabindex="0">
          <td><div class="cell-title">${esc(p.gemeinde)}</div><div class="cell-sub">${esc(p.id)} · ${esc(p.typ)}</div></td>
          <td>${phaseBadge(p)}</td>
          <td><div class="cell-next${a.art === 'ok' ? ' is-ok' : ''}">${esc(a.titel)}</div>${a.art !== 'ok' ? `<div class="cell-sub">zuständig: ${WER_LABEL[a.wer]}</div>` : ''}</td>
          <td class="cell-date">${a.termin ? esc(terminLabel(a)) : '<span class="muted">–</span>'}</td>
        </tr>`;
      }).join('')}
    </tbody>
  </table></div>
  <div class="table-foot">${plural(list.length, 'Energieplanung', 'Energieplanungen')}</div>`;
}

/* =============================================================
   DOSSIER EINER ENERGIEPLANUNG
   ============================================================= */
const DETAIL_TABS = [
  { key: 'energieplanung', nr: 1, label: 'Energieplanung' },
  { key: 'epa', nr: 2, label: 'EPA-Beratung' },
  { key: 'foerderung', nr: 3, label: 'Förderung' },
  { key: 'massnahmen', label: 'Massnahmen' },
  { key: 'nachfuehrung', nr: 4, label: 'Nachführung' },
];

function openPlanung(id, tab) {
  const p = findPlanung(id);
  if (!p) return;
  state.tab = 'planungen';
  state.planungId = id;
  state.detailTab = tab || naechsteAktion(p).tab;   // direkt dort öffnen, wo etwas zu tun ist
  state.editing = null;
  state.reviewId = null;
  state.mass = { filter: 'offen', search: '' };
  render();
  $panel.scrollTop = 0;
}

function renderDossier() {
  const p = currentPlanung();
  if (!p) { state.planungId = null; renderPlanungList(); return; }
  const a = naechsteAktion(p);
  $panel.innerHTML = `<div class="page">
    <button class="back-link" data-action="back-to-list">${ICON.back}Alle Energieplanungen</button>
    <div class="dossier-head">
      <div>
        <div class="dossier-eyebrow">${esc(p.id)} · ${esc(p.typ)} · ${esc(p.jahr)}</div>
        <h1 class="page-title">Energieplanung ${esc(p.gemeinde)}</h1>
        <div class="dossier-meta">Berater/in: ${show(p.berater)} <span class="dot">·</span> Gemeinde: ${show(p.verantwortlichGemeinde)}</div>
      </div>
      ${phaseBadge(p)}
    </div>
    ${renderJourney(p)}
    ${renderNextStep(p, a)}
    <nav class="tabs" id="detail-tabs" role="tablist">
      ${DETAIL_TABS.map(t => `<button role="tab" aria-selected="${state.detailTab === t.key}" class="tab${state.detailTab === t.key ? ' active' : ''}" data-action="detail-tab" data-tab="${t.key}">
        ${t.nr ? `<span class="tab-nr">${t.nr}</span>` : ''}${t.label}
        ${t.key === 'massnahmen' ? `<span class="tab-count">${p.massnahmen.length}</span>` : ''}
        ${a.art === 'aufgabe' && a.wer === state.role && a.tab === t.key ? '<span class="tab-dot" title="Hier ist etwas zu tun"></span>' : ''}
      </button>`).join('')}
    </nav>
    <div class="tab-body" role="tabpanel">${renderDetailTab(p)}</div>
  </div>`;
}

function journeySteps(p) {
  const fs = fehlend(PFLICHT_STAMMDATEN, p).length;
  const e = p.epa;
  const abgeschl = e.status === 'Abschluss';
  const eingereicht = !!e.gesuchEingereichtAm;
  const nst = nachfuehrungStatus(p);
  const due = naechsteNachfuehrung(p);
  return [
    { tab: 'energieplanung', nr: 1, titel: 'Energieplanung erfassen', wer: 'Berater',
      st: fs ? 'current' : 'done', sub: fs ? `${plural(fs, 'Angabe fehlt', 'Angaben fehlen')}` : 'Vollständig' },
    { tab: 'epa', nr: 2, titel: 'EPA-Beratung', wer: 'Berater',
      st: eingereicht || abgeschl ? 'done' : (e.status || !fs) ? 'current' : 'upcoming',
      sub: eingereicht || abgeschl ? 'Gesuch eingereicht' : e.status ? `Phase «${e.status}»` : fs ? 'Noch nicht möglich' : 'Bereit zum Start' },
    { tab: 'foerderung', nr: 3, titel: 'Förderung & Abschluss', wer: 'Controller',
      st: abgeschl ? 'done' : eingereicht ? 'current' : 'upcoming',
      sub: abgeschl ? `Abgeschlossen ${fmtDate(e.abgeschlossenAm)}` : eingereicht ? 'In Prüfung beim Kanton' : 'Nach dem Fördergesuch' },
    { tab: 'nachfuehrung', nr: 4, titel: `Nachführung bis ${NACHFUEHRUNG_ENDE_JAHR}`, wer: 'Berater',
      st: !abgeschl ? 'upcoming' : nst === 'ende' ? 'done' : (nst === 'faellig' || p.laufendeNachfuehrung) ? 'warn' : 'current',
      sub: !abgeschl ? `Alle ${NACHFUEHRUNG_INTERVALL_JAHRE} Jahre` : p.laufendeNachfuehrung ? 'Läuft' : due ? `${nst === 'faellig' ? 'Fällig seit' : 'Nächste'} ${fmtDate(toIso(due))}` : 'Erledigt' },
  ];
}

function renderJourney(p) {
  return `<ol class="journey" aria-label="Lebenszyklus der Energieplanung">
    ${journeySteps(p).map(s => `<li class="journey-step st-${s.st}${state.detailTab === s.tab ? ' is-viewing' : ''}">
      <button data-action="detail-tab" data-tab="${s.tab}">
        <span class="journey-marker">${s.st === 'done' ? ICON.check : s.nr}</span>
        <span class="journey-text">
          <span class="journey-title">${esc(s.titel)}</span>
          <span class="journey-sub">${esc(s.sub)}</span>
          <span class="who-chip who-${s.wer.toLowerCase()}">${WER_LABEL[s.wer]}</span>
        </span>
      </button>
    </li>`).join('')}
  </ol>`;
}

function renderNextStep(p, a) {
  const mine = a.wer === state.role;
  const tone = a.art === 'ok' ? 'ok' : a.art === 'info' ? 'info' : !mine ? 'wait' : a.key.startsWith('nachfuehrung') ? 'warn' : 'action';
  const icon = { ok: ICON.check, wait: ICON.clock, warn: ICON.warn, info: ICON.clock, action: ICON.arrow }[tone];
  const eyebrow = a.art === 'ok' ? 'Status' : mine ? 'Ihr nächster Schritt' : `Nächster Schritt · zuständig: ${WER_LABEL[a.wer]}`;
  const text = !mine && a.art === 'aufgabe' ? `${a.text} Für Sie als ${ROLLEN[state.role].label} gibt es hier aktuell nichts zu tun.` : a.text;
  return `<div class="next-step tone-${tone}">
    <div class="next-step-icon">${icon}</div>
    <div class="next-step-body">
      <div class="next-step-eyebrow">${esc(eyebrow)}</div>
      <div class="next-step-title">${esc(a.titel)}</div>
      <div class="next-step-text">${esc(text)}</div>
    </div>
    ${mine && a.cta ? `<button class="btn btn-primary" data-action="detail-tab" data-tab="${a.tab}" data-scroll="1">${esc(a.cta)}${ICON.arrow}</button>` : ''}
  </div>`;
}

function renderDetailTab(p) {
  switch (state.detailTab) {
    case 'energieplanung': return renderTabEnergieplanung(p);
    case 'epa': return renderTabEpa(p);
    case 'foerderung': return renderTabFoerderung(p);
    case 'massnahmen': return renderTabMassnahmen(p);
    case 'nachfuehrung': return renderTabNachfuehrung(p);
  }
  return '';
}

/* ---------------------- TAB 1: ENERGIEPLANUNG ---------------------- */
function kv(label, value, missing) {
  const empty = value === '' || value === null || value === undefined;
  return `<div class="kv"><dt>${esc(label)}</dt><dd>${empty ? (missing ? '<span class="missing">fehlt</span>' : '<span class="muted">–</span>') : esc(value)}</dd></div>`;
}

function renderTabEnergieplanung(p) {
  if (state.editing === 'stammdaten') return formStammdaten(p);
  const fehl = fehlend(PFLICHT_STAMMDATEN, p);
  const isMissing = id => fehl.some(f => f[0] === id);
  return `
    ${fehl.length ? `<div class="info-box tone-warn">${ICON.warn}<div><strong>${plural(fehl.length, 'Angabe fehlt', 'Angaben fehlen')} noch</strong>, damit die EPA-Beratung starten kann: ${fehl.map(f => esc(f[1])).join(', ')}.</div></div>` : ''}
    <div class="card">
      <div class="card-head"><h3>Grunddaten</h3><button class="btn btn-outline btn-sm" data-action="edit" data-section="stammdaten">${ICON.edit}Bearbeiten</button></div>
      <dl class="kv-list">
        ${kv('Gemeinde', p.gemeinde, isMissing('f-gemeinde'))}
        ${kv('Planungstyp', p.typ, isMissing('f-typ'))}
        ${kv('Jahr', p.jahr, isMissing('f-jahr'))}
        ${kv('Verantwortliche Person der Gemeinde', p.verantwortlichGemeinde, isMissing('f-verantwortlich'))}
        ${kv('Berater/in Energieplanung', p.berater, isMissing('f-berater'))}
      </dl>
    </div>
    <div class="card">
      <div class="card-head"><h3>Ziele der Energieplanung</h3></div>
      <dl class="kv-list">
        ${kv('Netto-null Ziel', p.ziele.nettoNull)}
        ${kv('Energieeffizienz Ziel', p.ziele.effizienz)}
        ${kv('Stromproduktion Ziel', p.ziele.strom)}
      </dl>
    </div>
    <div class="card subtle">
      <dl class="kv-list">
        ${kv('ID', p.id)}
        ${kv('Erfasst am', fmtDate(p.erfasstAm))}
      </dl>
    </div>`;
}

function formStammdaten(p) {
  return `<div class="card form-box">
    <div class="card-head"><h3>Grunddaten bearbeiten</h3></div>
    <div class="form-grid">
      ${field({ id: 'f-gemeinde', label: 'Gemeinde', type: 'select', options: [['', 'Gemeinde wählen …'], ...GEMEINDEN], value: p.gemeinde, required: true })}
      ${field({ id: 'f-typ', label: 'Planungstyp', type: 'select', options: PLANUNGSTYPEN, value: p.typ, required: true })}
      ${field({ id: 'f-jahr', label: 'Jahr', type: 'number', value: p.jahr, required: true })}
      ${field({ id: 'f-verantwortlich', label: 'Verantwortliche Person der Gemeinde', value: p.verantwortlichGemeinde, soft: 'nötig für EPA-Start', list: 'dl-kontakte', help: 'Ansprechperson in der Gemeindeverwaltung.' })}
      ${field({ id: 'f-berater', label: 'Berater/in Energieplanung', value: p.berater, soft: 'nötig für EPA-Start', list: 'dl-kontakte', full: true })}
    </div>
    <h4 class="form-section-title">Ziele <span class="optional">optional</span></h4>
    ${field({ id: 'f-z-netto', label: 'Netto-null Ziel', type: 'textarea', rows: 2, value: p.ziele.nettoNull })}
    ${field({ id: 'f-z-effizienz', label: 'Energieeffizienz Ziel', type: 'textarea', rows: 2, value: p.ziele.effizienz })}
    ${field({ id: 'f-z-strom', label: 'Stromproduktion Ziel', type: 'textarea', rows: 2, value: p.ziele.strom })}
    ${datalistKontakte()}
    <div class="form-actions">
      <button class="btn-outline-danger" data-action="delete-planung">${ICON.trash}Energieplanung löschen</button>
      <span class="spacer"></span>
      <button class="btn btn-outline" data-action="cancel-edit">Abbrechen</button>
      <button class="btn btn-primary" data-action="save-stammdaten">Speichern</button>
    </div>
  </div>`;
}

/* ---------------------- TAB 2: EPA-BERATUNG ---------------------- */
const EPA_STUFEN_INFO = {
  'Entwurf': { wer: 'Berater', text: 'Beratung mit der Gemeinde durchführen, den Bedarf klären und die Massnahmen erarbeiten.' },
  'Verabschiedung': { wer: 'Berater', text: 'Der Gemeinderat verabschiedet die Energieplanung mit ihren Massnahmen. Sie erfassen das Datum des Beschlusses.' },
  'Fördergesuch': { wer: 'Berater', text: 'Kontoangaben der Gemeinde erfassen, das Förderabschlussformular erstellen, unterschreiben lassen und hochladen, die Beilagen anfügen und das Gesuch beim Kanton einreichen.' },
  'Abschluss': { wer: 'Controller', text: 'Der Kanton prüft das Gesuch, zahlt den Förderbeitrag aus und schliesst die Beratung ab. Danach beginnt die Nachführung.' },
};
const EPA_WEITER_LABEL = {
  'Entwurf': 'Entwurf abschliessen – weiter zur Verabschiedung',
  'Verabschiedung': 'Verabschiedung bestätigen – weiter zum Fördergesuch',
  'Fördergesuch': 'Fördergesuch beim Kanton einreichen',
};

function epaStufeState(p, i) {
  const e = p.epa;
  const cur = EPA_STUFEN.indexOf(e.status);
  if (e.status === 'Abschluss' || i < cur) return 'done';
  if (i === cur) return e.status === 'Fördergesuch' && e.gesuchEingereichtAm ? 'done' : 'current';
  if (EPA_STUFEN[i] === 'Abschluss' && e.gesuchEingereichtAm) return 'waiting';
  return 'upcoming';
}

function renderTabEpa(p) {
  const e = p.epa;
  if (!e.status) {
    const fs = fehlend(PFLICHT_STAMMDATEN, p);
    if (fs.length) return lockBox('EPA-Beratung noch nicht möglich',
      `Zuerst die Energieplanung vervollständigen. Es fehlen: ${fs.map(f => esc(f[1])).join(', ')}.`,
      `<button class="btn btn-primary" data-action="detail-tab" data-tab="energieplanung">Zur Energieplanung</button>`);
    return `<div class="card intro-card">
      <h3>EPA-Beratung starten</h3>
      <p>In der EPA-Beratung erarbeiten Sie mit der Gemeinde die Massnahmen der Energieplanung. Die Beratung durchläuft vier Phasen – die App führt Sie Schritt für Schritt hindurch:</p>
      <ol class="mini-phases">${EPA_STUFEN.map((s, i) => `<li><span class="mini-nr">${i + 1}</span><div><strong>${s}</strong><span>${esc(EPA_STUFEN_INFO[s].text)}</span></div></li>`).join('')}</ol>
      <button class="btn btn-primary" data-action="epa-start">EPA-Beratung jetzt starten${ICON.arrow}</button>
    </div>`;
  }
  return `<ol class="vstepper">${EPA_STUFEN.map((s, i) => renderEpaStufe(p, s, i)).join('')}</ol>`;
}

function renderEpaStufe(p, s, i) {
  const st = epaStufeState(p, i);
  const info = EPA_STUFEN_INFO[s];
  const editing = state.editing === `epa-${s}`;
  const stLabel = { done: 'Erledigt', current: 'In Bearbeitung', waiting: 'Wartet auf den Kanton', upcoming: 'Ausstehend' }[st];
  let body = '';
  if (s === 'Abschluss') body = epaAbschlussBody(p, st);
  else if (editing) body = epaStufeForm(p, s, 'edit');
  else if (st === 'current') body = epaStufeForm(p, s, 'advance');
  else if (st === 'done') body = epaStufeSummary(p, s);
  return `<li class="vstep vstep-${st}${editing ? ' is-editing' : ''}">
    <div class="vstep-marker">${st === 'done' ? ICON.check : i + 1}</div>
    <div class="vstep-content">
      <div class="vstep-head">
        <div>
          <div class="vstep-title">${s}</div>
          <div class="vstep-meta"><span class="vstep-state">${stLabel}</span> · zuständig: ${WER_LABEL[info.wer]}</div>
        </div>
        ${st === 'done' && !editing && s !== 'Abschluss' ? `<button class="link-btn" data-action="edit" data-section="epa-${s}">${ICON.edit}Ändern</button>` : ''}
      </div>
      ${st !== 'done' || editing ? `<p class="vstep-text">${esc(info.text)}</p>` : ''}
      ${body}
    </div>
  </li>`;
}

function epaStufeFelder(p, s) {
  const e = p.epa;
  if (s === 'Entwurf') {
    const n = p.massnahmen.length;
    return `<div class="form-grid">
      ${field({ id: 'f-beratungsperson', label: 'Beratungsperson', value: e.beratungsperson, required: true, list: 'dl-kontakte' })}
      ${field({ id: 'f-beratungsbeginn', label: 'Datum Beratungsbeginn', type: 'date', value: e.beratungsbeginn, required: true })}
      ${field({ id: 'f-energierichtplan', label: 'Bedarf eines Energierichtplans?', type: 'yesno', value: e.bedarfEnergierichtplan, required: true })}
      ${field({ id: 'f-koordination', label: 'Bedarf einer Koordination mit weiteren Gemeinden?', type: 'yesno', value: e.bedarfKoordination, required: true })}
      ${field({ id: 'f-gebiete', label: 'Gebiete mit Koordinationsbedarf vorhanden?', type: 'yesno', value: e.gebieteKoordination, required: true, full: true })}
    </div>
    <div class="check-item ${n ? 'is-ok' : 'is-missing'}" data-field="massnahmen">
      ${n ? ICON.check : ICON.warn}
      <span><strong>${plural(n, 'Massnahme', 'Massnahmen')} erfasst.</strong> ${n ? '' : 'Für die Verabschiedung braucht es mindestens eine Massnahme.'}</span>
      <button class="link-btn" data-action="detail-tab" data-tab="massnahmen">${n ? 'Massnahmen ansehen' : 'Massnahmen erfassen'}${ICON.arrow}</button>
    </div>
    ${datalistKontakte()}`;
  }
  if (s === 'Verabschiedung') {
    return `<div class="form-grid">
      ${field({ id: 'f-verabschiedet', label: 'Datum der Verabschiedung durch den Gemeinderat', type: 'date', value: e.verabschiedetAm, required: true, help: 'Datum des Gemeinderatsbeschlusses.' })}
    </div>`;
  }
  if (s === 'Fördergesuch') {
    const k = e.konto;
    return `<h4 class="form-section-title">Kontoinformationen für den Förderbeitrag</h4>
    <div class="form-grid">
      ${field({ id: 'f-k-inhaber', label: 'Kontoinhaber/in', value: k.inhaber || `Gemeinde ${p.gemeinde}`, required: true, help: 'Das Konto lautet auf die Gemeinde.' })}
      ${field({ id: 'f-k-adresse', label: 'Adresse', value: k.adresse, required: true })}
      ${field({ id: 'f-k-iban', label: 'IBAN', value: k.iban, required: true, placeholder: 'CH00 0000 0000 0000 0000 0' })}
      ${field({ id: 'f-k-bank', label: 'Bankname', value: k.bank, required: true })}
      ${field({ id: 'f-k-vermerk', label: 'Vermerk', value: k.vermerk })}
    </div>
    ${renderGesuchUnterlagen(p)}`;
  }
  return '';
}

function epaStufeForm(p, s, mode) {
  const actions = mode === 'edit'
    ? `<button class="btn btn-outline" data-action="cancel-edit">Abbrechen</button>
       <button class="btn btn-primary" data-action="epa-save" data-stage="${s}" data-strict="1">Speichern</button>`
    : `<button class="btn btn-outline" data-action="epa-save" data-stage="${s}">Zwischenspeichern</button>
       <button class="btn btn-primary" data-action="epa-save" data-stage="${s}" data-advance="1" data-strict="1">${EPA_WEITER_LABEL[s]}${ICON.arrow}</button>`;
  return `<div class="form-box">${epaStufeFelder(p, s)}<div class="form-actions"><span class="spacer"></span>${actions}</div></div>`;
}

function epaStufeSummary(p, s) {
  const e = p.epa;
  if (s === 'Entwurf') return `<dl class="kv-list compact">
    ${kv('Beratungsperson', e.beratungsperson)}
    ${kv('Datum Beratungsbeginn', fmtDate(e.beratungsbeginn))}
    ${kv('Bedarf Energierichtplan', e.bedarfEnergierichtplan)}
    ${kv('Koordination mit weiteren Gemeinden', e.bedarfKoordination)}
    ${kv('Gebiete mit Koordinationsbedarf', e.gebieteKoordination)}
    ${kv('Massnahmen', plural(p.massnahmen.length, 'Massnahme', 'Massnahmen'))}
  </dl>`;
  if (s === 'Verabschiedung') return `<dl class="kv-list compact">${kv('Verabschiedet am', fmtDate(e.verabschiedetAm))}</dl>`;
  if (s === 'Fördergesuch') return `<dl class="kv-list compact">
    ${kv('Eingereicht am', fmtDate(e.gesuchEingereichtAm))}
    ${kv('Kontoinhaber/in', e.konto.inhaber)}
    ${kv('IBAN', e.konto.iban)}
    ${kv('Bank', e.konto.bank)}
  </dl>
  ${renderGesuchUnterlagen(p, true)}`;
  return '';
}

/* ---------- Unterlagen zum Fördergesuch (Formular + Beilagen) ---------- */
function fmtBytes(n) { return n >= 1048576 ? `${(n / 1048576).toFixed(1).replace('.', ',')} MB` : `${Math.max(1, Math.round(n / 1024))} KB`; }

function docRow(p, d, readonly) {
  const f = p.epa.dokumente[d.key];
  const name = f ? (f.url ? `<a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.name)}</a>` : esc(f.name)) : '';
  const status = f
    ? `<span class="doc-file">${ICON.check}<span class="doc-name">${name}</span><span class="doc-meta">${fmtBytes(f.size)}</span></span>`
    : `<span class="doc-empty">${d.pflicht ? 'fehlt' : 'optional'}</span>`;
  const actions = readonly ? '' : `<span class="doc-actions">
      <label class="btn btn-outline btn-sm doc-upload">${f ? 'Ersetzen' : 'Hochladen'}<input type="file" data-doc="${d.key}" accept="${esc(d.accept || '')}" hidden></label>
      ${f ? `<button type="button" class="link-btn" data-action="doc-remove" data-doc="${d.key}">Entfernen</button>` : ''}
    </span>`;
  return `<div class="doc-row" data-field="f-d-${d.key}">
    <div class="doc-label">${esc(d.label)}${d.pflicht ? '<span class="req" aria-hidden="true">*</span>' : ''}${d.hint && !readonly ? `<span class="doc-hint">${esc(d.hint)}</span>` : ''}</div>
    <div class="doc-status">${status}</div>
    ${actions}
  </div>`;
}

function renderGesuchUnterlagen(p, readonly) {
  const list = `<div class="doc-list">${EPA_DOKUMENTE.map(d => docRow(p, d, readonly)).join('')}</div>`;
  if (readonly) return `<h4 class="form-section-title">Unterlagen</h4>${list}`;
  return `<h4 class="form-section-title">Unterlagen zum Gesuch</h4>
    <div class="doc-intro">
      <span>Förderabschlussformular erstellen, von Berater/in und Gemeinderat unterschreiben lassen und unten als PDF hochladen.</span>
      <button type="button" class="btn btn-outline btn-sm" data-action="formular-open">Formular erstellen</button>
    </div>${list}`;
}

function keepScroll(fn) {
  const saved = [];
  for (let n = $panel; n; n = n.parentElement) saved.push([n, n.scrollTop]);
  fn();
  saved.forEach(([n, t]) => { n.scrollTop = t; });
}

// Erfasste, aber noch nicht gespeicherte Formularwerte sichern, bevor neu gerendert wird.
function saveGesuchDraft(p) { if (document.getElementById('f-k-iban')) Object.assign(p.epa, readEpaStage('Fördergesuch')); }

function docUpload(input) {
  const p = currentPlanung(), file = input.files[0];
  if (!file) return;
  const key = input.dataset.doc, def = EPA_DOKUMENTE.find(d => d.key === key);
  if (key === 'formular' && !/\.pdf$/i.test(file.name)) { toast('Das unterschriebene Formular muss als PDF hochgeladen werden.'); input.value = ''; return; }
  saveGesuchDraft(p);
  const old = p.epa.dokumente[key];
  if (old && old.url) URL.revokeObjectURL(old.url);
  p.epa.dokumente[key] = { name: file.name, size: file.size, datum: todayIso(), url: URL.createObjectURL(file) };
  toast(`«${def.label}» hochgeladen.`);
  keepScroll(render);
}

function removeDoc(key) {
  const p = currentPlanung(), old = p.epa.dokumente[key];
  if (!old) return;
  saveGesuchDraft(p);
  if (old.url) URL.revokeObjectURL(old.url);
  delete p.epa.dokumente[key];
  keepScroll(render);
}

/* ---------- Förderabschlussformular (druckbare Vorlage) ---------- */
function formularHtml(p) {
  const e = p.epa, k = e.konto;
  const jn = v => `<span>${v === 'Ja' ? '☒' : '☐'} Ja</span> <span>${v === 'Nein' ? '☒' : '☐'} Nein</span>`;
  const mass = p.massnahmen.slice().sort((a, b) => (a.esNr || '').localeCompare(b.esNr || '', 'de', { numeric: true }));
  const beilagen = [['Kick-Off Präsentation', 1], ['Abschlusspräsentation', 1], ['Beratungscheckliste (für zertifizierte Energiestädte optional)', e.dokumente.checkliste ? 1 : 0], ['Ausgefülltes Feedbackformular', 1], ['Kopie Rechnung Beratungsbüro', 1]];
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Förderabschlussformular ${esc(p.gemeinde)}</title><style>
    @page{size:A4; margin:18mm 20mm}
    body{font:11pt/1.4 "Segoe UI",Arial,sans-serif; color:#111; margin:0}
    .bar{background:#f4f6f8; padding:8px 20px; text-align:right} .bar button{font:inherit; padding:6px 14px; cursor:pointer}
    .page{max-width:170mm; margin:0 auto; padding:10mm 0}
    .logo{display:flex; align-items:center; gap:14px; font-size:20pt; line-height:1.05; letter-spacing:.5px} .logo i{display:block; width:12mm; height:16mm; background:#009fe3}
    .dept{margin:10px 0 28px; font-size:10.5pt}
    h1{font-size:22pt; line-height:1.15; margin:0 0 16px} h2{font-size:18pt; margin:26px 0 8px}
    .box{background:#dbe5f1; padding:6px 10px} .box table{width:100%} .box td:last-child{text-align:right}
    table.m{width:100%; border-collapse:collapse; margin-top:10px} table.m th{text-align:left; border-bottom:2px solid #111; padding:4px 6px}
    table.m td{padding:6px; border-bottom:1px solid #111} table.m tr:nth-child(odd) td{background:#dbe5f1}
    .row{display:flex; justify-content:space-between; padding:2px 0} .k td{padding:1px 14px 1px 0}
    .sig{display:flex; gap:12px} .sig>div{flex:1} .sig .line{height:22mm; background:#dbe5f1; border-bottom:1px solid #ccc; margin-top:8px}
    .sig .cap{background:#dbe5f1; font-size:9.5pt; padding:2px 6px; min-height:9mm}
    ul.b{list-style:none; padding:0; columns:2} ul.b li{margin-bottom:4px} ul.b li::before{content:"x "; font-weight:700}
    .pb{page-break-before:always} @media print{.bar{display:none}}
  </style></head><body>
  <div class="bar"><button onclick="window.print()">Drucken / Als PDF speichern</button></div>
  <div class="page">
    <div class="logo"><i></i><div>KANTON<br><b>LUZERN</b></div></div>
    <div class="dept">Bau-, Umwelt- und Wirtschaftsdepartement<br><b>Umwelt und Energie (uwe)<br>Energie</b></div>
    <h1>Förderabschlussformular:<br>Energiepotenzialanalyse für Gemeinden<br>(EPA-Beratung)</h1>
    <div class="box"><table><tr><td><b>Gemeinde:</b></td><td>${esc(p.gemeinde)}</td></tr><tr><td><b>Energieplanung:</b></td><td>Energieplanung ${esc(p.gemeinde)}</td></tr></table></div>
    <p>Dieses Dokument bestätigt die Durchführung der EPA-Beratung gemäss den Förderbedingungen und Qualitätsvorgaben des Kantons Luzern. Der Gemeinderat bezeugt die Kenntnisnahme der Massnahmen (vgl. Punkt 1) sowie des Bedarfs einer räumlichen Abstimmung (vgl. Punkt 2) und bestätigt die kontinuierliche Umsetzung und Nachführung der Massnahmen. Die Nachführung der Massnahmen soll in einem Turnus von vier Jahren erfolgen. Bei Energiestädten ist dieser abgestimmt mit dem Zeitpunkt der Re-Audits.<br>
    Das unterzeichnete Formular ist Bedingung für die Auszahlung der Fördergelder in Höhe von CHF 7’200.- und ist mit den vollständigen Beratungsunterlagen (vgl. Punkt 4) per E-Mail dem Kanton Luzern, Dienststelle Umwelt und Energie (uwe), Clara Bucher, Energieplanung.UWE@lu.ch zuzustellen.</p>
    <div class="pb"></div>
    <h2>1 Massnahmenprogramm</h2>
    <p>Nachfolgende Massnahmen wurden im Rahmen der EPA-Beratung beschlossen bzw. von bereits laufenden Programmen übernommen.</p>
    <table class="m"><tr><th>ES-Nr.</th><th>Nr.</th><th>Massnahme</th><th>Beschreibung</th></tr>
      ${mass.map(m => `<tr><td>${esc(m.esNr)}</td><td>${esc(m.id.replace(/^M-/, ''))}</td><td>${esc(m.name)}</td><td>${esc(m.beschreibung)}</td></tr>`).join('') || '<tr><td colspan="4">Keine Massnahmen erfasst.</td></tr>'}
    </table>
    <h2>2 Bedarf räumlicher Abstimmung</h2>
    <p>In der EPA-Beratung soll der Bedarf eines Energierichtplans (§ 5 Abs. 2 KEnG), der Bedarf einer Koordination mit weiteren Gemeinden (§ 5 Abs. 3 KEnG) sowie allfällige Gebiet mit Koordinationsbedarf (z. B. Lärmproblematik in dicht bebauten Gebieten) geklärt werden.</p>
    <p>Der / die EPA-Berater/in beurteilt den Bedarf räumlicher Abstimmung wie folgt:</p>
    <div class="box">
      <div class="row"><span>Bedarf eines Energierichtplans?</span><span>${jn(e.bedarfEnergierichtplan)}</span></div>
      <div class="row"><span>Bedarf einer Koordination mit weiteren Gemeinde(n)?</span><span>${jn(e.bedarfKoordination)}</span></div>
      <div class="row"><span>Gebiete mit Koordinationsbedarf vorhanden?</span><span>${jn(e.gebieteKoordination)}</span></div>
    </div>
    <h2>3 Kontoinformationen</h2>
    <p>Bitte teilen Sie uns mit untenstehendem Formular Ihre Kontoinformationen mit, damit die Zahlung des Förderbeitrags ausgelöst werden kann.</p>
    <div class="box"><table class="k"><tr><td>Name</td><td>${esc(k.inhaber)}</td></tr><tr><td>Adresse</td><td>${esc(k.adresse)}</td></tr><tr><td>IBAN</td><td>${esc(k.iban)}</td></tr><tr><td>Bank</td><td>${esc(k.bank)}</td></tr><tr><td>Vermerk</td><td>${esc(k.vermerk)}</td></tr></table></div>
    <div class="pb"></div>
    <h2>4 Bestätigung</h2>
    <div class="sig">
      <div><b>EPA-Berater/in</b><p>Der / die EPA-Berater/in bestätigt hiermit, die EPA-Beratung gemäss den aktuellen Förderbedingungen und gemäss den Qualitätsanforderungen des Pflichtenhefts durchgeführt zu haben.</p><div class="line"></div><div class="cap">${esc(e.beratungsperson || p.berater)}<br>Ort, Datum:</div></div>
      <div><b>Gemeinderat</b><p>Der Gemeinderat bestätigt hiermit, die vorgeschlagenen Massnahmen kontinuierlich umzusetzen und den Umsetzungsstatus im Energieplanungs-Modul nachzuführen.</p><div class="line"></div><div class="cap"><br>Ort, Datum:</div></div>
    </div>
    <h2>5 Beilagen</h2>
    <ul class="b">${beilagen.filter(b => b[1]).map(b => `<li>${esc(b[0])}</li>`).join('')}</ul>
  </div></body></html>`;
}


function epaAbschlussBody(p, st) {
  const e = p.epa;
  if (st === 'done') {
    const first = addYears(fromIso(e.abgeschlossenAm), NACHFUEHRUNG_INTERVALL_JAHRE);
    return `<dl class="kv-list compact">
      ${kv('Abgeschlossen am', fmtDate(e.abgeschlossenAm))}
      ${kv('Erste Nachführung fällig', fmtDate(toIso(first)))}
    </dl>
    <button class="link-btn" data-action="detail-tab" data-tab="nachfuehrung">Zur Nachführung${ICON.arrow}</button>`;
  }
  if (st === 'waiting') {
    return `<div class="info-box tone-wait">${ICON.clock}<div>Das Gesuch wurde am <strong>${fmtDate(e.gesuchEingereichtAm)}</strong> eingereicht und liegt beim Kanton. Sie werden informiert, sobald die Beratung abgeschlossen ist.
      ${state.role === 'Controller' ? `<div class="info-box-actions"><button class="btn btn-primary btn-sm" data-action="detail-tab" data-tab="foerderung">Gesuch jetzt prüfen${ICON.arrow}</button></div>` : ''}</div></div>`;
  }
  return '';
}

function readEpaStage(s) {
  if (s === 'Entwurf') return {
    beratungsperson: readField('f-beratungsperson'), beratungsbeginn: readField('f-beratungsbeginn'),
    bedarfEnergierichtplan: readField('f-energierichtplan'), bedarfKoordination: readField('f-koordination'),
    gebieteKoordination: readField('f-gebiete')
  };
  if (s === 'Verabschiedung') return { verabschiedetAm: readField('f-verabschiedet') };
  if (s === 'Fördergesuch') return {
    konto: { inhaber: readField('f-k-inhaber'), adresse: readField('f-k-adresse'), iban: readField('f-k-iban'), bank: readField('f-k-bank'), vermerk: readField('f-k-vermerk') }
  };
  return {};
}

/* ---------------------- TAB 3: FÖRDERUNG (Controlling) ---------------------- */
function vorschlagGesuchsNr(jahr) { return `${jahr}${String((gesuchsLaufNr[jahr] || 0) + 1).padStart(3, '0')}`; }

function renderTabFoerderung(p) {
  const e = p.epa;
  if (!e.gesuchEingereichtAm) {
    return lockBox('Noch kein Fördergesuch eingereicht',
      'Das Fördergesuch wird in der EPA-Beratung (Phase «Fördergesuch») von der Berater/in eingereicht. Danach prüft der Kanton hier das Gesuch, erfasst die Auszahlung und schliesst die Beratung ab.',
      `<button class="btn btn-outline" data-action="detail-tab" data-tab="epa">Zur EPA-Beratung</button>`);
  }
  const ctrlKomplett = fehlend(PFLICHT_CONTROLLING, p).length === 0;
  const abgeschl = e.status === 'Abschluss';
  const timeline = `<ol class="mini-timeline">
    <li class="done"><span class="mt-dot">${ICON.check}</span><div><strong>Gesuch eingereicht</strong><span>${fmtDate(e.gesuchEingereichtAm)} · durch ${show(p.berater)}</span></div></li>
    <li class="${ctrlKomplett ? 'done' : 'current'}"><span class="mt-dot">${ctrlKomplett ? ICON.check : ''}</span><div><strong>Gesuch geprüft, Auszahlung erfasst</strong><span>${ctrlKomplett ? `${formatChf(p.controlling.auszahlungsbetrag)} · Eingang ${fmtDate(p.controlling.gesuchseingang)}` : 'In Prüfung beim Kanton'}</span></div></li>
    <li class="${abgeschl ? 'done' : ctrlKomplett ? 'current' : ''}"><span class="mt-dot">${abgeschl ? ICON.check : ''}</span><div><strong>EPA-Beratung abgeschlossen</strong><span>${abgeschl ? fmtDate(e.abgeschlossenAm) : 'Ausstehend'}</span></div></li>
  </ol>
  <div class="card"><div class="card-head"><h3>Eingereichte Unterlagen</h3></div>
    <div class="doc-list">${EPA_DOKUMENTE.map(d => docRow(p, d, true)).join('')}</div></div>`;

  if (state.role !== 'Controller') {
    return `${timeline}
      <div class="card">
        <div class="card-head"><h3>Förderbeitrag</h3></div>
        <dl class="kv-list">
          ${kv('Auszahlungsbetrag', ctrlKomplett ? formatChf(p.controlling.auszahlungsbetrag) : '')}
          ${kv('Gesuchseingang beim Kanton', fmtDate(p.controlling.gesuchseingang))}
        </dl>
        <p class="hint">${ICON.info}Die Prüfung erfolgt durch den Kanton (Rolle Controller). Interne Angaben wie Gesuchs-Nr. und Kommentar sind nur dort sichtbar.</p>
      </div>`;
  }

  const showForm = state.editing === 'controlling' || !abgeschl;
  return `${timeline}${showForm ? formControlling(p) : viewControlling(p)}`;
}

function formControlling(p) {
  const e = p.epa, c = p.controlling;
  const eingang = c.gesuchseingang || e.gesuchEingereichtAm;
  const jahr = fromIso(eingang).getFullYear();
  const abgeschl = e.status === 'Abschluss';
  return `<div class="card form-box">
    <div class="card-head"><h3>Fördergesuch prüfen <span class="badge-intern">intern</span></h3></div>
    <div class="context-box">
      <div class="context-title">Angaben aus dem Gesuch</div>
      <dl class="kv-list compact">
        ${kv('Kontoinhaber/in', e.konto.inhaber)}
        ${kv('IBAN', e.konto.iban)}
        ${kv('Bank', e.konto.bank)}
        ${kv('Vermerk', e.konto.vermerk)}
        ${kv('Massnahmen', plural(p.massnahmen.length, 'Massnahme', 'Massnahmen'))}
      </dl>
    </div>
    <div class="form-grid">
      ${field({ id: 'f-c-eingang', label: 'Gesuchseingang', type: 'date', value: eingang, required: true })}
      ${field({ id: 'f-c-nr', label: 'Gesuchs-Nr.', value: c.gesuchsNr || vorschlagGesuchsNr(jahr), help: 'Vorschlag: Jahr + laufende Nummer.' })}
      ${field({ id: 'f-c-betrag', label: 'Auszahlungsbetrag (CHF)', type: 'number', value: c.auszahlungsbetrag || 7200, required: true, help: 'Standardbeitrag: CHF 7\'200.' })}
      ${field({ id: 'f-c-energiestadt', label: 'Ist die Gemeinde Energiestadt?', type: 'yesno', value: c.energiestadt, required: true })}
      ${field({ id: 'f-c-kommentar', label: 'Kommentar (intern)', type: 'textarea', value: c.kommentar, full: true, placeholder: 'Interne Notizen zum Gesuch …' })}
    </div>
    <div class="form-actions"><span class="spacer"></span>
      ${abgeschl
        ? `<button class="btn btn-outline" data-action="cancel-edit">Abbrechen</button>
           <button class="btn btn-primary" data-action="ctrl-save" data-strict="1">Speichern</button>`
        : `<button class="btn btn-outline" data-action="ctrl-save">Speichern</button>
           <button class="btn btn-primary" data-action="ctrl-save" data-close="1" data-strict="1">Speichern & EPA-Beratung abschliessen${ICON.arrow}</button>`}
    </div>
  </div>`;
}

function viewControlling(p) {
  const c = p.controlling;
  return `<div class="card">
    <div class="card-head"><h3>Fördergesuch <span class="badge-intern">intern</span></h3><button class="btn btn-outline btn-sm" data-action="edit" data-section="controlling">${ICON.edit}Bearbeiten</button></div>
    <dl class="kv-list">
      ${kv('Gesuchseingang', fmtDate(c.gesuchseingang))}
      ${kv('Gesuchs-Nr.', c.gesuchsNr)}
      ${kv('Auszahlungsbetrag', formatChf(c.auszahlungsbetrag))}
      ${kv('Energiestadt', c.energiestadt)}
      ${kv('Kommentar', c.kommentar)}
    </dl>
  </div>`;
}

/* ---------------------- TAB: MASSNAHMEN ---------------------- */
const MASS_FILTER = [
  ['offen', 'In Arbeit', m => m.status === 'Geplant' || m.status === 'In Umsetzung'],
  ['Sistiert', 'Sistiert', m => m.status === 'Sistiert'],
  ['Erledigt', 'Erledigt', m => m.status === 'Erledigt'],
  ['Gestrichen', 'Gestrichen', m => m.status === 'Gestrichen'],
  ['alle', 'Alle', () => true],
];

function renderTabMassnahmen(p) {
  const lauf = p.laufendeNachfuehrung;
  return `
    ${lauf ? `<div class="info-box tone-warn">${ICON.refresh}<div><strong>Die Nachführung läuft.</strong> Die Überprüfung der Massnahmen erfolgt geführt im Tab «Nachführung».
      <div class="info-box-actions"><button class="btn btn-primary btn-sm" data-action="detail-tab" data-tab="nachfuehrung">Zur Nachführung${ICON.arrow}</button></div></div></div>` : ''}
    ${p.epa.status === 'Entwurf' ? `<div class="info-box">${ICON.info}<div>Erfassen Sie hier die Massnahmen, die in der EPA-Beratung erarbeitet werden. Für die Verabschiedung braucht es mindestens eine Massnahme.</div></div>` : ''}
    <div class="toolbar">
      <button class="btn btn-primary" data-action="new-massnahme">${ICON.plus}Massnahme erfassen</button>
      <div class="search-input-wrap">
        <input type="search" id="mass-search" placeholder="Massnahme oder ES-Nr. suchen …" value="${esc(state.mass.search)}" aria-label="Massnahmen durchsuchen">
        ${ICON.search}
      </div>
    </div>
    <div class="chip-row" role="group" aria-label="Nach Status filtern">
      ${MASS_FILTER.map(([k, l, fn]) => `<button class="chip${state.mass.filter === k ? ' active' : ''}" data-action="mass-filter" data-filter="${k}">${l}<span class="chip-count">${p.massnahmen.filter(fn).length}</span></button>`).join('')}
    </div>
    <div id="mass-results">${renderMassResults(p)}</div>`;
}

function renderMassResults(p) {
  const fn = (MASS_FILTER.find(f => f[0] === state.mass.filter) || MASS_FILTER[4])[2];
  const q = state.mass.search.trim().toLowerCase();
  const list = p.massnahmen.filter(fn).filter(m => !q || m.name.toLowerCase().includes(q) || (m.esNr || '').includes(q));
  if (!list.length) return `<div class="empty-state">${p.massnahmen.length ? 'Keine Massnahmen in dieser Ansicht.' : 'Noch keine Massnahmen erfasst.'}</div>`;
  return `<ul class="mass-list">${list.map(m => `<li>
    <button class="mass-item" data-action="open-massnahme" data-id="${m.id}">
      <span class="mass-main">
        <span class="mass-name">${esc(m.name)}</span>
        <span class="mass-meta">${m.esNr ? `ES-Nr. ${esc(m.esNr)} · ` : ''}${esc(m.handlungsfeld)}</span>
        ${m.bemerkung ? `<span class="mass-note">${esc(m.bemerkung)}</span>` : ''}
      </span>
      <span class="mass-side">
        ${statusPill(m.status)}
        <span class="mass-review">${reviewLabel(p, m)}</span>
      </span>
    </button>
  </li>`).join('')}</ul>`;
}

function reviewLabel(p, m) {
  const last = letztePruefung(m);
  const next = naechstePruefungMassnahme(p, m);
  const parts = [];
  if (last) parts.push(`Überprüft ${fmtDate(last.datum)}`);
  if (!istOffen(m)) parts.push('Keine weitere Überprüfung');
  else if (next) parts.push(TODAY >= next ? `<span class="warn-text">Überprüfung fällig</span>` : `Nächste Überprüfung ${next.getFullYear()}`);
  else if (p.epa.status !== 'Abschluss') parts.push('Überprüfung ab Abschluss der EPA');
  return parts.join(' · ');
}

/* ---------------------- TAB 4: NACHFÜHRUNG ---------------------- */
function renderTabNachfuehrung(p) {
  if (p.epa.status !== 'Abschluss') {
    return lockBox('Die Nachführung beginnt nach Abschluss der EPA-Beratung',
      `Sobald der Kanton die EPA-Beratung abgeschlossen hat, überprüfen Sie alle ${NACHFUEHRUNG_INTERVALL_JAHRE} Jahre – bis ${NACHFUEHRUNG_ENDE_JAHR} – jede offene Massnahme. Die App erinnert Sie rechtzeitig.`) + renderNfHowto();
  }
  return `${renderNfErfolg(p)}${renderZyklus(p)}${p.laufendeNachfuehrung ? renderReview(p) : renderNfStatus(p)}${renderNfHistory(p)}`;
}

function renderNfHowto() {
  return `<div class="nf-howto">
    <div class="nf-howto-title">So funktioniert die Nachführung</div>
    <ol>
      <li><strong>Jede offene Massnahme prüfen:</strong> Wie ist der aktuelle Stand?</li>
      <li><strong>Entscheiden:</strong> Wird sie weitergeführt – oder ist sie erledigt, sistiert oder gestrichen?</li>
      <li><strong>Kurz festhalten,</strong> was erreicht wurde und wie es weitergeht.</li>
      <li><strong>Neue Massnahmen</strong> bei Bedarf ergänzen – und die Nachführung abschliessen.</li>
    </ol>
    <p class="muted">Das Datum jeder Überprüfung wird gespeichert. Offene Massnahmen werden ${NACHFUEHRUNG_INTERVALL_JAHRE} Jahre später automatisch wieder zur Überprüfung vorgelegt.</p>
  </div>`;
}

function renderNfErfolg(p) {
  const last = p.nachfuehrungen[p.nachfuehrungen.length - 1];
  if (!last || last.abgeschlossenAm !== todayIso() || p.laufendeNachfuehrung) return '';
  const due = naechsteNachfuehrung(p);
  return `<div class="success-box">${ICON.check}<div>
    <strong>Nachführung ${last.jahr} abgeschlossen.</strong>
    <div>${plural(last.geprueft, 'Massnahme', 'Massnahmen')} überprüft${last.neu ? `, ${last.neu} neu erfasst` : ''}. ${due ? `Die nächste Nachführung ist am <strong>${fmtDate(toIso(due))}</strong> fällig – die App erinnert Sie daran.` : `Damit ist die Nachführungspflicht bis ${NACHFUEHRUNG_ENDE_JAHR} erfüllt.`}</div>
  </div></div>`;
}

function renderZyklus(p) {
  const items = [{ cls: 'done', jahr: fromIso(p.epa.abgeschlossenAm).getFullYear(), text: 'EPA abgeschlossen' }];
  p.nachfuehrungen.forEach(n => items.push({ cls: 'done', jahr: n.jahr, text: `Erledigt ${fmtDate(n.abgeschlossenAm)}` }));
  const st = nachfuehrungStatus(p);
  kuenftigeNachfuehrungsJahre(p).forEach((j, i) => items.push(i === 0
    ? { cls: p.laufendeNachfuehrung ? 'current' : st === 'faellig' ? 'warn' : 'next', jahr: j, text: p.laufendeNachfuehrung ? 'Läuft' : st === 'faellig' ? 'Fällig' : 'Nächste' }
    : { cls: 'future', jahr: j, text: 'Geplant' }));
  return `<div class="card">
    <div class="card-head"><h3>Nachführungs-Rhythmus</h3><span class="muted">alle ${NACHFUEHRUNG_INTERVALL_JAHRE} Jahre bis ${NACHFUEHRUNG_ENDE_JAHR}</span></div>
    <ol class="cycle">${items.map(it => `<li class="cycle-item ${it.cls}"><span class="cycle-dot">${it.cls === 'done' ? ICON.check : ''}</span><span class="cycle-year">${it.jahr}</span><span class="cycle-text">${esc(it.text)}</span></li>`).join('')}</ol>
  </div>`;
}

function renderNfStatus(p) {
  const st = nachfuehrungStatus(p);
  if (st === 'ende') return `<div class="info-box tone-ok">${ICON.check}<div>Die Nachführungen bis ${NACHFUEHRUNG_ENDE_JAHR} sind abgeschlossen. Es ist keine weitere Überprüfung vorgesehen.</div></div>`;
  const due = naechsteNachfuehrung(p);
  const offen = p.massnahmen.filter(istOffen).length;
  const titel = st === 'faellig' ? `Nachführung ${due.getFullYear()} ist fällig`
    : st === 'bald' ? `Nachführung ${due.getFullYear()} steht bald an` : `Nächste Nachführung: ${due.getFullYear()}`;
  return `<div class="card nf-start tone-${st}">
    <div class="nf-start-head">
      <div>
        <h3>${titel}</h3>
        <p>${st === 'faellig' ? `Fällig seit ${fmtDate(toIso(due))}.` : `Fällig am ${fmtDate(toIso(due))}.`} ${plural(offen, 'offene Massnahme wird', 'offene Massnahmen werden')} überprüft.</p>
      </div>
      <button class="btn ${st === 'ok' ? 'btn-outline' : 'btn-primary'}" data-action="nf-start">${st === 'ok' ? 'Vorzeitig starten' : `Nachführung ${due.getFullYear()} starten`}${ICON.arrow}</button>
    </div>
    ${renderNfHowto()}
  </div>`;
}

function reviewItems(p) {
  const lauf = p.laufendeNachfuehrung;
  return lauf.zuPruefen.concat(lauf.neu).map(id => p.massnahmen.find(m => m.id === id)).filter(Boolean);
}
function isReviewed(p, m) {
  const lauf = p.laufendeNachfuehrung;
  return lauf.geprueft.includes(m.id) || lauf.neu.includes(m.id);
}

function renderReview(p) {
  const lauf = p.laufendeNachfuehrung;
  const items = reviewItems(p);
  const total = items.length;
  const doneN = items.filter(m => isReviewed(p, m)).length;
  const allDone = doneN === total;
  const pct = total ? Math.round(doneN / total * 100) : 100;
  const sel = items.find(m => m.id === state.reviewId) || items.find(m => !isReviewed(p, m)) || items[0];
  if (sel) state.reviewId = sel.id;
  const nextDue = addYears(TODAY, NACHFUEHRUNG_INTERVALL_JAHRE);
  return `<div class="card review">
    <div class="review-head">
      <div>
        <h3>Nachführung ${fromIso(lauf.faelligAm).getFullYear()}</h3>
        <div class="muted">Gestartet am ${fmtDate(lauf.gestartetAm)} · Ihr Fortschritt wird laufend gespeichert</div>
      </div>
      <button class="btn btn-outline btn-sm" data-action="new-massnahme">${ICON.plus}Neue Massnahme</button>
    </div>
    <div class="progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar" style="width:${pct}%"></div></div>
    <div class="progress-label"><strong>${doneN} von ${total}</strong> Massnahmen überprüft</div>

    ${allDone ? `<div class="review-done">${ICON.check}<div><strong>${total ? 'Alle Massnahmen sind überprüft.' : 'Es gibt keine offenen Massnahmen zu überprüfen.'}</strong>
      <div>Schliessen Sie die Nachführung ab. Die nächste Nachführung ist dann ${nextDue.getFullYear() > NACHFUEHRUNG_ENDE_JAHR ? 'nicht mehr nötig' : `am ${fmtDate(toIso(nextDue))} fällig`}.</div></div>
      <button class="btn btn-primary" data-action="nf-finish">Nachführung abschliessen</button></div>` : ''}

    ${total ? `<div class="review-layout">
      <ol class="review-list">
        ${items.map((m, i) => `<li><button class="review-item${sel && m.id === sel.id ? ' active' : ''}${isReviewed(p, m) ? ' is-done' : ''}" data-action="nf-select" data-id="${m.id}">
          <span class="review-mark">${isReviewed(p, m) ? ICON.check : i + 1}</span>
          <span class="review-item-name">${esc(m.name)}</span>
          ${lauf.neu.includes(m.id) ? '<span class="tag">neu</span>' : ''}
        </button></li>`).join('')}
      </ol>
      <div class="review-card" id="review-card">${sel ? reviewCard(p, sel, items.indexOf(sel), total) : ''}</div>
    </div>` : ''}

    ${!allDone ? `<div class="review-foot"><span class="muted">Noch ${total - doneN} offen</span><button class="btn btn-outline" data-action="nf-finish">Nachführung abschliessen</button></div>` : ''}
  </div>`;
}

function reviewCard(p, m, idx, total) {
  const lauf = p.laufendeNachfuehrung;
  const reviewed = lauf.geprueft.includes(m.id);
  const isNeu = lauf.neu.includes(m.id);
  const last = letztePruefung(m);
  const head = `<div class="review-eyebrow">Massnahme ${idx + 1} von ${total}${m.esNr ? ` · ES-Nr. ${esc(m.esNr)}` : ''}</div>
    <h3 class="review-title">${esc(m.name)}</h3>
    <div class="review-meta">${esc(m.handlungsfeld)} · ${esc(m.aktivitaetsbereich)}</div>
    <p class="review-desc">${esc(m.beschreibung)}</p>`;

  if (isNeu) {
    return `${head}
      <div class="reviewed-badge">${ICON.check}Neu erfasst in dieser Nachführung · Status: ${esc(m.status)}</div>
      <div class="review-actions">
        <button class="btn btn-outline" data-action="nf-nav" data-dir="-1"${idx === 0 ? ' disabled' : ''}>Zurück</button>
        <button class="btn btn-outline" data-action="open-massnahme" data-id="${m.id}">${ICON.edit}Bearbeiten</button>
      </div>`;
  }

  const prev = reviewed ? m.pruefungen[m.pruefungen.length - 2] : last;
  const cur = { status: m.status, weiter: m.weiterfuehren, bem: reviewed ? m.bemerkung : '' };
  const closed = isClosedStatus(cur.status);
  const prevText = prev ? prev.bemerkung : m.bemerkung;
  const next = naechstePruefungMassnahme(p, m);
  return `${head}
    <div class="prev-box">
      <div class="prev-title">Bisheriger Stand ${prev ? `· überprüft am ${fmtDate(prev.datum)}` : '· aus der EPA-Beratung'}</div>
      <div class="prev-status">${statusPill(prev ? prev.status : m.status)}<span>Weiterführen: ${esc((prev ? prev.weiterfuehren : m.weiterfuehren) || '–')}</span></div>
      <div class="prev-text">${show(prevText, 'Keine Bemerkung erfasst')}</div>
    </div>
    ${reviewed ? `<div class="reviewed-badge">${ICON.check}Überprüft am ${fmtDate(last.datum)} · ${next ? `nächste Überprüfung ${next.getFullYear()}` : 'keine weitere Überprüfung nötig'}</div>` : ''}
    <div class="review-form form-box">
      <fieldset class="q" data-field="nf-status">
        <legend><span class="q-nr">1</span>Wie ist der aktuelle Stand?</legend>
        <div class="option-grid">
          ${MASSNAHME_STATUS.map(s => `<label class="option">
            <input type="radio" name="nf-status" value="${s.id}"${cur.status === s.id ? ' checked' : ''}>
            <span class="option-body"><span class="option-title">${s.id}</span><span class="option-hint">${s.hint}</span></span>
          </label>`).join('')}
        </div>
      </fieldset>
      <fieldset class="q" data-field="nf-weiter" data-depends-on-status${closed ? ' hidden' : ''}>
        <legend><span class="q-nr">2</span>Wird die Massnahme weitergeführt?</legend>
        ${segmented('nf-weiter', cur.weiter)}
      </fieldset>
      <div class="q-note" data-closed-note${closed ? '' : ' hidden'}>${ICON.info}Erledigte und gestrichene Massnahmen werden nicht weitergeführt und künftig nicht mehr überprüft.</div>
      <div class="q" data-field="nf-bemerkung">
        <label class="q-label" for="nf-bemerkung"><span class="q-nr">3</span>Bemerkungen / aktueller Stand<span class="req">*</span></label>
        <textarea id="nf-bemerkung" rows="3" placeholder="Was wurde seit der letzten Überprüfung erreicht? Wie geht es weiter?">${esc(cur.bem)}</textarea>
        ${!reviewed && prevText ? `<button type="button" class="link-btn" data-action="nf-copy-prev" data-text="${esc(prevText)}">Bisherige Bemerkung übernehmen</button>` : ''}
      </div>
    </div>
    <div class="review-actions">
      <button class="btn btn-outline" data-action="nf-nav" data-dir="-1"${idx === 0 ? ' disabled' : ''}>Zurück</button>
      <button class="btn btn-primary" data-action="nf-save" data-id="${m.id}">${reviewed ? 'Änderungen speichern' : 'Als überprüft markieren'} & weiter${ICON.arrow}</button>
    </div>`;
}

function renderNfHistory(p) {
  if (!p.nachfuehrungen.length) return '';
  return `<div class="card">
    <div class="card-head"><h3>Bisherige Nachführungen</h3></div>
    <div class="table-scroll"><table class="data-table">
      <thead><tr><th>Nachführung</th><th>Fällig am</th><th>Abgeschlossen am</th><th>Überprüft</th><th>Neu</th><th>Erledigt</th><th>Sistiert</th><th>Gestrichen</th></tr></thead>
      <tbody>${p.nachfuehrungen.slice().reverse().map(n => `<tr>
        <td><strong>${n.jahr}</strong></td><td>${fmtDate(n.faelligAm)}</td><td>${fmtDate(n.abgeschlossenAm)}</td>
        <td>${n.geprueft}</td><td>${n.neu}</td><td>${n.erledigt}</td><td>${n.sistiert}</td><td>${n.gestrichen}</td>
      </tr>`).join('')}</tbody>
    </table></div>
  </div>`;
}

/* =============================================================
   DRAWER (Massnahme, neue Energieplanung, Kontakt)
   ============================================================= */
function renderDrawer() {
  const root = document.getElementById('drawer-root');
  const d = state.drawer;
  if (!d) { root.innerHTML = ''; document.body.classList.remove('drawer-open'); return; }
  let html = '';
  if (d.type === 'massnahme') {
    const p = currentPlanung();
    const m = d.id ? p.massnahmen.find(x => x.id === d.id) : null;
    html = d.mode === 'view' && m ? drawerMassnahmeView(p, m) : drawerMassnahmeForm(p, m);
  } else if (d.type === 'neuePlanung') {
    html = drawerNeuePlanung();
  } else if (d.type === 'kontakt') {
    html = drawerKontakt(d.id);
  }
  root.innerHTML = `<div class="drawer-backdrop" data-action="close-drawer"></div>
    <aside class="drawer" role="dialog" aria-modal="true">${html}</aside>`;
  document.body.classList.add('drawer-open');
}

function drawerHead(eyebrow, title) {
  return `<div class="drawer-head">
    <div>${eyebrow ? `<div class="drawer-eyebrow">${eyebrow}</div>` : ''}<h2>${esc(title)}</h2></div>
    <button class="icon-close" data-action="close-drawer" title="Schliessen" aria-label="Schliessen">${ICON.close}</button>
  </div>`;
}

function drawerMassnahmeView(p, m) {
  const last = letztePruefung(m);
  const next = naechstePruefungMassnahme(p, m);
  const pruefText = !istOffen(m)
    ? `Diese Massnahme ist ${m.status.toLowerCase()} und wird nicht mehr überprüft.`
    : p.epa.status !== 'Abschluss' ? 'Die erste Überprüfung erfolgt mit der Nachführung nach Abschluss der EPA-Beratung.'
    : `${last ? `Zuletzt überprüft am ${fmtDate(last.datum)}. ` : ''}${next ? `Nächste Überprüfung: ${TODAY >= next ? 'fällig' : fmtDate(toIso(next))}.` : ''}`;
  return `${drawerHead(`${esc(m.id)}${m.esNr ? ` · ES-Nr. ${esc(m.esNr)}` : ''}`, m.name)}
  <div class="drawer-body">
    <div class="status-summary">${statusPill(m.status)}<span>Weiterführen: <strong>${esc(m.weiterfuehren || '–')}</strong></span></div>
    <div class="info-box compact">${ICON.clock}<div>${esc(pruefText)}</div></div>
    <h3 class="drawer-section">Bemerkungen / aktueller Stand</h3>
    <p>${show(m.bemerkung, 'Noch keine Bemerkung erfasst')}</p>
    <h3 class="drawer-section">Beschreibung</h3>
    <p>${show(m.beschreibung)}</p>
    <dl class="kv-list compact">
      ${kv('Handlungsfeld', m.handlungsfeld)}
      ${kv('Aktivitätsbereich', m.aktivitaetsbereich)}
      ${kv('Priorität', m.prioritaet)}
      ${kv('Umsetzungszeitraum', m.umsetzungszeitraum)}
      ${kv('Budget', formatChf(m.budget))}
      ${kv('Verantwortlichkeit', m.verantwortlichkeit)}
      ${kv('Aus der EPA-Beratung', m.ausEpa)}
      ${kv('Erfasst am', fmtDate(m.erfasstAm))}
    </dl>
    <h3 class="drawer-section">Verlauf der Überprüfungen</h3>
    ${m.pruefungen.length ? `<ol class="history">${m.pruefungen.slice().reverse().map(e => `<li>
      <div class="history-date">${fmtDate(e.datum)}</div>
      <div class="history-body">
        <div class="history-title">${esc(e.art === 'Neu erfasst' ? `Neu erfasst (${e.nachfuehrung})` : e.nachfuehrung)} ${statusPill(e.status)}</div>
        <div class="history-text">${show(e.bemerkung)}</div>
        <div class="history-meta">Weiterführen: ${esc(e.weiterfuehren || '–')}</div>
      </div>
    </li>`).join('')}</ol>` : '<p class="muted">Noch keine Überprüfung erfasst.</p>'}
  </div>
  <div class="drawer-foot">
    <button class="btn-outline-danger" data-action="delete-massnahme">${ICON.trash}Löschen</button>
    <span class="spacer"></span>
    <button class="btn btn-primary" data-action="edit-massnahme">${ICON.edit}Bearbeiten</button>
  </div>`;
}

function drawerMassnahmeForm(p, m) {
  const v = m || {
    name: '', beschreibung: '', handlungsfeld: '', aktivitaetsbereich: '', prioritaet: '', umsetzungszeitraum: '',
    budget: '', esNr: '', verantwortlichkeit: p.verantwortlichGemeinde, status: 'Geplant', weiterfuehren: 'Ja', bemerkung: ''
  };
  const imNf = !m && !!p.laufendeNachfuehrung;
  const closed = isClosedStatus(v.status);
  return `${drawerHead(m ? esc(m.id) : `Energieplanung ${esc(p.gemeinde)}`, m ? 'Massnahme bearbeiten' : 'Neue Massnahme erfassen')}
  <div class="drawer-body form-box">
    ${imNf ? `<div class="info-box compact">${ICON.info}<div>Die Massnahme wird als <strong>neu in der laufenden Nachführung</strong> erfasst.</div></div>` : ''}
    ${field({ id: 'f-m-name', label: 'Name', value: v.name, required: true })}
    ${field({ id: 'f-m-beschreibung', label: 'Beschreibung', type: 'textarea', value: v.beschreibung, required: true })}
    <div class="form-grid">
      ${field({ id: 'f-m-handlungsfeld', label: 'Handlungsfeld', type: 'select', options: [['', 'Bitte wählen …'], ...HANDLUNGSFELDER], value: v.handlungsfeld, required: true })}
      ${field({ id: 'f-m-aktivitaet', label: 'Aktivitätsbereich', type: 'select', options: [['', 'Bitte wählen …'], ...AKTIVITAETSBEREICHE], value: v.aktivitaetsbereich, required: true })}
      ${field({ id: 'f-m-prioritaet', label: 'Priorität', type: 'select', options: [['', 'Keine'], ...PRIORITAETEN], value: v.prioritaet })}
      ${field({ id: 'f-m-zeitraum', label: 'Umsetzungszeitraum', value: v.umsetzungszeitraum, placeholder: 'z.B. 2026–2028' })}
      ${field({ id: 'f-m-budget', label: 'Budget (CHF)', type: 'number', value: v.budget })}
      ${field({ id: 'f-m-esnr', label: 'ES-Nr.', value: v.esNr, placeholder: 'z.B. 1.2.1' })}
      ${field({ id: 'f-m-verantwortlich', label: 'Verantwortlichkeit', value: v.verantwortlichkeit, list: 'dl-kontakte', full: true })}
    </div>
    <h4 class="form-section-title">Stand</h4>
    <div class="form-grid">
      ${field({ id: 'f-m-status', label: 'Status', type: 'select', options: MASSNAHME_STATUS.map(s => [s.id, `${s.id} – ${s.hint}`]), value: v.status, required: true })}
      <div data-depends-on-status${closed ? ' hidden' : ''}>${field({ id: 'f-m-weiter', label: 'Wird weitergeführt?', type: 'yesno', value: v.weiterfuehren })}</div>
    </div>
    ${field({ id: 'f-m-bemerkung', label: 'Bemerkungen / aktueller Stand', type: 'textarea', value: v.bemerkung })}
    ${datalistKontakte()}
  </div>
  <div class="drawer-foot">
    <span class="spacer"></span>
    <button class="btn btn-outline" data-action="${m ? 'view-massnahme' : 'close-drawer'}">Abbrechen</button>
    <button class="btn btn-primary" data-action="save-massnahme">Speichern</button>
  </div>`;
}

function drawerNeuePlanung() {
  const belegt = new Set(planungen.map(p => p.gemeinde));
  return `${drawerHead('Schritt 1 von 4', 'Neue Energieplanung erfassen')}
  <div class="drawer-body form-box">
    <div class="info-box compact">${ICON.info}<div>Erfassen Sie die Grunddaten. Was Sie jetzt noch nicht wissen, ergänzen Sie später – die App zeigt Ihnen jederzeit, was noch fehlt.</div></div>
    ${field({ id: 'f-gemeinde', label: 'Gemeinde', type: 'select', options: [['', 'Gemeinde wählen …'], ...GEMEINDEN.map(g => [g, belegt.has(g) ? `${g} (hat bereits eine Energieplanung)` : g])], required: true })}
    <div class="form-grid">
      ${field({ id: 'f-typ', label: 'Planungstyp', type: 'select', options: PLANUNGSTYPEN, value: PLANUNGSTYPEN[0], required: true })}
      ${field({ id: 'f-jahr', label: 'Jahr', type: 'number', value: TODAY.getFullYear(), required: true })}
    </div>
    ${field({ id: 'f-verantwortlich', label: 'Verantwortliche Person der Gemeinde', soft: 'nötig für EPA-Start', list: 'dl-kontakte' })}
    ${field({ id: 'f-berater', label: 'Berater/in Energieplanung', soft: 'nötig für EPA-Start', list: 'dl-kontakte' })}
    <details class="details">
      <summary>Ziele jetzt erfassen <span class="optional">optional</span></summary>
      ${field({ id: 'f-z-netto', label: 'Netto-null Ziel', type: 'textarea', rows: 2 })}
      ${field({ id: 'f-z-effizienz', label: 'Energieeffizienz Ziel', type: 'textarea', rows: 2 })}
      ${field({ id: 'f-z-strom', label: 'Stromproduktion Ziel', type: 'textarea', rows: 2 })}
    </details>
    ${datalistKontakte()}
  </div>
  <div class="drawer-foot">
    <span class="spacer"></span>
    <button class="btn btn-outline" data-action="close-drawer">Abbrechen</button>
    <button class="btn btn-primary" data-action="create-planung">Energieplanung anlegen</button>
  </div>`;
}

function drawerKontakt(idx) {
  const c = idx === null || idx === undefined ? null : contacts[idx];
  return `${drawerHead('', c ? `${c.vorname} ${c.nachname}` : 'Neuer Kontakt')}
  <div class="drawer-body form-box">
    <div class="form-grid">
      ${field({ id: 'f-k-vorname', label: 'Vorname', value: c ? c.vorname : '', required: true })}
      ${field({ id: 'f-k-nachname', label: 'Nachname', value: c ? c.nachname : '', required: true })}
    </div>
    ${field({ id: 'f-k-organisation', label: 'Organisation', value: c ? c.organisation : '' })}
    ${field({ id: 'f-k-email', label: 'E-Mail', type: 'email', value: c ? c.email : '', required: true })}
  </div>
  <div class="drawer-foot">
    ${c ? `<button class="btn-outline-danger" data-action="delete-kontakt">${ICON.trash}Löschen</button>` : ''}
    <span class="spacer"></span>
    <button class="btn btn-outline" data-action="close-drawer">Abbrechen</button>
    <button class="btn btn-primary" data-action="save-kontakt">Speichern</button>
  </div>`;
}

/* =============================================================
   KONTAKTE
   ============================================================= */
function renderKontakte() {
  $panel.innerHTML = `<div class="page">
    <div class="page-head">
      <div><h1 class="page-title">Kontakte</h1><p class="page-sub">Personen aus Gemeinden, Beratungsbüros und Verwaltung.</p></div>
      <button class="btn btn-primary" data-action="new-kontakt">${ICON.plus}Neuer Kontakt</button>
    </div>
    <div class="toolbar">
      <div class="search-input-wrap">
        <input type="search" id="contact-search" placeholder="Name, Organisation oder E-Mail suchen …" value="${esc(state.contactSearch)}" aria-label="Kontakte durchsuchen">
        ${ICON.search}
      </div>
    </div>
    <div id="contact-results">${renderKontaktResults()}</div>
  </div>`;
}
function renderKontaktResults() {
  const q = state.contactSearch.trim().toLowerCase();
  const list = contacts.map((c, idx) => ({ c, idx }))
    .filter(({ c }) => !q || [c.vorname, c.nachname, c.organisation, c.email].some(v => String(v || '').toLowerCase().includes(q)))
    .sort((a, b) => `${a.c.nachname} ${a.c.vorname}`.localeCompare(`${b.c.nachname} ${b.c.vorname}`));
  if (!list.length) return `<div class="empty-state">Keine Kontakte gefunden.</div>`;
  return `<div class="table-scroll"><table class="data-table">
    <thead><tr><th>Name</th><th>Organisation</th><th>E-Mail</th></tr></thead>
    <tbody>${list.map(({ c, idx }) => `<tr data-action="open-kontakt" data-idx="${idx}" tabindex="0">
      <td class="cell-title">${esc(c.vorname)} ${esc(c.nachname)}</td><td>${show(c.organisation)}</td><td>${esc(c.email)}</td>
    </tr>`).join('')}</tbody>
  </table></div>
  <div class="table-foot">${plural(list.length, 'Kontakt', 'Kontakte')}</div>`;
}

/* =============================================================
   AUSWERTUNGEN
   ============================================================= */
const REPORTS = [
  { id: 'stand', titel: 'Stand aller Energieplanungen', text: 'Prozessschritt, nächster Schritt und offene Massnahmen je Gemeinde.', count: () => planungen.length },
  { id: 'nachfuehrungen', titel: 'Nachführungen: fällig & demnächst', text: 'Fällige, laufende und in den nächsten 12 Monaten anstehende Nachführungen.', count: () => reportNachfuehrungRows().length },
  { id: 'massnahmen', titel: 'Massnahmen nach Status', text: 'Anzahl Massnahmen je Handlungsfeld und Status über alle Energieplanungen.', count: () => planungen.reduce((s, p) => s + p.massnahmen.length, 0) },
  { id: 'foerderung', titel: 'Fördergesuche & Auszahlungen', text: 'Gesuchseingang, Gesuchs-Nr., Auszahlungsbetrag und Energiestadt je Gemeinde.', rolle: 'Controller', count: () => planungen.filter(p => p.epa.gesuchEingereichtAm).length },
  { id: 'masterplan', titel: 'EPA Masterplan', text: 'Kantonsweite Übersicht zu EPA, Energiestadt sowie regionaler und kommunaler Planung.', rolle: 'Controller', count: () => (typeof EPA_MASTERPLAN !== 'undefined' ? EPA_MASTERPLAN.length : 0) },
];
function reportsFuerRolle() { return REPORTS.filter(r => !r.rolle || r.rolle === state.role); }

function renderAuswertungen() {
  const r = reportsFuerRolle().find(x => x.id === state.reportView);
  if (!r) {
    state.reportView = null;
    $panel.innerHTML = `<div class="page">
      <div class="page-head"><div><h1 class="page-title">Auswertungen</h1><p class="page-sub">Übersichten über alle Energieplanungen.</p></div></div>
      <div class="report-menu">${reportsFuerRolle().map(x => `<button class="report-card" data-action="open-report" data-id="${x.id}">
        <span class="report-card-count">${x.count()}</span>
        <span class="report-card-body"><span class="report-card-title">${esc(x.titel)}${x.rolle ? ' <span class="badge-intern">intern</span>' : ''}</span><span class="report-card-desc">${esc(x.text)}</span></span>
        <span class="task-item-arrow">${ICON.chevron}</span>
      </button>`).join('')}</div>
    </div>`;
    return;
  }
  const body = { stand: reportStand, nachfuehrungen: reportNachfuehrungen, massnahmen: reportMassnahmen, foerderung: reportFoerderung, masterplan: reportMasterplan }[r.id]();
  $panel.innerHTML = `<div class="page">
    <button class="back-link" data-action="open-report" data-id="">${ICON.back}Alle Auswertungen</button>
    <h1 class="page-title">${esc(r.titel)}</h1>
    <p class="page-sub">${esc(r.text)}</p>
    ${body}
  </div>`;
}

function reportStand() {
  const rows = planungen.slice().sort((a, b) => a.gemeinde.localeCompare(b.gemeinde));
  return `<div class="table-scroll"><table class="data-table">
    <thead><tr><th>Gemeinde</th><th>Prozessschritt</th><th>Nächster Schritt</th><th>Massnahmen offen / total</th><th>Nächste Nachführung</th></tr></thead>
    <tbody>${rows.map(p => {
      const a = naechsteAktion(p);
      const due = naechsteNachfuehrung(p);
      return `<tr data-action="open-planung" data-id="${p.id}" tabindex="0">
        <td class="cell-title">${esc(p.gemeinde)}</td><td>${phaseBadge(p)}</td><td>${esc(a.titel)}</td>
        <td>${p.massnahmen.filter(istOffen).length} / ${p.massnahmen.length}</td>
        <td>${due ? fmtDate(toIso(due)) : '<span class="muted">–</span>'}</td>
      </tr>`;
    }).join('')}</tbody>
  </table></div>`;
}

function reportNachfuehrungRows() {
  const grenze = addMonths(TODAY, 12);
  return planungen
    .map(p => ({ p, due: naechsteNachfuehrung(p) }))
    .filter(x => x.due && x.due <= grenze)
    .sort((a, b) => a.due - b.due);
}
function reportNachfuehrungen() {
  const rows = reportNachfuehrungRows();
  if (!rows.length) return `<div class="empty-state">Keine Nachführungen in den nächsten 12 Monaten.</div>`;
  return `<div class="table-scroll"><table class="data-table">
    <thead><tr><th>Gemeinde</th><th>Fällig am</th><th>Status</th><th>Offene Massnahmen</th><th>Berater/in</th></tr></thead>
    <tbody>${rows.map(({ p, due }) => {
      const lauf = p.laufendeNachfuehrung;
      const status = lauf ? `Läuft (${lauf.geprueft.length}/${lauf.zuPruefen.length})` : TODAY >= due ? 'Fällig' : 'Demnächst';
      return `<tr data-action="open-planung" data-id="${p.id}" tabindex="0">
        <td class="cell-title">${esc(p.gemeinde)}</td>
        <td class="${TODAY >= due ? 'warn-text' : ''}">${fmtDate(toIso(due))}</td>
        <td>${status}</td><td>${p.massnahmen.filter(istOffen).length}</td><td>${show(p.berater)}</td>
      </tr>`;
    }).join('')}</tbody>
  </table></div>`;
}

function reportMassnahmen() {
  const alle = planungen.flatMap(p => p.massnahmen);
  const stati = MASSNAHME_STATUS.map(s => s.id);
  const zeile = (label, list) => `<tr><td class="cell-title">${esc(label)}</td>${stati.map(s => `<td>${list.filter(m => m.status === s).length}</td>`).join('')}<td><strong>${list.length}</strong></td></tr>`;
  return `<div class="table-scroll"><table class="data-table num-table">
    <thead><tr><th>Handlungsfeld</th>${stati.map(s => `<th>${s}</th>`).join('')}<th>Total</th></tr></thead>
    <tbody>
      ${HANDLUNGSFELDER.map(h => zeile(h, alle.filter(m => m.handlungsfeld === h))).join('')}
    </tbody>
    <tfoot>${zeile('Total', alle)}</tfoot>
  </table></div>`;
}

function reportFoerderung() {
  const rows = planungen.filter(p => p.epa.gesuchEingereichtAm).sort((a, b) => b.epa.gesuchEingereichtAm.localeCompare(a.epa.gesuchEingereichtAm));
  const summe = rows.reduce((s, p) => s + (Number(p.controlling.auszahlungsbetrag) || 0), 0);
  return `<div class="table-scroll"><table class="data-table">
    <thead><tr><th>Gemeinde</th><th>Eingereicht</th><th>Gesuchseingang</th><th>Gesuchs-Nr.</th><th>Betrag</th><th>Energiestadt</th><th>Status</th><th>Kommentar</th></tr></thead>
    <tbody>${rows.map(p => {
      const c = p.controlling;
      return `<tr data-action="open-planung" data-id="${p.id}" data-tab="foerderung" tabindex="0">
        <td class="cell-title">${esc(p.gemeinde)}</td><td>${fmtDate(p.epa.gesuchEingereichtAm)}</td><td>${show(fmtDate(c.gesuchseingang))}</td>
        <td>${show(c.gesuchsNr)}</td><td>${show(formatChf(c.auszahlungsbetrag))}</td><td>${show(c.energiestadt)}</td>
        <td>${p.epa.status === 'Abschluss' ? 'Abgeschlossen' : fehlend(PFLICHT_CONTROLLING, p).length ? '<span class="warn-text">Prüfung offen</span>' : 'Bereit zum Abschluss'}</td>
        <td class="cell-wrap">${show(c.kommentar)}</td>
      </tr>`;
    }).join('')}</tbody>
    <tfoot><tr><td colspan="4"><strong>Total ausbezahlt</strong></td><td colspan="4"><strong>${formatChf(summe)}</strong></td></tr></tfoot>
  </table></div>`;
}

function reportMasterplan() {
  const data = typeof EPA_MASTERPLAN !== 'undefined' ? EPA_MASTERPLAN : [];
  const cols = [['gemeinde', 'Gemeinde'], ['epaBeratungAbgeschlossen', 'EPA abgeschlossen'], ['epaGeplant', 'EPA geplant'], ['epaBerater', 'EPA-Berater'], ['epaFirma', 'EPA-Firma'],
    ['epaKickoff', 'Kick-off'], ['esZert', 'ES-Zertifizierung'], ['regEp', 'REG-EP'], ['regEpName', 'REG-EP Name'], ['komEp', 'KOM-EP'], ['komEpJahr', 'KOM-EP Jahr'],
    ['gasnetz', 'Gasnetz'], ['gasversorger', 'Gasversorger'], ['ortsplanungsrevision', 'Ortsplanungsrevision'], ['info', 'Info']];
  return `<div class="table-scroll"><table class="data-table wide-table">
    <thead><tr>${cols.map(([, l]) => `<th>${l}</th>`).join('')}</tr></thead>
    <tbody>${data.map(r => {
      const p = planungen.find(x => x.gemeinde === r.gemeinde);
      return `<tr${p ? ` data-action="open-planung" data-id="${p.id}" tabindex="0"` : ''}>${cols.map(([k]) => `<td>${show(r[k] === '-' ? '' : r[k])}</td>`).join('')}</tr>`;
    }).join('')}</tbody>
  </table></div>`;
}

/* =============================================================
   AKTIONEN (Event-Delegation über data-action)
   ============================================================= */
const actions = {
  /* --- Navigation --- */
  'open-planung': el => openPlanung(el.dataset.id, el.dataset.tab),
  'back-to-list': () => { state.planungId = null; state.editing = null; render(); },
  'list-phase': el => { state.tab = 'planungen'; state.planungId = null; state.list.phase = el.dataset.phase; state.list.aufgabe = ''; render(); },
  'list-aufgabe': el => { state.tab = 'planungen'; state.planungId = null; state.list.aufgabe = el.dataset.key; state.list.phase = ''; render(); },
  'list-scope': el => { state.list.nurMeine = el.dataset.meine === '1'; render(); },
  'toggle-process': () => { state.processOpen = !state.processOpen; render(); },
  'detail-tab': el => {
    const scroll = !!(el.dataset.scroll || el.closest('.tab-body') || el.closest('.journey'));
    state.detailTab = el.dataset.tab;
    state.editing = null;
    render();
    const tabs = document.getElementById('detail-tabs');
    if (tabs && scroll) tabs.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },
  'edit': el => { state.editing = el.dataset.section; render(); },
  'cancel-edit': () => { state.editing = null; render(); },
  'open-report': el => { state.reportView = el.dataset.id || null; render(); $panel.scrollTop = 0; },

  /* --- Energieplanung --- */
  'new-planung': () => { state.drawer = { type: 'neuePlanung' }; renderDrawer(); },
  'create-planung': el => {
    const box = el.closest('.drawer').querySelector('.form-box');
    const missing = [['f-gemeinde', 'Gemeinde'], ['f-typ', 'Planungstyp'], ['f-jahr', 'Jahr']].filter(([id]) => !readField(id));
    if (missing.length) { showFormErrors(box, missing); return; }
    const p = neuePlanung({ gemeinde: readField('f-gemeinde'), typ: readField('f-typ'), jahr: Number(readField('f-jahr')) });
    p.verantwortlichGemeinde = readField('f-verantwortlich');
    p.berater = readField('f-berater');
    p.ziele = { nettoNull: readField('f-z-netto'), effizienz: readField('f-z-effizienz'), strom: readField('f-z-strom') };
    planungen.unshift(p);
    state.drawer = null;
    toast(`Energieplanung ${p.gemeinde} wurde angelegt.`);
    openPlanung(p.id);
  },
  'save-stammdaten': el => {
    const p = currentPlanung();
    const box = el.closest('.form-box');
    const missing = [['f-gemeinde', 'Gemeinde'], ['f-typ', 'Planungstyp'], ['f-jahr', 'Jahr']].filter(([id]) => !readField(id));
    if (missing.length) { showFormErrors(box, missing); return; }
    Object.assign(p, {
      gemeinde: readField('f-gemeinde'), typ: readField('f-typ'), jahr: Number(readField('f-jahr')),
      verantwortlichGemeinde: readField('f-verantwortlich'), berater: readField('f-berater'),
      ziele: { nettoNull: readField('f-z-netto'), effizienz: readField('f-z-effizienz'), strom: readField('f-z-strom') }
    });
    state.editing = null;
    const fehl = fehlend(PFLICHT_STAMMDATEN, p).length;
    toast(fehl ? `Gespeichert. Es ${fehl === 1 ? 'fehlt' : 'fehlen'} noch ${plural(fehl, 'Angabe', 'Angaben')}.` : 'Gespeichert. Die Grunddaten sind vollständig.');
    render();
  },
  'delete-planung': () => {
    const p = currentPlanung();
    if (!confirm(`Energieplanung ${p.gemeinde} (${p.id}) wirklich löschen? Alle Massnahmen und Nachführungen gehen verloren.`)) return;
    planungen.splice(planungen.indexOf(p), 1);
    state.planungId = null;
    state.editing = null;
    toast(`Energieplanung ${p.gemeinde} wurde gelöscht.`);
    render();
  },

  /* --- EPA-Beratung --- */
  'epa-start': () => {
    const p = currentPlanung();
    p.epa.status = 'Entwurf';
    if (!p.epa.beratungsperson) p.epa.beratungsperson = p.berater;
    if (!p.epa.beratungsbeginn) p.epa.beratungsbeginn = todayIso();
    toast('EPA-Beratung gestartet. Phase: Entwurf.');
    render();
  },
  'epa-save': el => {
    const p = currentPlanung();
    const s = el.dataset.stage;
    const advance = el.dataset.advance === '1';
    const strict = el.dataset.strict === '1';
    const values = readEpaStage(s);
    const probe = clone(p);
    Object.assign(probe.epa, values);
    const missing = fehlend(PFLICHT_EPA[s], probe).map(([id, label]) => [id, label]);
    if (s === 'Entwurf' && advance && !p.massnahmen.length) missing.push(['massnahmen', 'Mindestens eine Massnahme']);
    if (strict && missing.length) { showFormErrors(el.closest('.form-box'), missing); return; }
    Object.assign(p.epa, values);
    state.editing = null;
    if (!advance) { toast('Gespeichert.'); render(); return; }
    if (s === 'Entwurf') { p.epa.status = 'Verabschiedung'; toast('Entwurf abgeschlossen. Nächster Schritt: Verabschiedung durch den Gemeinderat.'); }
    else if (s === 'Verabschiedung') { p.epa.status = 'Fördergesuch'; toast('Verabschiedung erfasst. Nächster Schritt: Fördergesuch einreichen.'); }
    else if (s === 'Fördergesuch') { p.epa.gesuchEingereichtAm = todayIso(); toast('Fördergesuch eingereicht. Der Kanton prüft nun das Gesuch.'); }
    render();
  },

  'formular-open': () => {
    const p = currentPlanung();
    saveGesuchDraft(p);
    const url = URL.createObjectURL(new Blob([formularHtml(p)], { type: 'text/html' }));
    if (!window.open(url, '_blank')) toast('Das Formular konnte nicht geöffnet werden – bitte Pop-ups für diese Seite erlauben.');
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  },
  'doc-remove': el => removeDoc(el.dataset.doc),

  /* --- Förderung / Controlling --- */
  'ctrl-save': el => {
    const p = currentPlanung();
    const close = el.dataset.close === '1';
    const strict = el.dataset.strict === '1';
    const values = {
      gesuchseingang: readField('f-c-eingang'), gesuchsNr: readField('f-c-nr'),
      auszahlungsbetrag: readField('f-c-betrag') === '' ? '' : Number(readField('f-c-betrag')),
      energiestadt: readField('f-c-energiestadt'), kommentar: readField('f-c-kommentar')
    };
    const probe = clone(p);
    Object.assign(probe.controlling, values);
    const missing = fehlend(PFLICHT_CONTROLLING, probe);
    if (strict && missing.length) { showFormErrors(el.closest('.form-box'), missing); return; }
    if (close) {
      const first = addYears(TODAY, NACHFUEHRUNG_INTERVALL_JAHRE);
      if (!confirm(`EPA-Beratung ${p.gemeinde} abschliessen?\n\nDamit beginnt der Nachführungsrhythmus. Die erste Nachführung ist am ${fmtDate(toIso(first))} fällig.`)) return;
    }
    const jahr = fromIso(values.gesuchseingang || todayIso()).getFullYear();
    if (values.gesuchsNr && values.gesuchsNr === vorschlagGesuchsNr(jahr)) gesuchsLaufNr[jahr] = (gesuchsLaufNr[jahr] || 0) + 1;
    Object.assign(p.controlling, values);
    state.editing = null;
    if (close) {
      p.epa.status = 'Abschluss';
      p.epa.abgeschlossenAm = todayIso();
      toast(`EPA-Beratung ${p.gemeinde} abgeschlossen. Die Nachführung startet in ${NACHFUEHRUNG_INTERVALL_JAHRE} Jahren.`);
    } else toast('Angaben zum Fördergesuch gespeichert.');
    render();
  },

  /* --- Massnahmen --- */
  'mass-filter': el => { state.mass.filter = el.dataset.filter; render(); },
  'open-massnahme': el => { state.drawer = { type: 'massnahme', id: el.dataset.id, mode: 'view' }; renderDrawer(); },
  'view-massnahme': () => { state.drawer.mode = 'view'; renderDrawer(); },
  'new-massnahme': () => { state.drawer = { type: 'massnahme', id: null, mode: 'edit' }; renderDrawer(); },
  'edit-massnahme': () => { state.drawer.mode = 'edit'; renderDrawer(); },
  'save-massnahme': el => {
    const p = currentPlanung();
    const box = el.closest('.drawer').querySelector('.form-box');
    const req = [['f-m-name', 'Name'], ['f-m-beschreibung', 'Beschreibung'], ['f-m-handlungsfeld', 'Handlungsfeld'], ['f-m-aktivitaet', 'Aktivitätsbereich']];
    const missing = req.filter(([id]) => !readField(id));
    if (missing.length) { showFormErrors(box, missing); return; }
    const status = readField('f-m-status');
    const data = {
      name: readField('f-m-name'), beschreibung: readField('f-m-beschreibung'),
      handlungsfeld: readField('f-m-handlungsfeld'), aktivitaetsbereich: readField('f-m-aktivitaet'),
      prioritaet: readField('f-m-prioritaet'), umsetzungszeitraum: readField('f-m-zeitraum'),
      budget: readField('f-m-budget') === '' ? '' : Number(readField('f-m-budget')),
      esNr: readField('f-m-esnr'), verantwortlichkeit: readField('f-m-verantwortlich'),
      status, weiterfuehren: isClosedStatus(status) ? 'Nein' : (readField('f-m-weiter') || 'Ja'),
      bemerkung: readField('f-m-bemerkung')
    };
    const existing = state.drawer.id ? p.massnahmen.find(m => m.id === state.drawer.id) : null;
    if (existing) {
      Object.assign(existing, data);
      toast('Massnahme gespeichert.');
      state.drawer.mode = 'view';
    } else {
      const lauf = p.laufendeNachfuehrung;
      const m = neueMassnahme(Object.assign(data, { ausEpa: p.epa.status && p.epa.status !== 'Abschluss' ? 'Ja' : 'Nein' }));
      p.massnahmen.push(m);
      if (lauf) {
        lauf.neu.push(m.id);
        m.pruefungen.push({ datum: todayIso(), status: m.status, weiterfuehren: m.weiterfuehren, bemerkung: m.bemerkung, art: 'Neu erfasst', nachfuehrung: `Nachführung ${fromIso(lauf.faelligAm).getFullYear()}` });
        state.drawer = null;
        toast('Neue Massnahme in die Nachführung aufgenommen.');
      } else {
        state.drawer = { type: 'massnahme', id: m.id, mode: 'view' };
        toast('Massnahme erfasst.');
      }
    }
    render();
  },
  'delete-massnahme': () => {
    const p = currentPlanung();
    const m = p.massnahmen.find(x => x.id === state.drawer.id);
    if (!confirm(`Massnahme «${m.name}» wirklich löschen?\n\nTipp: Wird eine Massnahme nicht umgesetzt, setzen Sie besser den Status «Gestrichen» – so bleibt der Verlauf erhalten.`)) return;
    p.massnahmen = p.massnahmen.filter(x => x.id !== m.id);
    const lauf = p.laufendeNachfuehrung;
    if (lauf) ['zuPruefen', 'geprueft', 'neu'].forEach(k => { lauf[k] = lauf[k].filter(id => id !== m.id); });
    state.drawer = null;
    toast('Massnahme gelöscht.');
    render();
  },
  'close-drawer': () => { state.drawer = null; renderDrawer(); },

  /* --- Nachführung --- */
  'nf-start': () => {
    const p = currentPlanung();
    const st = nachfuehrungStatus(p);
    const due = naechsteNachfuehrung(p);
    if (st === 'ok' && !confirm(`Die Nachführung ist erst am ${fmtDate(toIso(due))} fällig. Trotzdem jetzt starten?`)) return;
    starteNachfuehrung(p);
    state.reviewId = null;
    toast(`Nachführung ${due.getFullYear()} gestartet.`);
    render();
  },
  'nf-select': el => { state.reviewId = el.dataset.id; render(); scrollToReviewCard(); },
  'nf-nav': el => {
    const p = currentPlanung();
    const items = reviewItems(p);
    const cur = items.findIndex(m => m.id === state.reviewId);
    const next = items[Math.max(0, Math.min(items.length - 1, cur + Number(el.dataset.dir)))];
    if (next) { state.reviewId = next.id; render(); scrollToReviewCard(); }
  },
  'nf-copy-prev': el => { const ta = document.getElementById('nf-bemerkung'); ta.value = el.dataset.text; ta.focus(); },
  'nf-save': el => {
    const p = currentPlanung();
    const m = p.massnahmen.find(x => x.id === el.dataset.id);
    const status = readField('nf-status');
    const closed = isClosedStatus(status);
    const weiter = closed ? 'Nein' : readField('nf-weiter');
    const bemerkung = readField('nf-bemerkung');
    const missing = [];
    if (!status) missing.push(['nf-status', 'Aktueller Stand']);
    if (!closed && !weiter) missing.push(['nf-weiter', 'Weiterführung']);
    if (!bemerkung) missing.push(['nf-bemerkung', 'Bemerkungen / aktueller Stand']);
    if (missing.length) { showFormErrors(document.querySelector('#review-card .form-box'), missing); return; }
    pruefeMassnahme(p, m, { status, weiterfuehren: weiter, bemerkung });
    const next = naechstePruefungMassnahme(p, m);
    toast(`«${m.name}» überprüft. ${next ? `Nächste Überprüfung: ${next.getFullYear()}.` : 'Keine weitere Überprüfung nötig.'}`);
    const items = reviewItems(p);
    const idx = items.indexOf(m);
    const offen = items.slice(idx + 1).concat(items.slice(0, idx)).find(x => !isReviewed(p, x));
    state.reviewId = offen ? offen.id : m.id;
    render();
    scrollToReviewCard();
  },
  'nf-finish': () => {
    const p = currentPlanung();
    const lauf = p.laufendeNachfuehrung;
    const items = reviewItems(p);
    const offen = items.filter(m => !isReviewed(p, m));
    if (offen.length) {
      toast(`Bitte zuerst alle Massnahmen überprüfen – noch ${offen.length} offen.`);
      state.reviewId = offen[0].id;
      render();
      scrollToReviewCard();
      return;
    }
    const nextDue = addYears(TODAY, NACHFUEHRUNG_INTERVALL_JAHRE);
    const jahr = fromIso(lauf.faelligAm).getFullYear();
    if (!confirm(`Nachführung ${jahr} abschliessen?\n\n${plural(lauf.geprueft.length, 'Massnahme', 'Massnahmen')} überprüft${lauf.neu.length ? `, ${lauf.neu.length} neu erfasst` : ''}.\nNächste Nachführung: ${nextDue.getFullYear() > NACHFUEHRUNG_ENDE_JAHR ? 'keine mehr' : fmtDate(toIso(nextDue))}.`)) return;
    schliesseNachfuehrungAb(p);
    state.reviewId = null;
    toast(`Nachführung ${jahr} abgeschlossen.`);
    render();
    $panel.scrollTop = 0;
  },

  /* --- Kontakte --- */
  'new-kontakt': () => { state.drawer = { type: 'kontakt', id: null }; renderDrawer(); },
  'open-kontakt': el => { state.drawer = { type: 'kontakt', id: Number(el.dataset.idx) }; renderDrawer(); },
  'save-kontakt': el => {
    const box = el.closest('.drawer').querySelector('.form-box');
    const missing = [['f-k-vorname', 'Vorname'], ['f-k-nachname', 'Nachname'], ['f-k-email', 'E-Mail']].filter(([id]) => !readField(id));
    if (missing.length) { showFormErrors(box, missing); return; }
    const data = { vorname: readField('f-k-vorname'), nachname: readField('f-k-nachname'), organisation: readField('f-k-organisation'), email: readField('f-k-email') };
    if (state.drawer.id === null) contacts.push(data); else Object.assign(contacts[state.drawer.id], data);
    state.drawer = null;
    toast('Kontakt gespeichert.');
    render();
  },
  'delete-kontakt': () => {
    const c = contacts[state.drawer.id];
    if (!confirm(`Kontakt ${c.vorname} ${c.nachname} wirklich löschen?`)) return;
    contacts.splice(state.drawer.id, 1);
    state.drawer = null;
    toast('Kontakt gelöscht.');
    render();
  },
};

function scrollToReviewCard() {
  const card = document.getElementById('review-card');
  if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.addEventListener('click', e => {
  const jump = e.target.closest('[data-jump]');
  if (jump) {
    e.preventDefault();
    const target = document.getElementById(jump.dataset.jump) || document.querySelector(`input[name="${jump.dataset.jump}"]`);
    if (target) { target.scrollIntoView({ behavior: 'smooth', block: 'center' }); target.focus(); }
    return;
  }
  const el = e.target.closest('[data-action]');
  if (!el || el.disabled) return;
  const fn = actions[el.dataset.action];
  if (!fn) return;
  e.preventDefault();
  fn(el, e);
});

// Tastatur: Tabellenzeilen per Enter öffnen, Drawer per Esc schliessen.
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && state.drawer) { state.drawer = null; renderDrawer(); return; }
  if (e.key === 'Enter' && e.target.matches('tr[data-action]')) actions[e.target.dataset.action](e.target, e);
});

document.addEventListener('input', e => {
  const t = e.target;
  if (t.id === 'planung-search') { state.list.search = t.value; document.getElementById('planung-results').innerHTML = renderPlanungResults(); return; }
  if (t.id === 'mass-search') { state.mass.search = t.value; document.getElementById('mass-results').innerHTML = renderMassResults(currentPlanung()); return; }
  if (t.id === 'contact-search') { state.contactSearch = t.value; document.getElementById('contact-results').innerHTML = renderKontaktResults(); return; }
  clearFieldError(t);
});

document.addEventListener('change', e => {
  const t = e.target;
  if (t.matches('input[type=file][data-doc]')) { docUpload(t); return; }
  // Bei "Erledigt"/"Gestrichen" entfällt die Frage nach der Weiterführung.
  if (t.name === 'nf-status' || t.id === 'f-m-status') {
    const closed = isClosedStatus(t.value);
    const scope = t.closest('.review-card, .drawer') || document;
    scope.querySelectorAll('[data-depends-on-status]').forEach(el => { el.hidden = closed; });
    scope.querySelectorAll('[data-closed-note]').forEach(el => { el.hidden = !closed; });
  }
  clearFieldError(t);
});

function clearFieldError(t) {
  const f = t.closest && t.closest('.has-error');
  if (!f) return;
  f.classList.remove('has-error');
  const msg = f.querySelector('.field-error-msg');
  if (msg) msg.remove();
  const box = f.closest('.form-box');
  if (box && !box.querySelector('.has-error')) { const b = box.querySelector('.form-error-banner'); if (b) b.remove(); }
}

/* ---------------------- HAUPT-NAVIGATION ---------------------- */
document.querySelectorAll('.panel-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    state.tab = btn.dataset.tab;
    if (state.tab === 'planungen') state.planungId = null;
    if (state.tab === 'auswertungen') state.reportView = null;
    state.editing = null;
    state.drawer = null;
    render();
    $panel.scrollTop = 0;
  });
});

document.querySelectorAll('[data-toast]').forEach(el => {
  el.addEventListener('click', () => toast(el.dataset.toast));
});

/* ---------------------- ROLLEN-SWITCHER (AVATAR) ---------------------- */
const $avatarBtn = document.getElementById('avatar-btn');
const $roleMenu = document.getElementById('role-menu');

function updateAvatar() {
  document.getElementById('avatar-initials').textContent = ROLLEN[state.role].kurz;
  $avatarBtn.title = `Angemeldet als ${ROLLEN[state.role].label}`;
  document.querySelectorAll('#role-menu .role-menu-item').forEach(b => b.classList.toggle('active', b.dataset.role === state.role));
}

$avatarBtn.addEventListener('click', e => {
  e.stopPropagation();
  $roleMenu.hidden = !$roleMenu.hidden;
});
$roleMenu.addEventListener('click', e => e.stopPropagation());
document.addEventListener('click', () => { $roleMenu.hidden = true; });

document.querySelectorAll('#role-menu .role-menu-item').forEach(btn => {
  btn.addEventListener('click', () => {
    state.role = btn.dataset.role;
    state.editing = null;
    updateAvatar();
    $roleMenu.hidden = true;
    toast(`Rolle gewechselt zu «${ROLLEN[state.role].label}».`);
    render();
  });
});
updateAvatar();

/* ---------------------- ANWENDUNGEN-SWITCHER (VERSIONEN) ---------------------- */
const $appSwitcherBtn = document.getElementById('app-switcher-btn');
const $appSwitcherMenu = document.getElementById('app-switcher-menu');

if ($appSwitcherBtn && $appSwitcherMenu) {
  $appSwitcherBtn.addEventListener('click', e => {
    e.stopPropagation();
    $appSwitcherMenu.hidden = !$appSwitcherMenu.hidden;
  });
  $appSwitcherMenu.addEventListener('click', e => e.stopPropagation());
  document.addEventListener('click', () => { $appSwitcherMenu.hidden = true; });

  document.querySelectorAll('#app-switcher-menu .role-menu-item').forEach(btn => {
    btn.addEventListener('click', () => {
      $appSwitcherMenu.hidden = true;
      if (btn.classList.contains('active')) return;
      window.location.href = btn.dataset.nav;
    });
  });
}

/* ---------------------- ANSICHT: KARTE / BEIDES / DATEN ---------------------- */
const $appBody = document.querySelector('.app-body');
const $sidePanel = document.querySelector('.side-panel');
let panelWidth = 840;
$sidePanel.style.minWidth = '0';
$sidePanel.style.maxWidth = 'none';

document.querySelectorAll('#view-toggle [data-view-mode]').forEach(btn => {
  btn.addEventListener('click', () => {
    state.layoutMode = btn.dataset.viewMode;
    document.querySelectorAll('#view-toggle [data-view-mode]').forEach(b => b.classList.toggle('active', b === btn));
    $appBody.className = `app-body mode-${state.layoutMode}`;
    $sidePanel.style.width = state.layoutMode === 'split' ? `${panelWidth}px` : '';
    if (state.layoutMode !== 'data') setTimeout(() => map.invalidateSize(), 0);
  });
});

/* ---------------------- SPLITTER: DATENPANEL-BREITE ---------------------- */
const $resizer = document.getElementById('panel-resizer');

$resizer.addEventListener('mousedown', e => {
  e.preventDefault();
  $resizer.classList.add('dragging');
  document.body.style.userSelect = 'none';
  document.body.style.cursor = 'col-resize';

  const onMouseMove = ev => {
    const min = 420;
    const max = Math.min(1400, window.innerWidth - 480);
    panelWidth = Math.min(max, Math.max(min, window.innerWidth - ev.clientX));
    $sidePanel.style.width = `${panelWidth}px`;
  };
  const onMouseUp = () => {
    $resizer.classList.remove('dragging');
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    map.invalidateSize();
  };
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

/* ---------------------- LEAFLET MAP ---------------------- */
const LUZERN_CENTER = [47.0502, 8.3093];
const map = L.map('leaflet-map', { zoomControl: false }).setView(LUZERN_CENTER, 13);

L.tileLayer('https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg', {
  maxZoom: 18,
  attribution: '&copy; <a href="https://www.swisstopo.admin.ch">swisstopo</a>'
}).addTo(map);
L.control.zoom({ position: 'topright' }).addTo(map);
L.control.scale({ imperial: false }).addTo(map);
L.marker(LUZERN_CENTER).addTo(map).bindPopup('Luzern');

/* ---------------------- INIT ---------------------- */
render();
