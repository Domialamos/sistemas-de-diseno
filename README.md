# Sistemas de diseño

Estos son los sistemas de diseño que uso, en el estado en que quedaron el 22-09-2026, después de ordenarlos.

**Para verlos:** abre [`index.html`](index.html) en el navegador. Es un tablero con cada sistema como tarjeta, que muestra su paleta (el color se copia con un clic), su tipografía, sus reglas, lo que falta revisar y la decisión que tomé.

## Cómo quedaron ordenados

| Decisión | Sistema | Por qué |
|---|---|---|
| Mantener (1) | Garrigues · plantilla corporativa (.pptx) | Es la marca oficial; todo lo de Garrigues se alinea con ella. |
| Mantener (2) | [Gestor · dos mundos](gestor-dos-mundos/) | Funciona y está en uso; falta limpiar alias de una paleta anterior. |
| Unificar (1) | [Garrigues · documentos](garrigues-documentos/) | Hay que llevarlo al verde y la tipografía de la plantilla. |
| Unificar (2) | Garrigues PPTX (antiguo) | Se conserva su estructura con la paleta de la plantilla. |
| Reconstruir | [Personal](personal/) | Existe solo como descripción; hay que volver a escribirlo. |
| Retirados | Foro y Escritorio | Ya no se usan. |

## Qué hay en cada carpeta

- **`garrigues-documentos/`**: generadores de informes en Word (.docx) escritos en Node, con [JSZip](https://stuk.github.io/jszip/). `g2.mjs` es la versión actual: portada con banda verde, separadores de sección, índice automático, tablas con cabecera invertida y semáforo con la palabra escrita. `docx-gen.mjs` es la versión anterior. Los dos necesitan un logotipo en PNG, que no viene en el repositorio.
- **`gestor-dos-mundos/`**: `globals.css` de una app personal, con una familia de colores fríos para el trabajo y otra rosada para lo personal. Usa la tipografía Satoshi, que no viene en el repositorio.
- **`personal/`**: la descripción del subsistema Personal.

## Paletas principales

| Sistema | Colores |
|---|---|
| Garrigues · plantilla | `#004339` `#007665` `#00A07E` `#63C3B0` `#ECECEC` `#494948` · Arial |
| Garrigues · documentos | `#004136` `#2E6B5E` `#E8EFED` `#1A1A1A` · Cambria y Calibri |
| Gestor · dos mundos | `#22201b` `#faf9f6` `#2b5aa0` `#d1477e` · Satoshi |
| Personal | `#FBC1D4` `#1E1E1E` `#FF7EC4` `#C3ABFF` `#FED35B` · Avenir Next y Georgia |

La plantilla corporativa de Garrigues es un archivo interno y no se publica aquí; de ella solo se listan los colores y la tipografía.
