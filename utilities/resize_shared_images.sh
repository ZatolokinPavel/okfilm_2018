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

while IFS= read -r -d '' folder
do
    # Кешируем имена имеющихся миниатюр в текущем каталоге
    find "$folder/.thumbnails/" -maxdepth 1 -type f -printf '%f\0' 2>/dev/null > "$temp_thumbnails_file"
    # Если надо, создаём миниатюры для каждого файла в текущем каталоге
    while IFS= read -r -d '' file
    do
        grep -qs --null-data "$file" "$temp_thumbnails_file" && continue # миниатюра уже создана
        mkdir -p "$folder/.thumbnails/"
        convert "$folder/$file" -resize '1200x1200' "$folder/.thumbnails/$file"
        sleep 2s
    done <   <(find "$folder" -maxdepth 1 -type f -iname '*.jpg' -printf '%f\0')
done <   <(find /srv/shared-global/* -path '*/.thumbnails' -prune -o -type d -print0)

rm "$temp_thumbnails_file"

# Здесь параметры для команды find:
# -path '*/.thumbnails' -prune  не будет спускаться в директории .thumbnails
# -o                            ИЛИ
# -type f -iname '*.jpg'        ищет только файлы *.jpg
# -printf '%f\0'                возвращает только имя файла и нулевой байт после него (будет разделителем)
# 2>/dev/null                   подавляем ошибки "Нет такого файла или каталога", так как .thumbnails может ещё не быть
