window.addEventListener("load", function() {
    function trackLocation(e) {
        var rect = videoContainer.getBoundingClientRect(),
            position = ((e.pageX - rect.left) / videoContainer.offsetWidth) * 100;
        if (position <= 100) {
            videoClipper.style.width = position + "%";
            clippedVideo.style.width = (100 / position) * 100 + "%";
            clippedVideo.style.zIndex = 3;
            divider.style.left = position + "%";
        }
    }
    var videoContainer = document.getElementById("video-compare-container"),
        videoClipper = document.getElementById("video-clipper"),
        clippedVideo = videoClipper.getElementsByTagName("video")[0],
        divider = document.getElementsByClassName("divider")[0];
    videoClipper = document.getElementById("video-clipper"),
        videoContainer.addEventListener("mousemove", trackLocation, false);
    videoContainer.addEventListener("touchstart", trackLocation, false);
    videoContainer.addEventListener("touchmove", trackLocation, false);
    // video widgets
    let videoWidgets = document.getElementsByClassName("video-widget");
    var playBtn = document.getElementById("playBtn");
    var pauseBtn = document.getElementById("pauseBtn");
    var restartBtn = document.getElementById("restartBtn");

    pauseBtn.onclick = function() {
        for (video of videoWidgets) {
            video.pause();
        }
    };

    playBtn.onclick = function() {
        for (video of videoWidgets) {
            video.play();
        }
    };

    restartBtn.onclick = function() {
        for (video of videoWidgets) {
            video.pause();
            video.currentTime = 0;
            video.play();
        }
    };
});