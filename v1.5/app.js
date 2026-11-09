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
  'CO2-Neutralität der öffentlichen Gebäude bis 2035.',
  'Die Gemeinde verfolgt das Ziel, die Treibhausgasemissionen bis 2050 auf netto null zu senken.\nZwischenziele:\n- 2030: Reduktion der Emissionen um 40 % gegenüber 2020\n- 2040: Reduktion um 75 %, Gemeindeverwaltung und öffentliche Gebäude klimaneutral\n- 2050: Netto-null im gesamten Gemeindegebiet\nDie Fortschritte werden alle zwei Jahre im Rahmen des Energie- und Klimaberichts überprüft.',
  'Netto-null bis 2045, d. h. fünf Jahre früher als in der kantonalen Energiestrategie vorgesehen.\nMassgebend sind die Sektoren Wärme, Mobilität und Strom. Für die Wärmeversorgung gilt ein vollständiger Ausstieg aus Öl- und Gasheizungen bis 2040; der Ausbau der Fernwärme wird in der Energierichtplanung festgelegt.',
  'Die Gemeinde strebt Netto-null bis 2050 an.\nSchwerpunkte:\n- Ersatz fossiler Heizungen in Gemeindebauten bis 2035\n- Elektrifizierung des kommunalen Fuhrparks\n- Sensibilisierung und Beratung der Bevölkerung\nDer Stand wird jährlich im Gemeinderat berichtet.'
];
const ENERGIEEFFIZIENZ_ZIELE = [
  'Senkung des Energieverbrauchs pro Kopf um 30 % bis 2035.',
  'Sanierungsrate der Gebäude auf 2 % pro Jahr erhöhen.',
  'Energetische Vorbildfunktion der Gemeindebauten stärken.',
  'Reduktion des Wärmebedarfs im Gebäudepark um 25 %.',
  'Steigerung der Energieeffizienz in Gewerbe und Industrie.',
  'Minergie-Standard bei allen Neubauten verbindlich vorschreiben.',
  'Der Energieverbrauch pro Kopf wird bis 2035 um 30 % gesenkt.\nMassnahmenschwerpunkte:\n- Erhöhung der Sanierungsrate auf 2 % pro Jahr\n- Energetische Sanierung aller Gemeindeliegenschaften bis 2032\n- Ersatz ineffizienter Beleuchtung (Strassen, Schulhäuser, Sportanlagen)\n- Beratungsangebot für private Eigentümerschaften (Gebäudeenergieberatung plus)',
  'Der Wärmebedarf der Gebäude sinkt bis 2040 um 25 %.\nDazu werden Sanierungen von Gemeindebauten priorisiert, Eigentümerschaften beraten und Neubauten nach Minergie-Standard erstellt.',
  'Steigerung der Energieeffizienz in Gewerbe und Industrie durch Zielvereinbarungen mit den zehn grössten Verbrauchern.\nDie Gemeinde unterstützt Betriebe bei Abwärmenutzung und Prozessoptimierung und prüft die Einführung eines kommunalen Förderprogramms.'
];
const STROMPRODUKTION_ZIELE = [
  'Ausbau der Photovoltaik auf 50 % des Strombedarfs bis 2040.',
  'Deckung des Gemeindebedarfs durch erneuerbaren Strom bis 2035.',
  'Verdopplung der lokalen Solarstromproduktion bis 2030.',
  'Förderung von PV-Anlagen auf allen geeigneten Dachflächen.',
  'Eigenversorgungsgrad mit erneuerbarem Strom auf 40 % steigern.',
  'Ausbau erneuerbarer Stromproduktion um 5 GWh bis 2035.',
  'Bis 2040 deckt die lokale Photovoltaik-Produktion mindestens 50 % des Strombedarfs der Gemeinde.\nUmsetzung:\n- Alle geeigneten Dächer öffentlicher Gebäude werden bis 2030 mit PV-Anlagen ausgestattet\n- Beratung und Förderbeiträge für private Anlagen\n- Prüfung von Solaranlagen an Fassaden, Parkplätzen und Lärmschutzwänden\n- Gründung einer Energiegenossenschaft für Bürgerbeteiligungen',
  'Verdopplung der lokalen Solarstromproduktion bis 2030, Ausbau der Kleinwasserkraft am Gemeindebach (Potenzial ca. 1.2 GWh/a) und Prüfung von Biogas aus der regionalen Landwirtschaft.\nDie Eigenversorgung soll durch lokale Speicherlösungen und ein Zusammenschluss zum Eigenverbrauch (ZEV) in neuen Quartieren erhöht werden.',
  'Der lokale Erneuerbaren-Anteil am Strom steigt auf 40 %.\nGeplant sind PV-Anlagen auf Schul- und Sportanlagen sowie die Prüfung einer Freiflächenanlage im Gewerbegebiet.'
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
      geplanterStart: '-',
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
// Fester Pool für die Dummy-Generierung (Kontakte, die später ergänzt werden, würden sonst die Zufallsauswahl verschieben)
const KONTAKT_POOL = contacts.slice();

let nextPlanungSeq = 846;
let nextMassnahmeSeq = 1000;

/* ---------------------- DUMMY-MASSNAHMEN GENERATOR ---------------------- */
/* ---------------------- STABILE DUMMY-DATEN (seeded Zufall) ---------------------- */
// Die Dummy-Daten werden deterministisch erzeugt: jede Energieplanung seedet den Zufallsgenerator mit ihrer ID,
// dadurch sehen die Daten nach jedem Reload identisch aus. Alle Datumswerte sind relativ zu diesem festen Referenzdatum
// (nicht zu "heute"), sonst würden sich die Daten täglich verschieben.
const DUMMY_REFERENZDATUM = new Date(2026, 10, 9);
let _rngState = 123456789;
function seedRng(key) { _rngState = hashStr(String(key)) || 1; }
function hashStr(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rand() {   // mulberry32
  _rngState = (_rngState + 0x6D2B79F5) >>> 0;
  let t = _rngState;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function randomInt(min, max) { return Math.floor(rand() * (max - min + 1)) + min; }
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
function slugify(str) { return String(str).toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
function gemeindeKontaktFor(gemeinde) {
  const org = 'Gemeinde ' + gemeinde;
  let c = contacts.find(x => x.organisation === org);
  if (!c) {
    const fix = GEMEINDE_VERANTWORTLICHE_FIX[gemeinde];
    let vorname, nachname;
    if (fix) { const t = fix.split(' '); vorname = t[0]; nachname = t.slice(1).join(' '); }
    else {
      const h = hashString(gemeinde);
      vorname = GEMEINDE_VERANTWORTLICHE_VORNAMEN[h % GEMEINDE_VERANTWORTLICHE_VORNAMEN.length];
      nachname = GEMEINDE_VERANTWORTLICHE_NACHNAMEN[Math.floor(h / GEMEINDE_VERANTWORTLICHE_VORNAMEN.length) % GEMEINDE_VERANTWORTLICHE_NACHNAMEN.length];
    }
    c = { vorname, nachname, organisation: org, email: slugify(vorname) + '.' + slugify(nachname) + '@' + slugify(gemeinde) + '.ch', gemeindeKontakt: true };
    contacts.push(c);
  }
  return c;
}
function verantwortlichePersonGemeinde(gemeinde) {
  return formatContactLabel(gemeindeKontaktFor(gemeinde));
}

// Zeitlicher Ablauf einer Energieplanung, passend zum Status (alles relativ zum Referenzdatum):
//  Entwurf (Beratung noch nicht gestartet) -> geplanter Start; Entwurf (Beratung läuft) -> Beratungsbeginn in der jüngeren Vergangenheit;
//  Verabschiedung -> Beratung weit fortgeschritten; Fördergesuch -> Gesuch in Vorbereitung oder beim Kanton;
//  Abschluss -> Gesuch eingereicht, Nachführung alle 4 Jahre ab Beratungsbeginn bzw. letzter Überprüfung.
function planProzess(p) {
  const today = new Date(DUMMY_REFERENZDATUM);
  const d = n => addDays(today, n);
  const plan = { today, status: p.status, gestartet: true, beginn: null, geplanterStart: null, gesuchseingang: null, letztePruefung: null };
  if (p.status === 'Entwurf') {
    if (rand() < 0.45) { plan.gestartet = false; plan.geplanterStart = d(randomInt(-45, 420)); }
    else plan.beginn = d(-randomInt(20, 320));
  } else if (p.status === 'Verabschiedung') {
    plan.beginn = d(-randomInt(150, 600));
  } else if (p.status === 'Fördergesuch') {
    plan.beginn = d(-randomInt(300, 900));
    if (rand() < 0.5) plan.gesuchseingang = d(-randomInt(10, 150));   // Gesuch liegt beim Kanton
  } else {   // Abschluss
    // Optionales Szenario (p.nfSzenario) für gezielt verteilte Nachführungs-Beispiele:
    //  ruhend = Frist in über 12 Monaten · offen = Frist in den nächsten 12 Monaten · faellig = Frist verstrichen, nie nachgeführt ·
    //  review = Frist verstrichen und Nachführung erfolgt (nächste Frist wieder in ferner Zukunft)
    const sz = p.nfSzenario;
    const alter = sz === 'ruhend' ? randomInt(420, 1000) : sz === 'offen' ? randomInt(1160, 1420) : sz === 'faellig' ? randomInt(1500, 2150) : sz === 'review' ? randomInt(1700, 2300) : randomInt(420, 2300);
    plan.beginn = d(-alter);
    plan.gesuchseingang = addDays(plan.beginn, randomInt(120, 300));
    const vierJahre = addYears(plan.beginn, 4);
    const pruefen = sz === 'review' ? true : (!sz && rand() < 0.5);
    if (pruefen && vierJahre < today) plan.letztePruefung = addDays(vierJahre, randomInt(0, Math.max(0, Math.round((today - vierJahre) / 86400000))));
  }
  const basis = plan.beginn || plan.geplanterStart;
  p.jahr = basis.getFullYear();
  return plan;
}

function buildMassnahme(index, planung, plan) {
  const today = plan.today;
  const d = n => addDays(today, n);
  const handlungsfeld = pick(HANDLUNGSFELDER);
  const vorlage = pick(MASSNAHME_VORLAGEN[handlungsfeld]);

  // Status der Massnahme hängt vom Prozessstand der Energieplanung ab
  let prozessstatus = 'Geplant';
  if (planung.status === 'Fördergesuch') prozessstatus = rand() < 0.15 ? 'Umsetzung' : 'Geplant';
  else if (planung.status === 'Abschluss') {
    const jahre = (today - plan.beginn) / (365 * 86400000);
    const anteilAbschluss = Math.min(0.6, 0.12 * jahre), r = rand();
    prozessstatus = r < anteilAbschluss ? 'Abschluss' : r < anteilAbschluss + 0.35 ? 'Umsetzung' : 'Geplant';
  }

  // Start-/Fälligkeitsdatum passend zum Massnahmenstatus: Geplant = Start in der Zukunft, Umsetzung = läuft (ein Teil überfällig),
  // Abschluss = vollständig in der Vergangenheit. Mehrjährige Massnahmen ergeben sich aus der Laufzeit.
  const frueh = addDays(plan.beginn || today, 30);
  const spanTage = Math.max(1, Math.round((d(-30) - frueh) / 86400000));
  let start, due;
  if (prozessstatus === 'Geplant') {
    start = rand() < 0.1 ? d(-randomInt(10, 90)) : d(randomInt(30, 540));
    due = addDays(start, randomInt(150, 1000));
  } else if (prozessstatus === 'Umsetzung') {
    start = frueh <= d(-30) ? addDays(frueh, randomInt(0, spanTage)) : d(-randomInt(10, 60));
    due = rand() < 0.2 ? d(-randomInt(10, 150)) : d(randomInt(30, 900));
    if (due <= start) due = addDays(start, randomInt(60, 300));
  } else {
    start = frueh <= d(-150) ? addDays(frueh, randomInt(0, Math.max(0, spanTage - 120))) : d(-300);
    due = addDays(start, randomInt(90, 700));
    if (due > d(-5)) due = d(-randomInt(5, 120));
    if (due <= start) start = addDays(due, -randomInt(60, 200));
  }
  // Umsetzungszeitraum aus Start und Ende ableiten: einjährig ("2026") oder mehrjährig ("2026–2028")
  const y1 = start.getFullYear(), y2 = Math.max(due.getFullYear(), y1);
  const umsetzungszeitraum = y1 === y2 ? String(y1) : `${y1}–${y2}`;

  const contact = rand() < 0.8 ? pick(KONTAKT_POOL) : null;
  const massnahme = {
    id: `M-${nextMassnahmeSeq++}`,
    esNr: rand() < 0.85 ? `${randomInt(1, 5)}.${randomInt(1, 4)}.${index + 1}` : '-',
    name: vorlage.name,
    prozessstatus,
    ausEpa: pick(['Ja', 'Ja', 'Ja', 'Nein']),
    beschreibung: vorlage.beschreibung,
    handlungsfeld,
    aktivitaetsbereich: pick(AKTIVITAETSBEREICHE),
    prioritaet: rand() < 0.75 ? pick(PRIORITAETEN) : '-',
    umsetzungszeitraum,
    startdatum: formatDate(start),
    faelligkeitsdatum: formatDate(due),
    budget: rand() < 0.9 ? formatChf(randomInt(2, 400) * 500) : '-',
    verantwortlichkeit: contact ? formatContactLabel(contact) : '-',
    bemerkungen: '-',
    // Energieträger sind nur bei Handlungsfeld "Wärme- und Kälteversorgung" relevant
    energietraeger: handlungsfeld === 'Wärme- und Kälteversorgung' && rand() < 0.6 ? buildEnergietraeger(randomInt(1, 2)) : []
  };
  // Geografische Markierung (Punkt / Linie / Kurve / Fläche) nur bei ortsgebundenen Massnahmen, innerhalb der Gemeinde der Planung (siehe dummy-massnahmen-geometrien.js)
  massnahme.geometrie = typeof erzeugeMassnahmeGeometrie === 'function'
    ? erzeugeMassnahmeGeometrie(massnahme, String(planung.gemeinde).split(',').map(g => g.trim()))
    : null;
  return massnahme;
}

function buildMassnahmen(planung, plan) {
  let count;
  if (planung.status === 'Entwurf') count = plan.gestartet ? randomInt(2, 10) : 0;   // in der Beratung entsteht das Massnahmenprogramm
  else if (planung.status === 'Verabschiedung') count = randomInt(6, 20);
  else count = randomInt(8, 25);
  const list = [];
  for (let i = 0; i < count; i++) list.push(buildMassnahme(i, planung, plan));
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

// Füllt die Detailfelder passend zum Prozessstand (siehe planProzess): Angaben, die in einer Phase noch nicht anfallen, bleiben leer.
function fillPlanungDetails(planung, plan) {
  const s = planung.status;
  const lead = planung.gemeinde.split(',')[0].trim();
  const eb = planung.epaBeratung;
  const nachEntwurf = s !== 'Entwurf';                       // Beratung abgeschlossen / Gemeinderat hat verabschiedet
  const gesuchPhase = s === 'Fördergesuch' || s === 'Abschluss';
  const jn = anteil => (rand() < anteil ? pick(['Ja', 'Nein']) : '-');   // Entwurf: Fragen erst teilweise beantwortet
  const gesuchsJahr = plan.gesuchseingang ? plan.gesuchseingang.getFullYear() : null;

  // EPA-Beratung
  if (plan.geplanterStart) eb.geplanterStart = formatDate(plan.geplanterStart);
  if (plan.gestartet) {
    eb.beratungsperson = formatContactLabel(pick(KONTAKT_POOL));
    eb.datumBeratungsbeginn = formatDate(plan.beginn);
    const anteil = nachEntwurf ? 1 : 0.6;
    eb.bedarfEnergierichtplan = jn(anteil);
    eb.bedarfKoordination = jn(anteil);
    eb.gebieteKoordinationsbedarf = jn(anteil);
  }
  eb.foerderabschlussformular = plan.gesuchseingang ? 'Unterschrieben eingereicht' : gesuchPhase ? 'In Vorbereitung' : 'Noch nicht erstellt';
  eb.auszahlungsbetrag = rand() < 0.85 ? 7200 : pick([6000, 6500, 7800, 8200, 9000]);
  if (plan.gesuchseingang) {
    eb.gesuchseingang = formatDate(plan.gesuchseingang);
    eb.gesuchsNr = Number(`${gesuchsJahr}${String(planung.id).replace(/[^0-9]/g, '')}`);   // Jahr + ID, wie der Vorschlag im Tab "Kontrolle"
  }
  eb.energiestadt = pick(['Ja', 'Nein', 'Nein']);
  if (gesuchPhase || plan.gestartet) eb.kommentar = pick(EPA_KOMMENTAR_BEISPIELE);

  // Energieplanung: zuständige Personen und Ziele
  const ef = planung.energieplanungFelder;
  planung.gemeinde.split(',').forEach(g => gemeindeKontaktFor(g.trim()));   // Gemeindekontakte für das Dropdown sicherstellen
  if (plan.gestartet || rand() < 0.5) ef.verantwortlichkeit = verantwortlichePersonGemeinde(lead);
  if (plan.gestartet) ef.beraterEnergieplanung = formatContactLabel(pick(externeBeraterKontakte));
  const zielAnteil = nachEntwurf ? 1 : (plan.gestartet ? 0.5 : 0);   // Ziele entstehen im Lauf der Beratung
  // Ziele: zwei Drittel mehrzeilig (Aufzählungen, Zwischenziele), ein Drittel einzeilig
  const pickZiel = liste => {
    const mehr = liste.filter(z => z.includes('\n')), ein = liste.filter(z => !z.includes('\n'));
    return rand() < 0.66 ? pick(mehr) : pick(ein);
  };
  if (rand() < zielAnteil) ef.nettoNullZiel = pickZiel(NETTO_NULL_ZIELE);
  if (rand() < zielAnteil) ef.energieeffizienzZiel = pickZiel(ENERGIEEFFIZIENZ_ZIELE);
  if (rand() < zielAnteil) ef.stromproduktionZiel = pickZiel(STROMPRODUKTION_ZIELE);

  // Konto: erst bei der Vorbereitung des Fördergesuchs erfasst
  if (gesuchPhase) {
    Object.assign(planung.konto, {
      kontoinhaber: `Gemeinde ${lead}${/region/i.test(planung.typ) ? ' (federführend)' : ''}`,
      adresse: randomGemeindeAdresse(lead),
      iban: randomIban(),
      bankname: pick(KONTO_BANKEN),
    });
  }

  // Wiederkehrende Überprüfung (nur Abschluss): letzte Überprüfung, falls die 4-Jahres-Frist schon einmal erreicht wurde
  if (plan.letztePruefung) planung.pruefstatus.letzteUeberpruefung = formatDate(plan.letztePruefung);
}

// Erzeugt für eine Energieplanung alle Dummy-Daten reproduzierbar (Seed = ID): Prozessstand, Angaben und Massnahmen.
function generiereProzessDaten(p) {
  seedRng(p.id);
  const plan = planProzess(p);
  fillPlanungDetails(p, plan);
  p.massnahmen = buildMassnahmen(p, plan);
  if (plan.letztePruefung) erzeugeNachfuehrungHistorie(p, plan);
}
// Bereits erfolgte Nachführung: Protokolleintrag mit Person und Stand von damals (Ziele, Massnahmenstatus), damit Zeitleiste
// und «Seit der letzten Nachführung» realistische Daten haben. Bewusst ohne NF_FELDER/nfSnapshot (werden erst später definiert).
function erzeugeNachfuehrungHistorie(p, plan) {
  const ef = p.energieplanungFelder;
  const von = (ef.beraterEnergieplanung && ef.beraterEnergieplanung !== '-' ? ef.beraterEnergieplanung : ef.verantwortlichkeit || 'Admin').replace(/ (.*)$/, '');
  const keys = ['verantwortlichkeit', 'beraterEnergieplanung', 'nettoNullZiel', 'energieeffizienzZiel', 'stromproduktionZiel'];
  const felder = {};
  keys.forEach(k => { felder[k] = ef[k] && ef[k] !== '-' ? ef[k] : ''; });
  // Stand damals: ein Teil der Angaben/Ziele war anders formuliert oder noch leer
  let geaendert = 0;
  ['nettoNullZiel', 'energieeffizienzZiel', 'stromproduktionZiel'].forEach(k => { if (rand() < 0.3) { felder[k] = rand() < 0.5 ? '' : pick(k === 'nettoNullZiel' ? NETTO_NULL_ZIELE : k === 'energieeffizienzZiel' ? ENERGIEEFFIZIENZ_ZIELE : STROMPRODUKTION_ZIELE); if (felder[k] !== (ef[k] && ef[k] !== '-' ? ef[k] : '')) geaendert++; } });
  // Massnahmen damals: manche weiter hinten im Prozess, ein, zwei erst seither hinzugekommen
  const massnahmen = {};
  const vorher = { 'Abschluss': 'Umsetzung', 'Umsetzung': 'Geplant' };
  p.massnahmen.forEach((m, i) => {
    if (i >= 3 && rand() < 0.2) return;   // damals noch nicht erfasst
    massnahmen[m.id] = rand() < 0.4 && vorher[m.prozessstatus] ? vorher[m.prozessstatus] : m.prozessstatus;
  });
  p.nfBasisAnzahl = 0; p.nfLegacyDatum = null;
  p.nfHistorie = [{ datum: formatDate(plan.letztePruefung), von, aenderungen: geaendert, massnahmen: Object.keys(massnahmen).length, stand: { felder, massnahmen } }];
}

const planungen = [
  makeEnergieplanung('EP-844', 'Adligenswil', 'Fördergesuch'),
  makeEnergieplanung('EP-713', 'Aesch', 'Verabschiedung'),
  makeEnergieplanung('EP-842', 'Alberswil', 'Entwurf'),
  makeEnergieplanung('EP-838', 'Ballwil', 'Entwurf'),
  makeEnergieplanung('EP-839', 'Buchrain', 'Abschluss'),
  makeEnergieplanung('EP-772', 'Buttisholz', 'Entwurf'),
];
planungen.forEach(generiereProzessDaten);

/* ---------------------- APP STATE ---------------------- */

const state = {
  tab: 'planungen',
  view: 'list',            // list | detail | contactForm
  planungId: null,
  planungTab: 'grunddaten', // grunddaten | epa | nachfuehrung | massnahmen | konto | kontrolle (Sub-Tabs in der Planungsdetailansicht)
  planungDetailsMode: 'view', // view | edit — Zustand des Planungsdetails-Tabs
  planungKontrolleMode: 'view', // view | edit — Zustand des Kontrolle-Tabs (nur Admin)
  nfKontoHinweis: false, // true: Formular zeigt, welche Kontoinfos für die Nachführung noch fehlen
  planungPendingStatus: null, // Zielstatus, wenn ein Stepper-Klick wegen fehlender Pflichtfelder ins Bearbeiten-Formular geleitet hat
  massnahmeId: null,
  mdMode: null,            // null (leer) | view | edit | new — Zustand des Massnahmen-Detailpanels rechts
  contactIndex: null,
  collapsed: {},           // section-id -> bool
  list: { search: '', filter: '', sortField: 'gemeinde', sortDir: 'asc' },
  massList: { search: '', filter: '', sortField: 'id', sortDir: 'asc', selected: new Set() },
  bulkEdit: { field: 'prozessstatus', value: 'Geplant' },
  contactList: { search: '', sortField: 'name', sortDir: 'asc', selected: new Set() },
  layoutMode: 'split',     // map | split | data
  role: 'Admin',  // Admin (default) | Energieberater | Gemeinde  — Rolle der angemeldeten Person
  personaId: 'admin',  // angemeldete Person (siehe rollenPersonas)
  benutzer: null,      // Kontakt-Anzeigename der angemeldeten Person (null = Admin)
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
  const pe = state.personaId === 'admin' ? { name: 'Admin', initials: 'A' } : (rollenPersonas().find(x => x.id === state.personaId) || { name: 'Admin', initials: 'A' });
  document.getElementById('avatar-initials').textContent = pe.initials;
  document.getElementById('user-name').textContent = pe.name;
  $avatarBtn.title = 'Angemeldet als ' + pe.name;
  document.querySelectorAll('#role-menu .role-menu-item').forEach(b => b.classList.toggle('active', b.dataset.persona === state.personaId));
}
// Menü mit Admin und einigen Demo-Personen (aus der Zugriffsverwaltung)
function renderRoleMenu() {
  const check = '<svg class="role-menu-check" viewBox="0 0 24 24"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 20.6 7.4 19.2 6z"/></svg>';
  $roleMenu.innerHTML = '<div class="role-menu-label">Benutzer wechseln</div>' + rollenPersonas().map(pe =>
    '<button class="role-menu-item' + (pe.id === state.personaId ? ' active' : '') + '" data-persona="' + escapeAttr(pe.id) + '">' +
    '<span class="role-menu-item-text"><span class="role-menu-item-name">' + escapeHtml(pe.name) + '</span><span class="role-menu-item-sub">' + escapeHtml(pe.sub) + '</span></span>' + check + '</button>').join('');
}
function wechsleBenutzer(id) {
  const pe = rollenPersonas().find(x => x.id === id);
  if (!pe) return;
  state.personaId = pe.id; state.role = pe.role; state.benutzer = pe.key;
  updateAvatar();
  $roleMenu.hidden = true;
  toast('Angemeldet als ' + pe.name + ' (' + pe.rolleText + ')');
  // Ist die geöffnete Planung für die Person nicht sichtbar, zurück zur Liste
  const offen = state.view === 'detail' && state.planungId && findPlanung(state.planungId);
  if (offen && !planungDarfSehen(offen)) { state.view = 'list'; state.planungId = null; }
  if (state.tab === 'zugriff' && pe.role !== 'Admin') state.tab = 'planungen';
  setActiveTabButton(state.tab);
  render();
}

$avatarBtn.addEventListener('click', e => {
  e.stopPropagation();
  if ($roleMenu.hidden) renderRoleMenu();
  $roleMenu.hidden = !$roleMenu.hidden;
});
$roleMenu.addEventListener('click', e => {
  e.stopPropagation();
  const btn = e.target.closest('[data-persona]');
  if (btn) wechsleBenutzer(btn.dataset.persona);
});
document.addEventListener('click', () => { $roleMenu.hidden = true; });
updateAvatar();

/* ---------------------- ANWENDUNGEN-SWITCHER (VERSIONEN) ---------------------- */
document.querySelectorAll('#version-switch [data-nav]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.classList.contains('active')) return;
    window.location.href = btn.dataset.nav;
  });
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
    const max = Math.max(min, Math.round(window.innerWidth * 0.8));
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
  updateGemeindeKarte();
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
  let list = planungen.filter(planungDarfSehen);   // Energieberater/innen sehen nur Planungen ihrer freigeschalteten Gemeinden
  const q = state.list.search.trim().toLowerCase();
  if (q) {
    list = list.filter(p =>
      p.id.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      String(p.jahr).includes(q) ||
      p.gemeinde.toLowerCase().includes(q) ||
      (p.regionName || '').toLowerCase().includes(q)
    );
  }
  if (state.list.filter) {
    list = list.filter(p => prozessSchrittFor(p).key === state.list.filter);
  }
  const field = state.list.sortField;
  const dir = state.list.sortDir === 'desc' ? -1 : 1;
  list.sort((a, b) => {
    if (field === 'jahr') return (a.jahr - b.jahr) * dir;
    if (field === 'naechster') {
      const na = naechsterSchrittFor(a).text.toLowerCase(), nb = naechsterSchrittFor(b).text.toLowerCase();
      return na < nb ? -1 * dir : na > nb ? 1 * dir : 0;
    }
    if (field === 'termin') {
      const ta = terminFor(a), tb = terminFor(b);
      if (!ta && !tb) return 0;
      if (!ta) return 1;
      if (!tb) return -1;
      return (ta - tb) * dir;
    }
    if (field === 'status') {
      // Reihenfolge wie im Prozess: EPA-Beratung (Entwurf, Verabschiedung, Fördergesuch) -> Förderung -> Nachführung
      const ka = prozessSchrittFor(a).nr, kb = prozessSchrittFor(b).nr;
      return (ka - kb) * dir || a.id.localeCompare(b.id);
    }
    // Sortiert wird nach dem, was in der Liste steht (bei regionalen Planungen der Regionsname)
    const key = p => String(field === 'gemeinde' ? (p.regionName || p.gemeinde) : p[field]);
    return key(a).localeCompare(key(b), 'de', { numeric: true, sensitivity: 'base' }) * dir || a.id.localeCompare(b.id);
  });
  return list;
}

/* ---------------------- PROZESSSCHRITT-BADGE (Status-Spalte der Liste) ---------------------- */
// Fälligkeit: aktuell nur die wiederkehrende Überprüfung (Prüfpflicht) im Status Abschluss, sonst kein Termin.
// Kurzform des Planungstyps für die Liste: "Kommunale Energieplanung" -> "kommunal", "Regionale Energieplanung" -> "regional"
function typKurz(typ) {
  const t = String(typ || '');
  if (/region/i.test(t)) return 'regional';
  if (/kommun/i.test(t)) return 'kommunal';
  return t;
}
// Entwurf ohne Beratungsbeginn: geplanter Start der EPA-Beratung; Abschluss: nächste Nachführung/Prüfung.
function beratungStartFor(p) {
  if (p.status !== 'Entwurf') return null;
  const eb = p.epaBeratung || {};
  if (parseSwissDate(eb.datumBeratungsbeginn)) return null;
  return parseSwissDate(eb.geplanterStart);
}
function terminFor(p) { return beratungStartFor(p) || naechstePruefungFor(p); }
// Überfällige Termine als «seit N Tagen» (Datum im Tooltip)
function seitTagenText(d) {
  const heute = new Date(); heute.setHours(0, 0, 0, 0);
  const tage = Math.max(1, Math.round((heute - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 86400000));
  return 'seit ' + tage + (tage === 1 ? ' Tag' : ' Tagen');
}
function terminCell(p) {
  const t = terminFor(p);
  const start = beratungStartFor(p);
  if (start) {
    const late = start < new Date(new Date().setHours(0, 0, 0, 0));
    return late
      ? `<span class="termin-faellig" title="Geplanter Start der EPA-Beratung – überfällig seit ${formatDate(start)}">⚠ ${seitTagenText(start)}</span>`
      : `<span title="Geplanter Start der EPA-Beratung">${formatDate(start)}</span>`;
  }
  if (!t) return '<span class="muted">–</span>';
  if (pruefstatusFor(p) === 'faellig') return `<span class="termin-faellig" title="Fällig seit ${formatDate(t)}">⚠ ${seitTagenText(t)}</span>`;
  return formatDate(t);
}
// Prozessschritt einer Energieplanung gemäss den Tabs der Detailansicht:
// 1 Grunddaten (Beratung noch nicht gestartet) · 2 EPA Beratung (Beratung läuft) · 3 Massnahmen (Verabschiedung) ·
// 4 Gesuch (Fördergesuch in Vorbereitung / beim Kanton) · 5 Nachführung (Abschluss, wiederkehrende Überprüfung)
function prozessSchrittFor(p) {
  const eb = p.epaBeratung || {};
  const gestartet = !!(eb.datumBeratungsbeginn && eb.datumBeratungsbeginn !== '-');
  const eingang = !!(eb.gesuchseingang && eb.gesuchseingang !== '-');
  let key, sub = '', warn = false;
  if (p.status === 'Abschluss') {
    key = 'nachfuehrung';
    const naechste = naechstePruefungFor(p);
    if (pruefstatusFor(p) === 'faellig') { sub = 'fällig'; warn = true; }
    else if (naechste && naechste < addYears(new Date(), 1)) sub = 'bald fällig';
  } else if (p.status === 'Fördergesuch') {
    key = 'konto'; sub = eingang ? 'beim Kanton' : 'in Vorbereitung';
  } else if (p.status === 'Verabschiedung') {
    key = 'massnahmen'; sub = 'Verabschiedung';
  } else if (gestartet) {
    key = 'epa'; sub = 'läuft';
  } else {
    key = 'grunddaten'; sub = 'Beratung geplant';
  }
  const idx = PROZESS_TABS.findIndex(t => t.key === key);
  return { key, nr: idx + 1, label: PROZESS_TABS[idx].label, sub, warn };
}
function phaseBadge(p) {
  const st = prozessSchrittFor(p);
  const segs = PROZESS_TABS.map((t, i) => `<i class="${i < st.nr ? 'on' : ''}"></i>`).join('');
  return `<span class="phase-badge phase-${st.key}${st.warn ? ' is-warn' : ''}"><span class="pseg" role="img" aria-label="Schritt ${st.nr} von ${PROZESS_TABS.length}" title="Schritt ${st.nr} von ${PROZESS_TABS.length}: ${st.label}">${segs}</span><span class="phase-label">${st.label}</span>${st.sub ? `<span class="phase-sub">· ${st.sub}</span>` : ''}</span>`;
}

// Nächster Schritt je Energieplanung (abgeleitet aus Status / Prüfpflicht, analog v2)
// art: 'aufgabe' | 'warn' (fällig) | 'ok' (nichts zu tun)
function naechsterSchrittFor(p) {
  // Entspricht der Aktion am Ende des jeweils aktuellen Prozessschritts (siehe prozessAktionFor)
  const eb = p.epaBeratung || {};
  const gestartet = !!(eb.datumBeratungsbeginn && eb.datumBeratungsbeginn !== '-');
  const eingang = !!(eb.gesuchseingang && eb.gesuchseingang !== '-');
  if (p.status === 'Entwurf') return { text: gestartet ? 'EPA Beratung abschliessen' : 'EPA Beratung starten', art: 'aufgabe' };
  if (p.status === 'Verabschiedung') return { text: 'Verabschiedung erfassen', art: 'aufgabe' };
  if (p.status === 'Fördergesuch') return { text: eingang ? 'Beratung abschliessen' : 'Fördergesuch einreichen', art: 'aufgabe' };
  const t = naechstePruefungFor(p);
  if (t) {
    if (pruefstatusFor(p) === 'faellig') return { text: `Nachführung ${t.getFullYear()} abschliessen (fällig)`, art: 'warn' };
    if (t < addYears(new Date(), 1)) return { text: `Nachführung ${t.getFullYear()} steht bald an`, art: 'aufgabe' };
  }
  return { text: 'Aktuell nichts zu tun', art: 'ok' };
}
function naechsterSchrittCell(p) {
  const n = naechsterSchrittFor(p);
  return `<span class="next-step next-${n.art}">${n.text}</span>`;
}

/* ---------------------- BESTÄTIGUNGS-DIALOG (ersetzt window.confirm) ---------------------- */
function confirmDialog(message, opts = {}) {
  const { title = 'Bestätigen', confirmLabel = 'OK', cancelLabel = 'Abbrechen', danger = false } = opts;
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-box" role="alertdialog" aria-modal="true" aria-labelledby="cd-title" aria-describedby="cd-text">
        <h3 id="cd-title">${escapeHtml(title)}</h3>
        <p class="modal-text" id="cd-text">${escapeHtml(message)}</p>
        <div class="btn-row modal-actions">
          <button type="button" class="btn btn-secondary" data-cd="cancel">${escapeHtml(cancelLabel)}</button>
          <button type="button" class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-cd="ok">${escapeHtml(confirmLabel)}</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    const done = result => { overlay.remove(); document.removeEventListener('keydown', onKey, true); resolve(result); };
    const onKey = e => {
      if (e.key === 'Escape') { e.preventDefault(); done(false); }
      else if (e.key === 'Enter') { e.preventDefault(); done(true); }
    };
    document.addEventListener('keydown', onKey, true);
    overlay.addEventListener('click', e => { if (e.target === overlay) done(false); });
    overlay.querySelector('[data-cd="cancel"]').addEventListener('click', () => done(false));
    overlay.querySelector('[data-cd="ok"]').addEventListener('click', () => done(true));
    overlay.querySelector('[data-cd="cancel"]').focus();
  });
}

/* ---------------------- NEUE ENERGIEPLANUNG (mit Prüfung auf bestehende Planung je Gemeinde) ---------------------- */
const TYP_KOMMUNAL = 'Kommunale Energieplanung';
const TYP_REGIONAL = 'Regionale Energieplanung';
// Bestehende Planungen desselben Typs, die (mindestens) eine der Gemeinden betreffen.
function planungenFuerGemeinden(gemeinden, typ) {
  const set = new Set(gemeinden.map(g => String(g).trim().toLowerCase()));
  return planungen.filter(p => p.typ === typ &&
    String(p.gemeinde).split(',').some(x => set.has(x.trim().toLowerCase())));
}
// Öffnet eine Planung direkt im aktuellen Prozessschritt (Tab), in der Ansicht oder im Bearbeiten-Modus.
// Bearbeiten gibt es nur in den Formular-Tabs (Grunddaten, EPA Beratung, Gesuch); Massnahmen und Nachführung sind direkt änderbar.
function openPlanung(id, edit) {
  karteHervorhebungEnde();
  const p = findPlanung(id);
  const tab = p ? prozessSchrittFor(p).key : 'grunddaten';
  const editierbar = !!edit && PANE_TABS.includes(tab);
  state.planungId = id;
  state.view = 'detail';
  state.planungTab = tab;
  state.planungDetailsMode = editierbar ? 'edit' : 'view';
  state.planungKontrolleMode = 'view';
  state.planungPendingStatus = editierbar && p ? p.status : null;
  state.massnahmeId = null;
  state.mdMode = null;
  state.collapsed = {};
  state.massList.selected.clear();
  render();
}
function openNeuePlanungDialog() {
  if (document.getElementById('neue-planung-dialog')) return;
  const gemeinden = GEMEINDEN_LUZERN_PLZ.map(g => g.name);
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'neue-planung-dialog';
  overlay.innerHTML = `
    <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="np-title">
      <h3 id="np-title">Neue Energieplanung</h3>
      <div class="form-field">
        <label>Planungstyp<span class="req">*</span></label>
        <div class="np-typ">
          <label class="np-radio"><input type="radio" name="np-typ" value="kommunal" checked> Kommunale Energieplanung <span class="np-hint">(genau eine Gemeinde)</span></label>
          <label class="np-radio"><input type="radio" name="np-typ" value="regional"> Regionale Energieplanung <span class="np-hint">(mehrere Gemeinden)</span></label>
        </div>
      </div>
      <div class="form-field" id="np-field-kommunal">
        <label for="np-gemeinde">Gemeinde<span class="req">*</span></label>
        <select id="np-gemeinde" class="select-input">
          <option value="">Bitte wählen…</option>
          ${gemeinden.map(n => `<option value="${escapeAttr(n)}">${n}</option>`).join('')}
        </select>
      </div>
      <div class="form-field" id="np-field-regional" hidden>
        <label>Gemeinden<span class="req">*</span> <span class="np-hint" id="np-count">(mindestens 2 wählen)</span></label>
        <input type="text" id="np-filter" placeholder="Gemeinde suchen…" class="np-filter">
        <div class="np-list" id="np-list">
          ${gemeinden.map(n => `<label class="np-item" data-name="${escapeAttr(n.toLowerCase())}"><input type="checkbox" value="${escapeAttr(n)}"> ${n}</label>`).join('')}
        </div>
      </div>
      <div class="modal-msg" id="np-msg" hidden></div>
      <div class="btn-row modal-actions">
        <button type="button" class="btn btn-secondary" id="np-cancel">Abbrechen</button>
        <button type="button" class="btn btn-primary" id="np-create">Erstellen</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  const $msg = overlay.querySelector('#np-msg');
  const $sel = overlay.querySelector('#np-gemeinde');
  const $fk = overlay.querySelector('#np-field-kommunal');
  const $fr = overlay.querySelector('#np-field-regional');
  const $count = overlay.querySelector('#np-count');
  const typ = () => overlay.querySelector('input[name="np-typ"]:checked').value;
  const checked = () => [...overlay.querySelectorAll('#np-list input:checked')].map(i => i.value);
  const close = () => { overlay.remove(); document.removeEventListener('keydown', onKey); };
  const onKey = e => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  overlay.querySelector('#np-cancel').addEventListener('click', close);
  const showMsg = html => { $msg.innerHTML = html; $msg.hidden = false; };
  const updateCount = () => { const n = checked().length; $count.textContent = n ? `(${n} gewählt, mindestens 2)` : '(mindestens 2 wählen)'; };

  overlay.querySelectorAll('input[name="np-typ"]').forEach(r => r.addEventListener('change', () => {
    $msg.hidden = true;
    $fk.hidden = typ() !== 'kommunal';
    $fr.hidden = typ() !== 'regional';
  }));
  $sel.addEventListener('change', () => { $msg.hidden = true; });
  overlay.querySelector('#np-list').addEventListener('change', () => { $msg.hidden = true; updateCount(); });
  overlay.querySelector('#np-filter').addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    overlay.querySelectorAll('#np-list .np-item').forEach(el => { el.hidden = !!q && !el.dataset.name.includes(q); });
  });
  $sel.focus();

  overlay.querySelector('#np-create').addEventListener('click', () => {
    const kommunal = typ() === 'kommunal';
    const gewaehlt = kommunal ? ($sel.value ? [$sel.value] : []) : checked();
    const typName = kommunal ? TYP_KOMMUNAL : TYP_REGIONAL;
    if (kommunal && !gewaehlt.length) { showMsg('Bitte wählen Sie eine Gemeinde.'); return; }
    if (!kommunal && gewaehlt.length < 2) { showMsg('Eine regionale Energieplanung betrifft mehrere Gemeinden. Bitte wählen Sie mindestens zwei Gemeinden.'); return; }

    const vorhanden = planungenFuerGemeinden(gewaehlt, typName);
    if (vorhanden.length) {
      const links = vorhanden.map(p => `<a href="#" data-open-existing="${p.id}">${p.id} (${escapeHtml(p.gemeinde)}, ${p.status})</a>`).join(', ');
      showMsg(kommunal
        ? `In der Gemeinde <strong>${escapeHtml(gewaehlt[0])}</strong> existiert bereits eine kommunale Energieplanung: ${links}. Es kann keine weitere erstellt werden.`
        : `Für mindestens eine der gewählten Gemeinden existiert bereits eine regionale Energieplanung: ${links}. Es kann keine weitere erstellt werden.`);
      $msg.querySelectorAll('[data-open-existing]').forEach(a => a.addEventListener('click', e => {
        e.preventDefault(); close(); openPlanung(a.dataset.openExisting);
      }));
      return;
    }
    const id = `EP-${nextPlanungSeq++}`;
    const gemeindeText = gewaehlt.join(', ');
    const p = makeEnergieplanung(id, gemeindeText, 'Entwurf', { typ: typName, name: `${typName} ${gemeindeText}` });
    gewaehlt.forEach(g => gemeindeKontaktFor(g));
    planungen.unshift(p);
    close();
    toast(`${id} wurde angelegt.`);
    openPlanung(id);
  });
}

function planungSortHeader(field, label) {
  const active = state.list.sortField === field;
  const arrow = active ? (state.list.sortDir === 'asc' ? '▲' : '▼') : '↕';
  return `<th data-psort="${field}">${label} <span class="sort-arrow">${arrow}</span></th>`;
}

// "X" im Suchfeld: Eingabe löschen
function searchClearBtn(id, value) {
  return value ? `<button type="button" class="search-clear" data-search-clear="${id}" aria-label="Eingabe löschen" title="Eingabe löschen">✕</button>` : '';
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-search-clear]');
  if (!b) return;
  const id = b.dataset.searchClear;
  if (id === 'planung-search') { state.list.search = ''; renderPlanungList(); }
  else if (id === 'massnahme-search') { state.massList.search = ''; renderPlanungDetail(); }
  else if (id === 'contact-search') { state.contactList.search = ''; renderContactList(); }
  const el = document.getElementById(id);
  if (el) el.focus();
});

function renderPlanungList() {
  const list = getFilteredPlanungen();
  $panel.innerHTML = `
    <div class="panel-title-row">
      <h2 class="panel-title">Übersicht Energieplanungen</h2>
      <button type="button" class="btn btn-primary" id="btn-add-planung">Neue Energieplanung</button>
    </div>
    <div class="toolbar-row">
      <div class="search-input-wrap${state.list.search ? ' has-value' : ''}">
        <input type="text" id="planung-search" placeholder="Name, ID, Jahr..." value="${escapeAttr(state.list.search)}">
        ${searchClearBtn('planung-search', state.list.search)}
        <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"/></svg>
      </div>
      <select class="select-input" id="planung-filter">
        <option value="">Filter...</option>
        ${PROZESS_TABS.map(t => `<option value="${t.key}" ${state.list.filter === t.key ? 'selected' : ''}>${t.label}</option>`).join('')}
      </select>
    </div>
    ${list.length === 0 ? `<div class="empty-state">Keine Energieplanungen gefunden.</div>` :
      `<div class="table-scroll"><table class="data-table planungen-table">
        <thead><tr>
          ${planungSortHeader('id', 'ID')}
          ${planungSortHeader('gemeinde', 'Gemeinde(n)')}
          ${planungSortHeader('typ', 'Typ')}
          ${planungSortHeader('status', 'Status')}
          ${planungSortHeader('naechster', 'Nächster Schritt').replace('<th ', '<th class="col-next" ')}
          ${planungSortHeader('termin', 'Fälligkeit')}
          <th class="col-actions"><span class="sr-only">Aktionen</span></th>
        </tr></thead>
        <tbody>
          ${list.map(p => `
            <tr data-open-planung="${p.id}">
              <td>${p.id}</td>
              <td title="${escapeAttr(p.gemeinde)}">${planungGemeindeCell(p)}</td>
              <td title="${p.typ}"><span class="t-full">${typKurz(p.typ)}</span><span class="t-short" aria-hidden="true">${typKurz(p.typ).charAt(0)}.</span></td>
              <td>${phaseBadge(p)}</td>
              <td class="col-next">${naechsterSchrittCell(p)}</td>
              <td class="cell-termin">${terminCell(p)}</td>
              <td class="col-actions">
                <button type="button" class="row-action" data-open-planung="${p.id}" title="Ansehen" aria-label="${p.id} ansehen"><svg viewBox="0 0 24 24"><path d="M12 5C7 5 2.7 8.1 1 12.5 2.7 16.9 7 20 12 20s9.3-3.1 11-7.5C21.3 8.1 17 5 12 5zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg></button>
                <button type="button" class="row-action" data-open-planung="${p.id}" data-edit="1" title="Bearbeiten" aria-label="${p.id} bearbeiten"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25zM20.7 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table></div>`}
  `;

  document.getElementById('btn-add-planung').addEventListener('click', openNeuePlanungDialog);
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
  // Zeile überfahren: Gemeinde(n) in der Karte hervorheben
  $panel.querySelectorAll('tr[data-open-planung]').forEach(tr => {
    tr.addEventListener('mouseenter', () => karteHebeHervor(findPlanung(tr.dataset.openPlanung)));
    tr.addEventListener('mouseleave', karteHervorhebungEnde);
  });
  $panel.querySelectorAll('[data-open-planung]').forEach(row => {
    row.addEventListener('click', e => {
      // Die Aktions-Buttons in der Zeile lösen nur einmal aus (sonst würde zusätzlich die Zeile klicken)
      if (row.tagName === 'TR' && e.target.closest('.row-action')) return;
      karteZoomAufPlanung(findPlanung(row.dataset.openPlanung));
      openPlanung(row.dataset.openPlanung, row.hasAttribute('data-edit'));
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
// Eine einzige Zurück-Zeile: "← <übergeordnete Ansicht>" (z.B. "← Übersicht Energieplanungen").
// Der Pfad (parts) wird nur noch für die Beschriftung verwendet: das erste Element ist das Ziel.
function renderNavRow(backLabel, parts) {
  const label = (parts && parts[0] && parts[0].label) || backLabel;
  return `<div class="nav-row">
    <button class="back-link" id="btn-back">
      <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"/></svg>
      ${label}
    </button>
  </div>`;
}
function bindNavRow(backHandler) {
  document.getElementById('btn-back').addEventListener('click', backHandler);
}

/* ---------------------- PLANUNGSDETAILS: PFLICHTFELD-VALIDIERUNG ---------------------- */
// Immer Pflicht (Status "Entwurf" & "Verabschiedung"); ab Status "Fördergesuch"/"Abschluss" kommen die übrigen Felder dazu.
const PLANUNG_REQUIRED_FIELDS = [
  { id: 'f-typ', label: 'Planungstyp', always: true, get: p => p.typ },
  { id: 'f-gemeinde', label: 'Gemeinde(n)', always: true, get: p => p.gemeinde },
  { id: 'f-eb-beratungsperson', label: 'Beratungsperson', get: p => p.epaBeratung.beratungsperson },
  { id: 'f-eb-datum', label: 'Datum Beratungsbeginn', get: p => p.epaBeratung.datumBeratungsbeginn },
  { id: 'f-eb-energierichtplan', label: 'Bedarf eines Energierichtplans?', get: p => p.epaBeratung.bedarfEnergierichtplan },
  { id: 'f-eb-koordination', label: 'Bedarf einer Koordination mit weiteren Gemeinden?', get: p => p.epaBeratung.bedarfKoordination },
  { id: 'f-eb-gebiete', label: 'Gebiete mit Koordinationsbedarf vorhanden?', get: p => p.epaBeratung.gebieteKoordinationsbedarf },
  { id: 'f-k-inhaber', label: 'Kontoinhaber/in', get: p => p.konto.kontoinhaber },
  { id: 'f-k-adresse', label: 'Adresse', get: p => p.konto.adresse },
  { id: 'f-k-iban', label: 'IBAN', get: p => p.konto.iban },
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
function showPlanungFieldErrors(missing, headline) {
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
      <strong>${headline ? escapeHtml(headline) : missing.length + ' Pflichtfeld' + (missing.length > 1 ? 'er' : '') + ' fehlen.'}</strong>
      <div class="form-error-links">${missing.map(f => `<a href="#" data-jump-field="${f.id}">${escapeHtml(f.label)}</a>`).join('')}</div>
    </div>`;
  form.insertBefore(banner, form.firstChild);
  banner.querySelectorAll('[data-jump-field]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const el = document.getElementById(a.dataset.jumpField);
      if (el) { showPaneOf(el); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus(); }
    });
  });
  const firstInput = document.getElementById(missing[0].id);
  if (firstInput) { showPaneOf(firstInput); firstInput.scrollIntoView({ behavior: 'smooth', block: 'center' }); firstInput.focus(); }
}
// Liegt ein Feld in einem gerade versteckten Tab des Formulars, wird dieser Tab geöffnet.
function showPaneOf(el) {
  const pane = el.closest('[data-pane]');
  if (pane && pane.hidden) activatePane(pane.dataset.pane);
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
  // Feste Fristen: Beratungsbeginn + 4, 8, 12 … Jahre. Jede erledigte Nachführung (auch vorzeitige) deckt die nächste offene Frist ab.
  const naechste = addYears(start, 4 * (nfErledigt(p) + 1));
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
    ? `<span class="status-pill status-pruefung-faellig">⚠ Nachführung fällig seit ${formatDate(naechste)}</span>`
    : `<span class="status-pill status-pruefung-ok">Nächste Nachführung: ${formatDate(naechste)}</span>`;
}
// Hinweis ausserhalb des Tabs "Nachführung": führt nur dorthin — abgeschlossen wird ausschliesslich im Tab (nach Prüfung).
function renderPruefungBanner(p) {
  const ph = nfPhase(p);
  if ((ph !== 'faellig' && ph !== 'offen') || state.planungTab === 'nachfuehrung') return '';
  return `<div class="pruefung-banner" id="pruefung-banner" role="alert">
    <svg viewBox="0 0 24 24"><path d="M12 2 1 21h22L12 2zm1 15h-2v-2h2v2zm0-4h-2V9h2v4z"/></svg>
    <div>
      <div class="pruefung-banner-title">${ph === 'faellig' ? 'Nachführung fällig' : 'Nachführung steht an'}</div>
      <div class="pruefung-banner-text">${ph === 'faellig' ? 'Angaben, Ziele und Massnahmen müssen alle 4 Jahre überprüft werden.' : 'Die Frist läuft in den nächsten ' + NF_VORLAUF_MONATE + ' Monaten ab. Sie können die Nachführung jetzt durchführen.'}</div>
      <div class="btn-row"><button class="btn btn-primary" id="btn-bestaetige-pruefung">Zur Nachführung</button></div>
    </div>
  </div>`;
}
function bindPruefungBanner(p) {
  const btn = document.getElementById('btn-bestaetige-pruefung');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (nachfuehrungGesperrt(p)) { nachfuehrungUmleiten(p); return; }
    state.planungTab = 'nachfuehrung';
    renderPlanungDetail();
    const sc = document.querySelector('.panel-content'); if (sc) sc.scrollTop = 0;
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
/* ---------------------- FÖRDERABSCHLUSSFORMULAR (druckbare Vorlage, aus v2 übernommen) ---------------------- */
function foerderFormularHtml(p) {
  const e = p.epaBeratung, k = p.konto;
  const jn = v => `<span>${v === 'Ja' ? '☒' : '☐'} Ja</span> <span>${v === 'Nein' ? '☒' : '☐'} Nein</span>`;
  const mass = p.massnahmen.slice().sort((a, b) => (a.esNr || '').localeCompare(b.esNr || '', 'de', { numeric: true }));
  const beilagen = [['Kick-Off Präsentation', 1], ['Abschlusspräsentation', 1], ['Beratungscheckliste (für zertifizierte Energiestädte optional)', 0], ['Ausgefülltes Feedbackformular', 1], ['Kopie Rechnung Beratungsbüro', 1]];
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Förderabschlussformular ${escapeHtml(p.gemeinde)}</title><style>
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
    <div class="box"><table><tr><td><b>${gemeindeLabel(p)}:</b></td><td>${escapeHtml(p.gemeinde)}</td></tr><tr><td><b>Energieplanung:</b></td><td>${escapeHtml(p.name)}</td></tr></table></div>
    <p>Dieses Dokument bestätigt die Durchführung der EPA-Beratung gemäss den Förderbedingungen und Qualitätsvorgaben des Kantons Luzern. Der Gemeinderat bezeugt die Kenntnisnahme der Massnahmen (vgl. Punkt 1) sowie des Bedarfs einer räumlichen Abstimmung (vgl. Punkt 2) und bestätigt die kontinuierliche Umsetzung und Nachführung der Massnahmen. Die Nachführung der Massnahmen soll in einem Turnus von vier Jahren erfolgen. Bei Energiestädten ist dieser abgestimmt mit dem Zeitpunkt der Re-Audits.<br>
    Das unterzeichnete Formular ist Bedingung für die Auszahlung der Fördergelder in Höhe von CHF 7’200.- und ist mit den vollständigen Beratungsunterlagen (vgl. Punkt 4) per E-Mail dem Kanton Luzern, Dienststelle Umwelt und Energie (uwe), Clara Bucher, Energieplanung.UWE@lu.ch zuzustellen.</p>
    <div class="pb"></div>
    <h2>1 Massnahmenprogramm</h2>
    <p>Nachfolgende Massnahmen wurden im Rahmen der EPA-Beratung beschlossen bzw. von bereits laufenden Programmen übernommen.</p>
    <table class="m"><tr><th>ES-Nr.</th><th>Nr.</th><th>Massnahme</th><th>Beschreibung</th></tr>
      ${mass.map(m => `<tr><td>${escapeHtml(m.esNr)}</td><td>${escapeHtml(m.id.replace(/^M-/, ''))}</td><td>${escapeHtml(m.name)}</td><td>${escapeHtml(m.beschreibung)}</td></tr>`).join('') || '<tr><td colspan="4">Keine Massnahmen erfasst.</td></tr>'}
    </table>
    <h2>2 Bedarf räumlicher Abstimmung</h2>
    <p>In der EPA-Beratung soll der Bedarf eines Energierichtplans (§ 5 Abs. 2 KEnG), der Bedarf einer Koordination mit weiteren Gemeinden (§ 5 Abs. 3 KEnG) sowie allfällige Gebiet mit Koordinationsbedarf (z. B. Lärmproblematik in dicht bebauten Gebieten) geklärt werden.</p>
    <p>Der / die EPA-Berater/in beurteilt den Bedarf räumlicher Abstimmung wie folgt:</p>
    <div class="box">
      <div class="row"><span>Bedarf eines Energierichtplans?</span><span>${jn(e.bedarfEnergierichtplan)}</span></div>
      <div class="row"><span>Bedarf einer Koordination mit weiteren Gemeinde(n)?</span><span>${jn(e.bedarfKoordination)}</span></div>
      <div class="row"><span>Gebiete mit Koordinationsbedarf vorhanden?</span><span>${jn(e.gebieteKoordinationsbedarf)}</span></div>
    </div>
    <h2>3 Kontoinformationen</h2>
    <p>Bitte teilen Sie uns mit untenstehendem Formular Ihre Kontoinformationen mit, damit die Zahlung des Förderbeitrags ausgelöst werden kann.</p>
    <div class="box"><table class="k"><tr><td>Name</td><td>${escapeHtml(k.kontoinhaber)}</td></tr><tr><td>Adresse</td><td>${escapeHtml(k.adresse)}</td></tr><tr><td>IBAN</td><td>${escapeHtml(k.iban)}</td></tr>${k.bankname && k.bankname !== '-' ? `<tr><td>Bank</td><td>${escapeHtml(k.bankname)}</td></tr>` : ''}</table></div>
    <div class="pb"></div>
    <h2>4 Bestätigung</h2>
    <div class="sig">
      <div><b>EPA-Berater/in</b><p>Der / die EPA-Berater/in bestätigt hiermit, die EPA-Beratung gemäss den aktuellen Förderbedingungen und gemäss den Qualitätsanforderungen des Pflichtenhefts durchgeführt zu haben.</p><div class="line"></div><div class="cap">${escapeHtml(e.beratungsperson || p.berater)}<br>Ort, Datum:</div></div>
      <div><b>Gemeinderat</b><p>Der Gemeinderat bestätigt hiermit, die vorgeschlagenen Massnahmen kontinuierlich umzusetzen und den Umsetzungsstatus im Energieplanungs-Modul nachzuführen.</p><div class="line"></div><div class="cap"><br>Ort, Datum:</div></div>
    </div>
    <h2>5 Beilagen</h2>
    <ul class="b">${beilagen.filter(b => b[1]).map(b => `<li>${escapeHtml(b[0])}</li>`).join('')}</ul>
  </div></body></html>`;
}

/* ---------------------- PROZESS-TABS (führen durch den Beratungsprozess) ---------------------- */
const PROZESS_TABS = [
  { key: 'grunddaten', label: 'Grunddaten', short: 'Grunddaten' },
  { key: 'epa', label: 'EPA Beratung', short: 'EPA' },
  { key: 'massnahmen', label: 'Massnahmen', short: 'Massn.' },
  { key: 'konto', label: 'Gesuch', short: 'Gesuch' },
  { key: 'nachfuehrung', label: 'Nachführung', short: 'Nachf.' },
];
// Nachführung ist erst möglich, wenn die Kontoinformationen erfasst sind (Kontoinhaber/in, Adresse, IBAN).
const NF_KONTO_HINWEIS = 'Die Nachführung ist erst möglich, wenn die Kontoinformationen erfasst sind (Kontoinhaber/in, Adresse, IBAN).';
function nachfuehrungGesperrt(p) { return !kontoAngabenVollstaendig(p); }
// Welche Kontoangaben fehlen noch? (Labels der Pflichtfelder)
function fehlendeKontoFelder(p) { return validatePlanungAgainstData(p, 'Fördergesuch').filter(f => f.id.startsWith('f-k-')); }
// Umleitung zum Gesuch-Tab im Bearbeitungsmodus mit Fehlermeldung, was für die Nachführung noch fehlt
function nachfuehrungUmleiten(p) {
  const fehlt = fehlendeKontoFelder(p).map(f => f.label);
  toast('Nachführung noch nicht möglich – es fehlen: ' + fehlt.join(', ') + '.');
  state.planungTab = 'konto'; state.planungDetailsMode = 'edit'; state.nfKontoHinweis = true;
  renderPlanungDetail();
}
function renderProzessTabs(p) {
  return PROZESS_TABS.map((t, i) => {
    const active = state.planungTab === t.key;
    const locked = t.key === 'nachfuehrung' && nachfuehrungGesperrt(p);
    return `<button class="subtab-btn ${active ? 'active' : ''}${locked ? ' is-locked' : ''}" data-subtab="${t.key}"${locked ? ' aria-disabled="true"' : ''} title="${locked ? NF_KONTO_HINWEIS : 'Schritt ' + (i + 1) + ': ' + t.label}">
      <span class="subtab-nr ${active ? 'nr-current' : 'nr-upcoming'}">${i + 1}</span><span class="subtab-label"><span class="lbl-full">${t.label}</span><span class="lbl-short">${t.short}</span></span>
    </button>`;
  }).join('');
}

// Aktion am Ende des aktuellen Prozessschritts: schliesst den Schritt ab und startet den nächsten (Statuswechsel im System).
// Nur im jeweils aktuellen Schritt (siehe prozessSchrittFor) gibt es die Aktion, sonst ein normales "Weiter".
function prozessAktionFor(p, tabKey) {
  const eb = p.epaBeratung || {};
  const gestartet = !!(eb.datumBeratungsbeginn && eb.datumBeratungsbeginn !== '-');
  const eingereicht = !!(eb.gesuchseingang && eb.gesuchseingang !== '-');
  if (tabKey === 'grunddaten' && p.status === 'Entwurf' && !gestartet) return { id: 'start', label: 'EPA Beratung starten' };
  if (tabKey === 'epa' && p.status === 'Entwurf' && gestartet) return { id: 'epa-abschluss', label: 'EPA Beratung abschliessen', ziel: 'Verabschiedung', weiter: 'massnahmen' };
  if (tabKey === 'massnahmen' && p.status === 'Verabschiedung') return { id: 'verabschiedung', label: 'Weiter zum Gesuch →', ziel: 'Fördergesuch', pruefe: 'Verabschiedung', toast: 'Verabschiedung abgeschlossen. Nächster Schritt: Fördergesuch erfassen.', weiter: 'konto' };
  if (tabKey === 'konto' && p.status === 'Fördergesuch' && !eingereicht) return { id: 'gesuch', label: 'Fördergesuch eingereicht', ziel: 'Fördergesuch' };
  if (tabKey === 'konto' && p.status === 'Fördergesuch' && eingereicht) return { id: 'beratung-abschluss', label: 'Beratung abschliessen', ziel: 'Abschluss', weiter: 'nachfuehrung' };
  if (tabKey === 'nachfuehrung' && nfAktiv(p)) {
    const offen = nfOffen(p);
    return { id: 'nachfuehrung', label: 'Nachführung abschliessen', disabled: offen.length > 0, hint: offen.length ? 'Noch zu bestätigen: ' + offen.join(', ') : '' };
  }
  return null;
}

function prozessAktionAusfuehren(p, a) {
  const today = formatDate(new Date());
  // Statuswechsel nur, wenn die Pflichtangaben des Zielstatus vorhanden sind; sonst Formular mit Hinweisen öffnen
  if (a.ziel) {
    const missing = validatePlanungAgainstData(p, a.pruefe || a.ziel);
    if (missing.length > 0) {
      toast(`Für «${a.ziel}» fehlen noch ${missing.length} Pflichtfeld${missing.length > 1 ? 'er' : ''}.`);
      // Bearbeiten gibt es nur in Formular-Tabs: zum Tab mit dem ersten fehlenden Feld wechseln
      if (!PANE_TABS.includes(state.planungTab)) {
        const id = missing[0].id;
        state.planungTab = id.startsWith('f-k-') ? 'konto' : id.startsWith('f-eb-') ? 'epa' : 'grunddaten';
      }
      state.planungDetailsMode = 'edit';
      state.planungPendingStatus = a.ziel;
      renderPlanungDetail();
      return;
    }
  }
  if (a.id === 'start') {
    p.epaBeratung.datumBeratungsbeginn = today;
    toast('EPA Beratung wurde gestartet.');
    state.planungTab = 'epa';
  } else if (a.id === 'gesuch') {
    p.epaBeratung.gesuchseingang = today;
    if (!p.epaBeratung.gesuchsNr || p.epaBeratung.gesuchsNr === '-') p.epaBeratung.gesuchsNr = Number(vorschlagGesuchsNr(p));
    toast('Fördergesuch wurde als eingereicht erfasst.');
  } else if (a.id === 'nachfuehrung') {
    if (nfOffen(p).length) { toast('Noch nicht bestätigt: ' + nfOffen(p).join(', ') + '.'); return; }
    nfErledigt(p);   // alte Daten ohne Protokoll vor dem Überschreiben sichern
    const aend = nfAenderungen(p);
    if (!p.nfHistorie) p.nfHistorie = [];
    p.nfHistorie.unshift({ datum: today, von: aktuellerBenutzerName(), aenderungen: aend ? aend.felder.length : null, massnahmen: p.massnahmen.length, stand: nfSnapshot(p) });
    p.pruefstatus.letzteUeberpruefung = today;
    p.nfPruefung = null;   // nächster Zyklus beginnt ungeprüft
    state.nfEdit = {}; state.nfVorzeitigId = null; state.nfAlle = false;
    const next = naechstePruefungFor(p);
    toast(next ? `Nachführung abgeschlossen. Nächste Nachführung: ${formatDate(next)}.` : 'Nachführung abgeschlossen.');
  } else {
    p.status = a.ziel;
    p.epaBeratung.prozessstatus = a.ziel;
    toast(a.toast || `Schritt abgeschlossen: «${a.label}».`);
    if (a.weiter) state.planungTab = a.weiter;
  }
  renderPlanungDetail();
  const sc = document.querySelector('.panel-content'); if (sc) sc.scrollTop = 0;
}

function renderTabFooter(p) {
  const i = PROZESS_TABS.findIndex(t => t.key === state.planungTab);
  if (i < 0 || (state.planungDetailsMode === 'edit' && PANE_TABS.includes(state.planungTab))) return '';
  const prev = PROZESS_TABS[i - 1], next = PROZESS_TABS[i + 1];
  const aktion = prozessAktionFor(p, state.planungTab);
  let right = '';
  if (aktion) right = `<button type="button" class="btn btn-primary btn-process" id="btn-prozess-aktion"${aktion.disabled ? ' disabled' : ''}${aktion.hint ? ' title="' + escapeAttr(aktion.hint) + '"' : ''}>${aktion.label}</button>`;
  else if (next) right = `<button type="button" class="btn btn-primary btn-process" data-goto-tab="${next.key}">Weiter: ${next.label} →</button>`;
  return `<div class="tab-footer">
    ${prev ? `<button type="button" class="btn-process-back" data-goto-tab="${prev.key}">← ${prev.label}</button>` : '<span class="btn-process-back-spacer"></span>'}
    ${aktion && aktion.hint ? `<div class="tab-footer-hint">${escapeHtml(aktion.hint)}</div>` : `<div class="tab-footer-label">Prozess · Schritt ${i + 1} von ${PROZESS_TABS.length}</div>`}
    <div class="tab-footer-right">${right}</div>
  </div>`;
}

function renderDeleteLink(p) {
  if (state.planungTab !== 'grunddaten' || state.planungDetailsMode === 'edit') return '';
  return `<div class="danger-zone"><button type="button" class="btn-link-danger" id="btn-del-planung">Energieplanung löschen</button></div>`;
}

function bindTabFooter(p) {
  const aktionBtn = document.getElementById('btn-prozess-aktion');
  if (aktionBtn) aktionBtn.addEventListener('click', () => {
    const a = prozessAktionFor(p, state.planungTab);
    if (a) prozessAktionAusfuehren(p, a);
  });
  $panel.querySelectorAll('[data-goto-tab]').forEach(btn => btn.addEventListener('click', () => {
    state.planungTab = btn.dataset.gotoTab;
    renderPlanungDetail();
    $panel.scrollTop = 0;
    const sc = document.querySelector('.panel-content'); if (sc) sc.scrollTop = 0;
  }));
}

function renderPlanungDetail() {
  updateGemeindeKarte();
  const p = findPlanung(state.planungId);
  if (!p) { state.view = 'list'; render(); return; }

  // Das Kontrolle-Tab ist Admin-exklusiv — bei Rollenwechsel weg von Admin auf Planungsdetails zurückfallen.
  if (state.planungTab === 'kontrolle' && state.role !== 'Admin') {
    state.planungTab = 'grunddaten';
    state.planungKontrolleMode = 'view';
  }
  if (state.planungTab !== 'massnahmen') state.nfZurueck = false;
  if (state.planungTab === 'nachfuehrung' && nachfuehrungGesperrt(p)) { state.planungTab = 'konto'; state.planungDetailsMode = 'edit'; state.nfKontoHinweis = true; toast('Nachführung noch nicht möglich – es fehlen: ' + fehlendeKontoFelder(p).map(f => f.label).join(', ') + '.'); }

  $panel.innerHTML = `<div class="detail-wrap">
    ${renderNavRow('Zurück zur Liste', [{ label: 'Übersicht Energieplanungen' }, { label: p.id }])}
    <h2 class="panel-title title-with-chip" style="margin-bottom:4px;">${planungTitel(p)}</h2>
    ${renderPruefstatusPill(p) && state.planungTab !== 'nachfuehrung' ? `<div class="process-label">${renderPruefstatusPill(p)}</div>` : ''}
    ${renderPruefungBanner(p)}

    <div class="subtab-row">
      ${renderProzessTabs(p)}
      ${state.role === 'Admin' ? `<button class="subtab-btn subtab-intern ${state.planungTab === 'kontrolle' ? 'active' : ''}" data-subtab="kontrolle">Kontrolle</button>` : ''}
    </div>

    <div class="subtab-content">
      ${state.nfZurueck && state.planungTab === 'massnahmen' ? '<button type="button" class="nf-back" id="btn-nf-back">← Zurück zur Nachführung</button>' : ''}
      ${PANE_TABS.includes(state.planungTab) ? renderPlanungDetailsTabContent(p)
        : state.planungTab === 'massnahmen' ? renderPlanungMassnahmenTabContent(p)
        : state.planungTab === 'nachfuehrung' ? renderPlanungNachfuehrungTabContent(p)
        : renderPlanungKontrolleTabContent(p)}
    </div>
    ${renderDeleteLink(p)}
    ${renderTabFooter(p)}
  </div>`;

  bindNavRow(() => { state.view = 'list'; render(); }, [() => { state.view = 'list'; render(); }]);
  bindPruefungBanner(p);
  bindTabFooter(p);
  const nfBack = document.getElementById('btn-nf-back');
  if (nfBack) nfBack.addEventListener('click', () => { state.planungTab = 'nachfuehrung'; state.nfZurueck = false; renderPlanungDetail(); });
  $panel.querySelectorAll('[data-subtab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const ziel = btn.dataset.subtab;
      if (ziel === 'nachfuehrung' && nachfuehrungGesperrt(p)) { nachfuehrungUmleiten(p); return; }
      // Im Bearbeitungsmodus zwischen den Formular-Tabs wechseln, ohne neu zu rendern (Eingaben bleiben erhalten).
      if (state.planungDetailsMode === 'edit' && PANE_TABS.includes(ziel) && PANE_TABS.includes(state.planungTab)) {
        activatePane(ziel);
        return;
      }
      state.planungTab = ziel;
      renderPlanungDetail();
    });
  });

  if (PANE_TABS.includes(state.planungTab)) bindPlanungDetailsTab(p);
  else if (state.planungTab === 'massnahmen') bindPlanungMassnahmenTab(p);
  else if (state.planungTab === 'nachfuehrung') bindPlanungNachfuehrungTab(p);
  else bindPlanungKontrolleTab(p);
}

/* ---------------------- NACHFÜHRUNG-TAB (Angaben und Massnahmen überprüfen) ---------------------- */
/* ---------------------- CSV-IMPORT DER MASSNAHMEN (Nachführung, aus v2 übernommen) ---------------------- */
const IMPORT_ALT_AKTIONEN = [['bleibt', 'Unverändert lassen'], ['Abschluss', 'Als abgeschlossen markieren'], ['entfernen', 'Entfernen']];
const IMPORT_SPALTEN = ['ES-Nr.', 'Massnahme', 'Beschreibung', 'Status', 'Bemerkung'];
const IMPORT_STATUS_ALIAS = { 'geplant': 'Geplant', 'umsetzung': 'Umsetzung', 'in umsetzung': 'Umsetzung', 'abschluss': 'Abschluss', 'abgeschlossen': 'Abschluss', 'erledigt': 'Abschluss' };

function parseCsv(text) {
  text = text.replace(/^﻿/, '');
  const head = text.split(/\r?\n/)[0] || '';
  const delim = (head.match(/;/g) || []).length >= (head.match(/,/g) || []).length ? ';' : ',';
  const rows = [];
  let row = [], cur = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else quoted = false; } else cur += c;
    } else if (c === '"') quoted = true;
    else if (c === delim) { row.push(cur); cur = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cur); rows.push(row); row = []; cur = ''; }
    else cur += c;
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
  return rows.filter(r => r.some(v => v.trim() !== ''));
}

function csvZuMassnahmen(rows) {
  const key = h => { const n = h.trim().toLowerCase().replace(/[^a-zäöü]/g, ''); return { esnr: 'esNr', massnahme: 'name', name: 'name', beschreibung: 'beschreibung', status: 'status', bemerkung: 'bemerkung' }[n]; };
  const cols = rows[0].map(key);
  if (!cols.includes('name')) return null;
  return rows.slice(1).map(r => {
    const o = { esNr: '', name: '', beschreibung: '', status: '', bemerkung: '' };
    cols.forEach((k, i) => { if (k) o[k] = (r[i] || '').trim(); });
    o.status = IMPORT_STATUS_ALIAS[o.status.toLowerCase()] || '';
    return o;
  }).filter(o => o.name);
}

const importOffen = m => m.prozessstatus !== 'Abschluss';

function importVorschlag(p, r) {
  const n = s => (s || '').trim().toLowerCase();
  const m = (r.esNr && p.massnahmen.find(x => n(x.esNr) === n(r.esNr))) || p.massnahmen.find(x => n(x.name) === n(r.name));
  return m ? m.id : '';
}

function importStarten(p, rows, datei) {
  state.import = { step: 2, datei, rows, auto: rows.map(r => importVorschlag(p, r)), ziel: [], alt: {}, fehler: '' };
  state.import.ziel = state.import.auto.map(id => id || 'neu');
}

function importDemoZeilen(p) {
  const offen = p.massnahmen.filter(importOffen);
  const weiter = { 'Geplant': 'Umsetzung', 'Umsetzung': 'Abschluss' };
  const rows = offen.slice(0, 3).map(m => ({ esNr: m.esNr === '-' ? '' : m.esNr, name: m.name, beschreibung: m.beschreibung, status: weiter[m.prozessstatus] || m.prozessstatus, bemerkung: 'Stand gemäss Import aktualisiert.' }));
  if (offen[3]) rows.push({ esNr: '', name: offen[3].name + ' (neu formuliert)', beschreibung: offen[3].beschreibung, status: offen[3].prozessstatus, bemerkung: 'Umbenannt, ohne ES-Nr. – bitte zuordnen.' });
  rows.push({ esNr: '', name: 'Photovoltaik auf Schulhausdächern', beschreibung: 'Neue Massnahme aus der Importdatei.', status: 'Geplant', bemerkung: '' });
  return rows;
}

function importZielOptionen(p, wert) {
  const esNr = m => (m.esNr && m.esNr !== '-') ? m.esNr + ' · ' : '';
  return `<option value="neu"${wert === 'neu' ? ' selected' : ''}>Als neue Massnahme anlegen</option>
    <option value="skip"${wert === 'skip' ? ' selected' : ''}>Nicht importieren</option>
    <optgroup label="Bestehende Massnahme überschreiben">${p.massnahmen.map(m => `<option value="${escapeAttr(m.id)}"${wert === m.id ? ' selected' : ''}>${escapeHtml(esNr(m) + m.name)}${importOffen(m) ? '' : ' (' + m.prozessstatus + ')'}</option>`).join('')}</optgroup>`;
}

function importNichtErwaehnt(p) {
  return p.massnahmen.filter(m => importOffen(m) && !state.import.ziel.includes(m.id));
}

function renderImportDialog() {
  const p = findPlanung(state.planungId);
  const box = document.querySelector('#import-dialog .modal-box');
  if (!p || !box || !state.import) return;
  const imp = state.import;
  const oldBody = box.querySelector('.imp-body');
  const scrollTop = oldBody ? oldBody.scrollTop : 0;
  const plural = (n, e, m) => `${n} ${n === 1 ? e : m}`;
  const steps = ['Datei', 'Zuordnung', 'Zusammenfassung'];
  const stepper = `<ol class="imp-steps">${steps.map((s, i) => `<li class="${i + 1 === imp.step ? 'current' : i + 1 < imp.step ? 'done' : ''}"><span>${i + 1 < imp.step ? '✓' : i + 1}</span>${s}</li>`).join('')}</ol>`;
  let body = '', foot = '';
  if (imp.step === 1) {
    body = `<p>Laden Sie eine CSV-Datei mit den Massnahmen hoch. Im nächsten Schritt legen Sie fest, welche bestehenden Massnahmen überschrieben werden und was mit den übrigen Massnahmen geschieht.</p>
      <div class="imp-drop">
        <label class="btn btn-primary">CSV-Datei auswählen<input type="file" accept=".csv,text/csv" data-import-file hidden></label>
        <span class="muted">oder</span>
        <button type="button" class="btn btn-outline" data-imp-action="demo">Beispieldatei verwenden</button>
      </div>
      ${imp.fehler ? `<div class="modal-msg">${escapeHtml(imp.fehler)}</div>` : ''}
      <h4 class="imp-section">Erwartete Spalten</h4>
      <p>${IMPORT_SPALTEN.map(c => `<code>${escapeHtml(c)}</code>`).join(' ')}</p>
      <p class="muted">Trennzeichen Semikolon oder Komma, Kopfzeile erforderlich. Pflichtspalte ist «Massnahme». Status: Geplant, Umsetzung oder Abschluss. <button type="button" class="btn-link-inline" data-imp-action="template">Vorlage herunterladen</button></p>`;
    foot = `<span class="spacer"></span><button type="button" class="btn btn-outline" data-imp-action="close">Abbrechen</button>`;
  } else if (imp.step === 2) {
    const rest = importNichtErwaehnt(p);
    body = `<p><strong>${escapeHtml(imp.datei)}</strong> · ${plural(imp.rows.length, 'Massnahme', 'Massnahmen')} in der Datei.</p>
      <h4 class="imp-section">1 · Massnahmen aus der Datei</h4>
      <p class="muted">Entscheiden Sie pro Zeile, ob eine bestehende Massnahme überschrieben, eine neue angelegt oder die Zeile ignoriert wird.</p>
      <ul class="imp-list">${imp.rows.map((r, i) => `<li class="imp-row">
        <div class="imp-main"><div class="imp-name">${escapeHtml(r.name)}${imp.auto[i] && imp.ziel[i] === imp.auto[i] ? '<span class="imp-badge">automatisch erkannt</span>' : ''}</div>
          <div class="imp-meta">${[r.esNr && 'ES-Nr. ' + escapeHtml(r.esNr), r.status && escapeHtml(r.status)].filter(Boolean).join(' · ') || 'keine weiteren Angaben'}</div></div>
        <select data-imp-ziel="${i}" aria-label="Zuordnung für ${escapeAttr(r.name)}">${importZielOptionen(p, imp.ziel[i])}</select>
      </li>`).join('')}</ul>
      <h4 class="imp-section">2 · Bestehende Massnahmen, die nicht in der Datei vorkommen</h4>
      ${rest.length ? `<div class="imp-bulk"><span class="muted">Für alle:</span>
          <select data-imp-alt-all aria-label="Für alle setzen"><option value="">Auswählen …</option>${IMPORT_ALT_AKTIONEN.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select></div>
        <ul class="imp-list">${rest.map(m => `<li class="imp-row">
          <div class="imp-main"><div class="imp-name">${escapeHtml(m.name)}</div><div class="imp-meta">${m.esNr && m.esNr !== '-' ? 'ES-Nr. ' + escapeHtml(m.esNr) + ' · ' : ''}aktuell ${escapeHtml(m.prozessstatus)}</div></div>
          <select data-imp-alt="${escapeAttr(m.id)}" aria-label="Was geschieht mit ${escapeAttr(m.name)}?">${IMPORT_ALT_AKTIONEN.map(([v, l]) => `<option value="${v}"${(imp.alt[m.id] || 'bleibt') === v ? ' selected' : ''}>${l}</option>`).join('')}</select>
        </li>`).join('')}</ul>`
        : '<p class="muted">Alle offenen Massnahmen sind in der Datei enthalten.</p>'}`;
    foot = `<button type="button" class="btn btn-outline" data-imp-action="step" data-step="1">Zurück</button><span class="spacer"></span>
      <button type="button" class="btn btn-primary" data-imp-action="step" data-step="3">Weiter zur Zusammenfassung →</button>`;
  } else {
    const z = imp.ziel, rest = importNichtErwaehnt(p);
    const nUeber = z.filter(v => v !== 'neu' && v !== 'skip').length, nNeu = z.filter(v => v === 'neu').length, nSkip = z.filter(v => v === 'skip').length;
    const altN = a => rest.filter(m => (imp.alt[m.id] || 'bleibt') === a).length;
    const zeile = (n, t) => `<li class="${n ? '' : 'zero'}"><strong>${n}</strong><span>${t}</span></li>`;
    body = `<p>Bitte prüfen Sie die Zusammenfassung, bevor Sie importieren.</p>
      <ul class="imp-summary">
        ${zeile(nUeber, 'bestehende Massnahmen werden überschrieben')}
        ${zeile(nNeu, 'neue Massnahmen werden angelegt')}
        ${zeile(nSkip, 'Zeilen aus der Datei werden nicht importiert')}
        ${zeile(altN('Abschluss'), 'nicht enthaltene Massnahmen werden als abgeschlossen markiert')}
        ${zeile(altN('entfernen'), 'nicht enthaltene Massnahmen werden entfernt')}
        ${zeile(altN('bleibt'), 'nicht enthaltene Massnahmen bleiben unverändert')}
      </ul>
      <p class="muted">Beim Überschreiben werden Name, Beschreibung, Status und Bemerkung aus der Datei übernommen. Leere Felder in der Datei lassen den bisherigen Wert unverändert.</p>`;
    foot = `<button type="button" class="btn btn-outline" data-imp-action="step" data-step="2">Zurück</button><span class="spacer"></span>
      <button type="button" class="btn btn-primary" data-imp-action="run">Import durchführen</button>`;
  }
  box.innerHTML = `<div class="imp-head"><div><div class="imp-eyebrow">Nachführung ${escapeHtml(p.gemeinde)}</div><h3 id="imp-title">Massnahmen aus CSV importieren</h3></div>
      <button type="button" class="imp-close" data-imp-action="close" aria-label="Schliessen">✕</button></div>
    <div class="imp-body">${stepper}${body}</div>
    <div class="imp-foot">${foot}</div>`;
  const nb = box.querySelector('.imp-body');
  if (nb) nb.scrollTop = scrollTop;
}

function importAusfuehren(p) {
  const imp = state.import;
  let ueber = 0, neu = 0, alt = 0;
  const nf = nfState(p), beruehre = id => { nf.beruehrt[id] = true; nf.massnahmen[id] = true; };
  imp.rows.forEach((r, i) => {
    const z = imp.ziel[i];
    if (z === 'skip') return;
    if (z === 'neu') {
      const neuId = `M-${nextMassnahmeSeq++}`;
      beruehre(neuId);
      p.massnahmen.push({
        id: neuId, esNr: r.esNr || '-', name: r.name, prozessstatus: r.status || 'Geplant', ausEpa: 'Nein',
        beschreibung: r.beschreibung || '-', handlungsfeld: '-', aktivitaetsbereich: '-', prioritaet: '-', umsetzungszeitraum: '-',
        startdatum: '-', faelligkeitsdatum: '-', budget: '-', verantwortlichkeit: '-', bemerkungen: r.bemerkung || '-', energietraeger: []
      });
      neu++;
      return;
    }
    const m = p.massnahmen.find(x => x.id === z);
    if (!m) return;
    if (r.esNr) m.esNr = r.esNr;
    if (r.name) m.name = r.name;
    if (r.beschreibung) m.beschreibung = r.beschreibung;
    if (r.status) m.prozessstatus = r.status;
    if (r.bemerkung) m.bemerkungen = r.bemerkung;
    beruehre(m.id);
    ueber++;
  });
  importNichtErwaehnt(p).forEach(m => {
    const a = imp.alt[m.id] || 'bleibt';
    if (a === 'bleibt') return;
    if (a === 'entfernen') p.massnahmen = p.massnahmen.filter(x => x.id !== m.id);
    else { m.prozessstatus = a; beruehre(m.id); }
    alt++;
  });
  return { ueber, neu, alt };
}

function openImportDialog() {
  if (document.getElementById('import-dialog')) return;
  state.import = { step: 1, datei: '', rows: [], auto: [], ziel: [], alt: {}, fehler: '' };
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'import-dialog';
  overlay.innerHTML = '<div class="modal-box modal-wide imp-box" role="dialog" aria-modal="true" aria-labelledby="imp-title"></div>';
  document.body.appendChild(overlay);
  const close = () => { overlay.remove(); state.import = null; document.removeEventListener('keydown', onKey); };
  const onKey = e => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  overlay.addEventListener('click', e => {
    const p = findPlanung(state.planungId);
    if (e.target === overlay) { close(); return; }
    const btn = e.target.closest('[data-imp-action]');
    if (!btn || !p) return;
    const act = btn.dataset.impAction;
    if (act === 'close') close();
    else if (act === 'demo') { importStarten(p, importDemoZeilen(p), 'Beispieldatei_Massnahmen.csv'); renderImportDialog(); }
    else if (act === 'step') { state.import.step = Number(btn.dataset.step); renderImportDialog(); }
    else if (act === 'template') {
      const csv = '﻿' + [IMPORT_SPALTEN.join(';'), '1.2.1;Beispiel-Massnahme;Kurze Beschreibung;Umsetzung;Aktueller Stand'].join('\r\n');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      a.download = 'Vorlage_Massnahmen.csv';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 10000);
    } else if (act === 'run') {
      const r = importAusfuehren(p);
      close();
      toast(`Import abgeschlossen: ${r.ueber} überschrieben, ${r.neu} neu, ${r.alt} angepasst.`);
      renderPlanungDetail();
    }
  });
  overlay.addEventListener('change', e => {
    const t = e.target, p = findPlanung(state.planungId);
    if (!p || !state.import) return;
    if (t.matches('input[type=file][data-import-file]')) {
      const f = t.files[0];
      if (!f) return;
      f.text().then(txt => {
        const rows = parseCsv(txt);
        const items = rows.length ? csvZuMassnahmen(rows) : null;
        if (!items || !items.length) { state.import.fehler = 'Die Datei konnte nicht gelesen werden: Es braucht eine Kopfzeile mit der Spalte «Massnahme» und mindestens eine Zeile.'; renderImportDialog(); return; }
        importStarten(p, items, f.name);
        renderImportDialog();
      });
    } else if (t.dataset.impZiel !== undefined) { state.import.ziel[Number(t.dataset.impZiel)] = t.value; renderImportDialog(); }
    else if (t.dataset.impAlt !== undefined) { state.import.alt[t.dataset.impAlt] = t.value; }
    else if (t.matches('[data-imp-alt-all]')) {
      if (t.value) importNichtErwaehnt(p).forEach(m => { state.import.alt[m.id] = t.value; });
      renderImportDialog();
    }
  });
  renderImportDialog();
}

/* ---- Nachführung (alle 4 Jahre, feste Fristen): Phasen, Prüfstand, Historie ---- */
const NF_VORLAUF_MONATE = 12;   // so früh vor der Frist öffnet sich die Nachführung (Banner, Prüfformular)

function aktuellerBenutzerName() {
  if (state.personaId === 'admin') return 'Admin';
  const pe = rollenPersonas().find(x => x.id === state.personaId);
  return pe ? pe.name : state.role;
}
// Bereits erledigte Nachführungen. Alte Daten ohne Protokoll: aus «letzte Überprüfung» abgeleitet (einmalig, bevor sie überschrieben wird).
function nfInitLegacy(p) {
  if (p.nfBasisAnzahl !== undefined) return;
  const l = parseSwissDate(p.pruefstatus && p.pruefstatus.letzteUeberpruefung), s = parseSwissDate(p.epaBeratung && p.epaBeratung.datumBeratungsbeginn);
  p.nfBasisAnzahl = l && s ? Math.max(1, Math.floor((l - s) / (365.25 * 86400000 * 4))) : 0;
  p.nfLegacyDatum = l ? formatDate(l) : null;
}
function nfErledigt(p) { nfInitLegacy(p); return p.nfBasisAnzahl + (p.nfHistorie || []).length; }
// Bisherige Nachführungen, neueste zuerst
function nfHistorie(p) {
  nfInitLegacy(p);
  const liste = (p.nfHistorie || []).slice();
  if (p.nfBasisAnzahl > 0 && p.nfLegacyDatum) liste.push({ datum: p.nfLegacyDatum, von: null, aenderungen: null, massnahmen: null });
  return liste;
}
// Phase: vorab (Beratung läuft noch) · keine (Prüfpflicht beendet) · ruhend (Frist > 12 Monate) · offen (Frist innerhalb 12 Monate) · faellig
function nfPhase(p) {
  if (p.status !== 'Abschluss') return 'vorab';
  const t = naechstePruefungFor(p);
  if (!t) return 'keine';
  const now = new Date();
  if (now >= t) return 'faellig';
  return now >= new Date(t.getFullYear(), t.getMonth() - NF_VORLAUF_MONATE, t.getDate()) ? 'offen' : 'ruhend';
}
// Prüfformular ist aktiv: Frist nah/überschritten oder bewusst vorzeitig gestartet
function nfAktiv(p) {
  const ph = nfPhase(p);
  return ph === 'faellig' || ph === 'offen' || (ph === 'ruhend' && state.nfVorzeitigId === p.id);
}

// Prüfstand des laufenden Zyklus
function nfState(p) {
  if (!p.nfPruefung) p.nfPruefung = { angaben: false, ziele: false, massnahmen: {}, beruehrt: {} };
  if (!p.nfPruefung.beruehrt) p.nfPruefung.beruehrt = {};
  return p.nfPruefung;
}
const nfNorm = v => (v && v !== '-') ? String(v) : '';
function nfStand(p) { const h = (p.nfHistorie || [])[0]; return h && h.stand ? h : null; }
function nfSnapshot(p) {
  const ef = p.energieplanungFelder, felder = {};
  [...NF_FELDER.angaben, ...NF_FELDER.ziele].forEach(f => { felder[f.key] = nfNorm(ef[f.key]); });
  const massnahmen = {};
  p.massnahmen.forEach(m => { massnahmen[m.id] = m.prozessstatus; });
  return { felder, massnahmen };
}
// Änderungen seit der letzten Nachführung
function nfAenderungen(p) {
  const h = nfStand(p);
  if (!h) return null;
  const ef = p.energieplanungFelder;
  const felder = [...NF_FELDER.angaben, ...NF_FELDER.ziele].filter(f => nfNorm(ef[f.key]) !== (h.stand.felder[f.key] || ''));
  const neu = [], status = [];
  p.massnahmen.forEach(m => {
    if (!(m.id in h.stand.massnahmen)) neu.push(m.id);
    else if (h.stand.massnahmen[m.id] !== m.prozessstatus) status.push(m.id);
  });
  const entfernt = Object.keys(h.stand.massnahmen).filter(id => !p.massnahmen.some(m => m.id === id));
  return { datum: h.datum, felder, neu, status, entfernt };
}
// Massnahmen, die geprüft werden müssen: noch nicht abgeschlossen oder seit der letzten Nachführung neu/geändert
function nfZuPruefen(p) {
  const a = nfAenderungen(p), nf = nfState(p);
  return p.massnahmen.filter(m => nf.beruehrt[m.id] || m.prozessstatus !== 'Abschluss' || (a && (a.neu.includes(m.id) || a.status.includes(m.id))));
}
function nfGeprueftAnzahl(p) { const nf = nfState(p); return nfZuPruefen(p).filter(m => nf.massnahmen[m.id]).length; }
// Was fehlt noch bis zum Abschluss? (leer = alles bestätigt)
function nfOffen(p) {
  const nf = nfState(p), offen = [];
  if (!nf.angaben) offen.push('Angaben');
  if (!nf.ziele) offen.push('Ziele');
  const zp = nfZuPruefen(p), rest = zp.length - nfGeprueftAnzahl(p);
  if (rest > 0) offen.push(rest === zp.length ? 'Massnahmen' : rest + (rest === 1 ? ' Massnahme' : ' Massnahmen'));
  return offen;
}
const NF_FELDER = {
  angaben: [
    { key: 'verantwortlichkeit', label: 'Verantwortliche Person der Gemeinde', id: 'nf-verantwortlichkeit' },
    { key: 'beraterEnergieplanung', label: 'Berater/in Energieplanung', id: 'nf-berater' }
  ],
  ziele: [
    { key: 'nettoNullZiel', label: 'Netto-null Ziel', id: 'nf-netto', stacked: true },
    { key: 'energieeffizienzZiel', label: 'Energieeffizienz Ziel', id: 'nf-effizienz', stacked: true },
    { key: 'stromproduktionZiel', label: 'Stromproduktion Ziel', id: 'nf-strom', stacked: true }
  ]
};
function nfEdit() {
  if (!state.nfEdit || state.nfEditPid !== state.planungId) { state.nfEdit = {}; state.nfEditPid = state.planungId; }
  return state.nfEdit;
}
const nfPersonUnbekannt = v => !!nfNorm(v) && !contacts.some(c => formatContactLabel(c) === v);

// Zeitleiste: Beratungsbeginn, feste 4-Jahres-Fristen, erledigte Nachführungen (mit Details im Tooltip), heute
function renderNachfuehrungZeitleiste(p) {
  const start = parseSwissDate(p.epaBeratung && p.epaBeratung.datumBeratungsbeginn);
  const next = naechstePruefungFor(p);
  if (!start || !next || p.status !== 'Abschluss') return '';
  const heute = new Date();
  const ende = heute > next ? new Date(heute.getFullYear(), heute.getMonth() + 6, heute.getDate()) : next;
  const span = ende - start;
  const pos = d => Math.min(100, Math.max(0, (d - start) / span * 100));
  const ph = nfPhase(p);
  const n = nfErledigt(p);
  let h = '<div class="nf-tl" aria-label="Zeitleiste der Nachführungen"><div class="nf-tl-track"><div class="nf-tl-line"><div class="nf-tl-fill" style="width:' + pos(heute) + '%"></div></div>';
  // Beginn
  h += '<span class="nf-tl-dot is-start" style="left:0" title="Beratungsbeginn ' + formatDate(start) + '"></span><span class="nf-tl-lab is-below is-startlab" style="left:0">Beginn ' + start.getFullYear() + '</span>';
  // Feste Fristen (Beginn + 4, 8, … Jahre)
  for (let k = 1; k <= n + 1; k++) {
    const f = addYears(start, 4 * k), last = k === n + 1;
    h += '<span class="nf-tl-tick' + (last ? ' is-next' + (ph === 'faellig' ? ' is-warn' : '') : '') + '" style="left:' + pos(f) + '%" title="' + (last ? 'Nächste Frist ' : 'Frist ') + formatDate(f) + '"></span>' +
         '<span class="nf-tl-lab is-below' + (last ? ' is-next' : '') + '" style="left:' + pos(f) + '%">' + (last ? formatDate(f) : f.getFullYear()) + '</span>';
  }
  // Erledigte Nachführungen
  const erledigt = nfHistorie(p).slice().reverse();
  erledigt.forEach(e => {
    const d = parseSwissDate(e.datum);
    if (!d) return;
    const tip = 'Nachführung ' + e.datum + (e.von ? ' · ' + e.von : '') +
      (e.aenderungen !== null && e.aenderungen !== undefined ? ' · ' + (e.aenderungen ? e.aenderungen + ' Angaben/Ziele geändert' : 'keine Änderungen an Angaben/Zielen') : '') +
      (e.massnahmen ? ' · ' + e.massnahmen + ' Massnahmen' : '');
    h += '<span class="nf-tl-dot is-done" style="left:' + pos(d) + '%" title="' + escapeAttr(tip) + '"></span><span class="nf-tl-lab is-above" style="left:' + pos(d) + '%">' + escapeHtml(e.datum) + '</span>';
  });
  // Heute
  const hp = pos(heute);
  const nah = erledigt.some(e => { const d = parseSwissDate(e.datum); return d && Math.abs(pos(d) - hp) < 14; });
  h += '<span class="nf-tl-today" style="left:' + hp + '%" title="Heute"></span>' + (nah ? '' : '<span class="nf-tl-lab is-above is-today" style="left:' + hp + '%">Heute</span>');
  return h + '</div></div>';
}

// Termin-Hinweis oben im Tab (Regelwerk nur als Tooltip)
function renderNachfuehrungTermin(p, aktion) {
  const eb = p.epaBeratung || {};
  const beginn = parseSwissDate(eb.datumBeratungsbeginn);
  const letzte = nfHistorie(p)[0];
  const rel = d => {
    const tage = Math.round((d - new Date()) / 86400000);
    if (tage < 0) return 'seit ' + Math.abs(Math.round(tage / 30.4)) + ' Monaten überfällig';
    if (tage < 60) return 'in ' + tage + ' Tagen';
    return tage < 730 ? 'in ' + Math.round(tage / 30.4) + ' Monaten' : 'in ' + (tage / 365.25).toFixed(1) + ' Jahren';
  };
  const regel = 'Die Nachführung ist alle 4 Jahre ab Beratungsbeginn fällig (feste Fristen). Sie kann auch vorzeitig durchgeführt werden und gilt dann für die nächste offene Frist.';
  const ph = nfPhase(p), t = naechstePruefungFor(p);
  let art = 'info', titel, text = '';
  if (ph === 'keine') { titel = 'Keine weitere Nachführung erforderlich'; text = 'Die Prüfpflicht endet mit dem Jahr ' + PRUEFPFLICHT_ENDE_JAHR + '.'; }
  else if (ph === 'faellig') { art = 'warn'; titel = 'Nachführung fällig seit ' + formatDate(t); text = 'Angaben, Ziele und Massnahmen prüfen, danach unten abschliessen.'; }
  else if (ph === 'offen') { art = 'info'; titel = 'Nachführung fällig am ' + formatDate(t); text = rel(t).charAt(0).toUpperCase() + rel(t).slice(1) + (letzte ? ' · zuletzt am ' + letzte.datum : ''); }
  else if (ph === 'ruhend' && aktion) { art = 'info'; titel = 'Vorzeitige Nachführung'; text = 'Reguläre Frist am ' + formatDate(t) + ' (' + rel(t) + ')' + (letzte ? ' · zuletzt am ' + letzte.datum : ''); }
  else if (ph === 'ruhend') { art = 'ok'; titel = 'Nächste Nachführung am ' + formatDate(t); text = rel(t).charAt(0).toUpperCase() + rel(t).slice(1) + (letzte ? ' · zuletzt am ' + letzte.datum : ''); }
  else if (beginn) { titel = 'Erste Nachführung am ' + formatDate(addYears(beginn, 4)); text = 'Möglich nach Abschluss der Beratung.'; }
  else { titel = 'Termin der ersten Nachführung noch offen'; text = 'Ergibt sich mit dem Start der EPA Beratung.'; }
  return '<div class="nf-due is-' + art + '" title="' + escapeAttr(regel) + '"><div class="nf-due-main"><div class="nf-due-title">' + escapeHtml(titel) + '</div>' + (text ? '<div class="nf-due-text">' + escapeHtml(text) + '</div>' : '') + '</div>' + (aktion ? '<div class="nf-due-action">' + aktion + '</div>' : '') + renderNachfuehrungZeitleiste(p) + '</div>';
}

function renderNachfuehrungAnleitung() {
  return '<details class="nf-howto"' + (state.nfAnleitungZu ? '' : ' open') + ' id="nf-howto"><summary>So funktioniert die Nachführung</summary>' +
    '<ol><li>Massnahmen aus Ihrem Tool per CSV importieren (empfohlen) und Angaben, Ziele sowie offene Massnahmen prüfen.</li>' +
    '<li>Jeden Bereich bestätigen. Abgeschlossene, unveränderte Massnahmen sind automatisch bestätigt.</li>' +
    '<li>«Nachführung abschliessen». Die nächste Frist folgt in 4 Jahren.</li></ol></details>';
}

// Was hat sich seit der letzten Nachführung getan?
function renderNachfuehrungSeitLetzter(p) {
  const a = nfAenderungen(p);
  if (!a) return '';
  const teile = [];
  if (a.felder.length) teile.push(a.felder.length + (a.felder.length === 1 ? ' Angabe/Ziel geändert' : ' Angaben/Ziele geändert'));
  if (a.neu.length) teile.push(a.neu.length + (a.neu.length === 1 ? ' neue Massnahme' : ' neue Massnahmen'));
  if (a.status.length) teile.push(a.status.length + (a.status.length === 1 ? ' Massnahme mit neuem Status' : ' Massnahmen mit neuem Status'));
  if (a.entfernt.length) teile.push(a.entfernt.length + (a.entfernt.length === 1 ? ' Massnahme entfernt' : ' Massnahmen entfernt'));
  return '<div class="nf-seit"><strong>Seit der letzten Nachführung (' + escapeHtml(a.datum) + '):</strong> ' + (teile.length ? teile.map(escapeHtml).join(' · ') : 'keine Änderungen') + '</div>';
}

// Block (Angaben/Ziele): Ansicht mit «Unverändert bestätigen» / «Ändern», im Ändern-Modus Formular mit Sofort-Speichern
function renderNachfuehrungBlock(p, art, titel) {
  const ef = p.energieplanungFelder, nf = nfState(p), edit = !!nfEdit()[art];
  const geprueft = nf[art], stand = nfStand(p);
  const unbekannt = f => art === 'angaben' && nfPersonUnbekannt(ef[f.key]) ? '<div class="nf-warn">⚠ Diese Person ist nicht mehr in den Kontakten. Bitte aktualisieren.</div>' : '';
  let body = '';
  if (edit) {
    body = NF_FELDER[art].map(f => {
      const inp = art === 'angaben'
        ? personSelect(f.id, ef[f.key], f.key === 'verantwortlichkeit' ? p.gemeinde : null, f.key === 'beraterEnergieplanung')
        : '<textarea id="' + f.id + '" rows="3">' + escapeHtml(fixDash(ef[f.key])) + '</textarea>';
      return '<div class="form-field is-inline"><label>' + f.label + '</label><div class="form-field-body">' + inp + unbekannt(f) + '</div></div>';
    }).join('');
    body += '<div class="nf-block-actions"><span class="nf-autosave">Änderungen werden automatisch gespeichert.</span><button type="button" class="btn btn-primary btn-sm" data-nf-fertig="' + art + '">Bestätigen</button></div>';
  } else {
    body = NF_FELDER[art].map(f => {
      const row = f.stacked ? fieldStacked(f.label, ef[f.key]) : field(f.label, ef[f.key]);
      const alt = stand ? (stand.stand.felder[f.key] || '') : null;
      const geaendert = stand && alt !== nfNorm(ef[f.key]);
      return row + unbekannt(f) + (geaendert ? '<div class="nf-vorher">Stand ' + escapeHtml(stand.datum) + ': ' + (alt ? escapeHtml(alt) : '<em>leer</em>') + '</div>' : '');
    }).join('');
    body += '<div class="nf-block-actions">' +
      '<button type="button" class="btn btn-secondary btn-sm btn-with-icon" data-nf-aendern="' + art + '" title="Bearbeiten" aria-label="Bearbeiten"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25zM20.7 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>' +
      (geprueft ? '<span class="nf-bestaetigt"><svg viewBox="0 0 24 24"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 20.6 7.4 19.2 6z"/></svg>Bestätigt</span>' : '<button type="button" class="btn btn-secondary btn-sm btn-with-icon" data-nf-ok="' + art + '" title="Unverändert bestätigen"><svg viewBox="0 0 24 24"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 20.6 7.4 19.2 6z"/></svg><span>Bestätigen</span></button>') +
      '</div>';
  }
  return '<div class="nf-block"><div class="nf-block-head"><h3 class="subheading">' + titel + '</h3></div>' + body + '</div>';
}

function renderNachfuehrungHistorie(p) {
  const hist = nfHistorie(p);
  if (!hist.length) return '';
  return '<details class="nf-historie"><summary>Bisherige Nachführungen (' + hist.length + ')</summary><ul>' + hist.map(h =>
    '<li><strong>' + escapeHtml(h.datum) + '</strong>' + (h.von ? ' · ' + escapeHtml(h.von) : '') +
    (h.aenderungen !== null && h.aenderungen !== undefined ? ' · ' + (h.aenderungen ? h.aenderungen + (h.aenderungen === 1 ? ' Angabe/Ziel geändert' : ' Angaben/Ziele geändert') : 'keine Änderungen an Angaben/Zielen') : '') +
    (h.massnahmen ? ' · ' + h.massnahmen + ' Massnahmen' : '') + '</li>').join('') + '</ul></details>';
}

// Details einer Massnahme direkt unter der Zeile (ohne den Tab zu verlassen); alle Felder sind änderbar und werden sofort gespeichert
function renderNachfuehrungMassnahmeDetail(m) {
  const id = m.id, fid = k => 'nf-m-' + id + '-' + k;
  const lab = (k, t) => '<label class="nf-detail-label" for="' + fid(k) + '">' + t + '</label>';
  const inp = (k, t, ph) => '<div class="nf-detail-item">' + lab(k, t) + '<input type="text" id="' + fid(k) + '" data-nf-m="' + id + '|' + k + '" value="' + escapeAttr(fixDash(m[k])) + '"' + (ph ? ' placeholder="' + ph + '"' : '') + '></div>';
  const prio = '<div class="nf-detail-item">' + lab('prioritaet', 'Priorität') + '<select id="' + fid('prioritaet') + '" data-nf-m="' + id + '|prioritaet"><option value="-">–</option>' +
    PRIORITAETEN.map(x => '<option' + (x === m.prioritaet ? ' selected' : '') + '>' + x + '</option>').join('') + '</select></div>';
  const person = '<div class="nf-detail-item is-wide">' + lab('verantwortlichkeit', 'Verantwortlichkeit') + personSelect(fid('verantwortlichkeit'), m.verantwortlichkeit).replace('<select ', '<select data-nf-m="' + id + '|verantwortlichkeit" ') + '</div>';
  return '<tr class="nf-detail-row"><td></td><td colspan="5"><div class="nf-detail">' +
    '<div class="nf-detail-item">' + lab('beschreibung', 'Beschreibung') + '<textarea id="' + fid('beschreibung') + '" rows="2" data-nf-m="' + id + '|beschreibung">' + escapeHtml(fixDash(m.beschreibung)) + '</textarea></div>' +
    '<div class="nf-detail-grid">' + inp('startdatum', 'Startdatum', 'TT.MM.JJJJ') + inp('faelligkeitsdatum', 'Fälligkeit', 'TT.MM.JJJJ') +
    inp('umsetzungszeitraum', 'Umsetzungszeitraum', 'z. B. 2026–2028') + prio +
    inp('budget', 'Budget') + person + '</div>' +
    '<div class="nf-detail-item">' + lab('bemerkungen', 'Bemerkungen') + '<textarea id="' + fid('bemerkungen') + '" rows="2" data-nf-m="' + id + '|bemerkungen">' + escapeHtml(fixDash(m.bemerkungen)) + '</textarea></div>' +
    '</div></td></tr>';
}

function renderNachfuehrungMassnahmen(p) {
  const nf = nfState(p), a = nfAenderungen(p), zp = nfZuPruefen(p), alle = !!state.nfAlle;
  const anzeige = alle ? p.massnahmen : zp;
  const rows = anzeige.map(m => {
    const pruefen = zp.includes(m);
    const d = parseSwissDate(m.faelligkeitsdatum);
    const ueberfaellig = pruefen && d && d < new Date();
    const marke = a && a.neu.includes(m.id) ? ' <span class="nf-tag">neu</span>' : a && a.status.includes(m.id) ? ' <span class="nf-tag">Status geändert</span>' : '';
    const ok = !pruefen || nf.massnahmen[m.id];
    const offen = !!(state.nfDetails && state.nfDetails[m.id]);
    const statusSel = '<select class="nf-status-select" data-nf-status="' + m.id + '" aria-label="Prozessstatus ' + m.id + '">' + MASSNAHME_STATUS.map(st => '<option' + (st === m.prozessstatus ? ' selected' : '') + '>' + st + '</option>').join('') + '</select>';
    return `
    <tr data-nf-row="${m.id}" class="nf-row${ok ? ' is-geprueft' : ''}${pruefen ? '' : ' is-auto'}">
      <td class="nf-check-cell"><input type="checkbox" data-nf-check="${m.id}" ${ok ? 'checked' : ''} ${pruefen ? '' : 'disabled'} aria-label="Massnahme ${m.id} bestätigt"></td>
      <td>${m.id}</td>
      <td class="md-row-name">${escapeHtml(m.name)}${geoIcon(m)}${marke}</td>
      <td>${statusSel}</td>
      <td class="cell-termin${ueberfaellig ? ' is-ueberfaellig' : ''}">${escapeHtml(val(m.faelligkeitsdatum))}</td>
      <td class="nf-go"><button type="button" class="btn-link" data-nf-open="${m.id}" aria-expanded="${offen ? 'true' : 'false'}" aria-label="Details" title="Details">${offen ? '▾' : '›'}</button></td>
    </tr>${offen ? renderNachfuehrungMassnahmeDetail(m) : ''}`;
  }).join('');
  const abgeschl = p.massnahmen.length - zp.length;
  const badge = '<span id="nf-mass-badge" class="nf-badge' + (nfGeprueftAnzahl(p) === zp.length ? ' is-done' : '') + '">' + nfGeprueftAnzahl(p) + ' von ' + zp.length + ' bestätigt</span>';
  const tools = '<div class="nf-table-tools">' +
    (abgeschl > 0 ? '<button type="button" class="btn-link" id="btn-nf-toggle-alle">' + (alle ? 'Nur zu prüfende anzeigen' : 'Alle ' + p.massnahmen.length + ' Massnahmen anzeigen (' + abgeschl + ' abgeschlossen)') + '</button>' : '<span></span>') +
    (zp.length ? '<button type="button" class="btn-link" id="btn-nf-alle">Alle bestätigen</button>' : '') + '</div>';
  return `<div class="nf-block">
      <div class="nf-block-head"><h3 class="subheading">Massnahmen</h3>${p.massnahmen.length ? badge : ''}</div>
      <div class="nf-import-row"><button type="button" class="btn btn-primary btn-sm btn-with-icon" id="btn-nf-import" title="Bestehende Massnahmen werden aktualisiert, neue ergänzt. Betroffene Massnahmen gelten danach als bestätigt."><svg viewBox="0 0 24 24"><path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/></svg><span>CSV importieren</span></button></div>
      ${p.massnahmen.length === 0 ? '<div class="empty-state">Keine Massnahmen vorhanden.</div>'
        : zp.length === 0 && !alle ? tools + '<div class="empty-state">Alle Massnahmen sind abgeschlossen und unverändert — nichts zu prüfen.</div>'
        : tools + `<div class="table-scroll"><table class="data-table massnahmen-table nf-table">
        <thead><tr><th class="nf-check-cell">Bestätigt</th><th>ID</th><th>Name</th><th>Prozessstatus</th><th>Fälligkeit</th><th></th></tr></thead>
        <tbody>${rows}</tbody></table></div>`}
    </div>`;
}

function renderPlanungNachfuehrungTabContent(p) {
  const ph = nfPhase(p), aktiv = nfAktiv(p);
  if (!aktiv) {
    // Ruhend / vorab / keine Pflicht: nur Termin, Historie und (bei ruhend) der Weg zur vorzeitigen Nachführung
    return `
      ${renderNachfuehrungTermin(p)}
      ${ph === 'ruhend' ? '<div class="nf-ruhend">Aktuell ist nichts zu tun. Die Nachführung öffnet sich automatisch ' + NF_VORLAUF_MONATE + ' Monate vor der Frist.<div class="btn-row left"><button type="button" class="btn btn-outline btn-sm" id="btn-nf-vorzeitig">Vorzeitig nachführen</button></div></div>' : ''}
    `;
  }
  return `
    ${renderNachfuehrungTermin(p, ph === 'ruhend' ? '<button type="button" class="btn-link" id="btn-nf-vorzeitig-ende">Vorzeitige Nachführung abbrechen</button>' : '')}
    ${renderNachfuehrungSeitLetzter(p)}
    ${renderNachfuehrungBlock(p, 'angaben', 'Angaben')}
    ${renderNachfuehrungBlock(p, 'ziele', 'Ziele')}
    ${renderNachfuehrungMassnahmen(p)}
  `;
}

function bindPlanungNachfuehrungTab(p) {
  const nf = nfState(p), ef = p.energieplanungFelder;
  const rerender = () => { const sc = document.querySelector('.panel-content'); const top = sc ? sc.scrollTop : 0; renderPlanungDetail(); const sc2 = document.querySelector('.panel-content'); if (sc2) sc2.scrollTop = top; };
  const imp = document.getElementById('btn-nf-import');
  if (imp) imp.addEventListener('click', openImportDialog);
  const vz = document.getElementById('btn-nf-vorzeitig');
  if (vz) vz.addEventListener('click', () => { state.nfVorzeitigId = p.id; rerender(); });
  const vzEnde = document.getElementById('btn-nf-vorzeitig-ende');
  if (vzEnde) vzEnde.addEventListener('click', () => { state.nfVorzeitigId = null; rerender(); });
  const howto = document.getElementById('nf-howto');
  if (howto) howto.addEventListener('toggle', () => { state.nfAnleitungZu = !howto.open; });

  // Sofort-Speichern: jede Änderung geht direkt in die Daten, der Stand der letzten Nachführung bleibt als Vergleich sichtbar
  ['angaben', 'ziele'].forEach(art => NF_FELDER[art].forEach(f => {
    const el = document.getElementById(f.id);
    if (!el) return;
    el.addEventListener('change', () => {
      const neu = el.value || '-';
      if (neu === (ef[f.key] || '-')) return;
      ef[f.key] = neu;
      toast('Gespeichert.');
    });
  }));
  $panel.querySelectorAll('[data-nf-aendern]').forEach(b => b.addEventListener('click', () => { nfEdit()[b.dataset.nfAendern] = true; rerender(); }));
  $panel.querySelectorAll('[data-nf-fertig]').forEach(b => b.addEventListener('click', () => {
    const art = b.dataset.nfFertig;
    nfEdit()[art] = false;
    nf[art] = true;
    rerender();
  }));
  $panel.querySelectorAll('[data-nf-ok]').forEach(b => b.addEventListener('click', () => { nf[b.dataset.nfOk] = true; rerender(); }));

  // Massnahmen: Haken je Zeile, Filter, «Alle», Klick auf Zeile öffnet die Massnahme (mit Rückweg)
  $panel.querySelectorAll('[data-nf-check]').forEach(cb => {
    cb.addEventListener('click', e => e.stopPropagation());
    cb.addEventListener('change', () => { nf.massnahmen[cb.dataset.nfCheck] = cb.checked; rerender(); });
  });
  // Ganze Zeile bestätigt/entbestätigt; Status direkt in der Tabelle änderbar (bestätigt die Massnahme gleich mit)
  $panel.querySelectorAll('[data-nf-row]').forEach(row => row.addEventListener('click', e => {
    if (e.target.closest('select, button, input, a')) return;
    const id = row.dataset.nfRow;
    if (!nfZuPruefen(p).some(m => m.id === id)) return;
    nf.massnahmen[id] = !nf.massnahmen[id];
    rerender();
  }));
  $panel.querySelectorAll('[data-nf-status]').forEach(sel => {
    sel.addEventListener('click', e => e.stopPropagation());
    sel.addEventListener('change', () => {
      const m = p.massnahmen.find(x => x.id === sel.dataset.nfStatus);
      if (!m || m.prozessstatus === sel.value) return;
      m.prozessstatus = sel.value;
      nf.beruehrt[m.id] = true;
      nf.massnahmen[m.id] = true;
      toast('Status von ' + m.id + ' auf «' + sel.value + '» gesetzt.');
      rerender();
    });
  });
  const alle = document.getElementById('btn-nf-alle');
  if (alle) alle.addEventListener('click', () => { nfZuPruefen(p).forEach(m => { nf.massnahmen[m.id] = true; }); rerender(); });
  const toggle = document.getElementById('btn-nf-toggle-alle');
  if (toggle) toggle.addEventListener('click', () => { state.nfAlle = !state.nfAlle; rerender(); });
  // Details klappen direkt unter der Zeile auf; Bemerkungen werden dort sofort gespeichert
  $panel.querySelectorAll('[data-nf-open]').forEach(btn => btn.addEventListener('click', e => {
    e.stopPropagation();
    if (!state.nfDetails) state.nfDetails = {};
    state.nfDetails[btn.dataset.nfOpen] = !state.nfDetails[btn.dataset.nfOpen];
    rerender();
  }));
  $panel.querySelectorAll('[data-nf-m]').forEach(el => {
    el.addEventListener('click', e => e.stopPropagation());
    el.addEventListener('change', () => {
      const [id, key] = el.dataset.nfM.split('|');
      const m = p.massnahmen.find(x => x.id === id);
      if (!m) return;
      let v = el.value.trim();
      if ((key === 'startdatum' || key === 'faelligkeitsdatum') && v) {
        const d = parseSwissDate(v);
        if (!d) { toast('Ungültiges Datum – bitte als TT.MM.JJJJ eingeben.'); el.value = fixDash(m[key]); return; }
        v = formatDate(d);
        el.value = v;
      }
      m[key] = v || '-';
      if (key === 'startdatum' || key === 'faelligkeitsdatum') {
        const s0 = parseSwissDate(m.startdatum), e0 = parseSwissDate(m.faelligkeitsdatum);
        if (s0 && e0) {
          const y1 = s0.getFullYear(), y2 = Math.max(e0.getFullYear(), y1);
          m.umsetzungszeitraum = y1 === y2 ? String(y1) : y1 + '–' + y2;
          const z = document.getElementById('nf-m-' + id + '-umsetzungszeitraum'); if (z) z.value = m.umsetzungszeitraum;
        }
        const cell = $panel.querySelector('[data-nf-row="' + id + '"] .cell-termin'); if (cell) cell.textContent = val(m.faelligkeitsdatum);
      }
      // Änderung = Massnahme wurde geprüft. Ohne Neuaufbau (Fokus bleibt), nur Haken und Zähler nachführen.
      nf.beruehrt[id] = true; nf.massnahmen[id] = true;
      const row = $panel.querySelector('[data-nf-row="' + id + '"]');
      if (row) { row.classList.add('is-geprueft'); const cb = row.querySelector('[data-nf-check]'); if (cb) cb.checked = true; }
      const badge = document.getElementById('nf-mass-badge');
      if (badge) { const zp = nfZuPruefen(p), g = nfGeprueftAnzahl(p); badge.textContent = g + ' von ' + zp.length + ' bestätigt'; badge.classList.toggle('is-done', g === zp.length); }
      toast('Gespeichert.');
    });
  });
}

/* ---------------------- PLANUNGSDETAILS-TAB ---------------------- */
function renderPlanungDetailsTabContent(p) {
  return state.planungDetailsMode === 'edit' ? renderPlanungDetailsFormContent(p) : renderPlanungDetailsViewContent(p);
}

// Tabs, deren Inhalt zu den Planungsdetails (Ansicht/Formular) gehört
const PANE_TABS = ['grunddaten', 'epa', 'konto'];
function activatePane(key) {
  state.planungTab = key;
  document.querySelectorAll('#planung-form [data-pane]').forEach(el => { el.hidden = el.dataset.pane !== key; });
  document.querySelectorAll('[data-subtab]').forEach(b => b.classList.toggle('active', b.dataset.subtab === key));
}

function renderPlanungDetailsViewContent(p) {
  const eb = p.epaBeratung, k = p.konto, ef = p.energieplanungFelder;
  let body = '';
  if (state.planungTab === 'grunddaten') {
    body = `
    ${section('energieplanung', 'Energieplanung', `
      ${field(gemeindeLabel(p), p.gemeinde)}
      ${field('Verantwortlichkeit Gemeinde', ef.verantwortlichkeit)}
      ${field('Berater/in Energieplanung', ef.beraterEnergieplanung)}
    `)}`;
  } else if (state.planungTab === 'epa') {
    body = `
    ${section('epa', 'EPA Beratung', `
      ${field('Name EPA-Beratung', eb.name)}
      ${field('Beratungsperson', eb.beratungsperson)}
      ${field('Geplanter Start EPA-Beratung', eb.geplanterStart)}
      ${field('Datum Beratungsbeginn', eb.datumBeratungsbeginn)}
      ${field('Bedarf eines Energierichtplans?', eb.bedarfEnergierichtplan)}
      ${field('Bedarf einer Koordination mit weiteren Gemeinde(n)?', eb.bedarfKoordination)}
      ${field('Gebiete mit Koordinationsbedarf vorhanden?', eb.gebieteKoordinationsbedarf)}
      ${field('Förderabschlussformular', eb.foerderabschlussformular)}
    `)}

    ${section('ziele', 'Ziele', `
      ${fieldStacked('Netto-null Ziel', ef.nettoNullZiel)}
      ${fieldStacked('Energieeffizienz Ziel', ef.energieeffizienzZiel)}
      ${fieldStacked('Stromproduktion Ziel', ef.stromproduktionZiel)}
    `)}`;
  } else {
    body = section('konto', 'Kontoinformationen Förderbeitrag', `
      ${field('Kontoinhaber/in', k.kontoinhaber)}
      ${field('Adresse', k.adresse)}
      ${field('IBAN', k.iban)}
      ${field('Bankname', k.bankname)}
    `) + renderFormularSection(p);
    body = renderGesuchStand(p) + body;
  }
  // "Bearbeiten" sitzt rechts in der Überschrift des ersten Abschnitts
  body = body.replace('</h3>', '</h3><button class="btn btn-secondary btn-sm btn-with-icon" id="btn-edit-planung"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25zM20.7 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg><span>Bearbeiten</span></button>');
  return `
    ${body}
  `;
}
// Ja/Nein-Umschalter. Ohne Auswahl ist keine Stellung aktiv und ein Hinweis "Keine Angabe" steht daneben; ein Klick auf die
// gewählte Stellung hebt die Auswahl wieder auf. Der Wert steckt in einem versteckten Feld mit der übergebenen id
// ('Ja' | 'Nein' | '-' = keine Angabe), damit Speichern und Validierung wie bisher über die id funktionieren.
function yesNoSelect(id, value) {
  const v = value === 'Ja' || value === 'Nein' ? value : '-';
  const opt = val => `<button type="button" role="radio" class="tri-opt${v === val ? ' active' : ''}" data-tri-value="${val}" aria-checked="${v === val}">${val}</button>`;
  return `<div class="tri-wrap">
    <div class="tri-switch${v === '-' ? ' is-empty' : ''}" role="radiogroup" data-tri-for="${id}">
      <input type="hidden" id="${id}" value="${v}">
      ${opt('Ja')}${opt('Nein')}
    </div>
    <span class="tri-hint">Keine Angabe</span>
  </div>`;
}
document.addEventListener('click', e => {
  const btn = e.target.closest('.tri-opt');
  if (!btn) return;
  const group = btn.closest('.tri-switch');
  const input = group.querySelector('input[type=hidden]');
  input.value = input.value === btn.dataset.triValue ? '-' : btn.dataset.triValue;
  group.classList.toggle('is-empty', input.value === '-');
  group.querySelectorAll('.tri-opt').forEach(b => {
    const on = b.dataset.triValue === input.value;
    b.classList.toggle('active', on);
    b.setAttribute('aria-checked', String(on));
  });
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
});

function renderPlanungDetailsFormContent(p) {
  const eb = p.epaBeratung, k = p.konto, ef = p.energieplanungFelder;
  const condReq = `<span class="req cond-req">*</span>`;
  const pane = key => `data-pane="${key}"${state.planungTab === key ? '' : ' hidden'}`;
  return `
    <div id="planung-form">
    <div ${pane('epa')}>
    <h3 class="subheading" style="margin-top:0;">EPA Beratung</h3>
    <div class="form-field"><label>Name EPA-Beratung</label><input type="text" id="f-eb-name" value="${escapeAttr(fixDash(eb.name))}"></div>
    <div class="form-field"><label>Beratungsperson${condReq}</label>${personSelect('f-eb-beratungsperson', eb.beratungsperson, null, true)}</div>
    <div class="form-field"><label>Geplanter Start EPA-Beratung</label><input type="text" id="f-eb-geplant" placeholder="dd.MM.yyyy" value="${escapeAttr(fixDash(eb.geplanterStart))}"></div>
    <div class="form-field"><label>Datum Beratungsbeginn${condReq}</label><input type="text" id="f-eb-datum" placeholder="dd.MM.yyyy" value="${escapeAttr(fixDash(eb.datumBeratungsbeginn))}"></div>
    <div class="form-field"><label>Bedarf eines Energierichtplans?${condReq}</label>${yesNoSelect('f-eb-energierichtplan', eb.bedarfEnergierichtplan)}</div>
    <div class="form-field"><label>Bedarf einer Koordination mit weiteren Gemeinde(n)?${condReq}</label>${yesNoSelect('f-eb-koordination', eb.bedarfKoordination)}</div>
    <div class="form-field"><label>Gebiete mit Koordinationsbedarf vorhanden?${condReq}</label>${yesNoSelect('f-eb-gebiete', eb.gebieteKoordinationsbedarf)}</div>
    <div class="form-field"><label>Förderabschlussformular</label><input type="text" id="f-eb-foerderformular" value="${escapeAttr(fixDash(eb.foerderabschlussformular))}"></div>

    <h3 class="subheading">Ziele</h3>
    <div class="form-field"><label>Netto-null Ziel</label><textarea id="f-netto" rows="5">${escapeHtml(fixDash(ef.nettoNullZiel))}</textarea></div>
    <div class="form-field"><label>Energieeffizienz Ziel</label><textarea id="f-effizienz" rows="5">${escapeHtml(fixDash(ef.energieeffizienzZiel))}</textarea></div>
    <div class="form-field"><label>Stromproduktion Ziel</label><textarea id="f-strom" rows="5">${escapeHtml(fixDash(ef.stromproduktionZiel))}</textarea></div>
    </div>

    <div ${pane('grunddaten')}>
    <h3 class="subheading" style="margin-top:0;">Energieplanung</h3>
    <div class="form-field"><label>Name</label><input type="text" id="f-name" value="${escapeAttr(p.name)}"></div>
    <div class="form-field"><label>Planungstyp<span class="req">*</span></label><input type="text" id="f-typ" value="${escapeAttr(p.typ)}"></div>
    <div class="form-field"><label>${gemeindeLabel(p)}<span class="req">*</span></label><input type="text" id="f-gemeinde" value="${escapeAttr(p.gemeinde)}"></div>
    <input type="hidden" id="f-status" value="${escapeAttr(state.planungPendingStatus || p.status)}">
    <div class="form-field"><label>Verantwortlichkeit Gemeinde</label>${personSelect('f-verantwortlichkeit', ef.verantwortlichkeit, p.gemeinde)}</div>
    <div class="form-field"><label>Berater/in Energieplanung</label>${personSelect('f-berater-energieplanung', ef.beraterEnergieplanung, null, true)}</div>
    </div>

    <div ${pane('konto')}>
    <h3 class="subheading" style="margin-top:0;">Kontoinformationen Förderbeitrag</h3>
    <div class="form-field"><label>Kontoinhaber/in${condReq}</label><input type="text" id="f-k-inhaber" value="${escapeAttr(fixDash(k.kontoinhaber))}"></div>
    <div class="form-field"><label>Adresse${condReq}</label><input type="text" id="f-k-adresse" value="${escapeAttr(fixDash(k.adresse))}"></div>
    <div class="form-field"><label>IBAN${condReq}</label><input type="text" id="f-k-iban" value="${escapeAttr(fixDash(k.iban))}"></div>
    <div class="form-field"><label>Bankname</label><input type="text" id="f-k-bankname" value="${escapeAttr(fixDash(k.bankname))}"></div>
    </div>

    <div class="btn-row right">
      <button class="btn btn-outline" id="btn-cancel">Abbrechen</button>
      <button class="btn btn-primary" id="btn-save">Speichern</button>
    </div>
    </div>
  `;
}

// Abschnitt im Tab Kontoinformationen: Förderabschlussformular erstellen (sobald die Kontoangaben vollständig sind)
function kontoAngabenVollstaendig(p) {
  const k = p.konto;
  return [k.kontoinhaber, k.adresse, k.iban].every(v => v && v !== '-');
}
function renderGesuchStand(p) {
  const eb = p.epaBeratung || {};
  const eingang = eb.gesuchseingang && eb.gesuchseingang !== '-';
  if (p.status === 'Abschluss') return '<div class="step-note is-ok">✓ Beratung abgeschlossen' + (eingang ? ' · Fördergesuch eingereicht am ' + escapeHtml(eb.gesuchseingang) : '') + '</div>';
  if (eingang) return '<div class="step-note is-ok">✓ Fördergesuch eingereicht am ' + escapeHtml(eb.gesuchseingang) + ' · liegt beim Kanton</div>';
  return '';
}
function renderFormularSection(p) {
  const ok = kontoAngabenVollstaendig(p);
  const doc = '<svg viewBox="0 0 24 24"><path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 1.5V8h4.5L14 3.5zM8 12h8v1.6H8V12zm0 3.4h8V17H8v-1.6z"/></svg>';
  return section('formular', 'Förderabschlussformular', `
    <p class="formular-intro">Das Formular muss von Berater/in und Gemeinderat unterschrieben werden.</p>
    <button type="button" class="btn btn-outline btn-sm btn-with-icon" id="btn-formular" ${ok ? '' : 'disabled'}>${doc}<span>Formular drucken / als PDF speichern</span></button>
    ${ok ? '' : '<p class="formular-hint">Bitte zuerst die Kontoinformationen vollständig erfassen (Kontoinhaber/in, Adresse, IBAN).</p>'}
  `);
}

function bindPlanungDetailsTab(p) {
  if (state.planungDetailsMode === 'edit') {
    bindPlanungDetailsForm(p);
    return;
  }
  bindSectionToggles();
  const formularBtn = document.getElementById('btn-formular');
  if (formularBtn) formularBtn.addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([foerderFormularHtml(p)], { type: 'text/html' }));
    if (!window.open(url, '_blank')) toast('Das Formular konnte nicht geöffnet werden – bitte Pop-ups für diese Seite erlauben.');
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  });
  const delBtn = document.getElementById('btn-del-planung');
  if (delBtn) delBtn.addEventListener('click', async () => {
    if (await confirmDialog(`Energieplanung ${p.id} wirklich löschen?`, { title: "Energieplanung löschen", confirmLabel: "Löschen", danger: true })) {
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
  if (state.nfKontoHinweis) {
    state.nfKontoHinweis = false;
    const missing = validatePlanungForm('Fördergesuch').filter(f => f.id.startsWith('f-k-'));
    if (missing.length) showPlanungFieldErrors(missing, 'Für die Nachführung fehlen noch Kontoinformationen:');
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
    eb.geplanterStart = document.getElementById('f-eb-geplant').value || '-';
    eb.bedarfEnergierichtplan = document.getElementById('f-eb-energierichtplan').value;
    eb.bedarfKoordination = document.getElementById('f-eb-koordination').value;
    eb.gebieteKoordinationsbedarf = document.getElementById('f-eb-gebiete').value;
    eb.foerderabschlussformular = document.getElementById('f-eb-foerderformular').value || '-';

    k.kontoinhaber = document.getElementById('f-k-inhaber').value || '-';
    k.adresse = document.getElementById('f-k-adresse').value || '-';
    k.iban = document.getElementById('f-k-iban').value || '-';
    k.bankname = document.getElementById('f-k-bankname').value || '-';

    p.name = document.getElementById('f-name').value || p.name;
    p.typ = document.getElementById('f-typ').value || p.typ;
    p.gemeinde = document.getElementById('f-gemeinde').value || p.gemeinde;
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
  const html = `
    ${section('gesuch', 'Gesuch (intern)', `
      ${field('Gesuchseingang', eb.gesuchseingang)}
      ${field('Gesuchs-Nr.', eb.gesuchsNr)}
      ${field('Auszahlungsbetrag CHF', formatChfAmount(eb.auszahlungsbetrag))}
      ${field('Kommentar', eb.kommentar)}
    `)}

  `;
  return html.replace('</h3>', '</h3><button class="btn btn-secondary btn-sm btn-with-icon" id="btn-edit-kontrolle"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25zM20.7 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg><span>Bearbeiten</span></button>');
}

// Eindeutiger Vorschlag für die Gesuchs-Nr.: aktuelles Jahr + ID der Energieplanung (z.B. EP-712 → 2026712)
function vorschlagGesuchsNr(p) {
  const vergeben = new Set(planungen.filter(x => x !== p).map(x => String(x.epaBeratung.gesuchsNr)));
  const basis = `${new Date().getFullYear()}${String(p.id).replace(/[^0-9]/g, '')}`;
  let nr = basis, n = 2;
  while (vergeben.has(nr)) nr = `${basis}${n++}`;
  return nr;
}

function renderPlanungKontrolleFormContent(p) {
  const eb = p.epaBeratung;
  return `
    <h3 class="subheading" style="margin-top:0;">Gesuch (intern)</h3>
    <div class="form-field"><label>Gesuchseingang</label><input type="text" id="f-eb-gesuchseingang" placeholder="dd.MM.yyyy" value="${escapeAttr(fixDash(eb.gesuchseingang))}"></div>
    <div class="form-field"><label>Gesuchs-Nr.</label><input type="number" id="f-eb-gesuchsnr" value="${eb.gesuchsNr && eb.gesuchsNr !== '-' ? eb.gesuchsNr : vorschlagGesuchsNr(p)}"></div>
    <div class="form-field"><label>Auszahlungsbetrag CHF</label><input type="number" id="f-eb-auszahlungsbetrag" value="${eb.auszahlungsbetrag}"></div>
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
      <div class="search-input-wrap${state.massList.search ? ' has-value' : ''}">
        <input type="text" id="massnahme-search" placeholder="ID, ES-Nr., Name..." value="${escapeAttr(state.massList.search)}">
        ${searchClearBtn('massnahme-search', state.massList.search)}
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
                <div class="md-row-name">${m.name}${geoIcon(m)}</div>
                <div class="md-row-meta">${m.id} · ${val(m.umsetzungszeitraum)}</div>
              </td>
              <td><span class="status-pill status-${m.prozessstatus.toLowerCase()}">${m.prozessstatus}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table></div>`}

    <div class="btn-row right" style="margin-top:14px;">
      <button type="button" class="btn btn-primary btn-sm btn-with-icon" id="btn-import-massnahmen" title="Bestehende Massnahmen werden aktualisiert, neue ergänzt."><svg viewBox="0 0 24 24"><path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/></svg><span>CSV importieren</span></button>
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
  document.getElementById('btn-import-massnahmen').addEventListener('click', openImportDialog);
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
  document.getElementById('bulk-apply').addEventListener('click', async () => {
    const value = document.getElementById('bulk-value').value.trim();
    if (!value) { toast('Bitte einen Wert angeben.'); return; }
    const field = state.bulkEdit.field;
    const label = BULK_FIELD_LABELS[field];
    const count = state.massList.selected.size;
    if (!await confirmDialog(`${label} für ${count} Massnahme${count === 1 ? '' : 'n'} auf "${value}" setzen?`, { title: "Änderung bestätigen", confirmLabel: "Übernehmen" })) return;
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
  return `<div class="section" data-section="${id}">
    <div class="section-header">
      <h3>${title}</h3>
    </div>
    <div class="section-body">${bodyHtml}</div>
  </div>`;
}
// Leere Werte ('-', leer) als gedämpfter Hinweis statt Gedankenstrich
function fieldValueHtml(value) {
  return (value === undefined || value === null || value === '' || value === '-')
    ? '<span class="empty-val">Noch nicht erfasst</span>'
    : escapeHtml(value);
}
// Bezeichnung über dem Wert, Text über die volle Breite (für lange, mehrzeilige Inhalte wie Ziele)
function fieldStacked(label, value) {
  return `<div class="field-row stacked">
    <div class="field-label">${label}</div>
    <div class="field-value">${fieldValueHtml(value)}</div>
  </div>`;
}
function field(label, value, withInfo) {
  return `<div class="field-row">
    <div class="field-label">${label}</div>
    <div class="field-value">${fieldValueHtml(value)}</div>
  </div>`;
}
// Abschnitte sind nicht mehr einklappbar (kein Toggle nötig).
function bindSectionToggles() {}

// Kommunal: genau eine Gemeinde, regional: mehrere Gemeinden
// Liste: regionale Planungen zeigen den Regionsnamen (volle Gemeindeliste im Tooltip)
function planungGemeindeCell(p) {
  if (!/region/i.test(p.typ) || !p.regionName) return escapeHtml(p.gemeinde);
  return escapeHtml(p.regionName);
}
function gemeindeLabel(p) { return /region/i.test(p && p.typ) ? 'Gemeinden' : 'Gemeinde'; }
function planungTitel(p) { return `${p.typ} ${/region/i.test(p.typ) && p.regionName ? p.regionName : p.gemeinde}`; }

// Dropdown mit allen Personen aus den Kontakten. Wert = Anzeigename "Vorname Nachname (Organisation)", wie in den Daten gespeichert.
const istGemeindeKontakt = c => !!c.gemeindeKontakt || /^Gemeinde /.test(c.organisation || '');
// nurExtern: nur externe Fachpersonen (keine Gemeindekontakte) anbieten, ohne Gruppierung.
function personSelect(id, aktuell, nurGemeinden, nurExtern) {
  const cur = aktuell && aktuell !== '-' ? aktuell : '';
  const gemeinden = nurGemeinden ? String(nurGemeinden).split(',').map(x => x.trim()).filter(Boolean) : null;
  const passt = c => (!gemeinden || gemeinden.some(g => c.organisation === 'Gemeinde ' + g || c.organisation === g)) && (!nurExtern || !istGemeindeKontakt(c));
  const sortiert = contacts.filter(passt).sort((x, y) => (x.nachname + ' ' + x.vorname).localeCompare(y.nachname + ' ' + y.vorname, 'de'));
  const opt = c => { const l = formatContactLabel(c); return '<option value="' + escapeAttr(l) + '"' + (l === cur ? ' selected' : '') + '>' + escapeHtml(l) + '</option>'; };
  const bekannt = new Set((nurExtern ? sortiert : contacts).map(formatContactLabel));
  const extra = cur && !bekannt.has(cur) ? '<option value="' + escapeAttr(cur) + '" selected>' + escapeHtml(cur) + '</option>' : '';
  return '<select id="' + id + '" class="person-select"><option value="">– Person auswählen –</option>' + extra +
    (gemeinden || nurExtern ? sortiert.map(opt).join('') : '<optgroup label="Gemeinden">' + sortiert.filter(istGemeindeKontakt).map(opt).join('') + '</optgroup>' +
    '<optgroup label="Externe Fachpersonen">' + sortiert.filter(c => !istGemeindeKontakt(c)).map(opt).join('') + '</optgroup>') + '</select>';
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

// Kleines Icon in Listen: Massnahme hat eine geografische Markierung (je nach Art Pin, Linie, Kurve oder Fläche)
const GEO_ICONS = {
  'Punkt': '<path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="currentColor"/>',
  'Linie': '<path d="M4 19l5-8 5 4 6-10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="4" cy="19" r="2" fill="currentColor"/><circle cx="20" cy="5" r="2" fill="currentColor"/>',
  'Kurve': '<path d="M3 17c4-12 8 5 12-6 1.5-4 3.5-4 6-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="3" cy="17" r="2" fill="currentColor"/><circle cx="21" cy="8" r="2" fill="currentColor"/>',
  'Fläche': '<path d="M4 9l8-5 8 4-2 10-9 3z" fill="currentColor" fill-opacity=".25" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>'
};
function geoIcon(m) {
  const g = m && m.geometrie;
  if (!g || !g.geometry) return '';
  return '<span class="geo-icon" title="Geografische Markierung: ' + escapeAttr(geometrieText(m)) + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + (GEO_ICONS[g.art] || GEO_ICONS['Punkt']) + '</svg></span>';
}
// Kurzbeschreibung der geografischen Markierung, z. B. «3 Punkte · Emmen»
function geometrieText(m) {
  const g = m.geometrie;
  if (!g || !g.geometry) return '-';
  const c = g.geometry.coordinates, t = g.geometry.type;
  const n = t === 'Point' || t === 'LineString' || t === 'Polygon' ? 1 : c.length;
  const bez = { Punkt: ['Punkt', 'Punkte'], Linie: ['Linie', 'Linien'], Kurve: ['Kurve', 'Kurven'], 'Fläche': ['Fläche', 'Flächen'] }[g.art] || [g.art, g.art];
  return n + ' ' + (n === 1 ? bez[0] : bez[1]) + (g.gemeinde ? ' · ' + g.gemeinde : '');
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
      <button type="button" class="md-close" id="btn-md-close" title="Auswahl aufheben" aria-label="Massnahme abwählen">✕</button>
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
    ${field('Geografische Markierung', geometrieText(m))}
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
        <button class="btn btn-secondary btn-with-icon" id="btn-edit-massnahme"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25zM20.7 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg><span>Massnahme bearbeiten</span></button>
      </div>
    </div>
  `;
}

function renderMassnahmeFormPanel(p, isEdit) {
  const m = isEdit ? findMassnahme(p, state.massnahmeId) : null;

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
    <div class="form-field"><label>Verantwortlichkeit</label>
      <div class="contact-select-row">
        ${personSelect('mf-verantwortlichkeit', m ? m.verantwortlichkeit : '')}
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
    document.getElementById('btn-del-massnahme').addEventListener('click', async () => {
      if (await confirmDialog(`Massnahme ${m.id} wirklich löschen?`, { title: "Massnahme löschen", confirmLabel: "Löschen", danger: true })) {
        p.massnahmen = p.massnahmen.filter(x => x.id !== m.id);
        state.massList.selected.delete(m.id);
        toast(`${m.id} wurde gelöscht.`);
        state.massnahmeId = null;
        state.mdMode = null;
        renderPlanungDetail();
      }
    });
    document.getElementById('btn-geodaten').addEventListener('click', () => toast('Geodaten-Editor ist in diesem Prototyp nicht verfügbar (Karte ist statisch).'));
    document.getElementById('btn-md-close').addEventListener('click', massnahmeAbwaehlen);
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
      verantwortlichkeit: document.getElementById('mf-verantwortlichkeit').value || '-',
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
  document.getElementById('contact-bulk-delete').addEventListener('click', async () => {
    const count = state.contactList.selected.size;
    if (!await confirmDialog(`${count} Kontakt${count === 1 ? '' : 'e'} wirklich löschen?`, { title: "Kontakte löschen", confirmLabel: "Löschen", danger: true })) return;
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
      <div class="search-input-wrap${state.contactList.search ? ' has-value' : ''}">
        <input type="text" id="contact-search" placeholder="Organisation, Vorname, Nachname, E-Mail..." value="${escapeAttr(state.contactList.search)}">
        ${searchClearBtn('contact-search', state.contactList.search)}
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
    document.getElementById('btn-del-contact').addEventListener('click', async () => {
      if (await confirmDialog(`Kontakt ${c.vorname} ${c.nachname} wirklich löschen?`, { title: "Kontakt löschen", confirmLabel: "Löschen", danger: true })) {
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
      setActiveTabButton('planungen');
      openPlanung(row.dataset.openReportPlanung, false);
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
/* ---------------------- ZUGRIFFSVERWALTUNG ---------------------- */
// Zugriffsrechte je Person aus der Kontaktliste: Rolle + Gemeinden, auf die die Person Zugriff hat.
//  Admin = Kanton (alle Gemeinden) · Energieberater = Gemeinden, in denen die Person berät · Gemeinde = eigene Gemeinde · Kein Zugriff
const ZUGRIFF_ROLLEN = ['Admin', 'Energieberater', 'Gemeinde', 'Kein Zugriff'];
const zugriffsdaten = new Map();   // Anzeigename der Person -> { rolle, gemeinden: [] }
const zugriffUi = { search: '', filter: 'aktiv' };

// Demo-Personen mit Zugriff auf Gemeinden, deren kommunale Energieplanungen in unterschiedlichen Prozessschritten stehen
// (Grunddaten, EPA Beratung, Massnahmen, Gesuch, Nachführung): je Schritt `proSchritt` Gemeinden.
function gemeindenMitVerschiedenemFortschritt(eigene, proSchritt) {
  const gruppen = {};
  // Gemeinden in einer regionalen Planung auslassen, damit die Person genau so viele Planungen sieht, wie sie Gemeinden hat
  const regional = new Set();
  planungen.filter(p => /region/i.test(p.typ)).forEach(p => p.gemeinde.split(',').forEach(g => regional.add(g.trim())));
  planungen.filter(p => p.typ === 'Kommunale Energieplanung' && !regional.has(p.gemeinde))
    .sort((x, y) => (x.gemeinde === eigene ? -1 : 0) - (y.gemeinde === eigene ? -1 : 0) || x.gemeinde.localeCompare(y.gemeinde, 'de'))
    .forEach(p => { const k = prozessSchrittFor(p).key; (gruppen[k] = gruppen[k] || []).push(p.gemeinde); });
  return PROZESS_TABS.flatMap(t => (gruppen[t.key] || []).slice(0, proSchritt)).sort((x, y) => x.localeCompare(y, 'de'));
}
function standardZugriff(c, key) {
  if (c.email === 'julia.keller@demo.com') return { rolle: 'Energieberater', gemeinden: gemeindenMitVerschiedenemFortschritt('', 2) };      // 10 Gemeinden, je 2 pro Schritt
  if ((c.email || '').endsWith('@lu.ch') && !istGemeindeKontakt(c)) return { rolle: 'Admin', gemeinden: [] };
  if (istGemeindeKontakt(c)) return { rolle: 'Gemeinde', gemeinden: [String(c.organisation).replace(/^Gemeinde /, '')] };
  const g = new Set();
  planungen.forEach(p => {
    if (p.epaBeratung.beratungsperson === key || p.energieplanungFelder.beraterEnergieplanung === key) p.gemeinde.split(',').forEach(x => g.add(x.trim()));
  });
  return { rolle: g.size ? 'Energieberater' : 'Kein Zugriff', gemeinden: [...g].sort((a, b) => a.localeCompare(b, 'de')) };
}
function ensureZugriff() {
  contacts.forEach(c => { const key = formatContactLabel(c); if (!zugriffsdaten.has(key)) zugriffsdaten.set(key, standardZugriff(c, key)); });
}
// Demo-Benutzer für den Rollenwechsel: Admin, die zwei Energieberater/innen mit den meisten Gemeinden und ein Gemeindekontakt
function rollenPersonas() {
  ensureZugriff();
  const initialen = c => (c.vorname[0] + c.nachname[0]).toUpperCase();
  const eintrag = (key, z, rolleText) => {
    const c = contacts.find(x => formatContactLabel(x) === key);
    const sub = z.rolle === 'Gemeinde' && z.gemeinden.length === 1 ? 'Gemeinde ' + z.gemeinden[0] : z.gemeinden.length + ' Gemeinden · ' + c.organisation;
    return { id: slugify(key), key, role: z.rolle, rolleText, name: c.vorname + ' ' + c.nachname, sub: rolleText + ' · ' + sub, initials: initialen(c) };
  };
  const personas = [{ id: 'admin', key: null, role: 'Admin', rolleText: 'Admin', name: 'Admin', sub: 'Kanton Luzern · alle Gemeinden', initials: 'A' }];
  const eintragPerEmail = (email, rolleText) => {
    const c = contacts.find(x => x.email === email);
    const key = c ? formatContactLabel(c) : null;
    return key && zugriffsdaten.get(key) ? eintrag(key, zugriffsdaten.get(key), rolleText) : null;
  };
  const julia = eintragPerEmail('julia.keller@demo.com', 'Energieberater/in');
  const beat = [...zugriffsdaten.entries()].filter(([key, z]) => z.rolle === 'Energieberater' && (!julia || key !== julia.key))
    .sort((x, y) => y[1].gemeinden.length - x[1].gemeinden.length || x[0].localeCompare(y[0], 'de'))[0];
  if (beat) personas.push(eintrag(beat[0], beat[1], 'Energieberater/in'));
  if (julia) personas.push(julia);
  const pino = eintragPerEmail('pino.merino@adligenswil.ch', 'Gemeinde');
  if (pino) personas.push(pino);
  return personas;
}
// Admin sieht alles; alle anderen nur Energieplanungen der Gemeinden, für die sie in der Zugriffsverwaltung freigeschaltet sind
function planungDarfSehen(p) {
  if (state.role === 'Admin') return true;
  const z = state.benutzer ? zugriffsdaten.get(state.benutzer) : null;
  if (!z || z.rolle === 'Kein Zugriff') return false;
  if (z.rolle === 'Admin') return true;
  const erlaubt = new Set(z.gemeinden);
  return p.gemeinde.split(',').some(g => erlaubt.has(g.trim()));
}
function zugriffGemeindenText(z) {
  if (z.rolle === 'Admin') return 'Alle Gemeinden';
  if (z.rolle === 'Kein Zugriff' || !z.gemeinden.length) return '–';
  return z.gemeinden.length <= 3 ? z.gemeinden.join(', ') : z.gemeinden.slice(0, 3).join(', ') + ' +' + (z.gemeinden.length - 3);
}

function renderZugriff() {
  if (state.role !== 'Admin') {
    const z = state.benutzer ? zugriffsdaten.get(state.benutzer) : null;
    $panel.innerHTML = `
      <h2 class="panel-title">Zugriffsverwaltung</h2>
      <div class="empty-state">Die Zugriffsverwaltung ist nur für Admins sichtbar.${z ? `<br>Sie sind als <strong>${escapeHtml(state.benutzer)}</strong> angemeldet und sehen ${planungen.filter(planungDarfSehen).length} Energieplanungen in ${z.gemeinden.length} Gemeinden.` : ''}</div>`;
    return;
  }
  ensureZugriff();
  const q = zugriffUi.search.trim().toLowerCase();
  const rows = contacts.map(c => ({ c, key: formatContactLabel(c), z: zugriffsdaten.get(formatContactLabel(c)) }))
    .filter(r => zugriffUi.filter === 'alle' ? true : zugriffUi.filter === 'aktiv' ? r.z.rolle !== 'Kein Zugriff' : r.z.rolle === zugriffUi.filter)
    .filter(r => !q || (r.c.vorname + ' ' + r.c.nachname + ' ' + r.c.organisation + ' ' + r.z.gemeinden.join(' ')).toLowerCase().includes(q))
    .sort((a, b) => (a.c.nachname + a.c.vorname).localeCompare(b.c.nachname + b.c.vorname, 'de'));
  const zaehl = r => [...zugriffsdaten.values()].filter(z => z.rolle === r).length;
  const optF = (v, l) => `<option value="${v}"${zugriffUi.filter === v ? ' selected' : ''}>${l}</option>`;
  $panel.innerHTML = `
    <h2 class="panel-title">Zugriffsverwaltung</h2>
    <p class="zugriff-intro">Wer auf welche Energieplanungen zugreifen darf. Energieberater/innen sehen nur die Planungen ihrer freigeschalteten Gemeinden. Zurzeit: ${zaehl('Admin')} Admins · ${zaehl('Energieberater')} Energieberater/innen · ${zaehl('Gemeinde')} Gemeindekontakte.</p>
    <div class="toolbar-row">
      <div class="search-input-wrap${zugriffUi.search ? ' has-value' : ''}">
        <input type="text" id="zugriff-search" placeholder="Person, Organisation, Gemeinde..." value="${escapeAttr(zugriffUi.search)}">
        ${searchClearBtn('zugriff-search', zugriffUi.search)}
        <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"/></svg>
      </div>
      <select class="select-input" id="zugriff-filter">
        ${optF('aktiv', 'Mit Zugriff')}${optF('Admin', 'Admin')}${optF('Energieberater', 'Energieberater')}${optF('Gemeinde', 'Gemeinde')}${optF('Kein Zugriff', 'Kein Zugriff')}${optF('alle', 'Alle Personen')}
      </select>
    </div>
    ${rows.length === 0 ? '<div class="empty-state">Keine Personen gefunden.</div>' : `
    <div class="table-scroll"><table class="data-table zugriff-table">
      <thead><tr><th>Person</th><th>Organisation</th><th>Rolle</th><th>Gemeinden</th><th class="col-actions"><span class="sr-only">Aktionen</span></th></tr></thead>
      <tbody>${rows.map(r => `
        <tr data-zugriff-key="${escapeAttr(r.key)}">
          <td class="zugriff-name">${escapeHtml(r.c.vorname + ' ' + r.c.nachname)}</td>
          <td>${escapeHtml(r.c.organisation || '–')}</td>
          <td><span class="rolle-pill rolle-${slugify(r.z.rolle)}">${escapeHtml(r.z.rolle)}</span></td>
          <td title="${escapeAttr(r.z.rolle === 'Admin' ? 'Alle Gemeinden' : r.z.gemeinden.join(', '))}">${escapeHtml(zugriffGemeindenText(r.z))}</td>
          <td class="col-actions"><button type="button" class="row-action" data-zugriff-edit="${escapeAttr(r.key)}" title="Zugriff bearbeiten" aria-label="Zugriff bearbeiten"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25zM20.7 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button></td>
        </tr>`).join('')}</tbody>
    </table></div>`}
  `;
  document.getElementById('zugriff-search').addEventListener('input', e => {
    zugriffUi.search = e.target.value;
    renderZugriff();
    const el = document.getElementById('zugriff-search');
    el.focus(); el.setSelectionRange(el.value.length, el.value.length);
  });
  document.getElementById('zugriff-filter').addEventListener('change', e => { zugriffUi.filter = e.target.value; renderZugriff(); });
  $panel.querySelectorAll('[data-zugriff-key]').forEach(tr => tr.addEventListener('click', () => openZugriffDialog(tr.dataset.zugriffKey)));
}

function openZugriffDialog(key) {
  const c = contacts.find(x => formatContactLabel(x) === key);
  const z = zugriffsdaten.get(key);
  if (!c || !z || document.getElementById('zugriff-dialog')) return;
  const alle = GEMEINDEN_LUZERN_PLZ.map(g => g.name);
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'zugriff-dialog';
  overlay.innerHTML = `
    <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="zg-title">
      <h3 id="zg-title">Zugriff bearbeiten</h3>
      <p class="zg-person"><strong>${escapeHtml(c.vorname + ' ' + c.nachname)}</strong><br><span class="muted">${escapeHtml(c.organisation || '')} · ${escapeHtml(c.email || '')}</span></p>
      <div class="form-field"><label for="zg-rolle">Rolle</label>
        <select id="zg-rolle" class="select-input">${ZUGRIFF_ROLLEN.map(r => `<option${r === z.rolle ? ' selected' : ''}>${r}</option>`).join('')}</select></div>
      <div class="form-field" id="zg-gemeinden-wrap">
        <label>Gemeinden mit Zugriff <span class="np-hint" id="zg-count"></span></label>
        <input type="text" id="zg-filter" placeholder="Gemeinde suchen…" class="np-filter">
        <div class="np-list" id="zg-list">${alle.map(n => `<label class="np-item" data-name="${escapeAttr(n.toLowerCase())}"><input type="checkbox" value="${escapeAttr(n)}"${z.gemeinden.includes(n) ? ' checked' : ''}> ${n}</label>`).join('')}</div>
      </div>
      <p class="zg-hinweis muted" id="zg-hinweis"></p>
      <div class="btn-row modal-actions">
        <button type="button" class="btn btn-secondary" id="zg-cancel">Abbrechen</button>
        <button type="button" class="btn btn-primary" id="zg-save">Speichern</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  const $rolle = overlay.querySelector('#zg-rolle'), $wrap = overlay.querySelector('#zg-gemeinden-wrap'), $hint = overlay.querySelector('#zg-hinweis'), $count = overlay.querySelector('#zg-count');
  const gewaehlt = () => [...overlay.querySelectorAll('#zg-list input:checked')].map(i => i.value);
  const close = () => { overlay.remove(); document.removeEventListener('keydown', onKey); };
  const onKey = e => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  const update = () => {
    const r = $rolle.value;
    $wrap.hidden = r === 'Admin' || r === 'Kein Zugriff';
    $hint.textContent = r === 'Admin' ? 'Admins haben Zugriff auf alle Gemeinden.' : r === 'Kein Zugriff' ? 'Die Person kann sich nicht mehr anmelden bzw. sieht keine Energieplanungen.' : '';
    const n = gewaehlt().length;
    $count.textContent = n ? '(' + n + ' gewählt)' : '';
  };
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  overlay.querySelector('#zg-cancel').addEventListener('click', close);
  $rolle.addEventListener('change', update);
  overlay.querySelector('#zg-list').addEventListener('change', update);
  overlay.querySelector('#zg-filter').addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    overlay.querySelectorAll('#zg-list .np-item').forEach(el => { el.hidden = !!q && !el.dataset.name.includes(q); });
  });
  overlay.querySelector('#zg-save').addEventListener('click', () => {
    const r = $rolle.value;
    const g = r === 'Admin' || r === 'Kein Zugriff' ? [] : gewaehlt();
    if ((r === 'Energieberater' || r === 'Gemeinde') && g.length === 0) { $hint.textContent = 'Bitte mindestens eine Gemeinde wählen.'; return; }
    zugriffsdaten.set(key, { rolle: r, gemeinden: g });
    close();
    toast('Zugriff für ' + c.vorname + ' ' + c.nachname + ' wurde gespeichert.');
    renderZugriff();
  });
  update();
}

/* ---------------------- UTIL ---------------------- */
function escapeHtml(s) { return String(s == null ? '' : s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
function escapeAttr(s) { return escapeHtml(s).replace(/"/g, '&quot;'); }

/* ---------------------- LEAFLET MAP ---------------------- */
const LUZERN_CENTER = [47.0502, 8.3093];
// Keine Hintergrundkarte: der Kanton Luzern wird mit seinen 79 Gemeinden dargestellt, eingefärbt nach Prozessstand der Energieplanung.
const map = L.map('leaflet-map', { zoomControl: false, zoomSnap: 0.25, minZoom: 8 }).setView(LUZERN_CENTER, 10);
map.attributionControl.setPrefix(false);
map.attributionControl.addAttribution('Gemeindegrenzen &copy; <a href="https://www.swisstopo.admin.ch">swisstopo</a>');

map.createPane('massnahmenPane').style.zIndex = 450;   // über den Gemeindeflächen (overlayPane 400), unter Tooltips
L.control.zoom({ position: 'topright' }).addTo(map);
L.control.scale({ imperial: false }).addTo(map);

/* ---- Gemeindekarte: Status je Gemeinde, Klick öffnet die Energieplanung ---- */
var gemeindeLayer = null;   // var: render() darf schon vor der Initialisierung aufgerufen werden
const KARTE_FARBEN = { grunddaten: '#d5dae0', epa: '#9ccbea', massnahmen: '#5aa2d6', konto: '#b9a6e8', nachfuehrung: '#6fc79a', warn: '#f0b84f', keine: '#f3f5f7' };
const KARTE_LEGENDE = [
  ['grunddaten', 'Grunddaten'], ['epa', 'EPA Beratung'], ['massnahmen', 'Massnahmen'], ['konto', 'Gesuch'],
  ['nachfuehrung', 'Nachführung'], ['warn', 'Nachführung fällig'], ['keine', 'Keine Energieplanung']
];
const karteFilter = { kommunal: true, regional: true };

// Welche Planung zeigt eine Gemeinde unter dem aktuellen Filter? Kommunal hat Vorrang; regionale Zugehörigkeit wird zusätzlich gerahmt.
function karteInfoFor(name) {
  const sichtbar = planungen.filter(planungDarfSehen).filter(p => String(p.gemeinde).split(',').some(g => g.trim() === name));
  const kom = sichtbar.find(p => p.typ !== TYP_REGIONAL), reg = sichtbar.find(p => p.typ === TYP_REGIONAL);
  const gezeigt = (karteFilter.kommunal && kom) ? kom : (karteFilter.regional && reg) ? reg : null;
  return { gezeigt, kom, reg, regionalRand: karteFilter.regional && karteFilter.kommunal && !!reg };
}
// In der Detailansicht einer Planung: ihre Gemeinde(n) bleiben kräftig, alle anderen werden abgesenkt
function karteAuswahlNamen() {
  if (state.tab !== 'planungen' || state.view !== 'detail' || !state.planungId) return null;
  const p = findPlanung(state.planungId);
  return p ? new Set(String(p.gemeinde).split(',').map(g => g.trim())) : null;
}
function karteStyleFor(feature, hover) {
  const info = karteInfoFor(feature.properties.name);
  let key = 'keine';
  if (info.gezeigt) { const st = prozessSchrittFor(info.gezeigt); key = st.warn ? 'warn' : st.key; }
  const sel = karteAuswahlNamen();
  if (sel && !hover) {
    return sel.has(feature.properties.name)
      ? { fillColor: KARTE_FARBEN[key], fillOpacity: 1, color: '#14324f', weight: 3, dashArray: null }
      : { fillColor: KARTE_FARBEN[key], fillOpacity: 0.28, color: '#ffffff', weight: 1, dashArray: null };
  }
  return {
    fillColor: KARTE_FARBEN[key], fillOpacity: hover ? 1 : 0.9,
    color: hover ? '#14324f' : info.regionalRand ? '#34506b' : '#ffffff',
    weight: hover ? 2.5 : info.regionalRand ? 2 : 1, dashArray: info.regionalRand && !hover ? '5 3' : null
  };
}
function karteTooltipFor(name) {
  const info = karteInfoFor(name);
  const zeile = (p, label) => {
    const st = prozessSchrittFor(p);
    return '<div>' + label + ': ' + escapeHtml(p.typ === TYP_REGIONAL ? (p.regionName || p.name) : p.id) + ' · ' + escapeHtml(st.label) + (st.sub ? ' <span class="karte-tt-sub">(' + escapeHtml(st.sub) + ')</span>' : '') + '</div>';
  };
  let h = '<strong>' + escapeHtml(name) + '</strong>';
  if (karteFilter.kommunal && info.kom) h += zeile(info.kom, 'Kommunal');
  if (karteFilter.regional && info.reg) h += zeile(info.reg, 'Regional');
  h += info.gezeigt ? '<div class="karte-tt-sub">Klicken zum Öffnen</div>' : '<div class="karte-tt-sub">Keine Energieplanung angezeigt</div>';
  return h;
}
var karteHighlight = null;
var karteListeLayer = null;   // Hervorhebung beim Überfahren einer Zeile in der Planungsliste
// Hebt die Gemeinden einer Planung (bei regionalen Planungen alle Gemeinden der Region) auf der Karte leicht hervor
function karteHebeHervor(p) {
  karteHervorhebungEnde();
  if (!gemeindeLayer || !p) return;
  const namen = new Set(String(p.gemeinde).split(',').map(g => g.trim()));
  const feats = GEMEINDEGRENZEN_LUZERN.features.filter(f => namen.has(f.properties.name));
  if (!feats.length) return;
  karteListeLayer = L.geoJSON({ type: 'FeatureCollection', features: feats }, {
    interactive: false,
    style: { fillColor: '#ffffff', fillOpacity: 0.28, color: '#14324f', weight: 3, opacity: 0.9 }
  }).addTo(map);
}
// Zoomt auf die Gemeinde(n) einer Planung (bei regionalen Planungen auf die ganze Region)
function karteZoomAufPlanung(p) {
  if (!gemeindeLayer || !p || map.getSize().x === 0) return;
  const namen = new Set(String(p.gemeinde).split(',').map(g => g.trim()));
  const layers = [];
  gemeindeLayer.eachLayer(l => { if (namen.has(l.feature.properties.name)) layers.push(l); });
  if (!layers.length) return;
  map.fitBounds(L.featureGroup(layers).getBounds().pad(0.35), { padding: [24, 24], maxZoom: 12, animate: true });
}
function karteHervorhebungEnde() { if (karteListeLayer) { karteListeLayer.remove(); karteListeLayer = null; } }
function karteHighlightEntfernen() { if (karteHighlight) { karteHighlight.remove(); karteHighlight = null; } }
// Zoom je Rolle: auf alle Gemeinden (bzw. Regionen), auf die die angemeldete Person Zugriff hat. Admin: ganzer Kanton.
var karteZoomKey = null;
function karteZoomAufZugriff() {
  if (!gemeindeLayer || map.getSize().x === 0) return;   // Karte ausgeblendet: beim nächsten Rendern nachholen
  const namen = new Set();
  planungen.filter(planungDarfSehen).forEach(p => String(p.gemeinde).split(',').forEach(g => namen.add(g.trim())));
  const key = state.personaId + '|' + [...namen].sort().join(',');
  if (key === karteZoomKey) return;
  karteZoomKey = key;
  const layers = [];
  gemeindeLayer.eachLayer(l => { if (namen.has(l.feature.properties.name)) layers.push(l); });
  const bounds = layers.length ? L.featureGroup(layers).getBounds() : gemeindeLayer.getBounds();
    const alle = layers.length >= GEMEINDEGRENZEN_LUZERN.features.length || !layers.length;
  // Ganzer Kanton (Übersicht): so nah wie möglich, kaum Rand. Ausschnitte einzelner Gemeinden/Regionen: etwas Umgebung.
  if (alle) map.fitBounds(gemeindeLayer.getBounds(), { padding: [0, 0], animate: true });
  else map.fitBounds(bounds.pad(0.35), { padding: [24, 24], maxZoom: 12, animate: true });
}
var karteHatteAuswahl = false;
var karteMassnahmenLayer = null;
var karteMassId = null;          // zuletzt auf der Karte gewählte Massnahme (für Zoom beim Wechsel)
var karteAuswahlControl = null;  // Chip «Massnahme abwählen» auf der Karte
var karteUebersichtControl = null;  // Button «Übersicht anzeigen» auf der Karte (solange eine Energieplanung geöffnet ist)
// Zurück zur Übersicht: wie «Übersicht Energieplanungen» im Panel; die Karte zoomt dabei wieder auf alle Gemeinden mit Zugriff
function zurueckZurUebersicht() {
  state.view = 'list';
  render();
  const sc = document.querySelector('.panel-content'); if (sc) sc.scrollTop = 0;
}
// Massnahme abwählen: Detailfenster leeren, Karte ohne gewählte Massnahme
function massnahmeAbwaehlen() {
  state.massnahmeId = null;
  state.mdMode = null;
  renderPlanungDetail();
}
const karteMassFilter = { punkt: true, linie: true, flaeche: true };
const KARTE_MASS_FARBEN = { Geplant: '#5b6b7e', Umsetzung: '#e8710a', Abschluss: '#1f8f58' };
// Massnahmen der geöffneten Energieplanung (Punkte, Linien/Kurven, Flächen) auf der Karte; die gewählte Massnahme ist hervorgehoben
function updateMassnahmenKarte() {
  if (karteMassnahmenLayer) { karteMassnahmenLayer.remove(); karteMassnahmenLayer = null; }
  if (karteAuswahlControl) { karteAuswahlControl.remove(); karteAuswahlControl = null; }
  if (karteUebersichtControl) { karteUebersichtControl.remove(); karteUebersichtControl = null; }
  if (state.tab !== 'planungen' || state.view !== 'detail' || !state.planungId) { karteMassId = null; return; }
  const p = findPlanung(state.planungId);
  if (!p) { karteMassId = null; return; }
  karteUebersichtControl = L.control({ position: 'topright' });
  karteUebersichtControl.onAdd = () => {
    const d = L.DomUtil.create('div', 'karte-uebersicht');
    d.innerHTML = '<button type="button" title="Zurück zur Übersicht der Energieplanungen">← Übersicht anzeigen</button>';
    L.DomEvent.disableClickPropagation(d);
    d.querySelector('button').addEventListener('click', zurueckZurUebersicht);
    return d;
  };
  karteUebersichtControl.addTo(map);
  const gruppe = L.layerGroup();
  p.massnahmen.forEach(m => {
    const g = m.geometrie;
    if (!g || !g.geometry) return;
    const klasse = g.art === 'Punkt' ? 'punkt' : g.art === 'Fläche' ? 'flaeche' : 'linie';
    if (!karteMassFilter[klasse]) return;
    const farbe = KARTE_MASS_FARBEN[m.prozessstatus] || '#5b6b7e', gewaehlt = m.id === state.massnahmeId;
    const layer = L.geoJSON(g.geometry, {
      pane: 'massnahmenPane',
      pointToLayer: (f, ll) => L.circleMarker(ll, { pane: 'massnahmenPane', radius: gewaehlt ? 9 : 6, color: '#ffffff', weight: 2, fillColor: farbe, fillOpacity: 1 }),
      style: () => ({ color: gewaehlt ? '#14324f' : farbe, weight: gewaehlt ? 5 : 3, opacity: 1, fillColor: farbe, fillOpacity: gewaehlt ? 0.55 : 0.35 })
    });
    layer.bindTooltip('<strong>' + escapeHtml(m.name) + '</strong><div class="karte-tt-sub">' + escapeHtml(m.id + ' · ' + m.prozessstatus) + '</div>', { className: 'karte-tooltip', sticky: false });
    layer.on('click', () => { state.planungTab = 'massnahmen'; state.massnahmeId = m.id; state.mdMode = 'view'; renderPlanungDetail(); });
    layer.addTo(gruppe);
  });
  karteMassnahmenLayer = gruppe.addTo(map);

  // Gewählte Massnahme: bei Wechsel auf die Gemeinde der Massnahme zoomen; bei Abwahl bleibt der Zoom
  const sel = state.massnahmeId && state.mdMode !== 'new' ? findMassnahme(p, state.massnahmeId) : null;
  const selId = sel ? sel.id : null;
  if (selId !== karteMassId) {
    karteMassId = selId;
    if (sel && sel.geometrie && sel.geometrie.geometry && map.getSize().x > 0) {
      // Immer auf die Gemeindegrenze der Massnahme zoomen (einheitlicher Massstab, weder zu nah noch zu weit weg)
      const gl = []; gemeindeLayer.eachLayer(l => { if (l.feature.properties.name === sel.geometrie.gemeinde) gl.push(l); });
      if (gl.length) map.fitBounds(L.featureGroup(gl).getBounds(), { padding: [24, 24], animate: true });
      else karteZoomAufPlanung(p);
    }   // Abwahl: Zoom bleibt unverändert
  }
  if (sel && sel.geometrie && sel.geometrie.geometry) {
    karteAuswahlControl = L.control({ position: 'topright' });
    karteAuswahlControl.onAdd = () => {
      const d = L.DomUtil.create('div', 'karte-auswahl');
      d.innerHTML = '<button type="button" title="Auswahl aufheben">✕ ' + escapeHtml(sel.name) + ' abwählen</button>';
      L.DomEvent.disableClickPropagation(d);
      d.querySelector('button').addEventListener('click', massnahmeAbwaehlen);
      return d;
    };
    karteAuswahlControl.addTo(map);
  }
}
function updateGemeindeKarte() {
  if (!gemeindeLayer) return;
  // Zurück aus der Detailansicht (Übersicht Energieplanungen): wieder auf alle Gemeinden mit Zugriff herauszoomen
  const hatAuswahl = !!karteAuswahlNamen();
  if (karteHatteAuswahl && !hatAuswahl) karteZoomKey = null;
  karteHatteAuswahl = hatAuswahl;
  karteZoomAufZugriff();
  updateMassnahmenKarte();
  const sel = karteAuswahlNamen();
  gemeindeLayer.eachLayer(l => {
    l.setStyle(karteStyleFor(l.feature, false));
    l.setTooltipContent(karteTooltipFor(l.feature.properties.name));
    if (sel && sel.has(l.feature.properties.name)) l.bringToFront();
  });
}
function initGemeindeKarte() {
  if (typeof GEMEINDEGRENZEN_LUZERN === 'undefined') return;
  gemeindeLayer = L.geoJSON(GEMEINDEGRENZEN_LUZERN, {
    style: f => karteStyleFor(f, false),
    onEachFeature: (f, layer) => {
      const name = f.properties.name;
      layer.bindTooltip(karteTooltipFor(name), { sticky: false, className: 'karte-tooltip', direction: 'auto', offset: [0, -4], opacity: 1 });
      layer.on('mouseover', () => {
        karteHighlightEntfernen();
        karteHighlight = L.geoJSON(f, { interactive: false, style: () => karteStyleFor(f, true) }).addTo(map);
      });
      layer.on('mouseout', () => { karteHighlightEntfernen(); });
      layer.on('click', () => {
        const p = karteInfoFor(name).gezeigt;
        karteHighlightEntfernen(); layer.closeTooltip();
        if (!p) { toast('Für ' + name + ' wird unter dem aktuellen Filter keine Energieplanung angezeigt.'); return; }
        state.tab = 'planungen';
        setActiveTabButton('planungen');
        if (state.layoutMode === 'map') { const b = document.querySelector('#view-toggle [data-view-mode="split"]'); if (b) b.click(); }
        openPlanung(p.id);
      });
    }
  }).addTo(map);
  map.on('movestart zoomstart', () => { karteHighlightEntfernen(); gemeindeLayer.eachLayer(l => l.closeTooltip()); });
  map.fitBounds(gemeindeLayer.getBounds(), { padding: [12, 12] });
  map.setMaxBounds(gemeindeLayer.getBounds().pad(0.4));
  // Legende
  const legende = L.control({ position: 'bottomleft' });
  legende.onAdd = () => {
    const d = L.DomUtil.create('div', 'karte-legende');
    d.innerHTML = '<div class="karte-legende-titel">Prozessstand</div>' + KARTE_LEGENDE.map(([k, t]) => '<div class="karte-legende-row"><i style="background:' + KARTE_FARBEN[k] + '"></i>' + t + '</div>').join('');
    return d;
  };
  legende.addTo(map);
}
initGemeindeKarte();
// «schliessen» minimiert den Karteninhalt auf seine Kopfzeile; erneuter Klick (Kopfzeile oder Button) öffnet ihn wieder
function toggleKarteninhalt() {
  const sb = document.querySelector('.map-sidebar');
  const min = sb.classList.toggle('minimized');
  const btn = sb.querySelector('.sidebar-close-tab');
  if (btn) btn.textContent = min ? '⌂ öffnen' : '⌂ schliessen';
  const ch = sb.querySelector('.sidebar-panel-header .chevron');
  if (ch) ch.textContent = min ? '+' : '−';
}
document.querySelector('.sidebar-close-tab').addEventListener('click', toggleKarteninhalt);
document.querySelector('.sidebar-panel-header').addEventListener('click', toggleKarteninhalt);
toggleKarteninhalt();   // Standard: zugeklappt
// Filter «Kommunale / Regionale Energieplanungen» im Karteninhalt
document.querySelectorAll('[data-karte-mass]').forEach(cb => cb.addEventListener('change', () => {
  karteMassFilter[cb.dataset.karteMass] = cb.checked;
  updateMassnahmenKarte();
}));
document.querySelectorAll('[data-karte-filter]').forEach(cb => cb.addEventListener('change', () => {
  karteFilter[cb.dataset.karteFilter] = cb.checked;
  updateGemeindeKarte();
}));

/* ---------------------- URL-ZUSTAND (Reload / Browser-Zurück behalten die aktuelle Ansicht) ---------------------- */
// Der Ansichts-Zustand steckt im URL-Hash, z.B. #tab=planungen&view=detail&planung=EP-844&ptab=epa&mass=M-3
function stateToHash() {
  const q = new URLSearchParams();
  q.set('tab', state.tab);
  if (state.tab === 'planungen' && state.view === 'detail' && state.planungId) {
    q.set('view', 'detail');
    q.set('planung', state.planungId);
    q.set('ptab', state.planungTab);
    if (state.planungTab === 'massnahmen' && state.massnahmeId && state.mdMode !== 'new') q.set('mass', state.massnahmeId);
  }
  if (state.tab === 'kontakte' && state.view === 'contactForm') {
    q.set('view', 'contact');
    if (state.contactIndex != null) q.set('contact', state.contactIndex);
  }
  if (state.tab === 'reporting' && state.reportView) q.set('report', state.reportView);
  if (state.layoutMode !== 'split') q.set('layout', state.layoutMode);
  if (state.personaId !== 'admin') q.set('user', state.personaId);
  return '#' + q.toString();
}
function applyHashToState(hash) {
  const q = new URLSearchParams(String(hash || '').replace(/^#/, ''));
  const tab = q.get('tab');
  state.tab = ['planungen', 'kontakte', 'reporting', 'zugriff'].includes(tab) ? tab : 'planungen';
  state.view = 'list';
  state.planungId = null; state.massnahmeId = null; state.mdMode = null; state.contactIndex = null; state.reportView = null;
  state.planungDetailsMode = 'view'; state.planungKontrolleMode = 'view'; state.planungPendingStatus = null; state.nfKontoHinweis = false;
  const pe = q.get('user') ? rollenPersonas().find(x => x.id === q.get('user')) : null;
  state.personaId = pe ? pe.id : 'admin'; state.role = pe ? pe.role : 'Admin'; state.benutzer = pe ? pe.key : null;
  if (['map', 'split', 'data'].includes(q.get('layout'))) state.layoutMode = q.get('layout'); else state.layoutMode = 'split';

  if (state.tab === 'planungen' && q.get('view') === 'detail') {
    const p = findPlanung(q.get('planung'));
    if (p) {
      state.view = 'detail';
      state.planungId = p.id;
      const ptab = q.get('ptab');
      state.planungTab = ['grunddaten', 'epa', 'massnahmen', 'konto', 'nachfuehrung', 'kontrolle'].includes(ptab) ? ptab : 'grunddaten';
      const m = q.get('mass') && findMassnahme(p, q.get('mass'));
      if (m && state.planungTab === 'massnahmen') { state.massnahmeId = m.id; state.mdMode = 'view'; }
    }
  } else if (state.tab === 'kontakte' && q.get('view') === 'contact') {
    const idx = q.get('contact');
    if (idx === null) { state.view = 'contactForm'; }
    else if (contacts[Number(idx)]) { state.view = 'contactForm'; state.contactIndex = Number(idx); }
  } else if (state.tab === 'reporting' && q.get('report')) {
    state.reportView = q.get('report');
  }
}
function syncUiToState() {
  setActiveTabButton(state.tab);
  updateAvatar();
  document.querySelectorAll('#view-toggle [data-view-mode]').forEach(b => b.classList.toggle('active', b.dataset.viewMode === state.layoutMode));
  $appBody.className = `app-body mode-${state.layoutMode}`;
  $sidePanel.style.width = state.layoutMode === 'split' ? `${panelWidth}px` : '';
  setTimeout(() => map.invalidateSize(), 0);
}
let urlReady = false;   // erst nach dem Laden aller Daten (initApp) in die URL schreiben
function pushUrlState() {
  if (!urlReady) return;
  const h = stateToHash();
  if (h !== location.hash) history.pushState(null, '', h);
}
window.addEventListener('popstate', () => { applyHashToState(location.hash); syncUiToState(); render(); });
// Jede Änderung des Datenpanels (Navigation, Tab-Wechsel, Auswahl) und der Layout-Umschalter aktualisiert die URL.
new MutationObserver(pushUrlState).observe($panel, { childList: true });
document.querySelectorAll('#view-toggle [data-view-mode]').forEach(b => b.addEventListener('click', () => setTimeout(pushUrlState, 0)));

/* ---------------------- INIT ---------------------- */
// Wird von index.html aufgerufen, nachdem alle Daten-Skripte (Kontakte, Planungen, Masterplan) geladen sind.
function initApp() {
  applyHashToState(location.hash);
  syncUiToState();
  render();
  history.replaceState(null, '', stateToHash());
  urlReady = true;
}
