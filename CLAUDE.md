# Projekt: Energieplanung (Prototyp)

Aktuelle Arbeitsversion: `v1.5/` (die Dateien im Hauptordner und `Backup*` sind ältere Stände).

## Pflicht: Dokumentation für Entwickler nachführen

Zwei Dokumente gehen an Entwickler/innen und müssen aktuell bleiben:

- `v1.5/Business-Rules.md`: alle fachlichen Regeln.
- `v1.5/Datenmodell.md`: das Datenmodell (Tabellen, Felder, Beziehungen, Aufzählungen, Einschränkungen).

### Business-Rules.md
Bei **jeder** Änderung, die eine fachliche Regel berührt, im selben Arbeitsschritt `Business-Rules.md` anpassen. Dazu zählen: Pflichtfelder, Validierungen, Berechnungen, Fristen, Status und Übergänge, Rollen und Zugriff, Import- und Reportlogik, Auswahllisten, Meldungen mit fachlichem Inhalt.

### Datenmodell.md
Bei **jeder** Änderung, die Daten betrifft, im selben Arbeitsschritt `Datenmodell.md` anpassen. Dazu zählen: neue, umbenannte oder entfernte Felder, neue Auswahlwerte (Aufzählungen), neue Beziehungen oder Einschränkungen, neu gespeicherte Stände (z. B. im Änderungsprotokoll), Änderungen an berechneten Werten.

### Für beide Dokumente
- Das gilt auch, wenn der Prompt nicht darauf hinweist. Nicht erst auf Nachfrage.
- Abschnitt anpassen, im «Änderungsverlauf» einen Eintrag (Datum, Kurzbeschrieb) ergänzen und bei Bedarf die Liste «Offene Punkte / bekannte Lücken» nachführen.
- Texte in der Oberfläche, die eine Regel erklären (Tooltips, Hinweise, Anleitungen), müssen zur Regel passen und werden mit angepasst.
- Am Ende der Antwort kurz erwähnen, welche Abschnitte welches Dokuments angepasst wurden.
- Wird eine Änderung rein visuell oder technisch ohne fachliche bzw. Daten-Wirkung gemacht, ist keine Anpassung nötig.
- Ist eine Regel unklar oder eine Interpretation nötig, die Annahme im Dokument festhalten («Offene Frage»).
