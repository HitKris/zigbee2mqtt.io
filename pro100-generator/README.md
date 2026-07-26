# Pro100 Generator — asystent projektu mebla (MVP)

Narzędzie dla marki **Hitner**: na podstawie parametrów mebla (odczytanych ze szkicu)
generuje **listę formatek**, **rysunek 2D z wymiarami** i **bryłę 3D `.obj`** do wczytania
w programie Pro100. Cel: skrócić czas mierzenia i liczenia — właściwy mebel składasz w Pro100.

## Dlaczego tak, a nie „szkic → gotowy plik .pro"
Natywny format projektu Pro100 (`.pro`) jest **zamknięty** — brak publicznego API/SDK i
dokumentacji formatu. Pro100 importuje z zewnątrz tylko bryły 3D (`.obj`, `.3ds`, `.dae`) jako
„martwą" siatkę, bez edytowalnych formatek. Dlatego to narzędzie działa jako **asystent**:
robi całe rozpoznanie i liczenie, a finalny, edytowalny mebel składasz w Pro100 z katalogu —
korzystając z gotowej listy formatek i bryły `.obj` jako makiety odniesienia.

> Jeśli producent (Ecru / Viasoft) udostępni oficjalną drogę natywną — patrz
> `zapytanie-do-producenta.md` — dołożymy eksport bezpośrednio do `.pro`.

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
- **v2:** odczyt wymiarów bezpośrednio ze zdjęcia odręcznego szkicu (vision, Claude API).
- **v3:** kolejne rodziny mebli; docelowo cała aranżacja (wiele modułów).
- **Warstwa natywna:** eksport `.pro`, jeśli producent udostępni oficjalną drogę.
