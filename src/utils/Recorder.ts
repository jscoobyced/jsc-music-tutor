export interface RecorderData {
  audioData: Blob;
  audioUrl: string;
  play: () => Promise<void>
}

export default class AudioRecorder {

  private mediaRecorder: MediaRecorder = null as unknown as MediaRecorder;
  private audioChunks: Blob[] = [];

  initialize = () => {
    return navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
          this.audioChunks.push(event.data);
        };
      });
  }

  start = () => {
    this.mediaRecorder.start();
  }

  stop = (): Promise<RecorderData> => {
    return new Promise(resolve => {
      this.mediaRecorder.onstop = () => {
        const audioData = new Blob(this.audioChunks);
        const audioUrl = URL.createObjectURL(audioData);
        const audio = new Audio(audioUrl);
        const play = (): Promise<void> => {
          audio.play();
          return new Promise<void>(resolve => {
            audio.onended = () => {
              resolve();
            };
          });
        };
        resolve({ audioData, audioUrl, play });
      };
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => {
        if (track.readyState === 'live') {
          track.stop();
        }
      });
    });
  }
}