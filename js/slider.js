window.addEventListener("load", function() {
    function trackLocation(e) {
        var rect = videoContainer.getBoundingClientRect(),
            position = ((e.pageX - rect.left) / videoContainer.offsetWidth) * 100;
        if (position <= 100) {
            videoClipper.style.width = position + "%";
            clippedVideo.style.width = (100 / position) * 100 + "%";
            clippedVideo.style.zIndex = 3;
            divider.style.left = position + "%";
            //dividerIcon.style.left = position + "%"
        }
    }
    var videoContainer = document.getElementById("video-compare-container"),
        videoClipper = document.getElementById("video-clipper"),
        clippedVideo = videoClipper.getElementsByTagName("video")[0],
        divider = document.getElementsByClassName("divider")[0];
    //dividerIcon = document.getElementsByClassName("dividerIcon")[0];
    videoClipper = document.getElementById("video-clipper");
    //videoContainer.addEventListener("dragstart", trackLocation, false);
    videoContainer.addEventListener("dragend", trackLocation, false);
    videoContainer.addEventListener("drag", trackLocation, false);
    //dividerIcon.addEventListener("drag", trackLocation, false);
    videoContainer.addEventListener("touchstart", trackLocation, false);
    videoContainer.addEventListener("touchmove", trackLocation, false);
    // video widgets
    let videoWidgets = document.getElementsByClassName("video-widget");
    let backBtn = document.getElementById("backBtn");
    let playBtn = document.getElementById("playBtn");
    let playIcon = document.getElementById("playIcon");
    let forwardBtn = document.getElementById("forwardBtn");
    let frameTime = 1 / 25 //fps = 25

    playBtn.onclick = function() {
        for (video of videoWidgets) {
            if (video.paused) {
                video.play();
                console.log("apretado:" + playIcon);
                playIcon.setAttribute("class", "bi bi-pause");
            } else {
                video.pause();
                playIcon.setAttribute("class", "bi bi-play");
            }
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

    function showDividerInfo() {
        $(".divider-info").text("Drag Slider to Compare");
    }

});