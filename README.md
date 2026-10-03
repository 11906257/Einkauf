# Einkauf

**Einkauf** ist eine installierbare Einkaufslisten-App für Smartphone, Tablet und Desktop. Sie funktioniert auch ohne Internetverbindung.

## Funktionen

- Mehrere Einkaufslisten verwalten
- Artikel mit Mengen, Einheiten und Artikelgruppen organisieren
- Einkäufe abhaken und häufig verwendete Artikel schneller wiederfinden
- Listen, Artikel und Gruppen bearbeiten und sortieren
- Daten als JSON-Backup exportieren und wieder importieren

## Datenschutz

Die App benötigt kein Konto, verwendet kein Tracking und stellt keine externen Verbindungen her. Alle Daten werden ausschließlich lokal in der Browser-Datenbank des Geräts gespeichert.

Werden die Website-Daten des Browsers gelöscht, gehen auch die Einkaufslisten verloren. Deshalb empfiehlt sich regelmäßig ein Backup über die Einstellungen.

## Updates

Updates auf derselben Website verwenden die vorhandene Datenbank weiter. Die Datenbank `einkaufslisten-app` (Schema-Version 5) und das Backup-Format (Version 2) bleiben kompatibel. Der Service Worker aktualisiert nur den Offline-Cache, nicht die gespeicherten Einkaufsdaten.

Ab Version 1.10.13 prüft die geöffnete App im Vordergrund jede Minute sowie beim Wiederöffnen und bei wiederhergestellter Internetverbindung auf Updates. Eine vollständig heruntergeladene Version wird automatisch übernommen, sobald keine Dialoge, Texteingaben oder Speichervorgänge offen sind. Listenansicht und Scrollposition bleiben nach Möglichkeit erhalten. Schlägt die Installation fehl, bleibt die bisherige Offline-Version verfügbar.

Bereits laufende ältere Versionen enthalten diese automatische Neuladefunktion noch nicht. Beim ersten Wechsel auf Version 1.10.13 ist daher gegebenenfalls ein Neuladen oder erneutes Öffnen nötig; danach funktioniert die automatische Übernahme auch bei künftig geöffnet bleibenden Apps.

`index.html` und `service-worker.js` immer gemeinsam veröffentlichen. Beide müssen dieselbe Versionsnummer verwenden; die App benötigt keine zusätzlichen Pakete oder Server-Komponenten.

Domain und Hosting-Pfad der installierten App sollten unverändert bleiben. Auf einer anderen Domain sind die bisherigen lokalen Daten nicht zugänglich; dafür ist ein Backup-Export und -Import nötig.
