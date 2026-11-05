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
