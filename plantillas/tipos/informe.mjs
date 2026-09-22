// Informe: portada con banda verde, índice, resumen ejecutivo y secciones.
// Para revisiones o due diligence con más de una materia.
import { PORTADA, TOC, H1, CONTENIDO, TARJETAS, ROT, NOTA, fechaLarga } from '../base.mjs';

export const meta = {
  tipo: 'informe', familia: 'Asesoría', nombre: 'Informe',
  descripcion: 'Revisión o due diligence con más de una materia: portada, índice, resumen ejecutivo, secciones numeradas, semáforo.',
};
export const requeridos = ['titulo', 'cliente', 'fecha', 'secciones'];
export const primeraPaginaLimpia = true;
export const encabezado = (d) => `${d.titulo} · ${d.cliente}`;
export const pie = (d) => `${d.cliente} · ${d.confidencial === false ? '' : 'Confidencial'}`.replace(/ · $/, '');
export const titulo = (d) => d.titulo;

export default function cuerpo(d) {
  const portada = PORTADA({
    rotulo: d.rotulo ?? 'Informe',
    titulo: d.titulo, subtitulo: d.subtitulo, cliente: d.cliente, fecha: fechaLarga(d.fecha),
    ficha: [['Preparado por', d.preparadoPor], ['Referencia', d.referencia]],
    pie: d.pie ?? 'Documento confidencial, sujeto a secreto profesional. Se emite sobre la base de los antecedentes indicados y de la normativa vigente a su fecha.',
  });
  const romanos = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  const desde = d.resumen ? 1 : 0;
  const titulosIndice = [...(d.resumen ? ['I. Resumen ejecutivo'] : []),
    ...(d.secciones ?? []).map((s, i) => `${s.rotulo ?? romanos[i + desde]}. ${s.titulo}`),
    ...(d.anexos?.length ? ['Anexos'] : [])];
  const indice = H1('Contenido') + TOC(titulosIndice);
  const resumen = d.resumen
    ? H1('Resumen ejecutivo', 'Sección I', { pageBreak: true })
      + (d.resumen.tarjetas ? TARJETAS(d.resumen.tarjetas) : '')
      + CONTENIDO(d.resumen.contenido ?? d.resumen.texto)
      + (d.resumen.recomendacion ? ROT('Recomendación', d.resumen.recomendacion) : '')
    : '';
  const secciones = (d.secciones ?? []).map((s, i) =>
    H1(s.titulo, `Sección ${s.rotulo ?? romanos[i + desde]}`, { pageBreak: true }) + CONTENIDO(s.contenido)).join('');
  const anexos = d.anexos?.length
    ? H1('Anexos', 'Documentos', { pageBreak: true }) + CONTENIDO([{ lista: d.anexos, tipo: 'decimal' }])
    : '';
  const limitacion = d.limitacion ? NOTA(d.limitacion) : '';
  return portada + indice + resumen + secciones + anexos + limitacion;
}
