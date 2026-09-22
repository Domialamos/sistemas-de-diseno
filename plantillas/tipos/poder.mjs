// Poder o mandato: comparecencia, facultades numeradas, vigencia y firmas.
import { CABECERA, P, CONTENIDO, CLAUSULA, FIRMAS, fechaLarga } from '../base.mjs';

export const meta = {
  tipo: 'poder', familia: 'Societario', nombre: 'Poder',
  descripcion: 'Mandato o poder especial: comparecencia del mandante, designación del mandatario, facultades numeradas, vigencia y firmas.',
};
export const requeridos = ['mandante.nombre', 'mandatario.nombre', 'facultades', 'fecha'];
export const primeraPaginaLimpia = false;
export const encabezado = (d) => `${d.titulo ?? 'Poder especial'} · ${d.mandante.nombre}`;
export const pie = (d) => `${d.titulo ?? 'Poder especial'} · ${d.mandante.nombre}`;
export const titulo = (d) => `${d.titulo ?? 'Poder especial'} · ${d.mandante.nombre}`;

const persona = (p) => [`**${p.nombre}**`, p.rut ? `RUT ${p.rut}` : null, p.representante ? `representado/a por ${p.representante}` : null, p.domicilio ? `domiciliado/a en ${p.domicilio}` : null].filter(Boolean).join(', ');

export default function cuerpo(d) {
  const cab = CABECERA({ rotulo: d.rotulo ?? 'Mandato', titulo: d.titulo ?? 'Poder especial', bajada: d.bajada });
  const comparecencia = P(`En ${d.ciudad ?? 'Santiago de Chile'}, a ${fechaLarga(d.fecha)}, ${persona(d.mandante)} (el "Mandante"), confiere poder especial, pero tan amplio como en derecho se requiera, a ${persona(d.mandatario)} (el "Mandatario"), para que, en su nombre y representación, ejerza las facultades que se indican a continuación.`);
  const facultades = CLAUSULA(0, 'Facultades', [{ lista: d.facultades, tipo: 'decimal' }]);
  const limites = d.limites?.length ? CLAUSULA(1, 'Limitaciones', [{ lista: d.limites, tipo: 'letra' }]) : '';
  let n = limites ? 2 : 1;
  const vigencia = CLAUSULA(n++, 'Vigencia', [d.vigencia ?? 'El presente poder tendrá vigencia desde esta fecha y hasta [fecha o condición de término], sin perjuicio de su revocación anticipada por el Mandante, la que producirá efectos desde su comunicación por escrito al Mandatario.']);
  const extra = (d.clausulas ?? []).map((c) => CLAUSULA(n++, c.titulo, c.contenido)).join('');
  const firmantes = d.firmantes ?? [{ nombre: d.mandante.representante ?? d.mandante.nombre, cargo: d.mandante.representante ? `p.p. ${d.mandante.nombre}` : 'Mandante' }];
  return cab + comparecencia + facultades + limites + vigencia + extra + FIRMAS(firmantes, { columnas: Math.min(3, firmantes.length), alto: 800 })
    + (d.notas ? CONTENIDO([{ nota: d.notas }]) : '');
}
