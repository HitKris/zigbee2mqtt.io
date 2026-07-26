/* Pro100 Generator — warstwa UI (odczyt formularza, render wyników, pobieranie plików) */
(function () {
  "use strict";
  const E = window.Pro100Engine;
  const $ = (id) => document.getElementById(id);
  let spec = null;

  function czytajConfig() {
    return {
      typ: $("typ").value || "Mebel",
      szer: +$("szer").value, wys: +$("wys").value, gl: +$("gl").value,
      grubosc: +$("grubosc").value, gruboscHDF: +$("gruboscHDF").value,
      liczbaPolek: +$("liczbaPolek").value,
      liczbaDrzwi: +$("liczbaDrzwi").value,
      liczbaSzuflad: +$("liczbaSzuflad").value,
      plecy: $("plecy").value,
      material: $("material").value || "płyta",
    };
  }

  function render() {
    spec = E.buildFurniture(czytajConfig());
    renderSum(spec);
    renderTabela(spec);
    renderAkc(spec);
    renderRysunki(spec);
  }

  function renderSum(s) {
    const p = s.podsumowanie;
    $("sum").innerHTML = [
      ["Formatki", p.liczbaFormatek + " szt."],
      ["Płyta", p.plytaM2 + " m²"],
      ["HDF", p.hdfM2 + " m²"],
      ["Okleina", "~" + p.okleinaMb + " mb"],
    ].map(([k, v]) => `<div>${k}<b>${v}</b></div>`).join("");
  }

  function renderTabela(s) {
    let h = "<table><thead><tr><th>Element</th><th class='num'>A [mm]</th>" +
      "<th class='num'>B [mm]</th><th class='num'>gr.</th><th class='num'>szt.</th>" +
      "<th>Materiał</th><th>Okleina</th></tr></thead><tbody>";
    for (const f of s.formatki) {
      h += `<tr><td>${f.nazwa}<div class="uwaga">${f.uwagi || ""}</div></td>` +
        `<td class='num'>${f.A}</td><td class='num'>${f.B}</td>` +
        `<td class='num'>${f.grubosc}</td><td class='num'>${f.ilosc}</td>` +
        `<td>${f.material}</td><td>${f.okleina}</td></tr>`;
    }
    h += "</tbody></table>";
    $("tabela").innerHTML = h;
  }

  function renderAkc(s) {
    if (!s.akcesoria.length) { $("akc").innerHTML = ""; return; }
    let h = "<div class='uwaga' style='margin-bottom:6px'>Akcesoria</div><table><tbody>";
    for (const a of s.akcesoria)
      h += `<tr><td>${a.nazwa}</td><td class='num'>${a.ilosc} ${a.jednostka}</td></tr>`;
    h += "</tbody></table>";
    $("akc").innerHTML = h;
  }

  // --- Rysunki SVG (schematyczne, z wymiarami) ---
  function renderRysunki(s) {
    const c = s.config;
    $("front").innerHTML = rysWidok(c.szer, c.wys, "front", c);
    $("side").innerHTML = rysWidok(c.gl, c.wys, "side", c);
  }

  function rysWidok(szerMM, wysMM, typ, c) {
    const pad = 46, maxW = typ === "front" ? 360 : 200, maxH = 300;
    const sc = Math.min((maxW - 2 * pad) / szerMM, (maxH - 2 * pad) / wysMM);
    const w = szerMM * sc, h = wysMM * sc;
    const x0 = pad, y0 = pad, W = maxW, H = h + 2 * pad;
    const t = c.grubosc * sc;
    let g = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
    // korpus
    g += rect(x0, y0, w, h, "#fff", "#101827", 1.5);
    // ścianki wewn.
    g += rect(x0, y0, t, h, "#eef2ff", "#94a3b8", .7);
    g += rect(x0 + w - t, y0, t, h, "#eef2ff", "#94a3b8", .7);
    g += rect(x0, y0, w, t, "#eef2ff", "#94a3b8", .7);
    g += rect(x0, y0 + h - t, w, t, "#eef2ff", "#94a3b8", .7);

    if (typ === "front") {
      // półki
      const nP = c.liczbaPolek | 0;
      for (let i = 1; i <= nP; i++) {
        const y = y0 + h * i / (nP + 1);
        g += line(x0 + t, y, x0 + w - t, y, "#cbd5e1", .8);
      }
      // podział frontów (drzwi/szuflady)
      const nD = Math.max(0, Math.min(2, c.liczbaDrzwi | 0));
      const nS = Math.max(0, c.liczbaSzuflad | 0);
      let split = null;
      if (nS > 0 && nD > 0) split = y0 + h / 2;
      if (split) g += line(x0, split, x0 + w, split, "#64748b", 1);
      if (nD === 2) g += line(x0 + w / 2, split || y0, x0 + w / 2, split ? split : y0 + h, "#64748b", 1);
      if (nS > 0) {
        const top = split || y0, bot = y0 + h;
        for (let i = 1; i < nS; i++) {
          const y = top + (bot - top) * i / nS;
          g += line(x0, y, x0 + w, y, "#64748b", 1);
        }
      }
    }

    // wymiary
    g += wymiarPoziom(x0, x0 + w, y0 + h + 16, szerMM);
    g += wymiarPion(x0 - 16, y0, y0 + h, wysMM);
    g += `</svg>`;
    return g;
  }

  function rect(x, y, w, h, fill, stroke, sw) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
  }
  function line(x1, y1, x2, y2, stroke, sw) {
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}"/>`;
  }
  function wymiarPoziom(x1, x2, y, mm) {
    const c = "#2f6df6";
    return line(x1, y, x2, y, c, 1) +
      line(x1, y - 4, x1, y + 4, c, 1) + line(x2, y - 4, x2, y + 4, c, 1) +
      `<text x="${(x1 + x2) / 2}" y="${y + 14}" fill="${c}" font-size="11" text-anchor="middle">${mm} mm</text>`;
  }
  function wymiarPion(x, y1, y2, mm) {
    const c = "#2f6df6";
    return line(x, y1, x, y2, c, 1) +
      line(x - 4, y1, x + 4, y1, c, 1) + line(x - 4, y2, x + 4, y2, c, 1) +
      `<text x="${x - 6}" y="${(y1 + y2) / 2}" fill="${c}" font-size="11" text-anchor="middle" transform="rotate(-90 ${x - 6} ${(y1 + y2) / 2})">${mm} mm</text>`;
  }

  // --- Pobieranie plików ---
  function pobierz(nazwa, tresc, mime) {
    const blob = new Blob([tresc], { type: mime || "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = nazwa;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  function baza() {
    const t = (spec.config.typ || "mebel").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return `${t}-${spec.config.szer}x${spec.config.wys}x${spec.config.gl}`;
  }

  // --- Podpięcie zdarzeń ---
  $("gen").addEventListener("click", render);
  $("csv").addEventListener("click", () => { if (!spec) render(); pobierz(baza() + "-formatki.csv", E.specToCSV(spec), "text/csv;charset=utf-8"); });
  $("obj").addEventListener("click", () => { if (!spec) render(); pobierz(baza() + ".obj", E.specToOBJ(spec), "text/plain"); });
  $("svg").addEventListener("click", () => {
    if (!spec) render();
    const front = $("front").innerHTML, side = $("side").innerHTML;
    const doc = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="340"><text x="12" y="20" font-family="sans-serif" font-size="13">${spec.config.typ}</text><g transform="translate(0,24)">${front}</g><g transform="translate(380,24)">${side}</g></svg>`;
    pobierz(baza() + "-rysunek.svg", doc, "image/svg+xml");
  });
  $("print").addEventListener("click", () => window.print());

  // pierwszy render
  render();
})();
