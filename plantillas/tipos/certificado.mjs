// Certificado (del secretario, de vigencia, de acuerdos): quién certifica, qué certifica, fecha y firma.
import { CABECERA, P, CONTENIDO, FIRMAS, NOTA, fechaLarga } from '../base.mjs';

export const meta = {
  tipo: 'certificado', familia: 'Societario', nombre: 'Certificado',
  descripcion: 'Certificado del secretario, de vigencia de poderes o de acuerdos: certificante, lo que se certifica en puntos numerados, lugar, fecha y firma.',
};
export const requeridos = ['sociedad', 'certificante.nombre', 'certificante.cargo', 'certifica', 'fecha'];
export const primeraPaginaLimpia = false;
export const encabezado = (d) => `${d.sociedad} · ${d.titulo ?? 'Certificado'}`;
export const pie = (d) => `${d.titulo ?? 'Certificado'} · ${d.sociedad}`;
export const titulo = (d) => `${d.titulo ?? 'Certificado'} · ${d.sociedad}`;

export default function cuerpo(d) {
  const cab = CABECERA({ rotulo: d.sociedad, titulo: d.titulo ?? 'Certificado', bajada: d.bajada });
  const intro = P(`**${d.certificante.nombre}**, ${d.certificante.calidad ?? `en su calidad de ${d.certificante.cargo}`} de **${d.sociedad}**${d.rut ? `, RUT ${d.rut}` : ''} (la "Sociedad"), ${d.verbo ?? 'certifica'} lo siguiente:`);
  const puntos = CONTENIDO([{ lista: d.certifica, tipo: 'decimal' }]);
  const anexos = d.anexos?.length ? P(`Se adjuntan como anexos: ${d.anexos.join('; ')}.`) : '';
  const cierre = P(`Se extiende el presente certificado en ${d.ciudad ?? 'Santiago de Chile'}, a ${fechaLarga(d.fecha)}, ${d.finalidad ?? 'para los fines que estime convenientes'}.`, { before: 200 });
  const firma = FIRMAS([{ nombre: d.certificante.nombre, cargo: d.certificante.cargo, detalle: d.sociedad }], { columnas: 1, alto: 800 });
  const nota = d.nota ? NOTA(d.nota) : '';
  return cab + intro + puntos + anexos + cierre + firma + nota;
}
