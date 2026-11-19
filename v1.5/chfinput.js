/* Beträge in CHF: Felder mit data-chf zeigen beim Tippen automatisch das Tausendertrennzeichen (1000 -> 1'000).
   Gespeichert und geprüft wird immer die Zahl ohne Trennzeichen (siehe app.js: replace(/['’\s]/g, '')). */
(function () {
  'use strict';
  function gruppiere(ziffern) { return ziffern.replace(/\B(?=(\d{3})+(?!\d))/g, "'"); }
  document.addEventListener('input', function (e) {
    const el = e.target;
    if (!el || !el.matches || !el.matches('input[data-chf]')) return;
    const alt = el.value;
    const pos = el.selectionStart == null ? alt.length : el.selectionStart;
    // Anzahl Ziffern vor dem Cursor merken, damit der Cursor nach dem Formatieren an derselben Stelle steht
    const vorCursor = alt.slice(0, pos).replace(/\D/g, '').length;
    const ziffern = alt.replace(/['’\s]/g, '');
    // Buchstaben o. Ä. lässt das Formular selbst melden (Meldung am Feld), darum nur gültige Ziffernfolgen umformatieren
    if (!/^\d*$/.test(ziffern)) return;
    const neu = gruppiere(ziffern);
    if (neu === alt) return;
    el.value = neu;
    let n = 0, p = 0;
    while (p < neu.length && n < vorCursor) { if (/\d/.test(neu[p])) n++; p++; }
    try { el.setSelectionRange(p, p); } catch (err) { /* Feldtyp ohne Cursor */ }
  });
  // Beim Verlassen und Laden ebenfalls formatieren (z. B. nach Einfügen)
  document.addEventListener('focusout', function (e) {
    const el = e.target;
    if (!el || !el.matches || !el.matches('input[data-chf]')) return;
    const z = el.value.replace(/['’\s]/g, '');
    if (/^\d+$/.test(z)) el.value = gruppiere(z);
  });
})();
