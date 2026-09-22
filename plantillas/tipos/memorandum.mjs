// Memorándum: una consulta, una respuesta. Abre con la síntesis.
import { CABECERA, FICHA, ROT, H2, CONTENIDO, NOTA, fechaLarga } from '../base.mjs';

export const meta = {
  tipo: 'memorandum', familia: 'Asesoría', nombre: 'Memorándum',
  descripcion: 'Consulta puntual con respuesta fundada, en dos o tres páginas: ficha, síntesis, antecedentes, consulta, análisis, conclusión.',
};
export const requeridos = ['para', 'de', 'fecha', 'referencia', 'sintesis'];
export const primeraPaginaLimpia = false;
export const encabezado = (d) => `Memorándum · ${d.referencia}`;
export const pie = (d) => `Memorándum · ${d.referencia}`;
export const titulo = (d) => `Memorándum · ${d.referencia}`;

export default function cuerpo(d) {
  const cab = CABECERA({ rotulo: d.rotulo ?? 'Memorándum', titulo: d.titulo ?? d.referencia });
  const ficha = FICHA([
    ['Para', d.para], ['De', d.de], ['Con copia', d.copia], ['Fecha', fechaLarga(d.fecha)],
    ['Referencia', `**${d.referencia}**`], ['Carácter', d.caracter ?? 'Confidencial · Sujeto a secreto profesional'],
  ]);
  const sintesis = ROT('En síntesis', d.sintesis);
  const secciones = (d.secciones ?? [
    { titulo: 'Antecedentes', contenido: d.antecedentes },
    { titulo: 'Consulta', contenido: d.consulta },
    { titulo: 'Análisis', contenido: d.analisis },
    { titulo: 'Conclusión y recomendación', contenido: d.conclusion },
  ]).filter(s => s.contenido).map((s, i) => H2(`${i + 1}. ${s.titulo}`) + CONTENIDO(s.contenido)).join('');
  const reco = d.recomendacion ? ROT('Recomendación', d.recomendacion) : '';
  const limit = NOTA(d.limitacion ?? 'Este memorándum se emite sobre la base de los antecedentes indicados y de la normativa vigente a su fecha. No constituye una opinión sobre hechos o documentos no tenidos a la vista.');
  return cab + ficha + sintesis + secciones + reco + limit;
}
