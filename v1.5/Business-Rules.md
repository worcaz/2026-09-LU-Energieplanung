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

Formate: Datum `dd.MM.yyyy`. Datumsfelder haben einen **eigenen deutschen Datepicker** (Monatsnamen auf Deutsch, Woche ab Montag, «Heute»/«Löschen»), weil der native Kalender des Browsers sonst in der Browsersprache erscheint. Geldbeträge als ganze Franken, Anzeige mit Apostroph als Tausendertrenner, z. B. `12'500 CHF`. Fehlende Werte werden intern als `-` gespeichert und in der Ansicht als «Noch nicht erfasst» angezeigt. **Eingabe von Beträgen (Nice-to-have, keine verbindliche Anforderung):** In Feldern mit Franken-Beträgen (Budget einer Massnahme, Auszahlungsbetrag) wird beim Tippen automatisch der Tausendertrenner eingefügt (1000 wird zu 1'000). Eingegeben werden dürfen nur Ziffern. Ein eingegebener Trenner wird akzeptiert und beim Speichern entfernt, der Wert wird als ganze Zahl gespeichert.

**Markieren und Kopieren:** Alle angezeigten Werte (Tabellenzellen, Felder in Ansichten, Karten, Texte) müssen sich mit der Maus markieren und mit Copy-Paste kopieren lassen. Ein Markieren darf keine Aktion der Zeile auslösen (z. B. Planung oder Massnahme öffnen, Tab wechseln, Ansicht neu zeichnen). Nur Bedienelemente (Knöpfe, Spaltenüberschriften zum Sortieren, Ein-/Ausklapp-Kopfzeilen) sind nicht markierbar. Im bisherigen System war das nicht möglich, im neuen ist es Pflicht.

---

## 2. Energieplanung

### 2.1 Anlegen
- Typ ist Pflicht: **Kommunal** (genau 1 Gemeinde) oder **Regional** (mindestens 2 Gemeinden).
- Pro Gemeinde und Typ darf es nur **eine** Energieplanung geben. Existiert für mindestens eine der gewählten Gemeinden bereits eine EP desselben Typs, wird das Anlegen abgelehnt. Die Meldung verlinkt auf die bestehende EP.
- Eine neue EP startet im Status **Entwurf**. Die ID wird fortlaufend vergeben.
- Name: `<Typ> <Gemeinde(n)>`, wird beim Anlegen vergeben. Name, Planungstyp und Gemeinde(n) sind im Tab «Personen» nicht mehr bearbeitbar (der Titel der Planung zeigt sie), die Gemeinde(n) auch nicht in der Ansicht.

### 2.2 Status (Prozessstatus) und Stepper
Reihenfolge: **Entwurf → Verabschiedung → Fördergesuch → Abschluss**.

- Der Status kann über den Stepper oder das Statusfeld im Bearbeiten-Formular gesetzt werden, auch rückwärts.
- Ein Statuswechsel ist nur möglich, wenn die **Pflichtfelder des Zielstatus** gefüllt sind (siehe 2.3). Fehlen Felder, öffnet das System das Bearbeiten-Formular und markiert die fehlenden Felder. Der Status wird erst beim erfolgreichen Speichern gesetzt.

### 2.3 Pflichtfelder je Status
| Feld | Pflicht ab |
|---|---|
| Planungstyp, Gemeinde(n) | werden beim Anlegen gewählt und sind danach nicht mehr bearbeitbar (kein Pflichtfeld im Formular) |
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
| 1 | Personen | Status Entwurf, Beratung noch nicht gestartet (kein Beratungsbeginn) | «EPA Beratung starten» → setzt Datum Beratungsbeginn auf heute |
| 2 | EPA Beratung | Status Entwurf, Beratung gestartet | «EPA Beratung abschliessen» → Status **Verabschiedung** |
| 3 | Massnahmen | Status Verabschiedung | «Weiter zum Gesuch» → Status **Fördergesuch** (prüft die Pflichtfelder von «Verabschiedung») |
| 4 | Gesuch | Status Fördergesuch | «Fördergesuch eingereicht» → setzt Gesuchseingang auf heute und vergibt die Gesuchs-Nr. (siehe 2.6); danach «Beratung abschliessen» → Status **Abschluss** (prüft die Pflichtfelder von «Abschluss») |
| 5 | Nachführung | Status Abschluss | siehe Abschnitt 4 |

Schlägt die Pflichtfeldprüfung einer Aktion fehl, öffnet sich der Tab mit dem ersten fehlenden Feld im Bearbeiten-Modus.

### 2.5 Bearbeiten und Löschen
- Bearbeiten gibt es in den Formular-Tabs (Personen, EPA Beratung, Gesuch). Massnahmen und Nachführung sind direkt änderbar.
- Beim Speichern werden die Pflichtfelder des gewählten Status geprüft.
- **Löschen** einer EP dürfen **nur Admin**. Alle anderen Rollen sehen weder den Löschen-Link noch den Hinweis. Es ist nur im Tab Personen möglich, erfordert eine Bestätigung und ist **nur solange erlaubt, wie die EPA Beratung noch nicht gestartet wurde** (Prozessschritt «Personen»). Sobald die Beratung läuft oder die EP in einem späteren Schritt steht (EPA Beratung, Massnahmen, Gesuch, Nachführung), kann sie nicht mehr gelöscht werden. Der Löschen-Link wird dann durch einen Hinweis ersetzt. Beim erlaubten Löschen werden die vorhandenen Massnahmen mit gelöscht.
- **Geplanter Start EPA-Beratung:** Das Feld ist nur eine **Jahresplanung** (Auswahl eines Jahres, kein Datum). Nur **Admin** können es bearbeiten, alle anderen Rollen sehen es schreibgeschützt. Bestehende Datumswerte werden auf das Jahr gekürzt angezeigt. **Annahme (Offene Frage):** Ein geplanter Start gilt als überfällig, sobald das Jahr vorbei ist (ab 1. Januar des Folgejahrs). In den Dummy-Daten ist das Jahr bei jeder Planung gesetzt. Offen ist, ob es ein Pflichtfeld sein soll (beim Anlegen oder ab einem Status), heute ist es keines.
- **Inhalt des Tabs «Personen»:** Verantwortlichkeit Gemeinde und Berater/in Energieplanung (mit Hinweis-Icon, siehe 4.4). Name, Planungstyp und Gemeinde(n) werden hier nicht mehr angezeigt oder bearbeitet.

### 2.6 Gesuch und Kontrolle
- Kontoinformationen: Kontoinhaber/in, Adresse, IBAN (Pflicht, siehe 2.3), Bankname (optional). Das Konto lautet immer auf die Gemeinde.
- **Förderabschlussformular** (druckbar/PDF): erst verfügbar, wenn Kontoinhaber/in, Adresse und IBAN erfasst sind. Es muss von Berater/in und Gemeinderat unterschrieben werden. Ein Textfeld «Förderabschlussformular» (Stand des Formulars) in der EPA Beratung gibt es nicht mehr.
- **Gesuchs-Nr.**: Beim Erfassen des Gesuchseingangs wird eine eindeutige Nr. vorgeschlagen: `<Jahr><Nr der EP>` (z. B. EP-712 → 2026712). Ist sie bereits vergeben, wird eine Ziffer angehängt (`…2`, `…3`).
- Tab **Kontrolle** liegt als Zwischenschritt **4.1** zwischen Gesuch (4) und Nachführung (5) und ist nur für Admin sichtbar. Er gehört nicht zum Prozessablauf (kein Weiter-Button, keine Aktion). Inhalt: Gesuchseingang, Gesuchs-Nr., Auszahlungsbetrag in CHF und interner Kommentar, nur für **Admin** sichtbar und bearbeitbar. Beim Wechsel auf eine andere Rolle fällt die Ansicht auf Personen zurück.
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
| Bemerkungen / aktueller Stand | nein | Freitext |

Zusätzlich: Die **geografische Markierung** (Punkt, Linie, Fläche) wird nur angezeigt. Ein Editor dafür fehlt im Prototyp. Energieträger werden bei Massnahmen **nicht** erfasst (die frühere Tabelle «Energieträger» gibt es nicht mehr).

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
**Geplant → Umsetzung → Abschluss**, zusätzlich **Verworfen**. Der Status kann im Stepper der Massnahme jederzeit gesetzt werden (auch rückwärts), ohne weitere Bedingung. «Verworfen» setzt man über «Massnahme verwerfen» (mit Bestätigung), zurück geht es mit «Wieder aufnehmen» (Status «Geplant»). Eine verworfene Massnahme bleibt in der Liste und im Protokoll erhalten. In den Dropdowns (z. B. Prüfkarte der Nachführung, Massenbearbeitung, Filter) ist «Verworfen» ebenfalls wählbar. Eine neue Massnahme startet immer als **Geplant**.

**«Beendet»** heisst Abschluss oder Verworfen. Beendete Massnahmen werden nicht auf überfällige Fälligkeit überwacht (Report «Überfällige Massnahmen», Warnungen) und sind in der Nachführung nur prüfpflichtig, wenn sie neu oder geändert sind. Ein Fälligkeitsdatum in der Vergangenheit ist bei ihnen erlaubt.

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
| vorab | Status nicht beendet (weder Abschluss noch Verworfen) | keine Nachführung |
| ruhend | nächste Frist in mehr als 12 Monaten | kein Prüfformular, vorzeitiger Start möglich |
| offen | nächste Frist innerhalb der nächsten 12 Monate | Banner «Nachführung steht an», Prüfformular aktiv |
| fällig | Frist erreicht oder überschritten | Warnhinweis (Pill, Banner, Liste «⚠ seit N Tagen») |
| keine | Prüfpflicht beendet (siehe 4.2 Punkt 3) | keine Nachführung |

Solange die Beratung noch nicht abgeschlossen ist, zeigt der Tab Nachführung nur den Termin der ersten Nachführung (Beratungsbeginn + 4 Jahre) und einen **Link zum aktuellen Prozessschritt** (z. B. «Zum aktuellen Schritt: 3 Massnahmen →»), damit klar ist, wo es weitergeht.

Wenn gerade nichts zu tun ist (Phase «ruhend» oder «keine»), zeigt der Tab Nachführung:
- eine **Statuszeile** («Alles in Ordnung · Nächste Nachführung am …» mit Rest-Zeit, letzter Nachführung und dem Knopf «Vorzeitig nachführen»). Bei «keine»: «Keine weitere Nachführung erforderlich»,
- den **Verlauf zugeklappt** («Verlauf anzeigen»). Darin stehen die Zeitleiste und die Liste der **bisherigen Nachführungen** mit vollständigem Änderungsprotokoll (siehe unten). Das gilt für alle Phasen,
- eine **schreibgeschützte Übersicht als drei Kacheln**: Verantwortliche Personen (Namen), Ziele (Anzahl erfasst), Massnahmen (Anzahl, abgeschlossen, überfällig). Ein Klick öffnet genau einen Bereich darunter. Bei den Massnahmen sind standardmässig nur die nicht abgeschlossenen sichtbar («Alle anzeigen»), ein Klick auf eine Zeile klappt die Details auf und markiert die Massnahme auf der Karte,

Bearbeiten und Bestätigen ist erst in der Phase «offen»/«fällig» oder bei einer vorzeitigen Nachführung möglich.

**Änderungsprotokoll («Bisherige Nachführungen»):** Jede abgeschlossene Nachführung speichert den **Stand** (Verantwortliche Personen, Ziele sowie Status und alle Angaben jeder Massnahme: Name, ES-Nr., Beschreibung, Handlungsfeld, Aktivitätsbereich, Priorität, Start, Fälligkeit, Budget, Verantwortlichkeit, Bemerkungen). Die Liste zeigt pro Nachführung Datum und Anzahl der Änderungen (ohne Namen der Person); per Klick klappen die Details auf, und zwar der Vergleich mit der **vorherigen** Nachführung:
- Personen und Ziele: Bezeichnung mit «vorher» und «neu»,
- neue Massnahmen (mit Status), Massnahmen mit neuem Status (alt → neu), entfernte Massnahmen,
- **geänderte Massnahmenangaben**: je Massnahme die geänderten Felder (z. B. Fälligkeit, Budget, Beschreibung) mit altem und neuem Wert.

Zuoberst steht, sofern es Änderungen gibt, der laufende Stand «Seit <Datum der letzten Nachführung>, noch nicht nachgeführt» mit den bisherigen Änderungen. Bei der ersten Nachführung gibt es keinen Vergleich, es steht nur der Ausgangsstand. Bei Altdaten ohne gespeicherten Stand («Details nicht gespeichert») fehlt das Protokoll. Der Umsetzungszeitraum wird nicht einzeln protokolliert, weil er sich aus Start und Fälligkeit berechnet. Bei Nachführungen, die vor der Einführung der Massnahmenangaben im Stand gespeichert wurden, fehlt der Vergleich der Massnahmenangaben.

**Aktive Nachführung (Phase «offen», «fällig» oder vorzeitig gestartet):** gleiches Layout wie oben, aber zum Bearbeiten:
- Statuszeile: «Nachführung fällig seit …» (Warnfarbe), «Nachführung fällig am …» oder «Vorzeitige Nachführung» (mit Knopf «Vorzeitige Nachführung abbrechen»). Der Verlauf ist zugeklappt. Im aufgeklappten Verlauf steht auch «Seit der letzten Nachführung …» (Zusammenfassung der Änderungen), weil die Information interessant, aber nicht wichtig ist.
- Drei Kacheln mit **Bestätigungsstand** («✓ Bestätigt» bzw. «Zu prüfen»): Verantwortliche Personen, Ziele, Massnahmen (x von y bestätigt, überfällige in Rot). Darunter ist immer genau ein Bereich offen. Vorbelegt ist der erste noch nicht bestätigte Bereich. Nach dem Bestätigen eines Bereichs springt die Auswahl automatisch zum nächsten offenen. Ein Klick auf die offene Kachel schliesst sie.
- Die Regeln zum Prüfen und Bestätigen sowie zum Abschliessen bleiben wie in 4.4. «Nachführung abschliessen» (Fusszeile) ist erst aktiv, wenn alle drei Bereiche bestätigt sind.

**Prüfung der Massnahmen in der aktiven Nachführung:** Der Benutzer muss jede zu prüfende Massnahme mit **allen Feldern** ansehen und **ausdrücklich bestätigen**. Das Frontend stellt das so sicher:
- Die Kachel «Massnahmen» zeigt eine kompakte Liste (Markierung ✓ bestätigt, ! Fälligkeit überfällig, leer = noch zu prüfen) und darunter eine **Prüfkarte** der gewählten Massnahme mit allen Feldern auf einmal: Name, ES-Nr., Massnahme aus EPA, Beschreibung, Handlungsfeld, Aktivitätsbereich, Priorität, Prozessstatus, Start, Fälligkeit, Umsetzungszeitraum (berechnet), Budget, Verantwortlichkeit, Bemerkungen. Es gibt kein Aufklappen mehr. Mit «Vorherige/Nächste» oder per Klick auf die Liste wechselt man die Massnahme (die Seite scrollt zur Prüfkarte). Die Liste ist nach ID, Name, Prozessstatus und Fälligkeit sortierbar (Klick auf die Spaltenüberschrift wechselt auf-/absteigend, leere Fälligkeiten stehen am Schluss); «Vorherige/Nächste» und «Bestätigen und weiter» folgen der gewählten Sortierung. Der Zähler «überfällig» an der Kachel gilt nach derselben Regel wie die rote Markierung (Fälligkeit vor heute, Status nicht beendet).
- Eine Massnahme gilt nur nach Klick auf «Geprüft, bestätigen» als bestätigt. Es gibt **keine** automatische Bestätigung durch Anklicken, Ändern, CSV-Import oder «Alle bestätigen» (entfernt). Nach dem Bestätigen springt die Ansicht zur nächsten noch offenen Massnahme.
- Beim Bestätigen werden die Angaben geprüft wie im Massnahmenformular: Pflichtfelder (Name, Beschreibung, Massnahme aus EPA, Handlungsfeld, Aktivitätsbereich, Start, Fälligkeit, Budget), gültige Daten, Fälligkeit nach dem Start, Budget als ganze Zahl. Fehler werden am Feld angezeigt, und die Massnahme bleibt offen.
- **Fälligkeit in der Vergangenheit:** Liegt sie vor heute und ist der Status nicht «Abschluss», zeigt die Karte eine rote Warnung, und die Massnahme kann nicht bestätigt werden. Der Benutzer muss das Datum anpassen oder den Status auf «Abschluss» setzen. Das gilt lückenlos: Eine Massnahme zählt nur dann als bestätigt, solange ihre Fälligkeit nicht in der Vergangenheit liegt. Wird eine bestätigte Massnahme später überfällig oder ihr Datum in die Vergangenheit geändert, ist sie wieder «zu prüfen» und «Nachführung abschliessen» bleibt gesperrt. Entsprechend gilt für Dummydaten: Nicht abgeschlossene Massnahmen einer bereits nachgeführten Planung haben nie eine Fälligkeit vor dem Datum der letzten Nachführung.
- Änderungen werden sofort gespeichert. Jede Änderung setzt die Massnahme wieder auf «noch nicht bestätigt».
- **Neue Massnahmen** können direkt in der Nachführung erfasst werden («Neue Massnahme» über der Liste), ohne den Tab zu verlassen. Es erscheint eine leere Prüfkarte (Status «Geplant»). Alle Pflichtangaben wie im Massnahmenformular müssen ausgefüllt und die Massnahme bestätigt werden, sonst lässt sich die Nachführung nicht abschliessen. Eine in dieser Nachführung erfasste Massnahme kann bis zum Abschluss wieder verworfen (gelöscht) werden. Sie erscheint im Änderungsprotokoll als «Neue Massnahme».
- Beendete (abgeschlossene oder verworfene), unveränderte Massnahmen müssen nicht bestätigt werden (in der Liste mit «–» markiert, nur über «Alle anzeigen» sichtbar; in den Kacheln als «beendet» gezählt). Eine Änderung macht sie wieder prüfpflichtig.
- «Nachführung abschliessen» wird erst aktiv, wenn alle zu prüfenden Massnahmen so bestätigt sind (zusätzlich zu Personen und Zielen).

**Regel «Im Tab bleiben»:** Wer sich im Tab Nachführung befindet, bleibt dort. Ein Klick auf eine Massnahme (in der Übersicht, in der Prüfliste oder auf der Karte) öffnet deren Details innerhalb der Nachführung und wechselt **nicht** in den Tab Massnahmen. Gewechselt wird nur über die Tabs oben.

Eine **vorzeitige Nachführung** ist in der Phase «ruhend» jederzeit startbar.

### 4.4 Ablauf und Abschluss
Zu bestätigen sind:
1. **Verantwortliche Personen** (Kontakt Gemeinde, Berater/in Energieplanung),
2. **Ziele** (Netto-null, Energieeffizienz, Stromproduktion),
3. **Massnahmen** (jede zu prüfende Massnahme).

«Nachführung abschliessen» ist nur aktiv, wenn alles bestätigt ist.

Zu prüfen sind Massnahmen, die (a) noch nicht abgeschlossen sind, (b) seit der letzten Nachführung neu oder im Status geändert wurden oder (c) in dieser Nachführung bereits geändert/importiert wurden. Unveränderte, abgeschlossene Massnahmen müssen nicht bestätigt werden. Die Bestätigung einer Massnahme erfolgt ausschliesslich ausdrücklich in der Prüfkarte (siehe Abschnitt 4.3).

Änderungen an Verantwortlichen Personen, Zielen und Massnahmen werden **sofort gespeichert**. Eine Änderung an einer Massnahme bestätigt sie **nicht**, sie setzt sie auf «noch nicht bestätigt». Hat sich ein Wert seit der letzten Nachführung geändert, erscheint darunter nur ein dezenter Hinweis «geändert seit <Datum> · früheren Stand anzeigen». Der frühere Wert (durchgestrichen) ist erst nach einem Klick sichtbar. Eine Person unter «Verantwortliche Personen», die nicht mehr in den Kontakten existiert, wird mit Warnung markiert.

Beim Abschluss wird ein Protokolleintrag geschrieben: Datum, Benutzer, Anzahl geänderter Personen/Ziele, Anzahl Massnahmen, Momentaufnahme des Stands (Grundlage für «Seit der letzten Nachführung»). Danach beginnt ein neuer, ungeprüfter Zyklus und die nächste Frist wird nach 4.2 berechnet.

**Berater/in Energieplanung:** Statt einer externen Fachperson kann der Wert **«Aktuell keine externe Begleitung»** gewählt werden. Er steht zuoberst in der Auswahl und ist hervorgehoben. Das gilt überall, wo dieses Feld bearbeitet wird (Nachführung und Personen). Der Wert wird nicht als «Person nicht mehr in den Kontakten» gewarnt und gibt keinen Zugriff (Abschnitt 6). Sobald dieses Auswahlfeld den Sonderwert anbietet, kann man es nicht mehr auf «leer» zurücksetzen. Man wählt eine Person oder «Aktuell keine externe Begleitung». Das Feld «Kontakt Gemeinde» ist das Feld «Verantwortlichkeit Gemeinde» der Personen, nur in der Nachführung anders beschriftet. **Hinweis-Icon (i):** Neben «Verantwortlichkeit Gemeinde» bzw. «Kontakt Gemeinde» (Tab Personen, Ansicht und Formular, sowie Nachführung) steht ein Icon mit dem Text «Neue User bei uwe / Clara Bucher bestellen.» (Hover oder Fokus). Es erklärt, wie eine Person erhalten wird, die in der Auswahl fehlt.

**Nachführung wird nicht abgeschlossen (vom Fachbereich geklärt, 2026-11-19):** Es gibt keinen Abbruch mit Zurücksetzen. Änderungen und Bestätigungen bleiben auch ohne Abschluss gespeichert und sind für alle sichtbar.
- Änderungen an Personen, Zielen und Massnahmen sind sofort gespeichert und im Datenbestand (Massnahmenliste, Reports, Exporte) sichtbar. Es gibt keinen Entwurf, der erst beim Abschluss übernommen wird.
- Die Nachführung bleibt offen («fällig seit …»), die Frist läuft weiter. Ein Protokolleintrag und eine Momentaufnahme entstehen erst bei «Nachführung abschliessen». «Seit der letzten Nachführung» vergleicht weiter mit dem Stand der letzten abgeschlossenen Nachführung.
- «Vorzeitige Nachführung abbrechen» schliesst nur die Ansicht. Änderungen und Bestätigungen bleiben erhalten und sind beim erneuten Start einer vorzeitigen Nachführung wieder da.
- **Hinweis «in Bearbeitung»:** Sobald in einer laufenden Nachführung etwas geändert oder bestätigt wurde, steht im Tab Nachführung in der Statuszeile «In Bearbeitung seit <Datum> (begonnen von <Person>)». Der Hinweis verschwindet beim Abschluss. In der Liste der Energieplanungen zeigt das Badge in der Spalte «Status» einen blauen Punkt (siehe 7).
- **Parallele Bearbeitung** ist erlaubt, es gibt **keine Sperre**. Hat zuletzt eine andere Person als die angemeldete daran gearbeitet, erscheint im Tab der Hinweis «<Person> hat zuletzt am <Datum> daran gearbeitet». Bei exakt gleichzeitigem Speichern gilt der zuletzt gespeicherte Wert (Annahme, im Prototyp nicht prüfbar).


### 4.5 CSV-Import der Massnahmen
Dreistufig: **Datei → Zuordnung → Zusammenfassung**.

- Spalten: ES-Nr., Massnahme (Pflicht), Beschreibung, Status, Bemerkung. Trennzeichen `;` oder `,` (automatisch erkannt). Zeilen ohne Massnahmenname werden ignoriert.
- Statuswerte: `geplant`, `umsetzung`/`in umsetzung`, `abschluss`/`abgeschlossen`/`erledigt` (Gross-/Kleinschreibung egal), sonst leer.
- **Automatische Zuordnung** zu einer bestehenden Massnahme: zuerst über die ES-Nr., sonst über den Namen (ohne Gross-/Kleinschreibung). Jede Zeile kann manuell neu zugeordnet werden (in der Auswahl stehen zuerst die offenen Massnahmen, abgeschlossene und verworfene getrennt am Ende und mit Markierung «✓ Abgeschlossen» bzw. «✕ Verworfen»): *Neue Massnahme anlegen*, *Nicht importieren* oder *Bestehende Massnahme aktualisieren*.
- **Aktualisieren:** Name, ES-Nr., Beschreibung, Status und Bemerkung werden aus der Datei übernommen. **Leere Felder in der Datei lassen den bisherigen Wert unverändert.**
- **Neue Massnahmen** erhalten Status Geplant (oder den Status aus der Datei), «Massnahme aus EPA» = Nein, alle übrigen Felder leer (`-`).
- **Nicht in der Datei enthaltene, noch nicht abgeschlossene Massnahmen** bekommen eine Aktion pro Massnahme:
  - *Unverändert lassen* (Standard),
  - *Als abgeschlossen markieren* (Status Abschluss),
  - *Verworfen* (der Status wird auf «Verworfen» gesetzt, die Massnahme bleibt erhalten).
- Jede importierte oder geänderte Massnahme gilt in der Nachführung als **zu prüfen** und muss in der Prüfkarte bestätigt werden (neue Massnahmen sind unvollständig und müssen dabei ergänzt werden).

---

## 5. Kontakte
- Pflicht: Vorname, Nachname, E-Mail. Organisation ist optional. Im Kontaktformular gibt es **keine** Prüfung des E-Mail-Formats und keine Eindeutigkeitsprüfung (anders als beim Erfassen aus einer Auswahl, siehe unten).
- **Neue Person direkt in der Auswahl erfassen (nur Admin):** In jedem Personen-Auswahlfeld (Verantwortlichkeit der Massnahme, Beratungsperson, Kontakt Gemeinde, Berater/in Energieplanung, Verantwortlichkeit in der Nachführung) steht für Admins zuoberst «＋ Neue Person erfassen …». Der Dialog verlangt Vorname, Nachname und E-Mail (das Format wird geprüft). Eine Person mit gleichem Namen und gleicher Organisation wird abgelehnt. Je nach Feld gilt eine Einschränkung: bei **Kontakt Gemeinde** ist die Organisation eine der Gemeinden der Planung (vorgegebene Auswahl), bei **Beratungsperson** und **Berater/in Energieplanung** ist eine externe Organisation Pflicht (keine «Gemeinde …»). Im Dialog werden gleich die **Rollen** (Zugriff) gesetzt, mehrere sind möglich. Vorbelegt ist bei «Kontakt Gemeinde» die Rolle Gemeinde und bei den Berater-Feldern Energieberater/in, sonst keine Rolle. Die Rolle Gemeinde gilt für die Gemeinde der Organisation (die Organisation muss dazu eine Gemeinde des Kantons sein, «Gemeinde Adligenswil» oder nur «Adligenswil», sie wird dann als «Gemeinde …» gespeichert), die Rolle Energieberater/in für die Gemeinden der aktuellen Planung. Der Zugriff wird sofort gespeichert und nicht erst später automatisch berechnet. Die Person wird sofort in den Kontakten angelegt und im Feld gewählt. Bei den Feldern für externe Fachpersonen (Beratungsperson, Berater/in Energieplanung) ist die Rolle Gemeinde nicht wählbar. Andere Rollen sehen die Option nicht.
- **Löschen** (einzeln oder mehrere) nach Bestätigung, aber **nur, wenn der Kontakt nirgends mehr eingetragen ist**. Geprüft werden: Kontakt Gemeinde und Berater/in Energieplanung (Personen), Beratungsperson (EPA Beratung) und Verantwortlichkeit jeder Massnahme. Ein bestehender **Zugriff** (Rollen in der Zugriffsverwaltung) ist **kein** Löschgrund: er wird beim Löschen des Kontakts mit entfernt. War die gelöschte Person die angemeldete, wechselt die Ansicht zu Admin. Ist der Kontakt noch eingetragen, wird **nichts gelöscht** und es erscheint ein Hinweis mit der Liste aller Stellen, jeweils mit **Link**, der direkt dorthin führt (Planung im passenden Tab bzw. Massnahme); bei vielen Treffern werden die ersten 12 gezeigt. Beim Löschen mehrerer Kontakte wird gar nichts gelöscht, solange einer der ausgewählten verwendet wird. Einträge im Änderungsprotokoll früherer Nachführungen (Name der Person) zählen nicht als Verwendung.
- Auswahllisten für Personen sind nach Gemeinde-Kontakten und externen Fachpersonen gruppiert. Die Verantwortliche Person der Gemeinde ist auf Kontakte der betreffenden Gemeinde(n) beschränkt, Berater/innen auf externe Fachpersonen. **Suche:** Jede Personen-Auswahl hat eine eingebaute Suchzeile (Teil von Vor- oder Nachname bzw. Organisation, ohne Gross-/Kleinschreibung und Akzente). Sie filtert die Liste beim Tippen, Pfeiltasten und Enter wählen, Escape schliesst. «＋ Neue Person erfassen …» und «Aktuell keine externe Begleitung» bleiben beim Filtern sichtbar.

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
- **Titel:** Admin sehen «Übersicht Energieplanungen», alle anderen Rollen «Meine Energieplanungen». Sieht (verantwortet) eine Person nur **eine** Energieplanung, heisst es im Singular «Meine Energieplanung». Das gilt auch für den Zurück-Link in der Detailansicht und die Gruppe im Karteninhalt (dort bleibt es bei Admin immer «Meine Energieplanungen»).
- **Suche** über ID, Name, Jahr, Gemeinde und Regionsname.
- **Filter** nach Prozessschritt (Personen, EPA Beratung, Massnahmen, Gesuch, Nachführung).
- **Sortierung:** Gemeinde, Jahr, Status (in Prozessreihenfolge) und Termin (Fälligkeit).
- **Hover Liste und Karte:** Fährt man in der Übersicht über eine Zeile, wird auf der Karte nur die **Grenze** der Gemeinde (bei regionalen Planungen aller Gemeinden der Region) hervorgehoben. Die Flächenfarbe (Prozessstand) ändert sich dabei nicht. Fährt man auf der Karte über eine Gemeinde, wird die zugehörige Zeile in der Liste hervorgehoben.
- **Status-Spalte:** Zeigt nur den Prozessschritt (z. B. «Gesuch», «Massnahmen») mit dem Fortschrittsbalken, ohne Zusatztext. Im Schritt Nachführung steht, die wievielte Nachführung ansteht bzw. läuft («1. Nachführung», «4. Nachführung», …; = Anzahl erledigter Nachführungen + 1). Ist keine weitere Nachführung mehr nötig, steht nur «Nachführung». Eine fällige Nachführung wird über die Farbe des Badges (Warnfarbe) und die Termin-Spalte kenntlich gemacht. Läuft die Nachführung bereits (es wurde etwas geändert oder bestätigt, aber noch nicht abgeschlossen), hat das Badge oben rechts einen **blauen Punkt** (Tooltip «Nachführung in Bearbeitung seit <Datum>», siehe 4.4). Die Spalte «Nächster Schritt» gibt es nicht mehr.
- **Markierung auf der Übersichtskarte:** Gemeinden mit fälliger Nachführung sind orange eingefärbt, haben einen dunkelorangen Rand und über dem Gemeindenamen einen orangen «!»-Marker. Ist im Schritt «Personen» der *geplante Start* der EPA-Beratung überfällig (geplantes Startjahr vorbei, Beratung noch nicht gestartet), steht der «!»-Marker in **Grau**, die Fläche bleibt grau (Prozessstand «Personen»). Bei regionalen Planungen erhält jede betroffene Gemeinde einen Marker. In der Detailansicht einer Planung erscheinen die Marker nur bei deren Gemeinden. Offene Frage (Fachbereich): Soll ein überfälliger geplanter Start auf der Karte überhaupt markiert werden und in welcher Form?
- **Termin-Spalte:** bei noch nicht gestarteter Beratung das *geplante Startjahr* (nur Jahr, kein Datum). Überfällig ist es, sobald das Jahr vorbei ist (ab 1. Januar des Folgejahrs), Anzeige «⚠ geplant <Jahr>». Sonst die *nächste Nachführungsfrist* (bei fälligen mit Warnsymbol).

---

## 8. Reporting
| Report | Regel |
|---|---|
| Alle Energieplanungen | Übersicht mit Gemeinde, Status, Anzahl Massnahmen |
| EPA Masterplan | Stand der EPA-Beratung je Gemeinde (Daten aus der Masterplan-Datei) |
| Überfällige Massnahmen | Fälligkeitsdatum **vor heute** und Status nicht beendet (weder Abschluss noch Verworfen) |
| Massnahmen mit hohem Budget | Budget **über 100'000 CHF** |
| Nicht zugeordnete Kontakte | Kontakte, die weder bei einer EP (Verantwortlichkeit) noch bei einer Massnahme als Verantwortliche eingetragen sind (Vergleich über «Vorname Nachname») |

---

## 9. Offene Punkte / bekannte Lücken (Zusammenfassung)
1. Massenbearbeitung und CSV-Import können den berechneten Umsetzungszeitraum umgehen (3.3).
3. Fachlogik der Nachführungsfrist bei Verspätung bestätigen (4.2).
4. Keine Abhängigkeitsprüfungen beim Löschen von EP und Massnahmen (2.5, 3.7). Beim Löschen von Kontakten gibt es sie (5).
5. Keine Format-/Eindeutigkeitsprüfung bei E-Mail (Kontakte) und Gesuchs-Nr. von Hand (2.6, 5).
6. Rollenprüfung nur im Frontend (6).
7. Geografische Markierungen der Massnahmen sind nur lesbar, es gibt keinen Editor.
8. Parallele Bearbeitung der Nachführung: nur Hinweis auf die zuletzt bearbeitende Person, keine Konflikterkennung. Produktiv klären, wie bei exakt gleichzeitigem Speichern vorzugehen ist (4.4).
9. Geplanter Start der EPA-Beratung (nur Jahr): ob Pflichtfeld und ab wann «überfällig» gilt, fachlich bestätigen (2.5).

---

## Änderungsverlauf
| Datum | Änderung |
|---|---|
| 2026-11-19 | Beträge in CHF (Budget, Auszahlungsbetrag): automatischer Tausendertrenner bei der Eingabe, als Nice-to-have gekennzeichnet (Abschnitt 1, Formate). |
| 2026-11-19 | Liste: Spalte «Nächster Schritt» entfernt (auch aus der Sortierung). «In Bearbeitung» wird als blauer Punkt am Status-Badge gezeigt (Abschnitte 4.4, 7). |
| 2026-11-19 | «In Bearbeitung» wird nur im Tab Nachführung angezeigt (Statuszeile), nicht in der Liste der Energieplanungen (Abschnitte 4.4, 7). |
| 2026-11-19 | Dokumentation zum Stand dieser Änderungsrunde vervollständigt: Inhalt Tab Personen, Förderabschlussformular-Textfeld entfernt, Annahmen und offener Punkt Nr. 9 zum geplanten Start (Abschnitte 2.5, 2.6, 9). |
| 2026-11-19 | Neue Regel: Werte müssen markier- und kopierbar sein, Markieren löst keine Zeilen-Aktion aus (Abschnitt 1, Formate). |
| 2026-11-19 | Sektion «Energieträger» in der Massnahme entfernt (Abschnitt 3.1). |
| 2026-11-19 | Textfeld «Förderabschlussformular» (Stand) in der EPA Beratung entfernt. Das druckbare Formular im Tab Gesuch bleibt (Abschnitt 2.6). |
| 2026-11-19 | EPA Beratung: «Geplanter Start» ist nur noch eine Jahresplanung (Jahresauswahl statt Datum), nur durch Admin bearbeitbar, für andere Rollen schreibgeschützt. Überfällig erst nach Ablauf des Jahres (Abschnitte 2.5, 7). |
| 2026-11-19 | Personen-Auswahlfelder mit eingebauter Suche (Abschnitt 5). |
| 2026-11-19 | Hinweis-Icon bei «Verantwortlichkeit Gemeinde» / «Kontakt Gemeinde»: neue User bei uwe / Clara Bucher bestellen (Abschnitt 4.4). |
| 2026-11-19 | Energieplanung löschen nur noch für Admin (Abschnitt 2.5). |
| 2026-11-19 | Tab «Grunddaten» heisst neu «Personen» (interner Schlüssel bleibt `grunddaten`). Name, Planungstyp und Gemeinde(n) entfallen im Tab, sie werden nur noch beim Anlegen gesetzt (Abschnitte 2.1, 2.3, 2.5, 7). |
| 2026-11-19 | Nachführung ohne Abschluss: Antworten des Fachbereichs übernommen (kein Zurücksetzen, Änderungen für alle sichtbar, Hinweis «in Bearbeitung seit …» in Liste und Tab, parallele Bearbeitung ohne Sperre) (Abschnitte 4.4, 7, Offene Punkte Nr. 8). |
| 2026-11-16 | Übersichtskarte: fällige Nachführung mit oranger Fläche, Rand und «!»-Marker; überfälliger geplanter Start (Grunddaten) mit grauem «!»-Marker (Abschnitt 7). |
| 2026-11-16 | Offene Fragen zur nicht abgeschlossenen Nachführung festgehalten (Abschnitt 4.4, Offene Punkte Nr. 8). |
| 2026-11-16 | Nachführung: Massnahmenliste sortierbar; Klick auf Zeile scrollt zur Prüfkarte; Zähler «überfällig» an der Kachel zählt nur nicht beendete Massnahmen mit Fälligkeit vor heute (Abschnitt 4.3). |
| 2026-11-12 | Umbenennung: Massnahmenfeld «Weitere Bemerkungen» heisst «Bemerkungen / aktueller Stand» (Abschnitt 3.1). |
| 2026-11-12 | Neuer Massnahmenstatus «Verworfen» (Abschnitte 3.5, 4.5, 8). Importer: «Verworfen» setzt den Status statt zu löschen. |
| 2026-11-12 | Nachführung: Fälligkeit in der Vergangenheit macht eine Massnahme wieder «zu prüfen» (lückenlos). Dummydaten: Fälligkeiten nicht abgeschlossener Massnahmen liegen nach der letzten Nachführung (Abschnitt 4.3). |
| 2026-11-12 | Dummydaten: Alle Massnahmen haben ein Budget (alle Pflichtfelder gefüllt, wie das Massnahmenformular es verlangt). |
| 2026-11-12 | Datepicker: eigener deutscher Kalender statt des nativen Browser-Kalenders (Abschnitt 1). |
| 2026-11-12 | Nachführung: Massnahmen werden mit allen Feldern in einer Prüfkarte geprüft und ausdrücklich bestätigt. Fälligkeit in der Vergangenheit muss angepasst werden. Keine automatische Bestätigung mehr (Abschnitte 4.3, 4.4, 4.5). |
| 2026-11-12 | Umbenennung: «Zeitverlauf anzeigen» heisst «Verlauf anzeigen» (Abschnitt 4.3). |
| 2026-11-12 | Liste: Status-Spalte zeigt «n. Nachführung» im Schritt Nachführung (Abschnitt 7). |
| 2026-11-12 | Änderungsprotokoll deckt jetzt auch Massnahmenangaben (Termine, Budget, Beschreibung u. a.) ab. Dummydaten: Planungen mit 3 bzw. 4 erledigten Nachführungen (Abschnitt 4.3). |
| 2026-11-12 | Energieplanung nur löschbar, solange die EPA Beratung nicht gestartet ist (Abschnitt 2.5). |
| 2026-11-12 | Kontakt löschen: Zugriff in der Zugriffsverwaltung ist kein Löschgrund mehr, er wird mit entfernt (Abschnitt 5). |
| 2026-11-12 | Kontakte löschen nur, wenn nirgends eingetragen oder aktiv; sonst Hinweis mit Links zu den Verwendungen (Abschnitt 5). |
| 2026-11-12 | Titel im Singular «Meine Energieplanung», wenn nur eine Energieplanung sichtbar ist (Abschnitt 7). |
| 2026-11-12 | Titel der Planungsübersicht: «Meine Energieplanungen» für alle ausser Admin (Abschnitt 7). |
| 2026-11-12 | Importer: «überschreiben» heisst «aktualisieren»; in der Zuordnungsliste stehen abgeschlossene und verworfene Massnahmen am Ende und sind markiert (Abschnitt 4.5). |
| 2026-11-12 | «Bisherige Nachführungen»: vollständiges Änderungsprotokoll pro Nachführung inkl. laufendem Stand (Abschnitt 4.3). |
| 2026-11-12 | «Bisherige Nachführungen» in den Verlauf verschoben (Abschnitt 4.3). |
| 2026-11-12 | Früherer Stand (durchgestrichener Text) bei geänderten Personen/Zielen nur noch auf Klick sichtbar (Abschnitt 4.4). |
| 2026-11-12 | «Seit der letzten Nachführung» in den zugeklappten Verlauf verschoben (Abschnitt 4.3). |
| 2026-11-12 | Aktive Nachführung im gleichen Layout wie «ruhend»: Statuszeile, Verlauf zugeklappt, drei Kacheln mit Bestätigungsstand, ein Bereich offen (Abschnitt 4.3). |
| 2026-11-12 | Nachführung (ruhend): Statuszeile, Verlauf zugeklappt, Kacheln statt langer Abschnitte; Regel «Im Tab Nachführung bleiben» bei Klick auf Massnahmen (Abschnitt 4.3). |
| 2026-11-12 | Nachführung: schreibgeschützte Übersicht der Daten auch in der Phase «ruhend»/«keine» (Abschnitt 4.3). |
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
