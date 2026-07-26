# Schemat BXF2 — odtworzony z próbki

Na podstawie realnego pliku `przyklady/037-06.bxf2` (szafka Blum 1000×788×542 mm, TANDEMBOX).
Eksporter `specToBXF2()` w `engine.js` odwzorowuje tę strukturę — **bez okuć Blum** (sama
geometria formatek), do importu w Pro100 6.41+ jako edytowalny korpus.

## Struktura pliku
```
<bxf ns="http://www.blum.com/bxf2">
  <head>            version 2.3, <unit meter="0.001" name="mm"/>, degree, PL/pl, copyright
  <scene><nodes><node>
     <cabinetLinks><cabinetLink referenceId="ID00001">
        <parameters> … wymiary korpusu (patrz niżej) …
  <library>
     <components/> <machiningGroups/> <machinings/>   ← okucia/wiercenia (u nas puste)
     <cabinetGroups/>
     <cabinets><cabinet id="ID00001" uid="…">
        <partLinks>   ← po jednym na panel: referenceId→part, uid, description, <transformations>
     <containers/>                                     ← szuflady Blum (u nas puste)
     <parts>       ← formatki: modelKey, id, uid, <geometry Box><extent>A B grubość</extent>, material wood
     <functionUnits/> <articles/>                      ← okucia Blum (u nas puste)
```
Kolejność elementów w `<library>` jest istotna (sekwencja XSD) — zachowana jw. Puste sekcje
okuciowe zostawiamy dla zgodności ze schematem.

## Parametry korpusu (`cabinetLink`)
`strengthtop/bottom/left/right`=grubość płyty (18), `gaptop/bottom`=3, `gapleft/right`=2,
`gapfront`=4, `outerwidth`=W, `height`=H, `depth`=D, `innerwidth`=W−2t, `innerdepth`=D−plecy,
`cabinetbackdesign`=layOn (plecy nakładane), `type`=standard, `planningsystem`=FREE.

## Formatki (`parts` + placement w `partLinks`)
`<extent>` = wymiar cięcia (znak koduje orientację); transformacje = rotacje osiowo‑kątowe
„x y z kąt” + translacja. Układ: X=szerokość(0..W), Y=wysokość(0..H), Z=głębokość(0=tył..D=front).

| modelKey | element | extent | transformacje (rot + trans) |
|---|---|---|---|
| `KUB` | wieniec dolny | `W × (D−back) × t` | rot 1 0 0 −90; trans 0 0 D |
| `KSL` | bok lewy | `−(H−t) × (D−back) × t` | rot 1 0 0 −90; rot 0 0 1 −90; trans 0 t D |
| `KSR` | bok prawy | `(H−t) × (D−back) × t` | rot 1 0 0 −90; rot 0 0 1 90; trans W t D |
| `TRAV-KOB` | trawers górny przód | `−innerwidth × 100 × t` | rot 1 0 0 −90; rot 0 0 1 180; trans t H D |
| `TRAV-KOB` | trawers górny tył | `innerwidth × 100 × t` | rot 1 0 0 90; trans t H back |
| `KRW` | plecy | `−W × H × back` | trans W 0 0 |
| `H-FRON-Blende` | front | `frontW × frontH × t` | rot 0 1 0 180; trans (W−gapR) yFront (D+t) |

Fronty: szuflady = piętrowo (frontH=(H−2·gapTB−(n−1)·gapMid)/n, yFront=gapTB+i·(frontH+gapMid)),
drzwi = obok siebie (frontH=H−2·gapTB; 1 drzwi frontW=W−2·gapSide; 2 drzwi frontW=(W−2·gapSide−gapMid)/2).

## Weryfikacja zgodności (Node)
Dla wymiarów z próbki (1000×788×542, 2 fronty) `specToBXF2` daje extenty **identyczne** z próbką:
KUB 1000×539×18, boki 770×539×18, plecy 1000×788×3, trawersy 964×100×18, fronty 996×389×18.

## Znane ograniczenia / do dopracowania
- **Bez okuć** — sekcje `functionUnits/articles/machinings` puste. Do potwierdzenia, czy Pro100
  przyjmie wersję bezokuciową (pierwszy test u użytkownika).
- **Brak modelKey** dla: pełnego wieńca górnego (mamy trawersy), półki, edytowalnej szuflady,
  frontu drzwiowego innego niż „Blende”. Wymaga kolejnych próbek, by dodać te typy.
- `uid` generujemy prosto (`G`/`L`+id); format do zweryfikowania przy imporcie.
- Format `drawingDetail` (orientacja usłojenia) ustawiony domyślnie — do korekty jeśli potrzeba.
