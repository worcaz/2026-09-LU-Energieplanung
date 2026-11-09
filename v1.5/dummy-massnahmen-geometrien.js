/* =============================================================
   Geografische Markierungen für Dummy-Massnahmen (Punkt / Linie / Kurve / Fläche)

   Nicht jede Massnahme ist ortsgebunden: Strategien, Kampagnen, Beratung o. ä. haben keine Markierung.
   Ortsgebundene Massnahmen erhalten je nach Art eine passende Geometrie, z. B.
     Ladeinfrastruktur / PV auf Gemeindebauten  -> Punkte (mehrere Standorte)
     Fernwärme-, Wärmeverbund, LED-Strassenzüge -> Linien (Leitungstrassen, Strassenzüge)
     Kleinwasserkraft am Bach, Velowege         -> Kurven (geschwungener Verlauf)
     Gewerbezone, Erdsondenfeld, Areal          -> Flächen (ein oder mehrere Polygone)
   Alle Koordinaten (WGS84, [lon, lat]) liegen innerhalb der Gemeindegrenze der Gemeinde, in der die Massnahme
   verortet ist (bei regionalen Planungen: eine der beteiligten Gemeinden).

   Benötigt GEMEINDEGRENZEN_LUZERN (dummy-gemeindegrenzen-luzern.js). Eigener, aus der Massnahmen-ID abgeleiteter
   Zufallsgenerator, damit die übrigen Dummy-Daten unverändert bleiben.
   ============================================================= */
(function (global) {
  const R = 111320;   // Meter pro Breitengrad

  // Regeln: Name der Massnahme -> Art, Wahrscheinlichkeit und Grösse
  const REGELN = {
    'Fernwärmeverbund Zentrum':               { art: 'Linie',  p: 1.0, aeste: [1, 2], schritte: [4, 7], schritt: 160 },
    'Wärmeverbund Schulanlage':               { art: 'Linie',  p: 1.0, aeste: [1, 1], schritte: [2, 4], schritt: 110 },
    'Abwärmenutzung ARA':                     { art: 'Linie',  p: 1.0, aeste: [1, 1], schritte: [4, 7], schritt: 170 },
    'Erdsondenfeld Neubaugebiet':             { art: 'Fläche', p: 1.0, teile: [1, 1], radius: 90 },
    'Ersatz Ölheizungen Gemeindebauten':      { art: 'Punkt',  p: 0.9, anzahl: [3, 6] },
    'Energetische Sanierung Gemeindeliegenschaften': { art: 'Punkt', p: 0.9, anzahl: [2, 5] },
    'LED-Sanierung Strassenbeleuchtung':      { art: 'Linie',  p: 0.8, aeste: [2, 3], schritte: [3, 6], schritt: 150 },
    'Photovoltaik auf Gemeindebauten':        { art: 'Punkt',  p: 0.95, anzahl: [2, 6] },
    'Solaroffensive Gewerbezone':             { art: 'Fläche', p: 1.0, teile: [1, 3], radius: 120 },
    'Speicherkonzept erneuerbarer Strom':     { art: 'Punkt',  p: 0.6, anzahl: [1, 1] },
    'Potenzialstudie Biomasse':               { art: 'Fläche', p: 0.7, teile: [2, 3], radius: 140 },
    'Kleinwasserkraft Gemeindebach':          { art: 'Kurve',  p: 1.0, schritte: [6, 9], schritt: 120 },
    'Potenzialabklärung Tiefengeothermie':    { art: 'Fläche', p: 0.8, teile: [1, 1], radius: 260 },
    'Ausbau Ladeinfrastruktur':               { art: 'Punkt',  p: 1.0, anzahl: [3, 6] },
    'Förderung Langsamverkehr':               { art: 'Kurve',  p: 1.0, schritte: [8, 12], schritt: 130 },
    'Elektrifizierung Gemeindefahrzeuge':     { art: 'Punkt',  p: 0.5, anzahl: [1, 1] },
    'Sanierungsverpflichtung Altbauten':      { art: 'Fläche', p: 0.6, teile: [1, 1], radius: 200 },
    'Energiekonzept Arealentwicklung':        { art: 'Fläche', p: 1.0, teile: [1, 1], radius: 150 }
  };

  function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) {   // mulberry32
    let a = seed || 1;
    const r = () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    r.int = (a2, b2) => a2 + Math.floor(r() * (b2 - a2 + 1));
    r.between = (a2, b2) => a2 + r() * (b2 - a2);
    return r;
  }
  const rund = n => Math.round(n * 1e5) / 1e5;

  function insideRing(pt, ring) {
    let c = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i], [xj, yj] = ring[j];
      if (((yi > pt[1]) !== (yj > pt[1])) && (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi)) c = !c;
    }
    return c;
  }

  // Gemeindefläche: grösstes Polygon der Gemeinde (äusserer Ring; Löcher sind in Luzern vernachlässigbar)
  function gemeindeRing(name) {
    // const-Deklaration aus dummy-gemeindegrenzen-luzern.js ist global sichtbar, aber keine window-Eigenschaft
    const grenzen = typeof GEMEINDEGRENZEN_LUZERN !== 'undefined' ? GEMEINDEGRENZEN_LUZERN : (global.GEMEINDEGRENZEN_LUZERN || { features: [] });
    const f = grenzen.features.find(x => x.properties.name === name);
    if (!f) return null;
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
    return polys.map(p => p[0]).sort((a, b) => b.length - a.length)[0];
  }

  function erzeuge(m, gemeindeNamen) {
    const regel = REGELN[m.name];
    if (!regel) return null;
    const r = rng(hash('geo|' + m.id + '|' + m.name));
    if (r() > regel.p) return null;

    const namen = (gemeindeNamen || []).filter(n => gemeindeRing(n));
    if (!namen.length) return null;
    const gemeinde = namen[r.int(0, namen.length - 1)];
    const ring = gemeindeRing(gemeinde);
    const xs = ring.map(p => p[0]), ys = ring.map(p => p[1]);
    const minx = Math.min(...xs), maxx = Math.max(...xs), miny = Math.min(...ys), maxy = Math.max(...ys);
    const lat0 = (miny + maxy) / 2, mx = R * Math.cos(lat0 * Math.PI / 180), my = R;
    const breiteM = (maxx - minx) * mx, hoeheM = (maxy - miny) * my;
    // kleine Gemeinden: Objekte entsprechend kleiner
    const skala = Math.max(0.45, Math.min(1.5, Math.min(breiteM, hoeheM) / 3000));

    const off = (p, dx, dy) => [p[0] + dx / mx, p[1] + dy / my];
    // Punkt liegt in der Gemeinde und hält Abstand zur Grenze (8 Richtungen)
    const sicher = (p, abstand) => {
      if (!insideRing(p, ring)) return false;
      for (let k = 0; k < 8; k++) {
        const w = k * Math.PI / 4;
        if (!insideRing(off(p, Math.cos(w) * abstand, Math.sin(w) * abstand), ring)) return false;
      }
      return true;
    };
    const zufallspunkt = abstand => {
      for (let i = 0; i < 600; i++) {
        const p = [r.between(minx, maxx), r.between(miny, maxy)];
        if (sicher(p, abstand)) return p;
      }
      for (let i = 0; i < 600; i++) { const p = [r.between(minx, maxx), r.between(miny, maxy)]; if (insideRing(p, ring)) return p; }
      return null;
    };

    // Fläche: sternförmiges Vieleck um einen Mittelpunkt (Ecken alle innerhalb der Gemeinde)
    const blob = radius => {
      for (let versuch = 0; versuch < 40; versuch++) {
        const rad = radius * skala * Math.pow(0.93, versuch);
        const c = zufallspunkt(rad * 1.3 + 30);
        if (!c) continue;
        const n = r.int(6, 9), w0 = r.between(0, Math.PI * 2), pts = [];
        let ok = true;
        for (let i = 0; i < n; i++) {
          const w = w0 + (i + r.between(-0.2, 0.2)) * 2 * Math.PI / n, rr = rad * r.between(0.65, 1.15);
          const p = off(c, Math.cos(w) * rr, Math.sin(w) * rr);
          if (!insideRing(p, ring)) { ok = false; break; }
          pts.push(p);
        }
        if (ok) { pts.push(pts[0]); return [pts.map(p => [rund(p[0]), rund(p[1])])]; }
      }
      return null;
    };
    // Linie: Folge von Teilstücken mit leichten Richtungswechseln
    const linie = (schritte, schritt, kurvig) => {
      for (let versuch = 0; versuch < 60; versuch++) {
        let p = zufallspunkt(40);
        if (!p) continue;
        let w = r.between(0, Math.PI * 2);
        const pts = [p], len = schritt * skala;
        for (let i = 0; i < schritte; i++) {
          let gesetzt = false;
          for (let k = 0; k < 10 && !gesetzt; k++) {
            const w2 = w + r.between(-(kurvig ? 0.7 : 0.6), (kurvig ? 0.7 : 0.6));
            const q = off(p, Math.cos(w2) * len * r.between(0.75, 1.25), Math.sin(w2) * len * r.between(0.75, 1.25));
            // auch das Teilstück selbst darf die Gemeindegrenze nicht kreuzen (Zwischenpunkte prüfen)
            const stueckOk = [0.2, 0.4, 0.6, 0.8].every(t => insideRing([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t], ring));
            if (stueckOk && sicher(q, 25)) { pts.push(q); p = q; w = w2; gesetzt = true; }
          }
          if (!gesetzt) break;
        }
        if (pts.length >= Math.min(3, schritte + 1)) return pts;
      }
      return null;
    };
    // Chaikin-Glättung: ergibt einen geschwungenen Verlauf (Kurve)
    const glaetten = pts => {
      let a = pts;
      for (let it = 0; it < 3; it++) {
        const b = [a[0]];
        for (let i = 0; i < a.length - 1; i++) {
          b.push([0.75 * a[i][0] + 0.25 * a[i + 1][0], 0.75 * a[i][1] + 0.25 * a[i + 1][1]]);
          b.push([0.25 * a[i][0] + 0.75 * a[i + 1][0], 0.25 * a[i][1] + 0.75 * a[i + 1][1]]);
        }
        b.push(a[a.length - 1]);
        a = b;
      }
      return a;
    };
    const runde = pts => pts.map(p => [rund(p[0]), rund(p[1])]);

    // Gesamtprüfung: alle Stützpunkte UND die Zwischenpunkte der Kanten liegen in der Gemeinde
    const komplettInnen = g => {
      const c = g.coordinates;
      const linien = g.type === 'LineString' ? [c] : g.type === 'MultiLineString' ? c : g.type === 'Polygon' ? c : g.type === 'MultiPolygon' ? c.flat() : [];
      const punkte = g.type === 'Point' ? [c] : g.type === 'MultiPoint' ? c : [];
      if (!punkte.every(p => insideRing(p, ring))) return false;
      return linien.every(l => l.every((p, i) => {
        if (!insideRing(p, ring)) return false;
        if (i === 0) return true;
        const q = l[i - 1];
        return [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].every(t => insideRing([q[0] + (p[0] - q[0]) * t, q[1] + (p[1] - q[1]) * t], ring));
      }));
    };
    let geometry = null;
    for (let anlauf = 0; anlauf < 12 && !geometry; anlauf++) {
    if (regel.art === 'Punkt') {
      const n = r.int(regel.anzahl[0], regel.anzahl[1]), pts = [];
      for (let i = 0; i < n; i++) { const p = zufallspunkt(30); if (p) pts.push([rund(p[0]), rund(p[1])]); }
      if (pts.length) geometry = pts.length === 1 ? { type: 'Point', coordinates: pts[0] } : { type: 'MultiPoint', coordinates: pts };
    } else if (regel.art === 'Linie') {
      const n = r.int(regel.aeste[0], regel.aeste[1]), linien = [];
      for (let i = 0; i < n; i++) { const l = linie(r.int(regel.schritte[0], regel.schritte[1]), regel.schritt, false); if (l) linien.push(runde(l)); }
      if (linien.length) geometry = linien.length === 1 ? { type: 'LineString', coordinates: linien[0] } : { type: 'MultiLineString', coordinates: linien };
    } else if (regel.art === 'Kurve') {
      for (let versuch = 0; versuch < 10 && !geometry; versuch++) {
        const l = linie(r.int(regel.schritte[0], regel.schritte[1]), regel.schritt, true);
        if (!l || l.length < 3) continue;
        const g = glaetten(l);
        if (g.every(p => insideRing(p, ring))) geometry = { type: 'LineString', coordinates: runde(g) };
      }
    } else if (regel.art === 'Fläche') {
      const n = r.int(regel.teile[0], regel.teile[1]), flaechen = [];
      for (let i = 0; i < n; i++) { const b = blob(regel.radius); if (b) flaechen.push(b); }
      if (flaechen.length) geometry = flaechen.length === 1 ? { type: 'Polygon', coordinates: flaechen[0] } : { type: 'MultiPolygon', coordinates: flaechen };
    }
    if (geometry && !komplettInnen(geometry)) geometry = null;
    }
    return geometry ? { art: regel.art, gemeinde, geometry } : null;
  }

  global.erzeugeMassnahmeGeometrie = erzeuge;
  global.MASSNAHME_GEOMETRIE_REGELN = REGELN;
})(typeof window !== 'undefined' ? window : globalThis);
