---
name: formato-garrigues
description: Redacta documentos del área Mercantil (informe, memorándum, carta, opinión legal, acta de directorio, acta de junta, certificado, poder, contrato, due diligence, checklist de cierre, tabla de obligaciones, estudio de títulos, minuta) y los entrega en Word con el formato de la casa, usando los generadores de plantillas/ del repositorio sistemas-de-diseno. Usar siempre que se pida redactar, formatear o "pasar a Word" cualquiera de esos documentos.
---

# Formato Garrigues · del pedido al .docx

El formato ya está decidido en `plantillas/`. Esta skill decide el tipo, escribe el contenido en el JSON del tipo y corre el generador. No se escribe formato a mano: ni interlineados, ni títulos, ni colores.

## Dónde está el repositorio

`~/sistemas-de-diseno` (clonado de github.com/Domialamos/sistemas-de-diseno). Si no está: `git clone https://github.com/Domialamos/sistemas-de-diseno ~/sistemas-de-diseno && cd ~/sistemas-de-diseno && npm install`.

## Pasos

1. **Elegir el tipo** con la tabla de abajo. Si el pedido calza con dos, preguntar una sola vez; si no hay respuesta, elegir el más simple (memorándum antes que informe).
2. **Leer el ejemplo** del tipo: `plantillas/ejemplos/<tipo>.json`. Es el contrato de datos completo. `node plantillas/generar.mjs --campos <tipo>` lista los campos obligatorios.
3. **Escribir el JSON** en la carpeta del asunto, fuera del repositorio (por ejemplo `~/Documents/Asuntos/<asunto>/<tipo>.json`), con el contenido real del pedido. Reglas de contenido más abajo.
4. **Generar** desde la carpeta del repositorio: `node plantillas/generar.mjs <tipo> "<ruta del JSON>" "<ruta del .docx de salida>"`. Si falta un campo obligatorio, el generador lo dice: completar y repetir. Funciona igual en Mac y en Windows.
5. **Auditar** el resultado antes de entregarlo: abrir el .docx en Word y revisar que no queden corchetes que el pedido sí resolvía, que las tablas no corten palabras y que los nombres, fechas y montos sean los del pedido. Con esfuerzo alto si sale a terceros.
6. **Entregar** la ruta del archivo y, en dos líneas, qué quedó en corchetes para que ella lo complete.

## Qué tipo para qué

| Pedido | Tipo |
|---|---|
| "revisión", "informe", varias materias, cliente externo | `informe` |
| "memo", una consulta puntual, respuesta fundada | `memorandum` |
| "carta", "escríbele a", aviso formal | `carta` |
| "opinión legal", "legal opinion", financiamiento, exigibilidad | `opinion-legal` |
| "acta de directorio", "sesión de directorio" | `acta-directorio` |
| "acta de junta", "junta de accionistas" | `acta-junta` |
| "certificado", "vigencia de poderes", "certificado del secretario" | `certificado` |
| "poder", "mandato", "facultades" | `poder` |
| "contrato", "borrador de contrato", cláusulas | `contrato` |
| "due diligence", "DD", sala de datos, módulos | `due-diligence` |
| "checklist", "closing", "documentos del cierre" | `checklist-cierre` |
| "obligaciones del contrato", "tabla de plazos", "covenants" | `tabla-obligaciones` |
| "estudio de títulos", inmueble, conservador | `estudio-titulos` |
| "minuta", "resumen de la reunión", acuerdos y responsables | `minuta` |

## Reglas de contenido que no se negocian

- **Corchetes para lo que no está en el pedido**: `[fecha]`, `[RUT]`, `[monto]`, `[Nombre]`. Jamás inventar un dato, una cita, una norma ni un número de inscripción. Un corchete vale más que un dato falso.
- **Nada de clientes en el repositorio.** El JSON con contenido real vive en la carpeta del asunto, nunca dentro de `sistemas-de-diseno`. Los ejemplos del repo son ficticios y así se quedan.
- **Las citas normativas las verifica ella.** La skill pone el formato; la vigencia y el número de artículo se confirman en la fuente oficial antes de que el documento salga.
- **Semáforo con palabra**: rojo = No cumple / crítico, ámbar = Insuficiente / relevante, verde = Cumple / conforme, gris = No aplica. Nunca solo el color.
- **Un documento a la vez.** Diez documentos son diez corridas, no una. Esfuerzo alto cuando el entregable sale a terceros; auditoría antes de la revisión propia.
- **Castellano de Chile, registro formal.** Sin emojis, sin puntos suspensivos, sin "estimado/a" en cartas cuando hay nombre (usar `Señor/Señora Apellido:`).

## Cuando el formato no alcanza

Si el pedido necesita un bloque que el modelo de contenido no tiene (otro tipo de tabla, un cuadro distinto), no se parcha el JSON con texto simulando formato: se agrega el bloque a `plantillas/base.mjs` una vez, se documenta en `plantillas/README.md` y se hace commit. Así lo heredan los catorce tipos.
