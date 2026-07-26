# Schemat BXF2 — notatka robocza (do wypełnienia z próbki)

Ten plik dokumentuje strukturę formatu **BXF2** (Blum), żeby móc zbudować eksporter
`specToBXF2()` w `engine.js`. **Status: oczekuje na przykładowy plik `.bxf2`** wyeksportowany
z konfiguratora korpusów Blum. Do czasu jego otrzymania nie generujemy BXF2 „w ciemno" —
schemat jest ścisły i taki plik zostałby odrzucony przy imporcie do Pro100.

## Co już wiemy (z researchu)
- BXF/BXF2 to **XML** (tekst). Nagłówek: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`
  oraz komentarz „Copyright … Julius Blum GmbH".
- Plik zawiera: **formatki** z wymiarami rozkroju, **pozycje/wzory wierceń** oraz **okucia**.
- Pro100 od wersji **6.41** importuje `*.bxf2` jako **edytowalny** mebel (nie martwą bryłę).
- Cel w naszym narzędziu: użyć BXF2 jako **nośnika geometrii mebla** (formatki + wymiary),
  bez wymogu realnych okuć Blum — do potwierdzenia z próbki, czy wersja minimalna przejdzie.

## Do uzupełnienia po otrzymaniu próbki
Otwórz przykładowy `.bxf2` w edytorze tekstu i uzupełnij:

1. **Korzeń i przestrzenie nazw** — element główny, atrybuty, deklaracje.
2. **Definicja mebla/korpusu** — gdzie zapisane są wymiary gabarytowe (szer × wys × gł).
3. **Formatki (części drewniane)** — nazwa elementu, pola wymiarów (A/B/grubość), materiał,
   okleina, ilość. Mapowanie na nasze `spec.formatki` (z `buildFurniture()`).
4. **Wiercenia** — struktura pozycji/wzorów; które są wymagane, a które opcjonalne.
5. **Okucia** — czy da się plik bez realnych artykułów Blum; jeśli nie — minimalny szkielet.
6. **Pola wymagane vs opcjonalne** — najmniejszy zestaw, który Pro100 przyjmie.

## Plan implementacji (po odtworzeniu schematu)
1. Dodać `specToBXF2(spec)` w `engine.js` (analogicznie do `specToOBJ`), budujące XML z szablonu
   i podstawiające wymiary z `buildFurniture()`.
2. Dodać przycisk „Pobierz .bxf2" w `index.html` + obsługę w `app.js`.
3. Test: import w Pro100 (v6.41+) → sprawdzić edytowalne formatki, wymiary i wiercenia;
   porównać rozkrój z wyjściem `specToCSV` dla tych samych parametrów.

## Przykładowa próbka
Wklej tu (lub dołącz obok) treść realnego `.bxf2`, gdy będzie dostępna:

```xml
<!-- TODO: wkleić zawartość przykładowego pliku .bxf2 z konfiguratora Blum -->
```
