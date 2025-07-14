   #!/bin/bash

# Definir directorio base CSS
CSS_DIR="./css"

# Crear directorios temporales
mkdir -p $CSS_DIR/temp/{variables,base,components,layout,media_queries,estilos,contacto,duplicados}

# Clasificar las variables CSS
grep -rhoP ":root\s*\{[^}]*\}" $CSS_DIR > $CSS_DIR/temp/variables/variables.css

# Separar media queries
grep -rhoP "@media[^{]*\{[^}]*\}" $CSS_DIR > $CSS_DIR/temp/media_queries/media-queries.css

# Extraer estructura de layout
grep -rhoE '\.(header|footer|sidebar|main|container|row)' $CSS_DIR > $CSS_DIR/temp/layout/layout.css

# Componentes comunes
grep -rhoE '\.(btn|card|modal|menu|dropdown|slider)' $CSS_DIR > $CSS_DIR/temp/components/components.css

# Contacto específico
grep -rhoE 'contacto|\.contacto' $CSS_DIR > $CSS_DIR/temp/contacto/contacto.css

# Estilos generales restantes
grep -rhovP "(:root|@media|\.header|\.footer|\.sidebar|\.main|\.btn|\.card|\.modal|\.menu|\.dropdown|\.slider|contacto|\.contacto)" $CSS_DIR > $CSS_DIR/temp/estilos/estilos.css

# Detectar clases duplicadas
grep -hroE '\.[a-zA-Z0-9_-]+' $CSS_DIR | sort | uniq -d > $CSS_DIR/temp/duplicados/duplicados.txt

# Mensaje final
echo "\n--- Auditoría CSS Completa ---"
echo "Variables exportadas a temp/variables/variables.css"
echo "Media Queries en temp/media_queries/media-queries.css"
echo "Layout en temp/layout/layout.css"
echo "Components en temp/components/components.css"
echo "Estilos generales en temp/estilos/estilos.css"
echo "Estilos Contacto en temp/contacto/contacto.css"
echo "Duplicados listados en temp/duplicados/duplicados.txt"