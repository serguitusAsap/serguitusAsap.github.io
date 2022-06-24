let known = {
    1: {
        imginfo: "4273/floodplain-dirty.mp4",
        loadingRatio: "75.29411764705883%",
        left: ["4273/floodplain-dirty.mp4", "4273/floodplain-dirty.webm"],
        right: [
            [
                ["4273/floodplain-dirty.mp4", "4273/floodplain-dirty.webm"],
                "H265",
                "H265",
            ],
            ["DIVIDER"],
            [
                ["4273/floodplain-clean.mp4", "4273/floodplain-clean.webm"],
                "AV1",
                "AV1",
            ],
        ],
        thumb: "4273/dirty.jpg",
    },
    2: {
        imginfo: "4273/floodplain-clean.mp4",
        loadingRatio: "75.29411764705883%",
        left: ["4273/floodplain-clean.mp4", "4273/floodplain-clean.webm"],
        right: [
            [
                ["4273/floodplain-clean.mp4", "4273/floodplain-clean.webm"],
                "H265",
                "H265",
            ],
            ["DIVIDER"],
            [
                ["4273/floodplain-dirty.mp4", "4273/floodplain-dirty.webm"],
                "AV1",
                "AV1",
            ],
        ],
        thumb: "4273/clean.jpg",
    },
};

/// INPUT_DATA_END

let PREFIX = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/";
//"https://wo-public.s3.us-west-2.amazonaws.com/demo_videos/";
let order = ['1', '2'];
let captionTypeToIndex = { 'bpp': 1, 'bytes': 2 };
let captionIndex = captionTypeToIndex['bytes'];
let currentImage = null;

$(document).ready(function() {
    $('input[type=radio][name=bpp-bytes-radio]').change(function() {
        captionIndex = captionTypeToIndex[this.value];
        showImgAndUpdateUI(currentImage);
    });


    // NOT NEEDEED ANYMORE
    // $('#toggle-aff-fa-footnote').on('click', function(e) {
    //     $('#footnote-aff-fa').toggle();
    //     $('#footnote-aff-mi').hide();
    // });
    // $('#toggle-aff-mi-footnote').on('click', function(e) {
    //     $('#footnote-aff-mi').toggle();
    //     $('#footnote-aff-fa').hide();
    // });
    // $("#view-full-res").hover(
    //     function() {
    //         let title = $(this).attr("data-title");
    //         $('<div/>', {
    //             text: title,
    //             class: 'overlay-box'
    //         }).appendTo(this);
    //     },
    //     function() {
    //         $(document).find("div.overlay-box").remove();
    //     }
    // );
    // UP TO HERE NOT NEEDED ANYMORE



    // Add the img tags.
    $("#right-imgs").append($("<img>"));
    $("#left-img").append($("<img>", { "id": "left" }));
    // Setup slider and load first image.
    let firstImageIndex = 1
        // if ($(".comparison-slider")[0]) {
        //     let compSlider = $(".comparison-slider");
        //     compSlider.each(function() {
        //         let compSliderWidth = $(this).width() + "px";
        //         $(this).find(".resize img").css({ width: compSliderWidth });
        //         drags($(this).find(".divider"), $(this).find(".resize"), $(this));
        //     });
        //     $(window).on("resize", function() {
        //         let compSliderWidth = compSlider.width() + "px";
        //         compSlider.find(".resize img").css({ width: compSliderWidth });
        //     });
        // }
    $('.image-selector').empty();
    order.forEach(function(v, index) {
        let thumbID = "img-sel-" + index.toString();
        let img =
            $('<img>', {
                'id': "img-sel-" + index.toString(),
                'class': "thumb" + (index === firstImageIndex ? " thumb-active" : "") + " " + thumbID,
                'src': PREFIX + known[v]['thumb']
            });
        img.on('click', function(e) {
            let selectedThumb = e.target;
            let selectedThumbClasses = '.' + selectedThumb.className.split(' ').join('.');
            $('.thumb.thumb-active').removeClass('thumb-active');
            $(selectedThumbClasses).addClass('thumb-active');
            $(selectedThumb).addClass('thumb-active');
            let imgSelId = selectedThumb.id;
            let index = parseInt(imgSelId.replace("img-sel-", ""));
            console.log(index);
            let imgName = order[index];
            showImgAndUpdateUI(imgName);
        });
        $('.image-selector').append(img);
    });
    showImgAndUpdateUI(order[firstImageIndex]);

    // ******** VIDEO STUFF ********************************
    var requestAnimationFrame =
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;

    var dragging = false;

    function trackLocation(e) {
        if (dragging) {
            var rect = videoContainer.getBoundingClientRect(),
                position =
                ((e.pageX - rect.left) / videoContainer.offsetWidth) * 100;
            if (position <= 100) {
                videoClipper.style.width = position + "%";
                clippedVideo.style.width = (100 / position) * 100 + "%";
                clippedVideo.style.zIndex = 3;
                divider.style.left = position + "%";
            }
        }
    }

    function enableDrag(e) {
        dragging = true;
    }

    function disableDrag(e) {
        dragging = false;
    }

    var videoContainer = document.getElementById("video-compare-container"),
        videoClipper = document.getElementById("video-clipper"),
        clippedVideo = videoClipper.getElementsByTagName("video")[0],
        divider = document.getElementsByClassName("divider")[0];
    videoContainer.addEventListener("mousemove", trackLocation, false);
    divider.addEventListener("mousedown", enableDrag, false);
    divider.addEventListener("mouseup", disableDrag, false);
    videoContainer.addEventListener("touchstart", trackLocation, false);
    videoContainer.addEventListener("touchmove", trackLocation, false);

    // video widgets
    let videoWidgets = document.getElementsByClassName("video-widget");
    let videoL = document.getElementById("video-left");
    let videoR = document.getElementById("video-right");
    let backBtn = document.getElementById("backBtn");
    let playBtn = document.getElementById("playBtn");
    let playIcon = document.getElementById("playIcon");
    let forwardBtn = document.getElementById("forwardBtn");
    let frameTime = 1 / 25; //fps = 25

    videoL.addEventListener("seeked", () => {
        window.requestAnimationFrame(seek);
    });

    videoL.addEventListener("play", function() {
        videoR.play();
        seek();
    });

    videoL.addEventListener("pause", function() {
        videoR.pause();
        seek();
    });

    playBtn.onclick = function() {
        if (videoL.paused) {
            videoL.play();
            playIcon.setAttribute("class", "bi bi-pause");
        } else {
            videoL.pause();
            playIcon.setAttribute("class", "bi bi-play");
        }
    };

    backBtn.onclick = function() {
        for (video of videoWidgets) {
            video.pause();
        }
        for (video of videoWidgets) {
            video.currentTime = Math.max(0, video.currentTime - frameTime);
        }
    };

    forwardBtn.onclick = function() {
        for (video of videoWidgets) {
            video.pause();
        }
        for (video of videoWidgets) {
            video.currentTime = Math.min(
                video.duration,
                video.currentTime + frameTime
            );
        }
    };
});

function showDividerInfo() {
    $('.divider-info').text('Drag Slider to Compare');
}

function seek() {
    let video1 = document.getElementById("video-left");
    let video2 = document.getElementById("video-right");
    video2.currentTime = video1.currentTime;
    console.log("seek called");
}

function replaceVideo(videoObj, videoList, thumb) {
    videoObj[0].poster = PREFIX + thumb;
    videoObj.empty();
    for (video of videoList) {
        let source = $("<source>", {
            src: PREFIX + video,
        });
        videoObj.append(source);
    }
    videoObj[0].load();
    // and sync videos
    seek();
}

function showLeftVideo(videos, imgInfo, loadingRatio, thumb) {
    console.log('Showing left', videos[0]);
    //let imgName = img[0];
    let img_caption = videos[captionIndex];
    $('#left-info-button').text(img_caption);
    $('#img-info-button').text(imgInfo);
    //let leftImg = $('#left')[0];
    //let showing = leftImg.src.split('/').reverse()[0];
    let videoLObj = $("#video-left");
    let videoL = videoLObj[0];
    let showing = videoL.poster.split("/").reverse()[0];
    //let loadingPlaceholder = $('#loading-placeholder');
    if (showing === thumb) {
        console.log('Left already on', thumb);
        return;
    }
    //leftImg.src = PREFIX + imgName;
    replaceVideo(videoLObj, videos, thumb)

    // ... and load corresponding right videos
    let videoRObj = $("#video-right");
    replaceVideo(videoRObj, videos, thumb);
}

function showRights(imgName, imgs, thumb) {
    let videoRObj = $('#video-right');
    if (videoRObj.data('option') === thumb) {
        console.log("Right video already on ", thumb);
        return;
    }
    let rightSelector = $(".right-selector")[0];
    $(rightSelector).empty();
    videoRObj.empty();
    videoRObj.attr("data-option", thumb);
    let first = imgs[0];
    replaceVideo(videoRObj, first[0], thumb);

    // building the menu...
    let buttonGroupDiv = $("<div>", { 'class': 'btn-group-vertical btn-group-sm', 'role': 'group' });
    $(rightSelector).append(buttonGroupDiv);
    imgs.forEach(function(item, index) {
        let cls = ["btn", "float-right", "right-sel-button"];
        if (index === 0) {
            cls.push('btn-dark');
            cls.push('active');
        } else {
            cls.push('btn-light');
        }
        cls.push('btn-block');
        let imgName = item[0];
        if (imgName === 'DIVIDER') {
            $(buttonGroupDiv).append($("<button>", {
                "type": "button",
                "class": cls.join(" ")
            }).prop("disabled", true).text(" "));
            return;
        }
        let caption = item[captionIndex];
        caption = caption.replace('x', '\u00D7');
        //let imgTag = $("<img>", { 'src': PREFIX + imgName, 'id': 'right-img-' + index.toString() });
        //if (index !== 0) {
        //    $(imgTag).hide();
        //}
        //$(rightsDiv).append(imgTag);
        let caption_pre = caption.split('(')[0];
        let caption_post = caption.split('(')[1];
        let button = $("<button>", {
            "type": "button",
            "class": cls.join(" "),
            "id": 'right-btn-idx-' + index.toString()
        }).text(caption_pre);
        // if (caption_post) { // Not for original
        //     let span = $('<span>', { 'class': 'codec-info' }).text('(' + caption_post);
        //     button.append(span);
        // }
        button.on("click", function(e) {
            let oldActiveButton = $(".right-sel-button.active")[0];
            let oldIndex = oldActiveButton.id.replace('right-btn-idx-', '');
            let newActiveButton = e.target;
            if ($(newActiveButton).hasClass('codec-info')) {
                newActiveButton = $(newActiveButton).parent();
            }
            let newIndex = index.toString();
            if (oldIndex === newIndex) {
                console.log('Already selected!');
                return;
            }
            /// Switch images
            replaceVideo(videoRObj, item[0], thumb);
            // $('#right-img-' + newIndex).show();
            // $('#right-img-' + oldIndex).hide();

            /// First disable old button
            $(oldActiveButton).removeClass('active');
            $(oldActiveButton).removeClass('btn-dark');
            $(oldActiveButton).addClass('btn-light');
            /// Set new button
            $(newActiveButton).addClass('active');
            $(newActiveButton).removeClass('btn-light');
            $(newActiveButton).addClass('btn-dark');
            console.log(e.target);

            let compSlider = $(".comparison-slider");
            let selectorWidth = parseFloat($(".right-selector").css("width"));
            let divider = $(compSlider).find(".divider");
            let parentWidth = parseFloat(divider.parent().css("width"));
            let dividerPos = parseFloat(divider.css("left"));
            let dividerOverlapsSelector = dividerPos > (parentWidth - selectorWidth);
            if (dividerOverlapsSelector) {
                let nonOverlapPos = parentWidth - selectorWidth - 30;
                console.log(divider.css("left"), selectorWidth);
                let resizer = $(compSlider).find(".resize");
                divider.css("left", nonOverlapPos);
                resizer.css("width", nonOverlapPos);
            }
        });
        $(buttonGroupDiv).append(button);
    });
}

function showImgAndUpdateUI(imgName) {
    currentImage = imgName;
    console.log('Showing', imgName);
    let imgs = known[imgName];
    let right = imgs['right'];
    showLeftVideo(imgs['left'], imgs['imginfo'], imgs['loadingRatio'], imgs['thumb']);
    showRights(imgName, right, imgs['thumb']);
}


function drags(dragElement, resizeElement, container) {
    let touched = false;
    window.addEventListener('touchstart', function() { touched = true; });
    window.addEventListener('touchend', function() { touched = false; });
    let dividerInfo = $('.divider-info');
    dragElement.on("mousedown touchstart", function(e) {
        dividerInfo.hide();
        dragElement.addClass("draggable");
        resizeElement.addClass("resizable");
        let startX = e.pageX ? e.pageX : e.originalEvent.touches[0].pageX;
        let dragWidth = dragElement.outerWidth();
        let posX = dragElement.offset().left + dragWidth - startX;
        let containerOffset = container.offset().left;
        let containerWidth = container.outerWidth();
        let minLeft = containerOffset + 10;
        let maxLeft = containerOffset + containerWidth - dragWidth - 10;
        dragElement.parents().on("mousemove touchmove", function(e) {
            if (touched === false) { e.preventDefault(); } // Prevent selection.
            let moveX = e.pageX ? e.pageX : e.originalEvent.touches[0].pageX;
            let leftValue = moveX + posX - dragWidth;
            leftValue = Math.min(Math.max(leftValue, minLeft), maxLeft); // Clip
            let widthValue = ((leftValue + dragWidth / 2 - containerOffset) / containerWidth * 100) + "%";
            $(".draggable").css("left", widthValue).on("mouseup touchend touchcancel", function() {
                $(this).removeClass("draggable");
                resizeElement.removeClass("resizable");
            });
            $(".resizable").css("width", widthValue);
        }).on("mouseup touchend touchcancel", function() {
            dragElement.removeClass("draggable");
            resizeElement.removeClass("resizable");
        });
    }).on("mouseup touchend touchcancel", function(e) {
        dragElement.removeClass("draggable");
        resizeElement.removeClass("resizable");
    });
}

// VIDEO SCRIPTS ---------------------------
window.addEventListener("load", function() {
    // var requestAnimationFrame =
    //     window.requestAnimationFrame ||
    //     window.mozRequestAnimationFrame ||
    //     window.webkitRequestAnimationFrame ||
    //     window.msRequestAnimationFrame;
    // window.requestAnimationFrame = requestAnimationFrame;

    // var dragging = false;

    // function trackLocation(e) {
    //     if (dragging) {
    //         var rect = videoContainer.getBoundingClientRect(),
    //             position =
    //             ((e.pageX - rect.left) / videoContainer.offsetWidth) * 100;
    //         if (position <= 100) {
    //             videoClipper.style.width = position + "%";
    //             clippedVideo.style.width = (100 / position) * 100 + "%";
    //             clippedVideo.style.zIndex = 3;
    //             divider.style.left = position + "%";
    //         }
    //     }
    // }

    // function enableDrag(e) {
    //     dragging = true;
    // }

    // function disableDrag(e) {
    //     dragging = false;
    // }

    // var videoContainer = document.getElementById("video-compare-container"),
    //     videoClipper = document.getElementById("video-clipper"),
    //     clippedVideo = videoClipper.getElementsByTagName("video")[0],
    //     divider = document.getElementsByClassName("divider")[0];
    // videoContainer.addEventListener("mousemove", trackLocation, false);
    // divider.addEventListener("mousedown", enableDrag, false);
    // divider.addEventListener("mouseup", disableDrag, false);
    // videoContainer.addEventListener("touchstart", trackLocation, false);
    // videoContainer.addEventListener("touchmove", trackLocation, false);

    // // video widgets
    // let videoWidgets = document.getElementsByClassName("video-widget");
    // let videoL = document.getElementById("video-left");
    // let videoR = document.getElementById("video-right");
    // let backBtn = document.getElementById("backBtn");
    // let playBtn = document.getElementById("playBtn");
    // let playIcon = document.getElementById("playIcon");
    // let forwardBtn = document.getElementById("forwardBtn");
    // let frameTime = 1 / 25; //fps = 25

    // function seek() {
    //     videoR.currentTime = videoL.currentTime;
    // }

    // videoL.addEventListener("seeked", () => {
    //     window.requestAnimationFrame(seek);
    // });

    // videoL.addEventListener("play", function() {
    //     videoR.play();
    //     seek();
    // });

    // videoL.addEventListener("pause", function() {
    //     videoR.pause();
    //     seek();
    // });

    // playBtn.onclick = function() {
    //     if (videoL.paused) {
    //         videoL.play();
    //         playIcon.setAttribute("class", "bi bi-pause");
    //     } else {
    //         videoL.pause();
    //         playIcon.setAttribute("class", "bi bi-play");
    //     }
    // };

    // backBtn.onclick = function() {
    //     for (video of videoWidgets) {
    //         video.pause();
    //     }
    //     for (video of videoWidgets) {
    //         video.currentTime = Math.max(0, video.currentTime - frameTime);
    //     }
    // };

    // forwardBtn.onclick = function() {
    //     for (video of videoWidgets) {
    //         video.pause();
    //     }
    //     for (video of videoWidgets) {
    //         video.currentTime = Math.min(
    //             video.duration,
    //             video.currentTime + frameTime
    //         );
    //     }
    // };
});