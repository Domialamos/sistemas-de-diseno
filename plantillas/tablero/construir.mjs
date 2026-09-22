#!/usr/bin/env node
// ===========================================================================
// Construye datos.js para el tablero de plantillas a partir de la fuente:
//   plantillas/tipos/*.mjs      → meta, campos requeridos, portada
//   plantillas/ejemplos/*.json  → ejemplo completo
//   plantillas/tablero/previews → imágenes de la página 1 (y 3) de cada ejemplo
//
//   node plantillas/tablero/construir.mjs            escribe plantillas/tablero/datos.js
//   node plantillas/tablero/construir.mjs --artifact escribe además tablero-artifact.html
//                                                     (index.html con los datos incrustados)
// ===========================================================================
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.dirname(AQUI);
const TIPOS = path.join(RAIZ, 'tipos');
const EJEMPLOS = path.join(RAIZ, 'ejemplos');
const PREVIEWS = path.join(AQUI, 'previews');

const ORDEN_FAMILIAS = ['Asesoría', 'Societario', 'Operaciones', 'Interno'];

const paginas = fs.existsSync(path.join(PREVIEWS, 'paginas.json'))
  ? JSON.parse(fs.readFileSync(path.join(PREVIEWS, 'paginas.json'), 'utf8')) : {};

const tipos = [];
for (const f of fs.readdirSync(TIPOS).filter(f => f.endsWith('.mjs')).sort()) {
  const tipo = f.replace(/\.mjs$/, '');
  const mod = await import(pathToFileURL(path.join(TIPOS, f)).href);
  const ej = path.join(EJEMPLOS, `${tipo}.json`);
  const previews = fs.existsSync(PREVIEWS)
    ? fs.readdirSync(PREVIEWS).filter(p => p.startsWith(`${tipo}-`) && p.endsWith('.jpg')).sort().map(p => `previews/${p}`)
    : [];
  tipos.push({
    tipo,
    nombre: mod.meta.nombre,
    familia: mod.meta.familia,
    descripcion: mod.meta.descripcion,
    requeridos: mod.requeridos ?? [],
    portada: !!mod.primeraPaginaLimpia,
    ejemplo: fs.existsSync(ej) ? JSON.parse(fs.readFileSync(ej, 'utf8')) : null,
    previews,
    paginas: paginas[tipo] ?? null,
  });
}
tipos.sort((a, b) => ORDEN_FAMILIAS.indexOf(a.familia) - ORDEN_FAMILIAS.indexOf(b.familia) || a.nombre.localeCompare(b.nombre, 'es'));

const datos = {
  generadoEl: new Date().toISOString().slice(0, 16).replace('T', ' '),
  familias: ORDEN_FAMILIAS,
  tipos,
};
const js = `// Generado por plantillas/tablero/construir.mjs. No editar a mano: la fuente son tipos/ y ejemplos/.\nwindow.PLANTILLAS = ${JSON.stringify(datos, null, 1)};\n`;
fs.writeFileSync(path.join(AQUI, 'datos.js'), js);
console.log(`datos.js: ${tipos.length} tipos, ${tipos.reduce((s, t) => s + t.previews.length, 0)} vistas previas`);

if (process.argv.includes('--artifact')) {
  // Versión para publicar como página: sin <html>/<head>/<body>, datos incrustados, imágenes por ruta relativa.
  const html = fs.readFileSync(path.join(AQUI, 'index.html'), 'utf8');
  const cabeza = html.match(/<head>([\s\S]*?)<\/head>/)[1]
    .replace(/<meta[^>]*>\s*/g, '')
    .replace(/<script src="datos\.js"><\/script>\s*/, '');
  const cuerpo = html.match(/<body[^>]*>([\s\S]*?)<\/body>/)[1];
  const salida = `${cabeza.trim()}\n<script>${js}</script>\n${cuerpo.trim()}\n`;
  fs.writeFileSync(path.join(AQUI, 'tablero-artifact.html'), salida);
  console.log(`tablero-artifact.html: ${salida.length} bytes`);
}
