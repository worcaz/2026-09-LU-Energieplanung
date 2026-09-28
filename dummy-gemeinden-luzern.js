/* =============================================================
   Offizielle Liste der 79 politischen Gemeinden des Kantons Luzern
   (alphabetisch) inkl. zugeordneter Haupt-Postleitzahl.

   Der "name" entspricht jeweils der im übrigen Dummy-Datensatz
   verwendeten Kurzform (z.B. "Aesch" statt "Aesch (LU)", "Hasle"
   statt "Hasle (LU)", "Hergiswil" statt "Hergiswil bei Willisau"),
   damit er direkt mit planung.gemeinde übereinstimmt.

   Wird u.a. für Dummy-Adressdaten (Kontoinformationen Förderbeitrag)
   verwendet — siehe findGemeindePlz() in app.js / fillPlanungDetails().
   Muss vor app.js geladen werden (siehe index.html), da app.js beim
   Aufbau der initialen Dummy-Planungen bereits darauf zugreift.
   ============================================================= */
const GEMEINDEN_LUZERN_PLZ = [
  { name: 'Adligenswil', plz: 6043 },
  { name: 'Aesch', plz: 6287 },
  { name: 'Alberswil', plz: 6248 },
  { name: 'Altbüron', plz: 6147 },
  { name: 'Altishofen', plz: 6144 },
  { name: 'Ballwil', plz: 6275 },
  { name: 'Beromünster', plz: 6025 },
  { name: 'Buchrain', plz: 6033 },
  { name: 'Büron', plz: 6233 },
  { name: 'Buttisholz', plz: 6018 },
  { name: 'Dagmersellen', plz: 6252 },
  { name: 'Dierikon', plz: 6036 },
  { name: 'Doppleschwand', plz: 6112 },
  { name: 'Ebikon', plz: 6030 },
  { name: 'Egolzwil', plz: 6243 },
  { name: 'Eich', plz: 6205 },
  { name: 'Emmen', plz: 6020 },
  { name: 'Entlebuch', plz: 6161 },
  { name: 'Ermensee', plz: 6294 },
  { name: 'Eschenbach', plz: 6274 },
  { name: 'Escholzmatt-Marbach', plz: 6182 },
  { name: 'Ettiswil', plz: 6218 },
  { name: 'Fischbach', plz: 6145 },
  { name: 'Flühli', plz: 6173 },
  { name: 'Geuensee', plz: 6232 },
  { name: 'Gisikon', plz: 6038 },
  { name: 'Greppen', plz: 6404 },
  { name: 'Grossdietwil', plz: 6146 },
  { name: 'Grosswangen', plz: 6022 },
  { name: 'Hasle', plz: 6166 },
  { name: 'Hergiswil', plz: 6133 },
  { name: 'Hildisrieden', plz: 6024 },
  { name: 'Hitzkirch', plz: 6285 },
  { name: 'Hochdorf', plz: 6280 },
  { name: 'Hohenrain', plz: 6276 },
  { name: 'Horw', plz: 6048 },
  { name: 'Inwil', plz: 6034 },
  { name: 'Knutwil', plz: 6213 },
  { name: 'Kriens', plz: 6010 },
  { name: 'Luthern', plz: 6156 },
  { name: 'Luzern', plz: 6003 },
  { name: 'Malters', plz: 6102 },
  { name: 'Mauensee', plz: 6210 },
  { name: 'Meggen', plz: 6045 },
  { name: 'Meierskappel', plz: 6344 },
  { name: 'Menznau', plz: 6122 },
  { name: 'Nebikon', plz: 6244 },
  { name: 'Neuenkirch', plz: 6206 },
  { name: 'Nottwil', plz: 6207 },
  { name: 'Oberkirch', plz: 6208 },
  { name: 'Pfaffnau', plz: 6264 },
  { name: 'Rain', plz: 6026 },
  { name: 'Reiden', plz: 6260 },
  { name: 'Rickenbach', plz: 6221 },
  { name: 'Römerswil', plz: 6027 },
  { name: 'Roggliswil', plz: 6265 },
  { name: 'Romoos', plz: 6113 },
  { name: 'Root', plz: 6037 },
  { name: 'Rothenburg', plz: 6023 },
  { name: 'Ruswil', plz: 6017 },
  { name: 'Schenkon', plz: 6214 },
  { name: 'Schlierbach', plz: 6231 },
  { name: 'Schötz', plz: 6143 },
  { name: 'Schongau', plz: 6288 },
  { name: 'Schüpfheim', plz: 6170 },
  { name: 'Schwarzenberg', plz: 6013 },
  { name: 'Sempach', plz: 6204 },
  { name: 'Sursee', plz: 6210 },
  { name: 'Triengen', plz: 6234 },
  { name: 'Udligenswil', plz: 6044 },
  { name: 'Ufhusen', plz: 6153 },
  { name: 'Vitznau', plz: 6354 },
  { name: 'Wauwil', plz: 6242 },
  { name: 'Weggis', plz: 6353 },
  { name: 'Werthenstein', plz: 6105 },
  { name: 'Wikon', plz: 4806 },
  { name: 'Willisau', plz: 6130 },
  { name: 'Wolhusen', plz: 6110 },
  { name: 'Zell', plz: 6144 },
];

function findGemeindePlz(gemeinde) {
  const entry = GEMEINDEN_LUZERN_PLZ.find(g => g.name === gemeinde);
  return entry ? entry.plz : null;
}
