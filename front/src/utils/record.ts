let mediaRecorder: MediaRecorder;
let audioData: Blob;
let url: string;

export const RecordVoice = async () => {
  if (mediaRecorder?.state === 'recording') {
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    console.log('recorder stop', mediaRecorder.state, mediaRecorder);
    mediaRecorder.removeEventListener('dataavailable', (ev) => {
      console.log('remove event listener: ', ev);
    });
    return;
  }
  window.URL.revokeObjectURL(url);
  releaseRecord();
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.addEventListener('dataavailable', (e) => {
    audioData = e.data;
  });
  mediaRecorder.start();
  console.log('recorder started', mediaRecorder.state, mediaRecorder);
};

export const StopRecord = () => {
  mediaRecorder.stop();
  console.log('recorder stop', mediaRecorder.state, mediaRecorder);
};

export const playRecord = () => {
  url = window.URL.createObjectURL(audioData);
  const audio = new Audio(url);
  audio.play();
};

export const releaseRecord = () => {
  window.URL.revokeObjectURL(url);
};
