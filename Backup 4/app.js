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

// Dummy-Daten für "Kontoinformationen Förderbeitrag" — Konto lautet immer auf die jeweilige Gemeinde.
const KONTO_STRASSEN = [
  'Hauptstrasse', 'Dorfstrasse', 'Kirchweg', 'Bahnhofstrasse', 'Schulhausstrasse',
  'Seestrasse', 'Ringstrasse', 'Gartenweg', 'Poststrasse', 'Rainweg'
];
const KONTO_BANKEN = [
  'Luzerner Kantonalbank', 'Luzerner Kantonalbank', 'Luzerner Kantonalbank',
  'PostFinance AG', 'Raiffeisenbank Sursee', 'UBS Switzerland AG'
];
function randomGemeindeAdresse(gemeinde) {
  const plz = (typeof findGemeindePlz === 'function' && findGemeindePlz(gemeinde)) || 6000;
  return `${pick(KONTO_STRASSEN)} ${randomInt(1, 58)}, ${plz} ${gemeinde}`;
}
function randomIban() {
  const block = () => String(randomInt(0, 9999)).padStart(4, '0');
  return `CH${randomInt(10, 99)} ${block()} ${block()} ${block()} ${block()} ${randomInt(0, 9)}`;
}

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
      foerderabschlussformular: 'Keine Massnahmen definiert',
      gesuchseingang: '-', auszahlungsbetrag: 7200, gesuchsNr: '-', energiestadt: '-', kommentar: '-'
    },
    konto: {
      kontoinhaber: '-', adresse: '-', iban: '-', bankname: '-',
      vermerk: `204071003 Kommunale Energieplanung`
    },
    energieplanungFelder: {
      verantwortlichkeit: '-', beraterEnergieplanung: '-', nettoNullZiel: '-', energieeffizienzZiel: '-', stromproduktionZiel: '-'
    },
    // Wiederkehrende Prüfpflicht (alle 4 Jahre ab Datum Beratungsbeginn, sofern Status Abschluss) — siehe naechstePruefungFor().
    pruefstatus: { letzteUeberpruefung: '-' },
    massnahmen: []
  }, extra || {});
}

const contacts = [
  { vorname: 'Mathias', nachname: 'Benz', organisation: 'Benz AG', email: 'mathias.benz@lu.ch' },
  { vorname: 'Sabine', nachname: 'Grüter', organisation: 'Grüter Elektroplanung AG', email: 'sabine.grueter@demo.com' },
  { vorname: 'Markus', nachname: 'Fischer', organisation: 'Fischer GmbH', email: 'markus.fischer@demo.com' },
  { vorname: 'Meinrad', nachname: 'Franzen', organisation: 'Franzen GmbH', email: 'meinrad.franzen@lu.ch' },
  { vorname: 'Pino', nachname: 'Merino', organisation: 'Gemeinde Adligenswil', email: 'pino.merino@adligenswil.ch', gemeindeKontakt: true },
  { vorname: 'Julia', nachname: 'Keller', organisation: 'Keller Consulting', email: 'julia.keller@demo.com' },
  { vorname: 'Sandro', nachname: 'Peter', organisation: 'Luzern', email: 'sandro.peter@lu.ch', gemeindeKontakt: true },
  { vorname: 'Beat', nachname: 'Krummenacher', organisation: 'Krummenacher Bauphysik GmbH', email: 'beat.krummenacher@demo.com' },
  { vorname: 'Roger', nachname: 'Meier', organisation: 'Meier Bau AG', email: 'roger.meier@demo.com' },
];
// Externe Beratungsfirmen (keine Gemeindeverwaltungen) — Pool für "Berater/in Energieplanung".
const externeBeraterKontakte = contacts.filter(c => !c.gemeindeKontakt);

let nextPlanungSeq = 846;
let nextMassnahmeSeq = 1000;

/* ---------------------- DUMMY-MASSNAHMEN GENERATOR ---------------------- */
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[randomInt(0, arr.length - 1)]; }
function pad2(n) { return String(n).padStart(2, '0'); }
function formatDate(d) { return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}`; }
function formatChf(n) { return `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "'")} CHF`; }
function formatChfAmount(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "'"); }
function randomDate(yearFrom, yearTo) { return new Date(randomInt(yearFrom, yearTo), randomInt(0, 11), randomInt(1, 28)); }
function addDays(date, days) { const d = new Date(date); d.setDate(d.getDate() + days); return d; }
function addYears(date, years) { const d = new Date(date); d.setFullYear(d.getFullYear() + years); return d; }

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

// "Verantwortlichkeit Gemeinde" muss immer eine Person der jeweiligen Gemeinde sein (Format "Vorname Nachname (Gemeinde)").
const GEMEINDE_VERANTWORTLICHE_VORNAMEN = ['Priska', 'Urs', 'Monika', 'Beat', 'Claudia', 'Werner', 'Silvia', 'Peter', 'Karin', 'Fabian'];
const GEMEINDE_VERANTWORTLICHE_NACHNAMEN = ['Steiner', 'Bucher', 'Wicki', 'Bühler', 'Kaufmann', 'Bättig', 'Lustenberger', 'Schwegler', 'Hodel', 'Zimmermann'];
// Für einzelne Gemeinden ist die zuständige Person fix vorgegeben (z.B. für Demo-Zwecke).
const GEMEINDE_VERANTWORTLICHE_FIX = { Buchrain: 'Hans Muster' };
function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}
function verantwortlichePersonGemeinde(gemeinde) {
  const fixName = GEMEINDE_VERANTWORTLICHE_FIX[gemeinde];
  if (fixName) return `${fixName} (${gemeinde})`;
  const h = hashString(gemeinde);
  const vorname = GEMEINDE_VERANTWORTLICHE_VORNAMEN[h % GEMEINDE_VERANTWORTLICHE_VORNAMEN.length];
  const nachname = GEMEINDE_VERANTWORTLICHE_NACHNAMEN[Math.floor(h / GEMEINDE_VERANTWORTLICHE_VORNAMEN.length) % GEMEINDE_VERANTWORTLICHE_NACHNAMEN.length];
  return `${vorname} ${nachname} (${gemeinde})`;
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

// Beispielkommentare fürs Kommentarfeld im Bereich "Gesuch (intern)" — Grossteil der Gesuche
// bleibt unkommentiert, ein Teil trägt kurze Jahres-Korrekturen oder längere Notizen (wie im
// bisherigen Excel-Tracking üblich).
const EPA_KOMMENTAR_BEISPIELE = [
  '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-',
  'EPA vorgelagert zum ES-Prozess',
  'EPA vorgelagert zum ES-Prozess',
  'EPA vorgelagert zum ES-Prozess',
  'EPA vorgelagert zum ES-Prozess. Rezertifizierung wird aufs 2027 verschoben.',
  '2027 statt 2028',
  '2026 i.O.',
  '2025 i.O.',
  '2026 i.O.',
  '2027 i.O.',
  '2025 i.O.',
  '2025 statt 2027',
  '2025 statt 2026',
  '2025 statt 2026',
  '2025 statt 2026',
  '2024 statt 2026',
  'nicht 2024; Reaudit war im Sommer 2024',
  'Die Gmd. Ballwil wird anfangs Dez. 24 definitiv das Budget bewilligen damit wir u.a. eine EPA-Beratung im 2025 durchführen können (neben einem «Reaudit Energiestadt im Mai 2026»).',
  'wir sind da an der Erarbeitung eines Leitbilds hinsichtlich dem Reaudit, welches ja nächstes Jahr startet.',
  'die Gemeinde ist motiviert die EPA-Beratung vor der Festlegung ihrer neuer Legislaturziele anzugehen',
  '2025 statt 2024: Bemerkung Clara: Wegen Ortsplanungsrevision bleibt 2024',
  '2028 statt 2024; Bemerkung Clara: Gemeinde möchte Lärmrisikogebiete zeitnah koordinieren, daher bleibt 2024; Rückmeldung Moritz: GR muss noch Energie- und Klimastrategie beraten, daher 2025 statt 2024',
  '2026 statt 2025; Bemerkung Clara: Wegen Ortsplanungsrevision bleibt 2025',
  '2027 statt 2025; Bemerkung Clara: Wegen Ortsplanungsrevision bleibt 2025',
  'Gemeinde möchte vorwärts machen',
  'Gemeinde möchte vorwärts machen',
  'Nachgelagert an EPA wird nun eine räumliche Energieplanung erarbeitet',
];

// Zähler für die Gesuchs-Nr. (Jahr + dreistellige Laufnummer je Jahr, z.B. 2026011)
const gesuchsLaufNrByYear = {};
function nextGesuchsNr(jahr) {
  gesuchsLaufNrByYear[jahr] = (gesuchsLaufNrByYear[jahr] || 0) + 1;
  return Number(`${jahr}${String(gesuchsLaufNrByYear[jahr]).padStart(3, '0')}`);
}

function fillPlanungDetails(planung) {
  // Im Status "Entwurf" sind nur die Muss-Felder (Planungstyp, Jahr, Gemeinden — bereits über
  // makeEnergieplanung gesetzt) formal nötig. Damit die Dummy-Daten realistisch durchmischt sind,
  // bleibt bei rund der Hälfte der Entwurf-Planungen alles Weitere unausgefüllt ('-'), die andere
  // Hälfte hat trotzdem bereits vollständige Angaben (z.B. weil die Beratung schon weit war, bevor
  // der Status wieder auf Entwurf zurückgesetzt wurde).
  if (planung.status === 'Entwurf' && Math.random() < 0.5) return;
  const beginn = randomDate(planung.jahr - 2, planung.jahr);
  const gesuchseingang = addDays(beginn, randomInt(30, 240));
  const gesuchsJahr = gesuchseingang.getFullYear();
  Object.assign(planung.epaBeratung, {
    beratungsperson: formatContactLabel(pick(contacts)),
    datumBeratungsbeginn: formatDate(beginn),
    bedarfEnergierichtplan: pick(['Ja', 'Nein']),
    bedarfKoordination: pick(['Ja', 'Nein']),
    gebieteKoordinationsbedarf: pick(['Ja', 'Nein']),
    // Admin-only Felder (Report "EPA-Beratung")
    gesuchseingang: formatDate(gesuchseingang),
    auszahlungsbetrag: Math.random() < 0.85 ? 7200 : pick([6000, 6500, 7800, 8200, 9000]),
    gesuchsNr: nextGesuchsNr(gesuchsJahr),
    energiestadt: pick(['Ja', 'Nein', 'Nein']),
    kommentar: pick(EPA_KOMMENTAR_BEISPIELE),
  });
  Object.assign(planung.energieplanungFelder, {
    verantwortlichkeit: verantwortlichePersonGemeinde(planung.gemeinde),
    beraterEnergieplanung: formatContactLabel(pick(externeBeraterKontakte)),
    nettoNullZiel: pick(NETTO_NULL_ZIELE),
    energieeffizienzZiel: pick(ENERGIEEFFIZIENZ_ZIELE),
    stromproduktionZiel: pick(STROMPRODUKTION_ZIELE),
  });
  Object.assign(planung.konto, {
    kontoinhaber: `Gemeinde ${planung.gemeinde}`,
    adresse: randomGemeindeAdresse(planung.gemeinde),
    iban: randomIban(),
    bankname: pick(KONTO_BANKEN),
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
  view: 'list',            // list | detail | contactForm
  planungId: null,
  planungTab: 'details', // massnahmen | details | kontrolle (Sub-Tabs in der Planungsdetailansicht)
  planungDetailsMode: 'view', // view | edit — Zustand des Planungsdetails-Tabs
  planungKontrolleMode: 'view', // view | edit — Zustand des Kontrolle-Tabs (nur Admin)
  planungPendingStatus: null, // Zielstatus, wenn ein Stepper-Klick wegen fehlender Pflichtfelder ins Bearbeiten-Formular geleitet hat
  massnahmeId: null,
  mdMode: null,            // null (leer) | view | edit | new — Zustand des Massnahmen-Detailpanels rechts
  contactIndex: null,
  collapsed: {},           // section-id -> bool
  list: { search: '', filter: '', sortField: 'id', sortDir: 'asc' },
  massList: { search: '', filter: '', sortField: 'id', sortDir: 'asc', selected: new Set() },
  bulkEdit: { field: 'prozessstatus', value: 'Geplant' },
  contactList: { search: '', sortField: 'name', sortDir: 'asc', selected: new Set() },
  layoutMode: 'split',     // map | split | data
  role: 'Admin',  // Admin (default) | Energieberater
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

/* ---------------------- ROLLEN-SWITCHER (AVATAR) ---------------------- */
const $avatarBtn = document.getElementById('avatar-btn');
const $roleMenu = document.getElementById('role-menu');

function updateAvatar() {
  document.getElementById('avatar-initials').textContent = state.role === 'Admin' ? 'A' : 'EB';
  $avatarBtn.title = `Angemeldet als ${state.role}`;
  document.querySelectorAll('.role-menu-item').forEach(b => b.classList.toggle('active', b.dataset.role === state.role));
}

$avatarBtn.addEventListener('click', e => {
  e.stopPropagation();
  $roleMenu.hidden = !$roleMenu.hidden;
});
$roleMenu.addEventListener('click', e => e.stopPropagation());
document.addEventListener('click', () => { $roleMenu.hidden = true; });

document.querySelectorAll('.role-menu-item').forEach(btn => {
  btn.addEventListener('click', () => {
    state.role = btn.dataset.role;
    updateAvatar();
    $roleMenu.hidden = true;
    toast(`Rolle gewechselt zu „${state.role}“`);
    render();
  });
});
updateAvatar();

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
              <td>${p.status}${pruefstatusFor(p) === 'faellig' ? ' <span class="status-pill status-pruefung-faellig" title="Überprüfung fällig">⚠ Überprüfung fällig</span>' : ''}</td>
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
    state.planungTab = 'details';
    state.planungDetailsMode = 'view';
    state.planungKontrolleMode = 'view';
    state.planungPendingStatus = null;
    state.massnahmeId = null;
    state.mdMode = null;
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
      state.planungTab = 'details';
      state.planungDetailsMode = 'view';
      state.planungKontrolleMode = 'view';
      state.planungPendingStatus = null;
      state.massnahmeId = null;
      state.mdMode = null;
      state.collapsed = {};
      state.massList.selected.clear();
      render();
    });
  });
}

/* ---------------------- STEPPER ---------------------- */
function renderStepper(steps, id) {
  // steps: [{label, sub, state: 'done'|'current'|'upcoming'}]
  return `<div class="stepper"${id ? ` id="${id}"` : ''}>
    ${steps.map((s, i) => `
      ${i > 0 ? `<div class="step-line ${steps[i - 1].state === 'done' ? 'done' : ''}"></div>` : ''}
      <div class="step ${s.state}" data-step-label="${escapeAttr(s.label)}" title="Status auf „${s.label}“ setzen">
        <div class="step-circle">${s.state === 'done' ? checkSvg() : ''}</div>
        <div class="step-label">${s.label}</div>
        <div class="step-sub">${s.sub}</div>
      </div>
    `).join('')}
  </div>`;
}
function bindStepper(container, onSelect) {
  container.querySelectorAll('.stepper .step').forEach(el => {
    el.addEventListener('click', () => onSelect(el.dataset.stepLabel));
  });
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

/* ---------------------- PLANUNGSDETAILS: PFLICHTFELD-VALIDIERUNG ---------------------- */
// Immer Pflicht (Status "Entwurf" & "Verabschiedung"); ab Status "Fördergesuch"/"Abschluss" kommen die übrigen Felder dazu.
const PLANUNG_REQUIRED_FIELDS = [
  { id: 'f-typ', label: 'Planungstyp', always: true, get: p => p.typ },
  { id: 'f-jahr', label: 'Jahr', always: true, get: p => p.jahr },
  { id: 'f-gemeinde', label: 'Gemeinden', always: true, get: p => p.gemeinde },
  { id: 'f-eb-beratungsperson', label: 'Beratungsperson', get: p => p.epaBeratung.beratungsperson },
  { id: 'f-eb-datum', label: 'Datum Beratungsbeginn', get: p => p.epaBeratung.datumBeratungsbeginn },
  { id: 'f-eb-energierichtplan', label: 'Bedarf eines Energierichtplans?', get: p => p.epaBeratung.bedarfEnergierichtplan },
  { id: 'f-eb-koordination', label: 'Bedarf einer Koordination mit weiteren Gemeinden?', get: p => p.epaBeratung.bedarfKoordination },
  { id: 'f-eb-gebiete', label: 'Gebiete mit Koordinationsbedarf vorhanden?', get: p => p.epaBeratung.gebieteKoordinationsbedarf },
  { id: 'f-k-inhaber', label: 'Kontoinhaber/in', get: p => p.konto.kontoinhaber },
  { id: 'f-k-adresse', label: 'Adresse', get: p => p.konto.adresse },
  { id: 'f-k-iban', label: 'IBAN', get: p => p.konto.iban },
  { id: 'f-k-bankname', label: 'Bankname', get: p => p.konto.bankname },
];
function statusRequiresExtendedFields(status) { return status === 'Fördergesuch' || status === 'Abschluss'; }
function requiredPlanungFieldsForStatus(status) {
  const extended = statusRequiresExtendedFields(status);
  return PLANUNG_REQUIRED_FIELDS.filter(f => f.always || extended);
}
function isEmptyRequiredValue(v) { return v === undefined || v === null || String(v).trim() === '' || v === '-'; }
// Prüft den gespeicherten Objektzustand (z.B. vor einem Statuswechsel über den Stepper).
function validatePlanungAgainstData(p, status) {
  return requiredPlanungFieldsForStatus(status).filter(f => isEmptyRequiredValue(f.get(p)));
}
// Prüft die aktuell im Formular eingegebenen (noch nicht gespeicherten) Werte.
function validatePlanungForm(status) {
  return requiredPlanungFieldsForStatus(status).filter(f => {
    const el = document.getElementById(f.id);
    return isEmptyRequiredValue(el ? el.value : '');
  });
}
function clearPlanungFieldErrors() {
  document.querySelectorAll('#planung-form .form-field.has-error').forEach(el => el.classList.remove('has-error'));
  document.querySelectorAll('#planung-form .field-error-msg').forEach(el => el.remove());
  document.querySelectorAll('#planung-form [aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
  const banner = document.getElementById('planung-form-error-banner');
  if (banner) banner.remove();
}
function showPlanungFieldErrors(missing) {
  clearPlanungFieldErrors();
  if (missing.length === 0) return;
  missing.forEach(f => {
    const input = document.getElementById(f.id);
    if (!input) return;
    const field = input.closest('.form-field');
    field.classList.add('has-error');
    input.setAttribute('aria-invalid', 'true');
    const msg = document.createElement('div');
    msg.className = 'field-error-msg';
    msg.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 2 1 21h22L12 2zm1 15h-2v-2h2v2zm0-4h-2V9h2v4z"/></svg><span>Dieses Feld ist erforderlich.</span>`;
    field.appendChild(msg);
  });
  const form = document.getElementById('planung-form');
  const banner = document.createElement('div');
  banner.id = 'planung-form-error-banner';
  banner.className = 'form-error-banner';
  banner.setAttribute('role', 'alert');
  banner.innerHTML = `
    <svg viewBox="0 0 24 24"><path d="M12 2 1 21h22L12 2zm1 15h-2v-2h2v2zm0-4h-2V9h2v4z"/></svg>
    <div>
      <strong>${missing.length} Pflichtfeld${missing.length > 1 ? 'er' : ''} fehlen.</strong>
      <div class="form-error-links">${missing.map(f => `<a href="#" data-jump-field="${f.id}">${escapeHtml(f.label)}</a>`).join('')}</div>
    </div>`;
  form.insertBefore(banner, form.firstChild);
  banner.querySelectorAll('[data-jump-field]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const el = document.getElementById(a.dataset.jumpField);
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus(); }
    });
  });
  const firstInput = document.getElementById(missing[0].id);
  if (firstInput) { firstInput.scrollIntoView({ behavior: 'smooth', block: 'center' }); firstInput.focus(); }
}
function clearSinglePlanungFieldError(id) {
  const input = document.getElementById(id);
  if (!input) return;
  const field = input.closest('.form-field');
  if (!field || !field.classList.contains('has-error')) return;
  field.classList.remove('has-error');
  input.removeAttribute('aria-invalid');
  const msg = field.querySelector('.field-error-msg');
  if (msg) msg.remove();
  if (!document.querySelector('#planung-form .form-field.has-error')) {
    const banner = document.getElementById('planung-form-error-banner');
    if (banner) banner.remove();
  }
}
function updatePlanungCondReqVisibility() {
  const statusEl = document.getElementById('f-status');
  if (!statusEl) return;
  const show = statusRequiresExtendedFields(statusEl.value);
  document.querySelectorAll('#planung-form .cond-req').forEach(el => { el.style.display = show ? 'inline' : 'none'; });
}

/* ---------------------- PRÜFPFLICHT (4-Jahres-Turnus ab Beratungsbeginn, nur Status Abschluss) ---------------------- */
const PRUEFPFLICHT_ENDE_JAHR = 2050; // Pflicht gilt nur bis zum letzten Termin VOR diesem Jahr

// Nächster Pflichttermin (Date) oder null, wenn keine (weitere) Prüfpflicht besteht.
function naechstePruefungFor(p) {
  if (p.status !== 'Abschluss') return null;
  const start = parseSwissDate(p.epaBeratung.datumBeratungsbeginn);
  if (!start) return null;
  const basis = parseSwissDate(p.pruefstatus.letzteUeberpruefung) || start;
  const naechste = addYears(basis, 4);
  if (naechste.getFullYear() >= PRUEFPFLICHT_ENDE_JAHR) return null;
  return naechste;
}
// 'ok' | 'faellig' | null (keine Prüfpflicht bzw. nicht anwendbar)
function pruefstatusFor(p) {
  const naechste = naechstePruefungFor(p);
  if (!naechste) return null;
  return new Date() >= naechste ? 'faellig' : 'ok';
}
function renderPruefstatusPill(p) {
  const status = pruefstatusFor(p);
  if (!status) return '';
  const naechste = naechstePruefungFor(p);
  return status === 'faellig'
    ? `<span class="status-pill status-pruefung-faellig">⚠ Überprüfung fällig seit ${formatDate(naechste)}</span>`
    : `<span class="status-pill status-pruefung-ok">Nächste Überprüfung: ${formatDate(naechste)}</span>`;
}
function renderPruefungBanner(p) {
  if (pruefstatusFor(p) !== 'faellig') return '';
  const naechste = naechstePruefungFor(p);
  return `<div class="pruefung-banner" id="pruefung-banner" role="alert">
    <svg viewBox="0 0 24 24"><path d="M12 2 1 21h22L12 2zm1 15h-2v-2h2v2zm0-4h-2V9h2v4z"/></svg>
    <div>
      <div class="pruefung-banner-title">Überprüfung fällig seit ${formatDate(naechste)}</div>
      <div class="pruefung-banner-text">Gemäss kantonaler Vorgabe muss diese Energieplanung bzw. ihre Massnahmen alle 4 Jahre überprüft werden. Bitte kontrollieren Sie die Planung und bestätigen Sie die Überprüfung.</div>
      <div class="btn-row"><button class="btn btn-primary" id="btn-bestaetige-pruefung">Überprüfung jetzt bestätigen</button></div>
    </div>
  </div>`;
}
function bindPruefungBanner(p) {
  const btn = document.getElementById('btn-bestaetige-pruefung');
  if (!btn) return;
  btn.addEventListener('click', () => {
    p.pruefstatus.letzteUeberpruefung = formatDate(new Date());
    toast('Überprüfung wurde bestätigt.');
    renderPlanungDetail();
  });
}

/* ---------------------- PLANUNG DETAIL ---------------------- */
function planungStepsFor(currentLabel) {
  const stepIdx = STATUS_ORDER.indexOf(currentLabel);
  return STATUS_ORDER.map((label, i) => ({
    label,
    sub: i < stepIdx ? 'Erledigt' : (i === stepIdx ? 'In Bearbeitung' : 'Ausstehend'),
    state: i < stepIdx ? 'done' : (i === stepIdx ? 'current' : 'upcoming')
  }));
}
// Rendert nur den Stepper neu (z.B. nach einem Klick während des Bearbeitens), ohne das restliche
// Formular neu aufzubauen — sonst gingen noch nicht gespeicherte Eingaben in anderen Feldern verloren.
function refreshPlanungStepperVisual(currentLabel, onSelect) {
  const old = document.getElementById('planung-stepper');
  if (!old) return;
  old.outerHTML = renderStepper(planungStepsFor(currentLabel), 'planung-stepper');
  bindStepper(document.getElementById('planung-stepper'), onSelect);
}
function handleStepperClick(p, label) {
  if (state.planungDetailsMode === 'edit') {
    // Im Bearbeiten-Formular ist das Status-Feld die Quelle der Wahrheit: der Stepper stösst nur
    // dessen change-Verhalten an (Pflichtfeld-Sternchen/Fehleranzeige), ohne die Seite neu zu rendern.
    const statusEl = document.getElementById('f-status');
    const current = statusEl ? statusEl.value : (state.planungPendingStatus || p.status);
    if (label === current) return;
    if (statusEl) {
      // löst den change-Listener aus, der u.a. refreshPlanungStepperVisual aufruft
      statusEl.value = label;
      statusEl.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      state.planungPendingStatus = label;
      refreshPlanungStepperVisual(label, l => handleStepperClick(p, l));
    }
    return;
  }

  if (label === p.status) return;
  const missing = validatePlanungAgainstData(p, label);
  if (missing.length > 0) {
    toast(`Status „${label}“ benötigt ${missing.length} weitere Pflichtfeld${missing.length > 1 ? 'er' : ''}.`);
    state.planungDetailsMode = 'edit';
    state.planungPendingStatus = label;
    renderPlanungDetail();
    return;
  }
  p.status = label;
  p.epaBeratung.prozessstatus = label;
  toast(`Status wurde auf „${label}“ gesetzt.`);
  renderPlanungDetail();
}
function renderPlanungDetail() {
  const p = findPlanung(state.planungId);
  if (!p) { state.view = 'list'; render(); return; }

  // Das Kontrolle-Tab ist Admin-exklusiv — bei Rollenwechsel weg von Admin auf Planungsdetails zurückfallen.
  if (state.planungTab === 'kontrolle' && state.role !== 'Admin') {
    state.planungTab = 'details';
    state.planungKontrolleMode = 'view';
  }

  const displayedStatus = state.planungDetailsMode === 'edit' ? (state.planungPendingStatus || p.status) : p.status;
  const steps = planungStepsFor(displayedStatus);

  $panel.innerHTML = `
    ${renderNavRow('Zurück zur Liste', [{ label: 'Liste Planungen' }, { label: p.id }])}
    <h2 class="panel-title" style="margin-bottom:4px;">${p.typ} ${p.gemeinde}</h2>
    <div class="process-label">Aktiver Prozess: EPA Beratung ${renderPruefstatusPill(p)}</div>
    ${renderStepper(steps, 'planung-stepper')}
    ${renderPruefungBanner(p)}

    <div class="subtab-row">
      <button class="subtab-btn ${state.planungTab === 'details' ? 'active' : ''}" data-subtab="details">Planungsdetails</button>
      <button class="subtab-btn ${state.planungTab === 'massnahmen' ? 'active' : ''}" data-subtab="massnahmen">
        Massnahmen <span class="subtab-count">${p.massnahmen.length}</span>
      </button>
      ${state.role === 'Admin' ? `<button class="subtab-btn ${state.planungTab === 'kontrolle' ? 'active' : ''}" data-subtab="kontrolle">Kontrolle</button>` : ''}
    </div>

    <div class="subtab-content">
      ${state.planungTab === 'details' ? renderPlanungDetailsTabContent(p)
        : state.planungTab === 'massnahmen' ? renderPlanungMassnahmenTabContent(p)
        : renderPlanungKontrolleTabContent(p)}
    </div>
  `;

  bindNavRow(() => { state.view = 'list'; render(); }, [() => { state.view = 'list'; render(); }]);
  bindStepper(document.getElementById('planung-stepper'), label => handleStepperClick(p, label));
  bindPruefungBanner(p);
  $panel.querySelectorAll('[data-subtab]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.planungTab = btn.dataset.subtab;
      renderPlanungDetail();
    });
  });

  if (state.planungTab === 'details') bindPlanungDetailsTab(p);
  else if (state.planungTab === 'massnahmen') bindPlanungMassnahmenTab(p);
  else bindPlanungKontrolleTab(p);
}

/* ---------------------- PLANUNGSDETAILS-TAB ---------------------- */
function renderPlanungDetailsTabContent(p) {
  return state.planungDetailsMode === 'edit' ? renderPlanungDetailsFormContent(p) : renderPlanungDetailsViewContent(p);
}

function renderPlanungDetailsViewContent(p) {
  const eb = p.epaBeratung, k = p.konto, ef = p.energieplanungFelder;
  return `
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
      ${field('Verantwortlichkeit Gemeinde', ef.verantwortlichkeit)}
      ${field('Berater/in Energieplanung', ef.beraterEnergieplanung)}
      ${field('Netto-null Ziel', ef.nettoNullZiel)}
      ${field('Energieeffizienz Ziel', ef.energieeffizienzZiel)}
      ${field('Stromproduktion Ziel', ef.stromproduktionZiel)}
    `)}

    <div class="btn-row">
      <button class="btn-outline-danger" id="btn-del-planung">
        <svg viewBox="0 0 24 24"><path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
        <span>Energieplanung löschen</span>
      </button>
      <button class="btn btn-primary" id="btn-edit-planung">Energieplanung bearbeiten</button>
    </div>
  `;
}

function yesNoSelect(id, value) {
  return `<select id="${id}">
    <option value="-" ${(!value || value === '-') ? 'selected' : ''}>Nicht festgelegt</option>
    <option value="Ja" ${value === 'Ja' ? 'selected' : ''}>Ja</option>
    <option value="Nein" ${value === 'Nein' ? 'selected' : ''}>Nein</option>
  </select>`;
}

function renderPlanungDetailsFormContent(p) {
  const eb = p.epaBeratung, k = p.konto, ef = p.energieplanungFelder;
  const condReq = `<span class="req cond-req">*</span>`;
  return `
    <div id="planung-form">
    <h3 class="subheading" style="margin-top:0;">EPA Beratung</h3>
    <div class="form-field"><label>Name EPA-Beratung</label><input type="text" id="f-eb-name" value="${escapeAttr(fixDash(eb.name))}"></div>
    <div class="form-field"><label>Beratungsperson${condReq}</label><input type="text" id="f-eb-beratungsperson" value="${escapeAttr(fixDash(eb.beratungsperson))}"></div>
    <div class="form-field"><label>Datum Beratungsbeginn${condReq}</label><input type="text" id="f-eb-datum" placeholder="dd.MM.yyyy" value="${escapeAttr(fixDash(eb.datumBeratungsbeginn))}"></div>
    <div class="form-field"><label>Bedarf eines Energierichtplans?${condReq}</label>${yesNoSelect('f-eb-energierichtplan', eb.bedarfEnergierichtplan)}</div>
    <div class="form-field"><label>Bedarf einer Koordination mit weiteren Gemeinde(n)?${condReq}</label>${yesNoSelect('f-eb-koordination', eb.bedarfKoordination)}</div>
    <div class="form-field"><label>Gebiete mit Koordinationsbedarf vorhanden?${condReq}</label>${yesNoSelect('f-eb-gebiete', eb.gebieteKoordinationsbedarf)}</div>
    <div class="form-field"><label>Förderabschlussformular</label><input type="text" id="f-eb-foerderformular" value="${escapeAttr(fixDash(eb.foerderabschlussformular))}"></div>

    <h3 class="subheading">Kontoinformationen Förderbeitrag</h3>
    <div class="form-field"><label>Kontoinhaber/in${condReq}</label><input type="text" id="f-k-inhaber" value="${escapeAttr(fixDash(k.kontoinhaber))}"></div>
    <div class="form-field"><label>Adresse${condReq}</label><input type="text" id="f-k-adresse" value="${escapeAttr(fixDash(k.adresse))}"></div>
    <div class="form-field"><label>IBAN${condReq}</label><input type="text" id="f-k-iban" value="${escapeAttr(fixDash(k.iban))}"></div>
    <div class="form-field"><label>Bankname${condReq}</label><input type="text" id="f-k-bankname" value="${escapeAttr(fixDash(k.bankname))}"></div>
    <div class="form-field"><label>Vermerk</label><input type="text" id="f-k-vermerk" value="${escapeAttr(fixDash(k.vermerk))}"></div>

    <h3 class="subheading">Energieplanung</h3>
    <div class="form-field"><label>Name</label><input type="text" id="f-name" value="${escapeAttr(p.name)}"></div>
    <div class="form-field"><label>Planungstyp<span class="req">*</span></label><input type="text" id="f-typ" value="${escapeAttr(p.typ)}"></div>
    <div class="form-field"><label>Jahr<span class="req">*</span></label><input type="text" id="f-jahr" value="${escapeAttr(p.jahr)}"></div>
    <div class="form-field"><label>Gemeinden<span class="req">*</span></label><input type="text" id="f-gemeinde" value="${escapeAttr(p.gemeinde)}"></div>
    <div class="form-field"><label>Status</label>
      <select id="f-status">${STATUS_ORDER.map(s => `<option value="${s}" ${(state.planungPendingStatus || p.status) === s ? 'selected' : ''}>${s}</option>`).join('')}</select>
    </div>
    <div class="form-field"><label>Verantwortlichkeit Gemeinde</label><input type="text" id="f-verantwortlichkeit" value="${escapeAttr(fixDash(ef.verantwortlichkeit))}"></div>
    <div class="form-field"><label>Berater/in Energieplanung</label><input type="text" id="f-berater-energieplanung" value="${escapeAttr(fixDash(ef.beraterEnergieplanung))}"></div>
    <div class="form-field"><label>Netto-null Ziel</label><input type="text" id="f-netto" value="${escapeAttr(fixDash(ef.nettoNullZiel))}"></div>
    <div class="form-field"><label>Energieeffizienz Ziel</label><input type="text" id="f-effizienz" value="${escapeAttr(fixDash(ef.energieeffizienzZiel))}"></div>
    <div class="form-field"><label>Stromproduktion Ziel</label><input type="text" id="f-strom" value="${escapeAttr(fixDash(ef.stromproduktionZiel))}"></div>

    <div class="btn-row right">
      <button class="btn btn-outline" id="btn-cancel">Abbrechen</button>
      <button class="btn btn-primary" id="btn-save">Speichern</button>
    </div>
    </div>
  `;
}

function bindPlanungDetailsTab(p) {
  if (state.planungDetailsMode === 'edit') {
    bindPlanungDetailsForm(p);
    return;
  }
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
  document.getElementById('btn-edit-planung').addEventListener('click', () => {
    state.planungDetailsMode = 'edit';
    state.planungPendingStatus = p.status;
    renderPlanungDetail();
  });
}

function bindPlanungDetailsForm(p) {
  const eb = p.epaBeratung, k = p.konto, ef = p.energieplanungFelder;

  updatePlanungCondReqVisibility();
  document.getElementById('f-status').addEventListener('change', e => {
    state.planungPendingStatus = e.target.value;
    updatePlanungCondReqVisibility();
    refreshPlanungStepperVisual(e.target.value, l => handleStepperClick(p, l));
    // Wurden bereits Fehler angezeigt, an den neu gewählten Status anpassen (z.B. beim Zurückwechseln auf "Entwurf" wieder verschwinden lassen).
    if (document.getElementById('planung-form-error-banner')) {
      showPlanungFieldErrors(validatePlanungForm(e.target.value));
    }
  });
  PLANUNG_REQUIRED_FIELDS.forEach(f => {
    const el = document.getElementById(f.id);
    if (!el) return;
    el.addEventListener('input', () => clearSinglePlanungFieldError(f.id));
    el.addEventListener('change', () => clearSinglePlanungFieldError(f.id));
  });
  if (state.planungPendingStatus) {
    const missing = validatePlanungForm(state.planungPendingStatus);
    showPlanungFieldErrors(missing);
  }

  document.getElementById('btn-cancel').addEventListener('click', () => {
    state.planungDetailsMode = 'view';
    state.planungPendingStatus = null;
    renderPlanungDetail();
  });
  document.getElementById('btn-save').addEventListener('click', () => {
    const targetStatus = document.getElementById('f-status').value;
    const missing = validatePlanungForm(targetStatus);
    if (missing.length > 0) {
      showPlanungFieldErrors(missing);
      toast(`${missing.length} Pflichtfeld${missing.length > 1 ? 'er' : ''} fehlen noch.`);
      return;
    }
    clearPlanungFieldErrors();
    eb.name = document.getElementById('f-eb-name').value || eb.name;
    eb.beratungsperson = document.getElementById('f-eb-beratungsperson').value || '-';
    eb.datumBeratungsbeginn = document.getElementById('f-eb-datum').value || '-';
    eb.bedarfEnergierichtplan = document.getElementById('f-eb-energierichtplan').value;
    eb.bedarfKoordination = document.getElementById('f-eb-koordination').value;
    eb.gebieteKoordinationsbedarf = document.getElementById('f-eb-gebiete').value;
    eb.foerderabschlussformular = document.getElementById('f-eb-foerderformular').value || '-';

    k.kontoinhaber = document.getElementById('f-k-inhaber').value || '-';
    k.adresse = document.getElementById('f-k-adresse').value || '-';
    k.iban = document.getElementById('f-k-iban').value || '-';
    k.bankname = document.getElementById('f-k-bankname').value || '-';
    k.vermerk = document.getElementById('f-k-vermerk').value || '-';

    p.name = document.getElementById('f-name').value || p.name;
    p.typ = document.getElementById('f-typ').value || p.typ;
    p.gemeinde = document.getElementById('f-gemeinde').value || p.gemeinde;
    p.jahr = document.getElementById('f-jahr').value || p.jahr;
    p.status = document.getElementById('f-status').value;
    ef.verantwortlichkeit = document.getElementById('f-verantwortlichkeit').value || '-';
    ef.beraterEnergieplanung = document.getElementById('f-berater-energieplanung').value || '-';
    ef.nettoNullZiel = document.getElementById('f-netto').value || '-';
    ef.energieeffizienzZiel = document.getElementById('f-effizienz').value || '-';
    ef.stromproduktionZiel = document.getElementById('f-strom').value || '-';
    eb.prozessstatus = p.status;

    toast('Energieplanung wurde gespeichert.');
    state.planungDetailsMode = 'view';
    state.planungPendingStatus = null;
    renderPlanungDetail();
  });
}

/* ---------------------- KONTROLLE-TAB (nur Admin) ---------------------- */
function renderPlanungKontrolleTabContent(p) {
  if (state.role !== 'Admin') return '';
  return state.planungKontrolleMode === 'edit' ? renderPlanungKontrolleFormContent(p) : renderPlanungKontrolleViewContent(p);
}

function renderPlanungKontrolleViewContent(p) {
  const eb = p.epaBeratung;
  return `
    ${section('gesuch', 'Gesuch (intern)', `
      ${field('Gesuchseingang', eb.gesuchseingang)}
      ${field('Gesuchs-Nr.', eb.gesuchsNr)}
      ${field('Auszahlungsbetrag CHF', formatChfAmount(eb.auszahlungsbetrag))}
      ${field('Energiestadt', eb.energiestadt)}
      ${field('Kommentar', eb.kommentar)}
    `)}

    <div class="btn-row right">
      <button class="btn btn-primary" id="btn-edit-kontrolle">Kontrolle bearbeiten</button>
    </div>
  `;
}

function renderPlanungKontrolleFormContent(p) {
  const eb = p.epaBeratung;
  return `
    <h3 class="subheading" style="margin-top:0;">Gesuch (intern)</h3>
    <div class="form-field"><label>Gesuchseingang</label><input type="text" id="f-eb-gesuchseingang" placeholder="dd.MM.yyyy" value="${escapeAttr(fixDash(eb.gesuchseingang))}"></div>
    <div class="form-field"><label>Gesuchs-Nr.</label><input type="number" id="f-eb-gesuchsnr" value="${eb.gesuchsNr}"></div>
    <div class="form-field"><label>Auszahlungsbetrag CHF</label><input type="number" id="f-eb-auszahlungsbetrag" value="${eb.auszahlungsbetrag}"></div>
    <div class="form-field"><label>Energiestadt</label>${yesNoSelect('f-eb-energiestadt', eb.energiestadt)}</div>
    <div class="form-field"><label>Kommentar</label>
      <textarea id="f-eb-kommentar" placeholder="Interner Kommentar...">${escapeHtml(eb.kommentar !== '-' ? eb.kommentar : '')}</textarea></div>

    <div class="btn-row right">
      <button class="btn btn-outline" id="btn-cancel-kontrolle">Abbrechen</button>
      <button class="btn btn-primary" id="btn-save-kontrolle">Speichern</button>
    </div>
  `;
}

function bindPlanungKontrolleTab(p) {
  if (state.role !== 'Admin') return;
  if (state.planungKontrolleMode === 'edit') {
    bindPlanungKontrolleForm(p);
    return;
  }
  bindSectionToggles();
  document.getElementById('btn-edit-kontrolle').addEventListener('click', () => {
    state.planungKontrolleMode = 'edit';
    renderPlanungDetail();
  });
}

function bindPlanungKontrolleForm(p) {
  const eb = p.epaBeratung;
  document.getElementById('btn-cancel-kontrolle').addEventListener('click', () => {
    state.planungKontrolleMode = 'view';
    renderPlanungDetail();
  });
  document.getElementById('btn-save-kontrolle').addEventListener('click', () => {
    eb.gesuchseingang = document.getElementById('f-eb-gesuchseingang').value || '-';
    eb.gesuchsNr = Number(document.getElementById('f-eb-gesuchsnr').value) || eb.gesuchsNr;
    eb.auszahlungsbetrag = Number(document.getElementById('f-eb-auszahlungsbetrag').value) || eb.auszahlungsbetrag;
    eb.energiestadt = document.getElementById('f-eb-energiestadt').value;
    eb.kommentar = document.getElementById('f-eb-kommentar').value || '-';
    toast('Kontrolle wurde gespeichert.');
    state.planungKontrolleMode = 'view';
    renderPlanungDetail();
  });
}

/* ---------------------- MASSNAHMEN-TAB: MASTER-DETAIL ---------------------- */
function renderPlanungMassnahmenTabContent(p) {
  const massList = getFilteredMassnahmen(p);
  return `
    <div class="md-layout">
      <div class="md-left">${renderMassnahmenListPanel(p, massList)}</div>
      <div class="md-right">${renderMassnahmeDetailPanel(p)}</div>
    </div>
  `;
}

function renderMassnahmenListPanel(p, massList) {
  return `
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
      `<div class="table-scroll"><table class="data-table massnahmen-table md-table">
        <thead><tr>
          <th class="col-check"><input type="checkbox" id="select-all-massnahmen"></th>
          ${massnahmenSortHeader('name', 'Massnahme')}
          ${massnahmenSortHeader('prozessstatus', 'Status')}
        </tr></thead>
        <tbody>
          ${massList.map(m => `
            <tr data-open-massnahme="${m.id}" class="${state.massnahmeId === m.id ? 'active' : ''}">
              <td class="col-check"><input type="checkbox" class="row-check" data-massnahme-id="${m.id}" ${state.massList.selected.has(m.id) ? 'checked' : ''}></td>
              <td>
                <div class="md-row-name">${m.name}</div>
                <div class="md-row-meta">${m.id} · ${val(m.handlungsfeld)}</div>
              </td>
              <td><span class="status-pill status-${m.prozessstatus.toLowerCase()}">${m.prozessstatus}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table></div>`}

    <div class="btn-row right" style="margin-top:14px;">
      <button class="btn btn-secondary" id="btn-import-massnahmen">Massnahmen importieren</button>
      <button class="btn btn-secondary" id="btn-export-massnahmen">Export Massnahmen CSV</button>
    </div>
  `;
}

function bindMassnahmenListPanel(p) {
  document.getElementById('btn-add-massnahme').addEventListener('click', () => {
    state.massnahmeId = null;
    state.mdMode = 'new';
    renderPlanungDetail();
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
  bindBulkBar(p);
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
    const massList = getFilteredMassnahmen(p);
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
      state.mdMode = 'view';
      renderPlanungDetail();
    });
  });
}

function bindPlanungMassnahmenTab(p) {
  bindMassnahmenListPanel(p);
  bindMassnahmeDetailPanel(p);
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

function fixDash(v) { return v === '-' ? '' : v; }

/* ---------------------- MASSNAHME: DETAIL-/BEARBEITEN-PANEL (rechte Spalte) ---------------------- */
function renderMassnahmeDetailPanel(p) {
  if (state.mdMode === 'edit' || state.mdMode === 'new') {
    return renderMassnahmeFormPanel(p, state.mdMode === 'edit');
  }
  if (state.mdMode === 'view' && state.massnahmeId) {
    const m = findMassnahme(p, state.massnahmeId);
    if (m) return renderMassnahmeViewPanel(m);
  }
  return `<div class="md-empty">Wähle links eine Massnahme aus oder erstelle über "+" eine neue Massnahme.</div>`;
}

function renderMassnahmeViewPanel(m) {
  const order = ['Geplant', 'Umsetzung', 'Abschluss'];
  const idx = order.indexOf(m.prozessstatus);
  const steps = order.map((label, i) => ({
    label,
    sub: i < idx ? 'Erledigt' : (i === idx ? 'In Bearbeitung' : 'Ausstehend'),
    state: i < idx ? 'done' : (i === idx ? 'current' : 'upcoming')
  }));

  return `
    <div class="md-panel-header">
      <span class="md-panel-id">${m.id}</span>
      <h3>${m.name}</h3>
    </div>
    ${renderStepper(steps, 'massnahme-stepper')}

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
      <button class="btn-outline-danger" id="btn-del-massnahme">
        <svg viewBox="0 0 24 24"><path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
        <span>Massnahme löschen</span>
      </button>
      <div class="btn-group">
        <button class="btn btn-outline" id="btn-geodaten">Geodaten editieren</button>
        <button class="btn btn-primary" id="btn-edit-massnahme">Massnahme bearbeiten</button>
      </div>
    </div>
  `;
}

function renderMassnahmeFormPanel(p, isEdit) {
  const m = isEdit ? findMassnahme(p, state.massnahmeId) : null;
  const contactOptions = contacts.map(c => `<option>${c.vorname} ${c.nachname} — ${c.organisation}</option>`).join('');

  return `
    <div class="md-panel-header">
      <h3>${isEdit ? 'Massnahme bearbeiten' : 'Neue Massnahme'}</h3>
    </div>

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
}

function bindMassnahmeDetailPanel(p) {
  if (state.mdMode === 'view' && state.massnahmeId) {
    const m = findMassnahme(p, state.massnahmeId);
    if (!m) return;
    document.getElementById('btn-del-massnahme').addEventListener('click', () => {
      if (confirm(`Massnahme ${m.id} wirklich löschen?`)) {
        p.massnahmen = p.massnahmen.filter(x => x.id !== m.id);
        state.massList.selected.delete(m.id);
        toast(`${m.id} wurde gelöscht.`);
        state.massnahmeId = null;
        state.mdMode = null;
        renderPlanungDetail();
      }
    });
    document.getElementById('btn-geodaten').addEventListener('click', () => toast('Geodaten-Editor ist in diesem Prototyp nicht verfügbar (Karte ist statisch).'));
    document.getElementById('btn-edit-massnahme').addEventListener('click', () => {
      state.mdMode = 'edit';
      renderPlanungDetail();
    });
    bindStepper(document.getElementById('massnahme-stepper'), label => {
      if (label === m.prozessstatus) return;
      m.prozessstatus = label;
      toast(`Status von ${m.id} wurde auf „${label}“ gesetzt.`);
      renderPlanungDetail();
    });
    return;
  }

  if (state.mdMode !== 'edit' && state.mdMode !== 'new') return;
  const isEdit = state.mdMode === 'edit';
  const m = isEdit ? findMassnahme(p, state.massnahmeId) : null;

  document.getElementById('btn-cancel').addEventListener('click', () => {
    state.mdMode = isEdit ? 'view' : null;
    renderPlanungDetail();
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
      state.mdMode = 'view';
    } else {
      const id = `M-${nextMassnahmeSeq++}`;
      p.massnahmen.push(Object.assign({ id }, data));
      state.massnahmeId = id;
      toast(`${id} wurde angelegt.`);
      state.mdMode = 'view';
    }
    renderPlanungDetail();
  });
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
      <button class="btn-outline-danger" id="btn-del-contact">
        <svg viewBox="0 0 24 24"><path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
        <span>Kontakt löschen</span>
      </button>
      <div class="btn-group">
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
      state.view = 'detail';
      state.planungTab = 'massnahmen';
      state.planungDetailsMode = 'view';
      state.planungKontrolleMode = 'view';
      state.planungId = planungId;
      state.massnahmeId = massnahmeId;
      state.mdMode = 'view';
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
      state.planungTab = 'details';
      state.planungDetailsMode = 'view';
      state.planungKontrolleMode = 'view';
      state.planungId = row.dataset.openReportPlanung;
      state.massnahmeId = null;
      state.mdMode = null;
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

L.tileLayer('https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg', {
  maxZoom: 18,
  attribution: '&copy; <a href="https://www.swisstopo.admin.ch">swisstopo</a>'
}).addTo(map);

L.control.zoom({ position: 'topright' }).addTo(map);
L.control.scale({ imperial: false }).addTo(map);

L.marker(LUZERN_CENTER).addTo(map)
  .bindPopup('Luzern')
  .openPopup();

/* ---------------------- INIT ---------------------- */
render();
