// Minuta de reunión: asistentes, temas, acuerdos con responsable y plazo, próxima reunión.
import { CABECERA, FICHA, H2, TABLE, CONTENIDO, ROT, NOTA, fechaLarga, fechaCorta } from '../base.mjs';

export const meta = {
  tipo: 'minuta', familia: 'Interno', nombre: 'Minuta de reunión',
  descripcion: 'Reunión con cliente o equipo: ficha, asistentes, temas tratados, acuerdos con responsable y plazo, próximos pasos.',
};
export const requeridos = ['reunion', 'fecha', 'asistentes', 'temas'];
export const primeraPaginaLimpia = false;
export const encabezado = (d) => `Minuta · ${d.reunion}`;
export const pie = (d) => `Minuta · ${fechaCorta(d.fecha)}`;
export const titulo = (d) => `Minuta · ${d.reunion}`;

export default function cuerpo(d) {
  const cab = CABECERA({ rotulo: 'Minuta de reunión', titulo: d.reunion, bajada: d.bajada });
  const ficha = FICHA([['Fecha', `${fechaLarga(d.fecha)}${d.hora ? `, ${d.hora}` : ''}`], ['Lugar', d.lugar], ['Asistentes', d.asistentes.join('\n')], ['Redacta', d.redacta], ['Distribución', d.distribucion]]);
  const temas = H2('1. Temas tratados') + d.temas.map((t, i) => ROT(`${i + 1}. ${t.tema}`, t.resumen)).join('');
  const acuerdos = d.acuerdos?.length
    ? H2('2. Acuerdos y compromisos') + TABLE([['N.º', 'Compromiso', 'Responsable', 'Plazo'], ...d.acuerdos.map((a, i) => [String(i + 1), a.acuerdo, a.responsable ?? '', a.plazo ? (/^\d{4}-\d{2}-\d{2}$/.test(a.plazo) ? fechaCorta(a.plazo) : a.plazo) : ''])], { anchos: [0.07, 0.53, 0.22, 0.18] })
    : '';
  const pendientes = d.pendientes?.length ? H2(`${acuerdos ? 3 : 2}. Pendientes y preguntas abiertas`) + CONTENIDO([{ lista: d.pendientes, tipo: 'vineta' }]) : '';
  const proxima = d.proximaReunion ? ROT('Próxima reunión', d.proximaReunion) : '';
  return cab + ficha + temas + acuerdos + pendientes + proxima + NOTA(d.nota ?? 'Minuta de trabajo. No constituye acta ni opinión legal; los acuerdos se formalizan por los instrumentos que correspondan.');
}
