"use strict";

const FilesList = function () {
    const header = document.getElementById('shared_dir');
    const content = document.getElementById('shared_files');

    this.load = url =>
        fetch(url, {method: 'GET'})
            .then(response => response.ok ? Promise.resolve(response) : Promise.reject(response.status))
            .then(response => response.json())
            .catch((status) => status === 403 ? drawErrorRoot() : drawErrorNotFound());

    this.formatURI = uri => encodeURI(decodeURI(uri.replace(/\/{2,}/g, '/')));

    this.formatDate = function (isoDate) {
        const date = new Date(isoDate);
        const full = num => num < 10 ? `0${num}` : num;
        return `${full(date.getDate())}.${full(date.getMonth()+1)}.${date.getFullYear()} ${full(date.getHours())}:${full(date.getMinutes())}`;
    };

    this.formatSize = function (bytes) {
        if (!bytes) return '-';
        else if (bytes >= 1073741824) return `${(bytes/1073741824).toFixed(1)} GB`;
        else if (bytes >= 1048576) return `${(bytes/1048576).toFixed(1)} MB`;
        else if (bytes >= 1024) return `${(bytes/1024).toFixed(1)} kB`;
        else return `${bytes} B`;
    };

    const drawErrorNotFound = function () {
        header.append('Файлы не найдены');
        const text1 = document.createElement('strong');
        const text2 = document.createElement('div');
        text1.innerText = 'К сожалению, указанные файлы не найдены.';
        text2.innerText = 'Возможно мы уже удалили их. Или Вы ввели ошибочный путь к папке.';
        content.append(text1, text2);
    };

    const drawErrorRoot = function () {
        header.append('Нет доступа');
        const text1 = document.createElement('strong');
        const text2 = document.createElement('div');
        text1.innerText = 'Просмотр всего диска Вам недоступен.';
        text2.innerText = 'Перейдите по ссылке, которую я Вам прислала, чтобы получить файлы, предназначенные именно Вам.';
        content.append(text1, text2);
    };
};



const ShowFilesForDownload = function () {
    const pageURI = '/more/files';
    const listURI = '/api/files';
    const fileURI = '/api/download';
    const filesList = new FilesList();

    const init = () => {
        const path = window.location.pathname.replace(new RegExp(`^${pageURI}`), '');
        const url = filesList.formatURI(`${listURI}/${path}`);
        filesList.load(url)
            .then(json => drawFilesList(json, path));
    };

    const drawFilesList = function (json, path) {
        document.getElementById('shared_dir').append('Index of ', decodeURI(path));
        const pre = document.createElement('pre');
        if (path.match(/.+\/.+/)) {
            const link = document.createElement('a');
            link.href = '../';
            link.append('../');
            pre.append(link, '\n');
        }
        json.forEach(item => {
            let href;
            switch (item.type) {
                case 'directory': href = `${item.name}/`; break;
                case 'file': href = `${fileURI}/${path}/${item.name}`; break;
            }
            const link = document.createElement('a');
            link.href = filesList.formatURI(href);
            link.append(item.name, item.type === 'directory' ? '/' : '');
            const size = filesList.formatSize(item.size);
            const separator = '           '.slice(0, -size.length);
            pre.append(link, filesList.formatDate(item.mtime), separator, size, '\n');
        });
        document.getElementById('shared_files').append(pre);
    };

    init();
};



const ShowPhotosForPreview = function () {
    const pageURI = '/more/preview';
    const listURI = '/api/files';
    const viewURI = '/api/preview';
    const filesList = new FilesList();
    const templateCard = document.getElementById('template_photo_card').content;
    let _loadingImages = []; // список фотографий, которые ещё загружаются

    const init = () => {
        const path = window.location.pathname.replace(new RegExp(`^${pageURI}`), '');
        const urlPhotos = filesList.formatURI(`${listURI}/${path}/`);
        const urlThumbs = filesList.formatURI(`${listURI}/${path}/.thumbnails/`);
        filesList.load(urlPhotos)
            .then(jsonFiles => {
                const jsonPhotos = jsonFiles.filter(file => file.type === 'file' && file.name.match(/\.jpg$/i));
                getThumbnails(urlThumbs)
                    .then(jsonThumbs =>
                        drawFilesList(jsonPhotos, jsonThumbs, path)
                    );
            });
    };

    const getThumbnails = url =>
        fetch(url, {method: 'GET'})
            .then(response => response.ok ? response.json() : Promise.resolve([]));

    const drawFilesList = function (jsonPhotos, jsonThumbs, path) {
        if (jsonThumbs.length < jsonPhotos.length) {
            const processing = document.getElementById('template_photo_processing').content.cloneNode(true);
            processing.querySelector('.processed-count').append(jsonThumbs.length);
            processing.querySelector('.processed-total').append(jsonPhotos.length);
            document.getElementById('shared_files').append(processing);
        } else {
            jsonPhotos.forEach(file => {
                const card = templateCard.cloneNode(true);
                card.querySelector('a').href = filesList.formatURI(`${viewURI}/${path}/.thumbnails/${file.name}`);
                card.querySelector('a').dataset.size = '1200x1200';
                const img = card.querySelector('img');
                img.src = filesList.formatURI(`${viewURI}/${path}/.thumbnails/${file.name}`);
                img.addEventListener('load', setImageDimensions);
                _loadingImages.push(img);
                card.querySelector('.preview-photo-card-name').append(file.name.replace(/\.jpg$/i, ''));
                document.getElementById('shared_files').append(card);
            });
            checkForImageDimensions(); // как можно скорее пытаемся прописать размеры фоток для просмотрщика
        }
    };

    // Когда изображение только начало загружаться, браузер уже знает его размеры, но событие никакое не генерит.
    const checkForImageDimensions = () => {
        _loadingImages.forEach(setImageDimensions);
        if (_loadingImages.length) setTimeout(checkForImageDimensions, 500);
    };

    const setImageDimensions = (event) => {
        const img = event.target || event;
        const imgW = img.naturalWidth;
        const imgH = img.naturalHeight;
        if (!imgW || !imgH) return;
        img.parentNode.dataset.size = `${imgW}x${imgH}`;
        _loadingImages = _loadingImages.filter(i => i !== img);
    };

    init();
};
