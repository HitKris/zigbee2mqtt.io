# Krok 0 — zapytanie do producenta Pro100 (Ecru / Viasoft)

Cel: ustalić, czy istnieje **oficjalna** droga do programowego tworzenia lub importu projektu
Pro100 z zachowaniem **edytowalnych formatek** (API, dokumentacja formatu `.pro`, import
katalogu elementów, program partnerski). Odpowiedź decyduje, czy do narzędzia dokładamy
eksport natywny `.pro`, czy zostajemy przy imporcie `.obj` + liście formatek.

**Kanały:**
- Ecru Oprogramowanie (twórca) — formularz/e-mail ze strony https://www.ecru.pl
- Viasoft (dystrybutor PL) — https://www.viasoft.pl

---

## Treść wiadomości (do wysłania)

Temat: Pytanie o oficjalną integrację / API do programowego tworzenia projektów Pro100

Dzień dobry,

prowadzę usługę projektowania mebli w programie Pro100 (marka Hitner — projekty, rozkroje i
dokumentacja techniczna dla stolarni i klientów indywidualnych). Buduję własne narzędzie
przyspieszające przygotowanie projektów i chciałbym zapytać, czy Pro100 udostępnia jakąkolwiek
**oficjalną, wspieraną** drogę do programowego tworzenia lub importu projektu z zachowaniem
**edytowalnych formatek** — np.:

- API lub SDK,
- dokumentację formatu pliku projektu (`.pro`),
- import katalogu/elementów w formacie tekstowym lub tabelarycznym,
- program partnerski dla integracji z zewnętrznym oprogramowaniem.

Zależy mi na rozwiązaniu oficjalnym i zgodnym z licencją, nie na obchodzeniu formatu. Będę
wdzięczny za informację, czy coś takiego jest możliwe i z kim mógłbym to ewentualnie omówić.

Pozdrawiam,
[Imię i nazwisko] — Hitner
[telefon] · [e-mail] · [strona]

---

## Co zrobić z odpowiedzią
- **Jest droga natywna** → dołożyć do narzędzia eksport `.pro` (Warstwa 4 planu) i podmienić
  etap eksportu z `.obj` na plik natywny.
- **Brak / tylko import 3D** → zostajemy przy obecnym MVP (formatki + rysunek + `.obj`), który
  i tak realnie skraca czas pracy.

---

# Ścieżka BXF2 (Blum) — PRIORYTET

Pro100 (od wersji **6.41**) importuje pliki `*.bxf2` z konfiguratora korpusów Blum jako
**edytowalny mebel** (formatki + rozkrój + pozycje wierceń + okucia). BXF2 to **XML** (tekst),
więc da się go generować programowo. To realna droga do „szkic → edytowalny mebel w Pro100",
omijająca zamknięty `.pro`.

Źródła: https://www.blum.com/eu/en/services/industrial-production/cad-cam-interface/ ·
https://www.ecru.pl/pl/blg/import-plikow-bxf2

## Krok A — zdobyć przykładowy plik `.bxf2` (najważniejsze)
W konfiguratorze korpusów online Blum zaprojektować **prostą szafkę** (zbliżoną do typowego
zlecenia) i wyeksportować do `*.bxf2`. Ten jeden realny plik pozwala odtworzyć schemat XML i
zbudować generator, który podstawia własne wymiary. Bez próbki generowanie „w ciemno" zostanie
odrzucone przy imporcie (schemat jest ścisły: numery artykułów Blum, wzory wierceń).

- Konfigurator korpusów Blum: https://www.blum.com/pl/pl/services/planning-construction-product-selection/cabinet-configurator/

## Krok B — specyfikacja interfejsu BXF (program partnerski Blum)
Dla pełnej, trwałej zgodności — nie tylko odwzorowania próbki — Blum udostępnia opis
interfejsu BXF firmom wdrażającym import/eksport. To oficjalna, wspierana droga do pełnej
specyfikacji formatu.

Temat: Prośba o specyfikację interfejsu BXF (integracja z Pro100)

Dzień dobry,

buduję narzędzie generujące projekty korpusów meblowych i chciałbym dodać eksport do formatu
**BXF2**, tak aby wyniki dało się zaimportować do Pro100 (i ewentualnie produkować na
MINIPRESS/EASYSTICK). Proszę o informację, jak dołączyć do programu dla partnerów
oprogramowania oraz jak uzyskać opis/specyfikację interfejsu BXF (struktura pliku, wymagane
pola, numery artykułów, wzory wierceń). Z kim po Waszej stronie mógłbym to omówić?

Pozdrawiam,
[Imię i nazwisko] — Hitner
[telefon] · [e-mail] · [strona]

## Co dalej (po zdobyciu próbki lub specyfikacji)
1. Odtworzyć strukturę XML z przykładowego `.bxf2`.
2. Dodać do narzędzia moduł eksportu `bxf2` (mapowanie: specyfikacja mebla → XML BXF2).
3. Test: import wygenerowanego `.bxf2` do Pro100 (v6.41+) i sprawdzenie, czy wchodzi jako
   edytowalne formatki z rozkrojem i wierceniami.
