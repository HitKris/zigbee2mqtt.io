/*
 * Pro100 Generator — silnik parametryczny korpusu (Warstwa 2)
 *
 * Czyste funkcje (bez DOM), łatwe do testowania. Wszystkie wymiary w milimetrach.
 * Konstrukcja domyślna: boki pełne na całą wysokość, wieńce (góra/dół) między bokami,
 * plecy HDF nakładane na tył. To najczęstszy układ prostej szafki korpusowej.
 *
 * Wynik buildFurniture(config) -> {
 *   formatki:   [ {nazwa, A, B, grubosc, ilosc, material, okleina, uwagi} ],
 *   akcesoria:  [ {nazwa, ilosc, jednostka} ],
 *   podsumowanie: { plytaM2, hdfM2, okleinaMb, liczbaFormatek }
 * }
 */
(function (global) {
  "use strict";

  // Zaokrąglenie do 1 mm
  function r(x) { return Math.round(x); }

  // Domyślna konfiguracja — pojedynczy mebel (szafka korpusowa)
  const DOMYSLNE = {
    typ: "szafka-stojaca",   // etykieta opisowa
    szer: 600,               // W
    wys: 720,                // H
    gl: 560,                 // D
    grubosc: 18,             // grubość płyty korpusu (t)
    gruboscHDF: 3,           // grubość pleców HDF
    liczbaPolek: 1,
    liczbaDrzwi: 2,          // 0, 1 lub 2
    liczbaSzuflad: 0,        // 0..n (jeśli >0, dolna część meblów to fronty szuflad)
    plecy: "nakladane",      // "nakladane" | "wpuszczane" | "brak"
    cofniecPolki: 20,        // o ile półka cofnięta od frontu
    luzFrontu: 2,            // luz frontu przy każdej krawędzi
    luzMiedzyFrontami: 3,    // luz między dwoma frontami
    luzProwadnicy: 13,       // luz na prowadnicę szuflady (na stronę) — standard
    material: "płyta 18 mm",
  };

  function buildFurniture(cfgIn) {
    const c = Object.assign({}, DOMYSLNE, cfgIn || {});
    const t = c.grubosc;
    const W = c.szer, H = c.wys, D = c.gl;
    const formatki = [];
    const akcesoria = [];

    // szerokość wewnętrzna między bokami
    const wewn = W - 2 * t;

    // --- Korpus ---
    // Boki (pełne na całą wysokość)
    formatki.push({
      nazwa: "Bok", A: r(H), B: r(D), grubosc: t, ilosc: 2,
      material: c.material, okleina: "przednia krawędź",
      uwagi: "lewy + prawy",
    });
    // Wieniec górny i dolny (między bokami)
    formatki.push({
      nazwa: "Wieniec (góra/dół)", A: r(wewn), B: r(D), grubosc: t, ilosc: 2,
      material: c.material, okleina: "przednia krawędź",
      uwagi: "między bokami",
    });

    // Półki
    if (c.liczbaPolek > 0) {
      const glPolki = D - c.cofniecPolki - (c.plecy === "nakladane" ? 0 : c.gruboscHDF);
      formatki.push({
        nazwa: "Półka", A: r(wewn), B: r(glPolki), grubosc: t, ilosc: c.liczbaPolek,
        material: c.material, okleina: "przednia krawędź",
        uwagi: `cofnięta ${c.cofniecPolki} mm`,
      });
    }

    // Plecy
    if (c.plecy === "nakladane") {
      formatki.push({
        nazwa: "Plecy HDF", A: r(W), B: r(H), grubosc: c.gruboscHDF, ilosc: 1,
        material: "HDF 3 mm", okleina: "—", uwagi: "nakładane na tył",
      });
    } else if (c.plecy === "wpuszczane") {
      // wpust ~ w połowie grubości boku, +2 mm zapasu z każdej strony
      const wp = 2 * (t / 2) - 2;
      formatki.push({
        nazwa: "Plecy HDF", A: r(W - 2 * t + wp), B: r(H - 2 * t + wp), grubosc: c.gruboscHDF,
        ilosc: 1, material: "HDF 3 mm", okleina: "—", uwagi: "wpuszczane w rowek",
      });
    }

    // --- Fronty ---
    const luz = c.luzFrontu;
    const nDrzwi = Math.max(0, Math.min(2, c.liczbaDrzwi | 0));
    const nSzuf = Math.max(0, c.liczbaSzuflad | 0);

    // Podział wysokości: część szufladowa (dół) + część z drzwiami (góra), jeśli oba ustawione.
    // W MVP: albo drzwi, albo szuflady na całej wysokości. Jeśli oba > 0 — dzielimy 50/50.
    let hDrzwiStrefa = H, hSzufStrefa = 0;
    if (nSzuf > 0 && nDrzwi > 0) { hSzufStrefa = Math.round(H / 2); hDrzwiStrefa = H - hSzufStrefa; }
    else if (nSzuf > 0) { hSzufStrefa = H; hDrzwiStrefa = 0; }

    // Fronty drzwi
    if (nDrzwi > 0 && hDrzwiStrefa > 0) {
      const hFront = hDrzwiStrefa - 2 * luz;
      let szerFront;
      if (nDrzwi === 1) szerFront = W - 2 * luz;
      else szerFront = (W - 2 * luz - c.luzMiedzyFrontami) / 2;
      formatki.push({
        nazwa: "Front drzwi", A: r(hFront), B: r(szerFront), grubosc: t, ilosc: nDrzwi,
        material: c.material, okleina: "obwód (4 krawędzie)",
        uwagi: nDrzwi === 2 ? "para" : "pojedynczy",
      });
      // zawiasy: 2 dla H<=900, 3 powyżej
      const zawiasNaFront = hFront <= 900 ? 2 : 3;
      akcesoria.push({ nazwa: "Zawias puszkowy", ilosc: nDrzwi * zawiasNaFront, jednostka: "szt." });
      akcesoria.push({ nazwa: "Uchwyt", ilosc: nDrzwi, jednostka: "szt." });
    }

    // Fronty szuflad + korpusy szuflad
    if (nSzuf > 0 && hSzufStrefa > 0) {
      const hFront = (hSzufStrefa - 2 * luz - (nSzuf - 1) * c.luzMiedzyFrontami) / nSzuf;
      const szerFront = W - 2 * luz;
      formatki.push({
        nazwa: "Front szuflady", A: r(hFront), B: r(szerFront), grubosc: t, ilosc: nSzuf,
        material: c.material, okleina: "obwód (4 krawędzie)",
        uwagi: `${nSzuf} szt.`,
      });
      akcesoria.push({ nazwa: "Uchwyt", ilosc: nSzuf, jednostka: "szt." });
      akcesoria.push({ nazwa: "Prowadnica (komplet)", ilosc: nSzuf, jednostka: "kpl." });

      // Uproszczony korpus szuflady (założenie: standardowe prowadnice, luz na stronę).
      // Świadomie oznaczone jako założenie — realny wymiar zależy od modelu prowadnicy.
      const szerSzuf = wewn - 2 * c.luzProwadnicy;
      const glSzuf = D - 50; // typowe skrócenie względem głębokości korpusu
      const wysBoku = 100;   // domyślna wysokość boku szuflady
      formatki.push({
        nazwa: "Bok szuflady", A: r(glSzuf), B: r(wysBoku), grubosc: t, ilosc: 2 * nSzuf,
        material: c.material, okleina: "górna krawędź",
        uwagi: `ZAŁOŻENIE: prowadnica ${c.luzProwadnicy} mm/str., wys. boku ${wysBoku} mm`,
      });
      formatki.push({
        nazwa: "Przód/tył szuflady", A: r(szerSzuf - 2 * t), B: r(wysBoku), grubosc: t, ilosc: 2 * nSzuf,
        material: c.material, okleina: "górna krawędź", uwagi: "między bokami szuflady",
      });
      formatki.push({
        nazwa: "Dno szuflady HDF", A: r(szerSzuf), B: r(glSzuf), grubosc: c.gruboscHDF, ilosc: nSzuf,
        material: "HDF 3 mm", okleina: "—", uwagi: "nakładane/wpuszczane",
      });
    }

    // --- Podsumowanie ---
    let plytaMM2 = 0, hdfMM2 = 0, okleinaMM = 0, liczbaFormatek = 0;
    for (const f of formatki) {
      const pole = f.A * f.B * f.ilosc;
      liczbaFormatek += f.ilosc;
      if (f.material.indexOf("HDF") >= 0) hdfMM2 += pole;
      else plytaMM2 += pole;
      // przybliżona długość okleiny
      const obwod = 2 * (f.A + f.B);
      if (f.okleina.indexOf("obwód") >= 0) okleinaMM += obwod * f.ilosc;
      else if (f.okleina.indexOf("krawędź") >= 0) okleinaMM += f.A * f.ilosc; // jedna dłuższa krawędź (przybliżenie)
    }

    return {
      config: c,
      formatki,
      akcesoria,
      podsumowanie: {
        plytaM2: +(plytaMM2 / 1e6).toFixed(3),
        hdfM2: +(hdfMM2 / 1e6).toFixed(3),
        okleinaMb: +(okleinaMM / 1000).toFixed(2),
        liczbaFormatek,
      },
    };
  }

  // --- Eksport: lista formatek do CSV (średnik — pod Excel PL / optymalizatory rozkroju) ---
  function specToCSV(spec) {
    const sep = ";";
    const naglowek = ["Nazwa", "Dlugosc_A_mm", "Szerokosc_B_mm", "Grubosc_mm", "Ilosc", "Material", "Okleina", "Uwagi"];
    const linie = [naglowek.join(sep)];
    for (const f of spec.formatki) {
      linie.push([f.nazwa, f.A, f.B, f.grubosc, f.ilosc, f.material, f.okleina, f.uwagi]
        .map((v) => String(v).replace(/;/g, ",")).join(sep));
    }
    return "﻿" + linie.join("\r\n"); // BOM dla Excela
  }

  // --- Eksport: bryła .obj do importu w Pro100 (File/Import/Model 3D) ---
  // Prymitywy-boxy wg konstrukcji. Jednostki OBJ w metrach (mm/1000) — Pro100 przy imporcie
  // interpretuje skalę; w razie potrzeby przeskaluj przy imporcie.
  function specToOBJ(spec) {
    const c = spec.config;
    const t = c.grubosc, W = c.szer, H = c.wys, D = c.gl;
    const hdf = c.gruboscHDF;
    const wewn = W - 2 * t;
    let out = "# Pro100 Generator — makieta 3D (jednostki: metry)\n";
    let vCount = 0;

    // Układ: X=szerokość(0..W), Y=wysokość(0..H), Z=głębokość(0=tył .. D=front)
    function box(name, x0, y0, z0, x1, y1, z1) {
      out += "o " + name + "\n";
      const S = 1000; // mm -> m
      const v = [
        [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0],
        [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1],
      ];
      for (const p of v) out += `v ${(p[0]/S).toFixed(4)} ${(p[1]/S).toFixed(4)} ${(p[2]/S).toFixed(4)}\n`;
      const o = vCount;
      const faces = [
        [1,2,3,4],[5,8,7,6],[1,5,6,2],[2,6,7,3],[3,7,8,4],[4,8,5,1],
      ];
      for (const f of faces) out += `f ${f.map((i)=>i+o).join(" ")}\n`;
      vCount += 8;
    }

    box("Bok_lewy", 0, 0, 0, t, H, D);
    box("Bok_prawy", W - t, 0, 0, W, H, D);
    box("Wieniec_dolny", t, 0, 0, W - t, t, D);
    box("Wieniec_gorny", t, H - t, 0, W - t, H, D);
    if (c.plecy !== "brak") box("Plecy", 0, 0, 0, W, H, hdf);

    // Półki (równomiernie w świetle korpusu)
    const nP = c.liczbaPolek | 0;
    for (let i = 1; i <= nP; i++) {
      const y = t + (H - 2 * t) * i / (nP + 1);
      box("Polka_" + i, t, y - t / 2, hdf, W - t, y + t / 2, D - c.cofniecPolki);
    }

    // Fronty (na froncie, wystają o grubość)
    const luz = c.luzFrontu;
    const nDrzwi = Math.max(0, Math.min(2, c.liczbaDrzwi | 0));
    const nSzuf = Math.max(0, c.liczbaSzuflad | 0);
    let hDrzwiStrefa = H, ySzufTop = 0;
    if (nSzuf > 0 && nDrzwi > 0) { const half = Math.round(H / 2); ySzufTop = half; hDrzwiStrefa = H - half; }
    else if (nSzuf > 0) { hDrzwiStrefa = 0; ySzufTop = H; }

    if (nDrzwi > 0 && hDrzwiStrefa > 0) {
      const y0 = ySzufTop + luz, y1 = H - luz;
      if (nDrzwi === 1) box("Front_drzwi", luz, y0, D, W - luz, y1, D + t);
      else {
        const mid = W / 2;
        box("Front_drzwi_L", luz, y0, D, mid - c.luzMiedzyFrontami / 2, y1, D + t);
        box("Front_drzwi_P", mid + c.luzMiedzyFrontami / 2, y0, D, W - luz, y1, D + t);
      }
    }
    if (nSzuf > 0) {
      const strefaH = ySzufTop; // od 0 do ySzufTop
      const hFront = (strefaH - 2 * luz - (nSzuf - 1) * c.luzMiedzyFrontami) / nSzuf;
      for (let i = 0; i < nSzuf; i++) {
        const y0 = luz + i * (hFront + c.luzMiedzyFrontami);
        box("Front_szuflada_" + (i + 1), luz, y0, D, W - luz, y0 + hFront, D + t);
      }
    }

    return out;
  }

  global.Pro100Engine = { DOMYSLNE, buildFurniture, specToCSV, specToOBJ };

  // Eksport dla Node (testy)
  if (typeof module !== "undefined" && module.exports) {
    module.exports = global.Pro100Engine;
  }
})(typeof window !== "undefined" ? window : globalThis);
