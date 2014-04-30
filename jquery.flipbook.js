(function($){

$("<style type='text/css'> .flipbook__page--visible{ display: block; } </style>").appendTo("head");

$.fn.flipbook = function(options){

    var settings = $.extend({
        page: 'img',
        speed: 100,
        inline: true,
        autoplay: true,
        wait: true,
        play: '',
        stop: '',
        rewind: '',
        direction: 'forwards',
        startFrom: 1,
        rewindPlay: false
    }, options);

    return this.each(function(i, el){

        // How many pages?
        var totalFrames = $(settings.page, el).length;

        // Starting from:
        if (settings.startFrom > totalFrames) { // If user puts too-high number, default to page 1
            $(settings.page, el).eq(0).addClass('flipbook__page--visible');
        } else {
            $(settings.page, el).eq(settings.startFrom - 1).addClass('flipbook__page--visible');
        }

        // Set inline styles:
        if (settings.inline === true) {
            
            var pageWidth = $(settings.page, el).first().width();
            var pageHeight = $(settings.page, el).first().height();

            $(el).css({
                'position': 'relative',
                'width': pageWidth,
                'height': pageHeight
            });

            $(settings.page, el).css({
                'position': 'absolute',
                'width': '100%',
                'height' : '100%',
                'top': 0,
                'left': 0
            });
        }

        // We'll need this!
        var forwards;

        function swapFrames(direction) {

            // What's the current visible page?
            var n = $(el).find('.flipbook__page--visible').index();

            // If 'backwards', go backwards.
            // Else if 'forwards', or simply if user doesn't correctly enter a string, then forwards!

            if (direction == "backwards") {
                forwards = false;
                if (n === 0 ) { // On the first page?
                    $(el).find('.flipbook__page--visible').hide().removeClass('flipbook__page--visible');
                    $(settings.page, el).last().show().addClass('flipbook__page--visible');
                } else {
                    $(el).find('.flipbook__page--visible').hide().removeClass('flipbook__page--visible').prev().show().addClass('flipbook__page--visible');
                }
            } else {
                forwards = true;
                if (n <= totalFrames-2 ) {
                    $(el).find('.flipbook__page--visible').hide().removeClass('flipbook__page--visible').next().show().addClass('flipbook__page--visible');
                } else { // On the last page?
                    $(el).find('.flipbook__page--visible').hide().removeClass('flipbook__page--visible');
                    $(settings.page, el).first().show().addClass('flipbook__page--visible');
                }
            }   
        }

        // We'll need these.
        var loop;
        var looping = false;

        // Looping mechanism
        function loopThis(direction){
            swapFrames(direction);
            loop = setTimeout(function(){
                loopThis(direction);
            }, settings.speed);
        }

        // Autoplay function. Made it as a var for fun.
        var autoPlay = function(){
            if (settings.autoplay === true) {
                loopThis(settings.direction);
            }
        };

        if (settings.wait === true) {
            $(el).ready(function(){
                autoPlay();
            });
        } else {
            autoPlay();
        }
        
        // Stop the press.
        $(settings.stop).on('click', function(e){
            e.preventDefault();
            clearTimeout(loop);
            looping = false;
        });

        // Play! If 'forwards' is already true or false, take heed!
        // Otherwise, playing hasn't started, so take the user's settings.
        $(settings.play).on('click', function(e){
            e.preventDefault();
            if (!looping) { // Only if it's not playing already.
                if (forwards === true) {
                    loopThis("forwards");
                } else if (forwards === false) {
                    loopThis("backwards");
                } else {
                    loopThis(settings.direction);
                }
                looping = true;
            } else {
                return false;
            }
        });

        $(settings.rewind).on('click', function(e){
            e.preventDefault();
            if (looping) {
                clearTimeout(loop);
                if (forwards) {
                    loopThis("backwards");
                } else {
                    loopThis("forwards");
                }
            }

            // rewindPlay will cause a rewind button to cause a stopped flipbook to start playing
            // (in the reverse direction)
            if (settings.rewindPlay === true) {
                looping = true;
                if (forwards === true || settings.direction == "forwards") {
                    loopThis("backwards");
                } else if (forwards === false || settings.direction == "backwards") {
                    loopThis("forwards");
                }
            }
        });
    });
};

}(jQuery));
