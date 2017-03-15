function getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
}

function isImage(filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
        case 'jpg':
        case 'gif':
        case 'bmp':
        case 'png':
            //etc
            return true;e
    }
    return false;
}

function isVideo(filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
        case 'm4v':
        case 'avi':
        case 'mpg':
        case 'mp4':
        case 'mov':
            // etc
            return true;
    }
    return false;
}

$(function() {
    $('form').submit(function() {
        function failValidation(msg) {
            alert(msg); // just an alert for now but you can spice this up later
            return false;
        };

        var file = $('#file');
        var imageChosen = $('#type-1').is(':checked');
        if (imageChosen && !isImage(file.val())) {
            return failValidation('Please select a valid image');
        } else if (!imageChosen && !isVideo(file.val())) {
            return failValidation('Please select a valid video file.');
        } else if (imageChosen && isImage(file.val()))  {
            console.log('going to send the photo file on through');
            // return false
            $.ajax({
                    type: 'POST',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    url: '/save_video',
                    success: function(data) {
                        console.log('success');
                        console.log(JSON.stringify(data));
                    }
                });
        } else if (!imageChosen && isVideo(file.val())) {
            console.log('going to send the photo file on through');
            // return false
            $.ajax({
                    type: 'POST',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    url: '/save_pic',
                    success: function(data) {
                        console.log('success');
                        console.log(JSON.stringify(data));
                    }
                });
        }

    });

});
