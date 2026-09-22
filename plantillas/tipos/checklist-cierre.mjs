// Checklist de cierre: documentos de la operación por etapa, con responsable, estado y fecha.
import { CABECERA, FICHA, H2, P, TABLE, TARJETAS, CONTENIDO, NOTA, T, fechaLarga, fechaCorta } from '../base.mjs';

export const meta = {
  tipo: 'checklist-cierre', familia: 'Operaciones', nombre: 'Checklist de cierre',
  descripcion: 'Closing checklist de una operación: ficha, conteo de estados, tabla por etapa (firma, condiciones precedentes, cierre, post-cierre) con responsable y fecha.',
};
export const requeridos = ['operacion', 'cliente', 'fecha', 'etapas'];
export const primeraPaginaLimpia = false;
export const encabezado = (d) => `Checklist de cierre · ${d.operacion}`;
export const pie = (d) => `${d.operacion} · versión ${fechaCorta(d.fecha)}`;
export const titulo = (d) => `Checklist de cierre · ${d.operacion}`;

const ESTADO = { listo: { sem: 'verde', texto: 'Listo' }, 'en curso': { sem: 'ambar', texto: 'En curso' }, pendiente: { sem: 'rojo', texto: 'Pendiente' }, 'n/a': { sem: 'gris', texto: 'No aplica' } };

export default function cuerpo(d) {
  const items = d.etapas.flatMap(e => e.items ?? []);
  const cnt = (s) => items.filter(i => (i.estado ?? 'pendiente') === s).length;
  const cab = CABECERA({ rotulo: 'Checklist de cierre', titulo: d.operacion, bajada: d.bajada });
  const ficha = FICHA([['Cliente', d.cliente], ['Partes', d.partes], ['Fecha de cierre prevista', d.fechaCierre ? fechaLarga(d.fechaCierre) : null], ['Versión', fechaLarga(d.fecha)], ['Responsable', d.responsable]]);
  const tarjetas = TARJETAS([
    { n: cnt('listo'), label: 'Listos', color: T.verdeOk },
    { n: cnt('en curso'), label: 'En curso', color: T.ambar },
    { n: cnt('pendiente'), label: 'Pendientes', color: T.rojo },
  ]);
  let n = 0;
  const etapas = d.etapas.map((e) =>
    H2(`${String.fromCharCode(65 + n++)}. ${e.nombre}`)
    + (e.descripcion ? P(e.descripcion) : '')
    + TABLE([['N.º', 'Documento', 'Responsable', 'Estado', 'Fecha', 'Observaciones'],
      ...(e.items ?? []).map((it, i) => [String(it.numero ?? i + 1), it.documento, it.responsable ?? '', ESTADO[it.estado ?? 'pendiente'] ?? { sem: 'gris' }, it.fecha ? fechaCorta(it.fecha) : '', it.observaciones ?? ''])],
      { anchos: [0.06, 0.3, 0.16, 0.14, 0.12, 0.22] })).join('');
  const notas = d.notas ? CONTENIDO(d.notas) : '';
  return cab + ficha + tarjetas + etapas + notas + NOTA(d.limitacion ?? 'Documento de trabajo interno. Estados: listo = firmado y en poder de la parte que corresponde; en curso = en negociación o a la firma; pendiente = sin iniciar.');
}
