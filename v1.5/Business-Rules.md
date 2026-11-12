# Energieplanung Kanton Luzern – Business Rules (Version 1.5)

Stand: 2026-11-12 · Gilt für den Prototyp in `v1.5/` (reines Frontend, Mock-Daten, kein Backend).

Dieses Dokument beschreibt die fachlichen Regeln, die das System durchsetzen muss. Es ist die Grundlage für die Umsetzung durch Entwickler/innen. Wo der Prototyp eine Regel nur teilweise oder gar nicht durchsetzt, steht das unter **Hinweis / Lücke**.

Verweise auf den Code (`app.js`) nennen die Funktion, damit sich die Regel nachschlagen lässt.

> **Pflege:** Dieses Dokument wird bei jeder Änderung an einer fachlichen Regel mitgeführt (siehe `CLAUDE.md`). Der Änderungsverlauf steht am Ende.

---

## 1. Begriffe und Datenmodell

| Begriff | Bedeutung |
|---|---|
| **Energieplanung** (EP) | Eine Planung einer Gemeinde (kommunal) oder mehrerer Gemeinden (regional). ID `EP-<Nr>`. |
| **EPA-Beratung** | Beratungsprozess des Kantons zur Energieplanung (Teil einer EP). |
| **Massnahme** | Einzelne Massnahme innerhalb einer EP. ID `M-<Nr>`. |
| **Nachführung** | Wiederkehrende Überprüfung von Verantwortlichen Personen, Zielen und Massnahmen nach Abschluss der Beratung. |
| **Kontakt** | Person (Gemeinde oder externe Fachperson), die als Verantwortliche/r oder Berater/in zugewiesen werden kann. |
| **Gesuch** | Fördergesuch an den Kanton, inkl. Kontoinformationen für den Förderbeitrag. |

Formate: Datum `dd.MM.yyyy`. Geldbeträge als ganze Franken, Anzeige mit Apostroph als Tausendertrenner, z. B. `12'500 CHF`. Fehlende Werte werden intern als `-` gespeichert und in der Ansicht als «Noch nicht erfasst» angezeigt.

---

## 2. Energieplanung

### 2.1 Anlegen
- Typ ist Pflicht: **Kommunal** (genau 1 Gemeinde) oder **Regional** (mindestens 2 Gemeinden).
- Pro Gemeinde und Typ darf es nur **eine** Energieplanung geben. Existiert für mindestens eine der gewählten Gemeinden bereits eine EP desselben Typs, wird das Anlegen abgelehnt. Die Meldung verlinkt auf die bestehende EP.
- Eine neue EP startet im Status **Entwurf**. Die ID wird fortlaufend vergeben.
- Name: `<Typ> <Gemeinde(n)>`.

### 2.2 Status (Prozessstatus) und Stepper
Reihenfolge: **Entwurf → Verabschiedung → Fördergesuch → Abschluss**.

- Der Status kann über den Stepper oder das Statusfeld im Bearbeiten-Formular gesetzt werden, auch rückwärts.
- Ein Statuswechsel ist nur möglich, wenn die **Pflichtfelder des Zielstatus** gefüllt sind (siehe 2.3). Fehlen Felder, öffnet das System das Bearbeiten-Formular und markiert die fehlenden Felder. Der Status wird erst beim erfolgreichen Speichern gesetzt.

### 2.3 Pflichtfelder je Status
| Feld | Pflicht ab |
|---|---|
| Planungstyp, Gemeinde(n) | immer |
| Beratungsperson | Fördergesuch |
| Datum Beratungsbeginn | Fördergesuch |
| Bedarf eines Energierichtplans? (Ja/Nein) | Fördergesuch |
| Bedarf einer Koordination mit weiteren Gemeinden? (Ja/Nein) | Fördergesuch |
| Gebiete mit Koordinationsbedarf vorhanden? (Ja/Nein) | Fördergesuch |
| Kontoinhaber/in, Adresse, IBAN | Fördergesuch |

«Fördergesuch» gilt auch für den Status **Abschluss** (er schliesst alle Pflichten von Fördergesuch ein). Ein Wert gilt als leer, wenn er leer oder `-` ist. Die Beraterperson ist auf **externe Fachpersonen** beschränkt (keine Gemeindekontakte).

### 2.4 Prozessschritte (Tabs) und Aktionen
Die Detailansicht führt durch 5 Schritte. Der aktuelle Schritt ergibt sich aus Status und Daten:

| Schritt | Tab | Bedingung | Aktion am Ende des Schritts |
|---|---|---|---|
| 1 | Grunddaten | Status Entwurf, Beratung noch nicht gestartet (kein Beratungsbeginn) | «EPA Beratung starten» → setzt Datum Beratungsbeginn auf heute |
| 2 | EPA Beratung | Status Entwurf, Beratung gestartet | «EPA Beratung abschliessen» → Status **Verabschiedung** |
| 3 | Massnahmen | Status Verabschiedung | «Weiter zum Gesuch» → Status **Fördergesuch** (prüft die Pflichtfelder von «Verabschiedung») |
| 4 | Gesuch | Status Fördergesuch | «Fördergesuch eingereicht» → setzt Gesuchseingang auf heute und vergibt die Gesuchs-Nr. (siehe 2.6); danach «Beratung abschliessen» → Status **Abschluss** (prüft die Pflichtfelder von «Abschluss») |
| 5 | Nachführung | Status Abschluss | siehe Abschnitt 4 |

Schlägt die Pflichtfeldprüfung einer Aktion fehl, öffnet sich der Tab mit dem ersten fehlenden Feld im Bearbeiten-Modus.

### 2.5 Bearbeiten und Löschen
- Bearbeiten gibt es in den Formular-Tabs (Grunddaten, EPA Beratung, Gesuch). Massnahmen und Nachführung sind direkt änderbar.
- Beim Speichern werden die Pflichtfelder des gewählten Status geprüft.
- **Löschen** einer EP ist nur im Tab Grunddaten möglich und erfordert eine Bestätigung. Es gibt keine Prüfung auf abhängige Daten (alle Massnahmen werden mit gelöscht).

### 2.6 Gesuch und Kontrolle
- Kontoinformationen: Kontoinhaber/in, Adresse, IBAN (Pflicht, siehe 2.3), Bankname (optional). Das Konto lautet immer auf die Gemeinde.
- **Förderabschlussformular** (druckbar/PDF): erst verfügbar, wenn Kontoinhaber/in, Adresse und IBAN erfasst sind. Es muss von Berater/in und Gemeinderat unterschrieben werden.
- **Gesuchs-Nr.**: Beim Erfassen des Gesuchseingangs wird eine eindeutige Nr. vorgeschlagen: `<Jahr><Nr der EP>` (z. B. EP-712 → 2026712). Ist sie bereits vergeben, wird eine Ziffer angehängt (`…2`, `…3`).
- Tab **Kontrolle** liegt als Zwischenschritt **4.1** zwischen Gesuch (4) und Nachführung (5) und ist nur für Admin sichtbar. Er gehört nicht zum Prozessablauf (kein Weiter-Button, keine Aktion). Inhalt: Gesuchseingang, Gesuchs-Nr., Auszahlungsbetrag in CHF und interner Kommentar, nur für **Admin** sichtbar und bearbeitbar. Beim Wechsel auf eine andere Rolle fällt die Ansicht auf Grunddaten zurück.
- **Hinweis / Lücke:** Gesuchseingang im Kontrolle-Tab ist ein freies Textfeld ohne Datumsprüfung. Die Gesuchs-Nr. wird nicht auf Eindeutigkeit geprüft, wenn sie von Hand geändert wird.

### 2.7 Ja/Nein-Felder
Ja/Nein-Fragen sind ein Umschalter mit drei Zuständen: **Ja**, **Nein**, **Keine Angabe**. Ein Klick auf die aktive Stellung hebt die Auswahl auf («Keine Angabe»). Ist ein Ja/Nein-Feld Pflicht, gilt «Keine Angabe» als nicht ausgefüllt.

---

## 3. Massnahmen

### 3.1 Felder
| Feld | Pflicht | Regel |
|---|---|---|
| Name | ja | Freitext |
| ES-Nr. | nein | Freitext, z. B. `1.2.1` |
| Beschreibung | ja | Freitext |
| Massnahme aus EPA | ja | Ja/Nein-Umschalter (muss gewählt sein) |
| Handlungsfeld | ja | Auswahl: Übergeordnete Massnahmen / Strategien, Wärme- und Kälteversorgung, Energieeffizienz, Ausbaupfad erneuerbare Energien, andere |
| Aktivitätsbereich | ja | Auswahl: Strategie / Planung, Information, Beratung, Förderung, Vorschrift, Vollzug, Vorbildfunktion |
| Priorität | nein | Hoch, Mittel, Tief |
| Startdatum | ja | Datum `dd.MM.yyyy`, Eingabe von Hand oder per Datepicker |
| Fälligkeitsdatum | ja | Datum, muss **nach** dem Startdatum liegen |
| Umsetzungszeitraum | – | berechnet, nicht editierbar (siehe 3.3) |
| Budget in CHF | ja | nur ganze Zahlen (siehe 3.4) |
| Verantwortlichkeit | nein | Auswahl aus den Kontakten |
| Weitere Bemerkungen | nein | Freitext |

Zusätzlich: **Energieträger** (Tabelle mit ID, Spezifikation, Typ, Priorität) wird nur beim Handlungsfeld «Wärme- und Kälteversorgung» angezeigt. Die **geografische Markierung** (Punkt, Linie, Fläche) wird nur angezeigt. Ein Editor dafür fehlt im Prototyp.

### 3.2 Validierung beim Speichern
- Alle Pflichtfelder werden geprüft. Fehler erscheinen direkt unter dem Feld (rot) mit einer Meldung. Der Cursor springt ins erste fehlerhafte Feld. Die Fehlermarkierung verschwindet, sobald das Feld geändert wird.
- Datum: Format `dd.MM.yyyy`, nur existierende Kalendertage (31.02.2027 ist ungültig). Kurzformen wie `1.3.2027` werden zu `01.03.2027` ergänzt.
- **Fälligkeitsdatum > Startdatum** (gleiches Datum ist ungültig). Im Datepicker sind für das Fälligkeitsdatum Tage bis und mit Startdatum gesperrt.

### 3.3 Umsetzungszeitraum (berechnet)
Wird immer aus Start- und Fälligkeitsdatum berechnet, nie von Hand gepflegt:
- gleiches Jahr → `2026`
- verschiedene Jahre → `2025–2028` (Halbgeviertstrich `–`, Startjahr bis Fälligkeitsjahr)

Er wird beim Speichern neu berechnet. Im Formular aktualisiert er sich live.
**Hinweis / Lücke:** Die Massenbearbeitung (3.6) und der CSV-Import erlauben, den Umsetzungszeitraum direkt zu setzen. Das widerspricht dieser Regel und gehört in der Umsetzung unterbunden.

### 3.4 Budget
- Nur **ganze Zahlen** (Integer, Franken). Buchstaben, Punkt, Komma und Sonderzeichen werden beim Tippen entfernt und mit einer Fehlermeldung quittiert.
- Gespeichert/angezeigt als `12'500 CHF`.
- Reporting «hohes Budget»: Budget **über 100'000 CHF** (strikt grösser).

### 3.5 Status der Massnahme
**Geplant → Umsetzung → Abschluss.** Der Status kann im Stepper der Massnahme jederzeit gesetzt werden (auch rückwärts), ohne weitere Bedingung. Eine neue Massnahme startet immer als **Geplant**.

### 3.6 Massenbearbeitung
Mehrere Massnahmen können markiert und gemeinsam geändert werden: Prozessstatus, Priorität oder Umsetzungszeitraum. Es braucht einen nicht leeren Wert und eine Bestätigung. Es gibt keine weitere Validierung (siehe Lücke in 3.3).

### 3.7 Löschen
Eine einzelne Massnahme wird nach Bestätigung gelöscht. Es gibt keine Abhängigkeitsprüfung.

### 3.7a Karte und Liste (Hover)
Fährt man in der Massnahmenliste über eine Massnahme, wird sie auf der Karte hervorgehoben (dickerer, dunkler Rand bzw. grösserer Punkt). Es gibt dabei **keine Auswahl und keinen Zoom**. Liegt die Massnahme ausserhalb des sichtbaren Ausschnitts, wird die Karte nur verschoben (mit kurzer Verzögerung). Umgekehrt hebt ein Hover über eine Massnahme auf der Karte die Zeile in der Liste hervor. Erst ein **Klick** wählt die Massnahme aus und zoomt auf ihre Gemeinde.

### 3.8 CSV-Export
Export der Liste: ID, ES-Nr., Name, Prozessstatus, Handlungsfeld, Aktivitätsbereich, Priorität, Startdatum, Fälligkeitsdatum, Budget. Trennzeichen `;`, UTF-8.

---

## 4. Nachführung

### 4.1 Voraussetzungen
- Gibt es nur bei Status **Abschluss**.
- Der Tab ist **gesperrt**, solange Kontoinhaber/in, Adresse und IBAN nicht erfasst sind. Beim Versuch leitet das System zum Gesuch-Tab um und nennt die fehlenden Angaben.

### 4.2 Fristberechnung
1. **Erste Frist** = Datum Beratungsbeginn + 4 Jahre.
2. Nach jeder Nachführung (Datum `d`, Frist `F`) gilt:
   - `d` ≤ `F` (rechtzeitig oder vorzeitig): nächste Frist = `d` + 4 Jahre.
   - `d` > `F` (zu spät): die Fristenreihe verschiebt sich nicht. Nächste Frist = `F` + 4 Jahre (die ursprüngliche Frist plus 4 Jahre).
3. Die Prüfpflicht endet: Läge die nächste Frist im Jahr **2050 oder später**, besteht keine weitere Nachführung.
4. Alte Daten ohne Protokoll: Die früheren Nachführungen werden als im regulären Turnus erfolgt angenommen. Nur die letzte, mit bekanntem Datum, zählt nach der obigen Regel.

Beispiele (Beratungsbeginn 01.03.2023, erste Frist 01.03.2027):
- Nachführung am 01.09.2026 (vorzeitig) → nächste Frist 01.09.2030.
- Nachführung am 01.09.2027 (zu spät) → nächste Frist 01.03.2031.

**Offene Frage zur Fachlogik:** Bei einer verspäteten Nachführung ist «ursprüngliche Frist + 4 Jahre» umgesetzt. Sollte stattdessen gemeint sein, dass die nächste Frist die ursprüngliche Frist selbst ist, wäre das eine andere Regel und muss bestätigt werden.

Code: `nfFristen`, `nfNaechsteFrist`, `naechstePruefungFor`.

### 4.2a Zeitleiste und Meilensteine der Beratung
Die Zeitleiste im Tab Nachführung zeigt nummerierte Punkte. Der Name und das Datum erscheinen beim Darüberfahren (Hover) mit der Maus. Die Liste aller Daten ist standardmässig **zugeklappt** (Pfeil unten links, ohne Text). Der Zeitraum zwischen einer überschrittenen Frist und heute ist auf der Zeitleiste als Verzug rot markiert. Das Datum der nächsten Frist steht als «Frist <Datum>» unter ihrem Marker. Inhalt:
1. **Beratungsbeginn** (Datum Beratungsbeginn, gesetzt mit «EPA Beratung starten»)
2. **EPA Beratung abgeschlossen** (Datum, gesetzt mit «EPA Beratung abschliessen», Übergang zu Verabschiedung)
3. **Fördergesuch eingereicht** (Gesuchseingang)
4. **Beratung abgeschlossen** (Datum, gesetzt mit «Beratung abschliessen», Übergang zu Abschluss)
5. die erledigten Nachführungen (grüne Punkte) und die **nächste Frist**. Hat noch keine Nachführung stattgefunden, heisst der Eintrag «Erste Nachführung fällig» (Beratungsbeginn + 4 Jahre), sonst «Nächste Nachführung fällig».

Für **bereits erledigte Nachführungen** zeigt die Datenliste zusätzlich die Fälligkeit und das Datum der Durchführung («1. Nachführung fällig 01.03.2027, erledigt 01.09.2027 (zu spät)»; Zusatz «zu spät» bzw. «vorzeitig», wenn das Durchführungsdatum nach bzw. vor der Fälligkeit liegt). Ist die nächste Frist bereits überschritten, ist sie als überfällig markiert.

Der Titel im Tab lautet «Erste Nachführung am …», solange noch keine Nachführung stattgefunden hat, danach «Nächste Nachführung am …». Rücken Meilenstein-Punkte in der Zeitleiste zu nah zusammen, werden sie nur zur besseren Lesbarkeit leicht auseinandergeschoben (Datum im Tooltip und in der Legende bleibt exakt).

Die Meilensteindaten 2 und 4 werden vom System bei der jeweiligen Aktion auf das aktuelle Datum gesetzt und sind nicht von Hand editierbar. Ein Meilenstein ohne Datum (z. B. bei älteren Daten) fehlt in der Zeitleiste. Das Datum von 2 steht zusätzlich in der Ansicht des Tabs EPA Beratung, das von 4 im Tab Gesuch.

### 4.3 Phasen
| Phase | Bedingung | Wirkung |
|---|---|---|
| vorab | Status ≠ Abschluss | keine Nachführung |
| ruhend | nächste Frist in mehr als 12 Monaten | kein Prüfformular, vorzeitiger Start möglich |
| offen | nächste Frist innerhalb der nächsten 12 Monate | Banner «Nachführung steht an», Prüfformular aktiv |
| fällig | Frist erreicht oder überschritten | Warnhinweis (Pill, Banner, Liste «⚠ seit N Tagen») |
| keine | Prüfpflicht beendet (siehe 4.2 Punkt 3) | keine Nachführung |

Solange die Beratung noch nicht abgeschlossen ist, zeigt der Tab Nachführung nur den Termin der ersten Nachführung (Beratungsbeginn + 4 Jahre) und einen **Link zum aktuellen Prozessschritt** (z. B. «Zum aktuellen Schritt: 3 Massnahmen →»), damit klar ist, wo es weitergeht.

Eine **vorzeitige Nachführung** ist in der Phase «ruhend» jederzeit startbar.

### 4.4 Ablauf und Abschluss
Zu bestätigen sind:
1. **Verantwortliche Personen** (Kontakt Gemeinde, Berater/in Energieplanung),
2. **Ziele** (Netto-null, Energieeffizienz, Stromproduktion),
3. **Massnahmen** (jede zu prüfende Massnahme).

«Nachführung abschliessen» ist nur aktiv, wenn alles bestätigt ist.

Zu prüfen sind Massnahmen, die (a) noch nicht abgeschlossen sind, (b) seit der letzten Nachführung neu oder im Status geändert wurden oder (c) in dieser Nachführung bereits geändert/importiert wurden. Unveränderte, abgeschlossene Massnahmen gelten als automatisch bestätigt.

Änderungen an Verantwortlichen Personen, Zielen und Massnahmen werden **sofort gespeichert**. Eine Änderung an einer Massnahme bestätigt sie zugleich. Eine Person unter «Verantwortliche Personen», die nicht mehr in den Kontakten existiert, wird mit Warnung markiert.

Beim Abschluss wird ein Protokolleintrag geschrieben: Datum, Benutzer, Anzahl geänderter Personen/Ziele, Anzahl Massnahmen, Momentaufnahme des Stands (Grundlage für «Seit der letzten Nachführung»). Danach beginnt ein neuer, ungeprüfter Zyklus und die nächste Frist wird nach 4.2 berechnet.

**Berater/in Energieplanung:** Statt einer externen Fachperson kann der Wert **«Aktuell keine externe Begleitung»** gewählt werden. Er steht zuoberst in der Auswahl und ist hervorgehoben. Das gilt überall, wo dieses Feld bearbeitet wird (Nachführung und Grunddaten). Der Wert wird nicht als «Person nicht mehr in den Kontakten» gewarnt und gibt keinen Zugriff (Abschnitt 6). Sobald dieses Auswahlfeld den Sonderwert anbietet, kann man es nicht mehr auf «leer» zurücksetzen. Man wählt eine Person oder «Aktuell keine externe Begleitung». Das Feld «Kontakt Gemeinde» ist das Feld «Verantwortlichkeit Gemeinde» der Grunddaten, nur in der Nachführung anders beschriftet.

### 4.5 CSV-Import der Massnahmen
Dreistufig: **Datei → Zuordnung → Zusammenfassung**.

- Spalten: ES-Nr., Massnahme (Pflicht), Beschreibung, Status, Bemerkung. Trennzeichen `;` oder `,` (automatisch erkannt). Zeilen ohne Massnahmenname werden ignoriert.
- Statuswerte: `geplant`, `umsetzung`/`in umsetzung`, `abschluss`/`abgeschlossen`/`erledigt` (Gross-/Kleinschreibung egal), sonst leer.
- **Automatische Zuordnung** zu einer bestehenden Massnahme: zuerst über die ES-Nr., sonst über den Namen (ohne Gross-/Kleinschreibung). Jede Zeile kann manuell neu zugeordnet werden: *Neue Massnahme anlegen*, *Nicht importieren* oder *Bestehende Massnahme überschreiben*.
- **Überschreiben:** Name, ES-Nr., Beschreibung, Status und Bemerkung werden aus der Datei übernommen. **Leere Felder in der Datei lassen den bisherigen Wert unverändert.**
- **Neue Massnahmen** erhalten Status Geplant (oder den Status aus der Datei), «Massnahme aus EPA» = Nein, alle übrigen Felder leer (`-`).
- **Nicht in der Datei enthaltene, noch nicht abgeschlossene Massnahmen** bekommen eine Aktion pro Massnahme:
  - *Unverändert lassen* (Standard),
  - *Als abgeschlossen markieren* (Status Abschluss),
  - *Verworfen* (die Massnahme wird aus der Planung **entfernt**).
- Jede importierte oder geänderte Massnahme gilt in der Nachführung als geprüft.
- **Hinweis / Lücke:** «Verworfen» löscht die Massnahme. Es gibt (noch) keinen Massnahmenstatus «Verworfen». Soll die Massnahme erhalten bleiben, braucht es einen neuen Status (betrifft Stepper, Filter, Reports).

---

## 5. Kontakte
- Pflicht: Vorname, Nachname, E-Mail. Organisation ist optional. Im Kontaktformular gibt es **keine** Prüfung des E-Mail-Formats und keine Eindeutigkeitsprüfung (anders als beim Erfassen aus einer Auswahl, siehe unten).
- **Neue Person direkt in der Auswahl erfassen (nur Admin):** In jedem Personen-Auswahlfeld (Verantwortlichkeit der Massnahme, Beratungsperson, Kontakt Gemeinde, Berater/in Energieplanung, Verantwortlichkeit in der Nachführung) steht für Admins zuoberst «＋ Neue Person erfassen …». Der Dialog verlangt Vorname, Nachname und E-Mail (das Format wird geprüft). Eine Person mit gleichem Namen und gleicher Organisation wird abgelehnt. Je nach Feld gilt eine Einschränkung: bei **Kontakt Gemeinde** ist die Organisation eine der Gemeinden der Planung (vorgegebene Auswahl), bei **Beratungsperson** und **Berater/in Energieplanung** ist eine externe Organisation Pflicht (keine «Gemeinde …»). Im Dialog werden gleich die **Rollen** (Zugriff) gesetzt, mehrere sind möglich. Vorbelegt ist bei «Kontakt Gemeinde» die Rolle Gemeinde und bei den Berater-Feldern Energieberater/in, sonst keine Rolle. Die Rolle Gemeinde gilt für die Gemeinde der Organisation (die Organisation muss dazu eine Gemeinde des Kantons sein, «Gemeinde Adligenswil» oder nur «Adligenswil», sie wird dann als «Gemeinde …» gespeichert), die Rolle Energieberater/in für die Gemeinden der aktuellen Planung. Der Zugriff wird sofort gespeichert und nicht erst später automatisch berechnet. Die Person wird sofort in den Kontakten angelegt und im Feld gewählt. Bei den Feldern für externe Fachpersonen (Beratungsperson, Berater/in Energieplanung) ist die Rolle Gemeinde nicht wählbar. Andere Rollen sehen die Option nicht.
- Löschen (einzeln oder mehrere) nach Bestätigung. Es gibt **keine** Prüfung, ob die Person noch Verantwortliche/r einer Massnahme oder EP ist. Solche Verweise werden in der Nachführung als «Person nicht mehr in den Kontakten» markiert.
- Auswahllisten für Personen sind nach Gemeinde-Kontakten und externen Fachpersonen gruppiert. Die Verantwortliche Person der Gemeinde ist auf Kontakte der betreffenden Gemeinde(n) beschränkt, Berater/innen auf externe Fachpersonen.

---

## 6. Rollen und Zugriff

Eine Person kann **mehrere Rollen gleichzeitig** haben (z. B. Admin + Gemeinde oder Gemeinde + Energieberater/in). Ohne Rolle hat die Person keinen Zugriff.

| Rolle | Sieht | Besonderheiten |
|---|---|---|
| **Admin** (Kanton) | alle Energieplanungen | Tab «Kontrolle», Tab «Zugriffsverwaltung» |
| **Energieberater/in** | Energieplanungen der ihr freigeschalteten Gemeinden | kein Kontrolle-, kein Zugriffsverwaltung-Tab |
| **Gemeinde** | Energieplanung der eigenen Gemeinde(n) | wie Energieberater/in |
| *(keine Rolle)* = Kein Zugriff | nichts | Person kann sich nicht anmelden bzw. sieht keine EP |

- **Kombination von Rollen:** Die Rechte werden vereinigt. Sobald die Person **Admin** ist, sieht sie alle Energieplanungen und hat Kontrolle- und Zugriffsverwaltung-Tab, unabhängig von den anderen Rollen. Die Gemeindeliste einer Person gilt gemeinsam für ihre Rollen Gemeinde und Energieberater/in (es gibt keine Gemeindeliste pro Rolle).
- Eine regionale EP ist sichtbar, wenn mindestens eine ihrer Gemeinden freigeschaltet ist.
- **Standardzuweisung** (aus der Kontaktliste, jeweils genau eine Rolle): `@lu.ch`-Kontakte ohne Gemeindebezug = Admin. Gemeindekontakte = Gemeinde für ihre Gemeinde. Externe Fachpersonen = Energieberater/in für alle Gemeinden, in denen sie als Beratungsperson oder Berater/in eingetragen sind, sonst keine Rolle.
- **Zugriffsverwaltung** (nur Admin): Rollen per Kontrollkästchen (mehrere möglich) und Gemeinden pro Person. Ist **Energieberater/in** oder **Gemeinde** gewählt, ist mindestens **eine** Gemeinde Pflicht. Nur Admin: keine Gemeindeliste. Keine Rolle gewählt = Kein Zugriff.
- Liste sortierbar nach Person, Organisation, Rolle und Gemeinden (Klick auf die Spaltenüberschrift wechselt auf-/absteigend). Standard: **Person A–Z** (nach «Vorname Nachname»). Leere Werte stehen immer am Schluss.
- Filter in der Liste: «Mit Zugriff» (mindestens eine Rolle), je Rolle (Personen mit dieser Rolle, auch wenn sie weitere haben), «Kein Zugriff», «Alle Personen».
- Wechselt man zu einem Benutzer, für den die geöffnete EP nicht sichtbar ist, geht es zurück zur Liste.
- **Hinweis:** Die Rollenprüfung ist im Prototyp nur im Frontend umgesetzt. Produktiv muss sie serverseitig erzwungen werden.
- **Hinweis:** Die Rolle wird in der Oberfläche «Energieberater/in» geschrieben. Der interne Rollenwert heisst im Prototyp weiter `Energieberater`.

---

## 7. Liste der Energieplanungen
- **Suche** über ID, Name, Jahr, Gemeinde und Regionsname.
- **Filter** nach Prozessschritt (Grunddaten, EPA Beratung, Massnahmen, Gesuch, Nachführung).
- **Sortierung:** Gemeinde, Jahr, Status (in Prozessreihenfolge), Termin, nächster Schritt.
- **Hover Liste und Karte:** Fährt man in der Übersicht über eine Zeile, wird auf der Karte nur die **Grenze** der Gemeinde (bei regionalen Planungen aller Gemeinden der Region) hervorgehoben. Die Flächenfarbe (Prozessstand) ändert sich dabei nicht. Fährt man auf der Karte über eine Gemeinde, wird die zugehörige Zeile in der Liste hervorgehoben.
- **Status-Spalte:** Zeigt nur den Prozessschritt (z. B. «Gesuch», «Massnahmen») mit dem Fortschrittsbalken, ohne Zusatztext. Eine fällige Nachführung wird über die Farbe des Badges (Warnfarbe) und die Termin-Spalte kenntlich gemacht.
- **Termin-Spalte:** bei noch nicht gestarteter Beratung der *geplante Start* (überfällig, wenn in der Vergangenheit, Anzeige «seit N Tagen»), sonst die *nächste Nachführungsfrist* (bei fälligen mit Warnsymbol).
- **Nächster Schritt:** Entwurf = «EPA Beratung starten/abschliessen», Verabschiedung = «Verabschiedung erfassen», Fördergesuch = «Fördergesuch einreichen» bzw. «Beratung abschliessen», Abschluss = «Nachführung <Jahr> abschliessen (fällig)», «… steht bald an» (Frist innerhalb eines Jahres) oder «Aktuell nichts zu tun».

---

## 8. Reporting
| Report | Regel |
|---|---|
| Alle Energieplanungen | Übersicht mit Gemeinde, Status, Anzahl Massnahmen |
| EPA Masterplan | Stand der EPA-Beratung je Gemeinde (Daten aus der Masterplan-Datei) |
| Überfällige Massnahmen | Fälligkeitsdatum **vor heute** und Status ≠ Abschluss |
| Massnahmen mit hohem Budget | Budget **über 100'000 CHF** |
| Nicht zugeordnete Kontakte | Kontakte, die weder bei einer EP (Verantwortlichkeit) noch bei einer Massnahme als Verantwortliche eingetragen sind (Vergleich über «Vorname Nachname») |

---

## 9. Offene Punkte / bekannte Lücken (Zusammenfassung)
1. Massenbearbeitung und CSV-Import können den berechneten Umsetzungszeitraum umgehen (3.3).
2. «Verworfen» im Import löscht die Massnahme, es gibt keinen Status «Verworfen» (4.5).
3. Fachlogik der Nachführungsfrist bei Verspätung bestätigen (4.2).
4. Keine Abhängigkeitsprüfungen beim Löschen von EP, Massnahmen und Kontakten (2.5, 3.7, 5).
5. Keine Format-/Eindeutigkeitsprüfung bei E-Mail (Kontakte) und Gesuchs-Nr. von Hand (2.6, 5).
6. Rollenprüfung nur im Frontend (6).
7. Geografische Markierungen der Massnahmen sind nur lesbar, es gibt keinen Editor.

---

## Änderungsverlauf
| Datum | Änderung |
|---|---|
| 2026-11-12 | Übersicht: Hover Tabelle hebt nur die Gemeindegrenze hervor, Hover Karte hebt die Tabellenzeile hervor (Abschnitt 7). |
| 2026-11-12 | Massnahmen: Hover-Hervorhebung zwischen Liste und Karte, ohne Zoom (Abschnitt 3.7a). |
| 2026-11-12 | Liste: Status-Spalte zeigt nur den Prozessschritt, ohne Zusatztext (Abschnitt 7). |
| 2026-11-12 | Tab Nachführung vor Abschluss der Beratung: Link zum aktuellen Prozessschritt (Abschnitt 4.3). |
| 2026-11-12 | Kontakte: beim Erfassen aus der Auswahl werden gleich die Rollen gesetzt (Abschnitt 5). |
| 2026-11-12 | Kontakte: Admin kann in den Personen-Auswahlfeldern direkt eine neue Person erfassen (Abschnitt 5). |
| 2026-11-12 | Zeitleiste: Verzug rot markiert, Beschriftung «Frist <Datum>», Aufklapp-Pfeil grösser ohne Text, Meilenstein-Punkte mit mehr Abstand (Abschnitt 4.2a). |
| 2026-11-12 | Zeitleiste: Infos per Hover, Datenliste standardmässig zugeklappt (Abschnitt 4.2a). |
| 2026-11-12 | Tab «Kontrolle» (nur Admin) als Schritt 4.1 zwischen Gesuch und Nachführung (Abschnitt 2.6). |
| 2026-11-12 | Nachführung: «Angaben» heisst «Verantwortliche Personen», «Verantwortliche Person der Gemeinde» heisst «Kontakt Gemeinde», neuer Wert «Aktuell keine externe Begleitung» bei Berater/in Energieplanung (Abschnitt 4.4). |
| 2026-11-12 | Zeitleiste: Titel «Erste/Nächste Nachführung», Punkte bei engen Abständen entzerrt (Abschnitt 4.2a). |
| 2026-11-12 | Zeitleiste: Fälligkeit und Durchführungsdatum früherer Nachführungen dargestellt (Abschnitt 4.2a). |
| 2026-11-12 | Zeitleiste der Nachführung: Meilensteine (EPA Beratung abgeschlossen, Beratung abgeschlossen) und Fälligkeit der ersten Nachführung ergänzt (Abschnitt 4.2a). |
| 2026-11-12 | Zugriffsverwaltung: Spalten sortierbar, Standardsortierung Person A–Z (Abschnitt 6). |
| 2026-11-12 | Rollen: Mehrfachrollen pro Person (Rechte werden vereinigt), «Energieberater» heisst «Energieberater/in», «Kein Zugriff» = keine Rolle (Abschnitt 6). |
| 2026-11-12 | Erstfassung, enthält: Massnahmenformular (Pflichtfelder, Datepicker, Fälligkeit nach Start, Budget nur ganze Zahlen, Umsetzungszeitraum berechnet), Nachführungsfrist (4 Jahre ab letzter Nachführung, bei Verspätung ab ursprünglicher Frist), Importer-Option «Verworfen». |
