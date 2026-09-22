// Contrato: comparecencia, cláusulas ordinales, personerías, firmas y anexos.
import { CABECERA, P, CLAUSULA, CONTENIDO, FIRMAS, H2, fechaLarga } from '../base.mjs';

export const meta = {
  tipo: 'contrato', familia: 'Operaciones', nombre: 'Contrato',
  descripcion: 'Instrumento privado: comparecencia de las partes, cláusulas PRIMERO, SEGUNDO…, personerías, ejemplares, firmas y anexos.',
};
export const requeridos = ['titulo', 'partes', 'clausulas', 'fecha'];
export const primeraPaginaLimpia = false;
export const encabezado = (d) => d.titulo;
export const pie = (d) => `${d.titulo} · ${d.partes.map(p => p.abreviatura ?? p.nombre).join(' / ')}`;
export const titulo = (d) => d.titulo;

const persona = (p) => {
  const base = [`**${p.nombre}**`, p.rut ? `RUT ${p.rut}` : null, p.giro ?? null,
    p.representante ? `representada por ${p.representante}${p.rutRepresentante ? `, RUT ${p.rutRepresentante}` : ''}` : null,
    p.domicilio ? `domiciliada en ${p.domicilio}` : null].filter(Boolean).join(', ');
  return `${base}, en adelante ${p.abreviatura ? `"${p.abreviatura}"` : `la "${p.rol}"`}`;
};

export default function cuerpo(d) {
  const cab = CABECERA({ rotulo: d.rotulo ?? 'Contrato', titulo: d.titulo, bajada: d.bajada });
  const partes = d.partes.map((p, i) => `${i === 0 ? '' : i === d.partes.length - 1 ? 'y ' : ''}por ${i === 0 ? 'una' : 'la otra'} parte, ${persona(p)}`);
  const comparecencia = P(`En ${d.ciudad ?? 'Santiago de Chile'}, a ${fechaLarga(d.fecha)}, entre ${partes.join('; ')}; ${d.conjuntamente ?? 'en adelante conjuntamente las "Partes"'}, se ha convenido el siguiente ${d.denominacion ?? 'contrato'} (el "Contrato"):`);
  const clausulas = d.clausulas.map((c, i) => CLAUSULA(i, c.titulo, c.contenido)).join('');
  let n = d.clausulas.length;
  const personerias = d.personerias?.length ? CLAUSULA(n++, 'Personerías', d.personerias.map(p => ({ p }))) : '';
  const ejemplares = CLAUSULA(n++, 'Ejemplares', [d.ejemplares ?? `El presente Contrato se firma en ${d.numeroEjemplares ?? 'dos'} ejemplares de igual tenor y fecha, quedando uno en poder de cada Parte.`]);
  const firmantes = d.firmantes ?? d.partes.map(p => ({ nombre: p.representante ?? p.nombre, cargo: p.representante ? `p.p. ${p.nombre}` : p.rol }));
  const firmas = FIRMAS(firmantes, { columnas: Math.min(3, firmantes.length), alto: 900 });
  const anexos = d.anexos?.length ? H2('Anexos', { pageBreak: true }) + CONTENIDO([{ lista: d.anexos.map(a => typeof a === 'string' ? a : `**${a.titulo}.** ${a.descripcion ?? ''}`), tipo: 'decimal' }]) : '';
  return cab + comparecencia + clausulas + personerias + ejemplares + firmas + anexos;
}
