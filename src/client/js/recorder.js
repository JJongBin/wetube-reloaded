// const { Body } = require("node-fetch");
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");
const recordBox = document.getElementById("recordBox");

const recordBtn = recordBox.children[1];
// console.log(recordBtn)

const openRecordBox = () => {
    recordBox.children[0].classList.remove("hide");
    // recordBox.children[1].classList.remove("hide");
    recordBtn.innerText = "Close Recording";

    recordBtn.removeEventListener("click", openRecordBox)
    recordBtn.addEventListener("click", closeRecordBox)
}
const closeRecordBox = () => {
    recordBox.children[0].classList.add("hide");
    // recordBox.children[1].classList.add("hide");
    recordBtn.innerText = "Open Recording";

    recordBtn.removeEventListener("click", closeRecordBox)
    recordBtn.addEventListener("click", openRecordBox)
}


recordBtn.addEventListener("click", openRecordBox)




let stream;
let recorder;
let videoFile;

const files = {
    input: "recording.webm",
    output: "output.mp4",
    thumb: "thumbnail.jpg"
}

const downloadFile = (fileURL, fileName) => {
    const a = document.createElement("a");
    a.href = fileURL;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
}



const init = async() => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio: false, 
        video: {
            width: 1024, 
            height: 576,
        }
    });
    video.srcObject = stream;
    video.play();
}
init();


const handleStart = () => {
    actionBtn.innerText = "Stop Recoding";
    actionBtn.removeEventListener("click", handleStart);
    actionBtn.addEventListener("click", handleStop);

    recorder = new MediaRecorder(stream, {mimeType: "video/webm"})
    
    recorder.ondataavailable = (event) => {
        videoFile = URL.createObjectURL(event.data)
        // console.log(videoFile);
        video.srcObject = null;
        video.src = videoFile;
        video.loop =true;
        video.play();
    }
    recorder.start();
}

const handleStop = () => {
    actionBtn.innerText = "Download Recording";
    actionBtn.removeEventListener("click", handleStop);
    actionBtn.addEventListener("click", handleDownload);

    recorder.stop();
}

const handleDownload = async () => {
    actionBtn.removeEventListener("click", handleDownload);
    actionBtn.innerText = "Transcoding...";
    actionBtn.disabled = true;

    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();

    ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
    
    await ffmpeg.run("-i", files.input, "-r", "60", files.output);     // "-r", "60" -> 초당 60 프레임으로
    
    await ffmpeg.run("-i", files.input, "-ss", "00:00:01", "-frames:v", "1", files.thumb);     // "-frames:v", "1" -> 첫 프레임(한컷)의 스크릿샷을 찍음


    const mp4File = ffmpeg.FS("readFile", files.output);
    const thimbFile = ffmpeg.FS("readFile", files.thumb);

    const mp4Blob = new Blob([mp4File.buffer], {type: "video/mp4"});        // blob url은 url을 통해서 파일에 접근
    const thumbBlob = new Blob([thimbFile.buffer], {type: "image/jpg"});

    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);

    downloadFile(mp4Url, "MyRecording.mp4");

    downloadFile(thumbUrl, "MyThumbnail.jpg");


    ffmpeg.FS("unlink", files.input);
    ffmpeg.FS("unlink", files.output);
    ffmpeg.FS("unlink", files.thumb);

    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl);
    URL.revokeObjectURL(videoFile);

    actionBtn.disabled = false;
    actionBtn.innerText = "Record Again";
    actionBtn.addEventListener("click", handleStart);
}


actionBtn.addEventListener("click", handleStart);

