// Due diligence: informe por módulos con matriz de hallazgos y semáforo. Las cifras del resumen se calculan.
import { PORTADA, TOC, H1, H2, P, TABLE, TARJETAS, ROT, CONTENIDO, NOTA, PALABRA_SEM, T, fechaLarga } from '../base.mjs';

export const meta = {
  tipo: 'due-diligence', familia: 'Operaciones', nombre: 'Informe de due diligence',
  descripcion: 'Revisión por módulos (societario, contratos, laboral, etc.): portada, índice, resumen con conteo automático de hallazgos, matriz por módulo con riesgo y recomendación.',
};
export const requeridos = ['objetivo', 'cliente', 'fecha', 'modulos'];
export const primeraPaginaLimpia = true;
export const encabezado = (d) => `Due diligence · ${d.objetivo}`;
export const pie = (d) => `${d.cliente} · Confidencial`;
export const titulo = (d) => `Due diligence · ${d.objetivo}`;

export default function cuerpo(d) {
  const todos = d.modulos.flatMap(m => (m.hallazgos ?? []).map(h => ({ ...h, modulo: m.nombre })));
  const cnt = (r) => todos.filter(h => h.riesgo === r).length;
  const portada = PORTADA({
    rotulo: 'Informe de due diligence', titulo: d.titulo ?? `Due diligence legal de ${d.objetivo}`, subtitulo: d.subtitulo,
    cliente: d.cliente, fecha: fechaLarga(d.fecha),
    ficha: [['Preparado por', d.preparadoPor], ['Alcance', d.alcance]],
    pie: d.pie ?? 'Documento confidencial, sujeto a secreto profesional. La revisión se limita a los documentos puestos a disposición en la sala de datos a la fecha de corte.',
  });
  const romanosIdx = ['II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
  const indice = H1('Contenido') + TOC(['I. Resumen ejecutivo', ...d.modulos.map((m, i) => `${romanosIdx[i]}. ${m.nombre}`), ...(d.documentosRevisados?.length ? ['Anexo. Documentos revisados'] : [])]);
  const resumen = H1('Resumen ejecutivo', 'Sección I', { pageBreak: true })
    + TARJETAS([
      { n: cnt('rojo'), label: 'Hallazgos críticos', color: T.rojo },
      { n: cnt('ambar'), label: 'Hallazgos relevantes', color: T.ambar },
      { n: cnt('verde'), label: 'Materias conformes', color: T.verdeOk },
    ])
    + CONTENIDO(d.resumen ?? [])
    + (todos.filter(h => h.riesgo === 'rojo').length
      ? H2('Hallazgos críticos') + TABLE([['Módulo', 'Hallazgo', 'Recomendación'], ...todos.filter(h => h.riesgo === 'rojo').map(h => [h.modulo, h.hallazgo, h.recomendacion ?? ''])], { anchos: [0.2, 0.45, 0.35] })
      : '');
  const modulos = d.modulos.map((m, i) =>
    H1(m.nombre, `Módulo ${romanosIdx[i]}`, { pageBreak: true })
    + (m.alcance ? P(m.alcance) : '')
    + (m.hallazgos?.length
      ? TABLE([['Materia', 'Hallazgo', 'Riesgo', 'Recomendación'],
        ...m.hallazgos.map(h => [h.materia, h.hallazgo, { sem: h.riesgo, texto: h.calificacion ?? PALABRA_SEM[h.riesgo] }, h.recomendacion ?? ''])],
        { anchos: [0.18, 0.4, 0.14, 0.28] })
      : P('Sin hallazgos en este módulo.'))
    + CONTENIDO(m.contenido ?? [])
    + (m.conclusion ? ROT('Conclusión del módulo', m.conclusion) : '')).join('');
  const docs = d.documentosRevisados?.length
    ? H1('Documentos revisados', 'Anexo', { pageBreak: true }) + CONTENIDO([{ lista: d.documentosRevisados, tipo: 'decimal' }]) : '';
  const nota = NOTA(d.limitacion ?? `Revisión efectuada sobre los documentos disponibles a la fecha de corte (${fechaLarga(d.fechaCorte ?? d.fecha)}). No incluye verificación en registros públicos salvo que se indique. Riesgo: rojo = crítico, ámbar = relevante, verde = conforme.`);
  return portada + indice + resumen + modulos + docs + nota;
}
