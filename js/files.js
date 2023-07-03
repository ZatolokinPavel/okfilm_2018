"use strict";

const DownloadFiles = function () {
    const pageURI = '/more/files';
    const listURI = '/api/files';
    const fileURI = '/api/download';

    const header = document.getElementById('shared_dir');
    const content = document.getElementById('shared_files');

    const init = function () {
        const path = window.location.pathname.replace(new RegExp(`^${pageURI}`), '');
        fetch(formatURI(`${listURI}/${path}`), {method: 'GET'})
            .then(response => response.ok ? Promise.resolve(response) : Promise.reject(response.status))
            .then(response => response.json())
            .then(json => drawFilesList(json, path))
            .catch((status) => status === 403 ? drawErrorRoot() : drawErrorNotFound());
    };

    const drawFilesList = function (json, path) {
        header.append('Index of ', decodeURI(path));
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
            link.href = formatURI(href);
            link.append(item.name, item.type === 'directory' ? '/' : '');
            const size = formatSize(item.size);
            const separator = '           '.slice(0, -size.length);
            pre.append(link, formatDate(item.mtime), separator, size, '\n');
        });
        content.append(pre);
    };

    const formatURI = uri => encodeURI(decodeURI(uri.replace(/\/{2,}/g, '/')));

    const formatDate = function (isoDate) {
        const date = new Date(isoDate);
        const full = num => num < 10 ? `0${num}` : num;
        return `${full(date.getDate())}.${full(date.getMonth()+1)}.${date.getFullYear()} ${full(date.getHours())}:${full(date.getMinutes())}`;
    };

    const formatSize = function (bytes) {
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
        text1.innerText = 'Просмотр всех файлов Вам недоступен.';
        text2.innerText = 'Перейдите по ссылке, которую я Вам прислала, чтобы скачать файлы, предназначенные именно Вам.';
        content.append(text1, text2);
    };

    init();
};

new DownloadFiles();
