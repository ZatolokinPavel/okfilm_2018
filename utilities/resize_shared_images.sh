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

while IFS= read -r -d '' file
do
    [[ "$file" =~ /\.thumbnails/[^/]+$ ]] && continue # пропускаем все уже созданные миниатюры
    mkdir -p "$(dirname "$file")/.thumbnails/"
    [[ -f "$(dirname "$file")/.thumbnails/$(basename "$file")" ]] && continue # миниатюра уже создана
    convert "$file" -resize '1200x1200' "$(dirname "$file")/.thumbnails/$(basename "$file")"
    sleep 2s
done <   <(find /srv/shared-global/test/ -type f -iname '*.jpg' -print0)