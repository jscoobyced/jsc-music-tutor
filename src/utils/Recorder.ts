export interface RecorderData {
  audioData: Blob;
  audioUrl: string;
  play: () => Promise<void>
}

export default class AudioRecorder {

  private audioContext: AudioContext = null as unknown as AudioContext;
  private analyserNode: AnalyserNode = null as unknown as AnalyserNode;
  private mediaRecorder: MediaRecorder = null as unknown as MediaRecorder;
  private gainNode: GainNode = null as unknown as GainNode;
  private frequencyStep = 23.4;
  private frequencies: number[] = [];

  initialize = () => {
    return navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioContext = new AudioContext({
          latencyHint: "playback",
          sampleRate: 48000
        });
        this.analyserNode = this.audioContext.createAnalyser();
        this.analyserNode.fftSize = 2048;
        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.value = 0;
        let source = this.audioContext.createMediaStreamSource(this.mediaRecorder.stream);
        source.connect(this.analyserNode);
        this.analyserNode.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);
      });
  }

  start = () => {
    this.mediaRecorder.start();
  }

  stop = (): Promise<number[]> => {
    return new Promise(resolve => {
      this.mediaRecorder.onstop = () => {
        let dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
        this.analyserNode.getByteFrequencyData(dataArray);
        let max = 0;
        dataArray.forEach((v, i) => {
          if (v > max) {
            max = v;
          }
        });
        dataArray.forEach((v, i) => {
          if (v > (max * .99)) {
            const frequency = (i + 1) * this.frequencyStep - this.frequencyStep / 2;
            this.frequencies.push(frequency);
            this.frequencies.push(v);
          }
        });
        resolve(this.frequencies);
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