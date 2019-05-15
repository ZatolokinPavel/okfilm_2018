/**
 * Скрипты для всех страниц
 */


/**
 * Открывалка выпадающих меню в главном меню.
 * Открывает и закрывает подменю по наведению и уходу мыши, а также по клику.
 * Закрывает открытые подменю по клику за пределами блока меню.
 */
var mainMenu = function() {
    var unfolded = false;       // есть ли открытые меню

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
            case 'mouseenter': this.classList.add('unfold'); break;
            case 'mouseleave': this.classList.remove('unfold'); break;
            case 'click':
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
        if (!unfolded) return;
        if (closestById(evt.target, 'main_menu')) return;
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
 * При прокрутке добавляет к body класс "scrolled", который помогает
 * менять фон для верхней части страницы и футера.
 */
change_page_background();
document.addEventListener('scroll', change_page_background);
function change_page_background() {
    var scrolled = window.pageYOffset || document.documentElement.scrollTop;
    document.getElementById('body').classList.toggle("scrolled", scrolled > 700);
}



/**
 * Подключение просмотрщика фотографий к галереям фото.
 */
var initPhotoSwipeGallery = function(gallerySelector) {

    var _init = function () {
        var galleryElements = document.querySelectorAll(gallerySelector);
        for (var i=0; i < galleryElements.length; i++) {
            galleryElements[i].addEventListener('click', clickOnPhotoSwipeGallery);
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

    var openPhotoSwipeGallery = function (images, currImage) {
        var pswpElement = document.getElementById('photoswipe');
        var items = [], firstSlide = 0;
        for (var i=0; i < images.length; i++) {
            if (images[i] === currImage) firstSlide = i;
            var link = images[i].parentNode;
            var size = link.getAttribute('data-size').split('x');
            items.push({
                src: link.getAttribute('href'),
                msrc: images[i].getAttribute('src'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10),
                el: images[i]
            });
        }
        var options = {
            index: firstSlide,      // start at first slide
            loop: false,
            getThumbBoundsFn: function(index) {
                var thumbnail = items[index].el,
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect(),
                    style = window.getComputedStyle(thumbnail, null),
                    borderTop = parseInt(style.getPropertyValue('border-top-width'), 10),
                    borderRight = parseInt(style.getPropertyValue('border-right-width'), 10),
                    borderLeft = parseInt(style.getPropertyValue('border-left-width'), 10);
                return {x: rect.left + borderLeft, y: rect.top + borderTop + pageYScroll, w: rect.width - borderRight - borderLeft};
            }
        };
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

    _init();
};
initPhotoSwipeGallery('.pswp__gallery');


/**
 * На все ссылки всех галерей навешиваем обработку события наведения и убирания мыши
 */
var gallerySliderOKFilm = function() {

    // Расширение картинки, над которой сейчас курсор, сжатие всех остальных
    var selectSliderElement = function() {
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
