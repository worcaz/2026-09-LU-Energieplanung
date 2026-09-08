/* =============================================================
   Energieplanung Prototyp — App logic (mock data, client-side only)
   ============================================================= */

/* ---------------------- MOCK DATA ---------------------- */

const STATUS_ORDER = ['Entwurf', 'Verabschiedung', 'Fördergesuch', 'Abschluss'];

function makeEnergieplanung(id, gemeinde, status, extra) {
  return Object.assign({
    id, name: `Energieplanung ${gemeinde}`, typ: 'Kommunale Energieplanung',
    jahr: 2026, gemeinde, status,
    epaBeratung: {
      name: `EPA Beratung ${id}`,
      prozessstatus: status,
      beratungsperson: '-',
      datumBeratungsbeginn: '-',
      bedarfEnergierichtplan: '-',
      bedarfKoordination: '-',
      gebieteKoordinationsbedarf: '-',
      foerderabschlussformular: 'Keine Massnahmen definiert'
    },
    konto: {
      kontoinhaber: '-', adresse: '-', iban: '-', bankname: '-',
      vermerk: `204071003 Kommunale Energieplanung`
    },
    energieplanungFelder: {
      verantwortlichkeit: '-', nettoNullZiel: '-', energieeffizienzZiel: '-', stromproduktionZiel: '-'
    },
    massnahmen: []
  }, extra || {});
}

const planungen = [
  makeEnergieplanung('EP-844', 'Adligenswil', 'Fördergesuch', {
    massnahmen: [{
      id: 'M-1005', esNr: '-', name: 'Test', prozessstatus: 'Geplant',
      ausEpa: 'Ja', beschreibung: 'Test', handlungsfeld: 'Wärme- und Kälteversorgung',
      aktivitaetsbereich: 'Information', prioritaet: '-', umsetzungszeitraum: '2026',
      startdatum: '14.01.2026', faelligkeitsdatum: '08.12.2026', budget: '-',
      verantwortlichkeit: '-', bemerkungen: '-', energietraeger: []
    }]
  }),
  makeEnergieplanung('EP-712', 'Adligenswil', 'Entwurf'),
  makeEnergieplanung('EP-713', 'Aesch', 'Verabschiedung'),
  makeEnergieplanung('EP-845', 'Aesch', 'Verabschiedung'),
  makeEnergieplanung('EP-842', 'Alberswil', 'Entwurf'),
  makeEnergieplanung('EP-838', 'Ballwil', 'Entwurf'),
  makeEnergieplanung('EP-843', 'Ballwil', 'Entwurf'),
  makeEnergieplanung('EP-839', 'Buchrain', 'Abschluss'),
  makeEnergieplanung('EP-772', 'Buttisholz', 'Entwurf'),
];

const contacts = [
  { vorname: 'Mathias', nachname: 'Benz', organisation: 'Benz AG', email: 'mathias.benz@lu.ch' },
  { vorname: 'testduplicate', nachname: 'testduplicate', organisation: 'duplicate', email: 'test@duplicate.ch' },
  { vorname: 'Markus', nachname: 'Fischer', organisation: 'Fischer GmbH', email: 'markus.fischer@demo.com' },
  { vorname: 'Meinrad', nachname: 'Franzen', organisation: 'Franzen GmbH', email: 'meinrad.franzen@lu.ch' },
  { vorname: 'Pino', nachname: 'Merino', organisation: 'Gemeinde Adligenswil', email: 'pino.merino@adligenswil.ch' },
  { vorname: 'Julia', nachname: 'Keller', organisation: 'Keller Consulting', email: 'julia.keller@demo.com' },
  { vorname: 'Sandro', nachname: 'Peter', organisation: 'Luzern', email: 'sandro.peter@lu.ch' },
  { vorname: 'Maxy', nachname: 'Mustery', organisation: 'MaxyrBude', email: 'Maxy.muster@sample.com' },
  { vorname: 'Roger', nachname: 'Meier', organisation: 'Meier Bau AG', email: 'roger.meier@demo.com' },
];

let nextPlanungSeq = 846;
let nextMassnahmeSeq = 1006;

/* ---------------------- APP STATE ---------------------- */

const state = {
  tab: 'planungen',
  view: 'list',            // list | detail | massnahmeForm | massnahmeEdit | massnahmeDetail | planungEdit | contactForm
  planungId: null,
  massnahmeId: null,
  collapsed: {},           // section-id -> bool
  list: { search: '', filter: '', sort: '' },
  massList: { search: '', filter: '' },
};

const $panel = document.getElementById('panel-content');

function val(v) { return (v === undefined || v === null || v === '') ? '-' : v; }
function findPlanung(id) { return planungen.find(p => p.id === id); }
function findMassnahme(planung, id) { return planung.massnahmen.find(m => m.id === id); }

/* ---------------------- TOAST ---------------------- */
let toastTimer = null;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

/* ---------------------- TABS ---------------------- */
document.querySelectorAll('.panel-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.panel-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.tab = btn.dataset.tab;
    if (state.tab === 'planungen') { state.view = 'list'; }
    render();
  });
});

document.querySelectorAll('[data-toast]').forEach(el => {
  el.addEventListener('click', () => toast(el.dataset.toast));
});

/* ---------------------- RENDER ROOT ---------------------- */
function render() {
  if (state.tab === 'planungen') {
    if (state.view === 'list') renderPlanungList();
    else if (state.view === 'detail') renderPlanungDetail();
    else if (state.view === 'planungEdit') renderPlanungEdit();
    else if (state.view === 'massnahmeForm') renderMassnahmeForm(false);
    else if (state.view === 'massnahmeEdit') renderMassnahmeForm(true);
    else if (state.view === 'massnahmeDetail') renderMassnahmeDetail();
  } else if (state.tab === 'kontakte') {
    if (state.view === 'contactForm') renderContactForm();
    else renderContactList();
  } else if (state.tab === 'zugriff') {
    renderZugriff();
  }
}

/* ---------------------- LIST: AKTUELLE PLANUNGEN ---------------------- */
function getFilteredPlanungen() {
  let list = planungen.slice();
  const q = state.list.search.trim().toLowerCase();
  if (q) {
    list = list.filter(p =>
      p.id.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      String(p.jahr).includes(q) ||
      p.gemeinde.toLowerCase().includes(q)
    );
  }
  if (state.list.filter) {
    list = list.filter(p => p.status === state.list.filter);
  }
  if (state.list.sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
  else if (state.list.sort === 'jahr') list.sort((a, b) => a.jahr - b.jahr);
  else if (state.list.sort === 'status') list.sort((a, b) => a.status.localeCompare(b.status));
  else list.sort((a, b) => a.id.localeCompare(b.id));
  return list;
}

function renderPlanungList() {
  const list = getFilteredPlanungen();
  $panel.innerHTML = `
    <h2 class="panel-title">Liste Planungen</h2>
    <div class="toolbar-row">
      <button class="btn-square" id="btn-add-planung" title="Neue Energieplanung">+</button>
      <div class="search-input-wrap">
        <input type="text" id="planung-search" placeholder="Name, ID, Jahr..." value="${escapeAttr(state.list.search)}">
        <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"/></svg>
      </div>
      <select class="select-input" id="planung-filter">
        <option value="">Filter...</option>
        ${STATUS_ORDER.map(s => `<option value="${s}" ${state.list.filter === s ? 'selected' : ''}>${s}</option>`).join('')}
      </select>
      <select class="select-input" id="planung-sort">
        <option value="">Sortieren...</option>
        <option value="name" ${state.list.sort === 'name' ? 'selected' : ''}>Name</option>
        <option value="jahr" ${state.list.sort === 'jahr' ? 'selected' : ''}>Jahr</option>
        <option value="status" ${state.list.sort === 'status' ? 'selected' : ''}>Status</option>
      </select>
    </div>
    <div class="card-list">
      ${list.length === 0 ? `<div class="empty-state">Keine Planungen gefunden.</div>` :
        list.map(p => `
        <div class="card" data-open-planung="${p.id}">
          <div class="card-left">
            <span class="card-id">${p.id}</span>
            <span class="card-title">${p.name}</span>
            <span class="card-meta"><span class="pill-tag">${p.jahr}</span><span class="card-muni">${p.gemeinde}</span></span>
          </div>
          <div class="card-right">
            <span class="badge-type">${p.typ}</span>
            <span class="status-text">${p.status}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  document.getElementById('btn-add-planung').addEventListener('click', () => {
    const id = `EP-${nextPlanungSeq++}`;
    const p = makeEnergieplanung(id, 'Neue Gemeinde', 'Entwurf');
    p.name = 'Neue Energieplanung';
    planungen.unshift(p);
    toast(`${id} wurde angelegt.`);
    state.planungId = id;
    state.view = 'detail';
    render();
  });
  document.getElementById('planung-search').addEventListener('input', e => {
    state.list.search = e.target.value;
    renderPlanungList();
    const el = document.getElementById('planung-search');
    el.focus(); el.setSelectionRange(el.value.length, el.value.length);
  });
  document.getElementById('planung-filter').addEventListener('change', e => { state.list.filter = e.target.value; renderPlanungList(); });
  document.getElementById('planung-sort').addEventListener('change', e => { state.list.sort = e.target.value; renderPlanungList(); });
  $panel.querySelectorAll('[data-open-planung]').forEach(card => {
    card.addEventListener('click', () => {
      state.planungId = card.dataset.openPlanung;
      state.view = 'detail';
      state.collapsed = {};
      render();
    });
  });
}

/* ---------------------- STEPPER ---------------------- */
function renderStepper(steps) {
  // steps: [{label, sub, state: 'done'|'current'|'upcoming'}]
  return `<div class="stepper">
    ${steps.map((s, i) => `
      ${i > 0 ? `<div class="step-line ${steps[i - 1].state === 'done' ? 'done' : ''}"></div>` : ''}
      <div class="step ${s.state}">
        <div class="step-circle">${s.state === 'done' ? checkSvg() : ''}</div>
        <div class="step-label">${s.label}</div>
        <div class="step-sub">${s.sub}</div>
      </div>
    `).join('')}
  </div>`;
}
function checkSvg() { return `<svg viewBox="0 0 24 24"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 20.6 7.4 19.2 6z"/></svg>`; }

/* ---------------------- BREADCRUMB ---------------------- */
function renderBreadcrumb(parts) {
  // parts: [{label, action}]  last part not a link
  return `<div class="breadcrumb">${parts.map((p, i) => {
    const isLast = i === parts.length - 1;
    return (isLast ? `<span>${p.label}</span>` : `<a data-crumb="${i}">${p.label}</a>`) +
      (isLast ? '' : `<span class="sep">&gt;</span>`);
  }).join('')}</div>`;
}
function bindBreadcrumb(handlers) {
  $panel.querySelectorAll('[data-crumb]').forEach(a => {
    a.addEventListener('click', () => handlers[Number(a.dataset.crumb)]());
  });
}

/* ---------------------- PLANUNG DETAIL ---------------------- */
function renderPlanungDetail() {
  const p = findPlanung(state.planungId);
  if (!p) { state.view = 'list'; render(); return; }

  const stepIdx = STATUS_ORDER.indexOf(p.status);
  const steps = STATUS_ORDER.map((label, i) => ({
    label,
    sub: i < stepIdx ? 'Erledigt' : (i === stepIdx ? 'In Bearbeitung' : 'Ausstehend'),
    state: i < stepIdx ? 'done' : (i === stepIdx ? 'current' : 'upcoming')
  }));

  const eb = p.epaBeratung, k = p.konto, ef = p.energieplanungFelder;
  const massList = getFilteredMassnahmen(p);

  $panel.innerHTML = `
    ${renderBreadcrumb([{ label: 'Liste Planungen' }, { label: p.id }])}
    <h2 class="panel-title" style="margin-bottom:4px;">${p.typ} ${p.gemeinde}</h2>
    <div class="process-label">Aktiver Prozess: EPA Beratung</div>
    ${renderStepper(steps)}

    ${section('epa', 'EPA Beratung', `
      ${field('Name EPA-Beratung', eb.name)}
      ${field('Prozessstatus', eb.prozessstatus, true)}
      ${field('Beratungsperson', eb.beratungsperson)}
      ${field('Datum Beratungsbeginn', eb.datumBeratungsbeginn)}
      ${field('Bedarf eines Energierichtplans?', eb.bedarfEnergierichtplan)}
      ${field('Bedarf einer Koordination mit weiteren Gemeinde(n)?', eb.bedarfKoordination)}
      ${field('Gebiete mit Koordinationsbedarf vorhanden?', eb.gebieteKoordinationsbedarf)}
      ${field('Förderabschlussformular', eb.foerderabschlussformular)}
    `)}

    ${section('konto', 'Kontoinformationen Förderbeitrag', `
      ${field('Kontoinhaber/in', k.kontoinhaber)}
      ${field('Adresse', k.adresse)}
      ${field('IBAN', k.iban)}
      ${field('Bankname', k.bankname)}
      ${field('Vermerk', k.vermerk)}
    `)}

    ${section('energieplanung', 'Energieplanung', `
      ${field('ID', p.id)}
      ${field('Name', p.name)}
      ${field('Planungstyp', p.typ)}
      ${field('Jahr', p.jahr)}
      ${field('Gemeinden', p.gemeinde)}
      ${field('Verantwortlichkeit', ef.verantwortlichkeit)}
      ${field('Netto-null Ziel', ef.nettoNullZiel)}
      ${field('Energieeffizienz Ziel', ef.energieeffizienzZiel)}
      ${field('Stromproduktion Ziel', ef.stromproduktionZiel)}
    `)}

    <div class="btn-row">
      <button class="btn btn-danger" id="btn-del-planung">Energieplanung löschen</button>
      <button class="btn btn-primary" id="btn-edit-planung">Energieplanung bearbeiten</button>
    </div>

    <h3 class="subheading">Massnahmen</h3>
    <div class="toolbar-row">
      <button class="btn-square" id="btn-add-massnahme" title="Neue Massnahme">+</button>
      <div class="search-input-wrap">
        <input type="text" id="massnahme-search" placeholder="ID, ES-Nr., Name..." value="${escapeAttr(state.massList.search)}">
        <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"/></svg>
      </div>
      <select class="select-input" id="massnahme-filter">
        <option value="">Filter...</option>
        <option value="Geplant" ${state.massList.filter === 'Geplant' ? 'selected' : ''}>Geplant</option>
        <option value="Umsetzung" ${state.massList.filter === 'Umsetzung' ? 'selected' : ''}>Umsetzung</option>
        <option value="Abschluss" ${state.massList.filter === 'Abschluss' ? 'selected' : ''}>Abschluss</option>
      </select>
    </div>
    ${massList.length === 0 ? `<div class="empty-state">Keine Massnahmen gefunden.</div>` :
      `<div class="card-list">${massList.map(m => `
        <div class="card" data-open-massnahme="${m.id}">
          <div class="card-left">
            <span class="card-id">${m.id}</span>
            <span class="card-title">${m.name}</span>
            <span class="card-meta"><span class="card-muni">${val(m.handlungsfeld)}</span></span>
          </div>
          <div class="card-right">
            <span class="status-text">${m.prozessstatus}</span>
          </div>
        </div>
      `).join('')}</div>`}

    <div class="btn-row right" style="margin-top:18px;">
      <button class="btn btn-secondary" id="btn-import-massnahmen">Massnahmen importieren</button>
      <button class="btn btn-secondary" id="btn-export-massnahmen">Export Massnahmen CSV</button>
    </div>
  `;

  bindBreadcrumb([() => { state.view = 'list'; render(); }]);
  bindSectionToggles();

  document.getElementById('btn-del-planung').addEventListener('click', () => {
    if (confirm(`Energieplanung ${p.id} wirklich löschen?`)) {
      const idx = planungen.findIndex(x => x.id === p.id);
      planungen.splice(idx, 1);
      toast(`${p.id} wurde gelöscht.`);
      state.view = 'list';
      render();
    }
  });
  document.getElementById('btn-edit-planung').addEventListener('click', () => { state.view = 'planungEdit'; render(); });
  document.getElementById('btn-add-massnahme').addEventListener('click', () => {
    state.massnahmeId = null;
    state.view = 'massnahmeForm';
    render();
  });
  document.getElementById('massnahme-search').addEventListener('input', e => {
    state.massList.search = e.target.value;
    renderPlanungDetail();
    const el = document.getElementById('massnahme-search');
    el.focus(); el.setSelectionRange(el.value.length, el.value.length);
  });
  document.getElementById('massnahme-filter').addEventListener('change', e => { state.massList.filter = e.target.value; renderPlanungDetail(); });
  document.getElementById('btn-import-massnahmen').addEventListener('click', () => toast('Import ist in diesem Prototyp nicht verfügbar.'));
  document.getElementById('btn-export-massnahmen').addEventListener('click', () => exportMassnahmenCsv(p));
  $panel.querySelectorAll('[data-open-massnahme]').forEach(card => {
    card.addEventListener('click', () => {
      state.massnahmeId = card.dataset.openMassnahme;
      state.view = 'massnahmeDetail';
      render();
    });
  });
}

function getFilteredMassnahmen(p) {
  let list = p.massnahmen.slice();
  const q = state.massList.search.trim().toLowerCase();
  if (q) list = list.filter(m => m.id.toLowerCase().includes(q) || m.name.toLowerCase().includes(q) || (m.esNr || '').toLowerCase().includes(q));
  if (state.massList.filter) list = list.filter(m => m.prozessstatus === state.massList.filter);
  return list;
}

function exportMassnahmenCsv(p) {
  const headers = ['ID', 'ES-Nr.', 'Name', 'Prozessstatus', 'Handlungsfeld', 'Aktivitätsbereich', 'Priorität', 'Startdatum', 'Fälligkeitsdatum', 'Budget'];
  const rows = p.massnahmen.map(m => [m.id, m.esNr, m.name, m.prozessstatus, m.handlungsfeld, m.aktivitaetsbereich, m.prioritaet, m.startdatum, m.faelligkeitsdatum, m.budget]);
  const csv = [headers, ...rows].map(r => r.map(c => `"${String(val(c)).replace(/"/g, '""')}"`).join(';')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `Massnahmen_${p.id}.csv`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('CSV wurde exportiert.');
}

/* helpers for sections/fields */
function section(id, title, bodyHtml) {
  const collapsed = !!state.collapsed[id];
  return `<div class="section ${collapsed ? 'collapsed' : ''}" data-section="${id}">
    <div class="section-header" data-section-toggle="${id}">
      <h3>${title}</h3>
      <span class="section-toggle">▲</span>
    </div>
    <div class="section-body">${bodyHtml}</div>
  </div>`;
}
function field(label, value, withInfo) {
  return `<div class="field-row">
    <div class="field-label">${label}${withInfo ? '<span class="info-icon">i</span>' : ''}</div>
    <div class="field-value">${val(value)}</div>
  </div>`;
}
function bindSectionToggles() {
  $panel.querySelectorAll('[data-section-toggle]').forEach(h => {
    h.addEventListener('click', () => {
      const id = h.dataset.sectionToggle;
      state.collapsed[id] = !state.collapsed[id];
      const secEl = $panel.querySelector(`[data-section="${id}"]`);
      secEl.classList.toggle('collapsed', !!state.collapsed[id]);
    });
  });
}

/* ---------------------- PLANUNG EDIT ---------------------- */
function renderPlanungEdit() {
  const p = findPlanung(state.planungId);
  if (!p) { state.view = 'list'; render(); return; }
  const ef = p.energieplanungFelder;
  $panel.innerHTML = `
    ${renderBreadcrumb([{ label: 'Liste Planungen' }, { label: p.id, }, { label: 'Bearbeiten' }])}
    <h2 class="form-heading">Energieplanung bearbeiten</h2>
    <div class="form-field"><label>Name</label><input type="text" id="f-name" value="${escapeAttr(p.name)}"></div>
    <div class="form-field"><label>Gemeinden</label><input type="text" id="f-gemeinde" value="${escapeAttr(p.gemeinde)}"></div>
    <div class="form-field"><label>Jahr</label><input type="text" id="f-jahr" value="${escapeAttr(p.jahr)}"></div>
    <div class="form-field"><label>Status</label>
      <select id="f-status">${STATUS_ORDER.map(s => `<option value="${s}" ${p.status === s ? 'selected' : ''}>${s}</option>`).join('')}</select>
    </div>
    <div class="form-field"><label>Verantwortlichkeit</label><input type="text" id="f-verantwortlichkeit" value="${escapeAttr(fixDash(ef.verantwortlichkeit))}"></div>
    <div class="form-field"><label>Netto-null Ziel</label><input type="text" id="f-netto" value="${escapeAttr(fixDash(ef.nettoNullZiel))}"></div>
    <div class="form-field"><label>Energieeffizienz Ziel</label><input type="text" id="f-effizienz" value="${escapeAttr(fixDash(ef.energieeffizienzZiel))}"></div>
    <div class="form-field"><label>Stromproduktion Ziel</label><input type="text" id="f-strom" value="${escapeAttr(fixDash(ef.stromproduktionZiel))}"></div>
    <div class="btn-row right">
      <button class="btn btn-outline" id="btn-cancel">Abbrechen</button>
      <button class="btn btn-primary" id="btn-save">Speichern</button>
    </div>
  `;
  bindBreadcrumb([() => { state.view = 'list'; render(); }, () => { state.view = 'detail'; render(); }]);
  document.getElementById('btn-cancel').addEventListener('click', () => { state.view = 'detail'; render(); });
  document.getElementById('btn-save').addEventListener('click', () => {
    p.name = document.getElementById('f-name').value || p.name;
    p.gemeinde = document.getElementById('f-gemeinde').value || p.gemeinde;
    p.jahr = document.getElementById('f-jahr').value || p.jahr;
    p.status = document.getElementById('f-status').value;
    ef.verantwortlichkeit = document.getElementById('f-verantwortlichkeit').value || '-';
    ef.nettoNullZiel = document.getElementById('f-netto').value || '-';
    ef.energieeffizienzZiel = document.getElementById('f-effizienz').value || '-';
    ef.stromproduktionZiel = document.getElementById('f-strom').value || '-';
    p.epaBeratung.prozessstatus = p.status;
    toast('Energieplanung wurde gespeichert.');
    state.view = 'detail';
    render();
  });
}
function fixDash(v) { return v === '-' ? '' : v; }

/* ---------------------- MASSNAHME FORM (add / edit) ---------------------- */
function renderMassnahmeForm(isEdit) {
  const p = findPlanung(state.planungId);
  if (!p) { state.view = 'list'; render(); return; }
  const m = isEdit ? findMassnahme(p, state.massnahmeId) : null;

  const contactOptions = contacts.map(c => `<option>${c.vorname} ${c.nachname} — ${c.organisation}</option>`).join('');

  $panel.innerHTML = `
    ${renderBreadcrumb(isEdit
      ? [{ label: 'Liste Planungen' }, { label: p.id }, { label: m.id }]
      : [{ label: 'Liste Planungen' }, { label: p.id }])}
    <div class="form-eyebrow">${isEdit ? 'Massnahme bearbeiten' : 'Neue Massnahme'}</div>
    <h2 class="form-heading">Massnahme</h2>

    <div class="form-field"><label>Name<span class="req">*</span></label>
      <input type="text" id="mf-name" placeholder="Name der Massnahme" value="${escapeAttr(m ? m.name : '')}"></div>
    <div class="form-field"><label>ES-NR.</label>
      <input type="text" id="mf-esnr" placeholder="bspw. 1.2.1" value="${escapeAttr(m && m.esNr !== '-' ? m.esNr : '')}"></div>
    <div class="form-field"><label>Beschreibung<span class="req">*</span></label>
      <textarea id="mf-beschreibung" placeholder="Detailbeschrieb zur Massnahme">${escapeHtml(m ? m.beschreibung : '')}</textarea></div>
    <div class="form-field"><label>Massnahme aus EPA<span class="req">*</span></label>
      <select id="mf-ausepa">
        <option value="Ja" ${!m || m.ausEpa === 'Ja' ? 'selected' : ''}>Ja</option>
        <option value="Nein" ${m && m.ausEpa === 'Nein' ? 'selected' : ''}>Nein</option>
      </select></div>
    <div class="form-field"><label>Handlungsfeld<span class="req">*</span></label>
      <select id="mf-handlungsfeld">
        <option value="" ${!m ? 'selected' : ''} disabled>Handlungsfeld auswählen...</option>
        ${['Wärme- und Kälteversorgung', 'Stromversorgung', 'Mobilität', 'Gebäude', 'Information'].map(h =>
          `<option ${m && m.handlungsfeld === h ? 'selected' : ''}>${h}</option>`).join('')}
      </select></div>
    <div class="form-field"><label>Aktivitätsbereich<span class="req">*</span></label>
      <select id="mf-aktivitaetsbereich">
        <option value="" ${!m ? 'selected' : ''} disabled>Aktivitätsbereich auswählen...</option>
        ${['Information', 'Beratung', 'Förderung', 'Vorschrift', 'Planung'].map(a =>
          `<option ${m && m.aktivitaetsbereich === a ? 'selected' : ''}>${a}</option>`).join('')}
      </select></div>
    <div class="form-field"><label>Priorität</label>
      <select id="mf-prioritaet">
        <option value="" ${!m || m.prioritaet === '-' ? 'selected' : ''}>Auswählen</option>
        ${['Hoch', 'Mittel', 'Tief'].map(pr => `<option ${m && m.prioritaet === pr ? 'selected' : ''}>${pr}</option>`).join('')}
      </select></div>
    <div class="form-field"><label>Startdatum<span class="req">*</span></label>
      <div class="date-field-wrap"><input type="text" id="mf-start" placeholder="dd.MM.yyyy" value="${escapeAttr(m ? m.startdatum : '')}"><span class="cal-icon">📅</span></div></div>
    <div class="form-field"><label>Fälligkeitsdatum<span class="req">*</span></label>
      <div class="date-field-wrap"><input type="text" id="mf-due" placeholder="dd.MM.yyyy" value="${escapeAttr(m ? m.faelligkeitsdatum : '')}"><span class="cal-icon">📅</span></div></div>
    <div class="form-field"><label>Budget in CHF<span class="req">*</span></label>
      <input type="text" id="mf-budget" placeholder="Budget in CHF" value="${escapeAttr(m && m.budget !== '-' ? m.budget : '')}"></div>
    <div class="form-field"><label>Kontaktperson</label>
      <div class="contact-select-row">
        <select id="mf-kontakt"><option value="">Kontakt auswählen</option>${contactOptions}</select>
        <button type="button" class="btn-square" id="mf-add-contact" title="Neuen Kontakt erfassen">+</button>
      </div></div>
    <div class="form-field"><label>Weitere Bemerkungen</label>
      <textarea id="mf-bemerkungen" placeholder="Stand der Massnahme...">${escapeHtml(m && m.bemerkungen !== '-' ? m.bemerkungen : '')}</textarea></div>

    <div class="btn-row right">
      <button class="btn btn-outline" id="btn-cancel">Abbrechen</button>
      <button class="btn btn-primary" id="btn-save">Speichern</button>
    </div>
  `;

  bindBreadcrumb(isEdit
    ? [() => { state.view = 'list'; render(); }, () => { state.view = 'detail'; render(); }]
    : [() => { state.view = 'list'; render(); }]);

  document.getElementById('btn-cancel').addEventListener('click', () => {
    state.view = isEdit ? 'massnahmeDetail' : 'detail';
    render();
  });
  document.getElementById('mf-add-contact').addEventListener('click', () => toast('Kontakterfassung ist in diesem Prototyp nicht verfügbar.'));
  document.getElementById('btn-save').addEventListener('click', () => {
    const name = document.getElementById('mf-name').value.trim();
    const beschreibung = document.getElementById('mf-beschreibung').value.trim();
    const handlungsfeld = document.getElementById('mf-handlungsfeld').value;
    const aktivitaetsbereich = document.getElementById('mf-aktivitaetsbereich').value;
    const start = document.getElementById('mf-start').value.trim();
    const due = document.getElementById('mf-due').value.trim();
    const budget = document.getElementById('mf-budget').value.trim();
    if (!name || !beschreibung || !handlungsfeld || !aktivitaetsbereich || !start || !due || !budget) {
      toast('Bitte alle Pflichtfelder (*) ausfüllen.');
      return;
    }
    const data = {
      esNr: document.getElementById('mf-esnr').value.trim() || '-',
      name, beschreibung,
      ausEpa: document.getElementById('mf-ausepa').value,
      handlungsfeld, aktivitaetsbereich,
      prioritaet: document.getElementById('mf-prioritaet').value || '-',
      startdatum: start, faelligkeitsdatum: due, budget,
      bemerkungen: document.getElementById('mf-bemerkungen').value.trim() || '-',
      umsetzungszeitraum: String(p.jahr),
      verantwortlichkeit: m ? m.verantwortlichkeit : '-',
      prozessstatus: m ? m.prozessstatus : 'Geplant',
      energietraeger: m ? m.energietraeger : []
    };
    if (isEdit) {
      Object.assign(m, data);
      toast(`${m.id} wurde gespeichert.`);
      state.view = 'massnahmeDetail';
    } else {
      const id = `M-${nextMassnahmeSeq++}`;
      p.massnahmen.push(Object.assign({ id }, data));
      state.massnahmeId = id;
      toast(`${id} wurde angelegt.`);
      state.view = 'massnahmeDetail';
    }
    render();
  });
}

/* ---------------------- MASSNAHME DETAIL ---------------------- */
function renderMassnahmeDetail() {
  const p = findPlanung(state.planungId);
  if (!p) { state.view = 'list'; render(); return; }
  const m = findMassnahme(p, state.massnahmeId);
  if (!m) { state.view = 'detail'; render(); return; }

  const order = ['Geplant', 'Umsetzung', 'Abschluss'];
  const idx = order.indexOf(m.prozessstatus);
  const steps = order.map((label, i) => ({
    label,
    sub: i < idx ? 'Erledigt' : (i === idx ? 'In Bearbeitung' : 'Ausstehend'),
    state: i < idx ? 'done' : (i === idx ? 'current' : 'upcoming')
  }));

  $panel.innerHTML = `
    ${renderBreadcrumb([{ label: 'Liste Planungen' }, { label: p.id }, { label: m.id }])}
    <h2 class="panel-title" style="margin-bottom:4px;">Massnahme</h2>
    <div class="process-label">Aktiver Prozess: Prozess Massnahme</div>
    ${renderStepper(steps)}

    ${field('ID', m.id)}
    ${field('ES-Nr.', m.esNr)}
    ${field('Name', m.name)}
    ${field('Prozessstatus', m.prozessstatus, true)}
    ${field('Massnahme aus EPA-Beratung?', m.ausEpa)}
    ${field('Beschreibung', m.beschreibung)}
    ${field('Handlungsfeld', m.handlungsfeld)}
    ${field('Aktivitätsbereich', m.aktivitaetsbereich)}
    ${field('Priorität', m.prioritaet)}
    ${field('Umsetzungszeitraum', m.umsetzungszeitraum)}
    ${field('Startdatum', m.startdatum)}
    ${field('Fälligkeitsdatum', m.faelligkeitsdatum)}
    ${field('Budget', m.budget)}
    ${field('Verantwortlichkeit', m.verantwortlichkeit)}
    ${field('Weitere Bemerkungen', m.bemerkungen)}

    <h3 class="subheading">Energieträger</h3>
    <table class="data-table">
      <thead><tr>
        <th>ID <span class="sort-arrow">↕</span></th>
        <th>Spezifikation <span class="sort-arrow">↕</span></th>
        <th>Typ <span class="sort-arrow">↕</span></th>
        <th>Priorität <span class="sort-arrow">↕</span></th>
      </tr></thead>
      <tbody>
        ${m.energietraeger.length === 0
          ? `<tr class="table-empty-row"><td colspan="4">Keine Einträge vorhanden.</td></tr>`
          : m.energietraeger.map(e => `<tr><td>${e.id}</td><td>${e.spez}</td><td>${e.typ}</td><td>${e.prioritaet}</td></tr>`).join('')}
      </tbody>
    </table>

    <div class="btn-row">
      <button class="btn btn-danger" id="btn-del-massnahme">Massnahme Löschen</button>
      <div style="display:flex; gap:12px;">
        <button class="btn btn-outline" id="btn-geodaten">Geodaten editieren</button>
        <button class="btn btn-primary" id="btn-edit-massnahme">Massnahme bearbeiten</button>
      </div>
    </div>
  `;

  bindBreadcrumb([
    () => { state.view = 'list'; render(); },
    () => { state.view = 'detail'; render(); }
  ]);

  document.getElementById('btn-del-massnahme').addEventListener('click', () => {
    if (confirm(`Massnahme ${m.id} wirklich löschen?`)) {
      p.massnahmen = p.massnahmen.filter(x => x.id !== m.id);
      toast(`${m.id} wurde gelöscht.`);
      state.view = 'detail';
      render();
    }
  });
  document.getElementById('btn-geodaten').addEventListener('click', () => toast('Geodaten-Editor ist in diesem Prototyp nicht verfügbar (Karte ist statisch).'));
  document.getElementById('btn-edit-massnahme').addEventListener('click', () => { state.view = 'massnahmeEdit'; render(); });
}

/* ---------------------- KONTAKTE ---------------------- */
function renderContactList() {
  const q = (state.kontakteSearch || '').trim().toLowerCase();
  let list = contacts.slice();
  if (q) {
    list = list.filter(c =>
      c.vorname.toLowerCase().includes(q) || c.nachname.toLowerCase().includes(q) ||
      c.organisation.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  }
  $panel.innerHTML = `
    <h2 class="panel-title">Kontakte</h2>
    <div class="toolbar-row">
      <button class="btn-square" id="btn-add-contact" title="Neuer Kontakt">+</button>
      <div class="search-input-wrap">
        <input type="text" id="contact-search" placeholder="Organisation, Vorname, Nachname, E-Mail..." value="${escapeAttr(state.kontakteSearch || '')}">
        <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"/></svg>
      </div>
    </div>
    <div class="card-list">
      ${list.length === 0 ? `<div class="empty-state">Keine Kontakte gefunden.</div>` :
        list.map((c, i) => `
        <div class="contact-card">
          <div class="contact-name">${c.vorname} ${c.nachname}</div>
          <div class="contact-row">
            <span class="contact-chip"><svg viewBox="0 0 24 24"><path d="M12 7 2 12v10h20V12L12 7zm0 2.2 8 4V20H4v-6.8l8-4zM6 4h12v2H6V4z"/></svg>${c.organisation}</span>
            <span class="contact-chip mail"><svg viewBox="0 0 24 24"><path d="M4 4h16v16H4V4zm2 2v.01L12 12l6-5.99V6H6zm12 2.24-6 5.99-6-5.99V18h12V8.24z"/></svg>${c.email}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  document.getElementById('contact-search').addEventListener('input', e => {
    state.kontakteSearch = e.target.value;
    renderContactList();
    const el = document.getElementById('contact-search');
    el.focus(); el.setSelectionRange(el.value.length, el.value.length);
  });
  document.getElementById('btn-add-contact').addEventListener('click', () => { state.view = 'contactForm'; render(); });
}

function renderContactForm() {
  $panel.innerHTML = `
    ${renderBreadcrumb([{ label: 'Kontakte' }, { label: 'Neuer Kontakt' }])}
    <h2 class="form-heading">Neuer Kontakt</h2>
    <div class="form-field"><label>Vorname<span class="req">*</span></label><input type="text" id="cf-vorname"></div>
    <div class="form-field"><label>Nachname<span class="req">*</span></label><input type="text" id="cf-nachname"></div>
    <div class="form-field"><label>Organisation</label><input type="text" id="cf-organisation"></div>
    <div class="form-field"><label>E-Mail<span class="req">*</span></label><input type="text" id="cf-email" placeholder="name@beispiel.ch"></div>
    <div class="btn-row right">
      <button class="btn btn-outline" id="btn-cancel">Abbrechen</button>
      <button class="btn btn-primary" id="btn-save">Speichern</button>
    </div>
  `;
  bindBreadcrumb([() => { state.view = 'list'; render(); }]);
  document.getElementById('btn-cancel').addEventListener('click', () => { state.view = 'list'; render(); });
  document.getElementById('btn-save').addEventListener('click', () => {
    const vorname = document.getElementById('cf-vorname').value.trim();
    const nachname = document.getElementById('cf-nachname').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    if (!vorname || !nachname || !email) { toast('Bitte alle Pflichtfelder (*) ausfüllen.'); return; }
    contacts.push({ vorname, nachname, organisation: document.getElementById('cf-organisation').value.trim() || '-', email });
    toast('Kontakt wurde angelegt.');
    state.view = 'list';
    render();
  });
}

/* ---------------------- ZUGRIFFSVERWALTUNG (placeholder) ---------------------- */
function renderZugriff() {
  $panel.innerHTML = `
    <h2 class="panel-title">Zugriffsverwaltung</h2>
    <div class="empty-state">Dieser Bereich ist nicht Teil dieses Prototyps.</div>
  `;
}

/* ---------------------- UTIL ---------------------- */
function escapeHtml(s) { return String(s == null ? '' : s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
function escapeAttr(s) { return escapeHtml(s).replace(/"/g, '&quot;'); }

/* ---------------------- INIT ---------------------- */
render();
