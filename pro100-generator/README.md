# Pro100 Generator — asystent projektu mebla (MVP)

Narzędzie dla marki **Hitner**: na podstawie parametrów mebla (odczytanych ze szkicu)
generuje **listę formatek**, **rysunek 2D z wymiarami** i **bryłę 3D `.obj`** do wczytania
w programie Pro100. Cel: skrócić czas mierzenia i liczenia — właściwy mebel składasz w Pro100.

## Dwie drogi do Pro100

**1. `.obj` — makieta (jest w MVP).** Natywny format projektu Pro100 (`.pro`) jest zamknięty,
a import 3D (`.obj`, `.3ds`, `.dae`) daje tylko „martwą" siatkę bez formatek. Ta ścieżka
działa jako **asystent**: liczy i rysuje, a mebel składasz w Pro100 z katalogu, korzystając z
listy formatek i `.obj` jako makiety odniesienia.

**2. BXF2 (Blum) — edytowalny korpus (docelowo).** Pro100 (od wersji **6.41**) importuje pliki
`*.bxf2` z konfiguratora korpusów Blum jako **edytowalny mebel** — z wymiarami formatek
(rozkrój), pozycjami wierceń i okuciami. BXF2 to **XML** (tekst), więc da się go generować
programowo. To realna droga do „szkic → edytowalny mebel w Pro100", omijająca zamknięty `.pro`.
Wymaga odtworzenia schematu z **przykładowego pliku `.bxf2`** (eksport z konfiguratora Blum)
oraz — dla pełnej zgodności — specyfikacji interfejsu BXF z programu partnerskiego Blum.
Szczegóły i kontakty: `zapytanie-do-producenta.md`.

## Jak uruchomić
Otwórz `index.html` w przeglądarce (wystarczy dwuklik — nie wymaga instalacji ani serwera).

1. Wpisz parametry mebla ze szkicu (wymiary, drzwi, półki, szuflady, plecy).
2. Kliknij **Generuj projekt** — zobaczysz rysunek, listę formatek i podsumowanie.
3. Pobierz wyniki:
   - **CSV (rozkrój)** — lista formatek pod Excel PL / optymalizatory rozkroju (OptiCut, CutList).
   - **`.obj` (Pro100)** — makieta 3D: w Pro100 *Plik → Import → Model 3D*.
   - **rysunek SVG** oraz **Drukuj / PDF** — dokumentacja.

## Konstrukcja (założenia domyślne)
- Boki pełne na całą wysokość; wieńce (góra/dół) między bokami.
- Plecy HDF 3 mm nakładane na tył (opcjonalnie wpuszczane lub brak).
- Fronty nakładane z luzem 2 mm przy krawędzi i 3 mm między frontami.
- Korpus szuflady liczony z założeniem prowadnicy 13 mm/stronę (do korekty pod konkretny model).

Wszystkie założenia są parametrami w `engine.js` (`DOMYSLNE`) — łatwo dostosować pod własny
standard warsztatu.

## Pliki
| Plik | Rola |
|---|---|
| `index.html` | Interfejs (formularz + wyniki) |
| `engine.js` | Silnik parametryczny + eksport CSV/OBJ (czyste funkcje, testowalne w Node) |
| `app.js` | Warstwa UI: odczyt formularza, render tabeli i rysunków, pobieranie plików |
| `zapytanie-do-producenta.md` | Krok 0: pismo do Ecru/Viasoft o oficjalną drogę integracji |

## Test silnika (Node)
```bash
node -e 'const E=require("./engine.js"); console.log(E.buildFurniture({szer:600,wys:720,gl:560}).podsumowanie)'
```

## Roadmap
- **v1 (jest):** parametry → formatki + rysunek + `.obj`. Rodzina: szafka korpusowa.
- **v2 — eksport BXF2 (priorytet):** generator `*.bxf2` (XML) → import do Pro100 jako
  **edytowalny** korpus. Wymaga przykładowego pliku `.bxf2` z konfiguratora Blum do odtworzenia
  schematu. Największa wartość — pełny, edytowalny mebel zamiast makiety.
- **v3:** odczyt wymiarów wprost ze zdjęcia odręcznego szkicu (vision, Claude API).
- **v4:** kolejne rodziny mebli; docelowo cała aranżacja (wiele modułów).
