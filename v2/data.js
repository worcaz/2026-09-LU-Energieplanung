/* =============================================================
   Energieplanung v2 — Datenmodell, Prozesslogik und Dummy-Daten
   (rein clientseitig, keine Persistenz)
   ============================================================= */

/* ---------------------- ZUFALL (reproduzierbar) ---------------------- */
// Seeded RNG, damit die Demo-Daten bei jedem Neuladen gleich aussehen.
let rngState = 20261001;
function rand() {
  rngState = (rngState + 0x6D2B79F5) | 0;
  let t = Math.imul(rngState ^ (rngState >>> 15), 1 | rngState);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function randomInt(min, max) { return Math.floor(rand() * (max - min + 1)) + min; }
function pick(arr) { return arr[randomInt(0, arr.length - 1)]; }
function chance(p) { return rand() < p; }
function weightedPick(entries) {
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = rand() * total;
  for (const [value, w] of entries) { if ((r -= w) < 0) return value; }
  return entries[entries.length - 1][0];
}

/* ---------------------- DATUM ---------------------- */
function pad2(n) { return String(n).padStart(2, '0'); }
const TODAY = new Date(); TODAY.setHours(0, 0, 0, 0);
function toIso(d) { return d ? `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}` : ''; }
function fromIso(s) {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  return y && m && d ? new Date(y, m - 1, d) : null;
}
function todayIso() { return toIso(TODAY); }
function fmtDate(s) { const d = fromIso(s); return d ? `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}` : ''; }
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function addMonths(d, n) { const x = new Date(d); x.setMonth(x.getMonth() + n); return x; }
function addYears(d, n) { const x = new Date(d); x.setFullYear(x.getFullYear() + n); return x; }
function daysBetween(a, b) { return Math.round((b - a) / 86400000); }
function yearsAgo(min, max) { return addDays(TODAY, -randomInt(Math.round(min * 365), Math.round(max * 365))); }
function notAfterToday(d) { return d > TODAY ? addDays(TODAY, -randomInt(1, 14)) : d; }
function formatChf(n) {
  if (n === '' || n === null || n === undefined || Number.isNaN(Number(n))) return '';
  return `CHF ${String(Math.round(Number(n))).replace(/\B(?=(\d{3})+(?!\d))/g, "'")}`;
}

/* ---------------------- PROZESS-KONSTANTEN ---------------------- */
const NACHFUEHRUNG_INTERVALL_JAHRE = 4;
const NACHFUEHRUNG_ENDE_JAHR = 2050;
const NACHFUEHRUNG_VORLAUF_MONATE = 6;

const EPA_STUFEN = ['Entwurf', 'Verabschiedung', 'Fördergesuch', 'Abschluss'];
// Unterlagen zum Fördergesuch: das unterschriebene Formular und die fünf Beilagen gemäss Förderabschlussformular.
const EPA_DOKUMENTE = [
  { key: 'formular', label: 'Unterschriebenes Förderabschlussformular', pflicht: true, accept: '.pdf,application/pdf', hint: 'PDF mit den Unterschriften der EPA-Beraterin / des EPA-Beraters und des Gemeinderats.' },
  { key: 'kickoff', label: 'Kick-Off Präsentation', pflicht: true },
  { key: 'abschlusspraesentation', label: 'Abschlusspräsentation', pflicht: true },
  { key: 'checkliste', label: 'Beratungscheckliste', pflicht: false, hint: 'Für zertifizierte Energiestädte optional.' },
  { key: 'feedback', label: 'Ausgefülltes Feedbackformular', pflicht: true },
  { key: 'rechnung', label: 'Kopie Rechnung Beratungsbüro', pflicht: true },
];
const PLANUNGSTYPEN = ['Kommunale Energieplanung', 'Regionale Energieplanung'];

const MASSNAHME_STATUS = [
  { id: 'Geplant', hint: 'Noch nicht begonnen', offen: true },
  { id: 'In Umsetzung', hint: 'Arbeiten laufen', offen: true },
  { id: 'Sistiert', hint: 'Vorübergehend zurückgestellt', offen: true },
  { id: 'Erledigt', hint: 'Vollständig umgesetzt', offen: false },
  { id: 'Gestrichen', hint: 'Wird nicht umgesetzt', offen: false },
];
function istOffen(m) { return m.status !== 'Erledigt' && m.status !== 'Gestrichen'; }
function statusSlug(s) { return String(s).toLowerCase().replace(/\s+/g, '-'); }

const HANDLUNGSFELDER = ['Übergeordnete Massnahmen / Strategien', 'Wärme- und Kälteversorgung', 'Energieeffizienz', 'Ausbaupfad erneuerbare Energien', 'andere'];
const AKTIVITAETSBEREICHE = ['Strategie / Planung', 'Information', 'Beratung', 'Förderung', 'Vorschrift', 'Vollzug', 'Vorbildfunktion'];
const PRIORITAETEN = ['Hoch', 'Mittel', 'Tief'];

const MASSNAHME_VORLAGEN = {
  'Übergeordnete Massnahmen / Strategien': [
    { name: 'Energieleitbild der Gemeinde', beschreibung: 'Erarbeitung eines übergeordneten Energie- und Klimaleitbilds für die Gemeinde.' },
    { name: 'Energieapéro für die Bevölkerung', beschreibung: 'Durchführung jährlicher Informationsanlässe zu Energiethemen.' },
    { name: 'Schulprojekt Energie und Klima', beschreibung: 'Sensibilisierungsprojekt an der Volksschule zum Thema Energie und Klima.' },
    { name: 'Controlling Energieplanung', beschreibung: 'Jährliches Monitoring der Umsetzung der Energieplanungsmassnahmen.' }
  ],
  'Wärme- und Kälteversorgung': [
    { name: 'Fernwärmeverbund Zentrum', beschreibung: 'Ausbau des Fernwärmenetzes im Ortszentrum zur Ablösung fossiler Heizsysteme.' },
    { name: 'Wärmeverbund Schulanlage', beschreibung: 'Realisierung eines Wärmeverbunds für die Schulanlage und angrenzende Liegenschaften.' },
    { name: 'Abwärmenutzung ARA', beschreibung: 'Nutzung der Abwärme der Abwasserreinigungsanlage für ein lokales Wärmenetz.' },
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
    { name: 'Potenzialstudie Biomasse', beschreibung: 'Abklärung des lokalen Potenzials zur energetischen Nutzung von Biomasse.' },
    { name: 'Kleinwasserkraft Gemeindebach', beschreibung: 'Prüfung der Realisierbarkeit eines Kleinwasserkraftwerks am Gemeindebach.' }
  ],
  'andere': [
    { name: 'Ausbau Ladeinfrastruktur', beschreibung: 'Errichtung öffentlicher Ladestationen für Elektrofahrzeuge.' },
    { name: 'Förderung Langsamverkehr', beschreibung: 'Ausbau von Velowegen und Fussgängerzonen im Gemeindegebiet.' },
    { name: 'Elektrifizierung Gemeindefahrzeuge', beschreibung: 'Ersatz des kommunalen Fuhrparks durch Elektrofahrzeuge.' },
    { name: 'GEAK-Kampagne', beschreibung: 'Sensibilisierungskampagne zum Gebäudeenergieausweis der Kantone (GEAK).' }
  ]
};

const NETTO_NULL_ZIELE = [
  'Netto-null Treibhausgasemissionen bis spätestens 2050 erreichen.',
  'Klimaneutrale Gemeindeverwaltung bis 2040 anstreben.',
  'Fossilfreie Wärmeversorgung im ganzen Gemeindegebiet bis 2045.',
  'CO2-Neutralität der öffentlichen Gebäude bis 2035.'
];
const ENERGIEEFFIZIENZ_ZIELE = [
  'Senkung des Energieverbrauchs pro Kopf um 30 % bis 2035.',
  'Sanierungsrate der Gebäude auf 2 % pro Jahr erhöhen.',
  'Reduktion des Wärmebedarfs im Gebäudepark um 25 %.',
  'Minergie-Standard bei allen Neubauten verbindlich vorschreiben.'
];
const STROMPRODUKTION_ZIELE = [
  'Ausbau der Photovoltaik auf 50 % des Strombedarfs bis 2040.',
  'Verdopplung der lokalen Solarstromproduktion bis 2030.',
  'Eigenversorgungsgrad mit erneuerbarem Strom auf 40 % steigern.',
  'Ausbau erneuerbarer Stromproduktion um 5 GWh bis 2035.'
];

const BEMERKUNGEN = {
  'Geplant': [
    'Start für nächstes Jahr vorgesehen, Budget beantragt.',
    'Noch nicht gestartet, abhängig vom Legislaturprogramm.',
    'Vorabklärungen laufen, Umsetzung ab übernächstem Jahr.'
  ],
  'In Umsetzung': [
    'Vorprojekt abgeschlossen, Bauprojekt in Ausarbeitung.',
    'Rund die Hälfte umgesetzt, Rest folgt gestaffelt.',
    'Kredit vom Gemeinderat gesprochen, Ausschreibung läuft.',
    'Erste Etappe realisiert, zweite Etappe in Planung.'
  ],
  'Sistiert': [
    'Wegen laufender Ortsplanungsrevision zurückgestellt.',
    'Mangels personeller Ressourcen vorübergehend sistiert.',
    'Abhängig von regionalem Projekt, das sich verzögert.'
  ],
  'Erledigt': [
    'Abgeschlossen, Anlage seit Frühling in Betrieb.',
    'Vollständig umgesetzt und abgerechnet.',
    'Umgesetzt, Wirkung wird im Energiebericht ausgewiesen.'
  ],
  'Gestrichen': [
    'Nach Machbarkeitsstudie nicht weiterverfolgt.',
    'Durch regionales Projekt ersetzt.',
    'Kosten-Nutzen-Verhältnis ungenügend, verworfen.'
  ]
};

const EPA_KOMMENTARE = [
  '', '', '', '', '', '', '',
  'EPA vorgelagert zum ES-Prozess.',
  'Gemeinde möchte vorwärts machen.',
  'Nachgelagert an EPA wird eine räumliche Energieplanung erarbeitet.',
  'Rezertifizierung Energiestadt wird aufs nächste Jahr verschoben.'
];

/* ---------------------- KONTAKTE ---------------------- */
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
function formatContactLabel(c) { return c.organisation ? `${c.vorname} ${c.nachname} (${c.organisation})` : `${c.vorname} ${c.nachname}`; }
// Demo-Login: die angemeldete Beraterin betreut nur eine Handvoll Gemeinden.
const ANGEMELDETER_BERATER = 'Sabine Grüter (Grüter Elektroplanung AG)';
const MEINE_GEMEINDEN = ['Buchrain', 'Kriens', 'Aesch', 'Horw', 'Alberswil', 'Sursee', 'Emmen',
  'Meggen', 'Ebikon', 'Hochdorf', 'Rothenburg', 'Malters', 'Willisau', 'Schüpfheim', 'Root', 'Ruswil'];
const BERATER_POOL = contacts.filter(c => !c.gemeindeKontakt).map(formatContactLabel).filter(b => b !== ANGEMELDETER_BERATER);

const GEMEINDE_VORNAMEN = ['Priska', 'Urs', 'Monika', 'Beat', 'Claudia', 'Werner', 'Silvia', 'Peter', 'Karin', 'Fabian'];
const GEMEINDE_NACHNAMEN = ['Steiner', 'Bucher', 'Wicki', 'Bühler', 'Kaufmann', 'Bättig', 'Lustenberger', 'Schwegler', 'Hodel', 'Zimmermann'];
function verantwortlichePersonGemeinde(gemeinde) {
  if (gemeinde === 'Buchrain') return 'Hans Muster (Buchrain)';
  let h = 0;
  for (let i = 0; i < gemeinde.length; i++) h = (h * 31 + gemeinde.charCodeAt(i)) >>> 0;
  return `${GEMEINDE_VORNAMEN[h % 10]} ${GEMEINDE_NACHNAMEN[Math.floor(h / 10) % 10]} (${gemeinde})`;
}

/* ---------------------- FACTORIES ---------------------- */
let nextPlanungSeq = 900;
let nextMassnahmeSeq = 1000;
let nextNachfuehrungSeq = 1;

function neuePlanung({ gemeinde, typ, jahr }) {
  return {
    id: `EP-${nextPlanungSeq++}`,
    gemeinde: gemeinde || '',
    typ: typ || PLANUNGSTYPEN[0],
    jahr: jahr || TODAY.getFullYear(),
    verantwortlichGemeinde: '',
    berater: '',
    ziele: { nettoNull: '', effizienz: '', strom: '' },
    erfasstAm: todayIso(),
    epa: {
      status: '',                      // '' = nicht gestartet | Entwurf | Verabschiedung | Fördergesuch | Abschluss
      beratungsperson: '', beratungsbeginn: '',
      bedarfEnergierichtplan: '', bedarfKoordination: '', gebieteKoordination: '',
      verabschiedetAm: '',
      konto: { inhaber: '', adresse: '', iban: '', bank: '', vermerk: '204071003 Kommunale Energieplanung' },
      dokumente: {},                   // { <EPA_DOKUMENTE.key>: { name, size, datum, url } }
      gesuchEingereichtAm: '',
      abgeschlossenAm: ''
    },
    controlling: { gesuchseingang: '', gesuchsNr: '', auszahlungsbetrag: '', energiestadt: '', kommentar: '' },
    massnahmen: [],
    nachfuehrungen: [],            // abgeschlossene Nachführungen
    laufendeNachfuehrung: null      // { faelligAm, gestartetAm, zuPruefen: [ids], geprueft: [ids], neu: [ids] }
  };
}

function neueMassnahme(data) {
  return Object.assign({
    id: `M-${nextMassnahmeSeq++}`,
    esNr: '', name: '', beschreibung: '',
    handlungsfeld: '', aktivitaetsbereich: '', prioritaet: '', umsetzungszeitraum: '',
    budget: '', verantwortlichkeit: '',
    status: 'Geplant', weiterfuehren: 'Ja', bemerkung: '',
    ausEpa: 'Ja', erfasstAm: todayIso(),
    pruefungen: []                  // [{ datum, status, weiterfuehren, bemerkung, art: 'Nachführung'|'Neu erfasst', nachfuehrung }]
  }, data || {});
}

/* ---------------------- PFLICHTANGABEN JE SCHRITT ---------------------- */
// Jede Liste: [Feld-ID im Formular, Label, Getter]
const PFLICHT_STAMMDATEN = [
  ['f-gemeinde', 'Gemeinde', p => p.gemeinde],
  ['f-typ', 'Planungstyp', p => p.typ],
  ['f-jahr', 'Jahr', p => p.jahr],
  ['f-verantwortlich', 'Verantwortliche Person der Gemeinde', p => p.verantwortlichGemeinde],
  ['f-berater', 'Berater/in Energieplanung', p => p.berater],
];
const PFLICHT_EPA = {
  'Entwurf': [
    ['f-beratungsperson', 'Beratungsperson', p => p.epa.beratungsperson],
    ['f-beratungsbeginn', 'Datum Beratungsbeginn', p => p.epa.beratungsbeginn],
    ['f-energierichtplan', 'Bedarf eines Energierichtplans?', p => p.epa.bedarfEnergierichtplan],
    ['f-koordination', 'Bedarf einer Koordination mit weiteren Gemeinden?', p => p.epa.bedarfKoordination],
    ['f-gebiete', 'Gebiete mit Koordinationsbedarf vorhanden?', p => p.epa.gebieteKoordination],
  ],
  'Verabschiedung': [
    ['f-verabschiedet', 'Datum der Verabschiedung durch den Gemeinderat', p => p.epa.verabschiedetAm],
  ],
  'Fördergesuch': [
    ['f-k-inhaber', 'Kontoinhaber/in', p => p.epa.konto.inhaber],
    ['f-k-adresse', 'Adresse', p => p.epa.konto.adresse],
    ['f-k-iban', 'IBAN', p => p.epa.konto.iban],
    ['f-k-bank', 'Bankname', p => p.epa.konto.bank],
    ...EPA_DOKUMENTE.filter(d => d.pflicht).map(d => [`f-d-${d.key}`, d.label, p => (p.epa.dokumente[d.key] ? 'ok' : '')]),
  ],
};
const PFLICHT_CONTROLLING = [
  ['f-c-eingang', 'Gesuchseingang', p => p.controlling.gesuchseingang],
  ['f-c-betrag', 'Auszahlungsbetrag', p => p.controlling.auszahlungsbetrag],
  ['f-c-energiestadt', 'Energiestadt', p => p.controlling.energiestadt],
];
function fehlend(liste, p) { return liste.filter(([, , get]) => { const v = get(p); return v === '' || v === null || v === undefined; }); }

/* ---------------------- PROZESS-ABLEITUNGEN ---------------------- */
function phaseOf(p) {
  if (p.epa.status === 'Abschluss') return 'nachfuehrung';
  if (p.epa.status === 'Fördergesuch' && p.epa.gesuchEingereichtAm) return 'foerderung';
  if (p.epa.status) return 'epa';
  return 'erfassung';
}
const PHASEN = {
  erfassung: { label: 'Erfassung', nr: 1 },
  epa: { label: 'EPA-Beratung', nr: 2 },
  foerderung: { label: 'Förderung', nr: 3 },
  nachfuehrung: { label: 'Nachführung', nr: 4 },
};

// Basisdatum für den 4-Jahres-Rhythmus: letzte abgeschlossene Nachführung, sonst Abschluss der EPA-Beratung.
function nachfuehrungBasis(p) {
  const last = p.nachfuehrungen[p.nachfuehrungen.length - 1];
  return fromIso(last ? last.abgeschlossenAm : p.epa.abgeschlossenAm);
}
// Fälligkeitsdatum der nächsten Nachführung (Date) oder null, wenn keine (weitere) Nachführung ansteht.
function naechsteNachfuehrung(p) {
  if (p.epa.status !== 'Abschluss') return null;
  if (p.laufendeNachfuehrung) return fromIso(p.laufendeNachfuehrung.faelligAm);
  const basis = nachfuehrungBasis(p);
  if (!basis) return null;
  const due = addYears(basis, NACHFUEHRUNG_INTERVALL_JAHRE);
  return due.getFullYear() > NACHFUEHRUNG_ENDE_JAHR ? null : due;
}
// 'faellig' | 'bald' | 'ok' | 'ende' | null (noch nicht in der Nachführungsphase)
function nachfuehrungStatus(p) {
  if (p.epa.status !== 'Abschluss') return null;
  const due = naechsteNachfuehrung(p);
  if (!due) return 'ende';
  if (TODAY >= due) return 'faellig';
  if (TODAY >= addMonths(due, -NACHFUEHRUNG_VORLAUF_MONATE)) return 'bald';
  return 'ok';
}
// Geplante Nachführungstermine (Jahre) ab der nächsten bis 2050 — für die Zeitleiste.
function kuenftigeNachfuehrungsJahre(p) {
  const due = naechsteNachfuehrung(p);
  const jahre = [];
  if (!due) return jahre;
  for (let d = due; d.getFullYear() <= NACHFUEHRUNG_ENDE_JAHR; d = addYears(d, NACHFUEHRUNG_INTERVALL_JAHRE)) jahre.push(d.getFullYear());
  return jahre;
}

function letztePruefung(m) { return m.pruefungen[m.pruefungen.length - 1] || null; }
// Nächste Überprüfung einer einzelnen Massnahme: 4 Jahre nach der letzten Überprüfung (sofern noch offen).
function naechstePruefungMassnahme(p, m) {
  if (!istOffen(m) || p.epa.status !== 'Abschluss') return null;
  const last = letztePruefung(m);
  if (last) {
    const d = addYears(fromIso(last.datum), NACHFUEHRUNG_INTERVALL_JAHRE);
    return d.getFullYear() > NACHFUEHRUNG_ENDE_JAHR ? null : d;
  }
  return naechsteNachfuehrung(p);
}

/* ---------------------- NÄCHSTER SCHRITT (Kern der Benutzerführung) ---------------------- */
// Liefert für eine Planung, was als Nächstes zu tun ist und wer zuständig ist.
// art: 'aufgabe' (jemand muss handeln) | 'info' (bald fällig) | 'ok' (nichts zu tun)
function naechsteAktion(p) {
  const fehlStamm = fehlend(PFLICHT_STAMMDATEN, p);
  const e = p.epa;
  if (!e.status) {
    if (fehlStamm.length) return {
      key: 'stammdaten', art: 'aufgabe', wer: 'Berater', tab: 'energieplanung', cta: 'Angaben ergänzen',
      titel: 'Energieplanung vervollständigen',
      text: `Bevor die EPA-Beratung starten kann, fehlen noch: ${fehlStamm.map(f => f[1]).join(', ')}.`
    };
    return {
      key: 'epa-start', art: 'aufgabe', wer: 'Berater', tab: 'epa', cta: 'EPA-Beratung starten',
      titel: 'EPA-Beratung starten',
      text: 'Die Grunddaten sind vollständig. Starten Sie jetzt die EPA-Beratung mit der Gemeinde.'
    };
  }
  if (e.status === 'Entwurf') return {
    key: 'entwurf', art: 'aufgabe', wer: 'Berater', tab: 'epa', cta: 'Entwurf bearbeiten',
    titel: 'Entwurf der EPA-Beratung fertigstellen',
    text: 'Beratung durchführen, Bedarf klären und die Massnahmen erfassen. Danach geht die Planung zur Verabschiedung an den Gemeinderat.'
  };
  if (e.status === 'Verabschiedung') return {
    key: 'verabschiedung', art: 'aufgabe', wer: 'Berater', tab: 'epa', cta: 'Verabschiedung erfassen',
    titel: 'Verabschiedung durch den Gemeinderat erfassen',
    text: 'Sobald der Gemeinderat die Energieplanung verabschiedet hat, erfassen Sie das Datum des Beschlusses.'
  };
  if (e.status === 'Fördergesuch' && !e.gesuchEingereichtAm) return {
    key: 'foerdergesuch', art: 'aufgabe', wer: 'Berater', tab: 'epa', cta: 'Fördergesuch einreichen',
    titel: 'Fördergesuch einreichen',
    text: 'Erfassen Sie die Kontoangaben der Gemeinde, laden Sie das unterschriebene Förderabschlussformular samt Beilagen hoch und reichen Sie das Gesuch beim Kanton ein.'
  };
  if (e.status === 'Fördergesuch') {
    const fehlCtrl = fehlend(PFLICHT_CONTROLLING, p);
    if (fehlCtrl.length) return {
      key: 'controlling', art: 'aufgabe', wer: 'Controller', tab: 'foerderung', cta: 'Gesuch prüfen',
      titel: 'Fördergesuch prüfen und Auszahlung erfassen',
      text: `Gesuch eingereicht am ${fmtDate(e.gesuchEingereichtAm)}. Erfassen Sie Gesuchseingang, Auszahlungsbetrag und Energiestadt-Status.`,
      termin: e.gesuchEingereichtAm
    };
    return {
      key: 'abschluss', art: 'aufgabe', wer: 'Controller', tab: 'foerderung', cta: 'Beratung abschliessen',
      titel: 'EPA-Beratung abschliessen',
      text: 'Die Angaben zum Fördergesuch sind vollständig. Schliessen Sie die Beratung ab – damit startet der 4-jährige Nachführungsrhythmus.'
    };
  }
  // Abschluss → Nachführungsphase
  const lauf = p.laufendeNachfuehrung;
  if (lauf) {
    const offen = lauf.zuPruefen.filter(id => !lauf.geprueft.includes(id)).length;
    return {
      key: 'nachfuehrung-laufend', art: 'aufgabe', wer: 'Berater', tab: 'nachfuehrung',
      cta: offen ? 'Nachführung fortsetzen' : 'Nachführung abschliessen',
      titel: `Nachführung ${fromIso(lauf.faelligAm).getFullYear()} ${offen ? 'fortsetzen' : 'abschliessen'}`,
      text: offen ? `Noch ${offen} von ${lauf.zuPruefen.length} Massnahmen zu überprüfen.` : 'Alle Massnahmen sind überprüft – die Nachführung muss nur noch abgeschlossen werden.',
      termin: lauf.faelligAm
    };
  }
  const st = nachfuehrungStatus(p);
  const due = naechsteNachfuehrung(p);
  const offeneM = p.massnahmen.filter(istOffen).length;
  if (st === 'faellig') return {
    key: 'nachfuehrung-faellig', art: 'aufgabe', wer: 'Berater', tab: 'nachfuehrung', cta: 'Nachführung starten',
    titel: `Nachführung ${due.getFullYear()} ist fällig`,
    text: `Seit ${fmtDate(toIso(due))} fällig: ${offeneM} offene Massnahme${offeneM === 1 ? '' : 'n'} überprüfen und den aktuellen Stand festhalten.`,
    termin: toIso(due)
  };
  if (st === 'bald') return {
    key: 'nachfuehrung-bald', art: 'info', wer: 'Berater', tab: 'nachfuehrung', cta: 'Nachführung ansehen',
    titel: `Nachführung ${due.getFullYear()} steht bald an`,
    text: `Fällig am ${fmtDate(toIso(due))}. Sie können die Überprüfung bereits jetzt vorbereiten.`,
    termin: toIso(due)
  };
  if (st === 'ok') return {
    key: 'ok', art: 'ok', wer: 'Berater', tab: 'epa',
    titel: 'Aktuell nichts zu tun',
    text: `Die nächste Nachführung ist am ${fmtDate(toIso(due))} fällig. Bis dahin können Sie Massnahmen jederzeit aktualisieren.`,
    termin: toIso(due)
  };
  return {
    key: 'ende', art: 'ok', wer: 'Berater', tab: 'nachfuehrung',
    titel: `Nachführung bis ${NACHFUEHRUNG_ENDE_JAHR} abgeschlossen`,
    text: `Es sind keine weiteren Nachführungen vor ${NACHFUEHRUNG_ENDE_JAHR + 1} vorgesehen.`
  };
}

/* ---------------------- NACHFÜHRUNG: AKTIONEN ---------------------- */
function starteNachfuehrung(p) {
  const due = naechsteNachfuehrung(p) || TODAY;
  p.laufendeNachfuehrung = {
    faelligAm: toIso(due),
    gestartetAm: todayIso(),
    zuPruefen: p.massnahmen.filter(istOffen).map(m => m.id),
    geprueft: [],
    neu: []
  };
}
function pruefeMassnahme(p, m, { status, weiterfuehren, bemerkung }, datum) {
  const lauf = p.laufendeNachfuehrung;
  const label = lauf ? `Nachführung ${fromIso(lauf.faelligAm).getFullYear()}` : 'Nachführung';
  m.status = status;
  m.weiterfuehren = weiterfuehren;
  m.bemerkung = bemerkung;
  const eintrag = { datum: datum || todayIso(), status, weiterfuehren, bemerkung, art: 'Nachführung', nachfuehrung: label };
  // Wurde die Massnahme in derselben Nachführung schon überprüft, wird der Eintrag ersetzt statt verdoppelt.
  const last = letztePruefung(m);
  if (lauf && last && last.nachfuehrung === label && lauf.geprueft.includes(m.id)) m.pruefungen[m.pruefungen.length - 1] = eintrag;
  else m.pruefungen.push(eintrag);
  if (lauf && !lauf.geprueft.includes(m.id)) lauf.geprueft.push(m.id);
}
function schliesseNachfuehrungAb(p, datum) {
  const lauf = p.laufendeNachfuehrung;
  const ids = lauf.zuPruefen.concat(lauf.neu);
  const betroffen = p.massnahmen.filter(m => ids.includes(m.id));
  const zaehle = s => betroffen.filter(m => m.status === s).length;
  p.nachfuehrungen.push({
    id: `NF-${nextNachfuehrungSeq++}`,
    jahr: fromIso(lauf.faelligAm).getFullYear(),
    faelligAm: lauf.faelligAm,
    gestartetAm: lauf.gestartetAm,
    abgeschlossenAm: datum || todayIso(),
    geprueft: lauf.geprueft.length,
    neu: lauf.neu.length,
    erledigt: zaehle('Erledigt'),
    sistiert: zaehle('Sistiert'),
    gestrichen: zaehle('Gestrichen'),
    weitergefuehrt: betroffen.filter(m => istOffen(m) && m.weiterfuehren === 'Ja').length
  });
  p.laufendeNachfuehrung = null;
}

/* ---------------------- DEMO-DATEN ---------------------- */
const SZENARIO_REIHENFOLGE = ['erfassung', 'epa-bereit', 'entwurf', 'verabschiedung', 'foerdergesuch', 'eingereicht', 'geprueft', 'abgeschlossen', 'bald', 'faellig', 'nachgefuehrt'];
const SZENARIO_GEWICHTE = [
  ['erfassung', 7], ['epa-bereit', 5], ['entwurf', 11], ['verabschiedung', 8], ['foerdergesuch', 5],
  ['eingereicht', 7], ['geprueft', 3], ['abgeschlossen', 28], ['faellig', 12], ['nachgefuehrt', 14],
];
// Feste Szenarien für gut demonstrierbare Gemeinden.
const SZENARIO_FIX = {
  Buchrain: 'faellig', Kriens: 'faellig', Adligenswil: 'eingereicht', Ballwil: 'geprueft',
  Aesch: 'entwurf', Horw: 'verabschiedung', Alberswil: 'erfassung', Emmen: 'nachgefuehrt', Sursee: 'abgeschlossen',
  // Zusätzliche Demo-Aufgaben für die Beraterin (alle Aufgabentypen abgedeckt)
  Meggen: 'epa-bereit', Ebikon: 'foerdergesuch', Hochdorf: 'faellig', Rothenburg: 'bald', Malters: 'entwurf',
  Willisau: 'verabschiedung', 'Schüpfheim': 'erfassung', Root: 'bald', Ruswil: 'faellig',
  // Fördergesuche für den Kanton (Controller)
  Hitzkirch: 'eingereicht', Wolhusen: 'eingereicht', 'Beromünster': 'eingereicht', Dagmersellen: 'geprueft', Reiden: 'geprueft'
};

const gesuchsLaufNr = {};
function nextGesuchsNr(jahr) {
  gesuchsLaufNr[jahr] = (gesuchsLaufNr[jahr] || 0) + 1;
  return `${jahr}${String(gesuchsLaufNr[jahr]).padStart(3, '0')}`;
}

function baueDemoMassnahme(p, index, szenario, nf) {
  // Pro Energieplanung jede Vorlage höchstens einmal verwenden.
  const vergeben = new Set(p.massnahmen.map(m => m.name));
  let handlungsfeld, vorlage;
  do {
    handlungsfeld = pick(HANDLUNGSFELDER);
    vorlage = pick(MASSNAHME_VORLAGEN[handlungsfeld]);
  } while (vergeben.has(vorlage.name) && vergeben.size < 20);
  let status = 'Geplant';
  if (szenario === 'abgeschlossen' || szenario === 'bald') status = weightedPick([['Geplant', 45], ['In Umsetzung', 40], ['Erledigt', 12], ['Sistiert', 3]]);
  if (szenario === 'faellig') status = weightedPick([['Geplant', 30], ['In Umsetzung', 45], ['Erledigt', 15], ['Sistiert', 7], ['Gestrichen', 3]]);
  if (szenario === 'nachgefuehrt') status = weightedPick([['Geplant', 20], ['In Umsetzung', 40], ['Erledigt', 25], ['Sistiert', 8], ['Gestrichen', 7]]);
  const offen = status !== 'Erledigt' && status !== 'Gestrichen';
  const m = neueMassnahme({
    esNr: chance(0.8) ? `${randomInt(1, 5)}.${randomInt(1, 4)}.${index + 1}` : '',
    name: vorlage.name,
    beschreibung: vorlage.beschreibung,
    handlungsfeld,
    aktivitaetsbereich: pick(AKTIVITAETSBEREICHE),
    prioritaet: chance(0.8) ? pick(PRIORITAETEN) : '',
    umsetzungszeitraum: `${p.jahr + randomInt(0, 1)}–${p.jahr + randomInt(2, 5)}`,
    budget: chance(0.85) ? randomInt(2, 300) * 500 : '',
    verantwortlichkeit: chance(0.7) ? p.verantwortlichGemeinde : '',
    status,
    weiterfuehren: offen ? (status === 'Sistiert' && chance(0.5) ? 'Nein' : 'Ja') : 'Nein',
    bemerkung: status === 'Geplant' && szenario !== 'nachgefuehrt' ? '' : pick(BEMERKUNGEN[status]),
    ausEpa: 'Ja',
    erfasstAm: p.epa.beratungsbeginn || p.erfasstAm
  });
  if (nf) {
    m.pruefungen.push({ datum: nf.datum, status: m.status, weiterfuehren: m.weiterfuehren, bemerkung: m.bemerkung || pick(BEMERKUNGEN[m.status]), art: 'Nachführung', nachfuehrung: nf.label });
    if (!m.bemerkung) m.bemerkung = m.pruefungen[0].bemerkung;
  }
  return m;
}

function baueDemoPlanung(gemeinde, szenario) {
  const lvl = SZENARIO_REIHENFOLGE.indexOf(szenario);
  let abschluss = null;
  if (szenario === 'abgeschlossen') abschluss = yearsAgo(0.3, 3.4);
  if (szenario === 'bald') abschluss = yearsAgo(3.55, 3.95);   // Nachführung in den nächsten ~6 Monaten fällig
  if (szenario === 'faellig') abschluss = yearsAgo(4.05, 5.3);
  if (szenario === 'nachgefuehrt') abschluss = yearsAgo(5.5, 7.8);
  const beginn = abschluss ? addDays(abschluss, -randomInt(300, 480)) : yearsAgo(0.15, 1.1);

  const p = neuePlanung({ gemeinde, typ: chance(0.9) ? PLANUNGSTYPEN[0] : PLANUNGSTYPEN[1], jahr: beginn.getFullYear() });
  p.erfasstAm = toIso(addDays(beginn, -randomInt(20, 90)));

  // Schritt 1: Grunddaten
  p.verantwortlichGemeinde = verantwortlichePersonGemeinde(gemeinde);
  const meine = MEINE_GEMEINDEN.includes(gemeinde);
  p.berater = meine ? ANGEMELDETER_BERATER : pick(BERATER_POOL);
  p.ziele = { nettoNull: pick(NETTO_NULL_ZIELE), effizienz: pick(ENERGIEEFFIZIENZ_ZIELE), strom: pick(STROMPRODUKTION_ZIELE) };
  if (szenario === 'erfassung') {
    if (meine || chance(0.6)) p.verantwortlichGemeinde = '';
    if (!meine && (chance(0.6) || !p.verantwortlichGemeinde)) p.berater = '';
    if (chance(0.5)) p.ziele = { nettoNull: '', effizienz: '', strom: '' };
  }
  if (lvl < 2) return p;

  // Schritt 2: EPA-Beratung
  const e = p.epa;
  e.status = 'Entwurf';
  e.beratungsperson = p.berater;
  e.beratungsbeginn = toIso(beginn);
  e.bedarfEnergierichtplan = pick(['Ja', 'Nein']);
  e.bedarfKoordination = pick(['Ja', 'Nein']);
  e.gebieteKoordination = pick(['Ja', 'Nein']);
  if (szenario === 'entwurf' && chance(0.6)) { e.bedarfKoordination = ''; e.gebieteKoordination = ''; }

  const anzahl = szenario === 'entwurf' ? randomInt(0, 6) : randomInt(4, 12);
  const nfJahr = abschluss ? addYears(abschluss, NACHFUEHRUNG_INTERVALL_JAHRE) : null;
  const nfDatum = szenario === 'nachgefuehrt' ? toIso(notAfterToday(addDays(nfJahr, randomInt(-20, 120)))) : null;
  const nf = nfDatum ? { datum: nfDatum, label: `Nachführung ${nfJahr.getFullYear()}` } : null;
  for (let i = 0; i < anzahl; i++) p.massnahmen.push(baueDemoMassnahme(p, i, szenario, nf));
  if (lvl < 3) return p;

  e.status = 'Verabschiedung';
  if (lvl < 4) return p;

  const verabschiedet = abschluss ? addDays(beginn, randomInt(90, 180)) : notAfterToday(addDays(beginn, randomInt(40, 120)));
  e.verabschiedetAm = toIso(verabschiedet);
  e.status = 'Fördergesuch';
  e.konto = {
    inhaber: `Gemeinde ${gemeinde}`,
    adresse: `${pick(['Hauptstrasse', 'Dorfstrasse', 'Kirchweg', 'Bahnhofstrasse', 'Schulhausstrasse'])} ${randomInt(1, 40)}, ${(typeof findGemeindePlz === 'function' && findGemeindePlz(gemeinde)) || 6000} ${gemeinde}`,
    iban: `CH${randomInt(10, 99)} ${String(randomInt(0, 9999)).padStart(4, '0')} ${String(randomInt(0, 9999)).padStart(4, '0')} ${String(randomInt(0, 9999)).padStart(4, '0')} ${String(randomInt(0, 9999)).padStart(4, '0')} ${randomInt(0, 9)}`,
    bank: pick(['Luzerner Kantonalbank', 'Luzerner Kantonalbank', 'PostFinance AG', 'Raiffeisenbank Sursee']),
    vermerk: '204071003 Kommunale Energieplanung'
  };
  if (szenario === 'foerdergesuch' && chance(0.7)) { e.konto.iban = ''; e.konto.bank = ''; }
  if (lvl < 5) return p;

  const eingereicht = abschluss ? addDays(verabschiedet, randomInt(10, 40)) : notAfterToday(addDays(verabschiedet, randomInt(10, 40)));
  e.gesuchEingereichtAm = toIso(eingereicht);
  const demoDateien = { formular: ['Foerderabschlussformular_unterschrieben.pdf', 410], kickoff: ['Kick-Off_Praesentation.pdf', 2300], abschlusspraesentation: ['Abschlusspraesentation.pdf', 3100], feedback: ['Feedbackformular.pdf', 180], rechnung: ['Rechnung_Beratungsbuero.pdf', 120], checkliste: ['Beratungscheckliste.pdf', 150] };
  EPA_DOKUMENTE.forEach(d => { if (d.pflicht || chance(0.5)) e.dokumente[d.key] = { name: demoDateien[d.key][0], size: demoDateien[d.key][1] * 1024, datum: toIso(eingereicht), url: '' }; });
  if (lvl < 6) return p;

  // Schritt 2b: Controlling durch den Kanton
  const eingang = notAfterToday(addDays(eingereicht, randomInt(1, 6)));
  p.controlling = {
    gesuchseingang: toIso(eingang),
    gesuchsNr: nextGesuchsNr(eingang.getFullYear()),
    auszahlungsbetrag: chance(0.85) ? 7200 : pick([6000, 6500, 7800, 8200]),
    energiestadt: pick(['Ja', 'Nein', 'Nein']),
    kommentar: pick(EPA_KOMMENTARE)
  };
  if (lvl < 7) return p;

  e.status = 'Abschluss';
  e.abgeschlossenAm = toIso(abschluss);

  // Schritt 3: bereits durchgeführte Nachführung
  if (nf) {
    // Während der Nachführung neu hinzugekommene Massnahmen
    const neuAnzahl = randomInt(0, 2);
    const bestehendeIds = p.massnahmen.map(m => m.id);
    for (let i = 0; i < neuAnzahl; i++) {
      const m = baueDemoMassnahme(p, p.massnahmen.length, 'abgeschlossen', null);
      Object.assign(m, { status: 'Geplant', weiterfuehren: 'Ja', ausEpa: 'Nein', erfasstAm: nfDatum, bemerkung: 'Neu aufgenommen im Rahmen der Nachführung.' });
      m.pruefungen.push({ datum: nfDatum, status: 'Geplant', weiterfuehren: 'Ja', bemerkung: m.bemerkung, art: 'Neu erfasst', nachfuehrung: nf.label });
      p.massnahmen.push(m);
    }
    p.laufendeNachfuehrung = { faelligAm: toIso(nfJahr), gestartetAm: toIso(addDays(fromIso(nfDatum), -randomInt(5, 40))), zuPruefen: bestehendeIds, geprueft: bestehendeIds.slice(), neu: p.massnahmen.map(m => m.id).filter(id => !bestehendeIds.includes(id)) };
    schliesseNachfuehrungAb(p, nfDatum);
  }
  return p;
}

const planungen = GEMEINDEN_LUZERN_PLZ.map(g => baueDemoPlanung(g.name, SZENARIO_FIX[g.name] || weightedPick(SZENARIO_GEWICHTE)));

// Demo: In Kriens und Ruswil wurde die fällige Nachführung bereits begonnen (3 Massnahmen überprüft).
['Kriens', 'Ruswil'].forEach(function (name) {
  const p = planungen.find(x => x.gemeinde === name);
  if (!p || p.epa.status !== 'Abschluss') return;
  starteNachfuehrung(p);
  p.laufendeNachfuehrung.gestartetAm = toIso(addDays(TODAY, -9));
  p.laufendeNachfuehrung.zuPruefen.slice(0, 3).forEach(id => {
    const m = p.massnahmen.find(x => x.id === id);
    const status = m.status === 'Geplant' ? 'In Umsetzung' : m.status;
    pruefeMassnahme(p, m, { status, weiterfuehren: 'Ja', bemerkung: pick(BEMERKUNGEN[status]) }, toIso(addDays(TODAY, -9)));
  });
});
