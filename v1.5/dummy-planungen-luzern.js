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

  let seq = 900;
  GEMEINDEN_LUZERN.forEach(gemeinde => {
    const id = `EP-${seq++}`;
    seedRng('status-' + gemeinde);   // Status je Gemeinde reproduzierbar
    const p = makeEnergieplanung(id, gemeinde, pick(STATUS_WEIGHTED));
    generiereProzessDaten(p);
    planungen.push(p);
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
