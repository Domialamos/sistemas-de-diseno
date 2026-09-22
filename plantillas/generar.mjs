#!/usr/bin/env node
// ===========================================================================
// Generador de documentos Garrigues
//
//   node plantillas/generar.mjs <tipo> <datos.json> [salida.docx]
//   node plantillas/generar.mjs --todos      regenera plantillas/salida/ desde ejemplos/
//   node plantillas/generar.mjs --lista      catálogo de tipos y campos requeridos
//   node plantillas/generar.mjs --campos <tipo>
//
// Cada tipo vive en plantillas/tipos/<tipo>.mjs y exporta:
//   meta         { tipo, nombre, familia, descripcion }
//   requeridos   campos que no pueden faltar
//   encabezado(d), pie(d)   textos del encabezado y pie de página
//   primeraPaginaLimpia     true si la primera página va sin encabezado ni pie (portadas)
//   default(d)   el cuerpo del documento en XML, armado con base.mjs
// ===========================================================================
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { empaquetar } from './base.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const TIPOS = path.join(AQUI, 'tipos');
const EJEMPLOS = path.join(AQUI, 'ejemplos');
const SALIDA = path.join(AQUI, 'salida');

export const listarTipos = () => fs.readdirSync(TIPOS).filter(f => f.endsWith('.mjs')).map(f => f.replace(/\.mjs$/, '')).sort();

export async function cargarTipo(tipo) {
  const ruta = path.join(TIPOS, `${tipo}.mjs`);
  if (!fs.existsSync(ruta)) {
    throw new Error(`No existe la plantilla "${tipo}". Tipos disponibles: ${listarTipos().join(', ')}`);
  }
  // import() exige una URL file:// en Windows; en macOS y Linux también la acepta.
  return import(pathToFileURL(ruta).href);
}

function faltantes(requeridos = [], datos = {}) {
  return requeridos.filter((campo) => {
    const v = campo.split('.').reduce((acc, k) => (acc == null ? undefined : acc[k]), datos);
    return v == null || v === '' || (Array.isArray(v) && v.length === 0);
  });
}

export async function generar(tipo, datos, salida, opciones = {}) {
  const mod = await cargarTipo(tipo);
  const faltan = faltantes(mod.requeridos, datos);
  if (faltan.length) {
    throw new Error(`Faltan campos para "${tipo}": ${faltan.join(', ')}. Usa corchetes, [así], para lo que no sepas; nunca inventes el dato.`);
  }
  const buf = await empaquetar(() => mod.default(datos), {
    salida,
    encabezado: mod.encabezado ? mod.encabezado(datos) : '',
    pie: mod.pie ? mod.pie(datos) : '',
    titulo: mod.titulo ? mod.titulo(datos) : mod.meta?.nombre,
    autor: datos.autor ?? datos.preparadoPor ?? datos.de ?? '',
    primeraPaginaLimpia: !!mod.primeraPaginaLimpia,
    logo: opciones.logo, logoBlanco: opciones.logoBlanco,
  });
  return { bytes: buf.length, salida };
}

async function main(argv) {
  const [a, b, c] = argv;
  if (!a || a === '--ayuda' || a === '-h') {
    console.log('Uso: node plantillas/generar.mjs <tipo> <datos.json> [salida.docx]\n     node plantillas/generar.mjs --todos | --lista | --campos <tipo>');
    return;
  }
  if (a === '--lista') {
    for (const t of listarTipos()) {
      const m = await cargarTipo(t);
      console.log(`${t.padEnd(20)} ${m.meta.familia.padEnd(12)} ${m.meta.nombre}`);
    }
    return;
  }
  if (a === '--campos') {
    const m = await cargarTipo(b);
    console.log(`${m.meta.nombre}\n${m.meta.descripcion}\n\nRequeridos: ${m.requeridos.join(', ')}\nEjemplo: plantillas/ejemplos/${b}.json`);
    return;
  }
  if (a === '--todos') {
    fs.mkdirSync(SALIDA, { recursive: true });
    let ok = 0;
    for (const t of listarTipos()) {
      const ej = path.join(EJEMPLOS, `${t}.json`);
      if (!fs.existsSync(ej)) { console.log(`  (sin ejemplo) ${t}`); continue; }
      const datos = JSON.parse(fs.readFileSync(ej, 'utf8'));
      const out = path.join(SALIDA, `${t}.docx`);
      const r = await generar(t, datos, out);
      console.log(`  ${t.padEnd(20)} ${String(r.bytes).padStart(7)} bytes  ${path.relative(process.cwd(), out)}`);
      ok += 1;
    }
    console.log(`${ok} documentos generados en ${path.relative(process.cwd(), SALIDA)}/`);
    return;
  }
  const tipo = a;
  if (!b) throw new Error('Falta el archivo de datos (.json).');
  const datos = JSON.parse(fs.readFileSync(b, 'utf8'));
  const salida = c ?? path.join(process.cwd(), `${tipo}-${path.basename(b, '.json')}.docx`);
  const r = await generar(tipo, datos, salida);
  console.log(`${r.bytes} bytes → ${salida}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main(process.argv.slice(2)).catch((e) => { console.error(`Error: ${e.message}`); process.exit(1); });
}
