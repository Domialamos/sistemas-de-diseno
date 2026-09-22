# Tablero de plantillas

`index.html` es un tablero interactivo con los 14 tipos de documento: qué es cada uno, sus campos obligatorios, el ejemplo JSON completo, el esqueleto con corchetes para partir, el comando que lo genera y una vista previa del resultado. Más abajo, los bloques de contenido, los tokens y las reglas.

Se abre directo en el navegador, sin servidor: doble clic en `index.html`.

## Mantenerlo al día

Los datos no se editan acá. Se regeneran desde la fuente (`tipos/` y `ejemplos/`):

```bash
node plantillas/tablero/construir.mjs   # solo datos.js
bash plantillas/tablero/previews.sh     # también las vistas previas (LibreOffice + poppler)
```

Al agregar o cambiar un tipo, correr el segundo y commitear `datos.js` y `previews/`.
