// Tabla de obligaciones y plazos de un contrato. Cuenta vencidas, próximas y sin fecha contra la fecha de corte.
import { CABECERA, FICHA, H2, P, TABLE, TARJETAS, CONTENIDO, NOTA, T, fechaLarga, fechaCorta } from '../base.mjs';

export const meta = {
  tipo: 'tabla-obligaciones', familia: 'Operaciones', nombre: 'Tabla de obligaciones y plazos',
  descripcion: 'Obligaciones extraídas de un contrato: cláusula, tipo, responsable, plazo, fecha y consecuencia. Cuenta vencidas, próximas (30 días) y sin fecha contra la fecha de corte.',
};
export const requeridos = ['contrato', 'fecha', 'obligaciones'];
export const primeraPaginaLimpia = false;
export const encabezado = (d) => `Obligaciones y plazos · ${d.contrato}`;
export const pie = (d) => `${d.contrato} · corte ${fechaCorta(d.fecha)}`;
export const titulo = (d) => `Tabla de obligaciones · ${d.contrato}`;

const dias = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);

export default function cuerpo(d) {
  const corte = d.fecha;
  const conFecha = d.obligaciones.filter(o => /^\d{4}-\d{2}-\d{2}$/.test(o.fechaLimite ?? ''));
  const vencidas = conFecha.filter(o => dias(corte, o.fechaLimite) < 0 && !o.cumplida);
  const proximas = conFecha.filter(o => { const n = dias(corte, o.fechaLimite); return n >= 0 && n <= (d.ventanaDias ?? 30) && !o.cumplida; });
  const sinFecha = d.obligaciones.filter(o => !/^\d{4}-\d{2}-\d{2}$/.test(o.fechaLimite ?? ''));

  const cab = CABECERA({ rotulo: 'Tabla de obligaciones y plazos', titulo: d.contrato, bajada: d.bajada });
  const ficha = FICHA([['Partes', d.partes], ['Fecha del contrato', d.fechaContrato ? fechaLarga(d.fechaContrato) : null], ['Fecha de corte', fechaLarga(corte)], ['Fuente', d.fuente ?? 'Extracción sobre el texto íntegro del contrato; cada fila cita su cláusula.'], ['Preparado por', d.preparadoPor]]);
  const tarjetas = TARJETAS([
    { n: vencidas.length, label: 'Vencidas', color: T.rojo },
    { n: proximas.length, label: `Próximas ${d.ventanaDias ?? 30} días`, color: T.ambar },
    { n: sinFecha.length, label: 'Sin fecha cierta', color: T.tintaSec },
    { n: d.obligaciones.length, label: 'Total', color: T.verde },
  ]);
  const estadoDe = (o) => {
    if (o.cumplida) return { sem: 'verde', texto: 'Cumplida' };
    if (vencidas.includes(o)) return { sem: 'rojo', texto: 'Vencida' };
    if (proximas.includes(o)) return { sem: 'ambar', texto: 'Próxima' };
    if (sinFecha.includes(o)) return { sem: 'gris', texto: o.tipoPlazo ?? 'Sin fecha' };
    return { sem: 'verde', texto: 'Vigente' };
  };
  const fila = (o) => [o.clausula ?? '', o.obligacion, o.tipo ?? '', o.responsable ?? '', o.plazo ?? (o.fechaLimite ? fechaCorta(o.fechaLimite) : ''), estadoDe(o), o.consecuencia ?? ''];
  const cabecera = ['Cláusula', 'Obligación', 'Tipo', 'Responsable', 'Plazo', 'Estado', 'Consecuencia'];
  const opts = { anchos: [0.1, 0.3, 0.1, 0.12, 0.14, 0.11, 0.13], fontSize: 16 };
  const orden = [...d.obligaciones].sort((a, b) => (a.fechaLimite ?? '9999').localeCompare(b.fechaLimite ?? '9999'));
  const atencion = [...vencidas, ...proximas];
  const bloqueAtencion = atencion.length
    ? H2('Requieren atención') + TABLE([cabecera, ...atencion.map(fila)], opts)
    : '';
  const todas = H2('Todas las obligaciones, por fecha') + TABLE([cabecera, ...orden.map(fila)], opts);
  const porCl = d.porClausula === false ? '' : (H2('Desglose por cláusula')
    + TABLE([['Cláusula', 'Obligaciones', 'De hacer', 'De no hacer', 'Con fecha cierta'],
      ...Object.entries(d.obligaciones.reduce((acc, o) => { (acc[o.clausula ?? 's/c'] ??= []).push(o); return acc; }, {}))
        .map(([c, arr]) => [c, { texto: String(arr.length), alinear: 'right' }, { texto: String(arr.filter(o => /hacer/i.test(o.tipo ?? '') && !/no hacer/i.test(o.tipo ?? '')).length), alinear: 'right' }, { texto: String(arr.filter(o => /no hacer/i.test(o.tipo ?? '')).length), alinear: 'right' }, { texto: String(arr.filter(o => /^\d{4}-\d{2}-\d{2}$/.test(o.fechaLimite ?? '')).length), alinear: 'right' }])],
      { anchos: [0.2, 0.2, 0.2, 0.2, 0.2] }));
  const notas = d.notas ? CONTENIDO(d.notas) : '';
  const nota = NOTA(d.limitacion ?? `${sinFecha.length} de ${d.obligaciones.length} obligaciones no tienen fecha cierta (permanentes, condicionales o "a requerimiento"): ordenar por fecha no las muestra. Se listan aparte con su tipo de plazo. Las consecuencias solo se anotan cuando el contrato las dice; si una celda está vacía, el contrato no lo dice.`);
  return cab + ficha + tarjetas + bloqueAtencion + todas + porCl + notas + nota;
}
