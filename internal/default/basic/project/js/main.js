var root = null;
var defaultDir = 'Download';
var media = null;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    if (media !== null)
        media.release();
}

// Get the file system
function getFileSystem() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
        function (fileSystem) {
            root = fileSystem.root;
            listDownloadDir(root);
        }, function (err) {
            alert('Failed to get a file system: ' + err.code);
        }
    );
}

function listDownloadDir(directoryEntry) {
    if (!directoryEntry.isDirectory)
        return;

    var dirReader = directoryEntry.createReader();
    dirReader.readEntries(
        function (entries) {
            for (var i = 0; i < entries.length; i++) {
                var entry = entries[i];
                if (defaultDir === entry.name) {
                    var downloadReader = entry.createReader();
                    downloadReader.readEntries(
                        appendDownloadFiles,
                        function (err) {
                            alert('Failed to read \'Download\' entries: ' + err.code);
                        }
                    );
                    break;
                }
            }
        }, function (err) {
            alert('Failed to read entries: ' + err.code);
        }
    );
}

function listFiles() {
    getFileSystem();
}

function appendDownloadFiles(entries) {
    var dirContent = $('#dirContent');
    dirContent.empty();
    for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        if (entry.isFile) {
            dirContent.append('<a href="javascript:void(0);" class="list-group-item" onClick="playFile(this)">' + entry.name + '</a>');
        }
    }
}

function stop() {
    if (media !== null) {
        media.stop();
        media.release();
    }
}

function playFile(e) {
    var file = $(e).text();
    media = new Media(defaultDir + '/' + file,
        function () { console.log("playAudio():Audio Success"); },
        function (err) { alert("playAudio():Audio Error: " + err.code); }
    );
    media.play();
}

function vibrate() {
    // Vibrate for 3 seconds
    navigator.notification.vibrate(3000);
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
    alert('Failed: ' + message);
}
