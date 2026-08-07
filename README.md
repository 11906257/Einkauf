# Einkauf

Version 1.0.0 – build-freie Progressive Web App ohne externe Abhängigkeiten. Alle Dateien können direkt auf GitHub Pages veröffentlicht werden. Einkaufslisten und Produkthistorien bleiben ausschließlich im IndexedDB-Speicher des jeweiligen Geräts.

## Lokal prüfen

Im Projektordner einen lokalen Webserver starten und anschließend die angezeigte Adresse im Browser öffnen. Ein Webserver ist erforderlich, damit der Service Worker funktioniert.

```sh
python3 -m http.server 4173
```

## Veröffentlichung auf GitHub Pages

1. Den gesamten Inhalt dieses Ordners in die oberste Ebene eines GitHub-Repositorys übertragen.
2. Unter **Settings → Pages → Build and deployment** die Option **Deploy from a branch** auswählen.
3. Den gewünschten Branch, üblicherweise `main`, und den Ordner `/ (root)` auswählen und speichern.
4. Nach der Veröffentlichung die von GitHub angezeigte Pages-Adresse einmal öffnen und anschließend zum Offline-Test neu laden.

Relative Pfade und die `.nojekyll`-Datei sorgen dafür, dass die App auch unter einem Repository-Unterpfad korrekt ausgeliefert wird.

### Neue Version veröffentlichen

Bei jeder veröffentlichten Version muss `CACHE_NAME` in `service-worker.js` auf eine neue eindeutige Version gesetzt werden, zum Beispiel `einkauf-app-v1.0.1`. Dadurch installiert der Browser den neuen App-Shell-Cache und entfernt ausschließlich ältere Caches dieser App.

## Funktionsumfang

Beim ersten Start wird automatisch eine leere Liste „Einkauf“ angelegt. Es werden keine Beispielprodukte mitgeliefert. Die App unterstützt mehrere eigenständige Listen, schnelles Hinzufügen, Abhaken und Entfernen per Wisch. Produkthistorie und Kaufhäufigkeit werden unsichtbar und getrennt pro Liste gespeichert. Long Press, Artikelbearbeitung, Mengenangaben und eine manuelle Listensortierung sind bewusst nicht Bestandteil dieser Version.

## Datenschutz und Sicherung

Es werden keine Daten übertragen. Das Löschen der Browser- oder Websitedaten entfernt deshalb auch alle Einkaufslisten; eine Cloud-Synchronisierung oder Exportfunktion existiert nicht.
