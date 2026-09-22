// Estudio de títulos de un inmueble: individualización, cadena de títulos, gravámenes, prohibiciones, conclusión.
import { CABECERA, FICHA, H2, P, TABLE, ROT, CONTENIDO, NOTA, FIRMAS, fechaLarga } from '../base.mjs';

export const meta = {
  tipo: 'estudio-titulos', familia: 'Operaciones', nombre: 'Estudio de títulos',
  descripcion: 'Inmueble: individualización e inscripción vigente, cadena de títulos por diez años o más, gravámenes, prohibiciones y litigios, documentos revisados, conclusión y recomendaciones.',
};
export const requeridos = ['inmueble.descripcion', 'inmueble.conservador', 'solicitante', 'fecha', 'titulos', 'conclusion'];
export const primeraPaginaLimpia = false;
export const encabezado = (d) => `Estudio de títulos · ${d.inmueble.nombreCorto ?? d.inmueble.comuna ?? ''}`;
export const pie = (d) => `Estudio de títulos · ${d.solicitante}`;
export const titulo = (d) => `Estudio de títulos · ${d.inmueble.descripcion}`;

export default function cuerpo(d) {
  const i = d.inmueble;
  const cab = CABECERA({ rotulo: 'Estudio de títulos', titulo: i.nombreCorto ?? 'Inmueble', bajada: i.descripcion });
  const ficha = FICHA([
    ['Solicitante', d.solicitante], ['Fecha', fechaLarga(d.fecha)], ['Comuna', i.comuna], ['Rol de avalúo', i.rol],
    ['Inscripción vigente', i.inscripcion ? `Fojas ${i.inscripcion.fojas} N.º ${i.inscripcion.numero} del Registro de Propiedad del año ${i.inscripcion.anio}, ${i.conservador}` : i.conservador],
    ['Propietario inscrito', i.propietario], ['Período revisado', d.periodo],
  ]);
  const titulos = H2('1. Cadena de títulos')
    + (d.textoTitulos ? P(d.textoTitulos) : '')
    + TABLE([['Año', 'Acto o contrato', 'Partes', 'Inscripción'], ...d.titulos.map(t => [String(t.anio ?? ''), t.acto, t.partes ?? '', t.inscripcion ?? ''])], { anchos: [0.1, 0.32, 0.33, 0.25] });
  const grav = H2('2. Hipotecas y gravámenes')
    + (d.gravamenes?.length
      ? TABLE([['Tipo', 'A favor de', 'Inscripción', 'Estado'], ...d.gravamenes.map(g => [g.tipo, g.beneficiario ?? '', g.inscripcion ?? '', { sem: g.vigente === false ? 'verde' : 'ambar', texto: g.estado ?? (g.vigente === false ? 'Alzada' : 'Vigente') }])], { anchos: [0.25, 0.3, 0.25, 0.2] })
      : P('No se registran hipotecas ni gravámenes vigentes sobre el inmueble según los certificados tenidos a la vista.'));
  const proh = H2('3. Prohibiciones, embargos y litigios')
    + (d.prohibiciones?.length
      ? TABLE([['Tipo', 'A favor de', 'Inscripción', 'Estado'], ...d.prohibiciones.map(g => [g.tipo, g.beneficiario ?? '', g.inscripcion ?? '', { sem: g.vigente === false ? 'verde' : 'rojo', texto: g.estado ?? (g.vigente === false ? 'Alzada' : 'Vigente') }])], { anchos: [0.25, 0.3, 0.25, 0.2] })
      : P('No se registran prohibiciones, embargos ni litigios inscritos según los certificados tenidos a la vista.'));
  const otros = d.otros ? H2('4. Otras materias') + CONTENIDO(d.otros) : '';
  const docs = H2(`${otros ? 5 : 4}. Documentos revisados`) + CONTENIDO([{ lista: d.documentosRevisados ?? ['[Copia de inscripción de dominio con vigencia]', '[Certificado de hipotecas y gravámenes]', '[Certificado de prohibiciones e interdicciones]', '[Certificado de avalúo fiscal]', '[Escrituras de los títulos anteriores]'], tipo: 'decimal' }]);
  const concl = H2(`${otros ? 6 : 5}. Conclusión`) + ROT('Conclusión', d.conclusion)
    + (d.recomendaciones?.length ? CONTENIDO([{ lista: d.recomendaciones, tipo: 'decimal' }]) : '');
  const firma = d.firmante ? FIRMAS([{ nombre: d.firmante.nombre, cargo: d.firmante.cargo }], { columnas: 1, alto: 500 }) : '';
  const nota = NOTA(d.limitacion ?? 'Estudio efectuado sobre copias y certificados con la vigencia que se indica en cada caso. No sustituye la revisión de los certificados actualizados a la fecha de la operación. El rol de avalúo fiscal es una identificación tributaria y no un rol de causa judicial.');
  return cab + ficha + titulos + grav + proh + otros + docs + concl + firma + nota;
}
