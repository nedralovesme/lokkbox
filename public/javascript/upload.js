function getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
}

function isImage(filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
        case 'jpeg':
        case 'jpg':
        case 'gif':
        case 'bmp':
        case 'png':
            //etc
            return true;
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
    $('form').submit(function(event) {
        event.preventDefault();
        function failValidation(msg) {
            alert(msg);
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
            var data = new FormData();
            jQuery.each(jQuery('#file')[0].files, function(i, file) {
                data.append('upl', file);
            });
            $.ajax({
                    type: 'POST',
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    url: '/save_pic',
                    success: function(data) {
                        console.log(JSON.stringify(data));
                        console.log("SUCCESS");
                    }
                });
        } else if (!imageChosen && isVideo(file.val())) {
            console.log('going to send the video file on through');
            var data = new FormData();
            jQuery.each(jQuery('#file')[0].files, function(i, file) {
                data.append('upl', file);
            });
            $.ajax({
                    type: 'POST',
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    url: '/save_video',
                    success: function(data) {
                        console.log(JSON.stringify(data));
                    }
                });

        };
    });
});
