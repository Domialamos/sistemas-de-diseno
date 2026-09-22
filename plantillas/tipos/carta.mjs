// Carta formal a cliente o contraparte.
import { P, CONTENIDO, FIRMAS, ESPACIO, fechaLarga, T } from '../base.mjs';

export const meta = {
  tipo: 'carta', familia: 'Asesoría', nombre: 'Carta',
  descripcion: 'Carta formal: lugar y fecha, destinatario, referencia, cuerpo, despedida y firma.',
};
export const requeridos = ['fecha', 'destinatario.nombre', 'referencia', 'parrafos', 'firmante.nombre'];
export const primeraPaginaLimpia = false;
export const encabezado = (d) => d.encabezado ?? '';
export const pie = (d) => `Carta · ${d.referencia}`;
export const titulo = (d) => `Carta · ${d.referencia}`;

export default function cuerpo(d) {
  const dest = d.destinatario;
  const lugarFecha = P(`${d.ciudad ?? 'Santiago'}, ${fechaLarga(d.fecha)}`, { align: 'right', after: 360 });
  const bloqueDest = [dest.tratamiento ? `${dest.tratamiento}` : null, `**${dest.nombre}**`, dest.cargo, dest.empresa, dest.direccion, dest.correo ? `${dest.correo}` : null]
    .filter(Boolean).map((l, i) => P(l, { align: 'left', after: i === 0 ? 0 : 0, line: 240 })).join('');
  const ref = P(`**Ref.:** ${d.referencia}`, { align: 'left', before: 240, after: 240 });
  const saludo = P(d.saludo ?? `${dest.tratamiento ?? 'Estimado/a'} ${dest.apellido ?? dest.nombre}:`, { align: 'left', after: 200 });
  const parrafos = CONTENIDO(d.parrafos);
  const despedida = P(d.despedida ?? 'Sin otro particular, saluda atentamente,', { align: 'left', before: 120, after: 0 });
  const firma = FIRMAS([{ nombre: d.firmante.nombre, cargo: d.firmante.cargo, detalle: d.firmante.detalle }], { columnas: 1, alto: 500 });
  const cc = d.copia ? P(`c.c.: ${d.copia}`, { align: 'left', size: 18, color: T.tintaSec, font: 'Calibri' }) : '';
  const adjuntos = d.adjuntos?.length ? P(`Adj.: ${d.adjuntos.join('; ')}`, { align: 'left', size: 18, color: T.tintaSec, font: 'Calibri' }) : '';
  return lugarFecha + bloqueDest + ref + saludo + parrafos + despedida + firma + ESPACIO(120) + cc + adjuntos;
}
