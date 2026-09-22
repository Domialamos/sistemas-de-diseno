import fs from 'fs';
import JSZip from 'jszip';

// ---------------------------------------------------------------------------
// Subsistema Garrigues — documentos
// Marca extraida del logotipo institucional real (color plano unico #004136)
// ---------------------------------------------------------------------------
export const T = {
  verde: '004136',
  verdeMedio: '2E6B5E',
  verdeClaro: 'E8EFED',
  tinta: '1A1A1A',
  tintaSec: '5A5A5A',
  filete: 'C9D4D1',
  rojo: 'B3261E',
  ambar: 'C98A1B',
  verdeOk: '2E7D32',
};

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// --- runs -------------------------------------------------------------------
// Sintaxis ligera dentro del texto: **negrita**, *cursiva*
function runs(text, base = {}) {
  const { size = 22, color = T.tinta, font = 'Cambria', bold = false, italic = false } = base;
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
      + `<w:color w:val="${color}"/><w:sz w:val="${size}"/></w:rPr>`;
    // Un tabulador real es <w:tab/>, no el caracter dentro de <w:t>
    const inner = p.t.split('\t')
      .map(s => `<w:t xml:space="preserve">${esc(s)}</w:t>`)
      .join('<w:tab/>');
    return `<w:r>${rPr}${inner}</w:r>`;
  }).join('');
}

const spacing = (before, after, line = 264) =>
  `<w:spacing w:before="${before}" w:after="${after}" w:line="${line}" w:lineRule="auto"/>`;

// --- registro de numeraciones ----------------------------------------------
// Cada lista consecutiva del mismo tipo comparte un numId; cualquier bloque que
// no sea lista corta la serie, de modo que la siguiente lista reinicie en (i)/a)/1.
const numRegistry = [];              // indice -> abstractNumId
let lastKind = null, lastNumId = null;

function allocNum(abstractId) {
  numRegistry.push(abstractId);
  return numRegistry.length;         // numId 1-based
}
function breakList() { lastKind = null; lastNumId = null; }
function numFor(kind, abstractId) {
  if (lastKind !== kind) { lastNumId = allocNum(abstractId); lastKind = kind; }
  return lastNumId;
}

// --- bloques ----------------------------------------------------------------
export const P = (text, o = {}) => {
  breakList();
  const { align = 'both', before = 0, after = 140, indent = 0, size, color, bold, italic, font, line, tabRight } = o;
  // tabRight: posicion (en twips) de un tabulador derecho con guia de puntos,
  // para los indices; el texto se separa con \t.
  const tabs = tabRight
    ? `<w:tabs><w:tab w:val="right" w:leader="dot" w:pos="${tabRight}"/></w:tabs>` : '';
  return `<w:p><w:pPr>${spacing(before, after, line ?? 264)}${tabs}`
    + `<w:jc w:val="${align}"/>`
    + (indent ? `<w:ind w:left="${indent}" w:right="0"/>` : '')
    + `</w:pPr>${runs(text, { size, color, bold, italic, font })}</w:p>`;
};

export const H1 = (text) =>
  (breakList(),
  `<w:p><w:pPr><w:pStyle w:val="Heading1"/>${spacing(360, 180)}<w:jc w:val="left"/>`
  + `<w:pBdr><w:bottom w:val="single" w:sz="8" w:space="4" w:color="${T.verde}"/></w:pBdr>`
  + `</w:pPr>${runs(text, { size: 28, color: T.verde, bold: true })}</w:p>`);

export const H2 = (text) =>
  (breakList(),
  `<w:p><w:pPr><w:pStyle w:val="Heading2"/>${spacing(280, 140)}<w:jc w:val="left"/></w:pPr>`
  + `${runs(text, { size: 24, color: T.verde, bold: true })}</w:p>`);

export const H3 = (text) =>
  (breakList(),
  `<w:p><w:pPr>${spacing(220, 120)}<w:jc w:val="left"/></w:pPr>`
  + `${runs(text, { size: 22, color: T.verdeMedio, bold: true })}</w:p>`);

// Rotulo de parrafo: "Diagnostico." / "Recomendacion." en negrita verde seguido de texto
export const Rot = (rotulo, text) =>
  (breakList(),
  `<w:p><w:pPr>${spacing(160, 140)}<w:jc w:val="both"/></w:pPr>`
  + runs(rotulo + ' ', { bold: true, color: T.verde })
  + runs(text) + '</w:p>');

// kind: 'bullet' | 'roman' | 'letter' | 'decimal'
const ABSTRACT = { bullet: 0, roman: 1, letter: 2, decimal: 3 };
export const LI = (text, lvl = 0, kind = 'bullet') => {
  const id = numFor(kind, ABSTRACT[kind] ?? 0);
  return `<w:p><w:pPr>${spacing(0, 100)}<w:jc w:val="both"/>`
    + `<w:numPr><w:ilvl w:val="${lvl}"/><w:numId w:val="${id}"/></w:numPr>`
    + `</w:pPr>${runs(text)}</w:p>`;
};

// Siempre va seguido de un titulo o parrafo, que son los que cortan la serie.
export const PAGEBREAK = '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';

const cellP = (text, o = {}) => {
  const { bold = false, color = T.tinta, size = 18, align = 'left' } = o;
  return `<w:p><w:pPr>${spacing(40, 40, 240)}<w:jc w:val="${align}"/></w:pPr>`
    + runs(text, { size, color, bold, font: 'Calibri' }) + '</w:p>';
};

// celda con circulo de semaforo + palabra (el color nunca es el unico portador)
const cellSem = (estado) => {
  const map = {
    rojo: [T.rojo, 'No cumple'],
    ambar: [T.ambar, 'Insuficiente'],
    verde: [T.verdeOk, 'Suficiente'],
  };
  const [c, palabra] = map[estado] || [T.tintaSec, '—'];
  return `<w:p><w:pPr>${spacing(40, 40, 240)}<w:jc w:val="left"/></w:pPr>`
    + runs('● ', { size: 22, color: c, font: 'Calibri' })
    + runs(palabra, { size: 18, color: T.tinta, font: 'Calibri' }) + '</w:p>';
};

export function TABLE(rows, opts = {}) {
  breakList();
  const { widths, headerRows = 1 } = opts;
  const bd = (w = 4) => `<w:sz w:val="${w}"/>`;
  const borders = `<w:tblBorders>`
    + ['top', 'left', 'bottom', 'right', 'insideH', 'insideV']
      .map(s => `<w:${s} w:val="single" w:sz="4" w:space="0" w:color="${T.filete}"/>`).join('')
    + `</w:tblBorders>`;

  const grid = widths
    ? `<w:tblGrid>${widths.map(w => `<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid>`
    : '';

  const body = rows.map((r, ri) => {
    const isHead = ri < headerRows;
    const cells = r.map((c, ci) => {
      const isSem = typeof c === 'object' && c && c.sem;
      const shade = isHead ? `<w:shd w:val="clear" w:fill="${T.verdeClaro}"/>` : '';
      const wpx = widths ? `<w:tcW w:w="${widths[ci]}" w:type="dxa"/>` : '';
      const content = isSem
        ? cellSem(c.sem)
        : cellP(String(c ?? ''), { bold: isHead, color: isHead ? T.verde : T.tinta });
      return `<w:tc><w:tcPr>${wpx}${shade}<w:vAlign w:val="center"/>`
        + `<w:tcMar><w:top w:w="60" w:type="dxa"/><w:bottom w:w="60" w:type="dxa"/>`
        + `<w:left w:w="90" w:type="dxa"/><w:right w:w="90" w:type="dxa"/></w:tcMar>`
        + `</w:tcPr>${content}</w:tc>`;
    }).join('');
    const hdr = isHead ? '<w:trPr><w:tblHeader/></w:trPr>' : '';
    return `<w:tr>${hdr}${cells}</w:tr>`;
  }).join('');

  return `<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/>${borders}`
    + `<w:tblLayout w:type="fixed"/></w:tblPr>${grid}${body}</w:tbl>`
    + `<w:p><w:pPr>${spacing(0, 120)}</w:pPr></w:p>`;
}

// --- ensamblado -------------------------------------------------------------
const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Default Extension="png" ContentType="image/png"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
<Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>
<Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>
<Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>
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
</Relationships>`;

const HDR_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rIdLogo" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/logo.png"/>
</Relationships>`;

const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:docDefaults><w:rPrDefault><w:rPr>
<w:rFonts w:ascii="Cambria" w:hAnsi="Cambria" w:eastAsia="Cambria" w:cs="Cambria"/>
<w:color w:val="${T.tinta}"/><w:sz w:val="22"/><w:szCs w:val="22"/>
<w:lang w:val="es-CL"/></w:rPr></w:rPrDefault>
<w:pPrDefault><w:pPr><w:spacing w:after="140" w:line="264" w:lineRule="auto"/><w:jc w:val="both"/></w:pPr></w:pPrDefault>
</w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/>
<w:pPr><w:outlineLvl w:val="0"/></w:pPr>
<w:rPr><w:b/><w:color w:val="${T.verde}"/><w:sz w:val="28"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/>
<w:pPr><w:outlineLvl w:val="1"/></w:pPr>
<w:rPr><w:b/><w:color w:val="${T.verde}"/><w:sz w:val="24"/></w:rPr></w:style>
</w:styles>`;

function numbering() {
  const lvl = (i, fmt, txt, ind) =>
    `<w:lvl w:ilvl="${i}"><w:start w:val="1"/><w:numFmt w:val="${fmt}"/>`
    + `<w:lvlText w:val="${txt}"/><w:lvlJc w:val="left"/>`
    + `<w:pPr><w:ind w:left="${ind}" w:hanging="340"/></w:pPr>`
    + `<w:rPr><w:rFonts w:ascii="Cambria" w:hAnsi="Cambria"/></w:rPr></w:lvl>`;
  const bullets = `<w:abstractNum w:abstractNumId="0">`
    + lvl(0, 'bullet', '•', 567) + lvl(1, 'bullet', '–', 1021) + lvl(2, 'bullet', '•', 1474)
    + `</w:abstractNum>`;
  const romanos = `<w:abstractNum w:abstractNumId="1">`
    + lvl(0, 'lowerRoman', '(%1)', 567) + lvl(1, 'lowerLetter', '%2)', 1021)
    + `</w:abstractNum>`;
  const letras = `<w:abstractNum w:abstractNumId="2">`
    + lvl(0, 'lowerLetter', '%1)', 567) + lvl(1, 'lowerRoman', '(%2)', 1021)
    + `</w:abstractNum>`;
  const decimal = `<w:abstractNum w:abstractNumId="3">`
    + lvl(0, 'decimal', '%1.', 567) + lvl(1, 'lowerLetter', '%2)', 1021)
    + `</w:abstractNum>`;
  // Una instancia <w:num> por cada lista emitida, con reinicio explicito en 1
  // para los dos primeros niveles. Sin esto Word continua la serie a lo largo
  // de todo el documento y la segunda lista romana arranca en (xiii).
  const nums = numRegistry.map((abstractId, i) => {
    const ov = [0, 1].map(l =>
      `<w:lvlOverride w:ilvl="${l}"><w:startOverride w:val="1"/></w:lvlOverride>`).join('');
    return `<w:num w:numId="${i + 1}"><w:abstractNumId w:val="${abstractId}"/>${ov}</w:num>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
${bullets}${romanos}${letras}${decimal}
${nums}
</w:numbering>`;
}

// Encabezado: logotipo Garrigues + filete verde
function header(logoW, logoH) {
  const cx = Math.round(logoW * 9525), cy = Math.round(logoH * 9525);
  const drawing = `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"
xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing">
<wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="1" name="Garrigues"/>
<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
<a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
<pic:nvPicPr><pic:cNvPr id="1" name="Garrigues"/><pic:cNvPicPr/></pic:nvPicPr>
<pic:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rIdLogo"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>
<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm>
<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>
</pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:p><w:pPr><w:jc w:val="left"/><w:spacing w:after="60"/>
<w:pBdr><w:bottom w:val="single" w:sz="8" w:space="6" w:color="${T.verde}"/></w:pBdr>
</w:pPr>${drawing}</w:p></w:hdr>`;
}

const FOOTER = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:p><w:pPr><w:jc w:val="right"/><w:spacing w:before="80" w:after="0"/></w:pPr>
<w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:color w:val="${T.tintaSec}"/><w:sz w:val="18"/></w:rPr><w:t xml:space="preserve"></w:t></w:r>
<w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:color w:val="${T.tintaSec}"/><w:sz w:val="18"/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r>
<w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:color w:val="${T.tintaSec}"/><w:sz w:val="18"/></w:rPr><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r>
<w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:color w:val="${T.tintaSec}"/><w:sz w:val="18"/></w:rPr><w:fldChar w:fldCharType="end"/></w:r>
</w:p></w:ftr>`;

export async function build(bodyXml, outPath, logoPath, logoW = 150, logoH = 22) {
  const sect = `<w:sectPr>`
    + `<w:headerReference w:type="default" r:id="rId3" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/>`
    + `<w:footerReference w:type="default" r:id="rId4" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/>`
    + `<w:pgSz w:w="12240" w:h="15840"/>`
    + `<w:pgMar w:top="1418" w:right="1418" w:bottom="1418" w:left="1418" w:header="709" w:footer="709" w:gutter="0"/>`
    + `</w:sectPr>`;

  const doc = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<w:body>${bodyXml}${sect}</w:body></w:document>`;

  const zip = new JSZip();
  zip.file('[Content_Types].xml', CONTENT_TYPES);
  zip.folder('_rels').file('.rels', RELS);
  const w = zip.folder('word');
  w.file('document.xml', doc);
  w.file('styles.xml', STYLES);
  w.file('numbering.xml', numbering());
  w.file('header1.xml', header(logoW, logoH));
  w.file('footer1.xml', FOOTER);
  w.folder('_rels').file('document.xml.rels', DOC_RELS);
  w.folder('_rels').file('header1.xml.rels', HDR_RELS);
  w.folder('media').file('logo.png', fs.readFileSync(logoPath));

  const buf = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(outPath, buf);
  return buf.length;
}
