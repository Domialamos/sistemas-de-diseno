import fs from 'fs';
import JSZip from 'jszip';

// ===========================================================================
// Subsistema Garrigues — documentos v2
// Tipografía y espaciado heredados de la v1 (Cambria, interlineado 1.15).
// El salto está en la jerarquía visual: portada y separadores en verde pleno,
// encabezados con rótulo superior, bloques de diagnóstico con filete lateral,
// tablas sin líneas verticales, con cabecera invertida y cebra.
// ===========================================================================
export const T = {
  verde: '004136',
  verdeMedio: '2E6B5E',
  verdeClaro: 'EDF2F0',
  cebra: 'F7FAF9',
  tinta: '1A1A1A',
  tintaSec: '5A5A5A',
  filete: 'C9D4D1',
  blanco: 'FFFFFF',
  rojo: 'B3261E',
  ambar: 'C98A1B',
  verdeOk: '2E7D32',
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const TW = 9404;   // ancho útil en twips (carta menos márgenes de 2,5 cm)

// --- runs -------------------------------------------------------------------
function runs(text, base = {}) {
  const {
    size = 22, color = T.tinta, font = 'Cambria',
    bold = false, italic = false, caps = false, spacing = 0,
  } = base;
  const parts = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ t: text.slice(last, m.index), b: bold, i: italic });
    const tok = m[0];
    if (tok.startsWith('**')) parts.push({ t: tok.slice(2, -2), b: true, i: italic });
    else parts.push({ t: tok.slice(1, -1), b: bold, i: true });
    last = m.index + tok.length;
  }
  if (last < text.length) parts.push({ t: text.slice(last), b: bold, i: italic });
  if (!parts.length) parts.push({ t: '', b: bold, i: italic });

  return parts.map(p => {
    const rPr = `<w:rPr><w:rFonts w:ascii="${font}" w:hAnsi="${font}"/>`
      + (p.b ? '<w:b/>' : '') + (p.i ? '<w:i/>' : '')
      + (caps ? '<w:caps/>' : '')
      + (spacing ? `<w:spacing w:val="${spacing}"/>` : '')
      + `<w:color w:val="${color}"/><w:sz w:val="${size}"/></w:rPr>`;
    const inner = p.t.split('\t').map(s => `<w:t xml:space="preserve">${esc(s)}</w:t>`).join('<w:tab/>');
    return `<w:r>${rPr}${inner}</w:r>`;
  }).join('');
}

const sp = (before, after, line = 264) =>
  `<w:spacing w:before="${before}" w:after="${after}" w:line="${line}" w:lineRule="auto"/>`;

// --- registro de numeraciones ----------------------------------------------
const numRegistry = [];
let lastKind = null, lastNumId = null;
const allocNum = (a) => (numRegistry.push(a), numRegistry.length);
const breakList = () => { lastKind = null; lastNumId = null; };
const ABSTRACT = { bullet: 0, roman: 1, letter: 2, decimal: 3 };

// --- bloques ----------------------------------------------------------------
export const P = (text, o = {}) => {
  breakList();
  const {
    align = 'both', before = 0, after = 140, indent = 0, right = 0,
    size, color, bold, italic, font, line, caps, spacing: sPace,
    tabRight, shade, barra, keepNext,
  } = o;
  const tabs = tabRight ? `<w:tabs><w:tab w:val="right" w:leader="dot" w:pos="${tabRight}"/></w:tabs>` : '';
  // barra: filete verde a la izquierda, para bloques de diagnóstico
  const bdr = barra
    ? `<w:pBdr><w:left w:val="single" w:sz="18" w:space="10" w:color="${T.verde}"/></w:pBdr>` : '';
  const shd = shade ? `<w:shd w:val="clear" w:fill="${shade}"/>` : '';
  return `<w:p><w:pPr>${sp(before, after, line ?? 264)}${tabs}`
    + `<w:jc w:val="${align}"/>${bdr}${shd}`
    + (keepNext ? '<w:keepNext/>' : '')
    + ((indent || right) ? `<w:ind w:left="${indent}" w:right="${right}"/>` : '')
    + `</w:pPr>${runs(text, { size, color, bold, italic, font, caps, spacing: sPace })}</w:p>`;
};

// Rótulo superior en versalitas espaciadas + título con doble filete
export const H1 = (text, overline, o = {}) => {
  breakList();
  const pb = o.pageBreak ? '<w:pageBreakBefore/>' : '';
  const over = overline
    ? `<w:p><w:pPr>${pb}${sp(400, 40)}<w:jc w:val="left"/><w:keepNext/></w:pPr>`
      + runs(overline, { size: 16, color: T.verdeMedio, bold: true, caps: true, spacing: 40 })
      + '</w:p>'
    : '';
  return over
    + `<w:p><w:pPr><w:pStyle w:val="Heading1"/>${overline ? '' : pb}${sp(overline ? 0 : 400, 60)}<w:jc w:val="left"/><w:keepNext/>`
    + `<w:pBdr><w:bottom w:val="single" w:sz="18" w:space="6" w:color="${T.verde}"/></w:pBdr>`
    + `</w:pPr>${runs(text, { size: 32, color: T.verde, bold: true })}</w:p>`
    // filete fino inmediatamente bajo el grueso
    + `<w:p><w:pPr><w:spacing w:before="0" w:after="170" w:line="40" w:lineRule="exact"/><w:pBdr><w:bottom w:val="single" w:sz="4" w:space="1" w:color="${T.filete}"/></w:pBdr></w:pPr></w:p>`;
};

export const H2 = (text) => {
  breakList();
  return `<w:p><w:pPr><w:pStyle w:val="Heading2"/>${sp(320, 120)}<w:jc w:val="left"/><w:keepNext/>`
    + `<w:pBdr><w:top w:val="single" w:sz="4" w:space="8" w:color="${T.filete}"/></w:pBdr>`
    + `</w:pPr>${runs(text, { size: 26, color: T.verde, bold: true })}</w:p>`;
};

export const H3 = (text) => {
  breakList();
  return `<w:p><w:pPr>${sp(260, 100)}<w:jc w:val="left"/><w:keepNext/></w:pPr>`
    + `${runs(text, { size: 23, color: T.verdeMedio, bold: true })}</w:p>`;
};

// Diagnóstico / Recomendación: rótulo en versalitas + párrafo con filete lateral
export const ROT = (rotulo, resto) => {
  breakList();
  return `<w:p><w:pPr>${sp(240, 30)}<w:jc w:val="left"/><w:keepNext/>`
    + `<w:ind w:left="170"/></w:pPr>`
    + runs(rotulo, { size: 17, color: T.verde, bold: true, caps: true, spacing: 40 })
    + '</w:p>'
    + P(resto, { barra: true, indent: 170, before: 0, after: 160 });
};

export const LI = (text, lvl = 0, kind = 'bullet') => {
  if (lastKind !== kind) { lastNumId = allocNum(ABSTRACT[kind] ?? 0); lastKind = kind; }
  return `<w:p><w:pPr>${sp(0, 110)}<w:jc w:val="both"/>`
    + `<w:numPr><w:ilvl w:val="${lvl}"/><w:numId w:val="${lastNumId}"/></w:numPr>`
    + `</w:pPr>${runs(text)}</w:p>`;
};

export const PAGEBREAK = '<w:p><w:pPr><w:spacing w:after="0"/></w:pPr><w:r><w:br w:type="page"/></w:r></w:p>';

// --- semáforo ---------------------------------------------------------------
const SEM = {
  rojo: [T.rojo, 'No cumple'],
  ambar: [T.ambar, 'Insuficiente'],
  verde: [T.verdeOk, 'Suficiente'],
};

// --- tablas -----------------------------------------------------------------
// Sin líneas verticales; cabecera en verde con texto blanco; cebra en las filas.
export function TABLE(rows, opts = {}) {
  breakList();
  const { widths, headerRows = 1, zebra = true, fontSize = 18 } = opts;
  const borders = '<w:tblBorders>'
    + `<w:top w:val="single" w:sz="4" w:space="0" w:color="${T.verde}"/>`
    + `<w:bottom w:val="single" w:sz="8" w:space="0" w:color="${T.verde}"/>`
    + `<w:insideH w:val="single" w:sz="2" w:space="0" w:color="${T.filete}"/>`
    + '<w:left w:val="none" w:sz="0" w:space="0" w:color="auto"/>'
    + '<w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>'
    + '<w:insideV w:val="none" w:sz="0" w:space="0" w:color="auto"/>'
    + '</w:tblBorders>';
  const grid = widths ? `<w:tblGrid>${widths.map(w => `<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid>` : '';

  const body = rows.map((r, ri) => {
    const isHead = ri < headerRows;
    const fill = isHead ? T.verde : (zebra && (ri - headerRows) % 2 === 1 ? T.cebra : null);
    const cells = r.map((c, ci) => {
      const w = widths ? `<w:tcW w:w="${widths[ci]}" w:type="dxa"/>` : '';
      const shd = fill ? `<w:shd w:val="clear" w:fill="${fill}"/>` : '';
      let content;
      if (c && typeof c === 'object' && c.sem) {
        const [col, palabra] = SEM[c.sem] || [T.tintaSec, '—'];
        content = `<w:p><w:pPr>${sp(50, 50, 240)}<w:jc w:val="left"/></w:pPr>`
          + runs('● ', { size: 21, color: col, font: 'Calibri' })
          + runs(palabra, { size: fontSize, color: T.tinta, font: 'Calibri' })
          + '</w:p>';
      } else {
        const txt = String(c ?? '');
        content = txt.split('\n').map(line =>
          `<w:p><w:pPr>${sp(50, 50, 240)}<w:jc w:val="left"/></w:pPr>`
          + runs(line, {
            size: fontSize, font: 'Calibri',
            color: isHead ? T.blanco : T.tinta,
            bold: isHead,
          }) + '</w:p>').join('');
      }
      return `<w:tc><w:tcPr>${w}${shd}<w:vAlign w:val="center"/>`
        + '<w:tcMar><w:top w:w="90" w:type="dxa"/><w:bottom w:w="90" w:type="dxa"/>'
        + '<w:left w:w="130" w:type="dxa"/><w:right w:w="130" w:type="dxa"/></w:tcMar>'
        + `</w:tcPr>${content}</w:tc>`;
    }).join('');
    return `<w:tr>${isHead ? '<w:trPr><w:tblHeader/></w:trPr>' : ''}${cells}</w:tr>`;
  }).join('');

  return `<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/>${borders}`
    + '<w:tblLayout w:type="fixed"/></w:tblPr>' + grid + body + '</w:tbl>'
    + `<w:p><w:pPr>${sp(0, 200)}</w:pPr></w:p>`;
}

// Bloque de conteo del resumen ejecutivo: tres cifras grandes
export function TARJETAS(items) {
  breakList();
  const w = Math.floor(TW / items.length);
  const cell = (it) =>
    `<w:tc><w:tcPr><w:tcW w:w="${w}" w:type="dxa"/>`
    + `<w:shd w:val="clear" w:fill="${T.verdeClaro}"/>`
    + `<w:tcBorders><w:top w:val="single" w:sz="24" w:space="0" w:color="${it.color}"/></w:tcBorders>`
    + '<w:tcMar><w:top w:w="140" w:type="dxa"/><w:bottom w:w="140" w:type="dxa"/>'
    + '<w:left w:w="140" w:type="dxa"/><w:right w:w="140" w:type="dxa"/></w:tcMar></w:tcPr>'
    + `<w:p><w:pPr>${sp(0, 20, 240)}<w:jc w:val="center"/></w:pPr>`
    + runs(String(it.n), { size: 48, color: it.color, bold: true }) + '</w:p>'
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
const img = (relId, wpx, hpx, name) => {
  const cx = Math.round(wpx * 9525), cy = Math.round(hpx * 9525);
  return `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"
xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing">
<wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${Math.floor(Math.random() * 90000) + 100}" name="${name}"/>
<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
<a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
<pic:nvPicPr><pic:cNvPr id="0" name="${name}"/><pic:cNvPicPr/></pic:nvPicPr>
<pic:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="${relId}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>
<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm>
<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>
</pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
};

// --- portada ----------------------------------------------------------------
// Banda verde a sangre con el logotipo en blanco y el título invertido.
export function PORTADA({ titulo, subtitulo, cliente, fecha, pie }) {
  breakList();
  const linea = (txt, o) => `<w:p><w:pPr>${sp(o.before || 0, o.after || 0, o.line || 260)}<w:jc w:val="left"/></w:pPr>`
    + runs(txt, o) + '</w:p>';

  const banda = '<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/>'
    + '<w:tblBorders><w:top w:val="none"/><w:bottom w:val="none"/><w:left w:val="none"/><w:right w:val="none"/></w:tblBorders>'
    + `<w:tblCellMar><w:left w:w="0" w:type="dxa"/><w:right w:w="0" w:type="dxa"/></w:tblCellMar>`
    + '<w:tblLayout w:type="fixed"/></w:tblPr>'
    + `<w:tblGrid><w:gridCol w:w="${TW}"/></w:tblGrid>`
    + `<w:tr><w:trPr><w:trHeight w:val="4200"/></w:trPr>`
    + `<w:tc><w:tcPr><w:tcW w:w="${TW}" w:type="dxa"/><w:shd w:val="clear" w:fill="${T.verde}"/>`
    + '<w:tcMar><w:top w:w="700" w:type="dxa"/><w:bottom w:w="500" w:type="dxa"/>'
    + '<w:left w:w="560" w:type="dxa"/><w:right w:w="560" w:type="dxa"/></w:tcMar>'
    + '<w:vAlign w:val="bottom"/></w:tcPr>'
    + `<w:p><w:pPr>${sp(0, 700)}</w:pPr>${img('rIdLogoBlanco', 168, 25, 'Garrigues')}</w:p>`
    + linea(titulo, { size: 52, color: T.blanco, bold: true, after: 140, line: 240 })
    + linea(subtitulo, { size: 22, color: 'BFD4CE', after: 0, line: 300 })
    + '</w:tc></w:tr></w:tbl>';

  return banda
    + `<w:p><w:pPr>${sp(600, 100)}</w:pPr></w:p>`
    + linea('Preparado para', { size: 17, color: T.verdeMedio, bold: true, caps: true, spacing: 40, after: 80 })
    + linea(cliente, { size: 26, color: T.tinta, bold: true, after: 240 })
    + linea('Fecha', { size: 17, color: T.verdeMedio, bold: true, caps: true, spacing: 40, after: 80 })
    + linea(fecha, { size: 22, color: T.tinta, after: 900 })
    + `<w:p><w:pPr>${sp(0, 60)}<w:pBdr><w:top w:val="single" w:sz="8" w:space="8" w:color="${T.verde}"/></w:pBdr></w:pPr></w:p>`
    + linea(pie, { size: 17, color: T.tintaSec, font: 'Calibri', after: 0 })
    + PAGEBREAK;
}

// --- separador de sección ---------------------------------------------------
export function SEPARADOR(numero, titulo) {
  breakList();
  // Párrafo de altura mínima que fuerza el salto: si se usara un párrafo de
  // salto normal, quedaría una página en blanco entre el separador y el texto.
  const salto = '<w:p><w:pPr><w:pageBreakBefore/>'
    + '<w:spacing w:before="0" w:after="0" w:line="20" w:lineRule="exact"/></w:pPr></w:p>';
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
    + runs(numero, { size: 20, color: 'BFD4CE', bold: true, caps: true, spacing: 80 }) + '</w:p>'
    + `<w:p><w:pPr>${sp(0, 220)}<w:jc w:val="left"/>`
    + `<w:pBdr><w:bottom w:val="single" w:sz="12" w:space="10" w:color="BFD4CE"/></w:pBdr></w:pPr></w:p>`
    + `<w:p><w:pPr>${sp(0, 0)}<w:jc w:val="left"/><w:outlineLvl w:val="0"/></w:pPr>`
    + runs(titulo, { size: 40, color: T.blanco, bold: true }) + '</w:p>'
    + '</w:tc></w:tr></w:tbl>';
}

// --- índice automático ------------------------------------------------------
export const TOC = () =>
  `<w:p><w:pPr>${sp(0, 160)}</w:pPr>`
  + '<w:r><w:fldChar w:fldCharType="begin" w:dirty="true"/></w:r>'
  + '<w:r><w:instrText xml:space="preserve"> TOC \\o "1-2" \\h \\z \\u </w:instrText></w:r>'
  + '<w:r><w:fldChar w:fldCharType="separate"/></w:r>'
  + runs('Actualice el índice con F9 para ver la paginación.', { size: 20, color: T.tintaSec, italic: true })
  + '<w:r><w:fldChar w:fldCharType="end"/></w:r></w:p>';

// ===========================================================================
// Empaquetado
// ===========================================================================
const CT = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Default Extension="png" ContentType="image/png"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
<Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>
<Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
<Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>
<Override PartName="/word/header2.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>
<Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>
<Override PartName="/word/footer2.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>
</Types>`;

const RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

const DOC_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>
<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>
<Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>
<Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header2.xml"/>
<Relationship Id="rId6" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer2.xml"/>
<Relationship Id="rId7" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>
<Relationship Id="rIdLogoBlanco" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/logo-blanco.png"/>
</Relationships>`;

const HDR_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rIdLogo" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/logo.png"/>
</Relationships>`;

const SETTINGS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:updateFields w:val="true"/>
<w:defaultTabStop w:val="708"/>
</w:settings>`;

const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:docDefaults><w:rPrDefault><w:rPr>
<w:rFonts w:ascii="Cambria" w:hAnsi="Cambria" w:eastAsia="Cambria" w:cs="Cambria"/>
<w:color w:val="${T.tinta}"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="es-CL"/>
</w:rPr></w:rPrDefault>
<w:pPrDefault><w:pPr><w:spacing w:after="140" w:line="264" w:lineRule="auto"/><w:jc w:val="both"/></w:pPr></w:pPrDefault>
</w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/>
<w:pPr><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:color w:val="${T.verde}"/><w:sz w:val="32"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/>
<w:pPr><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/><w:color w:val="${T.verde}"/><w:sz w:val="26"/></w:rPr></w:style>
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
  const A = (id, ...lv) => `<w:abstractNum w:abstractNumId="${id}">${lv.join('')}</w:abstractNum>`;
  const abstracts =
    A(0, lvl(0, 'bullet', '▪', 397), lvl(1, 'bullet', '–', 851), lvl(2, 'bullet', '•', 1304))
    + A(1, lvl(0, 'lowerRoman', '(%1)', 567), lvl(1, 'lowerLetter', '%2)', 1021))
    + A(2, lvl(0, 'lowerLetter', '%1)', 567), lvl(1, 'lowerRoman', '(%2)', 1021))
    + A(3, lvl(0, 'decimal', '%1.', 567), lvl(1, 'lowerLetter', '%2)', 1021));
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

function header(rotulo) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:p><w:pPr><w:tabs><w:tab w:val="right" w:pos="${TW}"/></w:tabs>
<w:spacing w:after="40"/><w:jc w:val="left"/>
<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="6" w:color="${T.verde}"/></w:pBdr></w:pPr>
${img('rIdLogo', 116, 17, 'Garrigues')}
<w:r><w:tab/></w:r>
${runs(rotulo, { size: 15, color: T.tintaSec, font: 'Calibri', caps: true, spacing: 12 })}
</w:p></w:hdr>`;
}

function footer(izq) {
  const r = (t, o) => runs(t, { size: 16, color: T.tintaSec, font: 'Calibri', ...o });
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:p><w:pPr><w:tabs><w:tab w:val="right" w:pos="${TW}"/></w:tabs>
<w:spacing w:before="60" w:after="0"/><w:jc w:val="left"/>
<w:pBdr><w:top w:val="single" w:sz="4" w:space="6" w:color="${T.filete}"/></w:pBdr></w:pPr>
${r(izq)}<w:r><w:tab/></w:r>
<w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:b/><w:color w:val="${T.verde}"/><w:sz w:val="18"/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r>
<w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:b/><w:color w:val="${T.verde}"/><w:sz w:val="18"/></w:rPr><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r>
<w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:b/><w:color w:val="${T.verde}"/><w:sz w:val="18"/></w:rPr><w:fldChar w:fldCharType="end"/></w:r>
</w:p></w:ftr>`;
}

export async function build(bodyXml, outPath, opts = {}) {
  const { logo, logoBlanco, rotuloEncabezado, piePagina } = opts;
  const sect = '<w:sectPr>'
    + '<w:headerReference w:type="first" r:id="rId5" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/>'
    + '<w:footerReference w:type="first" r:id="rId6" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/>'
    + '<w:headerReference w:type="default" r:id="rId3" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/>'
    + '<w:footerReference w:type="default" r:id="rId4" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/>'
    + '<w:pgSz w:w="12240" w:h="15840"/>'
    + '<w:pgMar w:top="1418" w:right="1418" w:bottom="1418" w:left="1418" w:header="680" w:footer="620" w:gutter="0"/>'
    + '<w:titlePg/>'
    + '</w:sectPr>';

  const doc = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<w:body>${bodyXml}${sect}</w:body></w:document>`;

  const zip = new JSZip();
  zip.file('[Content_Types].xml', CT);
  zip.folder('_rels').file('.rels', RELS);
  const w = zip.folder('word');
  w.file('document.xml', doc);
  w.file('styles.xml', STYLES);
  w.file('settings.xml', SETTINGS);
  w.file('numbering.xml', numbering());
  w.file('header1.xml', header(rotuloEncabezado));
  w.file('footer1.xml', footer(piePagina));
  w.file('header2.xml', HDR_VACIO);
  w.file('footer2.xml', FTR_VACIO);
  w.folder('_rels').file('document.xml.rels', DOC_RELS);
  w.folder('_rels').file('header1.xml.rels', HDR_RELS);
  w.folder('media').file('logo.png', fs.readFileSync(logo));
  w.folder('media').file('logo-blanco.png', fs.readFileSync(logoBlanco));

  const buf = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(outPath, buf);
  return buf.length;
}
