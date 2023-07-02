"use strict";

const DownloadFiles = function () {

    const init = function () {
        const path = window.location.pathname.replace(/^\/more\/files/, '');
        fetch('/files/json/'+path, {method: 'GET'})
            .then(response => response.ok ? response : Promise.reject(response.status+' '+response.statusText))
            .then(response => response.json())
            .then(json => drawFilesList(json))
            .catch(error => {
                console.log(error);
            });
    };

    const drawFilesList = function (json) {
        console.log('flist', json);
        const list = document.getElementById('shared_files');
        json.forEach(item => {
            const link = document.createElement('a');
            link.href = item.name;
            link.append(item.name);
            list.append(link, item.mtime);
        });
    };

    init();
};

new DownloadFiles();
