// Opinión legal: documentos revisados, supuestos, opinión numerada, calificaciones.
import { CABECERA, FICHA, P, H2, CONTENIDO, FIRMAS, NOTA, fechaLarga } from '../base.mjs';

export const meta = {
  tipo: 'opinion-legal', familia: 'Operaciones', nombre: 'Opinión legal',
  descripcion: 'Legal opinion para financiamientos y operaciones: destinatario, documentos revisados, supuestos, opinión numerada, calificaciones y limitaciones.',
};
export const requeridos = ['destinatario', 'fecha', 'operacion', 'documentos', 'opiniones', 'firmante.nombre'];
export const primeraPaginaLimpia = false;
export const encabezado = (d) => `Opinión legal · ${d.operacion}`;
export const pie = (d) => `Opinión legal · ${d.referencia ?? d.operacion}`;
export const titulo = (d) => `Opinión legal · ${d.operacion}`;

export default function cuerpo(d) {
  const cab = CABECERA({ rotulo: 'Opinión legal', titulo: d.operacion, bajada: d.bajada });
  const ficha = FICHA([
    ['Dirigida a', d.destinatario], ['Fecha', fechaLarga(d.fecha)], ['Referencia', d.referencia],
    ['Sociedad', d.sociedad], ['Ley aplicable', d.leyAplicable ?? 'Leyes de la República de Chile'],
  ]);
  const intro = P(d.introduccion ?? `Hemos actuado como asesores legales de ${d.cliente ?? '[cliente]'} en relación con ${d.operacion} (la "Operación"). Emitimos esta opinión a solicitud de ${d.destinatario}, exclusivamente para los fines de la Operación.`);
  const docs = H2('1. Documentos revisados') + CONTENIDO([{ lista: d.documentos, tipo: 'letra' }]);
  const supuestos = H2('2. Supuestos') + P(d.textoSupuestos ?? 'Para los efectos de esta opinión hemos asumido, sin verificación independiente, lo siguiente:')
    + CONTENIDO([{ lista: d.supuestos ?? ['La autenticidad de todas las firmas y la conformidad con sus originales de los documentos revisados en copia.', 'La capacidad y facultades de todas las partes distintas de la Sociedad.', 'La exactitud de las declaraciones de hecho contenidas en los documentos revisados.'], tipo: 'letra' }]);
  const opinion = H2('3. Opinión') + P(d.textoOpinion ?? 'Sobre la base de lo anterior y sujeto a las calificaciones de la sección siguiente, es nuestra opinión que:')
    + CONTENIDO([{ lista: d.opiniones, tipo: 'decimal' }]);
  const calif = H2('4. Calificaciones') + CONTENIDO([{ lista: d.calificaciones ?? ['Esta opinión se limita a las leyes de la República de Chile vigentes a su fecha y no se extiende a las leyes de ninguna otra jurisdicción.', 'La exigibilidad de las obligaciones puede verse afectada por normas de quiebra, insolvencia, reorganización y otras de aplicación general que afecten los derechos de los acreedores.', 'No emitimos opinión sobre materias tributarias, laborales, ambientales ni regulatorias sectoriales, salvo que se indique expresamente.'], tipo: 'letra' }]);
  const cierre = P(d.cierre ?? 'Esta opinión se emite únicamente para el beneficio de su destinatario en relación con la Operación y no puede ser invocada por terceros ni utilizada para otros fines sin nuestro consentimiento previo y por escrito.');
  const firma = FIRMAS([{ nombre: d.firmante.nombre, cargo: d.firmante.cargo, detalle: d.firmante.detalle }], { columnas: 1, alto: 500 });
  const nota = d.nota ? NOTA(d.nota) : '';
  return cab + ficha + intro + docs + supuestos + opinion + calif + cierre + firma + nota;
}
