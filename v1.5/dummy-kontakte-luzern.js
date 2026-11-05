/* =============================================================
   Zusätzliche Dummy-Kontakte: Gemeinden, Ingenieure, GIS-Dienstleister
   und Energieberater aus dem Kanton Luzern.
   Ergänzt das in app.js definierte contacts-Array.
   ============================================================= */

(function () {
  const NEUE_KONTAKTE = [
    // --- Gemeinden (Bauverwaltung / Energiefachstelle) ---
    { vorname: 'Stefan', nachname: 'Bucher', organisation: 'Gemeinde Emmen', email: 'stefan.bucher@emmen.ch' },
    { vorname: 'Priska', nachname: 'Wyss', organisation: 'Gemeinde Kriens', email: 'priska.wyss@kriens.ch' },
    { vorname: 'Daniel', nachname: 'Steiner', organisation: 'Gemeinde Horw', email: 'daniel.steiner@horw.ch' },
    { vorname: 'Corina', nachname: 'Bissig', organisation: 'Gemeinde Ebikon', email: 'corina.bissig@ebikon.ch' },
    { vorname: 'Beat', nachname: 'Zimmermann', organisation: 'Gemeinde Sursee', email: 'beat.zimmermann@sursee.ch' },
    { vorname: 'Nadine', nachname: 'Studer', organisation: 'Gemeinde Willisau', email: 'nadine.studer@willisau.ch' },
    { vorname: 'Urs', nachname: 'Hodel', organisation: 'Gemeinde Hochdorf', email: 'urs.hodel@hochdorf.ch' },
    { vorname: 'Manuela', nachname: 'Widmer', organisation: 'Gemeinde Sempach', email: 'manuela.widmer@sempach.ch' },
    { vorname: 'Christoph', nachname: 'Portmann', organisation: 'Gemeinde Rothenburg', email: 'christoph.portmann@rothenburg.ch' },
    { vorname: 'Sabrina', nachname: 'Lustenberger', organisation: 'Gemeinde Malters', email: 'sabrina.lustenberger@malters.ch' },
    { vorname: 'Thomas', nachname: 'Wicki', organisation: 'Gemeinde Reiden', email: 'thomas.wicki@reiden.ch' },
    { vorname: 'Karin', nachname: 'Bühlmann', organisation: 'Gemeinde Schüpfheim', email: 'karin.buehlmann@schuepfheim.ch' },
    { vorname: 'Andreas', nachname: 'Häfliger', organisation: 'Gemeinde Hitzkirch', email: 'andreas.haefliger@hitzkirch.ch' },
    { vorname: 'Monika', nachname: 'Vogel', organisation: 'Gemeinde Neuenkirch', email: 'monika.vogel@neuenkirch.ch' },
    { vorname: 'Peter', nachname: 'Gassmann', organisation: 'Gemeinde Ruswil', email: 'peter.gassmann@ruswil.ch' },

    // --- Ingenieure ---
    { vorname: 'Lukas', nachname: 'Meyer', organisation: 'Meyer Ingenieure AG', email: 'lukas.meyer@meyer-ing.ch' },
    { vorname: 'Fabienne', nachname: 'Bachmann', organisation: 'BSB+Partner Ingenieure', email: 'fabienne.bachmann@bsbpartner.ch' },
    { vorname: 'Reto', nachname: 'Amrein', organisation: 'Amrein Energietechnik AG', email: 'reto.amrein@amrein-energietechnik.ch' },
    { vorname: 'Simone', nachname: 'Kaufmann', organisation: 'IBB Ingenieurbüro Bucher', email: 'simone.kaufmann@ibb-bucher.ch' },
    { vorname: 'Michael', nachname: 'Roos', organisation: 'Roos Elektroplanung GmbH', email: 'michael.roos@roos-elektro.ch' },
    { vorname: 'Vanessa', nachname: 'Hunkeler', organisation: 'Hunkeler Bauingenieure AG', email: 'vanessa.hunkeler@hunkeler-ing.ch' },
    { vorname: 'Patrick', nachname: 'Estermann', organisation: 'Estermann + Cie Haustechnik', email: 'patrick.estermann@estermann-haustechnik.ch' },
    { vorname: 'Larissa', nachname: 'Bieri', organisation: 'Bieri Energie- und Gebäudetechnik', email: 'larissa.bieri@bieri-energietechnik.ch' },
    { vorname: 'Stefan', nachname: 'Wüest', organisation: 'Wüest Ingenieure Zentralschweiz', email: 'stefan.wueest@wueest-ing.ch' },
    { vorname: 'Andrea', nachname: 'Bossard', organisation: 'Bossard Klimaingenieure AG', email: 'andrea.bossard@bossard-klima.ch' },

    // --- GIS-Dienstleister ---
    { vorname: 'Nicole', nachname: 'Furrer', organisation: 'GeoTask GmbH', email: 'nicole.furrer@geotask.ch' },
    { vorname: 'Marc', nachname: 'Lussi', organisation: 'GEOSol AG', email: 'marc.lussi@geosol.ch' },
    { vorname: 'Tanja', nachname: 'Wermelinger', organisation: 'GeoInfo Zentralschweiz', email: 'tanja.wermelinger@geoinfo-zch.ch' },
    { vorname: 'Dominik', nachname: 'Erni', organisation: 'Geoinformationszentrum Kanton Luzern', email: 'dominik.erni@lu.ch' },
    { vorname: 'Sarah', nachname: 'Kunz', organisation: 'GISpoint AG', email: 'sarah.kunz@gispoint.ch' },
    { vorname: 'Yves', nachname: 'Wattinger', organisation: 'GeoPartner GmbH', email: 'yves.wattinger@geopartner.ch' },
    { vorname: 'Melanie', nachname: 'Röthlin', organisation: 'GeoData Solutions AG', email: 'melanie.roethlin@geodata-solutions.ch' },
    { vorname: 'Christian', nachname: 'Bühler', organisation: 'Terra Vermessung + GIS AG', email: 'christian.buehler@terra-gis.ch' },

    // --- Energieberater ---
    { vorname: 'Barbara', nachname: 'Iten', organisation: 'Energieberatung Zentralschweiz', email: 'barbara.iten@energieberatung-zch.ch' },
    { vorname: 'Werner', nachname: 'Achermann', organisation: 'Achermann Energiecoaching', email: 'werner.achermann@energiecoaching.ch' },
    { vorname: 'Jasmin', nachname: 'Hess', organisation: 'EnergieForum Luzern', email: 'jasmin.hess@energieforum-luzern.ch' },
    { vorname: 'Kevin', nachname: 'Zemp', organisation: 'Zemp Energieplanung GmbH', email: 'kevin.zemp@zemp-energie.ch' },
    { vorname: 'Rita', nachname: 'Ineichen', organisation: 'Ineichen Energieberatung', email: 'rita.ineichen@ineichen-energie.ch' },
    { vorname: 'Adrian', nachname: 'Schmidiger', organisation: 'Impulsberatung Energie Luzern', email: 'adrian.schmidiger@impuls-energie.ch' },
    { vorname: 'Claudia', nachname: 'Bühlmann', organisation: 'Energie Coaching Zentralschweiz', email: 'claudia.buehlmann@energiecoaching-zch.ch' }
  ];

  NEUE_KONTAKTE.forEach(c => contacts.push(c));

  render();
})();
