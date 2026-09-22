# Tablero de plantillas

`index.html` es un tablero interactivo con los 14 tipos de documento: qué es cada uno, sus campos obligatorios, el ejemplo JSON completo, el esqueleto con corchetes para partir, el comando que lo genera y una vista previa del resultado. Más abajo, los bloques de contenido, los tokens y las reglas.

Se abre directo en el navegador, sin servidor: doble clic en `index.html`. Sin internet se ve igual: usa Cambria y Calibri si están en el computador, y Source Serif y Source Sans de Google Fonts solo donde no estén.

## Cómo se mantiene solo

Los datos no se editan acá. Al hacer push a `main` con un cambio en `tipos/`, `ejemplos/` o `base.mjs`, la acción de GitHub `.github/workflows/previews.yml` genera los 14 documentos, los pasa a PDF, saca las vistas previas y regenera `datos.js`, y lo commitea. No hace falta LibreOffice ni poppler en ningún computador. También se puede lanzar a mano desde la pestaña Actions (Run workflow).

## A mano, si se quiere

```bash
node plantillas/tablero/construir.mjs   # solo datos.js (determinista: no ensucia el repo si nada cambió)
bash plantillas/tablero/previews.sh     # también las vistas previas; necesita soffice y pdftoppm
```
