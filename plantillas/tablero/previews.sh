#!/usr/bin/env bash
# Vistas previas del tablero: genera los 14 ejemplos, los pasa a PDF con LibreOffice
# y saca la página 1 (y la 3 en los que tienen portada) como JPEG.
# Requiere: node, soffice (LibreOffice) y pdftoppm/pdfinfo (poppler).
#   bash plantillas/tablero/previews.sh
set -euo pipefail
RAIZ="$(cd "$(dirname "$0")/../.." && pwd)"
SALIDA="$RAIZ/plantillas/salida"
PDF="$RAIZ/plantillas/salida-pdf"
PREV="$RAIZ/plantillas/tablero/previews"

cd "$RAIZ"
node plantillas/generar.mjs --todos
rm -rf "$PDF"; mkdir -p "$PDF" "$PREV"
soffice --headless --convert-to pdf --outdir "$PDF" "$SALIDA"/*.docx >/dev/null

echo "{" > "$PREV/paginas.json"
primero=1
for f in "$PDF"/*.pdf; do
  tipo="$(basename "$f" .pdf)"
  n="$(pdfinfo "$f" | awk '/^Pages/{print $2}')"
  [ $primero = 1 ] || echo "," >> "$PREV/paginas.json"
  printf '  "%s": %s' "$tipo" "$n" >> "$PREV/paginas.json"
  primero=0
  rm -f "$PREV/$tipo"-*.jpg
  pdftoppm -r 72 -jpeg -jpegopt quality=82 -f 1 -l 1 "$f" "$PREV/$tipo"
  # Los que abren con portada: también la primera página de contenido.
  case "$tipo" in informe|due-diligence) pdftoppm -r 72 -jpeg -jpegopt quality=82 -f 3 -l 3 "$f" "$PREV/$tipo" ;; esac
done
echo "" >> "$PREV/paginas.json"; echo "}" >> "$PREV/paginas.json"
# pdftoppm numera con ceros a la izquierda según el total de páginas: normalizar a tipo-N.jpg
for j in "$PREV"/*.jpg; do
  base="$(basename "$j" .jpg)"; tipo="${base%-*}"; num="${base##*-}"; num="$((10#$num))"
  [ "$j" = "$PREV/$tipo-$num.jpg" ] || mv "$j" "$PREV/$tipo-$num.jpg"
done
node plantillas/tablero/construir.mjs
du -sh "$PREV" | awk '{print "previews: " $1}'
