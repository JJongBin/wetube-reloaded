const video = document.querySelector("video");

const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const videoContaner = document.getElementById("videoContaner");
const videoControls = document.getElementById("videoControls");


let controlsTimeout = null;
let controlsMove = null;
let volumeValue = 0.5
video.volume = volumeValue;

const handlePlayClick = (e) => {
    // if the video is plating, pause it
    // else play the video
    if(video.paused) {
        video.play();
    } else {
        video.pause();
    }
playBtn.innerText = video.paused ? "Play" : "Pause";
}


const handleMute = (e) => {
    if (video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
    
muteBtn.innerText = video.muted ? "Unmute" : "Mute";
volumeRange.value = video.muted ? "0" : volumeValue;
}

const handleVolumeChange = (event) => {
    const {target: {value}} = event;
    
    if (video.muted) {
        video.muted = false;
        muteBtn.innerText = "Mute";
    }
    volumeValue = value;
    video.volume = value;
}


const formatTime = (seconds) => new Date(seconds*1000).toISOString().substr(11, 8);

const handleLoadedMetadata = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);

}

const handleTimeUpdate = () => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
}

const handleTimelineChange = (event) => {
    const {target: {value}} = event;
    video.currentTime = value;
}

const handelFullscreen = () => {
    const fullscreen = document.fullscreenElement;
    if (fullscreen) {
        document.exitFullscreen();
        fullScreenBtn.innerText = "Enter Full Screen"
    } else {
        videoContaner.requestFullscreen();
        fullScreenBtn.innerText = "Exit Full Screen"
    }
}

const hideControls = () => {
    videoControls.classList.remove("show");
}

const handleMouseMove = () => {
    if (controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    if (controlsMove) {
        clearTimeout(controlsMove);
        controlsMove = null;
    }
    videoControls.classList.add("show");
    controlsMove = setTimeout(hideControls,3000);
}

const handleMouseLeave = () => {
    controlsTimeout = setTimeout(hideControls, 3000);
}





playBtn.addEventListener("click", handlePlayClick);

muteBtn.addEventListener("click", handleMute);;
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handelFullscreen);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);


