// ===========================================================================
// Subsistema Garrigues · documentos v3 (base unificada)
//
// Hereda las primitivas de garrigues-documentos/g2.mjs y las lleva al sistema
// unificado del 22-09-2026: verde de la plantilla corporativa (#004339),
// Cambria en títulos y cuerpo, Calibri en rótulos y tablas, interlineado 1,15.
//
// Qué cambia respecto de g2:
//   - Tokens unificados (T) con el verde #004339 en vez de #004136.
//   - Los logotipos son opcionales: sin PNG, el documento sale igual y limpio.
//   - Bloques nuevos: CABECERA, FICHA, FIRMAS, CLAUSULA, NOTA, CITA, ESPACIO.
//   - CONTENIDO(items): un solo modelo de contenido para todas las plantillas.
//   - empaquetar(): primera página limpia opcional, pie "Página X de Y",
//     y updateFields solo cuando hay índice.
//
// Toda plantilla de plantillas/tipos/ se arma solo con lo que exporta este archivo.
// ===========================================================================
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import JSZip from 'jszip';

export const T = {
  verde: '004339',
  verdeMedio: '007665',
  verdeVivo: '00A07E',
  menta: '63C3B0',
  gris: 'ECECEC',
  grisTexto: '494948',
  verdeClaro: 'EDF2F0',
  cebra: 'F7FAF9',
  tinta: '1A1A1A',
  tintaSec: '5A5A5A',
  filete: 'C9D4D1',
  blanco: 'FFFFFF',
  bandaTexto: 'BFD4CE',
  rojo: 'B3261E',
  ambar: 'C98A1B',
  verdeOk: '2E7D32',
};

export const TW = 9404;      // ancho útil en twips: carta menos márgenes de 2,5 cm
const LINEA = 276;           // interlineado 1,15 (240 = sencillo)

export const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// --- runs: texto con **negrita** y *cursiva* ---------------------------------
export function runs(text, base = {}) {
  const {
    size = 22, color = T.tinta, font = 'Cambria',
    bold = false, italic = false, caps = false, spacing = 0, underline = false,
  } = base;
  const parts = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const src = String(text ?? '');
  let last = 0, m;
  while ((m = re.exec(src)) !== null) {
    if (m.index > last) parts.push({ t: src.slice(last, m.index), b: bold, i: italic });
    const tok = m[0];
    if (tok.startsWith('**')) parts.push({ t: tok.slice(2, -2), b: true, i: italic });
    else parts.push({ t: tok.slice(1, -1), b: bold, i: true });
    last = m.index + tok.length;
  }
  if (last < src.length) parts.push({ t: src.slice(last), b: bold, i: italic });
  if (!parts.length) parts.push({ t: '', b: bold, i: italic });

  return parts.map(p => {
    const rPr = `<w:rPr><w:rFonts w:ascii="${font}" w:hAnsi="${font}" w:cs="${font}"/>`
      + (p.b ? '<w:b/>' : '') + (p.i ? '<w:i/>' : '')
      + (caps ? '<w:caps/>' : '')
      + (underline ? '<w:u w:val="single"/>' : '')
      + (spacing ? `<w:spacing w:val="${spacing}"/>` : '')
      + `<w:color w:val="${color}"/><w:sz w:val="${size}"/><w:szCs w:val="${size}"/></w:rPr>`;
    const inner = p.t.split('\t').map(s => `<w:t xml:space="preserve">${esc(s)}</w:t>`).join('<w:tab/>');
    return `<w:r>${rPr}${inner}</w:r>`;
  }).join('');
}

export const sp = (before, after, line = LINEA) =>
  `<w:spacing w:before="${before}" w:after="${after}" w:line="${line}" w:lineRule="auto"/>`;

// --- registro de numeraciones -------------------------------------------------
const numRegistry = [];
let lastKind = null, lastNumId = null;
const allocNum = (a) => (numRegistry.push(a), numRegistry.length);
const breakList = () => { lastKind = null; lastNumId = null; };
const ABSTRACT = { bullet: 0, roman: 1, letter: 2, decimal: 3 };
export const romperLista = breakList;

// --- párrafo ----------------------------------------------------------------
export const P = (text, o = {}) => {
  breakList();
  const {
    align = 'both', before = 0, after = 140, indent = 0, right = 0,
    size, color, bold, italic, font, line, caps, spacing: sPace, underline,
    tabRight, shade, barra, keepNext, pageBreak,
  } = o;
  const tabs = tabRight ? `<w:tabs><w:tab w:val="right" w:leader="dot" w:pos="${tabRight}"/></w:tabs>` : '';
  const bdr = barra
    ? `<w:pBdr><w:left w:val="single" w:sz="18" w:space="10" w:color="${T.verde}"/></w:pBdr>` : '';
  const shd = shade ? `<w:shd w:val="clear" w:fill="${shade}"/>` : '';
  return `<w:p><w:pPr>${pageBreak ? '<w:pageBreakBefore/>' : ''}${sp(before, after, line ?? LINEA)}${tabs}`
    + `<w:jc w:val="${align}"/>${bdr}${shd}`
    + (keepNext ? '<w:keepNext/>' : '')
    + ((indent || right) ? `<w:ind w:left="${indent}" w:right="${right}"/>` : '')
    + `</w:pPr>${runs(text, { size, color, bold, italic, font, caps, spacing: sPace, underline })}</w:p>`;
};

// --- títulos ----------------------------------------------------------------
export const ROTULO = (text, o = {}) =>
  `<w:p><w:pPr>${o.pageBreak ? '<w:pageBreakBefore/>' : ''}${sp(o.before ?? 400, o.after ?? 40)}<w:jc w:val="left"/><w:keepNext/>`
  + (o.indent ? `<w:ind w:left="${o.indent}"/>` : '') + '</w:pPr>'
  + runs(text, { size: o.size ?? 16, color: o.color ?? T.verdeMedio, bold: true, caps: true, spacing: 40, font: 'Calibri' })
  + '</w:p>';

export const H1 = (text, overline, o = {}) => {
  breakList();
  const pb = o.pageBreak ? '<w:pageBreakBefore/>' : '';
  const over = overline ? ROTULO(overline, { pageBreak: o.pageBreak, before: 400, after: 40 }) : '';
  return over
    + `<w:p><w:pPr><w:pStyle w:val="Heading1"/>${overline ? '' : pb}${sp(overline ? 0 : 400, 60)}<w:jc w:val="left"/><w:keepNext/>`
    + `<w:pBdr><w:bottom w:val="single" w:sz="18" w:space="6" w:color="${T.verde}"/></w:pBdr>`
    + `</w:pPr>${runs(text, { size: 32, color: T.verde, bold: true })}</w:p>`
    + `<w:p><w:pPr><w:spacing w:before="0" w:after="170" w:line="40" w:lineRule="exact"/><w:keepNext/><w:pBdr><w:bottom w:val="single" w:sz="4" w:space="1" w:color="${T.filete}"/></w:pBdr></w:pPr></w:p>`;
};

export const H2 = (text, o = {}) => {
  breakList();
  return `<w:p><w:pPr><w:pStyle w:val="Heading2"/>${o.pageBreak ? '<w:pageBreakBefore/>' : ''}${sp(o.before ?? 320, 120)}<w:jc w:val="left"/><w:keepNext/>`
    + `<w:pBdr><w:top w:val="single" w:sz="4" w:space="8" w:color="${T.filete}"/></w:pBdr>`
    + `</w:pPr>${runs(text, { size: 26, color: T.verde, bold: true })}</w:p>`;
};

export const H3 = (text) => {
  breakList();
  return `<w:p><w:pPr><w:pStyle w:val="Heading3"/>${sp(260, 100)}<w:jc w:val="left"/><w:keepNext/></w:pPr>`
    + `${runs(text, { size: 23, color: T.verdeMedio, bold: true })}</w:p>`;
};

// Diagnóstico / Recomendación: rótulo en versalitas + párrafo con filete lateral
export const ROT = (rotulo, resto) => {
  breakList();
  return ROTULO(rotulo, { before: 240, after: 30, indent: 170, color: T.verde, size: 17 })
    + P(resto, { barra: true, indent: 170, before: 0, after: 160, keepNext: false });
};

export const LI = (text, lvl = 0, kind = 'bullet') => {
  if (lastKind !== kind) { lastNumId = allocNum(ABSTRACT[kind] ?? 0); lastKind = kind; }
  return `<w:p><w:pPr>${sp(0, 110)}<w:jc w:val="both"/>`
    + `<w:numPr><w:ilvl w:val="${lvl}"/><w:numId w:val="${lastNumId}"/></w:numPr>`
    + `</w:pPr>${runs(text)}</w:p>`;
};

export const PAGEBREAK = '<w:p><w:pPr><w:spacing w:after="0"/></w:pPr><w:r><w:br w:type="page"/></w:r></w:p>';
export const ESPACIO = (twips = 240) => `<w:p><w:pPr><w:spacing w:before="0" w:after="0" w:line="${twips}" w:lineRule="exact"/></w:pPr></w:p>`;

// Nota al pie del cuerpo (limitaciones, advertencias), en Calibri gris
export const NOTA = (text) => P(text, { size: 17, color: T.tintaSec, font: 'Calibri', after: 100 });

// Cita textual de una cláusula o norma: sangrada, en cursiva
export const CITA = (text) => P(text, { indent: 567, right: 567, italic: true, after: 160, color: T.grisTexto });

// --- semáforo ---------------------------------------------------------------
const SEM = {
  rojo: [T.rojo, 'No cumple'],
  ambar: [T.ambar, 'Insuficiente'],
  verde: [T.verdeOk, 'Cumple'],
  gris: [T.tintaSec, 'No aplica'],
};
export const PALABRA_SEM = Object.fromEntries(Object.entries(SEM).map(([k, v]) => [k, v[1]]));

// --- tablas -----------------------------------------------------------------
// Sin líneas verticales; cabecera invertida en verde; cebra en las filas.
// anchos: en twips, o fracciones que suman 1 (se convierten a twips).
export function TABLE(rows, opts = {}) {
  breakList();
  let { anchos, widths, headerRows = 1, zebra = true, fontSize = 18 } = opts;
  anchos = anchos ?? widths;
  if (anchos && anchos.every(a => a <= 1)) anchos = anchos.map(a => Math.round(a * TW));
  const borders = '<w:tblBorders>'
    + `<w:top w:val="single" w:sz="4" w:space="0" w:color="${T.verde}"/>`
    + `<w:bottom w:val="single" w:sz="8" w:space="0" w:color="${T.verde}"/>`
    + `<w:insideH w:val="single" w:sz="2" w:space="0" w:color="${T.filete}"/>`
    + '<w:left w:val="none" w:sz="0" w:space="0" w:color="auto"/>'
    + '<w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>'
    + '<w:insideV w:val="none" w:sz="0" w:space="0" w:color="auto"/>'
    + '</w:tblBorders>';
  const grid = anchos ? `<w:tblGrid>${anchos.map(w => `<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid>` : '';

  const body = rows.map((r, ri) => {
    const isHead = ri < headerRows;
    const fill = isHead ? T.verde : (zebra && (ri - headerRows) % 2 === 1 ? T.cebra : null);
    const cells = r.map((c, ci) => {
      const w = anchos ? `<w:tcW w:w="${anchos[ci]}" w:type="dxa"/>` : '';
      const shd = fill ? `<w:shd w:val="clear" w:fill="${fill}"/>` : '';
      let content;
      if (c && typeof c === 'object' && c.sem) {
        const [col, palabraDefault] = SEM[c.sem] || [T.tintaSec, '—'];
        content = `<w:p><w:pPr>${sp(50, 50, 240)}<w:jc w:val="left"/></w:pPr>`
          + runs('● ', { size: 21, color: col, font: 'Calibri' })
          + runs(c.texto ?? palabraDefault, { size: fontSize, color: T.tinta, font: 'Calibri', bold: true })
          + '</w:p>';
      } else {
        const obj = (c && typeof c === 'object') ? c : { texto: c };
        const txt = String(obj.texto ?? '');
        const jc = obj.alinear ?? 'left';
        content = txt.split('\n').map(line =>
          `<w:p><w:pPr>${sp(50, 50, 240)}<w:jc w:val="${jc}"/></w:pPr>`
          + runs(line, {
            size: fontSize, font: 'Calibri',
            color: isHead ? T.blanco : T.tinta,
            bold: isHead || !!obj.bold,
          }) + '</w:p>').join('');
      }
      return `<w:tc><w:tcPr>${w}${shd}<w:vAlign w:val="center"/>`
        + '<w:tcMar><w:top w:w="90" w:type="dxa"/><w:bottom w:w="90" w:type="dxa"/>'
        + '<w:left w:w="130" w:type="dxa"/><w:right w:w="130" w:type="dxa"/></w:tcMar>'
        + `</w:tcPr>${content}</w:tc>`;
    }).join('');
    return `<w:tr><w:trPr><w:cantSplit/>${isHead ? '<w:tblHeader/>' : ''}</w:trPr>${cells}</w:tr>`;
  }).join('');

  return `<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/>${borders}`
    + '<w:tblLayout w:type="fixed"/></w:tblPr>' + grid + body + '</w:tbl>'
    + `<w:p><w:pPr>${sp(0, 200)}</w:pPr></w:p>`;
}

// Tarjetas del resumen ejecutivo: cifras grandes con filete superior de color
export function TARJETAS(items) {
  breakList();
  const w = Math.floor(TW / items.length);
  const cell = (it) =>
    `<w:tc><w:tcPr><w:tcW w:w="${w}" w:type="dxa"/>`
    + `<w:shd w:val="clear" w:fill="${T.verdeClaro}"/>`
    + `<w:tcBorders><w:top w:val="single" w:sz="24" w:space="0" w:color="${it.color ?? T.verde}"/></w:tcBorders>`
    + '<w:tcMar><w:top w:w="140" w:type="dxa"/><w:bottom w:w="140" w:type="dxa"/>'
    + '<w:left w:w="140" w:type="dxa"/><w:right w:w="140" w:type="dxa"/></w:tcMar></w:tcPr>'
    + `<w:p><w:pPr>${sp(0, 20, 240)}<w:jc w:val="center"/></w:pPr>`
    + runs(String(it.n), { size: 48, color: it.color ?? T.verde, bold: true }) + '</w:p>'
    + `<w:p><w:pPr>${sp(0, 0, 240)}<w:jc w:val="center"/></w:pPr>`
    + runs(it.label, { size: 17, color: T.tinta, font: 'Calibri', caps: true, spacing: 20 }) + '</w:p>'
    + '</w:tc>';
  return '<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/>'
    + '<w:tblBorders><w:insideV w:val="single" w:sz="24" w:space="0" w:color="FFFFFF"/></w:tblBorders>'
    + '<w:tblLayout w:type="fixed"/></w:tblPr>'
    + `<w:tblGrid>${items.map(() => `<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid>`
    + `<w:tr>${items.map(cell).join('')}</w:tr></w:tbl>`
    + `<w:p><w:pPr>${sp(0, 240)}</w:pPr></w:p>`;
}

// --- imagen -----------------------------------------------------------------
let docPrId = 100;
const img = (relId, wpx, hpx, name) => {
  const cx = Math.round(wpx * 9525), cy = Math.round(hpx * 9525);
  docPrId += 1;
  return `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing">`
    + `<wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${docPrId}" name="${name}"/>`
    + '<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">'
    + '<a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">'
    + '<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">'
    + `<pic:nvPicPr><pic:cNvPr id="0" name="${name}"/><pic:cNvPicPr/></pic:nvPicPr>`
    + `<pic:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="${relId}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>`
    + `<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm>`
    + '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>'
    + '</pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>';
};

// Los logotipos se resuelven una vez por documento, en empaquetar().
const estado = { logo: false, logoBlanco: false };

const tablaSinBordes = (alto, fill, contenido, margenes) =>
  '<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/>'
  + '<w:tblBorders><w:top w:val="none"/><w:bottom w:val="none"/><w:left w:val="none"/><w:right w:val="none"/></w:tblBorders>'
  + '<w:tblCellMar><w:left w:w="0" w:type="dxa"/><w:right w:w="0" w:type="dxa"/></w:tblCellMar>'
  + '<w:tblLayout w:type="fixed"/></w:tblPr>'
  + `<w:tblGrid><w:gridCol w:w="${TW}"/></w:tblGrid>`
  + `<w:tr><w:trPr><w:trHeight w:val="${alto}"/></w:trPr>`
  + `<w:tc><w:tcPr><w:tcW w:w="${TW}" w:type="dxa"/><w:shd w:val="clear" w:fill="${fill}"/>`
  + `<w:tcMar><w:top w:w="${margenes[0]}" w:type="dxa"/><w:bottom w:w="${margenes[2]}" w:type="dxa"/>`
  + `<w:left w:w="${margenes[3]}" w:type="dxa"/><w:right w:w="${margenes[1]}" w:type="dxa"/></w:tcMar>`
  + `<w:vAlign w:val="bottom"/></w:tcPr>${contenido}</w:tc></w:tr></w:tbl>`;

// --- portada ----------------------------------------------------------------
// Banda verde con el título invertido; el logotipo blanco solo si existe.
export function PORTADA({ rotulo = 'Informe', titulo, subtitulo, cliente, fecha, pie, ficha = [] }) {
  breakList();
  const linea = (txt, o) => `<w:p><w:pPr>${sp(o.before || 0, o.after || 0, o.line || 260)}<w:jc w:val="left"/></w:pPr>`
    + runs(txt, o) + '</w:p>';
  const logo = estado.logoBlanco
    ? `<w:p><w:pPr>${sp(0, 700)}</w:pPr>${img('rIdLogoBlanco', 168, 25, 'Logotipo')}</w:p>`
    : `<w:p><w:pPr>${sp(0, 700)}</w:pPr></w:p>`;
  const banda = tablaSinBordes(4200, T.verde,
    logo
    + linea(rotulo, { size: 17, color: T.menta, bold: true, caps: true, spacing: 60, font: 'Calibri', after: 120 })
    + linea(titulo, { size: 52, color: T.blanco, bold: true, after: 140, line: 240 })
    + (subtitulo ? linea(subtitulo, { size: 22, color: T.bandaTexto, after: 0, line: 300 }) : ''),
    [700, 560, 500, 560]);
  const pares = [['Preparado para', cliente], ['Fecha', fecha], ...ficha];
  const fichaXml = pares.filter(p => p[1]).map(([k, v]) =>
    linea(k, { size: 17, color: T.verdeMedio, bold: true, caps: true, spacing: 40, font: 'Calibri', after: 60 })
    + linea(v, { size: 24, color: T.tinta, after: 220 })).join('');
  return banda
    + `<w:p><w:pPr>${sp(600, 100)}</w:pPr></w:p>`
    + fichaXml
    + `<w:p><w:pPr>${sp(500, 60)}<w:pBdr><w:top w:val="single" w:sz="8" w:space="8" w:color="${T.verde}"/></w:pBdr></w:pPr></w:p>`
    + (pie ? linea(pie, { size: 17, color: T.tintaSec, font: 'Calibri', after: 0 }) : '')
    + PAGEBREAK;
}

// --- cabecera de documento sin portada (acta, memorándum, carta, certificado)
export function CABECERA({ rotulo, titulo, bajada }) {
  breakList();
  return (rotulo ? ROTULO(rotulo, { before: 0, after: 40 }) : '')
    + `<w:p><w:pPr><w:pStyle w:val="Heading1"/>${sp(0, 60)}<w:jc w:val="left"/><w:keepNext/>`
    + `<w:pBdr><w:bottom w:val="single" w:sz="18" w:space="6" w:color="${T.verde}"/></w:pBdr></w:pPr>`
    + runs(titulo, { size: 36, color: T.verde, bold: true }) + '</w:p>'
    + `<w:p><w:pPr><w:spacing w:before="0" w:after="${bajada ? 60 : 240}" w:line="40" w:lineRule="exact"/><w:keepNext/><w:pBdr><w:bottom w:val="single" w:sz="4" w:space="1" w:color="${T.filete}"/></w:pBdr></w:pPr></w:p>`
    + (bajada ? P(bajada, { size: 19, color: T.tintaSec, font: 'Calibri', align: 'left', after: 260 }) : '');
}

// --- ficha: pares rótulo / valor (Para, De, Fecha, Referencia) ----------------
export function FICHA(pares, o = {}) {
  breakList();
  const wk = o.anchoRotulo ?? 1900;
  const wv = TW - wk;
  const filas = pares.filter(p => p && p[1] != null && p[1] !== '').map(([k, v]) =>
    '<w:tr><w:trPr><w:cantSplit/></w:trPr>'
    + `<w:tc><w:tcPr><w:tcW w:w="${wk}" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr>`
    + `<w:p><w:pPr>${sp(60, 60, 240)}<w:jc w:val="left"/></w:pPr>`
    + runs(k, { size: 16, color: T.verdeMedio, bold: true, caps: true, spacing: 40, font: 'Calibri' }) + '</w:p></w:tc>'
    + `<w:tc><w:tcPr><w:tcW w:w="${wv}" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr>`
    + String(v).split('\n').map(l => `<w:p><w:pPr>${sp(60, 60, 240)}<w:jc w:val="left"/></w:pPr>${runs(l, { size: 21 })}</w:p>`).join('')
    + '</w:tc></w:tr>').join('');
  return '<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/>'
    + `<w:tblBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="${T.filete}"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="${T.filete}"/>`
    + '<w:left w:val="none"/><w:right w:val="none"/><w:insideH w:val="none"/><w:insideV w:val="none"/></w:tblBorders>'
    + '<w:tblCellMar><w:left w:w="60" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tblCellMar>'
    + '<w:tblLayout w:type="fixed"/></w:tblPr>'
    + `<w:tblGrid><w:gridCol w:w="${wk}"/><w:gridCol w:w="${wv}"/></w:tblGrid>${filas}</w:tbl>`
    + `<w:p><w:pPr>${sp(0, 240)}</w:pPr></w:p>`;
}

// --- firmas: líneas de firma en columnas ---------------------------------------
export function FIRMAS(firmantes, o = {}) {
  breakList();
  const cols = Math.min(o.columnas ?? (firmantes.length >= 3 ? 3 : firmantes.length || 1), 3);
  const w = Math.floor(TW / cols);
  const grupos = [];
  for (let i = 0; i < firmantes.length; i += cols) grupos.push(firmantes.slice(i, i + cols));
  const celda = (f) => `<w:tc><w:tcPr><w:tcW w:w="${w}" w:type="dxa"/>`
    + '<w:tcMar><w:left w:w="200" w:type="dxa"/><w:right w:w="200" w:type="dxa"/></w:tcMar></w:tcPr>'
    + `<w:p><w:pPr>${sp(o.alto ?? 700, 80, 240)}<w:jc w:val="center"/><w:keepNext/>`
    + `<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="4" w:color="${T.tinta}"/></w:pBdr></w:pPr></w:p>`
    + `<w:p><w:pPr>${sp(0, 0, 240)}<w:jc w:val="center"/><w:keepNext/></w:pPr>${runs(f.nombre, { size: 20, bold: true })}</w:p>`
    + (f.cargo ? `<w:p><w:pPr>${sp(0, 0, 240)}<w:jc w:val="center"/><w:keepNext/></w:pPr>${runs(f.cargo, { size: 17, color: T.tintaSec, font: 'Calibri' })}</w:p>` : '')
    + (f.detalle ? `<w:p><w:pPr>${sp(0, 0, 240)}<w:jc w:val="center"/></w:pPr>${runs(f.detalle, { size: 16, color: T.tintaSec, font: 'Calibri' })}</w:p>` : '')
    + '</w:tc>';
  const vacia = `<w:tc><w:tcPr><w:tcW w:w="${w}" w:type="dxa"/></w:tcPr><w:p/></w:tc>`;
  const filas = grupos.map(g => {
    const celdas = g.map(celda).join('') + vacia.repeat(cols - g.length);
    return `<w:tr><w:trPr><w:cantSplit/></w:trPr>${celdas}</w:tr>`;
  }).join('');
  return '<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/>'
    + '<w:tblBorders><w:top w:val="none"/><w:bottom w:val="none"/><w:left w:val="none"/><w:right w:val="none"/><w:insideH w:val="none"/><w:insideV w:val="none"/></w:tblBorders>'
    + '<w:tblLayout w:type="fixed"/></w:tblPr>'
    + `<w:tblGrid>${Array(cols).fill(`<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid>${filas}</w:tbl>`
    + `<w:p><w:pPr>${sp(0, 120)}</w:pPr></w:p>`;
}

// --- cláusula de contrato: "PRIMERO. Título." + párrafos ---------------------
export const ORDINALES = ['PRIMERO', 'SEGUNDO', 'TERCERO', 'CUARTO', 'QUINTO', 'SEXTO', 'SÉPTIMO', 'OCTAVO',
  'NOVENO', 'DÉCIMO', 'DÉCIMO PRIMERO', 'DÉCIMO SEGUNDO', 'DÉCIMO TERCERO', 'DÉCIMO CUARTO', 'DÉCIMO QUINTO',
  'DÉCIMO SEXTO', 'DÉCIMO SÉPTIMO', 'DÉCIMO OCTAVO', 'DÉCIMO NOVENO', 'VIGÉSIMO'];
export const ordinal = (i) => ORDINALES[i] ?? `CLÁUSULA ${i + 1}`;

export function CLAUSULA(numero, titulo, parrafos = []) {
  breakList();
  const enc = `<w:p><w:pPr>${sp(280, 100)}<w:jc w:val="left"/><w:keepNext/></w:pPr>`
    + runs(`${ordinal(numero)}. `, { size: 22, bold: true, color: T.verde })
    + runs(titulo.endsWith('.') ? titulo : `${titulo}.`, { size: 22, bold: true })
    + '</w:p>';
  return enc + CONTENIDO(parrafos);
}

// --- índice automático -----------------------------------------------------
// Campo TOC de Word. Mientras Word no lo actualiza (F9, o al abrir), muestra la
// lista de títulos que se le pasa, así el PDF exportado sin actualizar no queda vacío.
export const TOC = (titulos = []) => {
  const estatico = titulos.length
    ? titulos.map((t, i) => `<w:p><w:pPr><w:pStyle w:val="TOC1"/></w:pPr>${runs(t)}</w:p>`).join('')
      + `<w:p><w:pPr>${sp(120, 0)}</w:pPr>${runs('Paginación: actualice el índice con F9.', { size: 17, color: T.tintaSec, italic: true, font: 'Calibri' })}</w:p>`
    : `<w:p>${runs('Actualice el índice con F9 para ver la paginación.', { size: 20, color: T.tintaSec, italic: true })}</w:p>`;
  return `<w:p><w:pPr>${sp(0, 0)}</w:pPr>`
    + '<w:r><w:fldChar w:fldCharType="begin" w:dirty="true"/></w:r>'
    + '<w:r><w:instrText xml:space="preserve"> TOC \\o "1-2" \\h \\z \\u </w:instrText></w:r>'
    + '<w:r><w:fldChar w:fldCharType="separate"/></w:r></w:p>'
    + estatico
    + `<w:p><w:pPr>${sp(0, 160)}</w:pPr><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p>`;
};

// --- separador de sección (informes largos) ---------------------------------
export function SEPARADOR(numero, titulo) {
  breakList();
  const salto = '<w:p><w:pPr><w:pageBreakBefore/><w:spacing w:before="0" w:after="0" w:line="20" w:lineRule="exact"/></w:pPr></w:p>';
  return salto + '<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/>'
    + '<w:tblBorders><w:top w:val="none"/><w:bottom w:val="none"/><w:left w:val="none"/><w:right w:val="none"/></w:tblBorders>'
    + '<w:tblCellMar><w:left w:w="0" w:type="dxa"/><w:right w:w="0" w:type="dxa"/></w:tblCellMar>'
    + '<w:tblLayout w:type="fixed"/></w:tblPr>'
    + `<w:tblGrid><w:gridCol w:w="${TW}"/></w:tblGrid>`
    + '<w:tr><w:trPr><w:trHeight w:val="7000"/></w:trPr>'
    + `<w:tc><w:tcPr><w:tcW w:w="${TW}" w:type="dxa"/><w:shd w:val="clear" w:fill="${T.verde}"/>`
    + '<w:tcMar><w:top w:w="900" w:type="dxa"/><w:bottom w:w="900" w:type="dxa"/>'
    + '<w:left w:w="620" w:type="dxa"/><w:right w:w="620" w:type="dxa"/></w:tcMar>'
    + '<w:vAlign w:val="center"/></w:tcPr>'
    + `<w:p><w:pPr>${sp(0, 200)}<w:jc w:val="left"/></w:pPr>`
    + runs(numero, { size: 20, color: T.bandaTexto, bold: true, caps: true, spacing: 80, font: 'Calibri' }) + '</w:p>'
    + `<w:p><w:pPr>${sp(0, 220)}<w:jc w:val="left"/>`
    + `<w:pBdr><w:bottom w:val="single" w:sz="12" w:space="10" w:color="${T.bandaTexto}"/></w:pBdr></w:pPr></w:p>`
    + `<w:p><w:pPr>${sp(0, 0)}<w:jc w:val="left"/><w:outlineLvl w:val="0"/></w:pPr>`
    + runs(titulo, { size: 40, color: T.blanco, bold: true }) + '</w:p>'
    + '</w:tc></w:tr></w:tbl>';
}

// ===========================================================================
// CONTENIDO: el modelo de contenido común a todas las plantillas
//   "texto"                              párrafo
//   { p: "texto" }                       párrafo
//   { h1: "…", rotulo: "…" }             título 1 (con rótulo opcional)
//   { h2: "…" } / { h3: "…" }            títulos 2 y 3
//   { diagnostico: "…" }                 bloque con filete lateral
//   { recomendacion: "…" }               bloque con filete lateral
//   { rotulo: "…", texto: "…" }          bloque con filete lateral, rótulo libre
//   { lista: [...], tipo: "decimal"|"letra"|"romano"|"vineta" }
//        cada ítem: "texto" o { texto, sub: [...] }
//   { tabla: { cabecera: [...], filas: [[...]], anchos: [...] } }
//        celda: "texto", { texto, alinear, bold } o { sem: "rojo"|"ambar"|"verde"|"gris", texto? }
//   { tarjetas: [{ n, label, color }] }
//   { cita: "…" }                        cita textual sangrada
//   { nota: "…" }                        nota en Calibri gris
//   { salto: true }                      salto de página
//   { espacio: 240 }                     espacio vertical en twips
// ===========================================================================
const TIPO_LISTA = { decimal: 'decimal', letra: 'letter', romano: 'roman', vineta: 'bullet' };

export function CONTENIDO(items = []) {
  if (!Array.isArray(items)) items = [items];
  return items.map((it) => {
    if (it == null) return '';
    if (typeof it === 'string') return P(it);
    if (it.p != null) return P(it.p, it.opciones ?? {});
    if (it.h1 != null) return H1(it.h1, it.rotulo, { pageBreak: !!it.salto });
    if (it.h2 != null) return H2(it.h2, { pageBreak: !!it.salto });
    if (it.h3 != null) return H3(it.h3);
    if (it.diagnostico != null) return ROT('Diagnóstico', it.diagnostico);
    if (it.recomendacion != null) return ROT('Recomendación', it.recomendacion);
    if (it.rotulo != null && it.texto != null) return ROT(it.rotulo, it.texto);
    if (it.lista) {
      const kind = TIPO_LISTA[it.tipo] ?? 'bullet';
      const subKind = kind === 'decimal' ? 'letter' : kind === 'letter' ? 'roman' : kind;
      let xml = '';
      breakList();
      for (const el of it.lista) {
        if (typeof el === 'string') { xml += LI(el, 0, kind); continue; }
        xml += LI(el.texto, 0, kind);
        for (const s of el.sub ?? []) xml += LI(typeof s === 'string' ? s : s.texto, 1, kind);
      }
      breakList();
      return xml;
    }
    if (it.tabla) {
      const { cabecera, filas = [], anchos, sinCabecera } = it.tabla;
      const rows = cabecera ? [cabecera, ...filas] : filas;
      return TABLE(rows, { anchos, headerRows: (cabecera && !sinCabecera) ? 1 : 0 });
    }
    if (it.tarjetas) return TARJETAS(it.tarjetas);
    if (it.cita != null) return CITA(it.cita);
    if (it.nota != null) return NOTA(it.nota);
    if (it.salto) return PAGEBREAK;
    if (it.espacio) return ESPACIO(it.espacio);
    if (it.firmas) return FIRMAS(it.firmas, it.opciones ?? {});
    if (it.ficha) return FICHA(it.ficha, it.opciones ?? {});
    if (it.xml) return it.xml;
    throw new Error(`Bloque de contenido no reconocido: ${JSON.stringify(it).slice(0, 80)}`);
  }).join('');
}

// --- fechas -------------------------------------------------------------------
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
export function fechaLarga(v) {
  if (!v) return '';
  const m = String(v).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return String(v);
  return `${parseInt(m[3], 10)} de ${MESES[parseInt(m[2], 10) - 1]} de ${m[1]}`;
}
export function fechaCorta(v) {
  const m = String(v ?? '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : String(v ?? '');
}
export const hoy = () => new Date().toISOString().slice(0, 10);

// ===========================================================================
// Empaquetado
// ===========================================================================
function contentTypes(conPng) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
${conPng ? '<Default Extension="png" ContentType="image/png"/>' : ''}
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
<Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>
<Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
<Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>
<Override PartName="/word/header2.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>
<Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>
<Override PartName="/word/footer2.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>
<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`;
}

const RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;

const docRels = (logoBlanco) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>
<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>
<Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>
<Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header2.xml"/>
<Relationship Id="rId6" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer2.xml"/>
<Relationship Id="rId7" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>
${logoBlanco ? '<Relationship Id="rIdLogoBlanco" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/logo-blanco.png"/>' : ''}
</Relationships>`;

const hdrRels = (logo) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
${logo ? '<Relationship Id="rIdLogo" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/logo.png"/>' : ''}
</Relationships>`;

const settings = (conIndice) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
${conIndice ? '<w:updateFields w:val="true"/>' : ''}
<w:defaultTabStop w:val="708"/>
</w:settings>`;

const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:docDefaults><w:rPrDefault><w:rPr>
<w:rFonts w:ascii="Cambria" w:hAnsi="Cambria" w:eastAsia="Cambria" w:cs="Cambria"/>
<w:color w:val="${T.tinta}"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="es-CL"/>
</w:rPr></w:rPrDefault>
<w:pPrDefault><w:pPr><w:spacing w:after="140" w:line="${LINEA}" w:lineRule="auto"/><w:jc w:val="both"/></w:pPr></w:pPrDefault>
</w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/>
<w:pPr><w:keepNext/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:color w:val="${T.verde}"/><w:sz w:val="32"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/>
<w:pPr><w:keepNext/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/><w:color w:val="${T.verde}"/><w:sz w:val="26"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:basedOn w:val="Normal"/>
<w:pPr><w:keepNext/><w:outlineLvl w:val="2"/></w:pPr><w:rPr><w:b/><w:color w:val="${T.verdeMedio}"/><w:sz w:val="23"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="TOC1"><w:name w:val="toc 1"/><w:basedOn w:val="Normal"/>
<w:pPr><w:tabs><w:tab w:val="right" w:leader="dot" w:pos="${TW}"/></w:tabs>
<w:spacing w:before="90" w:after="20"/><w:jc w:val="left"/></w:pPr>
<w:rPr><w:b/><w:color w:val="${T.verde}"/><w:sz w:val="21"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="TOC2"><w:name w:val="toc 2"/><w:basedOn w:val="Normal"/>
<w:pPr><w:tabs><w:tab w:val="right" w:leader="dot" w:pos="${TW}"/></w:tabs>
<w:spacing w:before="0" w:after="10"/><w:ind w:left="284"/><w:jc w:val="left"/></w:pPr>
<w:rPr><w:color w:val="${T.tinta}"/><w:sz w:val="20"/></w:rPr></w:style>
<w:style w:type="character" w:styleId="Hyperlink"><w:name w:val="Hyperlink"/>
<w:rPr><w:color w:val="${T.verde}"/></w:rPr></w:style>
</w:styles>`;

function numbering() {
  const lvl = (i, fmt, txt, ind) =>
    `<w:lvl w:ilvl="${i}"><w:start w:val="1"/><w:numFmt w:val="${fmt}"/>`
    + `<w:lvlText w:val="${txt}"/><w:lvlJc w:val="left"/>`
    + `<w:pPr><w:ind w:left="${ind}" w:hanging="340"/></w:pPr>`
    + `<w:rPr><w:rFonts w:ascii="Cambria" w:hAnsi="Cambria"/><w:color w:val="${T.verde}"/></w:rPr></w:lvl>`;
  const A = (id, ...lv) => `<w:abstractNum w:abstractNumId="${id}"><w:multiLevelType w:val="hybridMultilevel"/>${lv.join('')}</w:abstractNum>`;
  const abstracts =
    A(0, lvl(0, 'bullet', '▪', 397), lvl(1, 'bullet', '–', 851), lvl(2, 'bullet', '•', 1304))
    + A(1, lvl(0, 'lowerRoman', '(%1)', 567), lvl(1, 'lowerLetter', '%2)', 1021))
    + A(2, lvl(0, 'lowerLetter', '(%1)', 567), lvl(1, 'lowerRoman', '(%2)', 1021))
    + A(3, lvl(0, 'decimal', '%1.', 567), lvl(1, 'lowerLetter', '(%2)', 1021));
  const nums = numRegistry.map((a, i) => {
    const ov = [0, 1].map(l => `<w:lvlOverride w:ilvl="${l}"><w:startOverride w:val="1"/></w:lvlOverride>`).join('');
    return `<w:num w:numId="${i + 1}"><w:abstractNumId w:val="${a}"/>${ov}</w:num>`;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
${abstracts}
${nums}
</w:numbering>`;
}

const HDR_VACIO = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:p><w:pPr><w:spacing w:after="0"/></w:pPr></w:p></w:hdr>`;
const FTR_VACIO = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:p><w:pPr><w:spacing w:after="0"/></w:pPr></w:p></w:ftr>`;

function header(rotulo, conLogo) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:p><w:pPr><w:tabs><w:tab w:val="right" w:pos="${TW}"/></w:tabs>
<w:spacing w:after="40"/><w:jc w:val="left"/>
<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="6" w:color="${T.verde}"/></w:pBdr></w:pPr>
${conLogo ? img('rIdLogo', 116, 17, 'Logotipo') : ''}
<w:r><w:tab/></w:r>
${runs(rotulo ?? '', { size: 15, color: T.tintaSec, font: 'Calibri', caps: true, spacing: 12 })}
</w:p></w:hdr>`;
}

function footer(izq) {
  const rPr = `<w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:color w:val="${T.tintaSec}"/><w:sz w:val="16"/></w:rPr>`;
  const campo = (instr) => `<w:r>${rPr}<w:fldChar w:fldCharType="begin"/></w:r>`
    + `<w:r>${rPr}<w:instrText xml:space="preserve"> ${instr} </w:instrText></w:r>`
    + `<w:r>${rPr}<w:fldChar w:fldCharType="separate"/></w:r><w:r>${rPr}<w:t>1</w:t></w:r>`
    + `<w:r>${rPr}<w:fldChar w:fldCharType="end"/></w:r>`;
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:p><w:pPr><w:tabs><w:tab w:val="right" w:pos="${TW}"/></w:tabs>
<w:spacing w:before="60" w:after="0"/><w:jc w:val="left"/>
<w:pBdr><w:top w:val="single" w:sz="4" w:space="6" w:color="${T.filete}"/></w:pBdr></w:pPr>
${runs(izq ?? '', { size: 16, color: T.tintaSec, font: 'Calibri' })}<w:r><w:tab/></w:r>
${runs('Página ', { size: 16, color: T.tintaSec, font: 'Calibri' })}${campo('PAGE')}${runs(' de ', { size: 16, color: T.tintaSec, font: 'Calibri' })}${campo('NUMPAGES')}
</w:p></w:ftr>`;
}

const core = (titulo, autor) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<dc:title>${esc(titulo ?? '')}</dc:title><dc:creator>${esc(autor ?? '')}</dc:creator><dc:language>es-CL</dc:language>
<dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:created>
</cp:coreProperties>`;
const APP = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>sistemas-de-diseno · Garrigues documentos v3</Application></Properties>`;

// Busca el PNG en este orden: ruta explícita, variable de entorno, plantillas/activos/.
// fileURLToPath y no URL.pathname: así funciona en Windows y con carpetas con espacios o tildes.
function resolverLogo(explicito, nombre) {
  const candidatos = [explicito, process.env[`GARRIGUES_${nombre.toUpperCase().replace('-', '_')}`],
    path.join(path.dirname(fileURLToPath(import.meta.url)), 'activos', `${nombre}.png`)].filter(Boolean);
  for (const c of candidatos) if (fs.existsSync(c)) return c;
  return null;
}

/**
 * Empaqueta el cuerpo XML en un .docx.
 * @param {function|string} cuerpo  XML del cuerpo, o función () => XML (se llama después de resolver los logotipos).
 * @param {object} o  { salida, encabezado, pie, titulo, autor, logo, logoBlanco, primeraPaginaLimpia }
 */
export async function empaquetar(cuerpo, o = {}) {
  const logo = resolverLogo(o.logo, 'logo');
  const logoBlanco = resolverLogo(o.logoBlanco, 'logo-blanco');
  estado.logo = !!logo; estado.logoBlanco = !!logoBlanco;
  numRegistry.length = 0; breakList();

  const bodyXml = typeof cuerpo === 'function' ? cuerpo() : cuerpo;
  const conIndice = bodyXml.includes('TOC \\o');

  const sect = '<w:sectPr>'
    + '<w:headerReference w:type="first" r:id="rId5"/>'
    + '<w:footerReference w:type="first" r:id="rId6"/>'
    + '<w:headerReference w:type="default" r:id="rId3"/>'
    + '<w:footerReference w:type="default" r:id="rId4"/>'
    + '<w:pgSz w:w="12240" w:h="15840"/>'
    + '<w:pgMar w:top="1418" w:right="1418" w:bottom="1418" w:left="1418" w:header="680" w:footer="620" w:gutter="0"/>'
    + (o.primeraPaginaLimpia ? '<w:titlePg/>' : '')
    + '</w:sectPr>';

  const doc = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<w:body>${bodyXml}${sect}</w:body></w:document>`;

  const zip = new JSZip();
  zip.file('[Content_Types].xml', contentTypes(!!(logo || logoBlanco)));
  zip.folder('_rels').file('.rels', RELS);
  zip.folder('docProps').file('core.xml', core(o.titulo, o.autor));
  zip.folder('docProps').file('app.xml', APP);
  const w = zip.folder('word');
  w.file('document.xml', doc);
  w.file('styles.xml', STYLES);
  w.file('settings.xml', settings(conIndice));
  w.file('numbering.xml', numbering());
  w.file('header1.xml', header(o.encabezado, !!logo));
  w.file('footer1.xml', footer(o.pie));
  w.file('header2.xml', HDR_VACIO);
  w.file('footer2.xml', FTR_VACIO);
  w.folder('_rels').file('document.xml.rels', docRels(!!logoBlanco));
  w.folder('_rels').file('header1.xml.rels', hdrRels(!!logo));
  if (logo) w.folder('media').file('logo.png', fs.readFileSync(logo));
  if (logoBlanco) w.folder('media').file('logo-blanco.png', fs.readFileSync(logoBlanco));

  const buf = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  if (o.salida) {
    fs.mkdirSync(path.dirname(o.salida), { recursive: true });
    fs.writeFileSync(o.salida, buf);
  }
  return buf;
}
