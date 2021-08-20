// const { Body } = require("node-fetch");
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

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

    recorder = new MediaRecorder(stream, {mimeType: "video/webm"})
    
    recorder.ondataavailable = (event) => {
        videoFile = URL.createObjectURL(event.data)
        console.log(videoFile);
        video.srcObject = null;
        video.src = videoFile;
        video.loop =true;
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

const handleDownload = async () => {
    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();

    ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));
    
    await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");     // "-r", "60" -> 초당 60 프레임으로
    
    await ffmpeg.run("-i", "recording.webm", "-ss", "00:00:01", "-frames:v", "1", "thumbnail.jpg");     // "-frames:v", "1" -> 첫 프레임(한컷)의 스크릿샷을 찍음


    const mp4File = ffmpeg.FS("readFile", "output.mp4");
    const thimbFile = ffmpeg.FS("readFile", "thumbnail.jpg");

    const mp4Blob = new Blob([mp4File.buffer], {type: "video/mp4"});        // blob url은 url을 통해서 파일에 접근
    const thumbBlob = new Blob([thimbFile.buffer], {type: "image/jpg"});

    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);

    const a = document.createElement("a");
    a.href = mp4Url;
    a.download = "MyRecording.mp4";
    document.body.appendChild(a);
    a.click();
    
    const thumbA = document.createElement("a");
    thumbA.href = thumbUrl;
    thumbA.download = "MyThumbnail.jpg";
    document.body.appendChild(thumbA);
    thumbA.click();

    ffmpeg.FS("unlink", "recording.webm");
    ffmpeg.FS("unlink", "output.mp4");
    ffmpeg.FS("unlink", "thumbnail.jpg");

    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl);
    URL.revokeObjectURL(videoFile);
}


startBtn.addEventListener("click", handleStart);

