/* =============================================================
   Dummydaten für die Fachlayer im Karteninhalt (EPA-Karte, EPA-Indikatoren).
   Alles ist zufällig bzw. von Hand angenähert erzeugt (feste Startwerte, bei jedem Laden gleich) und hat KEINEN Bezug zu realen Anlagen,
   Leitungen oder Gebieten. Die Darstellung (Farben, Symbole, Dichte) orientiert sich an der Vorlage des Geoportals.
   Lage: innerhalb der Luzerner Gemeinden (GEMEINDEGRENZEN_LUZERN); «siedlung» = gehäuft um den Hauptort einer Gemeinde.
   Gewässer: grob nachgezeichnete Hauptläufe (FL_FLUESSE, nur angenähert) mit zufälligen Zuflüssen.
   ============================================================= */

// Symbole (SVG, 24x24) für die runden Marker
const FL_ICONS = {
  fabrik: '<path d="M3 21V10l6 3.5V10l6 3.5V5h3.5v8.5H21V21z"/>',
  tropfen: '<path d="M12 3c3.6 4.6 6 7.6 6 10.6a6 6 0 0 1-12 0C6 10.6 8.4 7.6 12 3z"/>',
  kapsel: '<rect x="2" y="8" width="20" height="8" rx="4" transform="rotate(-45 12 12)"/>',
  blatt: '<path d="M5 19C5 10.5 10 5 20 4c0 10-5 15-13 15z"/>',
  luefter: '<circle cx="12" cy="12" r="2"/><path d="M12 10C9.5 3.5 14.5 2.5 15.5 5s-1.5 4-3.500 5zM14 12c6.500-2.500 7.500 2 5 3.500S15 15 14 12zM11 14c-1 6.500-5.500 5.500-5.500 3S8 14.500 11 14z"/>',
  bolt: '<path d="M13 2 5 14h6l-1 8 8-12h-6z"/>',
  sack: '<path d="M9.500 2.500h5L13.500 6c3 1 5 4 5 8 0 4-2.500 7-6.500 7S5.500 18 5.500 14c0-4 2-7 5-8z"/>',
  ara: '<path d="M2.500 8h12v11h-12z"/><path d="M18.500 7c2.200 2.800 3 4.200 3 5.800a3 3 0 0 1-6 0c0-1.600.8-3 3-5.800z"/>',
  flamme: '<path d="M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 2-4 3-7 1 2 2 2 3-5z"/>'
};

// Hauptläufe (grob angenähert, [lon, lat]): Wigger, Kleine Emme, Reuss, Suhre, Seetaler Aa, Rot, Luthern
const FL_FLUESSE = [
  [[7.985, 47.015], [7.990, 47.065], [7.995, 47.115], [7.960, 47.165], [7.985, 47.205], [7.970, 47.245], [7.945, 47.280]],
  [[7.980, 46.905], [8.050, 46.925], [8.110, 46.965], [8.160, 47.020], [8.200, 47.050], [8.260, 47.060], [8.300, 47.070]],
  [[8.285, 47.045], [8.300, 47.070], [8.335, 47.095], [8.385, 47.130], [8.395, 47.175]],
  [[8.100, 47.170], [8.085, 47.205], [8.110, 47.240], [8.100, 47.285]],
  [[8.260, 47.205], [8.245, 47.245], [8.225, 47.285], [8.210, 47.325]],
  [[8.140, 47.065], [8.100, 47.095], [8.085, 47.140], [8.090, 47.175]],
  [[7.900, 47.040], [7.930, 47.090], [7.970, 47.120]],
  [[7.860, 47.135], [7.900, 47.145], [7.960, 47.135]],
  [[8.300, 46.995], [8.312, 47.025], [8.300, 47.050]]
];

// Kehrichtverbrennungsanlagen (nur zwei, wie in der Vorlage; eine davon knapp ausserhalb des Kantons): Perlen (Root) und eine im Norden
const FL_KVA = [[8.396, 47.118], [7.930, 47.318]];

const FACHLAYER_DUMMY = {
  // ---- Stromeinfrastruktur / Strompotential ----
  strom_prod: [
    { art: 'punkte', n: 900, ort: 'siedlung', r: 3.5, fill: '#f7dc3a', stroke: '#6b5a00' },
    { art: 'punkte', n: 250, ort: 'ueberall', r: 3.5, fill: '#f7dc3a', stroke: '#6b5a00' },
    { art: 'badges', n: 9, ort: 'ueberall', icon: 'tropfen', bg: '#a9cdf0', border: '#2a6db0', name: 'Wasserkraftwerk' }
  ],
  // grüne Marker mit unterschiedlichen Symbolen (Blatt, Anlage, Becken, Strom), meist bei den Siedlungen, einzelne im ländlichen Raum (nach Vorlage)
  biogas: [
    { art: 'badges', n: 26, ort: 'siedlung', name: 'Biogasanlage', kat: [{ w: 0.5, icon: 'blatt', bg: '#a8d98f', border: '#4f9a3a' }, { w: 0.2, icon: 'fabrik', bg: '#a8d98f', border: '#4f9a3a' }, { w: 0.15, icon: 'ara', bg: '#a8d98f', border: '#4f9a3a' }, { w: 0.15, icon: 'bolt', bg: '#a8d98f', border: '#4f9a3a' }] },
    { art: 'badges', n: 12, ort: 'ueberall', name: 'Biogasanlage', kat: [{ w: 0.5, icon: 'blatt', bg: '#a8d98f', border: '#4f9a3a' }, { w: 0.2, icon: 'fabrik', bg: '#a8d98f', border: '#4f9a3a' }, { w: 0.15, icon: 'ara', bg: '#a8d98f', border: '#4f9a3a' }, { w: 0.15, icon: 'bolt', bg: '#a8d98f', border: '#4f9a3a' }] }
  ],
  kva: [{ art: 'badges', fest: FL_KVA, icon: 'sack', bg: '#f3b27a', border: '#c2641c', name: 'Kehrichtverbrennungsanlage' }],
  wasserkraft: [{ art: 'netz', color: '#4a6fa5', weight: 6, zufluesse: 70, zsteps: 16, zstep: 0.0034 }],
  wind: [{ art: 'flaechen', n: 26, orte: 'namen', namen: ['Hergiswil', 'Luthern', 'Romoos', 'Menzberg', 'Fischbach', 'Ohmstal', 'Zell', 'Ufhusen', 'Hüswil', 'Altbüron', 'Grossdietwil', 'Escholzmatt', 'Flühli', 'Entlebuch', 'Doppleschwand', 'Hasle', 'Schüpfheim', 'Schwarzenberg', 'Wolhusen'], ra: 0.005, rb: 0.011, fill: '#c3d8f7', fillOp: 0.65, stroke: '#0b4aa6', dash: '2 4', weight: 3, sigma: 0.008 }],
  solar_dach: [{ art: 'quadrate', n: 1800, ort: 'siedlung', s: 0.00032, fill: '#ffe21a', stroke: '#b89b00', weight: 0.6 }],
  // ---- Wärmeinfrastruktur ----
  zentralen: [{ art: 'badges', n: 90, ort: 'siedlung', name: 'Zentrale Thermisches Netz', kat: [
    { w: 0.62, icon: 'kapsel', bg: '#b7e0a0', border: '#5a9a3c' },
    { w: 0.10, icon: 'tropfen', bg: '#8ec1ea', border: '#2b6cb0' },
    { w: 0.06, icon: 'tropfen', bg: '#12756e', border: '#0a4f4a', iconFill: '#ffffff' },
    { w: 0.10, icon: 'luefter', bg: '#cfe5f7', border: '#6fa8d6' },
    { w: 0.08, icon: 'fabrik', bg: '#f6b07a', border: '#d77a2a' },
    { w: 0.04, icon: 'flamme', bg: '#8fe0f0', border: '#14a3c0' }
  ] }],
  lwwp: [{ art: 'badges', n: 520, ort: 'siedlung', icon: 'luefter', bg: '#bcd8f4', border: '#5f9fd8', quadrat: true, name: 'Luft-Wasser-Wärmepumpe' }],
  sonden: [{ art: 'punkte', n: 1100, ort: 'siedlung', r: 5, fill: '#b9662a', stroke: '#5a3010' }],
  therm_solar: [{ art: 'quadrate', n: 60, ort: 'siedlung', s: 0.0005, fill: '#6a2c91', stroke: '#4a1c68', weight: 0.6 }],
  therm_geb: [{ art: 'quadrate', n: 380, ort: 'siedlung', s: 0.00028, fill: '#7a2fa0', stroke: '#4a1c68', weight: 0.5 }],
  therm_leit: [{ art: 'linien', n: 70, ort: 'siedlung', steps: 14, step: 0.0016, color: '#b04ad8', weight: 2.2 }],
  gas_geb: [{ art: 'quadrate', n: 460, ort: 'siedlung', s: 0.00028, fill: '#c8329a', stroke: '#8a2068', weight: 0.5 }],
  gas_leit: [{ art: 'linien', n: 130, ort: 'siedlung', steps: 14, step: 0.0016, color: '#19c5e6', weight: 1.8 }],
  // ---- Wärmepotential ----
  ab_kva: [{ art: 'badges', fest: FL_KVA, icon: 'sack', bg: '#f47c78', border: '#c53030', name: 'Abwärme aus Kehrichtverbrennungsanlage' }],
  ab_ind_hoch: [{ art: 'badges', n: 26, ort: 'siedlung', icon: 'fabrik', bg: '#f48e8a', border: '#d4312c', aussen: 22, name: 'Abwärme aus Industrie, hochwertig' }],
  ab_ind_nieder: [{ art: 'badges', n: 170, ort: 'siedlung', icon: 'fabrik', bg: '#f7b98a', border: '#e08a3e', aussen: 170, aussenCluster: true, name: 'Abwärme aus Industrie, niederwertig' }],
  ab_ara: [{ art: 'badges', n: 42, ort: 'ueberall', icon: 'ara', bg: '#f7b98a', border: '#d08040', aussen: 30, name: 'Abwärme aus Abwasserreinigungsanlage' }],
  // dünne lachsfarbene Linien, vor allem im Siedlungsgebiet der Agglomeration Luzern (nach Vorlage)
  ab_kanal: [
    { art: 'linien', n: 260, ort: 'siedlung', steps: 10, step: 0.0011, color: '#e9906a', weight: 1.2, opacity: 0.9 },
    { art: 'linien', n: 900, orte: 'namen', namen: ['Luzern', 'Kriens', 'Emmen', 'Ebikon', 'Horw', 'Rothenburg', 'Adligenswil', 'Meggen', 'Root', 'Buchrain', 'Malters', 'Sursee', 'Hochdorf', 'Willisau'], sigma: 0.009, steps: 10, step: 0.0010, color: '#e9906a', weight: 1.2, opacity: 0.9 }
  ],
  erd_bauzonen: [{ art: 'flaechen', n: 90, ort: 'siedlung', ra: 0.002, rb: 0.005, fill: '#4fae63', fillOp: 0.55, stroke: '#2e7d3f', weight: 1 }],
  w_fluesse: [{ art: 'netz', color: '#7fb0ec', weight: 5, opacity: 0.9, zufluesse: 24, zsteps: 14, zstep: 0.0034, aussen: 14, asteps: 70, astep: 0.0045, acolor: '#b7dbff' }],
  w_seen: [{ art: 'seen' }],
  grundwasser: [{ art: 'puffer' }],
  ab_tunnel: [{ art: 'badges', n: 6, ort: 'ueberall', icon: 'fabrik', bg: '#f0a45e', border: '#b8651a', name: 'Abwärme aus Tunnel' }],
  szenario: [{ art: 'zellen' }],
  strom_prod_klein: [{ art: 'punkte', n: 2600, ort: 'siedlung', r: 2.5, fill: '#f7dc3a', stroke: '#6b5a00' }],
  // ---- Gültige räumliche Energieplanungen (erfunden, keine Vorlage) ----
  mg_netz: [{ art: 'flaechen', n: 36, ort: 'siedlung', ra: 0.003, rb: 0.007, fill: '#f9b36b', fillOp: 0.55, stroke: '#d9731a', weight: 2 }],
  mg_individuell: [{ art: 'flaechen', n: 40, ort: 'siedlung', ra: 0.004, rb: 0.01, fill: '#9bd89b', fillOp: 0.5, stroke: '#3f9a3f', weight: 2 }],
  koordination: [{ art: 'flaechen', n: 26, ort: 'siedlung', ra: 0.004, rb: 0.009, fill: '#cdb0f2', fillOp: 0.5, stroke: '#7a3fc0', dash: '6 4', weight: 2 }],
  gasnetz: [{ art: 'linien', n: 46, ort: 'siedlung', steps: 26, step: 0.0028, color: '#e8a317', weight: 3 }],
  thermisches_netz: [{ art: 'linien', n: 34, ort: 'siedlung', steps: 20, step: 0.0024, color: '#8a2fb5', weight: 3 }],
  // ---- EPA-Indikatoren ----
  // Wärmebedarf > 400 MWh/a: zusammenhängendes Raster (ca. 100 m) in den Siedlungsgebieten: blassrosa, im Kern kräftiger, vereinzelt dunkelgrau (Industrie). Nach Vorlage.
  ind1: [{ art: 'siedlungsraster', gross: { Luzern: 0.016, Kriens: 0.011, Emmen: 0.012, Horw: 0.009, Ebikon: 0.009, Rothenburg: 0.007, Sursee: 0.008, Willisau: 0.007, Hochdorf: 0.006, Malters: 0.006, Meggen: 0.006, Root: 0.005, Buchrain: 0.005, Adligenswil: 0.005, Dagmersellen: 0.005, Reiden: 0.005, Wolhusen: 0.005, Schüpfheim: 0.005, Escholzmatt: 0.004, Sempach: 0.005, Neuenkirch: 0.004, Ruswil: 0.004, Hitzkirch: 0.004, Beromünster: 0.004, Triengen: 0.004, Nebikon: 0.004, Altishofen: 0.003, Schötz: 0.003, Ettiswil: 0.003, Entlebuch: 0.004, Hasle: 0.003, Flühli: 0.003, Marbach: 0.003, Wiggen: 0.002 }, standard: 0.0028 }],
  ind5_reserve: [{ art: 'flaechen', n: 7, orte: 'namen', namen: ['Rothenburg', 'Neuenkirch', 'Luzern', 'Emmen', 'Hochdorf'], ra: 0.0006, rb: 0.0015, fill: '#e8101c', fillOp: 0.6, stroke: '#e8101c', weight: 1.5, sigma: 0.007 }],
  // Bauzonen: kleine, kompakte rote Gruppen in Reiden, Dagmersellen, Sursee, Hochdorf, Willisau, Rothenburg/Emmen, Buchrain/Root, Ebikon/Luzern und Horw (nach Vorlage)
  ind5_bauzone: [{ art: 'flaechen', n: 90, orte: 'namen', namen: ['Reiden', 'Dagmersellen', 'Sursee', 'Hochdorf', 'Willisau', 'Rothenburg', 'Emmen', 'Buchrain', 'Root', 'Ebikon', 'Luzern', 'Horw', 'Kriens'], ra: 0.0008, rb: 0.002, fill: '#e8101c', fillOp: 0.85, stroke: '#c40a14', weight: 1, sigma: 0.0045 }],
  lwwp_gebiete: [{ art: 'flaechen', n: 60, ort: 'siedlung', ra: 0.003, rb: 0.008, fill: '#f08a95', fillOp: 0.6, stroke: '#c42f3d', weight: 1 }],
  lwwp_parzellen: [{ art: 'quadrate', n: 400, ort: 'siedlung', s: 0.0005, fill: '#d62839', stroke: '#8f1623', weight: 0.5 }]
};

let flGemeindenCache = null;
function flGemeinden() {
  if (flGemeindenCache) return flGemeindenCache;
  const lab = {};
  (typeof GEMEINDE_BESCHRIFTUNG !== 'undefined' ? GEMEINDE_BESCHRIFTUNG : []).forEach(b => { lab[b.n] = b; });
  flGemeindenCache = GEMEINDEGRENZEN_LUZERN.features.map(f => {
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
    const rings = polys.map(p => p[0]);
    const b = [1e9, 1e9, -1e9, -1e9];
    rings.forEach(r => r.forEach(c => { b[0] = Math.min(b[0], c[0]); b[1] = Math.min(b[1], c[1]); b[2] = Math.max(b[2], c[0]); b[3] = Math.max(b[3], c[1]); }));
    const l = lab[f.properties.name];
    return { name: f.properties.name, rings, b, l: l ? [l.lon, l.lat] : [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2], flaeche: (b[2] - b[0]) * (b[3] - b[1]) };
  });
  return flGemeindenCache;
}
function flImRing(x, y, r) {
  let c = false;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const xi = r[i][0], yi = r[i][1], xj = r[j][0], yj = r[j][1];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
  }
  return c;
}
const flInGemeinde = (g, x, y) => x >= g.b[0] && x <= g.b[2] && y >= g.b[1] && y <= g.b[3] && g.rings.some(r => flImRing(x, y, r));
const flImKanton = (x, y) => flGemeinden().some(g => flInGemeinde(g, x, y));

function flRng(text) {
  let a = 0;
  for (let i = 0; i < text.length; i++) a = (Math.imul(a, 31) + text.charCodeAt(i)) | 0;
  return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const flGauss = r => (r() + r() + r() - 1.5) * 2;

// n Lagepunkte [lon, lat] gemäss Teil-Definition
function flPositionen(teil, r, n) {
  const G = flGemeinden(), summe = G.reduce((s, g) => s + g.flaeche, 0), out = [];
  const waehle = () => { let z = r() * summe; for (const g of G) { z -= g.flaeche; if (z <= 0) return g; } return G[G.length - 1]; };
  const namen = teil.orte === 'namen' ? G.filter(g => teil.namen.some(n2 => g.name.toLowerCase().startsWith(n2.toLowerCase()))) : null;
  for (let i = 0; i < n; i++) {
    let p = null;
    if (teil.orte === 'seen' && typeof SEEN_BESCHRIFTUNG !== 'undefined') {
      const o = SEEN_BESCHRIFTUNG[Math.floor(r() * SEEN_BESCHRIFTUNG.length)];
      p = [o.lon + (r() - 0.5) * 0.02, o.lat + (r() - 0.5) * 0.014];
    } else if (namen && namen.length) {
      const g = namen[Math.floor(r() * namen.length)], sg = teil.sigma || 0.006;
      for (let t = 0; t < 12 && !p; t++) { const x = g.l[0] + flGauss(r) * sg * 1.45, y = g.l[1] + flGauss(r) * sg; if (flInGemeinde(g, x, y)) p = [x, y]; }
      if (!p) p = g.l.slice();
    } else {
      const g = teil.ort === 'siedlung' ? G[Math.floor(r() * G.length)] : waehle();
      if (teil.ort === 'siedlung') for (let t = 0; t < 12 && !p; t++) { const x = g.l[0] + flGauss(r) * 0.011, y = g.l[1] + flGauss(r) * 0.006; if (flInGemeinde(g, x, y)) p = [x, y]; }
      for (let t = 0; t < 60 && !p; t++) { const x = g.b[0] + r() * (g.b[2] - g.b[0]), y = g.b[1] + r() * (g.b[3] - g.b[1]); if (flInGemeinde(g, x, y)) p = [x, y]; }
      if (!p) p = g.l.slice();
    }
    out.push(p);
  }
  return out;
}

// n Punkte im Umland des Kantons (ausserhalb der Luzerner Gemeinden, wie in der Vorlage bei den Industrie-Abwärmequellen)
function flAussen(r, n, cluster) {
  const G = flGemeinden(), b = [1e9, 1e9, -1e9, -1e9];
  G.forEach(g => { b[0] = Math.min(b[0], g.b[0]); b[1] = Math.min(b[1], g.b[1]); b[2] = Math.max(b[2], g.b[2]); b[3] = Math.max(b[3], g.b[3]); });
  const out = [], zufall = () => [b[0] - 0.2 + r() * (b[2] - b[0] + 0.4), b[1] - 0.15 + r() * (b[3] - b[1] + 0.3)];
  // mit cluster: die Punkte häufen sich um einige Orte im Umland (wie Industriegebiete der Nachbarkantone)
  const zentren = [];
  if (cluster) for (let i = 0; i < Math.max(4, Math.round(n / 14)); i++) { let z = zufall(); for (let t = 0; t < 30 && flImKanton(z[0], z[1]); t++) z = zufall(); zentren.push(z); }
  for (let t = 0; out.length < n && t < n * 80; t++) {
    let p = zufall();
    if (zentren.length) { const z = zentren[Math.floor(r() * zentren.length)]; p = [z[0] + flGauss(r) * 0.018 * 1.45, z[1] + flGauss(r) * 0.018]; }
    if (!flImKanton(p[0], p[1])) out.push(p);
  }
  return out;
}

// Catmull-Rom-Glättung eines Linienzugs [lon, lat] mit leichtem Rauschen
function flGlatt(wp, r, pro) {
  const out = [];
  for (let i = 0; i < wp.length - 1; i++) {
    const p0 = wp[Math.max(0, i - 1)], p1 = wp[i], p2 = wp[i + 1], p3 = wp[Math.min(wp.length - 1, i + 2)];
    for (let t = 0; t < pro; t++) {
      const u = t / pro, u2 = u * u, u3 = u2 * u;
      const f = k => 0.5 * ((2 * p1[k]) + (-p0[k] + p2[k]) * u + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * u2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * u3);
      out.push([f(0) + (r() - 0.5) * 0.0006, f(1) + (r() - 0.5) * 0.0004]);
    }
  }
  out.push(wp[wp.length - 1].slice());
  return out;
}

function flBadgeIcon(k) {
  return L.divIcon({
    className: 'fl-badge-wrap',
    html: '<span class="fl-badge' + (k.quadrat ? ' is-quadrat' : '') + '" style="background:' + k.bg + ';border-color:' + k.border + '"><svg viewBox="0 0 24 24" fill="' + (k.iconFill || '#1b1b1b') + '">' + FL_ICONS[k.icon] + '</svg></span>',
    iconSize: [22, 22]
  });
}

// Erzeugt die Ebene eines Fachlayers (leaflet LayerGroup). opt: { renderer, pane }
function erzeugeFachlayer(key, opt) {
  const teile = FACHLAYER_DUMMY[key];
  const gruppe = L.layerGroup();
  if (!teile) return gruppe;
  const r = flRng(key);
  const basis = { renderer: opt.renderer, pane: opt.pane, interactive: false };
  teile.forEach(teil => {
    // --- Siedlungsraster (Indikator 1) ---
    if (teil.art === 'siedlungsraster') {
      const cx = 0.0014, cy = 0.00095;   // ca. 100 m
      const rausch = (x, y) => (Math.sin(x * 420 + 0.6) * Math.cos(y * 520 + 1.1) + Math.sin(x * 260 - y * 310) + Math.cos(x * 700 + y * 640)) / 3;
      flGemeinden().forEach(g => {
        const sig = teil.gross[g.name] || teil.standard;
        const sx = sig * 1.45;
        const x0 = Math.max(g.b[0], g.l[0] - 3 * sx), x1 = Math.min(g.b[2], g.l[0] + 3 * sx), y0 = Math.max(g.b[1], g.l[1] - 3 * sig), y1 = Math.min(g.b[3], g.l[1] + 3 * sig);
        for (let x = x0; x < x1; x += cx) for (let y = y0; y < y1; y += cy) {
          const px = x + cx / 2, py = y + cy / 2;
          const dd = ((px - g.l[0]) / sx) ** 2 + ((py - g.l[1]) / sig) ** 2;
          const p = Math.exp(-dd / 2) + rausch(px, py) * 0.35;
          if (p < 0.2 || !flInGemeinde(g, px, py)) continue;
          const kern = p > 0.55;
          L.rectangle([[y, x], [y + cy, x + cx]], Object.assign({}, basis, { stroke: false, fillColor: kern ? '#ee9ba4' : '#f8c4c9', fillOpacity: kern ? 0.9 : 0.75 })).addTo(gruppe);
          if (p > 0.3 && r() < 0.035) L.rectangle([[y + cy * 0.15, x + cx * 0.15], [y + cy * 0.85, x + cx * 0.85]], Object.assign({}, basis, { stroke: false, fillColor: '#4d4d4d', fillOpacity: 0.85 })).addTo(gruppe);
        }
      });
      return;
    }
    // --- Seen: die tatsächlichen Seeflächen (dummy-seen-flaechen.js), hellblau gefüllt ---
    if (teil.art === 'seen') {
      if (typeof SEEN_FLAECHEN !== 'undefined') L.geoJSON(SEEN_FLAECHEN, Object.assign({}, basis, { style: () => ({ color: '#4a7fc0', weight: 1, fillColor: '#8cc0f2', fillOpacity: 0.85 }) })).addTo(gruppe);
      return;
    }
    // --- Gewässernetz: geglättete Hauptläufe plus zufällige Zuflüsse ---
    if (teil.art === 'netz') {
      const stil = Object.assign({}, basis, { color: teil.color, weight: teil.weight, opacity: teil.opacity || 1, lineCap: 'round', lineJoin: 'round' });
      const haupt = FL_FLUESSE.map(wp => flGlatt(wp, r, 8));
      haupt.forEach(pts => L.polyline(pts.map(([x, y]) => [y, x]), stil).addTo(gruppe));
      for (let i = 0; i < teil.zufluesse; i++) {
        const m = haupt[Math.floor(r() * haupt.length)], k = 1 + Math.floor(r() * (m.length - 2));
        const dir = Math.atan2(m[k + 1][1] - m[k - 1][1], (m[k + 1][0] - m[k - 1][0]) / 1.45) + (r() < 0.5 ? 1 : -1) * (1 + r() * 0.8);
        let a = dir, px = m[k][0], py = m[k][1];
        const pts = [[py, px]], steps = Math.round(teil.zsteps * (0.5 + r()));
        for (let s = 0; s < steps; s++) {
          a += (r() - 0.5) * 0.7; px += Math.cos(a) * teil.zstep * 1.45; py += Math.sin(a) * teil.zstep;
          if (!flImKanton(px, py)) break;
          pts.push([py, px]);
        }
        if (pts.length > 2) L.polyline(pts, stil).addTo(gruppe);
      }
      // Gewässer im Umland des Kantons (lange, mäandrierende Läufe ausserhalb der Luzerner Gemeinden, wie in der Vorlage)
      if (teil.aussen) {
        const b = [1e9, 1e9, -1e9, -1e9];
        flGemeinden().forEach(g => { b[0] = Math.min(b[0], g.b[0]); b[1] = Math.min(b[1], g.b[1]); b[2] = Math.max(b[2], g.b[2]); b[3] = Math.max(b[3], g.b[3]); });
        const innen = (x, y) => x > b[0] - 0.3 && x < b[2] + 0.3 && y > b[1] - 0.22 && y < b[3] + 0.22;
        for (let i = 0; i < teil.aussen; i++) {
          let px = 0, py = 0;
          for (let t = 0; t < 60; t++) { px = b[0] - 0.25 + r() * (b[2] - b[0] + 0.5); py = b[1] - 0.18 + r() * (b[3] - b[1] + 0.36); if (!flImKanton(px, py)) break; }
          let a = r() * Math.PI * 2;
          const pts = [[py, px]];
          for (let s = 0; s < teil.asteps; s++) {
            a += (r() - 0.5) * 0.45; px += Math.cos(a) * teil.astep * 1.45; py += Math.sin(a) * teil.astep;
            if (!innen(px, py) || flImKanton(px, py)) break;
            pts.push([py, px]);
          }
          if (pts.length > 4) L.polyline(pts, Object.assign({}, stil, { color: teil.acolor || teil.color })).addTo(gruppe);
        }
      }
      return;
    }
    // --- Grundwasservorkommen: breite Bänder entlang der Hauptläufe (aussen hell, innen dunkler) ---
    if (teil.art === 'puffer') {
      [{ w: [0.006, 0.013], fill: '#4aa3ea', op: 0.35 }, { w: [0.0025, 0.005], fill: '#2579c8', op: 0.5 }].forEach(stufe => {
        FL_FLUESSE.forEach(wp => {
          const pts = flGlatt(wp, r, 8), links = [], rechts = [], ph = r() * 6;
          pts.forEach((p, i) => {
            const q = pts[Math.min(pts.length - 1, i + 1)], o = pts[Math.max(0, i - 1)];
            const dx = (q[0] - o[0]) / 1.45, dy = q[1] - o[1], len = Math.hypot(dx, dy) || 1;
            const breite = stufe.w[0] + (stufe.w[1] - stufe.w[0]) * (0.5 + 0.5 * Math.sin(i * 0.35 + ph));
            links.push([p[1] + (dx / len) * breite, p[0] - (dy / len) * breite * 1.45]);
            rechts.push([p[1] - (dx / len) * breite, p[0] + (dy / len) * breite * 1.45]);
          });
          L.polygon(links.concat(rechts.reverse()), Object.assign({}, basis, { stroke: false, fillColor: stufe.fill, fillOpacity: stufe.op })).addTo(gruppe);
        });
      });
      return;
    }
    // --- Wärmeversorgungsszenario 2050: Parzellenmosaik (nach Vorlage) ---
    // Land: unregelmässige Parzellen (Raster mit verschobenen Ecken, lückenlos): braun, grau-weiss, rosa, selten dunkelrot/grün/blau.
    // Siedlungen: feine Blöcke (rot im Kern, grün am Rand, braun/weiss dazwischen). Seen: rosa.
    if (teil.art === 'zellen') {
      const hash = (i, j, k) => { const v = Math.sin(i * 127.1 + j * 311.7 + k * 74.7) * 43758.5453; return v - Math.floor(v); };
      const rausch = (x, y) => (Math.sin(x * 55 + 1.3) * Math.cos(y * 70 + 0.7) + 0.8 * Math.sin(x * 30 - y * 42 + 2.1) + 0.5 * Math.sin(x * 120 + y * 95)) / 2.3;
      const poly = (pts, fill, op, rand, grp) => L.polygon(pts, Object.assign({}, basis, { stroke: rand === 'grau' || rand === 'fein', color: rand === 'fein' ? '#9a9a9a' : '#8c8c8c', weight: rand === 'fein' ? 0.7 : 0.6, fillColor: fill, fillOpacity: op })).addTo(grp || gruppe);
      // 1) Landparzellen
      const cx = 0.0065, cy = 0.0045, x0 = 7.80, y0 = 46.74, nx = Math.ceil((8.56 - x0) / cx), ny = Math.ceil((47.31 - y0) / cy);
      const vx = (i, j) => [x0 + i * cx + (hash(i, j, 1) - 0.5) * 0.75 * cx, y0 + j * cy + (hash(i, j, 2) - 0.5) * 0.75 * cy];
      const G = flGemeinden();
      for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
        const mx = x0 + (i + 0.5) * cx, my = y0 + (j + 0.5) * cy;
        if (!G.some(g => flInGemeinde(g, mx, my))) continue;
        const v = rausch(mx, my) + (hash(i, j, 3) - 0.5) * 0.7, z = hash(i, j, 4);
        let fill = '#c8975f', op = 0.95, rand = '';
        if (v < -0.12) { fill = '#ececec'; op = 1; rand = 'grau'; } else if (v > 0.38) { fill = '#f9c8ec'; op = 1; }
        if (z < 0.018) fill = '#8b2a2a'; else if (z < 0.03) fill = '#2f9e6e'; else if (z < 0.037) fill = '#4a86c5'; else if (z < 0.045) fill = '#cfe3f6';
        const p = [vx(i, j), vx(i + 1, j), vx(i + 1, j + 1), vx(i, j + 1)].map(c => [c[1], c[0]]);
        poly(p, fill, op, rand);
      }
      // 2) Siedlungen mit Detailstufen: bis Zoom 13 grobe Blöcke (statisch), ab Zoom 14 Gebäude nur für den sichtbaren Ausschnitt
      //    (je näher, desto feiner; deterministisch, d. h. bei jedem Verschieben gleich).
      const gross = FACHLAYER_DUMMY.ind1[0].gross, std = FACHLAYER_DUMMY.ind1[0].standard;
      const grob = L.layerGroup(), fein = L.layerGroup();
      const stadt = g => { const sig = (gross[g.name] || std) * 1.1; return { sig, sx: sig * 1.45 }; };
      const dichte = (g, sig, sx, px, py) => Math.exp(-(((px - g.l[0]) / sx) ** 2 + ((py - g.l[1]) / sig) ** 2) / 2) + rausch(px * 3, py * 3) * 0.25;
      const blockFarbe = (kern, z) => kern
        ? (z < 0.55 ? '#b3202a' : z < 0.65 ? '#8b1a1a' : z < 0.8 ? '#2f9e6e' : z < 0.9 ? '#c8975f' : '#ececec')
        : (z < 0.45 ? '#2f9e6e' : z < 0.75 ? '#c8975f' : z < 0.85 ? '#b3202a' : z < 0.93 ? '#cfe3f6' : '#ececec');
      const bx = 0.002, by = 0.0013;
      G.forEach(g => {
        const { sig, sx } = stadt(g);
        const xa = Math.max(g.b[0], g.l[0] - 3 * sx), xb = Math.min(g.b[2], g.l[0] + 3 * sx), ya = Math.max(g.b[1], g.l[1] - 3 * sig), yb = Math.min(g.b[3], g.l[1] + 3 * sig);
        for (let x = xa; x < xb; x += bx) for (let y = ya; y < yb; y += by) {
          const px = x + bx / 2, py = y + by / 2, p = dichte(g, sig, sx, px, py);
          if (p < 0.2 || !flInGemeinde(g, px, py) || r() < 0.18) continue;
          const w = bx * (0.45 + r() * 0.5), h = by * (0.45 + r() * 0.5);
          poly([[y, x], [y, x + w], [y + h, x + w], [y + h, x]], blockFarbe(p > 0.5, r()), 1, '', grob);
        }
      });
      const stufe = z => z >= 16 ? [0.00028, 0.00019] : z >= 15 ? [0.00055, 0.00038] : [0.0011, 0.00075];
      const feinAktualisieren = m => {
        fein.clearLayers();
        if (m.getZoom() < 14) return;
        const [cw, ch] = stufe(m.getZoom()), B = m.getBounds().pad(0.25), key = Math.round(cw * 1e5);
        G.forEach(g => {
          const { sig, sx } = stadt(g);
          const xa = Math.max(g.l[0] - 3 * sx, B.getWest(), g.b[0]), xb = Math.min(g.l[0] + 3 * sx, B.getEast(), g.b[2]);
          const ya = Math.max(g.l[1] - 3 * sig, B.getSouth(), g.b[1]), yb = Math.min(g.l[1] + 3 * sig, B.getNorth(), g.b[3]);
          if (xa >= xb || ya >= yb) return;
          for (let ix = Math.floor(xa / cw); ix <= Math.floor(xb / cw); ix++) for (let iy = Math.floor(ya / ch); iy <= Math.floor(yb / ch); iy++) {
            const px = (ix + 0.5) * cw, py = (iy + 0.5) * ch, p = dichte(g, sig, sx, px, py);
            if (p < 0.2 || hash(ix, iy, key + 5) < 0.18 || imReal(px, py) || !flInGemeinde(g, px, py)) continue;
            const gew = p > 0.25 && rausch(px * 7, py * 7) > 0.62 && hash(ix, iy, key + 6) < 0.5;   // grosse Gewerbe-/Industriegebäude
            const fill = gew ? '#8b2a2a' : blockFarbe(p > 0.5, hash(ix, iy, key + 7)), k = gew ? 2.4 : 1;
            const w = cw * (0.5 + hash(ix, iy, key + 8) * 0.4) * k, h = ch * (0.5 + hash(ix, iy, key + 9) * 0.4) * k, x = ix * cw + cw * 0.08, y = iy * ch + ch * 0.08;
            poly([[y, x], [y, x + w], [y + h, x + w], [y + h, x]], fill, 1, 'fein', fein);
          }
        });
      };
      // Echte Gebäudegrundrisse (OpenStreetMap) im ganzen Kanton; sie ersetzen die erzeugten Zufallsgebäude
      const REAL = typeof GEBAEUDE_LUZERN !== 'undefined' ? GEBAEUDE_LUZERN : null, RB = [7.83, 46.77, 8.52, 47.30];   // ganzer Kanton
      const imReal = (x, y) => !!REAL && x >= RB[0] && x <= RB[2] && y >= RB[1] && y <= RB[3];
      let realGebaeude = null;
      const realDecodieren = () => {
        if (realGebaeude || !REAL) return realGebaeude;
        const KX = 111320 * Math.cos(47.05 * Math.PI / 180) / 1e5, KY = 111320 / 1e5;   // Meter pro Einheit (1e-5 Grad)
        realGebaeude = REAL.map((a, idx) => {
          let x = a[0], y = a[1]; const ring = [[x, y]];
          for (let i = 2; i < a.length; i += 2) { x += a[i]; y += a[i + 1]; ring.push([x, y]); }
          let f = 0, minx = 1e9, maxx = -1e9, miny = 1e9, maxy = -1e9;
          for (let i = 0; i < ring.length; i++) { const p = ring[i], q = ring[(i + 1) % ring.length]; f += p[0] * q[1] - q[0] * p[1]; minx = Math.min(minx, p[0]); maxx = Math.max(maxx, p[0]); miny = Math.min(miny, p[1]); maxy = Math.max(maxy, p[1]); }
          const lon = 8.25 + (minx + maxx) / 2e5, lat = 46.995 + (miny + maxy) / 2e5;
          return { ring: ring.map(p => [46.995 + p[1] / 1e5, 8.25 + p[0] / 1e5]), m2: Math.abs(f / 2) * KX * KY, lon, lat, idx, bb: [8.25 + minx / 1e5, 46.995 + miny / 1e5, 8.25 + maxx / 1e5, 46.995 + maxy / 1e5] };
        });
        return realGebaeude;
      };
      // Farbe nach Lage (nahe am Hauptort der nächsten Gemeinde: rot, weiter weg: grün/braun) und Grösse (Grossgebäude dunkelrot)
      const realFarbe = b => {
        if (b.nah === undefined) {
          let best = 1e9, sg = 0.003;
          G.forEach(g => { const dx = (b.lon - g.l[0]) / 1.45, dy = b.lat - g.l[1], q = dx * dx + dy * dy; if (q < best) { best = q; sg = (FACHLAYER_DUMMY.ind1[0].gross[g.name] || FACHLAYER_DUMMY.ind1[0].standard) * 1.1; } });
          b.nah = Math.sqrt(best) / sg;
        }
        const z = hash(b.idx, 3, 11);
        if (b.m2 > 2200) return z < 0.7 ? '#8b2a2a' : '#4a86c5';
        if (b.nah < 0.4) return z < 0.62 ? '#b3202a' : z < 0.72 ? '#8b1a1a' : z < 0.86 ? '#2f9e6e' : z < 0.94 ? '#c8975f' : '#ececec';
        if (b.nah < 1.0) return z < 0.3 ? '#b3202a' : z < 0.62 ? '#2f9e6e' : z < 0.88 ? '#c8975f' : z < 0.95 ? '#cfe3f6' : '#ececec';
        return z < 0.5 ? '#2f9e6e' : z < 0.85 ? '#c8975f' : z < 0.92 ? '#b3202a' : '#cfe3f6';
      };
      const realAktualisieren = m => {
        const gb = realDecodieren(); if (!gb) return;
        const B = m.getBounds().pad(0.2), W = B.getWest(), E = B.getEast(), S = B.getSouth(), N = B.getNorth();
        gb.forEach(b => {
          if (b.bb[2] < W || b.bb[0] > E || b.bb[3] < S || b.bb[1] > N) return;
          poly(b.ring, realFarbe(b), 1, 'fein', fein);
        });
      };
      let kartenRef = null;
      const aktualisieren = () => {
        if (!kartenRef) return;
        if (kartenRef.getZoom() >= 14) { gruppe.removeLayer(grob); gruppe.addLayer(fein); feinAktualisieren(kartenRef); realAktualisieren(kartenRef); }
        else { gruppe.removeLayer(fein); gruppe.addLayer(grob); }
      };
      gruppe.on('add', () => { kartenRef = gruppe._map; kartenRef.on('moveend', aktualisieren); aktualisieren(); });
      gruppe.on('remove', () => { if (kartenRef) kartenRef.off('moveend', aktualisieren); kartenRef = null; });
      // 3) grössere Industrie-/Gewerbeparzellen (dunkelrot) in den Hauptorten
      flPositionen({ orte: 'namen', namen: ['Luzern', 'Emmen', 'Kriens', 'Ebikon', 'Sursee', 'Rothenburg', 'Willisau', 'Dagmersellen', 'Reiden', 'Hochdorf'], sigma: 0.007 }, r, 70).forEach(([x, y]) => {
        const w = 0.001 + r() * 0.003, h = 0.0007 + r() * 0.002;
        poly([[y, x], [y, x + w], [y + h * 1.2, x + w * 1.1], [y + h, x]], r() < 0.2 ? '#4a86c5' : '#8b2a2a', 1, '');
      });
      // 4) Seen: rosa
      if (typeof SEEN_FLAECHEN !== 'undefined') L.geoJSON(SEEN_FLAECHEN, Object.assign({}, basis, { style: () => ({ stroke: false, fillColor: '#f9c8ec', fillOpacity: 1 }) })).addTo(gruppe);
      return;
    }
    const pos = (teil.fest ? teil.fest : flPositionen(teil, r, teil.n)).concat(teil.aussen ? flAussen(r, teil.aussen, teil.aussenCluster) : []);
    pos.forEach(([x, y]) => {
      if (teil.art === 'punkte') {
        L.circleMarker([y, x], Object.assign({}, basis, { radius: teil.r, color: teil.stroke, weight: 1, fillColor: teil.fill, fillOpacity: 1 })).addTo(gruppe);
      } else if (teil.art === 'quadrate') {
        const s = teil.s * (0.7 + r() * 0.6), sx = s * 1.45;
        L.polygon([[y - s, x - sx], [y - s, x + sx], [y + s, x + sx], [y + s, x - sx]], Object.assign({}, basis, { stroke: !!teil.stroke, color: teil.stroke || teil.fill, weight: teil.weight || 1, fillColor: teil.fill, fillOpacity: teil.fillOp || 1 })).addTo(gruppe);
      } else if (teil.art === 'linien') {
        let a = r() * Math.PI * 2, px = x, py = y;
        const pts = [[py, px]];
        for (let i = 0; i < teil.steps; i++) {
          a += (r() - 0.5) * 0.9; px += Math.cos(a) * teil.step * 1.45; py += Math.sin(a) * teil.step;
          if (!flImKanton(px, py)) break;
          pts.push([py, px]);
        }
        if (pts.length > 1) L.polyline(pts, Object.assign({}, basis, { color: teil.color, weight: teil.weight, opacity: teil.opacity || 1, lineCap: 'round', lineJoin: 'round' })).addTo(gruppe);
      } else if (teil.art === 'flaechen') {
        const ra = teil.ra + r() * (teil.rb - teil.ra), pts = [];
        for (let i = 0; i < 9; i++) { const w = (i / 9) * Math.PI * 2, rad = ra * (0.6 + r() * 0.8); pts.push([y + Math.sin(w) * rad, x + Math.cos(w) * rad * 1.45]); }
        L.polygon(pts, Object.assign({}, basis, { stroke: !!teil.stroke, color: teil.stroke || teil.fill, weight: teil.weight || 1, dashArray: teil.dash || null, lineCap: teil.punktlinie ? 'round' : 'butt', fillColor: teil.fill, fillOpacity: teil.fillOp })).addTo(gruppe);
      } else if (teil.art === 'badges') {
        let k = teil;
        if (teil.kat) { let z = r() * teil.kat.reduce((s, c) => s + c.w, 0); k = teil.kat.find(c => (z -= c.w) <= 0) || teil.kat[0]; }
        L.marker([y, x], { pane: opt.pane, interactive: false, keyboard: false, icon: flBadgeIcon(k) }).addTo(gruppe);
      }
    });
  });
  return gruppe;
}

// Eigener Layer «Gebäude»: echte Gebäudegrundrisse im ganzen Kanton (OpenStreetMap, dummy-gebaeude-luzern.js), ab Zoom 14, nur für den sichtbaren Ausschnitt gezeichnet.
let flGebaeudeCache = null;
function flGebaeudeDecodieren() {
  if (flGebaeudeCache || typeof GEBAEUDE_LUZERN === 'undefined') return flGebaeudeCache;
  flGebaeudeCache = GEBAEUDE_LUZERN.map(a => {
    let x = a[0], y = a[1]; const ring = [[46.995 + y / 1e5, 8.25 + x / 1e5]];
    let minx = x, maxx = x, miny = y, maxy = y;
    for (let i = 2; i < a.length; i += 2) { x += a[i]; y += a[i + 1]; ring.push([46.995 + y / 1e5, 8.25 + x / 1e5]); minx = Math.min(minx, x); maxx = Math.max(maxx, x); miny = Math.min(miny, y); maxy = Math.max(maxy, y); }
    return { ring, bb: [8.25 + minx / 1e5, 46.995 + miny / 1e5, 8.25 + maxx / 1e5, 46.995 + maxy / 1e5] };
  });
  return flGebaeudeCache;
}
function erzeugeGebaeudeLayer(opt) {
  const gruppe = L.layerGroup(), stil = { renderer: opt.renderer, pane: opt.pane, interactive: false, stroke: true, color: '#444', weight: 0.5, fillColor: '#6b6b6b', fillOpacity: opt.deckkraft };
  let karte = null;
  const zeichnen = () => {
    gruppe.clearLayers();
    const gb = flGebaeudeDecodieren();
    if (!karte || !gb || karte.getZoom() < 14) return;
    const B = karte.getBounds().pad(0.2), W = B.getWest(), E = B.getEast(), S = B.getSouth(), N = B.getNorth();
    gb.forEach(b => { if (!(b.bb[2] < W || b.bb[0] > E || b.bb[3] < S || b.bb[1] > N)) L.polygon(b.ring, stil).addTo(gruppe); });
  };
  gruppe.on('add', () => { karte = gruppe._map; karte.on('moveend', zeichnen); zeichnen(); });
  gruppe.on('remove', () => { if (karte) karte.off('moveend', zeichnen); karte = null; });
  return gruppe;
}

// Eigener Layer «Gewässer»: Seen (dummy-seen-flaechen.js) und Fliessgewässer (OpenStreetMap, dummy-gewaesser-luzern.js). Bäche erscheinen ab Zoom 12.
function erzeugeGewaesserLayer(opt) {
  const gruppe = L.layerGroup(), baeche = L.layerGroup(), basis = { renderer: opt.renderer, pane: opt.pane, interactive: false };
  if (typeof SEEN_FLAECHEN !== 'undefined') L.geoJSON(SEEN_FLAECHEN, Object.assign({}, basis, { style: () => ({ color: '#4a86c5', weight: 1, fillColor: '#9fcdf2', fillOpacity: 0.85 }) })).addTo(gruppe);
  const linien = (liste, stil, ziel) => liste.forEach(a => {
    let x = a[0], y = a[1]; const pts = [[46.995 + y / 1e5, 8.25 + x / 1e5]];
    for (let i = 2; i < a.length; i += 2) { x += a[i]; y += a[i + 1]; pts.push([46.995 + y / 1e5, 8.25 + x / 1e5]); }
    L.polyline(pts, Object.assign({}, basis, stil)).addTo(ziel);
  });
  if (typeof GEWAESSER_LUZERN !== 'undefined') {
    linien(GEWAESSER_LUZERN.fluesse, { color: '#7fb0e0', weight: 1.6, opacity: 0.8, lineCap: 'round', lineJoin: 'round' }, gruppe);
    linien(GEWAESSER_LUZERN.baeche, { color: '#a3c8ec', weight: 0.8, opacity: 0.7, lineCap: 'round', lineJoin: 'round' }, baeche);
  }
  let karte = null;
  const zoom = () => { if (!karte) return; const z = karte.getZoom() >= 12; if (z && !gruppe.hasLayer(baeche)) gruppe.addLayer(baeche); else if (!z && gruppe.hasLayer(baeche)) gruppe.removeLayer(baeche); };
  gruppe.on('add', () => { karte = gruppe._map; karte.on('zoomend', zoom); zoom(); });
  gruppe.on('remove', () => { if (karte) karte.off('zoomend', zoom); karte = null; });
  return gruppe;
}
