/* =============================================================
   Zusätzliche Dummy-Energieplanungen für weitere Luzerner Gemeinden
   Nutzt die in app.js definierten Generatoren (makeEnergieplanung,
   buildMassnahmen, pick, randomInt) und ergänzt das planungen-Array.
   ============================================================= */

(function () {
  const GEMEINDEN_LUZERN = [
    'Altbüron', 'Altishofen', 'Beromünster', 'Büron', 'Dagmersellen',
    'Dierikon', 'Doppleschwand', 'Ebikon', 'Egolzwil', 'Eich',
    'Emmen', 'Entlebuch', 'Ermensee', 'Eschenbach', 'Escholzmatt-Marbach',
    'Ettiswil', 'Fischbach', 'Flühli', 'Geuensee', 'Gisikon',
    'Greppen', 'Grossdietwil', 'Grosswangen', 'Hasle', 'Hergiswil',
    'Hildisrieden', 'Hitzkirch', 'Hochdorf', 'Hohenrain', 'Horw'
  ];

  const STATUS_WEIGHTED = ['Entwurf', 'Entwurf', 'Entwurf', 'Verabschiedung', 'Verabschiedung', 'Fördergesuch', 'Abschluss'];
  const JAHR_WEIGHTED = [2025, 2026, 2026, 2026, 2027];

  let seq = 900;
  GEMEINDEN_LUZERN.forEach(gemeinde => {
    const id = `EP-${seq++}`;
    const p = makeEnergieplanung(id, gemeinde, pick(STATUS_WEIGHTED));
    p.jahr = pick(JAHR_WEIGHTED);
    p.massnahmen = buildMassnahmen(p);
    fillPlanungDetails(p);
    planungen.push(p);
  });

  // künftige, manuell über "+" angelegte Energieplanungen dürfen nicht mit den hier vergebenen IDs kollidieren
  nextPlanungSeq = Math.max(nextPlanungSeq, seq);

  render();
})();
