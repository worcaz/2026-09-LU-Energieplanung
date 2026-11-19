/* =============================================================
   Zusätzliche Dummy-Energieplanungen für weitere Luzerner Gemeinden
   Nutzt die in app.js definierten Generatoren (makeEnergieplanung,
   buildMassnahmen, pick, randomInt) und ergänzt das planungen-Array.

   Damit jede der 79 Gemeinden (siehe dummy-gemeinden-luzern.js) mindestens
   eine Energieplanung hat, werden hier alle Gemeinden ergänzt, die noch
   nicht in planungen vorkommen (z.B. die bereits in app.js hart codierten).
   ============================================================= */

(function () {
  const bereitsVorhanden = new Set(planungen.map(p => p.gemeinde));
  const GEMEINDEN_LUZERN = GEMEINDEN_LUZERN_PLZ
    .map(g => g.name)
    .filter(name => !bereitsVorhanden.has(name));

  const STATUS_WEIGHTED = ['Entwurf', 'Entwurf', 'Entwurf', 'Verabschiedung', 'Verabschiedung', 'Fördergesuch', 'Abschluss'];

  // Status je Gemeinde reproduzierbar auswürfeln
  const statusJe = {};
  GEMEINDEN_LUZERN.forEach(gemeinde => {
    seedRng('status-' + gemeinde);
    statusJe[gemeinde] = pick(STATUS_WEIGHTED);
  });
  // 20 zusätzliche Gemeinden im Status "Abschluss" (= Prozessschritt Nachführung), damit mehr Beispiele für die Nachführung vorhanden sind
  // Mit Szenario, damit alle Phasen der Nachführung vertreten sind: fällig (Frist verstrichen), offen (Frist < 12 Monate),
  // review (Nachführung bereits erfolgt, mit Historie) und ruhend (Frist in über 12 Monaten).
  const FUER_NACHFUEHRUNG = [
    ['Emmen', 'faellig'], ['Kriens', 'review'], ['Horw', 'offen'], ['Sursee', 'review'], ['Meggen', 'ruhend'],
    ['Malters', 'faellig'], ['Ruswil', 'offen'], ['Sempach', 'review'], ['Hochdorf', 'ruhend'], ['Triengen', 'ruhend'],
    ['Rothenburg', 'ruhend'], ['Wolhusen', 'offen'],
    // weitere Gemeinden (zweite Tranche)
    ['Ebikon', 'review'], ['Dagmersellen', 'faellig'], ['Reiden', 'ruhend'], ['Schötz', 'offen'], ['Willisau', 'review'],
    ['Entlebuch', 'ruhend'], ['Beromünster', 'offen'], ['Nottwil', 'faellig'], ['Hitzkirch', 'ruhend'], ['Neuenkirch', 'offen'],
    ['Eschenbach', 'review'], ['Schüpfheim', 'ruhend'], ['Menznau', 'faellig']
  ];
  const szenarioJe = {};
  let zusaetzlich = 0;
  FUER_NACHFUEHRUNG.forEach(([g, sz]) => {
    if (zusaetzlich < 20 && statusJe[g] && statusJe[g] !== 'Abschluss') { statusJe[g] = 'Abschluss'; szenarioJe[g] = sz; zusaetzlich++; }
  });

  // Planungen mit bereits mehreren erledigten Nachführungen (3. bzw. 4.), damit der Verlauf mit vielen Änderungen sichtbar ist:
  //  review3 = 3 Nachführungen erledigt, nächste Frist in der Zukunft · review4 = 4 erledigt · faellig3 = 3 erledigt, 4. Nachführung fällig
  [['Adligenswil', 'review3'], ['Ballwil', 'review4'], ['Altishofen', 'faellig3'], ['Buttisholz', 'review3'], ['Gisikon', 'review4']].forEach(([g, sz]) => {
    if (statusJe[g] !== undefined) { statusJe[g] = 'Abschluss'; szenarioJe[g] = sz; }
  });

  // Nachführung bereits in Bearbeitung (etwas geändert/bestätigt, aber nicht abgeschlossen): Aesch (fällig), Büron (offen)
  const IN_BEARBEITUNG = { Aesch: { sz: 'faellig', seit: -12, von: 'Admin', zuletzt: -3 }, 'Büron': { sz: 'offen', seit: -20, von: 'Gemeinde', zuletzt: -1 } };
  Object.keys(IN_BEARBEITUNG).forEach(g => {
    if (statusJe[g] !== undefined) { statusJe[g] = 'Abschluss'; szenarioJe[g] = IN_BEARBEITUNG[g].sz; }
  });

  // Laufende Nachführung mit Bearbeitungsvermerk: Personen bestätigt, eine Massnahme bestätigt, Rest offen
  function dummyNachfuehrungInBearbeitung(p, cfg) {
    const tag = n => addDays(DUMMY_REFERENZDATUM, n).toISOString();
    const nf = { angaben: true, ziele: false, massnahmen: {}, beruehrt: {}, bearbeitung: { seit: tag(cfg.seit), von: cfg.von, zuletzt: tag(cfg.zuletzt), zuletztVon: cfg.von } };
    const m = p.massnahmen.find(x => !massnahmeBeendet(x));
    if (m) { nf.beruehrt[m.id] = true; nf.massnahmen[m.id] = true; }
    p.nfPruefung = nf;
  }

  let seq = 900;
  GEMEINDEN_LUZERN.forEach(gemeinde => {
    const id = `EP-${seq++}`;
    const p = makeEnergieplanung(id, gemeinde, statusJe[gemeinde], szenarioJe[gemeinde] ? { nfSzenario: szenarioJe[gemeinde] } : undefined);
    generiereProzessDaten(p);
    if (IN_BEARBEITUNG[gemeinde]) dummyNachfuehrungInBearbeitung(p, IN_BEARBEITUNG[gemeinde]);
    planungen.push(p);
  });

  // Bereits in app.js angelegte Planungen (z. B. Aesch) bekommen den Bearbeitungsvermerk hier
  Object.keys(IN_BEARBEITUNG).forEach(g => {
    const p = planungen.find(x => x.typ === 'Kommunale Energieplanung' && x.gemeinde === g);
    if (p && !p.nfPruefung) dummyNachfuehrungInBearbeitung(p, IN_BEARBEITUNG[g]);
  });

  // Regionale Energieplanungen: Gemeinden, die im Kanton Luzern bereits heute regional zusammenarbeiten.
  // Je Gemeinde höchstens eine regionale Planung (kein Überlapp).
  const REGIONALE_PLANUNGEN = [
    { region: 'Rontal', status: 'Abschluss', gemeinden: ['Buchrain', 'Dierikon', 'Ebikon', 'Root'] },
    { region: 'Biosphäre Entlebuch', status: 'Fördergesuch', gemeinden: ['Doppleschwand', 'Entlebuch', 'Escholzmatt-Marbach', 'Flühli', 'Hasle', 'Romoos', 'Schüpfheim'] },
    { region: 'Luzern West', status: 'Verabschiedung', gemeinden: ['Alberswil', 'Altbüron', 'Fischbach', 'Grossdietwil', 'Hergiswil', 'Luthern', 'Menznau', 'Ufhusen', 'Willisau', 'Zell'] },
    { region: 'Sempachersee', status: 'Entwurf', gemeinden: ['Eich', 'Hildisrieden', 'Neuenkirch', 'Nottwil', 'Oberkirch', 'Schenkon', 'Sempach'] },
    { region: 'Hitzkirchertal', status: 'Abschluss', gemeinden: ['Aesch', 'Ermensee', 'Hitzkirch', 'Hohenrain', 'Römerswil', 'Schongau'] },
    { region: 'Rigi', status: 'Entwurf', gemeinden: ['Greppen', 'Vitznau', 'Weggis'] },
    { region: 'Wiggertal', status: 'Verabschiedung', gemeinden: ['Dagmersellen', 'Egolzwil', 'Nebikon', 'Reiden', 'Roggliswil', 'Schötz', 'Wauwil', 'Wikon'] },
  ];
  REGIONALE_PLANUNGEN.forEach(r => {
    const id = `EP-${seq++}`;
    const p = makeEnergieplanung(id, r.gemeinden.join(', '), r.status, {
      typ: 'Regionale Energieplanung',
      name: `Regionale Energieplanung ${r.region}`,
      regionName: r.region,
    });
    generiereProzessDaten(p);
    planungen.push(p);
  });

  // künftige, manuell über "+" angelegte Energieplanungen dürfen nicht mit den hier vergebenen IDs kollidieren
  nextPlanungSeq = Math.max(nextPlanungSeq, seq);

  render();
})();

// Konsistenzprüfung der Dummy-Daten: pro Gemeinde genau eine kommunale Energieplanung
(function () {
  const anzahl = {};
  planungen.filter(p => p.typ === 'Kommunale Energieplanung').forEach(p => { anzahl[p.gemeinde] = (anzahl[p.gemeinde] || 0) + 1; });
  const doppelt = Object.keys(anzahl).filter(g => anzahl[g] > 1);
  if (doppelt.length) console.warn('Mehrere kommunale Energieplanungen in Gemeinde:', doppelt.join(', '));
})();
