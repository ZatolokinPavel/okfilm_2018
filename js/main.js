(function preparePhotoSwipeGallery() {
    var allGallerys = document.getElementsByClassName('pswp__gallery');
    for (var i=0; i < allGallerys.length; i++) {
        allGallerys[i].addEventListener('click', function (evt) {
            if (evt.target.tagName === 'IMG') {
                var gallery = evt.currentTarget;
                var currentImage = evt.target;
                var allImages = gallery.getElementsByTagName('IMG');
                openPhotoSwipeGallery(allImages, currentImage);
            }
        });
    }
})();

function openPhotoSwipeGallery(allImages, currentImage) {
    var pswpElement = document.getElementById('photoswipe');
    console.log(allImages);
    var items = [
        {src: 'https://placekitten.com/600/400', w: 600, h: 400},
        {
            src: 'https://placekitten.com/1200/900',
            w: 1200,
            h: 900
        }
    ];
    var options = {
        index: 0 // start at first slide
    };
    var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
}
