// Acta de sesión de directorio (ordinaria o extraordinaria).
import { CABECERA, P, H2, ROTULO, TABLE, ROT, CONTENIDO, FIRMAS, fechaLarga } from '../base.mjs';

export const meta = {
  tipo: 'acta-directorio', familia: 'Societario', nombre: 'Acta de sesión de directorio',
  descripcion: 'Sesión ordinaria o extraordinaria: asistencia y quórum, mesa, acta anterior, tabla, acuerdos numerados, cierre y firmas.',
};
export const requeridos = ['sociedad', 'numero', 'fecha', 'hora', 'directores', 'presidente', 'secretario', 'acuerdos'];
export const primeraPaginaLimpia = false;
export const encabezado = (d) => `${d.sociedad} · Acta de directorio N.º ${d.numero}`;
export const pie = (d) => `Acta sesión ${d.tipoSesion ?? 'ordinaria'} N.º ${d.numero} · ${d.sociedad}`;
export const titulo = (d) => `Acta de sesión de directorio N.º ${d.numero} · ${d.sociedad}`;

const ORD = ['Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto', 'Sexto', 'Séptimo', 'Octavo', 'Noveno', 'Décimo'];

export default function cuerpo(d) {
  const tipo = d.tipoSesion ?? 'ordinaria';
  const cab = CABECERA({
    rotulo: d.sociedad,
    titulo: `Acta de sesión ${tipo} de directorio`,
    bajada: `Sesión N.º ${d.numero} · ${fechaLarga(d.fecha)}`,
  });
  const apertura = P(`En ${d.ciudad ?? 'Santiago de Chile'}, a ${fechaLarga(d.fecha)}, siendo las ${d.hora} horas, en ${d.lugar ?? '[domicilio social]'}${d.modalidad ? `, ${d.modalidad}` : ''}, se reunió el Directorio de **${d.sociedad}** (la "Sociedad"), en sesión ${tipo}, con la asistencia que se indica a continuación.`);

  let n = 0;
  const seccion = (t) => ROTULO(ORD[n++], { before: 320, after: 0 }) + H2(t, { before: 0 });

  const asistencia = seccion('Asistencia y quórum')
    + TABLE([['Director', 'Calidad', 'Asistencia'], ...d.directores.map(x => [x.nombre, x.calidad ?? 'Director', x.asistencia ?? 'Presente'])], { anchos: [0.5, 0.25, 0.25] })
    + P(`Presidió la sesión don/doña **${d.presidente}**, en su calidad de Presidente del Directorio, y actuó como secretario/a don/doña **${d.secretario}**. ${d.quorum ?? `El Presidente dejó constancia de que, encontrándose presentes ${d.directores.filter(x => !/ausente/i.test(x.asistencia ?? '')).length} de los ${d.directores.length} directores en ejercicio, existía quórum suficiente para sesionar y adoptar acuerdos conforme a la ley y a los estatutos sociales.`}`);

  const anterior = d.actaAnterior
    ? seccion('Aprobación del acta anterior')
      + P(`Se aprobó por ${d.actaAnterior.votacion ?? 'unanimidad'} el acta de la sesión N.º ${d.actaAnterior.numero}, celebrada el ${fechaLarga(d.actaAnterior.fecha)}, ${d.actaAnterior.observaciones ?? 'sin observaciones'}.`)
    : '';

  const tabla = d.tabla?.length
    ? seccion('Tabla') + CONTENIDO([{ lista: d.tabla.map(t => `**${t.materia}.** ${t.exposicion ?? ''}`.trim()), tipo: 'decimal' }])
    : '';

  const acuerdos = seccion('Acuerdos') + d.acuerdos.map((a, i) =>
    ROT(`Acuerdo N.º ${i + 1}${a.titulo ? ` · ${a.titulo}` : ''}`, `${a.texto} Adoptado por ${a.votacion ?? 'unanimidad de los directores presentes'}.`)).join('');

  const varios = d.varios ? seccion('Varios') + CONTENIDO(d.varios) : '';

  const cierre = P(`No habiendo otras materias que tratar, se levantó la sesión a las ${d.horaCierre ?? '[hh:mm]'} horas.`, { before: 200 })
    + (d.reduccion ? P(d.reduccion) : '');

  const firmantes = d.firmantes ?? [{ nombre: d.presidente, cargo: 'Presidente' }, ...d.directores.filter(x => x.nombre !== d.presidente).map(x => ({ nombre: x.nombre, cargo: x.calidad ?? 'Director' })), { nombre: d.secretario, cargo: 'Secretario/a' }];
  return cab + apertura + asistencia + anterior + tabla + acuerdos + varios + cierre + FIRMAS(firmantes, { columnas: 3, alto: 800 });
}
