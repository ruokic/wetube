import getBlobDuration from "get-blob-duration";

const videoContainer = document.getElementById('jsVideoPlayer');
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const ctrl = document.getElementById("jsVideoControllers");
const playBtn = document.getElementById("jsPlayButton");
const timeBar = document.getElementById("videoTimeBar");
const volumeBtn = document.getElementById("jsVolumeButton");
const fullScrnBtn = document.getElementById("jsFullScreen");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("jsVolume");

const ctrlHandler = () => {
    const disappearance = () => {
      ctrl.style.opacity = "0";
      videoPlayer.style.cursor = "none";
    };
    ctrl.style.opacity = "1";
    videoPlayer.style.cursor = "auto";
    const timeoutId = setTimeout(disappearance, 5000);
    videoPlayer.addEventListener("mousemove", () => {
      clearTimeout(timeoutId);
      videoPlayer.addEventListener("mousemove", ctrlHandler);
    });
    videoPlayer.addEventListener("click", () => {
      clearTimeout(timeoutId);
      videoPlayer.addEventListener("click", ctrlHandler);
    });
  };

const registerView = () => {
    const videoId = window.location.href.split("/videos/")[1];
    fetch(`/api/${videoId}/view`, {
        method: "POST"
    });
}

const handlePlayClick = () => {
    if (videoPlayer.paused) {
        videoPlayer.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    else {
        videoPlayer.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

const spacebarHandler = (event) => {
    const { key } = event;
    if (key === " ") {
        handlePlayClick();
    }
  };

const handleVolumeClick = () => {
    if (videoPlayer.muted) {
        videoPlayer.muted = false;
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        volumeRange.value = videoPlayer.volume;
    }
    else {
        volumeRange.value = 0;
        videoPlayer.muted = true;
        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
}

const exitFullScreen = () => {
    if (document.exitFullscreen) {
        document.webkitExitFullscreen();
    }
    else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    }
    else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
    else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
    fullScrnBtn.innerHTML = '<i class="fas fa-expand"></i>';
    fullScrnBtn.removeEventListener("click", exitFullScreen);
    fullScrnBtn.addEventListener("click", goFullScreen);
}

const goFullScreen = () => {
    if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
    }
    else if (videoContainer.mozRequestFullScreen) {
        videoContainer.mozRequestFullScreen();
    }
    else if (videoContainer.webkitRequestFullscreen) {
        videoContainer.webkitRequestFullscreen();
    }
    else if (videoContainer.msRequestFullscreen) {
        videoContainer.msRequestFullscreen();
    }
    fullScrnBtn.innerHTML = '<i class="fas fa-compress"></i>';
    fullScrnBtn.removeEventListener("click", goFullScreen);
    fullScrnBtn.addEventListener("click", exitFullScreen);
}

const formatDate = (totalSeconds) => {
    const secondsNumber = parseInt(totalSeconds, 10);
    let hours = Math.floor(secondsNumber / 3600);
    let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
    let seconds = secondsNumber - hours * 3600 - minutes * 60;

    if (hours < 10) {
        hours = `0${hours}`;
    }
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }
    return `${hours}:${minutes}:${seconds}`;
}

const getCurrentTime = () => {
    currentTime.innerHTML = formatDate(Math.floor(videoPlayer.currentTime));
    timeBar.value = videoPlayer.currentTime;
}

const setTotalTime = async () => {
    const blob = await fetch(videoPlayer.src).then(response => response.blob());
    const duration = await getBlobDuration(blob);
    const totalTimeString = formatDate(duration);
    totalTime.innerHTML = totalTimeString;
    timeBar.max = videoPlayer.duration;
}

const timeBarHandler = () => {
    videoPlayer.currentTime = timeBar.value;
};

const handleEnded = () => {
    registerView();
    videoPlayer.currentTime = 0;
    playBtn.innerHTML = '<i class="fas fa-play></i>';
}

const handleVolumeDrag = (event) => {
    const { target: { value }} = event;
    videoPlayer.volume = value;
    if (value >= 0.6) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
    else if (value >= 0.2) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
    } 
    else {
        volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
    }
}

const init = () => {
    ctrlHandler();
    videoPlayer.volume = "0.5";
    playBtn.addEventListener("click", handlePlayClick);
    document.addEventListener("keydown", spacebarHandler);
    volumeBtn.addEventListener("click", handleVolumeClick);
    fullScrnBtn.addEventListener("click", goFullScreen);
    videoPlayer.addEventListener("loadedmetadata", setTotalTime);
    videoPlayer.addEventListener("timeupdate", getCurrentTime);
    videoPlayer.addEventListener("ended", handleEnded);
    volumeRange.addEventListener("input", handleVolumeDrag);
    videoPlayer.addEventListener("mousemove", ctrlHandler);
    videoPlayer.addEventListener("click", ctrlHandler);
    timeBar.addEventListener("change", timeBarHandler);
    setTimeout(setTotalTime, 1000);
}

if (videoContainer) {
    init();
}