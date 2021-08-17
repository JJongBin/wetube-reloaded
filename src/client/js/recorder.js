const { Body } = require("node-fetch");

const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");


let stream;
let recorder;
let videoFile;


const init = async() => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio: false, 
        video: true
    });
    video.srcObject = stream;
    video.play();
}
init();


const handleStart = () => {
    startBtn.innerText = "Stop Recoding";
    startBtn.removeEventListener("click", handleStart);
    startBtn.addEventListener("click", handleStop);

    recorder = new MediaRecorder(stream)
    
    recorder.ondataavailable = (event) => {
        videoFile = URL.createObjectURL(event.data)
        video.srcObject = null;
        video.src = videoFile;
        video,loop =true;
        video.play();
    }
    recorder.start();
}

const handleStop = () => {
    startBtn.innerText = "Download Recording";
    startBtn.removeEventListener("click", handleStop);
    startBtn.addEventListener("click", handleDownload);

    recorder.stop();
}

const handleDownload = () => {
    const a = document.createElement("a");
    a.href = videoFile;
    a.download = "MyRecording.webm";
    document.body.appendChild(a);
    a.click();
}


startBtn.addEventListener("click", handleStart);

