window.addEventListener("load", function() {

    var dragging = false;

    function trackLocation(e) {
        if (dragging) {
            var rect = videoContainer.getBoundingClientRect(),
                position = ((e.pageX - rect.left) / videoContainer.offsetWidth) * 100;
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
    let videoL = document.getElementById("video-left")
    let videoR = document.getElementById("video-right");
    let backBtn = document.getElementById("backBtn");
    let playBtn = document.getElementById("playBtn");
    let playIcon = document.getElementById("playIcon");
    let forwardBtn = document.getElementById("forwardBtn");
    let frameTime = 1 / 25 //fps = 25

    function seek() {
        videoR.currentTime = videoL.currentTime;
    }

    videoL.addEventListener("seeked", () => {
        window.webkitRequestAnimationFrame(seek);
    });

    videoL.addEventListener("play", function() {
        videoR.play();
        videoR.currentTime = this.currentTime;
    });

    videoL.addEventListener("pause", function() {
        videoR.pause();
        videoR.currentTime = this.currentTime;
    });

    playBtn.onclick = function() {
        if (videoL.paused) {
            videoL.play();
            playIcon.setAttribute("class", "bi bi-pause");
        } else {
            videoL.pause();
            playIcon.setAttribute("class", "bi bi-play");
        }
        // for (video of videoWidgets) {
        //     if (video.paused) {
        //         video.play();
        //         console.log("apretado:" + playIcon);
        //         playIcon.setAttribute("class", "bi bi-pause");
        //     } else {
        //         video.pause();
        //         playIcon.setAttribute("class", "bi bi-play");
        //     }
        // }
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