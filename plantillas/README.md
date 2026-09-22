# Plantillas · documentos Garrigues

Catorce tipos de documento que salen en Word (.docx) con el formato de la casa, a partir de un JSON con el contenido. El formato ya está decidido; lo único que cambia entre un documento y otro es el contenido.

```bash
npm install                                   # una vez
node plantillas/generar.mjs --lista           # catálogo
node plantillas/generar.mjs --campos memorandum
node plantillas/generar.mjs memorandum datos.json salida.docx
node plantillas/generar.mjs --todos           # regenera plantillas/salida/ desde ejemplos/
```

## Catálogo

| Tipo | Familia | Cuándo | Primera página |
|---|---|---|---|
| `informe` | Asesoría | Revisión con más de una materia: portada, índice, resumen ejecutivo con cifras, secciones, semáforo | Portada verde |
| `memorandum` | Asesoría | Una consulta, una respuesta, en dos o tres páginas; abre con la síntesis | Cabecera |
| `carta` | Asesoría | Carta formal a cliente o contraparte | Cabecera libre |
| `opinion-legal` | Operaciones | Legal opinion: documentos revisados, supuestos, opinión numerada, calificaciones | Cabecera |
| `acta-directorio` | Societario | Sesión ordinaria o extraordinaria: asistencia, mesa, acta anterior, tabla, acuerdos, firmas | Cabecera |
| `acta-junta` | Societario | Junta ordinaria o extraordinaria: convocatoria, asistencia con acciones, acuerdos, firmas | Cabecera |
| `certificado` | Societario | Certificado del secretario, de vigencia o de acuerdos | Cabecera |
| `poder` | Societario | Mandato o poder especial: facultades numeradas, limitaciones, vigencia | Cabecera |
| `contrato` | Operaciones | Instrumento privado: comparecencia, cláusulas ordinales, personerías, firmas, anexos | Cabecera |
| `due-diligence` | Operaciones | Informe por módulos con matriz de hallazgos; el resumen cuenta los hallazgos solo | Portada verde |
| `checklist-cierre` | Operaciones | Documentos de la operación por etapa, con responsable, estado y fecha; cuenta los estados | Cabecera |
| `tabla-obligaciones` | Operaciones | Obligaciones de un contrato con cláusula, plazo y consecuencia; cuenta vencidas, próximas y sin fecha contra la fecha de corte | Cabecera |
| `estudio-titulos` | Operaciones | Inmueble: cadena de títulos, gravámenes, prohibiciones, conclusión | Cabecera |
| `minuta` | Interno | Reunión: temas, acuerdos con responsable y plazo, pendientes | Cabecera |

Las presentaciones no salen de acá: usan la plantilla corporativa .pptx (interna) y la slide del tablero como referencia visual.

## Cómo se escribe el contenido

Cada tipo tiene un ejemplo completo en `ejemplos/<tipo>.json`; copiarlo y reemplazar es la forma más rápida. Reglas comunes:

- **Corchetes = dato que falta.** `[fecha]`, `[RUT]`, `[monto]`. Nunca se inventa el dato: se deja el corchete y lo completa la abogada.
- **Fechas** en ISO `2026-09-22`; el generador las escribe en largo (`22 de septiembre de 2026`) o corto (`22-09-2026`) según el lugar.
- **Énfasis** dentro de cualquier texto: `**negrita**` y `*cursiva*`. Nada más: ni subrayado ni color.
- **Contenido libre** (secciones de informe, cláusulas, análisis de memo) se escribe con el modelo de bloques:

```json
[
  "Un párrafo.",
  { "h2": "Título de segundo nivel" },
  { "h3": "Título de tercer nivel" },
  { "lista": ["uno", { "texto": "dos", "sub": ["dos a", "dos b"] }], "tipo": "decimal" },
  { "tabla": { "cabecera": ["A", "B", "Estado"], "filas": [["x", "y", { "sem": "verde" }]], "anchos": [0.4, 0.4, 0.2] } },
  { "diagnostico": "Lo que el lector debe llevarse." },
  { "recomendacion": "Acción, responsable, plazo." },
  { "rotulo": "En síntesis", "texto": "Bloque con rótulo libre." },
  { "cita": "Texto literal de una cláusula, sangrado y en cursiva." },
  { "nota": "Nota en Calibri gris." },
  { "tarjetas": [{ "n": 3, "label": "Críticos", "color": "B3261E" }] },
  { "salto": true }
]
```

Tipos de lista: `decimal` (1. 2. 3.), `letra` ((a) (b)), `romano` ((i) (ii)), `vineta`. El semáforo en celdas de tabla: `{ "sem": "rojo" | "ambar" | "verde" | "gris", "texto": "opcional" }`; por defecto escribe No cumple, Insuficiente, Cumple, No aplica. Siempre lleva la palabra, nunca solo el color.

## Logotipos

No vienen en el repositorio. Si existen `plantillas/activos/logo.png` (encabezado, proporción 116×17) y `plantillas/activos/logo-blanco.png` (portada, 168×25), se incrustan; si no, el documento sale igual, sin imagen. También se aceptan las variables `GARRIGUES_LOGO` y `GARRIGUES_LOGO_BLANCO` con rutas.

## Tokens

Los de `base.mjs`, iguales al tablero (`index.html`): verde `#004339`, verde medio `#007665`, tinta `#1A1A1A`, filete `#C9D4D1`, verde claro `#EDF2F0`, cebra `#F7FAF9`, semáforo rojo `#B3261E`, ámbar `#C98A1B`, verde ok `#2E7D32`. Cambria 11 pt con interlineado 1,15 en el cuerpo, Calibri en rótulos, tablas, pie y notas. Carta, márgenes de 2,5 cm.

## Agregar un tipo nuevo

Copiar el más parecido de `tipos/`, cambiar `meta`, `requeridos`, `encabezado`, `pie` y el cuerpo, y dejar un `ejemplos/<tipo>.json` completo. `generar.mjs --todos` lo toma solo. Cada tipo se arma con las piezas de `base.mjs`; si hace falta una pieza nueva (otro bloque), se agrega ahí, una vez, para que la hereden todos.
