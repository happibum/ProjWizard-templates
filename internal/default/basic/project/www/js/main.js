document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
}

function vibrate() {
    navigator.notification.vibrate(2500);
}

function getPhoto(source) {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {
        quality: 50,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: source
    });
}

function onPhotoURISuccess(imageURI) {
    var cameraImage = document.getElementById('cameraImage');
    cameraImage.style.display = 'block';
    cameraImage.src = imageURI;
}

function onFail(message) {
    alert('Failed because: ' + message);
}
