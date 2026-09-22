// Acta de junta de accionistas (ordinaria o extraordinaria).
import { CABECERA, P, H2, ROTULO, TABLE, ROT, CONTENIDO, FIRMAS, fechaLarga } from '../base.mjs';

export const meta = {
  tipo: 'acta-junta', familia: 'Societario', nombre: 'Acta de junta de accionistas',
  descripcion: 'Junta ordinaria o extraordinaria: convocatoria, asistencia con acciones y porcentajes, mesa, tabla, acuerdos numerados, cierre y firmas.',
};
export const requeridos = ['sociedad', 'fecha', 'hora', 'asistentes', 'presidente', 'secretario', 'acuerdos'];
export const primeraPaginaLimpia = false;
export const encabezado = (d) => `${d.sociedad} · Junta ${d.tipoJunta ?? 'ordinaria'} de accionistas`;
export const pie = (d) => `Acta junta ${d.tipoJunta ?? 'ordinaria'} · ${d.sociedad}`;
export const titulo = (d) => `Acta de junta ${d.tipoJunta ?? 'ordinaria'} de accionistas · ${d.sociedad}`;

const ORD = ['Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto', 'Sexto', 'Séptimo', 'Octavo', 'Noveno', 'Décimo'];

export default function cuerpo(d) {
  const tipo = d.tipoJunta ?? 'ordinaria';
  const cab = CABECERA({ rotulo: d.sociedad, titulo: `Acta de junta ${tipo} de accionistas`, bajada: fechaLarga(d.fecha) });
  const apertura = P(`En ${d.ciudad ?? 'Santiago de Chile'}, a ${fechaLarga(d.fecha)}, siendo las ${d.hora} horas, en ${d.lugar ?? '[domicilio social]'}${d.modalidad ? `, ${d.modalidad}` : ''}, se celebró la junta ${tipo} de accionistas de **${d.sociedad}** (la "Sociedad").`);

  let n = 0;
  const seccion = (t) => ROTULO(ORD[n++], { before: 320, after: 0 }) + H2(t, { before: 0 });

  const convocatoria = seccion('Convocatoria') + P(d.convocatoria ?? '[Cómo se citó a la junta: acuerdo de directorio, avisos, citación a los accionistas, o constancia de que asistió la totalidad de las acciones emitidas con derecho a voto y se prescindió de las formalidades de convocatoria.]');

  const totalAcc = d.totalAcciones ?? d.asistentes.reduce((s, a) => s + (Number(a.acciones) || 0), 0);
  const presentes = d.asistentes.reduce((s, a) => s + (Number(a.acciones) || 0), 0);
  const pct = d.porcentajePresente ?? (totalAcc ? `${((presentes / totalAcc) * 100).toFixed(2).replace('.', ',')}%` : '[%]');
  const asistencia = seccion('Asistencia y quórum')
    + TABLE([['Accionista', 'Representado por', 'Acciones', '%'],
      ...d.asistentes.map(a => [a.accionista, a.representante ?? 'Por sí', { texto: String(a.acciones ?? ''), alinear: 'right' }, { texto: a.porcentaje ?? '', alinear: 'right' }])],
      { anchos: [0.38, 0.32, 0.16, 0.14] })
    + P(`Se dejó constancia de que se encontraban presentes o representadas ${presentes.toLocaleString('es-CL')} acciones, equivalentes al ${pct} de las acciones emitidas con derecho a voto, por lo que existía quórum para celebrar la junta y adoptar acuerdos conforme a la ley y a los estatutos sociales.`)
    + P(`Presidió la junta don/doña **${d.presidente}** y actuó como secretario/a don/doña **${d.secretario}**.${d.calificacionPoderes ? ` ${d.calificacionPoderes}` : ''}`);

  const tabla = d.tabla?.length
    ? seccion('Materias de la junta') + CONTENIDO([{ lista: d.tabla.map(t => `**${t.materia}.** ${t.exposicion ?? ''}`.trim()), tipo: 'decimal' }])
    : '';

  const acuerdos = seccion('Acuerdos') + d.acuerdos.map((a, i) =>
    ROT(`Acuerdo N.º ${i + 1}${a.titulo ? ` · ${a.titulo}` : ''}`, `${a.texto} Adoptado por ${a.votacion ?? 'la unanimidad de las acciones presentes con derecho a voto'}.`)).join('');

  const cierre = seccion('Cierre')
    + P(d.firmaActa ?? `Se acordó que el acta de esta junta sea firmada por el Presidente, el Secretario y ${d.firmantesActa ?? '[los accionistas designados al efecto]'}, y que ${d.reduccion ?? 'los acuerdos se lleven a efecto una vez firmada el acta, sin esperar su aprobación posterior'}.`)
    + P(`No habiendo otras materias que tratar, se levantó la junta a las ${d.horaCierre ?? '[hh:mm]'} horas.`);

  const firmantes = d.firmantes ?? [{ nombre: d.presidente, cargo: 'Presidente' }, { nombre: d.secretario, cargo: 'Secretario/a' }];
  return cab + apertura + convocatoria + asistencia + tabla + acuerdos + cierre + FIRMAS(firmantes, { columnas: Math.min(3, firmantes.length), alto: 800 });
}
