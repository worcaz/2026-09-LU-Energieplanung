/* =============================================================
   Dummy-Daten für den Report "EPA Masterplan": kantonsweite Übersicht
   zu EPA-Beratung, Energiestadt-Zertifizierung, regionaler (REG-EP)
   und kommunaler (KOM-EP) Energieplanung, Gasversorgung und
   Ortsplanungsrevision je Gemeinde.
   Spaltenstruktur und Wertebereiche orientieren sich am kantonalen
   Tracking-Sheet; die konkreten Werte sind generierte Dummy-Daten.
   ============================================================= */

(function () {
  const ALLE_GEMEINDEN_LUZERN = [
    'Adligenswil', 'Aesch', 'Alberswil', 'Altbüron', 'Altishofen', 'Ballwil', 'Beromünster',
    'Buchrain', 'Büron', 'Buttisholz', 'Dagmersellen', 'Dierikon', 'Doppleschwand', 'Ebikon',
    'Egolzwil', 'Eich', 'Emmen', 'Entlebuch', 'Ermensee', 'Eschenbach', 'Escholzmatt-Marbach',
    'Ettiswil', 'Fischbach', 'Flühli', 'Geuensee', 'Gisikon', 'Greppen', 'Grossdietwil',
    'Grosswangen', 'Hasle', 'Hergiswil', 'Hildisrieden', 'Hitzkirch', 'Hochdorf', 'Hohenrain',
    'Horw', 'Inwil', 'Knutwil', 'Kriens', 'Luthern', 'Luzern', 'Malters', 'Mauensee', 'Meggen',
    'Meierskappel', 'Menznau', 'Nebikon', 'Neuenkirch', 'Nottwil', 'Oberkirch', 'Pfaffnau',
    'Rain', 'Reiden', 'Rickenbach', 'Römerswil', 'Roggliswil', 'Romoos', 'Root', 'Rothenburg',
    'Ruswil', 'Schenkon', 'Schlierbach', 'Schötz', 'Schongau', 'Schüpfheim', 'Schwarzenberg',
    'Sempach', 'Sursee', 'Triengen', 'Udligenswil', 'Ufhusen', 'Vitznau', 'Wauwil', 'Weggis',
    'Werthenstein', 'Wikon', 'Willisau', 'Wolhusen', 'Zell'
  ];

  const EPA_BERATER_POOL = [
    { berater: 'Moritz Kulawik', firma: 'e4Plus' },
    { berater: 'Katja Schürmann', firma: 'Abicht Zug' },
    { berater: 'Anna Maeder', firma: 'Kost & Partner' },
    { berater: 'Claudia Luethi', firma: 'luethi+partner' },
    { berater: 'Alexandra Staubli', firma: 'e4Plus' },
    { berater: 'Daniel Kaufmann', firma: 'Abicht Zug' },
    { berater: 'Priska Lorenz', firma: 'e4Plus' },
    { berater: 'Chris Steffen', firma: 'diePROJEKTFABRIK' },
    { berater: 'Yolanda Deubelbeiss', firma: 'diePROJEKTFABRIK' },
    { berater: 'Markus Portmann', firma: 'e4Plus' },
    { berater: 'Elias Estermann', firma: 'OekoWatt' }
  ];

  const REG_EP_POOL = [
    { name: 'EP Idee-Seetal', buero: 'e4Plus' },
    { name: 'EP Sursee-Mittelland', buero: 'e4Plus' },
    { name: 'WP Luzern Nord und Ost', buero: 'BapGroup' },
    { name: 'EP Zofingen Regio', buero: 'EBP' },
    { name: 'EP Biosphäre Entlebuch', buero: 'e4Plus' }
  ];

  const KOM_EP_STATUS = ['erstellt', 'geplant', 'in Erarbeitung', 'unbekannt'];
  const GASVERSORGER = ['ewl', 'WWZ', 'CKW'];
  const INFO_NOTIZEN = [
    'EPA vorgelagert zum ES-Prozess.',
    'Erste Kontaktaufnahme erfolgt, Rückmeldung der Gemeinde ausstehend.',
    'Termin für Kick-off noch offen.',
    'Gemeinde prüft Beitritt zur regionalen Energieplanung.',
    'Rückfrage zur Fördersumme bei der Dienststelle eingereicht.'
  ];

  function shortYearDate(y, m, d) {
    return `${pad2(d)}.${pad2(m)}.${String(y).slice(2)}`;
  }

  function buildEpaMasterplanRow(gemeinde) {
    const abgeschlossen = pick(['Ja', 'Nein', 'Nein', 'Nein']);
    const geplantJahr = randomInt(2024, 2028);
    const beraterPaar = pick(EPA_BERATER_POOL);

    let kickoff, gesuchseingang, gesuchsNr, auszahlungsdatum;
    if (abgeschlossen === 'Ja') {
      kickoff = shortYearDate(geplantJahr, randomInt(1, 12), randomInt(1, 28));
      gesuchseingang = 7200;
      gesuchsNr = randomInt(2500, 2650);
      auszahlungsdatum = Math.random() < 0.6 ? shortYearDate(geplantJahr + 1, randomInt(1, 12), randomInt(1, 28)) : '-';
    } else {
      kickoff = pick([
        `Kontaktaufnahme im ${geplantJahr} geplant`,
        `Herbst / Winter ${geplantJahr}`,
        `voraussichtlich ${String(geplantJahr).slice(2)}`,
        'Termin noch offen'
      ]);
      gesuchseingang = '-';
      gesuchsNr = '-';
      auszahlungsdatum = '-';
    }

    const esZert = pick(['Ja', 'Nein', 'Nein', 'Mitglied Trägerverein']);

    const regEpStatus = pick(['Ja', 'Nein', 'Nein', 'In Arbeit']);
    let regEpName = '-', regEpBuero = '-', regEpJahr = '-';
    if (regEpStatus !== 'Nein') {
      const r = pick(REG_EP_POOL);
      regEpName = r.name;
      regEpBuero = r.buero;
      regEpJahr = randomInt(2015, 2024);
    }

    const komEp = pick(KOM_EP_STATUS);
    const komEpJahr = komEp === 'erstellt' ? randomInt(2014, 2023) : '-';
    const komEpRevision = Math.random() < 0.3 ? randomInt(2025, 2028) : '-';

    const gasnetz = pick(['Ja', 'Nein', 'Nein', 'Nein']);
    const gasversorger = gasnetz === 'Ja' ? pick(GASVERSORGER) : '-';

    const ortsplanungsrevision = Math.random() < 0.4 ? randomInt(2025, 2028) : '-';
    const info = Math.random() < 0.2 ? pick(INFO_NOTIZEN) : '-';

    return {
      gemeinde,
      epaBeratungAbgeschlossen: abgeschlossen,
      epaGeplant: geplantJahr,
      epaBerater: beraterPaar.berater,
      epaFirma: beraterPaar.firma,
      epaKickoff: kickoff,
      epaGesuchseingang: gesuchseingang,
      epaGesuchsNr: gesuchsNr,
      epaAuszahlungsdatum: auszahlungsdatum,
      esZert,
      regEp: regEpStatus,
      regEpName,
      regEpBuero,
      regEpJahr,
      komEp,
      komEpJahr,
      komEpRevision,
      gasnetz,
      gasversorger,
      ortsplanungsrevision,
      info
    };
  }

  window.EPA_MASTERPLAN = ALLE_GEMEINDEN_LUZERN.map(buildEpaMasterplanRow);
})();
