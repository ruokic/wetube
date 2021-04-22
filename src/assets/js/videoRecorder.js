const recorderContainer = document.getElementById("jsRecordContainer");
const recorderBtn = document.getElementById("jsRecordBtn");
const videoPreview = document.getElementById("jsVideoPreview");

let streamObject;
let videoRecorder;

const handleVideoData = (event) => {
    const { data: videoFile } = event;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(videoFile);
    link.download = "recorded.webm";
    document.body.appendChild(link);
    link.click();
}

const stopRecording = () => {
    videoRecorder.stop();
    recorderBtn.removeEventListener("click", stopRecording);
    recorderBtn.addEventListener("click", getVideo);
    recorderBtn.innerHTML = "Start Recording";
}

const startRecording = () => {
    videoRecorder = new MediaRecorder(streamObject);
    videoRecorder.start();
    videoRecorder.addEventListener("dataavailable", handleVideoData);
    recorderBtn.addEventListener("click", stopRecording);
}

const getVideo = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: { width: 1280, height: 720 }
        });
        videoPreview.srcObject = stream;
        videoPreview.muted = true;
        videoPreview.play();
        recorderBtn.innerHTML = "Stop Recording";
        streamObject = stream;
        startRecording();
    } catch (error) {
        recorderBtn.innerHTML = "☹️ Can't Record";
    } finally {
        recorderBtn.removeEventListener("click", getVideo);
    }
}

const init = () => {
    recorderBtn.addEventListener("click", getVideo);
}

if (recorderContainer) {
    init();
}