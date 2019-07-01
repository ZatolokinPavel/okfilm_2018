/**
 * Скрипты для всех страниц
 */


/**
 * Открывалка выпадающих меню в главном меню.
 * Открывает и закрывает подменю по наведению и уходу мыши, а также по клику.
 * Закрывает открытые подменю по клику за пределами блока меню.
 * Не круто, что флаг 'unfolded' чаще ставится, чем снимается. Но так проще.
 * А после первого же нажатия вне меню, он снимется.
 */
var mainMenu = function() {
    var unfolded = false,       // есть ли открытые меню
        lock = null;            // блокируем 'click' на короткое время после 'mouseenter'

    var _init = function () {
        var topItems = document.querySelectorAll('#main_menu > ul > li');
        for (var i=0; i < topItems.length; i++) {
            if (topItems[i].getElementsByClassName('submenu').length > 0) {
                topItems[i].addEventListener('click', menuToggler);
                topItems[i].addEventListener('mouseenter', menuToggler);
                topItems[i].addEventListener('mouseleave', menuToggler);
            }
        }
        document.body.addEventListener('click', closingEvent);
        document.body.addEventListener('touchstart', closingEvent);
    };

    var menuToggler = function (evt) {
        switch (evt.type) {
            case 'mouseenter':
                this.classList.add('unfold');
                unfolded = true;
                if (!lock) lock = setTimeout(function() {lock = null;}, 50);
                break;
            case 'mouseleave':
                this.classList.remove('unfold');
                break;
            case 'click':
                if (lock) {unfolded = true; break;}
                var unfold = this.classList.toggle('unfold');
                var prevSibling = this.previousElementSibling;
                var nextSibling = this.nextElementSibling;
                while (prevSibling) {
                    prevSibling.classList.remove('unfold');
                    prevSibling = prevSibling.previousElementSibling;
                }
                while (nextSibling) {
                    nextSibling.classList.remove('unfold');
                    nextSibling = nextSibling.nextElementSibling;
                }
                unfolded = unfold;
                break;
        }
    };

    var closingEvent = function (evt) {
        if (!unfolded) return;                              // если все подменю уже закрыты, то не надо обрабатывать каждое нажатие
        if (closestById(evt.target, 'main_menu')) return;   // если нажатие внутри блока меню, то там сами разберутся
        var topItems = document.querySelectorAll('#main_menu > ul > li');
        for (var i=0; i < topItems.length; i++) {
            topItems[i].classList.remove('unfold');
        }
        unfolded = false;
    };

    var closestById = function (node, id) {
        while (node) {
            if (node.tagName && node.id === id) return node;
            else node = node.parentElement;
        }
        return null;
    };

    _init();
};
mainMenu();



/**
 * Создаёт div#bg_helper_btm, который рисует фон на футере.
 * При прокрутке меняет высоту этого блока от нуля и до
 * максимума, так что он перекрывает собой верхний фон.
 */
var change_page_background = function() {

    var helper_btm,         // этот div отображает фон для футера
        mainContent,        // блок, под которым будет происходить смена фона
        isMainPage,         // это главная страница сайта, или все остальные?
        viewHeight,         // высота видимой области окна
        resizeTimeout;

    var _init = function () {
        createHelperDiv();
        isMainPage = document.body.classList.contains('page-main');
        viewHeight = document.documentElement.clientHeight;
        if (isMainPage) {
            mainContent = document.getElementsByClassName('sec-main-portfolio')[0];
        } else {
            mainContent = document.getElementsByTagName('MAIN')[0];
        }
        bgAdjustment();                                     // приблизительное определение размеров
        window.addEventListener("load", bgAdjustment);      // точное определение размеров
        window.addEventListener("resize", resizeThrottler); // переопределение размеров при изменении размера окна
        document.addEventListener('scroll', bgAdjustment);
    };

    var createHelperDiv = function () {
        var helper_top = document.getElementById('bg_helper');
        helper_btm = document.createElement('DIV');
        helper_btm.id = 'bg_helper_btm';
        helper_top.appendChild(helper_btm);
    };

    var bgAdjustment = function () {
        var rect = mainContent.getBoundingClientRect();
        var limit = rect.top + (rect.bottom - rect.top) / 2;
        var height = viewHeight - limit;
        if (height < 0) height = 0;
        helper_btm.style.height = height + 'px';
    };

    var resizeThrottler = function () {
        if (!resizeTimeout) {                       // ignore resize events as long as an actualResizeHandler execution is in the queue
            resizeTimeout = setTimeout(function() {
                resizeTimeout = null;
                viewHeight = document.documentElement.clientHeight;
                bgAdjustment();                     // The actualResizeHandler will execute at a rate of 5fps
            }, 200);
        }
    };

    _init();
};
change_page_background();



/**
 * Подключение просмотрщика фотографий к галереям фото.
 */
var initPhotoSwipeGallery = function(gallerySelector) {

    var _init = function () {
        var galleryElements = document.querySelectorAll(gallerySelector);
        for (var i=0; i < galleryElements.length; i++) {
            galleryElements[i].addEventListener('click', clickOnPhotoSwipeGallery);
        }

        // Parse URL and open gallery if it contains #&pid=3&gid=1
        var hashData = photoswipeParseHash();
        if(hashData.pid && hashData.gid) {
            var gallery = galleryElements[hashData.gid - 1];
            if (!gallery) return;
            var images = gallery.getElementsByTagName('IMG');
            var currImage = images[hashData.pid - 1];
            if (!currImage) return;
            openPhotoSwipeGallery(images, currImage, true);
        }
    };

    var clickOnPhotoSwipeGallery = function (evt) {
        evt = evt || window.event;
        evt.preventDefault ? evt.preventDefault() : evt.returnValue = false;
        var evtTarget = evt.target || evt.srcElement;
        var currItem = closestByTagName(evtTarget, 'A');    // ищем выбранный элемент галереи, вида <a href="" data-size=""><img src=""></a>
        if (currItem) {
            var gallery = closestByClassName(currItem, 'pswp__gallery');
            var images = gallery.getElementsByTagName('IMG');
            var currImage = currItem.children[0];
            openPhotoSwipeGallery(images, currImage);
        }
    };

    var openPhotoSwipeGallery = function (images, currImage, disableAnimation) {
        var pswpElement = document.getElementById('photoswipe');
        var items = [], firstSlide = 0;
        for (var i=0, j=0; i < images.length; i++) {
            if (!images[i].offsetWidth && !images[i].offsetHeight) continue;    // если изображение не видно, то не включаем его в просмотр
            if (images[i] === currImage) firstSlide = j;
            j++;    // счётчик видимых изображений
            var link = images[i].parentNode;
            var size = link.getAttribute('data-size').split('x');
            items.push({
                src: link.getAttribute('href'),
                // msrc: images[i].getAttribute('src'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10),
                el: images[i]
            });
        }
        var options = {
            index: firstSlide,      // start at first slide
            loop: false
            // getThumbBoundsFn: function(index) {
            //     var thumbnail = items[index].el,
            //         pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
            //         rect = thumbnail.getBoundingClientRect(),
            //         style = window.getComputedStyle(thumbnail, null),
            //         borderTop = parseInt(style.getPropertyValue('border-top-width'), 10),
            //         borderRight = parseInt(style.getPropertyValue('border-right-width'), 10),
            //         borderLeft = parseInt(style.getPropertyValue('border-left-width'), 10);
            //     return {x: rect.left + borderLeft, y: rect.top + borderTop + pageYScroll, w: rect.width - borderRight - borderLeft};
            // }
        };
        if(disableAnimation) {options.showAnimationDuration = 0;}
        var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    var closestByTagName = function (node, tagName) {
        while (node) {
            if (node.tagName && node.tagName.toUpperCase() === tagName) return node;
            else node = node.parentElement;
        }
        return null;
    };

    var closestByClassName = function (node, className) {
        while (node) {
            if (node.classList.contains(className)) return node;
            else node = node.parentElement;
        }
        return null;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
            params = {};

        if(hash.length < 5) return params;

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) continue;
            var pair = vars[i].split('=');
            if(pair.length < 2) continue;
            params[pair[0]] = pair[1];
        }

        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }
        if(params.pid) {
            params.pid = parseInt(params.pid, 10);
        }

        return params;
    };

    _init();
};
initPhotoSwipeGallery('.pswp__gallery');


/**
 * На все ссылки всех галерей навешиваем обработку события наведения и убирания мыши
 */
var gallerySliderOKFilm = function() {

    // Расширение картинки, над которой сейчас курсор, сжатие всех остальных
    var selectSliderElement = function() {
        if (window.matchMedia("(max-width: 768px)").matches) return;
        var li = this.parentNode;
        var ul = li.parentNode;
        var listItems = ul.children;
        var W = (ul.clientWidth / 2 - 345) / 5;
        for (var i=0; i < listItems.length; i++) {
            if (listItems[i] === li) continue;
            listItems[i].style.width = W+'px';
        }
        li.style.width = '345px';
    };

    // Восстановление обычного размера картинок
    var deselectSliderElement = function() {
        if (window.matchMedia("(max-width: 768px)").matches) return;
        var listItems = this.parentNode.parentNode.children;
        for (var i=0; i < listItems.length; i++) {
            listItems[i].style.width = '';
        }
    };

    var sliders = document.querySelectorAll('.gallery_slider a');
    for (var i=0; i < sliders.length; i++) {
        sliders[i].addEventListener('mouseover', selectSliderElement);
        sliders[i].addEventListener('mouseleave', deselectSliderElement);
    }
};
gallerySliderOKFilm();
