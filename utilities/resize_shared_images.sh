#! /bin/bash

# Скрипт для создания миниатюр фоток в папке shared-global, чтобы их удобно было просматривать с сайта.
# Используется для раздела preview сайта. Оксана заливает на диск фотки высокого разрешения, а клиентам
# будут показаны сжатые фортки. Чтобы и Оксане не приходилось сжимать фотки вручную и клиентам не грузить
# сотни мегабайт с сайта.
# Для работы требует установленого пакета ImageMagick

script_name=$(basename -- "$0")

if pidof -x "$script_name" -o $$ >/dev/null; then
    echo "An another instance of script $script_name is already running"
    exit 1
fi

# Создаём временный файл со списком уже существующих миниатюр
temp_thumbnails_file=$(mktemp)
find /srv/shared-global/ -path '*/.thumbnails/*' -type f -iname '*.jpg' -print0 > "$temp_thumbnails_file"

while IFS= read -r -d '' file
do
    thumbnail_path="$(dirname "$file")/.thumbnails/$(basename "$file")"
    grep -qs --null-data "$thumbnail_path" "$temp_thumbnails_file" && continue # миниатюра уже создана
    mkdir -p "$(dirname "$file")/.thumbnails/"
    convert "$file" -resize '1200x1200' "$thumbnail_path"
    sleep 2s
done <   <(find /srv/shared-global/ -path '*/.thumbnails' -prune -o -type f -iname '*.jpg' -print0)

rm "$temp_thumbnails_file"

# Здесь параметры для команды find:
# -path '*/.thumbnails' -prune  не будет спускаться в директории .thumbnails
# -o                            ИЛИ
# -type f -iname '*.jpg'        ищет только файлы *.jpg
