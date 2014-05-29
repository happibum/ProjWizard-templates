var root = null;
var defaultDir = 'Download';
var media = null;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    console.log('deviceready');
    if (media !== null)
        media.release();
}

// Get the file system
function getFileSystem() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
        function (fileSystem) {
            root = fileSystem.root;
            console.log('fileSystem: ' + root.toURL());
            listDownloadDir(root);
        }, function (err) {
            console.error('Failed to get a file system: ' + err.code);
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
                    console.log('Reading \'' + defaultDir + '\' directory...');
                    var downloadReader = entry.createReader();
                    downloadReader.readEntries(
                        appendDownloadFiles,
                        function (err) {
                            console.error('Failed to read \'Download\' entries: ' + err.code);
                        }
                    );
                    break;
                }
            }
        }, function (err) {
            console.error('Failed to read entries: ' + err.code);
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
        if (entry.isFile && /.mp3$/.test(entry.name)) {
            console.debug('Found mp3 file: ' + entry.name);
            dirContent.append('<a href="javascript:void(0);" class="list-group-item" onClick="playFile(this)">' + entry.name + '</a>');
        }
    }
}

function stop() {
    console.log('Stopping media...');
    if (media !== null) {
        media.stop();
        media.release();
    }
}

function playFile(elem) {
    var file = $(elem).text();
    console.log('Playing a file \'' + file + '\'...');
    media = new Media(defaultDir + '/' + file,
        function () { console.log("playAudio():Audio Success"); },
        function (err) { console.error("playAudio():Audio Error: " + err.code); }
    );
    media.play();
}

function vibrate() {
    console.log('vibrate');
    // Vibrate for 3 seconds
    navigator.notification.vibrate(3000);
}

function getPhoto(source) {
    console.log('getPhoto: ' + source);
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onPhotoFail, {
        quality: 50,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: source
    });
}

function onPhotoURISuccess(imageURI) {
    var cameraImage = document.getElementById('cameraImage');
    var $img = $('<img>');
    $img.attr('src', imageURI);
    $img.width('200px');
    $(cameraImage).append($img);
}

function onPhotoFail(message) {
    console.error('Failed to get a photo: ' + message);
}
