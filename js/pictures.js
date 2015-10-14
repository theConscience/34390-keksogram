(function() {
    var filtersMenu = document.querySelector('.filters');
    filtersMenu.classList.add('hidden');
    var pictureTemplate = document.getElementById('picture-template');
    var picturesContainer = document.getElementsByClassName('pictures')[0];
    var picturesFragment = document.createDocumentFragment();

    function supportsTemplate() {
        return 'content' in document.createElement('template');
    }

    /*for (var i = 0, l = pictures.length; i < l; i++) {

    }*/

    var IMAGE_FAILURE_TIMEOUT = 10000;

    pictures.forEach(function(picture, i) {
        console.log(picture, i);
        if (supportsTemplate()) {
            var newPictureElement = pictureTemplate.content.children[0].cloneNode(true);
            newPictureElement.querySelector('.picture-likes').textContent = picture['likes'];
            newPictureElement.querySelector('.picture-comments').textContent = picture['comments'];
            newPictureElement.querySelector('.picture img').src = picture['url'];
        } else {
            var newPictureElement = pictureTemplate.innerHTML;
            // дописать код для старых браузеров
        }

        picturesFragment.appendChild(newPictureElement);

        var newPicture = new Image();
        newPicture.src = picture['url'];

        var imageLoadTimeout = setTimeout(function() {
            newPictureElement.classList.add('picture-load-failure');
        }, IMAGE_FAILURE_TIMEOUT)

        newPicture.onload = function() {
            newPicture.style.height = '182px';
            newPicture.style.width = '182px';
            var oldPicture = newPictureElement.querySelector('.picture img');
            clearTimeout(imageLoadTimeout);
            newPictureElement.replaceChild(newPicture, oldPicture);
        }

        newPicture.onerror = function() {
            newPictureElement.classList.add('picture-load-failure');
        }

    });

    picturesContainer.appendChild(picturesFragment);
    filtersMenu.classList.remove('hidden');
})();