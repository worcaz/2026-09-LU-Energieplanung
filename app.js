/* =============================================================
   Energieplanung Prototyp — App logic (mock data, client-side only)
   ============================================================= */

/* ---------------------- MOCK DATA ---------------------- */

const STATUS_ORDER = ['Entwurf', 'Verabschiedung', 'Fördergesuch', 'Abschluss'];
const MASSNAHME_STATUS = ['Geplant', 'Umsetzung', 'Abschluss'];
const HANDLUNGSFELDER = ['Übergeordnete Massnahmen / Strategien', 'Wärme- und Kälteversorgung', 'Energieeffizienz', 'Ausbaupfad erneuerbare Energien', 'andere'];
const AKTIVITAETSBEREICHE = ['Strategie / Planung', 'Information', 'Beratung', 'Förderung', 'Vorschrift', 'Vollzug', 'Vorbildfunktion'];
const PRIORITAETEN = ['Hoch', 'Mittel', 'Tief'];
const ENERGIETRAEGER_TYPEN = [
  'Hochwertige Abwärme (Vorlauftemperatur >= 60°C)',
  'Niederwertige Abwärme (Vorlauftemperatur < 60°C)',
  'Oberflächenwasser',
  'Grundwasser',
  'Erdwärme',
  'Holz',
  'Umgebungsluft',
  'Sonne',
  'Biomasse',
  'Fossile Energieträger',
  'Elektrizität',
  'Massnahme ohne Energieträger',
  'nicht definiert',
  'andere',
  'unbekannt'
];

const MASSNAHME_VORLAGEN = {
  'Übergeordnete Massnahmen / Strategien': [
    { name: 'Energieleitbild der Gemeinde', beschreibung: 'Erarbeitung eines übergeordneten Energie- und Klimaleitbilds für die Gemeinde.' },
    { name: 'Energieapéro für die Bevölkerung', beschreibung: 'Durchführung jährlicher Informationsanlässe zu Energiethemen.' },
    { name: 'Schulprojekt Energie und Klima', beschreibung: 'Sensibilisierungsprojekt an der Volksschule zum Thema Energie und Klima.' },
    { name: 'Newsletter Energieplanung', beschreibung: 'Regelmässige Information der Bevölkerung über den Stand der Energieplanung.' },
    { name: 'Controlling Energieplanung', beschreibung: 'Jährliches Monitoring und Controlling der Umsetzung der Energieplanungsmassnahmen.' }
  ],
  'Wärme- und Kälteversorgung': [
    { name: 'Fernwärmeverbund Zentrum', beschreibung: 'Ausbau des Fernwärmenetzes im Ortszentrum zur Ablösung fossiler Heizsysteme.' },
    { name: 'Wärmeverbund Schulanlage', beschreibung: 'Realisierung eines Wärmeverbunds für die Schulanlage und angrenzende Liegenschaften.' },
    { name: 'Abwärmenutzung ARA', beschreibung: 'Nutzung der Abwärme der Abwasserreinigungsanlage für ein lokales Wärmenetz.' },
    { name: 'Erdsondenfeld Neubaugebiet', beschreibung: 'Erschliessung eines Erdsondenfelds zur Wärmeversorgung des geplanten Neubaugebiets.' },
    { name: 'Ersatz Ölheizungen Gemeindebauten', beschreibung: 'Ersatz bestehender Ölheizungen in kommunalen Liegenschaften durch Wärmepumpen.' }
  ],
  'Energieeffizienz': [
    { name: 'Energetische Sanierung Gemeindeliegenschaften', beschreibung: 'Umsetzung energetischer Sanierungen an kommunalen Gebäuden.' },
    { name: 'Energieberatung für Hauseigentümer', beschreibung: 'Aufbau eines Beratungsangebots für energetische Sanierungen bei Privaten.' },
    { name: 'LED-Sanierung Strassenbeleuchtung', beschreibung: 'Umstellung der öffentlichen Strassenbeleuchtung auf LED-Technologie.' },
    { name: 'Minergie-Standard für Neubauten', beschreibung: 'Vorgabe des Minergie-Standards bei kommunalen Neubauprojekten.' }
  ],
  'Ausbaupfad erneuerbare Energien': [
    { name: 'Photovoltaik auf Gemeindebauten', beschreibung: 'Installation von Photovoltaikanlagen auf geeigneten kommunalen Dächern.' },
    { name: 'Solaroffensive Gewerbezone', beschreibung: 'Förderung von Photovoltaikanlagen in der Gewerbezone.' },
    { name: 'Speicherkonzept erneuerbarer Strom', beschreibung: 'Erarbeitung eines Konzepts für lokale Stromspeicherlösungen.' },
    { name: 'Potenzialstudie Biomasse', beschreibung: 'Abklärung des lokalen Potenzials zur energetischen Nutzung von Biomasse.' },
    { name: 'Kleinwasserkraft Gemeindebach', beschreibung: 'Prüfung der Realisierbarkeit eines Kleinwasserkraftwerks am Gemeindebach.' },
    { name: 'Potenzialabklärung Tiefengeothermie', beschreibung: 'Untersuchung des Tiefengeothermie-Potenzials im Gemeindegebiet.' }
  ],
  'andere': [
    { name: 'Ausbau Ladeinfrastruktur', beschreibung: 'Errichtung öffentlicher Ladestationen für Elektrofahrzeuge.' },
    { name: 'Förderung Langsamverkehr', beschreibung: 'Ausbau von Velowegen und Fussgängerzonen im Gemeindegebiet.' },
    { name: 'Mobilitätsmanagement Verwaltung', beschreibung: 'Einführung eines betrieblichen Mobilitätsmanagements für die Gemeindeverwaltung.' },
    { name: 'Elektrifizierung Gemeindefahrzeuge', beschreibung: 'Ersatz des kommunalen Fuhrparks durch Elektrofahrzeuge.' },
    { name: 'GEAK-Kampagne', beschreibung: 'Sensibilisierungskampagne zum Gebäudeenergieausweis der Kantone (GEAK).' },
    { name: 'Sanierungsverpflichtung Altbauten', beschreibung: 'Prüfung einer Sanierungsverpflichtung für ältere Gebäude im Baubewilligungsverfahren.' },
    { name: 'Energiekonzept Arealentwicklung', beschreibung: 'Erarbeitung eines Energiekonzepts für ein neues Wohn- und Gewerbeareal.' }
  ]
};

const NETTO_NULL_ZIELE = [
  'Netto-null Treibhausgasemissionen bis spätestens 2050 erreichen.',
  'Klimaneutrale Gemeindeverwaltung bis 2040 anstreben.',
  'Reduktion der CO2-Emissionen um 60 % bis 2035.',
  'Fossilfreie Wärmeversorgung im ganzen Gemeindegebiet bis 2045.',
  'Netto-null Ziel gemäss kantonaler Energiestrategie 2050.',
  'CO2-Neutralität der öffentlichen Gebäude bis 2035.'
];
const ENERGIEEFFIZIENZ_ZIELE = [
  'Senkung des Energieverbrauchs pro Kopf um 30 % bis 2035.',
  'Sanierungsrate der Gebäude auf 2 % pro Jahr erhöhen.',
  'Energetische Vorbildfunktion der Gemeindebauten stärken.',
  'Reduktion des Wärmebedarfs im Gebäudepark um 25 %.',
  'Steigerung der Energieeffizienz in Gewerbe und Industrie.',
  'Minergie-Standard bei allen Neubauten verbindlich vorschreiben.'
];
const STROMPRODUKTION_ZIELE = [
  'Ausbau der Photovoltaik auf 50 % des Strombedarfs bis 2040.',
  'Deckung des Gemeindebedarfs durch erneuerbaren Strom bis 2035.',
  'Verdopplung der lokalen Solarstromproduktion bis 2030.',
  'Förderung von PV-Anlagen auf allen geeigneten Dachflächen.',
  'Eigenversorgungsgrad mit erneuerbarem Strom auf 40 % steigern.',
  'Ausbau erneuerbarer Stromproduktion um 5 GWh bis 2035.'
];

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

const contacts = [
  { vorname: 'Mathias', nachname: 'Benz', organisation: 'Benz AG', email: 'mathias.benz@lu.ch' },
  { vorname: 'Sabine', nachname: 'Grüter', organisation: 'Grüter Elektroplanung AG', email: 'sabine.grueter@demo.com' },
  { vorname: 'Markus', nachname: 'Fischer', organisation: 'Fischer GmbH', email: 'markus.fischer@demo.com' },
  { vorname: 'Meinrad', nachname: 'Franzen', organisation: 'Franzen GmbH', email: 'meinrad.franzen@lu.ch' },
  { vorname: 'Pino', nachname: 'Merino', organisation: 'Gemeinde Adligenswil', email: 'pino.merino@adligenswil.ch' },
  { vorname: 'Julia', nachname: 'Keller', organisation: 'Keller Consulting', email: 'julia.keller@demo.com' },
  { vorname: 'Sandro', nachname: 'Peter', organisation: 'Luzern', email: 'sandro.peter@lu.ch' },
  { vorname: 'Beat', nachname: 'Krummenacher', organisation: 'Krummenacher Bauphysik GmbH', email: 'beat.krummenacher@demo.com' },
  { vorname: 'Roger', nachname: 'Meier', organisation: 'Meier Bau AG', email: 'roger.meier@demo.com' },
];

let nextPlanungSeq = 846;
let nextMassnahmeSeq = 1000;

/* ---------------------- DUMMY-MASSNAHMEN GENERATOR ---------------------- */
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[randomInt(0, arr.length - 1)]; }
function pad2(n) { return String(n).padStart(2, '0'); }
function formatDate(d) { return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}`; }
function formatChf(n) { return `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "'")} CHF`; }
function randomDate(yearFrom, yearTo) { return new Date(randomInt(yearFrom, yearTo), randomInt(0, 11), randomInt(1, 28)); }
function addDays(date, days) { const d = new Date(date); d.setDate(d.getDate() + days); return d; }

function buildEnergietraeger(count) {
  const rows = [];
  for (let i = 1; i <= count; i++) {
    const typ = pick(ENERGIETRAEGER_TYPEN);
    rows.push({
      id: `ET-${i}`,
      spez: typ, // Spezifikation = Name des Energieträgers
      typ,
      prioritaet: pick(PRIORITAETEN)
    });
  }
  return rows;
}

function formatContactLabel(contact) {
  return contact.organisation !== '-' ? `${contact.vorname} ${contact.nachname} (${contact.organisation})` : `${contact.vorname} ${contact.nachname}`;
}

function buildMassnahme(index, planung) {
  const handlungsfeld = pick(HANDLUNGSFELDER);
  const vorlage = pick(MASSNAHME_VORLAGEN[handlungsfeld]);
  const prozessstatus = pick(['Geplant', 'Geplant', 'Geplant', 'Umsetzung', 'Umsetzung', 'Abschluss']);

  // Start-/Fälligkeitsdatum korrelieren mit dem Prozessstatus: abgeschlossene Massnahmen
  // liegen bereits vollständig in der Vergangenheit, ein Teil der laufenden/geplanten
  // Massnahmen ist absichtlich überfällig, um realistische Reporting-Daten zu erhalten.
  const today = new Date();
  let start, due;
  if (prozessstatus === 'Abschluss') {
    start = randomDate(planung.jahr - 2, planung.jahr);
    due = addDays(start, randomInt(60, 500));
    if (due > today) due = addDays(today, -randomInt(5, 200));
  } else {
    start = randomDate(planung.jahr - 1, planung.jahr);
    const overdueChance = prozessstatus === 'Umsetzung' ? 0.25 : 0.12;
    due = Math.random() < overdueChance ? addDays(today, -randomInt(5, 180)) : addDays(today, randomInt(10, 500));
    if (due < start) due = addDays(start, randomInt(30, 400));
  }

  const contact = Math.random() < 0.8 ? pick(contacts) : null;
  return {
    id: `M-${nextMassnahmeSeq++}`,
    esNr: Math.random() < 0.85 ? `${randomInt(1, 5)}.${randomInt(1, 4)}.${index + 1}` : '-',
    name: vorlage.name,
    prozessstatus,
    ausEpa: pick(['Ja', 'Ja', 'Ja', 'Nein']),
    beschreibung: vorlage.beschreibung,
    handlungsfeld,
    aktivitaetsbereich: pick(AKTIVITAETSBEREICHE),
    prioritaet: Math.random() < 0.75 ? pick(PRIORITAETEN) : '-',
    umsetzungszeitraum: Math.random() < 0.8 ? String(planung.jahr) : `${planung.jahr}–${planung.jahr + 2}`,
    startdatum: formatDate(start),
    faelligkeitsdatum: formatDate(due),
    budget: Math.random() < 0.9 ? formatChf(randomInt(2, 400) * 500) : '-',
    verantwortlichkeit: contact ? formatContactLabel(contact) : '-',
    bemerkungen: '-',
    // Energieträger sind nur bei Handlungsfeld "Wärme- und Kälteversorgung" relevant
    energietraeger: handlungsfeld === 'Wärme- und Kälteversorgung' && Math.random() < 0.6 ? buildEnergietraeger(randomInt(1, 2)) : []
  };
}

function buildMassnahmen(planung) {
  const count = randomInt(0, 25);
  const list = [];
  for (let i = 0; i < count; i++) list.push(buildMassnahme(i, planung));
  return list;
}

function fillPlanungDetails(planung) {
  const beginn = randomDate(planung.jahr - 2, planung.jahr);
  Object.assign(planung.epaBeratung, {
    beratungsperson: formatContactLabel(pick(contacts)),
    datumBeratungsbeginn: formatDate(beginn),
    bedarfEnergierichtplan: pick(['Ja', 'Nein']),
    bedarfKoordination: pick(['Ja', 'Nein']),
    gebieteKoordinationsbedarf: pick(['Ja', 'Nein']),
  });
  Object.assign(planung.energieplanungFelder, {
    verantwortlichkeit: formatContactLabel(pick(contacts)),
    nettoNullZiel: pick(NETTO_NULL_ZIELE),
    energieeffizienzZiel: pick(ENERGIEEFFIZIENZ_ZIELE),
    stromproduktionZiel: pick(STROMPRODUKTION_ZIELE),
  });
}

const planungen = [
  makeEnergieplanung('EP-844', 'Adligenswil', 'Fördergesuch'),
  makeEnergieplanung('EP-712', 'Adligenswil', 'Entwurf'),
  makeEnergieplanung('EP-713', 'Aesch', 'Verabschiedung'),
  makeEnergieplanung('EP-845', 'Aesch', 'Verabschiedung'),
  makeEnergieplanung('EP-842', 'Alberswil', 'Entwurf'),
  makeEnergieplanung('EP-838', 'Ballwil', 'Entwurf'),
  makeEnergieplanung('EP-843', 'Ballwil', 'Entwurf'),
  makeEnergieplanung('EP-839', 'Buchrain', 'Abschluss'),
  makeEnergieplanung('EP-772', 'Buttisholz', 'Entwurf'),
];
planungen.forEach(p => { p.massnahmen = buildMassnahmen(p); fillPlanungDetails(p); });

/* ---------------------- APP STATE ---------------------- */

const state = {
  tab: 'planungen',
  view: 'list',            // list | detail | massnahmeForm | massnahmeEdit | massnahmeDetail | planungEdit | contactForm
  planungId: null,
  massnahmeId: null,
  contactIndex: null,
  collapsed: {},           // section-id -> bool
  list: { search: '', filter: '', sortField: 'id', sortDir: 'asc' },
  massList: { search: '', filter: '', sortField: 'id', sortDir: 'asc', selected: new Set() },
  bulkEdit: { field: 'prozessstatus', value: 'Geplant' },
  contactList: { search: '', sortField: 'name', sortDir: 'asc', selected: new Set() },
  layoutMode: 'split',     // map | split | data
  reportView: null,        // null (Menü) | planungen | ueberfaellig | budget | kontakte
  reportSort: {
    planungen: { field: 'id', dir: 'asc' },
    epaMasterplan: { field: 'gemeinde', dir: 'asc' },
    ueberfaellig: { field: 'faelligkeitsdatum', dir: 'asc' },
    budget: { field: 'budget', dir: 'desc' },
    kontakte: { field: 'name', dir: 'asc' },
  },
};

const BULK_FIELD_LABELS = { prozessstatus: 'Prozessstatus', prioritaet: 'Priorität', umsetzungszeitraum: 'Umsetzungszeitraum' };

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
function setActiveTabButton(tabName) {
  document.querySelectorAll('.panel-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tabName));
}
document.querySelectorAll('.panel-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    setActiveTabButton(btn.dataset.tab);
    state.tab = btn.dataset.tab;
    if (state.tab === 'planungen') { state.view = 'list'; }
    render();
  });
});

document.querySelectorAll('[data-toast]').forEach(el => {
  el.addEventListener('click', () => toast(el.dataset.toast));
});

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
$sidePanel.style.width = `${panelWidth}px`;

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
  } else if (state.tab === 'reporting') {
    renderReporting();
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
  const field = state.list.sortField;
  const dir = state.list.sortDir === 'desc' ? -1 : 1;
  list.sort((a, b) => {
    if (field === 'jahr') return (a.jahr - b.jahr) * dir;
    const av = String(a[field]).toLowerCase();
    const bv = String(b[field]).toLowerCase();
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });
  return list;
}

function planungSortHeader(field, label) {
  const active = state.list.sortField === field;
  const arrow = active ? (state.list.sortDir === 'asc' ? '▲' : '▼') : '↕';
  return `<th data-psort="${field}">${label} <span class="sort-arrow">${arrow}</span></th>`;
}

function renderPlanungList() {
  const list = getFilteredPlanungen();
  $panel.innerHTML = `
    <h2 class="panel-title">Planungen</h2>
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
    </div>
    ${list.length === 0 ? `<div class="empty-state">Keine Planungen gefunden.</div>` :
      `<div class="table-scroll"><table class="data-table planungen-table">
        <thead><tr>
          ${planungSortHeader('id', 'ID')}
          ${planungSortHeader('name', 'Name')}
          ${planungSortHeader('jahr', 'Jahr')}
          ${planungSortHeader('gemeinde', 'Gemeinden')}
          ${planungSortHeader('typ', 'Typ')}
          ${planungSortHeader('status', 'Status')}
        </tr></thead>
        <tbody>
          ${list.map(p => `
            <tr data-open-planung="${p.id}">
              <td>${p.id}</td>
              <td>${p.name}</td>
              <td>${p.jahr}</td>
              <td>${p.gemeinde}</td>
              <td>${p.typ}</td>
              <td>${p.status}</td>
            </tr>
          `).join('')}
        </tbody>
      </table></div>`}
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
  $panel.querySelectorAll('[data-psort]').forEach(th => {
    th.addEventListener('click', () => {
      const field = th.dataset.psort;
      if (state.list.sortField === field) {
        state.list.sortDir = state.list.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        state.list.sortField = field;
        state.list.sortDir = 'asc';
      }
      renderPlanungList();
    });
  });
  $panel.querySelectorAll('[data-open-planung]').forEach(row => {
    row.addEventListener('click', () => {
      state.planungId = row.dataset.openPlanung;
      state.view = 'detail';
      state.collapsed = {};
      state.massList.selected.clear();
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

/* ---------------------- BREADCRUMB & ZURÜCK ---------------------- */
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
function renderNavRow(backLabel, parts) {
  return `<div class="nav-row">
    <button class="back-link" id="btn-back">
      <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"/></svg>
      ${backLabel}
    </button>
    ${renderBreadcrumb(parts)}
  </div>`;
}
function bindNavRow(backHandler, breadcrumbHandlers) {
  document.getElementById('btn-back').addEventListener('click', backHandler);
  bindBreadcrumb(breadcrumbHandlers);
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
    ${renderNavRow('Zurück zur Liste', [{ label: 'Liste Planungen' }, { label: p.id }])}
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
        ${MASSNAHME_STATUS.map(s => `<option value="${s}" ${state.massList.filter === s ? 'selected' : ''}>${s}</option>`).join('')}
      </select>
    </div>
    ${renderBulkBar()}
    ${massList.length === 0 ? `<div class="empty-state">Keine Massnahmen gefunden.</div>` :
      `<div class="table-scroll"><table class="data-table massnahmen-table">
        <thead><tr>
          <th class="col-check"><input type="checkbox" id="select-all-massnahmen"></th>
          ${massnahmenSortHeader('id', 'ID')}
          ${massnahmenSortHeader('esNr', 'ES-Nr.')}
          ${massnahmenSortHeader('name', 'Name')}
          ${massnahmenSortHeader('handlungsfeld', 'Handlungsfeld')}
          ${massnahmenSortHeader('prozessstatus', 'Prozess-Status')}
        </tr></thead>
        <tbody>
          ${massList.map(m => `
            <tr data-open-massnahme="${m.id}">
              <td class="col-check"><input type="checkbox" class="row-check" data-massnahme-id="${m.id}" ${state.massList.selected.has(m.id) ? 'checked' : ''}></td>
              <td>${m.id}</td>
              <td>${val(m.esNr)}</td>
              <td>${m.name}</td>
              <td>${val(m.handlungsfeld)}</td>
              <td>${m.prozessstatus}</td>
            </tr>
          `).join('')}
        </tbody>
      </table></div>`}

    <div class="btn-row right" style="margin-top:18px;">
      <button class="btn btn-secondary" id="btn-import-massnahmen">Massnahmen importieren</button>
      <button class="btn btn-secondary" id="btn-export-massnahmen">Export Massnahmen CSV</button>
    </div>
  `;

  bindNavRow(() => { state.view = 'list'; render(); }, [() => { state.view = 'list'; render(); }]);
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
  bindBulkBar(p);
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
  $panel.querySelectorAll('[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const field = th.dataset.sort;
      if (state.massList.sortField === field) {
        state.massList.sortDir = state.massList.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        state.massList.sortField = field;
        state.massList.sortDir = 'asc';
      }
      renderPlanungDetail();
    });
  });
  $panel.querySelectorAll('.row-check').forEach(cb => {
    cb.addEventListener('click', e => e.stopPropagation());
    cb.addEventListener('change', e => {
      const id = e.target.dataset.massnahmeId;
      if (e.target.checked) state.massList.selected.add(id); else state.massList.selected.delete(id);
      renderPlanungDetail();
    });
  });
  const selectAllCb = document.getElementById('select-all-massnahmen');
  if (selectAllCb) {
    selectAllCb.addEventListener('click', e => e.stopPropagation());
    selectAllCb.addEventListener('change', e => {
      if (e.target.checked) massList.forEach(m => state.massList.selected.add(m.id));
      else massList.forEach(m => state.massList.selected.delete(m.id));
      renderPlanungDetail();
    });
    const anySelected = massList.some(m => state.massList.selected.has(m.id));
    const allSelected = massList.length > 0 && massList.every(m => state.massList.selected.has(m.id));
    selectAllCb.checked = allSelected;
    selectAllCb.indeterminate = anySelected && !allSelected;
  }
  $panel.querySelectorAll('[data-open-massnahme]').forEach(row => {
    row.addEventListener('click', () => {
      state.massnahmeId = row.dataset.openMassnahme;
      state.view = 'massnahmeDetail';
      render();
    });
  });
}

/* ---------------------- MASSNAHMEN: MASSENMANIPULATION ---------------------- */
function renderBulkBar() {
  const count = state.massList.selected.size;
  if (count === 0) return '';
  return `<div class="bulk-bar">
    <span class="bulk-count">${count} ausgewählt</span>
    <button class="bulk-clear" id="bulk-clear" title="Auswahl aufheben">✕</button>
    <span class="bulk-sep"></span>
    <span class="bulk-label">Setzen:</span>
    <select class="select-input" id="bulk-field">
      <option value="prozessstatus" ${state.bulkEdit.field === 'prozessstatus' ? 'selected' : ''}>Prozessstatus</option>
      <option value="prioritaet" ${state.bulkEdit.field === 'prioritaet' ? 'selected' : ''}>Priorität</option>
      <option value="umsetzungszeitraum" ${state.bulkEdit.field === 'umsetzungszeitraum' ? 'selected' : ''}>Umsetzungszeitraum</option>
    </select>
    ${bulkValueInputHtml()}
    <button class="btn btn-primary btn-sm" id="bulk-apply">Anwenden</button>
  </div>`;
}

function bulkValueInputHtml() {
  const field = state.bulkEdit.field;
  if (field === 'prozessstatus') {
    return `<select class="select-input" id="bulk-value">${MASSNAHME_STATUS.map(s =>
      `<option ${state.bulkEdit.value === s ? 'selected' : ''}>${s}</option>`).join('')}</select>`;
  }
  if (field === 'prioritaet') {
    return `<select class="select-input" id="bulk-value">
      <option value="-" ${state.bulkEdit.value === '-' ? 'selected' : ''}>Keine</option>
      ${PRIORITAETEN.map(pr => `<option ${state.bulkEdit.value === pr ? 'selected' : ''}>${pr}</option>`).join('')}
    </select>`;
  }
  return `<input type="text" class="bulk-text-input" id="bulk-value" placeholder="z.B. 2026 oder 2026–2028" value="${escapeAttr(state.bulkEdit.value)}">`;
}

function bindBulkBar(p) {
  const clearBtn = document.getElementById('bulk-clear');
  if (!clearBtn) return;
  clearBtn.addEventListener('click', () => { state.massList.selected.clear(); renderPlanungDetail(); });
  document.getElementById('bulk-field').addEventListener('change', e => {
    state.bulkEdit.field = e.target.value;
    state.bulkEdit.value = state.bulkEdit.field === 'prozessstatus' ? MASSNAHME_STATUS[0]
      : state.bulkEdit.field === 'prioritaet' ? PRIORITAETEN[0] : '';
    renderPlanungDetail();
  });
  const valueEl = document.getElementById('bulk-value');
  valueEl.addEventListener(state.bulkEdit.field === 'umsetzungszeitraum' ? 'input' : 'change', e => {
    state.bulkEdit.value = e.target.value;
  });
  document.getElementById('bulk-apply').addEventListener('click', () => {
    const value = document.getElementById('bulk-value').value.trim();
    if (!value) { toast('Bitte einen Wert angeben.'); return; }
    const field = state.bulkEdit.field;
    const label = BULK_FIELD_LABELS[field];
    const count = state.massList.selected.size;
    if (!confirm(`${label} für ${count} Massnahme${count === 1 ? '' : 'n'} auf "${value}" setzen?`)) return;
    p.massnahmen.forEach(m => { if (state.massList.selected.has(m.id)) m[field] = value; });
    toast(`${label} wurde für ${count} Massnahme${count === 1 ? '' : 'n'} aktualisiert.`);
    state.massList.selected.clear();
    renderPlanungDetail();
  });
}

function massnahmenSortHeader(field, label) {
  const active = state.massList.sortField === field;
  const arrow = active ? (state.massList.sortDir === 'asc' ? '▲' : '▼') : '↕';
  return `<th data-sort="${field}">${label} <span class="sort-arrow">${arrow}</span></th>`;
}

function getFilteredMassnahmen(p) {
  let list = p.massnahmen.slice();
  const q = state.massList.search.trim().toLowerCase();
  if (q) list = list.filter(m => m.id.toLowerCase().includes(q) || m.name.toLowerCase().includes(q) || (m.esNr || '').toLowerCase().includes(q));
  if (state.massList.filter) list = list.filter(m => m.prozessstatus === state.massList.filter);
  const field = state.massList.sortField;
  const dir = state.massList.sortDir === 'desc' ? -1 : 1;
  list.sort((a, b) => {
    const av = String(val(a[field])).toLowerCase();
    const bv = String(val(b[field])).toLowerCase();
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });
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
    ${renderNavRow('Zurück zur Planung', [{ label: 'Liste Planungen' }, { label: p.id, }, { label: 'Bearbeiten' }])}
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
  bindNavRow(
    () => { state.view = 'detail'; render(); },
    [() => { state.view = 'list'; render(); }, () => { state.view = 'detail'; render(); }]
  );
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
    ${renderNavRow(
      isEdit ? 'Zurück zur Massnahme' : 'Zurück zur Planung',
      isEdit
        ? [{ label: 'Liste Planungen' }, { label: p.id }, { label: m.id }]
        : [{ label: 'Liste Planungen' }, { label: p.id }]
    )}
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
        ${HANDLUNGSFELDER.map(h =>
          `<option ${m && m.handlungsfeld === h ? 'selected' : ''}>${h}</option>`).join('')}
      </select></div>
    <div class="form-field"><label>Aktivitätsbereich<span class="req">*</span></label>
      <select id="mf-aktivitaetsbereich">
        <option value="" ${!m ? 'selected' : ''} disabled>Aktivitätsbereich auswählen...</option>
        ${AKTIVITAETSBEREICHE.map(a =>
          `<option ${m && m.aktivitaetsbereich === a ? 'selected' : ''}>${a}</option>`).join('')}
      </select></div>
    <div class="form-field"><label>Priorität</label>
      <select id="mf-prioritaet">
        <option value="" ${!m || m.prioritaet === '-' ? 'selected' : ''}>Auswählen</option>
        ${PRIORITAETEN.map(pr => `<option ${m && m.prioritaet === pr ? 'selected' : ''}>${pr}</option>`).join('')}
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

  bindNavRow(
    () => { state.view = isEdit ? 'massnahmeDetail' : 'detail'; render(); },
    isEdit
      ? [() => { state.view = 'list'; render(); }, () => { state.view = 'detail'; render(); }]
      : [() => { state.view = 'list'; render(); }]
  );

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
    ${renderNavRow('Zurück zur Planung', [{ label: 'Liste Planungen' }, { label: p.id }, { label: m.id }])}
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

    ${m.handlungsfeld === 'Wärme- und Kälteversorgung' ? `
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
    ` : ''}

    <div class="btn-row">
      <button class="btn btn-danger" id="btn-del-massnahme">Massnahme Löschen</button>
      <div style="display:flex; gap:12px;">
        <button class="btn btn-outline" id="btn-geodaten">Geodaten editieren</button>
        <button class="btn btn-primary" id="btn-edit-massnahme">Massnahme bearbeiten</button>
      </div>
    </div>
  `;

  bindNavRow(
    () => { state.view = 'detail'; render(); },
    [() => { state.view = 'list'; render(); }, () => { state.view = 'detail'; render(); }]
  );

  document.getElementById('btn-del-massnahme').addEventListener('click', () => {
    if (confirm(`Massnahme ${m.id} wirklich löschen?`)) {
      p.massnahmen = p.massnahmen.filter(x => x.id !== m.id);
      state.massList.selected.delete(m.id);
      toast(`${m.id} wurde gelöscht.`);
      state.view = 'detail';
      render();
    }
  });
  document.getElementById('btn-geodaten').addEventListener('click', () => toast('Geodaten-Editor ist in diesem Prototyp nicht verfügbar (Karte ist statisch).'));
  document.getElementById('btn-edit-massnahme').addEventListener('click', () => { state.view = 'massnahmeEdit'; render(); });
}

/* ---------------------- KONTAKTE ---------------------- */
function getFilteredContacts() {
  let list = contacts.map((c, idx) => Object.assign({ __idx: idx }, c));
  const q = state.contactList.search.trim().toLowerCase();
  if (q) {
    list = list.filter(c =>
      c.vorname.toLowerCase().includes(q) || c.nachname.toLowerCase().includes(q) ||
      c.organisation.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  }
  const field = state.contactList.sortField;
  const dir = state.contactList.sortDir === 'desc' ? -1 : 1;
  list.sort((a, b) => {
    const av = (field === 'name' ? `${a.vorname} ${a.nachname}` : a[field]).toLowerCase();
    const bv = (field === 'name' ? `${b.vorname} ${b.nachname}` : b[field]).toLowerCase();
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });
  return list;
}

function contactSortHeader(field, label) {
  const active = state.contactList.sortField === field;
  const arrow = active ? (state.contactList.sortDir === 'asc' ? '▲' : '▼') : '↕';
  return `<th data-csort="${field}">${label} <span class="sort-arrow">${arrow}</span></th>`;
}

function renderContactBulkBar() {
  const count = state.contactList.selected.size;
  if (count === 0) return '';
  return `<div class="bulk-bar">
    <span class="bulk-count">${count} ausgewählt</span>
    <button class="bulk-clear" id="contact-bulk-clear" title="Auswahl aufheben">✕</button>
    <span class="bulk-sep"></span>
    <button class="btn btn-danger btn-sm" id="contact-bulk-delete">Löschen</button>
  </div>`;
}

function bindContactBulkBar() {
  const clearBtn = document.getElementById('contact-bulk-clear');
  if (!clearBtn) return;
  clearBtn.addEventListener('click', () => { state.contactList.selected.clear(); renderContactList(); });
  document.getElementById('contact-bulk-delete').addEventListener('click', () => {
    const count = state.contactList.selected.size;
    if (!confirm(`${count} Kontakt${count === 1 ? '' : 'e'} wirklich löschen?`)) return;
    const toDelete = state.contactList.selected;
    for (let i = contacts.length - 1; i >= 0; i--) {
      if (toDelete.has(i)) contacts.splice(i, 1);
    }
    toast(`${count} Kontakt${count === 1 ? '' : 'e'} wurde${count === 1 ? '' : 'n'} gelöscht.`);
    state.contactList.selected.clear();
    renderContactList();
  });
}

function renderContactList() {
  const list = getFilteredContacts();
  $panel.innerHTML = `
    <h2 class="panel-title">Kontakte</h2>
    <div class="toolbar-row">
      <button class="btn-square" id="btn-add-contact" title="Neuer Kontakt">+</button>
      <div class="search-input-wrap">
        <input type="text" id="contact-search" placeholder="Organisation, Vorname, Nachname, E-Mail..." value="${escapeAttr(state.contactList.search)}">
        <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"/></svg>
      </div>
    </div>
    ${renderContactBulkBar()}
    ${list.length === 0 ? `<div class="empty-state">Keine Kontakte gefunden.</div>` :
      `<div class="table-scroll"><table class="data-table contacts-table">
        <thead><tr>
          <th class="col-check"><input type="checkbox" id="select-all-contacts"></th>
          ${contactSortHeader('name', 'Name')}
          ${contactSortHeader('organisation', 'Firma')}
          ${contactSortHeader('email', 'E-Mail')}
        </tr></thead>
        <tbody>
          ${list.map(c => `
            <tr data-open-contact="${c.__idx}">
              <td class="col-check"><input type="checkbox" class="row-check" data-contact-idx="${c.__idx}" ${state.contactList.selected.has(c.__idx) ? 'checked' : ''}></td>
              <td>${c.vorname} ${c.nachname}</td>
              <td>${val(c.organisation)}</td>
              <td>${c.email}</td>
            </tr>
          `).join('')}
        </tbody>
      </table></div>`}
  `;
  document.getElementById('contact-search').addEventListener('input', e => {
    state.contactList.search = e.target.value;
    renderContactList();
    const el = document.getElementById('contact-search');
    el.focus(); el.setSelectionRange(el.value.length, el.value.length);
  });
  document.getElementById('btn-add-contact').addEventListener('click', () => {
    state.contactIndex = null;
    state.view = 'contactForm';
    render();
  });
  $panel.querySelectorAll('[data-csort]').forEach(th => {
    th.addEventListener('click', () => {
      const field = th.dataset.csort;
      if (state.contactList.sortField === field) {
        state.contactList.sortDir = state.contactList.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        state.contactList.sortField = field;
        state.contactList.sortDir = 'asc';
      }
      renderContactList();
    });
  });
  bindContactBulkBar();
  $panel.querySelectorAll('.row-check').forEach(cb => {
    cb.addEventListener('click', e => e.stopPropagation());
    cb.addEventListener('change', e => {
      const idx = Number(e.target.dataset.contactIdx);
      if (e.target.checked) state.contactList.selected.add(idx); else state.contactList.selected.delete(idx);
      renderContactList();
    });
  });
  const selectAllCb = document.getElementById('select-all-contacts');
  if (selectAllCb) {
    selectAllCb.addEventListener('click', e => e.stopPropagation());
    selectAllCb.addEventListener('change', e => {
      if (e.target.checked) list.forEach(c => state.contactList.selected.add(c.__idx));
      else list.forEach(c => state.contactList.selected.delete(c.__idx));
      renderContactList();
    });
    const anySelected = list.some(c => state.contactList.selected.has(c.__idx));
    const allSelected = list.length > 0 && list.every(c => state.contactList.selected.has(c.__idx));
    selectAllCb.checked = allSelected;
    selectAllCb.indeterminate = anySelected && !allSelected;
  }
  $panel.querySelectorAll('[data-open-contact]').forEach(row => {
    row.addEventListener('click', () => {
      state.contactIndex = Number(row.dataset.openContact);
      state.view = 'contactForm';
      render();
    });
  });
}

function renderContactForm() {
  const isEdit = state.contactIndex !== null;
  const c = isEdit ? contacts[state.contactIndex] : null;
  $panel.innerHTML = `
    ${renderNavRow('Zurück zur Liste', [{ label: 'Kontakte' }, { label: isEdit ? `${c.vorname} ${c.nachname}` : 'Neuer Kontakt' }])}
    <h2 class="form-heading">${isEdit ? 'Kontakt bearbeiten' : 'Neuer Kontakt'}</h2>
    <div class="form-field"><label>Vorname<span class="req">*</span></label><input type="text" id="cf-vorname" value="${escapeAttr(c ? c.vorname : '')}"></div>
    <div class="form-field"><label>Nachname<span class="req">*</span></label><input type="text" id="cf-nachname" value="${escapeAttr(c ? c.nachname : '')}"></div>
    <div class="form-field"><label>Organisation</label><input type="text" id="cf-organisation" value="${escapeAttr(c && c.organisation !== '-' ? c.organisation : '')}"></div>
    <div class="form-field"><label>E-Mail<span class="req">*</span></label><input type="text" id="cf-email" placeholder="name@beispiel.ch" value="${escapeAttr(c ? c.email : '')}"></div>
    ${isEdit ? `
    <div class="btn-row">
      <button class="btn btn-danger" id="btn-del-contact">Kontakt löschen</button>
      <div style="display:flex; gap:12px;">
        <button class="btn btn-outline" id="btn-cancel">Abbrechen</button>
        <button class="btn btn-primary" id="btn-save">Speichern</button>
      </div>
    </div>
    ` : `
    <div class="btn-row right">
      <button class="btn btn-outline" id="btn-cancel">Abbrechen</button>
      <button class="btn btn-primary" id="btn-save">Speichern</button>
    </div>
    `}
  `;
  const goBack = () => { state.view = 'list'; state.contactIndex = null; render(); };
  bindNavRow(goBack, [goBack]);
  document.getElementById('btn-cancel').addEventListener('click', goBack);
  if (isEdit) {
    document.getElementById('btn-del-contact').addEventListener('click', () => {
      if (confirm(`Kontakt ${c.vorname} ${c.nachname} wirklich löschen?`)) {
        contacts.splice(state.contactIndex, 1);
        state.contactList.selected.clear();
        toast('Kontakt wurde gelöscht.');
        state.view = 'list';
        state.contactIndex = null;
        render();
      }
    });
  }
  document.getElementById('btn-save').addEventListener('click', () => {
    const vorname = document.getElementById('cf-vorname').value.trim();
    const nachname = document.getElementById('cf-nachname').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    if (!vorname || !nachname || !email) { toast('Bitte alle Pflichtfelder (*) ausfüllen.'); return; }
    const organisation = document.getElementById('cf-organisation').value.trim() || '-';
    if (isEdit) {
      Object.assign(c, { vorname, nachname, organisation, email });
      toast('Kontakt wurde gespeichert.');
    } else {
      contacts.push({ vorname, nachname, organisation, email });
      toast('Kontakt wurde angelegt.');
    }
    state.view = 'list';
    state.contactIndex = null;
    render();
  });
}

/* ---------------------- REPORTING: DATENHILFEN ---------------------- */
function getAllMassnahmenFlat() {
  const list = [];
  planungen.forEach(p => {
    p.massnahmen.forEach(m => list.push(Object.assign({ planungId: p.id, gemeinde: p.gemeinde }, m)));
  });
  return list;
}

function parseSwissDate(str) {
  if (!str || str === '-') return null;
  const parts = str.split('.');
  if (parts.length !== 3) return null;
  const [d, m, y] = parts.map(Number);
  if (!d || !m || !y) return null;
  return new Date(y, m - 1, d);
}

function parseChfAmount(str) {
  if (!str || str === '-') return null;
  const n = Number(String(str).replace(/[^\d]/g, ''));
  return Number.isNaN(n) ? null : n;
}

function extractContactName(v) {
  const idx = v.indexOf(' (');
  return idx === -1 ? v : v.substring(0, idx);
}

function getUeberfaelligeMassnahmen() {
  const today = new Date();
  return getAllMassnahmenFlat().filter(m => {
    const due = parseSwissDate(m.faelligkeitsdatum);
    return due && due < today && m.prozessstatus !== 'Abschluss';
  });
}

function getGrossbudgetMassnahmen() {
  return getAllMassnahmenFlat().filter(m => {
    const n = parseChfAmount(m.budget);
    return n !== null && n > 100000;
  });
}

function getUnassignedContacts() {
  const assigned = new Set();
  planungen.forEach(p => {
    const v = p.energieplanungFelder.verantwortlichkeit;
    if (v && v !== '-') assigned.add(extractContactName(v));
    p.massnahmen.forEach(m => {
      if (m.verantwortlichkeit && m.verantwortlichkeit !== '-') assigned.add(extractContactName(m.verantwortlichkeit));
    });
  });
  return contacts
    .map((c, idx) => Object.assign({ __idx: idx }, c))
    .filter(c => !assigned.has(`${c.vorname} ${c.nachname}`));
}

/* ---------------------- REPORTING ---------------------- */
const REPORTS = [
  { id: 'planungen', title: 'Alle Energieplanungen', desc: 'Übersicht aller Energieplanungen mit Gemeinde, Status und Anzahl Massnahmen.' },
  { id: 'epaMasterplan', title: 'EPA Masterplan', desc: 'Übersicht aller Energieplanungen mit dem Stand der EPA-Beratung.' },
  { id: 'ueberfaellig', title: 'Überfällige Massnahmen', desc: 'Massnahmen, deren Fälligkeitsdatum bereits verstrichen ist und die noch nicht abgeschlossen wurden.' },
  { id: 'budget', title: 'Massnahmen mit hohem Budget', desc: 'Massnahmen mit einem Budget über 100\'000 CHF.' },
  { id: 'kontakte', title: 'Nicht zugeordnete Kontakte', desc: 'Kontakte, die aktuell keiner Massnahme oder Energieplanung als Verantwortliche zugeordnet sind.' },
];

function renderReporting() {
  if (!state.reportView) renderReportMenu();
  else if (state.reportView === 'epaMasterplan') renderReportEpaMasterplan();
  else if (state.reportView === 'planungen') renderReportPlanungen();
  else if (state.reportView === 'ueberfaellig') renderReportUeberfaellig();
  else if (state.reportView === 'budget') renderReportBudget();
  else if (state.reportView === 'kontakte') renderReportKontakte();
}

function renderReportMenu() {
  const counts = {
    planungen: planungen.length,
    epaMasterplan: (typeof EPA_MASTERPLAN !== 'undefined') ? EPA_MASTERPLAN.length : 0,
    ueberfaellig: getUeberfaelligeMassnahmen().length,
    budget: getGrossbudgetMassnahmen().length,
    kontakte: getUnassignedContacts().length,
  };
  $panel.innerHTML = `
    <h2 class="panel-title">Reporting</h2>
    <div class="report-menu">
      ${REPORTS.map(r => `
        <div class="report-card" data-report="${r.id}">
          <div class="report-card-count">${counts[r.id]}</div>
          <div class="report-card-body">
            <div class="report-card-title">${r.title}</div>
            <div class="report-card-desc">${r.desc}</div>
          </div>
          <svg class="report-card-arrow" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>
        </div>
      `).join('')}
    </div>
  `;
  $panel.querySelectorAll('[data-report]').forEach(card => {
    card.addEventListener('click', () => { state.reportView = card.dataset.report; render(); });
  });
}

function reportBack() { state.reportView = null; render(); }

function bindReportMassnahmeRows() {
  $panel.querySelectorAll('[data-open-report-massnahme]').forEach(row => {
    row.addEventListener('click', () => {
      const [planungId, massnahmeId] = row.dataset.openReportMassnahme.split('|');
      state.tab = 'planungen';
      state.view = 'massnahmeDetail';
      state.planungId = planungId;
      state.massnahmeId = massnahmeId;
      setActiveTabButton('planungen');
      render();
    });
  });
}

/* Sortiert Report-Zeilen anhand des in state.reportSort[reportId] hinterlegten Feldes;
   accessors liefert je Feldname eine Funktion, die den zu vergleichenden Wert (String, Zahl oder Date) liefert. */
function sortReportRows(reportId, rows, accessors) {
  const s = state.reportSort[reportId];
  const get = accessors[s.field];
  const mul = s.dir === 'desc' ? -1 : 1;
  return rows.slice().sort((a, b) => {
    let av = get(a), bv = get(b);
    if (typeof av === 'string') { av = av.toLowerCase(); bv = bv.toLowerCase(); }
    if (av < bv) return -1 * mul;
    if (av > bv) return 1 * mul;
    return 0;
  });
}
function reportSortHeader(reportId, field, label) {
  const s = state.reportSort[reportId];
  const active = s.field === field;
  const arrow = active ? (s.dir === 'asc' ? '▲' : '▼') : '↕';
  return `<th data-rsort="${field}">${label} <span class="sort-arrow">${arrow}</span></th>`;
}
function bindReportSort(reportId, renderFn) {
  $panel.querySelectorAll('[data-rsort]').forEach(th => {
    th.addEventListener('click', () => {
      const field = th.dataset.rsort;
      const s = state.reportSort[reportId];
      if (s.field === field) s.dir = s.dir === 'asc' ? 'desc' : 'asc';
      else { s.field = field; s.dir = 'asc'; }
      renderFn();
    });
  });
}

function renderReportPlanungen() {
  const rows = sortReportRows('planungen', planungen, {
    id: p => p.id, name: p => p.name, gemeinde: p => p.gemeinde,
    status: p => p.status, count: p => p.massnahmen.length
  });
  $panel.innerHTML = `
    ${renderNavRow('Zurück zu Reports', [{ label: 'Reporting' }, { label: 'Alle Energieplanungen' }])}
    <h2 class="panel-title">Alle Energieplanungen</h2>
    <div class="table-scroll"><table class="data-table report-table">
      <thead><tr>
        ${reportSortHeader('planungen', 'id', 'ID')}
        ${reportSortHeader('planungen', 'name', 'Name')}
        ${reportSortHeader('planungen', 'gemeinde', 'Gemeinden')}
        ${reportSortHeader('planungen', 'status', 'Status')}
        ${reportSortHeader('planungen', 'count', 'Anzahl Massnahmen')}
      </tr></thead>
      <tbody>
        ${rows.map(p => `
          <tr data-open-report-planung="${p.id}">
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.gemeinde}</td>
            <td>${p.status}</td>
            <td>${p.massnahmen.length}</td>
          </tr>
        `).join('')}
      </tbody>
    </table></div>
  `;
  bindNavRow(reportBack, [reportBack]);
  bindReportSort('planungen', renderReportPlanungen);
  $panel.querySelectorAll('[data-open-report-planung]').forEach(row => {
    row.addEventListener('click', () => {
      state.tab = 'planungen';
      state.view = 'detail';
      state.planungId = row.dataset.openReportPlanung;
      state.collapsed = {};
      state.massList.selected.clear();
      setActiveTabButton('planungen');
      render();
    });
  });
}

function renderReportEpaMasterplan() {
  const data = (typeof EPA_MASTERPLAN !== 'undefined') ? EPA_MASTERPLAN : [];
  const rows = sortReportRows('epaMasterplan', data, {
    gemeinde: r => r.gemeinde,
    epaBeratungAbgeschlossen: r => r.epaBeratungAbgeschlossen,
    epaGeplant: r => r.epaGeplant,
    epaBerater: r => r.epaBerater,
    epaFirma: r => r.epaFirma,
    epaKickoff: r => r.epaKickoff,
    epaGesuchseingang: r => r.epaGesuchseingang,
    epaGesuchsNr: r => r.epaGesuchsNr,
    epaAuszahlungsdatum: r => r.epaAuszahlungsdatum,
    esZert: r => r.esZert,
    regEp: r => r.regEp,
    regEpName: r => r.regEpName,
    regEpBuero: r => r.regEpBuero,
    regEpJahr: r => r.regEpJahr,
    komEp: r => r.komEp,
    komEpJahr: r => r.komEpJahr,
    komEpRevision: r => r.komEpRevision,
    gasnetz: r => r.gasnetz,
    gasversorger: r => r.gasversorger,
    ortsplanungsrevision: r => r.ortsplanungsrevision,
    info: r => r.info
  });
  $panel.innerHTML = `
    ${renderNavRow('Zurück zu Reports', [{ label: 'Reporting' }, { label: 'EPA Masterplan' }])}
    <h2 class="panel-title">EPA Masterplan</h2>
    ${rows.length === 0 ? `<div class="empty-state">Keine Daten vorhanden.</div>` : `
    <div class="table-scroll"><table class="data-table report-table epa-masterplan-table">
      <thead><tr>
        ${reportSortHeader('epaMasterplan', 'gemeinde', 'Gemeinde')}
        ${reportSortHeader('epaMasterplan', 'epaBeratungAbgeschlossen', 'EPA abgeschlossen')}
        ${reportSortHeader('epaMasterplan', 'epaGeplant', 'EPA geplant')}
        ${reportSortHeader('epaMasterplan', 'epaBerater', 'EPA-Berater')}
        ${reportSortHeader('epaMasterplan', 'epaFirma', 'EPA-Firma')}
        ${reportSortHeader('epaMasterplan', 'epaKickoff', 'Kick-off')}
        ${reportSortHeader('epaMasterplan', 'epaGesuchseingang', 'Gesuchseingang')}
        ${reportSortHeader('epaMasterplan', 'epaGesuchsNr', 'Gesuchs-Nr.')}
        ${reportSortHeader('epaMasterplan', 'epaAuszahlungsdatum', 'Auszahlungsdatum')}
        ${reportSortHeader('epaMasterplan', 'esZert', 'ES-Zertifizierung')}
        ${reportSortHeader('epaMasterplan', 'regEp', 'REG-EP')}
        ${reportSortHeader('epaMasterplan', 'regEpName', 'REG-EP Name')}
        ${reportSortHeader('epaMasterplan', 'regEpBuero', 'REG-EP Büro')}
        ${reportSortHeader('epaMasterplan', 'regEpJahr', 'REG-EP Jahr')}
        ${reportSortHeader('epaMasterplan', 'komEp', 'KOM-EP')}
        ${reportSortHeader('epaMasterplan', 'komEpJahr', 'KOM-EP Jahr')}
        ${reportSortHeader('epaMasterplan', 'komEpRevision', 'KOM-EP Revision')}
        ${reportSortHeader('epaMasterplan', 'gasnetz', 'Gasnetz')}
        ${reportSortHeader('epaMasterplan', 'gasversorger', 'Gasversorger')}
        ${reportSortHeader('epaMasterplan', 'ortsplanungsrevision', 'Ortsplanungsrevision')}
        ${reportSortHeader('epaMasterplan', 'info', 'Info')}
      </tr></thead>
      <tbody>
        ${rows.map(r => `
          <tr data-open-report-gemeinde="${escapeAttr(r.gemeinde)}">
            <td>${r.gemeinde}</td>
            <td>${r.epaBeratungAbgeschlossen}</td>
            <td>${r.epaGeplant}</td>
            <td>${r.epaBerater}</td>
            <td>${r.epaFirma}</td>
            <td>${r.epaKickoff}</td>
            <td>${r.epaGesuchseingang}</td>
            <td>${r.epaGesuchsNr}</td>
            <td>${r.epaAuszahlungsdatum}</td>
            <td>${r.esZert}</td>
            <td>${r.regEp}</td>
            <td>${r.regEpName}</td>
            <td>${r.regEpBuero}</td>
            <td>${r.regEpJahr}</td>
            <td>${r.komEp}</td>
            <td>${r.komEpJahr}</td>
            <td>${r.komEpRevision}</td>
            <td>${r.gasnetz}</td>
            <td>${r.gasversorger}</td>
            <td>${r.ortsplanungsrevision}</td>
            <td>${r.info}</td>
          </tr>
        `).join('')}
      </tbody>
    </table></div>`}
  `;
  bindNavRow(reportBack, [reportBack]);
  bindReportSort('epaMasterplan', renderReportEpaMasterplan);
  $panel.querySelectorAll('[data-open-report-gemeinde]').forEach(row => {
    row.addEventListener('click', () => {
      state.tab = 'planungen';
      state.view = 'list';
      state.list.search = row.dataset.openReportGemeinde;
      setActiveTabButton('planungen');
      render();
    });
  });
}

function renderReportUeberfaellig() {
  const today = new Date();
  const unsorted = getUeberfaelligeMassnahmen();
  const rows = sortReportRows('ueberfaellig', unsorted, {
    id: m => m.id, name: m => m.name, planungId: m => m.planungId, gemeinde: m => m.gemeinde,
    prozessstatus: m => m.prozessstatus, faelligkeitsdatum: m => parseSwissDate(m.faelligkeitsdatum),
    tageUeberfaellig: m => Math.round((today - parseSwissDate(m.faelligkeitsdatum)) / 86400000)
  });
  $panel.innerHTML = `
    ${renderNavRow('Zurück zu Reports', [{ label: 'Reporting' }, { label: 'Überfällige Massnahmen' }])}
    <h2 class="panel-title">Überfällige Massnahmen</h2>
    ${rows.length === 0 ? `<div class="empty-state">Keine überfälligen Massnahmen gefunden.</div>` : `
    <div class="table-scroll"><table class="data-table report-table">
      <thead><tr>
        ${reportSortHeader('ueberfaellig', 'id', 'ID')}
        ${reportSortHeader('ueberfaellig', 'name', 'Name')}
        ${reportSortHeader('ueberfaellig', 'planungId', 'Energieplanung')}
        ${reportSortHeader('ueberfaellig', 'gemeinde', 'Gemeinde')}
        ${reportSortHeader('ueberfaellig', 'prozessstatus', 'Prozessstatus')}
        ${reportSortHeader('ueberfaellig', 'faelligkeitsdatum', 'Fälligkeitsdatum')}
        ${reportSortHeader('ueberfaellig', 'tageUeberfaellig', 'Tage überfällig')}
      </tr></thead>
      <tbody>
        ${rows.map(m => {
          const daysOverdue = Math.round((today - parseSwissDate(m.faelligkeitsdatum)) / 86400000);
          return `
          <tr data-open-report-massnahme="${m.planungId}|${m.id}">
            <td>${m.id}</td>
            <td>${m.name}</td>
            <td>${m.planungId}</td>
            <td>${m.gemeinde}</td>
            <td>${m.prozessstatus}</td>
            <td class="report-overdue">${m.faelligkeitsdatum}</td>
            <td class="report-overdue">${daysOverdue}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table></div>`}
  `;
  bindNavRow(reportBack, [reportBack]);
  bindReportSort('ueberfaellig', renderReportUeberfaellig);
  bindReportMassnahmeRows();
}

function renderReportBudget() {
  const unsorted = getGrossbudgetMassnahmen();
  const rows = sortReportRows('budget', unsorted, {
    id: m => m.id, name: m => m.name, planungId: m => m.planungId, gemeinde: m => m.gemeinde,
    budget: m => parseChfAmount(m.budget)
  });
  $panel.innerHTML = `
    ${renderNavRow('Zurück zu Reports', [{ label: 'Reporting' }, { label: 'Massnahmen mit hohem Budget' }])}
    <h2 class="panel-title">Massnahmen mit Budget &gt; 100'000 CHF</h2>
    ${rows.length === 0 ? `<div class="empty-state">Keine Massnahmen gefunden.</div>` : `
    <div class="table-scroll"><table class="data-table report-table">
      <thead><tr>
        ${reportSortHeader('budget', 'id', 'ID')}
        ${reportSortHeader('budget', 'name', 'Name')}
        ${reportSortHeader('budget', 'planungId', 'Energieplanung')}
        ${reportSortHeader('budget', 'gemeinde', 'Gemeinde')}
        ${reportSortHeader('budget', 'budget', 'Budget')}
      </tr></thead>
      <tbody>
        ${rows.map(m => `
          <tr data-open-report-massnahme="${m.planungId}|${m.id}">
            <td>${m.id}</td>
            <td>${m.name}</td>
            <td>${m.planungId}</td>
            <td>${m.gemeinde}</td>
            <td>${m.budget}</td>
          </tr>
        `).join('')}
      </tbody>
    </table></div>`}
  `;
  bindNavRow(reportBack, [reportBack]);
  bindReportSort('budget', renderReportBudget);
  bindReportMassnahmeRows();
}

function renderReportKontakte() {
  const unsorted = getUnassignedContacts();
  const rows = sortReportRows('kontakte', unsorted, {
    name: c => `${c.vorname} ${c.nachname}`, organisation: c => c.organisation, email: c => c.email
  });
  $panel.innerHTML = `
    ${renderNavRow('Zurück zu Reports', [{ label: 'Reporting' }, { label: 'Nicht zugeordnete Kontakte' }])}
    <h2 class="panel-title">Nicht zugeordnete Kontakte</h2>
    ${rows.length === 0 ? `<div class="empty-state">Alle Kontakte sind zugeordnet.</div>` : `
    <div class="table-scroll"><table class="data-table report-table">
      <thead><tr>
        ${reportSortHeader('kontakte', 'name', 'Name')}
        ${reportSortHeader('kontakte', 'organisation', 'Firma')}
        ${reportSortHeader('kontakte', 'email', 'E-Mail')}
      </tr></thead>
      <tbody>
        ${rows.map(c => `
          <tr data-open-report-contact="${c.__idx}">
            <td>${c.vorname} ${c.nachname}</td>
            <td>${val(c.organisation)}</td>
            <td>${c.email}</td>
          </tr>
        `).join('')}
      </tbody>
    </table></div>`}
  `;
  bindNavRow(reportBack, [reportBack]);
  bindReportSort('kontakte', renderReportKontakte);
  $panel.querySelectorAll('[data-open-report-contact]').forEach(row => {
    row.addEventListener('click', () => {
      state.tab = 'kontakte';
      state.view = 'contactForm';
      state.contactIndex = Number(row.dataset.openReportContact);
      setActiveTabButton('kontakte');
      render();
    });
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

/* ---------------------- LEAFLET MAP ---------------------- */
const LUZERN_CENTER = [47.0502, 8.3093];
const map = L.map('leaflet-map', { zoomControl: false }).setView(LUZERN_CENTER, 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende'
}).addTo(map);

L.control.zoom({ position: 'topright' }).addTo(map);
L.control.scale({ imperial: false }).addTo(map);

L.marker(LUZERN_CENTER).addTo(map)
  .bindPopup('Luzern')
  .openPopup();

/* ---------------------- INIT ---------------------- */
render();
